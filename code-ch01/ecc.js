function mod(n, m) {
    return ((n % m) + m) % m;
}

module.exports = class FieldElement {
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
}

