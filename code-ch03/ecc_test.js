const ecc = require('./ecc.js');
var assert = require('assert');
var expect = require('expect');

const FieldElement = ecc.FieldElement;
const Point = ecc.Point;

describe('FieldElement', function() {
    describe('#rmul()', function() {
        it('should rmul coefficient', function() {
            let fieldElement1 = new FieldElement(24, 31);
            let coefficient = 2;
            assert.deepEqual(fieldElement1.rmul(coefficient), fieldElement1.add(fieldElement1));
        });
    });
});

describe('ECC', function() {
    describe('on curve', function() {
        it('should validate Point of FieldElement', function() {
            let prime = 223;
            let a = new FieldElement(0, prime);
            let b = new FieldElement(7, prime);
            let validPoints = [[192, 105], [17, 56], [1, 193]];
            let invalidPoints = [[200, 119], [42, 99]];
            validPoints.forEach(function(pair) {
                let x = new FieldElement(pair[0], prime);
                let y = new FieldElement(pair[1], prime);
                new Point(x, y, a, b);
            });
            invalidPoints.forEach(function(pair) {
                let x = new FieldElement(pair[0], prime);
                let y = new FieldElement(pair[1], prime);
                assert.throws(() => new Point(x, y, a, b));
            });
        });
    });
    describe('add', function() {
        it('should add Points of FieldElement', function() {
            let prime = 223;
            let a = new FieldElement(0, prime);
            let b = new FieldElement(7, prime);
            let additions = [
                             [192, 105, 17, 56, 170, 142],
                             [47, 71, 117, 141, 60, 139],
                             [143, 98, 76, 66, 47, 71]
                            ];
            additions.forEach(function(sixer) {
                let x1 = new FieldElement(sixer[0], prime);
                let y1 = new FieldElement(sixer[1], prime);
                let point1 = new Point(x1, y1, a, b);
                let x2 = new FieldElement(sixer[2], prime);
                let y2 = new FieldElement(sixer[3], prime);
                let point2 = new Point(x2, y2, a, b);
                let x3 = new FieldElement(sixer[4], prime);
                let y3 = new FieldElement(sixer[5], prime);
                let point3 = new Point(x3, y3, a, b);
                assert.deepEqual(point1.add(point2), point3);
            })
        });
    });
});