Concepts of CRAMFLACK~ 
=======

A Document is a collection of DocumentStates. `Document.currentState` is the DocumentState that represents the current state of the document, `Document.history` is a (variable-size) FIFO stack of DocumentStates.

    Document = { DocumentState currentState, Stack<DocumentState> history }

    DocumentState = { LayerGroup tree }

    TransformTree ::== ( Transform , TransformTree )
                  ::== EmptyTransformTree

A Transform should implement `run: PixelBuffer -> PixelBuffer`

TransformTree implements getPixelBuffer as:

    function getPixelBuffer() {
        if ( this.cache == null ) {
            this.cache = this.transform.run( this.rest.getPixelBuffer() );
        }

        return this.cache; 
    }

A Composition is a Transform that combines another TransformTree with its parent (e.g. adds a layer to an existing stack of layers). A Composition has a property `transformTree`

    function run(bottom) {
        var top = this.transformTree.getPixelBuffer(),
            result = new PixelBuffer(top.width, top.height);

        for (var i = 0; i < top.length; i++) {
            result[i] = this.blender.combine( top[i], bottom[i] );  
        }

        return result;
    }

A Blender implements `combine: Color, Color -> Color`, to perform a blending operation (e.g. Multiply, Screen, ColorDodge)

A Layer is a Composition that points to a Special kind of TransformTree (a LayerTree), that has a property `paintTree` that points to a subtree. This allows a layer to be split between global transforms (e.g. masks, drop-shadows) and local changes (e.g. brushstrokes, pasted data).

A LayerGroup is ?? IDK

    LayerGroup ::== (LayerGroup, LayerGroup)
               ::== Layer
               ::== EmptyLayerGroup
