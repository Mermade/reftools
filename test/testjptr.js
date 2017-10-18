'use strict';

const should = require('should');

const jptr = require('../lib/jptr.js').jptr;

const obj = {
    self : null,
    name : 'obj',
    'x/y': 'x',
    '~': 'tilde',
    '#': {
      '': true
    },
    '400WithDocument': true,
    children : [
        {
            $ref: '#/definitions/Child'
        },
        {
            name: 'SecondChild',
            age: 4
        }
    ],
    definitions: {
        Child: {
            name: 'FirstChild',
            age: 6
        },
        '-': {
            value: true
        }
    }
};
obj.self = obj;

describe('JSON Pointer tests',function(){

describe('Custom and negative tests',function(){
    it('should pass',function(){
should(jptr(obj,'#/self')).be.equal(obj);
should(jptr(obj,'#/self/name')).be.equal('obj');
should(jptr(obj,'#/name')).be.equal('obj');
should(jptr(obj,'#/name/-')).be.equal(false); // it's not an array
should(jptr(obj,'#/name/0')).be.equal('o'); // undefined by the spec?
should(jptr(obj,'#/name/-','*')).be.equal(false);
should(jptr(obj,'#/name')).be.equal('obj'); // strings are immutable as arrays
should(jptr(obj,'#/name','obj*')).be.equal('obj*'); // string properties are mutable
should(jptr(obj,'#/name')).be.equal('obj*');
should(jptr(obj,'#/age')).be.equal(false);
should(jptr(obj,'#/x/y')).be.equal(false);
should(jptr(obj,'#/x~1y')).be.equal('x');
should(jptr(obj,'#/~')).be.equal('tilde'); // undefined by the spec
should(jptr(obj,'#/~0')).be.equal('tilde');
should(jptr(obj,'#/children')).be.equal(obj.children);
should(jptr(obj,'#/children/1/name')).be.equal('SecondChild');
should(jptr(obj,'#/children/0/$ref')).be.equal('#/definitions/Child');
should(jptr(obj,'#/children/2')).be.equal(undefined);
should(jptr(obj,'#/children/-')).be.equal(undefined);
should(jptr(obj,'#/children/-','baby')).be.equal('baby');
should(jptr(obj,'#/children/2')).be.equal('baby');
should(jptr(obj,'#/400WithDocument')).be.equal(true);
should(jptr(obj,'#/definitions/-/value')).be.equal(true);

should(jptr(obj,'#/not/there/yet','hello')).be.equal('hello');
should(jptr(obj,'#/not/there/yet')).be.equal('hello');
});
});

const rfc6901 = {
    "foo": ["bar", "baz"],
    "": 0,
    "a/b": 1,
    "c%d": 2,
    "e^f": 3,
    "g|h": 4,
    "i\\j": 5,
    "k\"l": 6,
    " ": 7,
    "m~n": 8
};

describe('JSON Pointer tests from RFC6901',function(){
    it('should pass',function(){
        should(jptr(rfc6901,'')).equal(rfc6901);
        should(jptr(rfc6901,'/foo')).equal(rfc6901.foo)
        should(jptr(rfc6901,'/foo/0')).equal('bar');
        should(jptr(rfc6901,'/')).equal(0);
        should(jptr(rfc6901,'/a~1b')).equal(1);
        should(jptr(rfc6901,'/c%d')).equal(2);
        should(jptr(rfc6901,'/e^f')).equal(3);
        should(jptr(rfc6901,'/g|h')).equal(4);
        should(jptr(rfc6901,'/i\\j')).equal(5);
        should(jptr(rfc6901,'/k\"l')).equal(6);
        should(jptr(rfc6901,'/ ')).equal(7);
        should(jptr(rfc6901,'/m~0n')).equal(8);
    });
});

describe('JSON Reference tests from RFC6901',function(){
    it('should pass',function(){
should(jptr(rfc6901,'#')).equal(rfc6901);
should(jptr(rfc6901,'#/foo')).equal(rfc6901.foo);
should(jptr(rfc6901,'#/foo/0')).equal('bar');
should(jptr(rfc6901,'#/')).equal(0);
should(jptr(rfc6901,'#/a~1b')).equal(1);
should(jptr(rfc6901,'#/c%25d')).equal(2);
should(jptr(rfc6901,'#/e%5Ef')).equal(3);
should(jptr(rfc6901,'#/g%7Ch')).equal(4);
should(jptr(rfc6901,'#/i%5Cj')).equal(5);
should(jptr(rfc6901,'#/k%22l')).equal(6);
should(jptr(rfc6901,'#/%20')).equal(7);
should(jptr(rfc6901,'#/m~0n')).equal(8);
    });
});

describe('endpointer related tests',function(){
    it('should handle /#/',function(){
        should(jptr(obj,'/#/')).equal(false); // this is an external reference to the uri /
        should(jptr(obj,'#/%23/')).equal(true); // %encode the # in the fragment
    });
});

});
