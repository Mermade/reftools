const should = require('should');
const deref = require('../lib/dereference.js').dereference;

const input = JSON.parse(`
{
  "usage": {
    "one": {
      "$ref": "#/definitions/shared"
    },
    "two": {
      "$ref": "#/definitions/shared"
    }
  },
  "definitions": {
    "shared": {
      "container": "value"
    }
  }
}
`);

const toplevel = JSON.parse(`
{
    "$ref": "#/definitions/referee"
}
`);

const lib = JSON.parse(`
{
    "definitions": {
        "referee": {
            "data": 123
        }
    }
}
`);

describe('dereference',function(){
    describe('simple',function(){
        it('should dereference an object with $refs',function(){
            let output = deref(input,{});
            output.usage.one.should.equal(input.definitions.shared);
            output.usage.two.should.equal(input.definitions.shared);
        });
    });
    describe('simple',function(){
        this.timeout(500);
        it('should dereference an object with a top level $ref',function(){
            let output = deref(toplevel,lib);
            output.data.should.equal(123);
        });
    });
});
