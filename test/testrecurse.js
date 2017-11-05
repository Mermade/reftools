'use strict';
const should = require('should');
const recurse = require('../lib/recurse.js').recurse;

describe('recurse',function(){
    describe('simple',function(){
        it('should traverse a simple nested object',function(){

            const input = { container: { child: { value: true, string: '1234' } } };
            let output = [];
            recurse(input,{},function(obj,key,state){
                let entry = {};
                entry.obj = obj;
                entry.key = key;
                entry.state = state;
                output.push(entry);
            });

            output.should.be.an.Array();
            should(output.length).equal(4);
            output[0].key.should.equal('container');
            output[0].obj.should.equal(input);
            output[0].state.depth.should.equal(0);
            output[0].state.path.should.equal('#');
            output[0].state.parent.should.deepEqual({});

            output[1].key.should.equal('child');
            output[1].obj.should.equal(input.container);
            output[1].state.depth.should.equal(1);
            output[1].state.path.should.equal('#/container');
            output[1].state.parent.should.equal(input);

            output[2].key.should.equal('value');
            output[2].obj.should.equal(input.container.child);
            output[2].state.depth.should.equal(2);
            output[2].state.path.should.equal('#/container/child');
            output[2].state.parent.should.equal(input.container);

            output[3].key.should.equal('string');
            output[3].obj.should.equal(input.container.child);
            output[3].state.depth.should.equal(2);
            output[3].state.path.should.equal('#/container/child');
            output[3].state.parent.should.equal(input.container);
        });
    });
    it('should not traverse a string',function(){
        let calls = 0;
        recurse('hello',{},function(obj,key,state){
            calls++;
        });
        calls.should.be.exactly(0);
    });
    it('should not traverse a boolean',function(){
        let calls = 0;
        recurse(true,{},function(obj,key,state){
            calls++;
        });
        calls.should.be.exactly(0);
    });
    it('should not traverse a number',function(){
        let calls = 0;
        recurse(1,{},function(obj,key,state){
            calls++;
        });
        calls.should.be.exactly(0);
    });
    it('should not traverse a null',function(){
        let calls = 0;
        recurse(null,{},function(obj,key,state){
            calls++;
        });
        calls.should.be.exactly(0);
    });
    it('should traverse an array',function(){
        let calls = 0;
        recurse([0,1,2],{},function(obj,key,state){
            calls++;
        });
        calls.should.be.exactly(3);
    });

    describe('identity',function(){
        it('should detect object identity',function(){
            const input = { solo: '123' };
            const a = { hello: 'sailor' };
            input.b = a;
            input.c = a;
            recurse(input,{identityDetection:true},function(obj,key,state){
                if (key === 'solo') {
                    obj[key].should.equal(input.solo);
                    state.identity.should.be.exactly(false);
                }
                else if (key === 'b') {
                    state.identity.should.be.exactly(false);
                }
                else if (key === 'hello') {
                    state.identity.should.be.exactly(false);
                }
                else if (key === 'c') {
                    should(state.identityPath).not.be.undefined();
                    state.identity.should.be.exactly(true);
                    state.identityPath.should.be.exactly('#/b');
                }
            });
        });
    });
});

