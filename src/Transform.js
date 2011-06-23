define("Transform", [], function () {
    var Transform, Composition, TransformTree, EmptyTree, Flat;

    Transform = function () {};

    // run: PixelBuffer -> PixelBuffer
    Transform.prototype.run = function (buffer) {
        return buffer;
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
    Composition.prototype.run = function () {
        throw new Error("Not Implemented");
    };

    return {
        Transform: Transform,
        TransformTree: TransformTree,
        Composition: Composition 
    };
});
