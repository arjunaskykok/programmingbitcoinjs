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
});
