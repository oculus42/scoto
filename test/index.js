const assert = require('chai').assert;
const Scoto = require('../index');

const base1 = Object.assign(Object.create(null), {
    foo: 1,
    bar: 'two',
    baz: true,
    bat: [1,2,3]
});

const base2 = Object.assign(Object.create(null), {
    foo: 2.5,
    bar: 'one',
    baz: false
});

describe('Scoto', function() {

    it('should create null objects', function(){
        const newScoto = Scoto.new();
        assert.notInstanceOf(newScoto, Object, 'Scoto produces plain objects');
    });

    it('should not inherit properties', function(){
        const newScoto = Scoto.new();
        assert.notProperty(newScoto, 'toString', 'No Object inherited properties');
    });

    describe('child', function(){

        const newScoto = Scoto.new();

        it('should create a new object', function(){
            const newScoto = Scoto.new();
            const newChild = Scoto.child(newScoto);
            assert.notStrictEqual(newChild, newScoto);
        });

        it('should inherit from the parent', function(){
            const newScoto = Scoto.new();
            const newChild = Scoto.child(newScoto);
            assert.notProperty(newScoto, 'foo');
            assert.notProperty(newChild, 'foo');

            newScoto.foo = 3;

            assert.property(newScoto, 'foo');
            assert.property(newChild, 'foo');
        });

        it('should shadow the parent', function(){
            const newScoto = Scoto.new();
            const newChild = Scoto.child(newScoto);

            // Set a base variable
            newScoto.foo = 3;

            assert.equal(newScoto.foo, newChild.foo);

            // Shadow the base variable
            newChild.foo = 4;

            assert.notEqual(newScoto.foo, newChild.foo);

            // Remove the variable shadowing
            delete newChild.foo;

            assert.equal(newScoto.foo, newChild.foo);
        });
    });

    describe('isolate', function(){
        it('should create a new object', function(){
            const newScoto = Scoto.new();
            const newChild = Scoto.child(newScoto);
            const isolatedChild = Scoto.isolate(newChild);

            assert.notStrictEqual(newChild, isolatedChild);
        });

        it('should remove a parent scope', function(){
            const newScoto = Scoto.new();
            const newChild = Scoto.child(newScoto);

            // Create parent scope value
            newScoto.foo = 1;

            const isolatedChild = Scoto.isolate(newChild);

            assert.property(newChild, 'foo');
            assert.notProperty(isolatedChild, 'foo');
        });

        it('object should not be affected by changes to source object', function(){
            const newScoto = Scoto.new();
            const newChild = Scoto.child(newScoto);

            // Create initial values
            newScoto.foo = 1;
            newChild.bar = 2;

            const isolatedChild = Scoto.isolate(newChild);

            assert.notProperty(isolatedChild, 'foo');
            assert.property(isolatedChild, 'bar');

            // Values are copied.
            assert.equal(newChild.bar, isolatedChild.bar);

            // Change the previous child
            newChild.bar = 3;

            assert.notEqual(newChild.bar, isolatedChild.bar);
        });
    });

    describe('flatten', function(){
        it('should create a new object', function(){
            const newScoto = Scoto.new();
            const newChild = Scoto.child(newScoto);
            const isolatedChild = Scoto.flatten(newChild);

            assert.notStrictEqual(newChild, isolatedChild);
        });

        it('should merge a parent scope', function(){
            const newScoto = Scoto.new();
            const newChild = Scoto.child(newScoto);

            // Create parent scope value
            newScoto.foo = 1;

            const isolatedChild = Scoto.flatten(newChild);

            assert.property(newChild, 'foo');
            assert.property(isolatedChild, 'foo');
        });

        it('object should not be affected by changes to source object', function(){
            const newScoto = Scoto.new();
            const newChild = Scoto.child(newScoto);

            // Create initial values
            newScoto.foo = 1;
            newChild.bar = 2;

            const flatChild = Scoto.flatten(newChild);

            assert.property(flatChild, 'foo');
            assert.property(flatChild, 'bar');

            // Values are copied.
            assert.equal(newScoto.foo, flatChild.foo);
            assert.equal(newChild.bar, flatChild.bar);

            // Change the previous objects
            newScoto.foo = 4;
            newChild.bar = 3;

            assert.notEqual(newScoto.foo, flatChild.foo);
            assert.notEqual(newChild.bar, flatChild.bar);
        });

    });

    describe('parent', function(){
        it('should return the parent object', function(){

        });

        it('should return null if no parent object', function(){
            const newScoto = Scoto.new();
            const parentScoto = Scoto.parent(newScoto);

            assert.isNull(parentScoto);
        });
    });

    describe('rebase', function(){
        it('should create a new object', function(){
            const newScoto = Scoto.new();
            const newScoto2 = Scoto.new();
            const newChild = Scoto.child(newScoto);
            const rebaseChild = Scoto.rebase(newChild, newScoto2);

            assert.notStrictEqual(newChild, rebaseChild);
        });

        it('should point to a different parent object, if set', function(){

            const newScoto = Scoto.new();
            const newScoto2 = Scoto.new();
            const newChild = Scoto.child(newScoto);
            const rebaseChild = Scoto.rebase(newChild, newScoto2);

            assert.notStrictEqual(Scoto.parent(newChild), Scoto.parent(rebaseChild));

            const rebaseWithSameParent = Scoto.rebase(newChild, newScoto);

            // Confirm rebase to the same parent is correct, even if the objects are different.
            assert.notStrictEqual(newChild, rebaseWithSameParent);
            assert.strictEqual(Scoto.parent(newChild), Scoto.parent(rebaseWithSameParent));
        })
    })

});