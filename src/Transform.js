define("Transform", ["PixelBuffer"], function (PixelBuffer) {
    var Transform, Composition, TransformTree, EmptyTree, Flat;

    Transform = function () {};

    // run: PixelBuffer -> PixelBuffer
    Transform.prototype.run = function (buffer) {
        return buffer;
    };

    /* TODO: I'm starting to think that this should really be a tree */
    Flat = function (pixelBuffer) {
        this.pixelBuffer = pixelBuffer;
    };
    Flat.prototype = Object.create( Transform.prototype );
    Flat.prototype.run = function (_) {
        return this.pixelBuffer;
    };

    TransformTree = function (transform, tree) {
        this.transform = transform;
        this.tree = tree;
        this.cache = null;
    };

    TransformTree.prototype = {
        // getPixelBuffer: -> PixelBuffer
        getPixelBuffer: function () {
            if (!this.cache) {
                this.cache = this.transform.run(this.tree.getPixelBuffer());
            }

            return this.cache;
        }
    };

    Composition = function (tree, blender) {
        this.tree = tree;
        this.blender = blender;
    };
    Composition.prototype = Object.create( Transform.prototype ); 
    Composition.prototype.run = function (buffer) {
        return PixelBuffer.combine(this.tree.getPixelBuffer(), buffer, this.blender);
    };

    EmptyTree = function () {};
    EmptyTree.prototype = Object.create( TransformTree.prototype );
    EmptyTree.getPixelBuffer = function () { return null; };

    return {
        Transform: Transform,
        TransformTree: TransformTree,
        Composition: Composition,
        EmptyTree: EmptyTree,
        Flat: Flat
    };
});
