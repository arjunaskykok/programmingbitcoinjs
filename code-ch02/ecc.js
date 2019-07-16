const inspect = Symbol.for('nodejs.util.inspect.custom');
const _ = require('lodash');

function mod(n, m) {
    return ((n % m) + m) % m;
}

class FieldElement {
    constructor(num, prime) {
        if (num >= prime || num < 0) {
            let error = `Num ${num} not in field range 0 to ${prime -1}`;
            throw new Error(error);
        }
        this.num = num;
        this.prime = prime;
    }

    add(other) {
        if (this.prime !== other.prime) {
            throw new Error("Cannot add two numbers in different Fields")
        }
        let num = mod(this.num + other.num, this.prime);
        return new FieldElement(num, this.prime);
    }

    sub(other) {
        if (this.prime !== other.prime) {
            throw new Error("Cannot subtract two numbers in different Fields")
        }
        let num = mod(this.num - other.num, this.prime);
        return new FieldElement(num, this.prime);
    }

    mul(other) {
        if (this.prime !== other.prime) {
            throw new Error("Cannot multiply two numbers in different Fields")
        }
        let num = mod(this.num * other.num, this.prime);
        return new FieldElement(num, this.prime);
    }

    pow(power) {
        let num = mod(Math.pow(this.num, power), this.prime);
        return new FieldElement(num, this.prime);
    }

    div(other) {
        if (this.prime !== other.prime) {
            throw new Error("Cannot divide two numbers in different Fields")
        }
        let num = mod(this.num * mod(Math.pow(other.num, this.prime - 2), this.prime), this.prime)
        return new FieldElement(num, this.prime);
    }
}

module.exports = class Point {

    constructor(x, y, a, b) {
        this.x = x;
        this.y = y;
        this.a = a;
        this.b = b;

        if (this.x === null && this.y === null) {
            return;
        }

        if (Math.pow(this.y, 2) !== Math.pow(this.x, 3) + a * x + b) {
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
        if (this.a !== other.a || this.b !== other.b) {
            let error = `Points ${this}, ${other} is not on the curve.`;
            throw new Error(error);
        }

        if (this.x === null) {
            return other;
        }

        if (other.x === null) {
            return this;
        }

        if (this.x === other.x && this.y !== other.y) {
            return new Point(null, null, this.a, this.b);
        }

        if (this.x !== other.x) {
            let s = (other.y - this.y) / (other.x - this.x);
            let x = Math.pow(s, 2) - this.x - other.x;
            let y = s * (this.x - x) - this.y;
            return new Point(x, y, this.a, this.b);
        }

        if (_.isEqual(this, other) && this.y === 0) {
            return new Point(null, null, this.a, this.b);
        }

        if (_.isEqual(this, other)) {
            let s = (3 * Math.pow(this.x, 2) + this.a) / (2 * this.y);
            let x = Math.pow(s, 2) - 2 * this.x;
            let y = s * (this.x - x) - this.y;
            return new Point(x, y, this.a, this.b);
        }
    }
}