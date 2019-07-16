const Point = require('./ecc.js');
var assert = require('assert');


describe('Point', function() {
    describe('#equals()', function() {
        it('should equal for same Point', function() {
            let point1 = new Point(3, -7, 5, 7);
            let point2 = new Point(3, -7, 5, 7);
            assert.deepEqual(point1, point2);
        });
    });
    describe('#not equals()', function() {
        it('should not equal for different Point', function() {
            let point1 = new Point(3, -7, 5, 7);
            let point2 = new Point(18, 77, 5, 7);
            assert.notDeepEqual(point1, point2);
        });
    });
    describe('#add0()', function() {
        it('should add Point', function() {
            let point1 = new Point(null, null, 5, 7);
            let point2 = new Point(2, 5, 5, 7);
            let point3 = new Point(2, -5, 5, 7);
            assert.deepEqual(point1.add(point2), point2);
            assert.deepEqual(point2.add(point1), point2);
            assert.deepEqual(point2.add(point3), point1);
        });
    });
    describe('#add1()', function() {
        it('should add Point', function() {
            let point1 = new Point(3, 7, 5, 7);
            let point2 = new Point(-1, -1, 5, 7);
            let result = new Point(2, -5, 5, 7);
            assert.deepEqual(point1.add(point2), result);
        });
    });
    describe('#add2()', function() {
        it('should add Point', function() {
            let point1 = new Point(-1, -1, 5, 7);
            let result = new Point(18, 77, 5, 7)
            assert.deepEqual(point1.add(point1), result);
        });
    });
});