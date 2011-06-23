define("PixelBuffer", ["Rect", "Color", "Blender"], function (Color) {
    var PixelBuffer, SparsePixelBuffer;

    PixelBuffer = function (rect) {
        var buffer, i; 
        this.rect = rect;
        this.length = rect.width * rect.height;

        i = length;
        buffer = [];

        while (i--) {
            buffer[i] = new Color.RGB();
        }

        this.data = buffer;
    };
    PixelBuffer.prototype = {
        // getIndex: Index -> Color
        getIndex: function (i) {
            return this.data[i];
        },
        
        // getXY: Index, Index -> Color 
        getXY: function (x, y) {
            return this.data[y * this.width + x];
        },

        // getBytes: -> [Byte]
        getBytes: function () {
            // Returns an array that is this.length * 4 long
            // which contains each Pixel unpacked into Numbers as
            // RGBA in a similar format to a Canvas ImageData object
            var buffer = [];
            this.writeBytes(buffer);
            return buffer; 
        },

        // writeBytes: Array(ish object) ->
        // also, it mutates the buffer obv.
        writeBytes: function (buffer) {
            var i = this.length, color, j;

            while (i--) {
                color = this.getIndex(i).toRGB();
                j = i * 4;
                buffer[j + 0] = color.red;
                buffer[j + 1] = color.green;
                buffer[j + 2] = color.blue;
                buffer[j + 3] = color.alpha;
            }

            return buffer;
        },

        // resizeTo: Rect -> SparsePixelBuffer 
        resizeTo: function (rect) {
            throw new Error("Not Implemented");
        },

        // drawToContext: Canvas2DRenderingContext ->
        drawToContext: function (ctx) {
            var buffer = ctx.getImageData(this.width, this.height);
            this.writeBytes(buffer);
            ctx.putImageData(buffer);
        }
    };

    SparsePixelBuffer = function (buffer, top, left, width, height) {

    };
    SparsePixelBuffer.prototype = Object.create( PixelBuffer.prototype );
    
    PixelBuffer.combine = function (top, bottom, blender) {
        throw new Error("Not Implemented");
    };

    return { PixelBuffer: PixelBuffer };
});
