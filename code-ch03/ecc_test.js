const ecc = require('./ecc.js');
const assert = require('assert');
const bigInt = require('big-integer');

const FieldElement = ecc.FieldElement;
const Point = ecc.Point;

const S256Field = ecc.S256Field;
const S256Point = ecc.S256Point;
const Signature = ecc.Signature;
const G = ecc.G;
const N = ecc.N;

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

describe('S256Point', function() {
    describe('order', function() {
        it('should test order of group', function() {
            let point = G.rmul(N);
            assert.equal(point.x, null);
        });
    });

    describe('public point', function() {
        it('should make sure public point is secret times Group', function() {
            let points = [
                [bigInt(7), bigInt("5cbdf0646e5db4eaa398f365f2ea7a0e3d419b7e0330e39ce92bddedcac4f9bc", 16), bigInt("6aebca40ba255960a3178d6d861a54dba813d0b813fde7b5a5082628087264da", 16)],
                [bigInt(1485), bigInt("c982196a7466fbbbb0e27a940b6af926c1a74d5ad07128c82824a11b5398afda", 16), bigInt("7a91f9eae64438afb9ce6448a1c133db2d8fb9254e4546b6f001637d50901f55", 16)],
                [bigInt(2).pow(bigInt(128)), bigInt("8f68b9d2f63b5f339239c1ad981f162ee88c5678723ea3351b7b444c9ec4c0da", 16), bigInt("662a9f2dba063986de1d90c2b6be215dbbea2cfe95510bfdf23cbf79501fff82", 16)],
                [bigInt(2).pow(bigInt(240)).add(bigInt(2).pow(bigInt(31))), bigInt("9577ff57c8234558f293df502ca4f09cbc65a6572c842b39b366f21717945116", 16), bigInt("10b49c67fa9365ad7b90dab070be339a1daf9052373ec30ffae4f72d5e66d053", 16)]
            ];
            points.forEach(function(point) {
                let [secret, x, y] = point;
                let s256point = new S256Point(x, y);
                assert.deepEqual(G.rmul(secret), s256point);
            });
        });
    });
});