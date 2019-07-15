const FieldElement = require('./ecc.js');
var assert = require('assert');

describe('FieldElement', function() {
    describe('#equals()', function() {
        it('should equals for same FieldElement', function() {
            let fieldElement1 = new FieldElement(2, 4);
            let fieldElement2 = new FieldElement(2, 4);
            assert.deepEqual(fieldElement1, fieldElement2);
        });
    });
    describe('#add()', function() {
        it('should add FieldElement', function() {
            let fieldElement1 = new FieldElement(2, 4);
            let fieldElement2 = new FieldElement(3, 4);
            let resultFieldElement = new FieldElement(1, 4);
            assert.deepEqual(fieldElement1.add(fieldElement2), resultFieldElement);
        });
    });
    describe('#sub()', function() {
        it('should subtract FieldElement', function() {
            let fieldElement1 = new FieldElement(2, 4);
            let fieldElement2 = new FieldElement(3, 4);
            let resultFieldElement = new FieldElement(3, 4);
            assert.deepEqual(fieldElement1.sub(fieldElement2), resultFieldElement);
        });
    });
    describe('#mul()', function() {
        it('should multiply FieldElement', function() {
            let fieldElement1 = new FieldElement(24, 31);
            let fieldElement2 = new FieldElement(19, 31);
            let resultFieldElement = new FieldElement(22, 31);
            assert.deepEqual(fieldElement1.mul(fieldElement2), resultFieldElement);
        });
    });
    describe('#pow()', function() {
        it('should power a number', function() {
            let fieldElement1 = new FieldElement(17, 31);
            let power = 3;
            let resultFieldElement = new FieldElement(15, 31);
            assert.deepEqual(fieldElement1.pow(power), resultFieldElement);
        });
    });
});
