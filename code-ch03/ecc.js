const inspect = Symbol.for('nodejs.util.inspect.custom');
const _ = require('lodash');
const bigInt = require('big-integer');

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
        return `FieldElement_${this.num}(${this.prime})`;
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
        let big_power = bigInt(power);
        let exponent = mod(big_power, this.prime.subtract(1));
        let num = mod(this.num.pow(exponent), this.prime);
        return new FieldElement(num, this.prime);
    }

    divide(other) {
        if (!_.isEqual(this.prime, other.prime)) {
            throw new Error("Cannot divide two numbers in different Fields")
        }
        let num = mod(this.num.multiply(mod(other.num.pow(this.prime.subtract(2)), this.prime)), this.prime)
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

        if (!_.isEqual(this.y.pow(2), this.x.pow(3).add(x.multiply(a)).add(b))) {
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
            let x = s.pow(2).subtract(this.x).subtract(other.x);
            let y = s.multiply(this.x.subtract(x)).subtract(this.y);
            return new Point(x, y, this.a, this.b);
        }

        if (_.isEqual(this, other) && _.isEqual(this.y, this.x.rmul(0))) {
            return new Point(null, null, this.a, this.b);
        }

        if (_.isEqual(this, other)) {
            let s = (this.x.pow(2).rmul(3).add(this.a)).divide(this.y.rmul(2));
            let x = s.pow(2).subtract(this.x.rmul(2));
            let y = s.multiply(this.x.subtract(x)).subtract(this.y);
            return new Point(x, y, this.a, this.b);
        }
    }

    rmul(coefficient) {
        var coef = coefficient;
        var current = this;
        var result = new Point(null, null, this.a, this.b)
        while (coef) {
            if (coef & 1) {
                result = result.add(current)
            }
            current = current.add(current)
            coef = coef >> 1;
        }
        return result;
    }
}

exports.FieldElement = FieldElement;
exports.Point = Point;