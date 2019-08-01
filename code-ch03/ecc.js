const inspect = Symbol.for('nodejs.util.inspect.custom');
const _ = require('lodash');
const bigInt = require('big-integer');
const crypto = require('crypto');

function mod(n, m) {
    return ((n.remainder(m)).add(m)).remainder(m);
}

class FieldElement {
    constructor(num, prime) {
        if (num >= prime || num < 0) {
            let error = `Num ${num} not in field range 0 to ${prime -1}`;
            throw new Error(error);
        }
        this.num = bigInt(num);
        this.prime = bigInt(prime);
    }

    [inspect]() {
        return this.toString();
    }

    toString() {
        return `FieldElement_${this.num}(${this.prime})`;
    }

    add(other) {
        if (!_.isEqual(this.prime, other.prime)) {
            throw new Error("Cannot add two numbers in different Fields")
        }
        let num = mod(this.num.add(other.num), this.prime);
        return new FieldElement(num, this.prime);
    }

    subtract(other) {
        if (!_.isEqual(this.prime, other.prime)) {
            throw new Error("Cannot subtract two numbers in different Fields")
        }
        let num = mod(this.num.subtract(other.num), this.prime);
        return new FieldElement(num, this.prime);
    }

    multiply(other) {
        if (!_.isEqual(this.prime, other.prime)) {
            throw new Error("Cannot multiply two numbers in different Fields")
        }
        let num = mod(this.num.multiply(other.num), this.prime);
        return new FieldElement(num, this.prime);
    }

    pow(power) {
        let exponent = mod(bigInt(power), this.prime.subtract(bigInt(1)));
        let num = mod(this.num.pow(exponent), this.prime);
        return new FieldElement(num, this.prime);
    }

    divide(other) {
        if (!_.isEqual(this.prime, other.prime)) {
            throw new Error("Cannot divide two numbers in different Fields")
        }
        let modPowResult = other.num.modPow(this.prime.subtract(bigInt(2)), this.prime);
        let fieldElementModPowResult = new FieldElement(modPowResult, this.prime);
        let num = mod((mod(fieldElementModPowResult.rmul(this.num).num, this.prime)), this.prime);
        return new FieldElement(num, this.prime);
    }

    rmul(coefficient) {
        let num = mod(this.num.multiply(coefficient), this.prime);
        return new FieldElement(num, this.prime);
    }
}

class Point {

    constructor(x, y, a, b) {
        this.x = x;
        this.y = y;
        this.a = a;
        this.b = b;

        if (this.x === null && this.y === null) {
            return;
        }

        if (!_.isEqual(this.y.pow(bigInt(2)), this.x.pow(bigInt(3)).add(x.multiply(a)).add(b))) {
            let error = `(${x}, ${y}) is not on the curve.`;
            throw new Error(error);
        }
    }

    [inspect]() {
        if (this.x === null) {
            return 'Point(infinity)';
        }
        return `Point(${this.x},${this.y})_${this.a}_${this.b}`;
    }

    add(other) {
        if (!_.isEqual(this.a, other.a) || !_.isEqual(this.b, other.b)) {
            let error = `Points ${this}, ${other} is not on the curve.`;
            throw new Error(error);
        }

        if (this.x === null) {
            return other;
        }

        if (other.x === null) {
            return this;
        }

        if (_.isEqual(this.x, other.x) && !_.isEqual(this.y, other.y)) {
            return new Point(null, null, this.a, this.b);
        }

        if (!_.isEqual(this.x, other.x)) {
            let s = (other.y.subtract(this.y)).divide(other.x.subtract(this.x));
            let x = (s.pow(2)).subtract(this.x).subtract(other.x);
            let y = (s.multiply(this.x.subtract(x))).subtract(this.y);
            return new Point(x, y, this.a, this.b);
        }

        if (_.isEqual(this, other) && _.isEqual(this.y, this.x.rmul(0))) {
            return new Point(null, null, this.a, this.b);
        }

        if (_.isEqual(this, other)) {
            let s = (this.x.pow(2).rmul(3).add(this.a)).divide(this.y.rmul(2));
            let x = (s.pow(2)).subtract(this.x.rmul(2));
            let y = (s.multiply(this.x.subtract(x))).subtract(this.y);
            return new Point(x, y, this.a, this.b);
        }
    }

    rmul(coefficient) {
        var coef = coefficient;
        var current = this;
        var result = new Point(null, null, this.a, this.b);
        while (coef.greater(0)) {
            if (coef.and(1).greater(0)) {
                result = result.add(current);
            }
            current = current.add(current);
            coef = coef.shiftRight(1);
        }
        return result;
    }
}

let A = bigInt(0);
let B = bigInt(7);
let P = (bigInt(2).pow(bigInt(256)).subtract(bigInt(2).pow(bigInt(32)))).subtract(bigInt(977)); // 2**256 - 2**32 - 977
let N = bigInt("fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141", 16);

class S256Field extends FieldElement {
    constructor(num, prime) {
        super(num, P);
    }

    [inspect]() {
        return this.toString();
    }

    toString() {
        return ("0000000000000000000000000000000000000000000000000000000000000000" + this.num.toString(16)).slice(-64);
    }
}

class Signature {
    constructor(r, s) {
        this.r = r;
        this.s = s;
    }

    [inspect]() {
        return this.toString();
    }

    toString() {
        return `Signature(${this.r}, ${this.s})`;
    }
}

class S256Point extends Point {
    constructor(_x, _y, _a, _b) {
        let a = new S256Field(A);
        let b = new S256Field(B);

        var x = null;
        var y = null;
        if (_x.constructor.name === "Integer") {
            x = new S256Field(_x);
            y = new S256Field(_y);
        } else {
            x = _x;
            y = _y;
        }

        super(x, y, a, b);
    }

    [inspect]() {
        return this.toString();
    }

    toString() {
        if (this.x === null) {
            return 'S256Point(infinity)';
        } else {
            return `S256Point(${this.x}, ${this.y})`;
        }
    }

    rmul(coefficient) {
        var coef = mod(bigInt(coefficient), N);
        return super.rmul(coef);
    }

    verify(z, sig) {
        let s_inv = mod(sig.s.modPow(N.subtract(2), N), N);
        let u = mod(bigInt(z).multiply(s_inv), N);
        let v = mod(sig.r.multiply(s_inv), N);
        let total = (G.rmul(u)).add(this.rmul(v));
        return _.isEqual(total.x.num, sig.r);
    }
}

let G = new S256Point(
    bigInt("79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798", 16),
    bigInt("483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8", 16));

class PrivateKey {
    constructor(secret) {
        this.secret = secret;
        let tpoint = G.rmul(secret);
        this.point = new S256Point(tpoint.x, tpoint.y, null, null);
    }

    hex() {
        return ("0000000000000000000000000000000000000000000000000000000000000000" + this.secret.toString(16)).slice(-64);
    }

    sign(z) {
        let k = this.deterministic_k(z);
        let r = G.rmul(k).x.num;
        let k_inv = mod(k.modPow(N.subtract(2), N), N);
        let s = mod((z.add(this.secret.multiply(r))).multiply(k_inv), N);
        if (s.greater(N.divide(2))) {
            s = N.subtract(s);
        }
        return new Signature(r, s);
    }

    deterministic_k(z) {
        let n = bigInt(Math.floor(Math.random() * N.toJSNumber()));
        return n;
        /*
        var k = Buffer.alloc(32);
        var v = Buffer.alloc(32, 1);
        if (z.greater(N)) {
            z = z.subtract(N);
        }
        let hex_z = z.toString(16);
        let buffer_hex_z = Buffer.from(hex_z, 'hex');
        let buffer_hex_z_length = buffer_hex_z.length;
        var bytes_z = Buffer.alloc(32);
        bytes_z.writeUIntBE(buffer_hex_z, 32 - buffer_hex_z_length);
        let hex_s = this.secret.toString(16);
        let buffer_hex_s = Buffer.from(hex_s, 'hex');
        let buffer_hex_s_length = buffer_hex_s.length;
        var bytes_s = Buffer.alloc(32);
        bytes_s.writeUIntBE(buffer_hex_s, 32 - buffer_hex_s_length);

        var hmac = crypto.createHmac('sha256', k);
        hmac.update(v + Buffer.alloc(1, 1) + bytes_s + bytes_z);
        k = hmac.digest();
        hmac = crypto.createHmac('sha256', k);
        hmac.update(v, 's256');
        v = hmac.digest();
        hmac = crypto.createHmac('sha256', k);
        hmac.update(v + Buffer.alloc(1, 1) + bytes_s + bytes_z);
        k = hmac.digest();
        hmac = crypto.createHmac('sha256', k);
        hmac.update(v, 's256');
        v = hmac.digest();
        var candidate = null;
        while (true) {
            hmac = crypto.createHmac('sha256', k);
            hmac.update(v, 's256');
            v = hmac.digest();
        }
        return hmac.digest();
        */
    }
}

exports.FieldElement = FieldElement;
exports.Point = Point;
exports.S256Field = S256Field;
exports.S256Point = S256Point;
exports.Signature = Signature;
exports.G = G;
exports.N = N;
exports.PrivateKey = PrivateKey;