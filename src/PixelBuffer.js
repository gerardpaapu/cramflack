define(["src/Rect", "src/Color", "src/Blender"], function (Rect, Color, Blender) {
    var PixelBuffer, SparsePixelBuffer;

    PixelBuffer = function (width, height) {
        var buffer, i; 
        var rect = new Rect(0, 0, width, height);
        this.rect = rect;
        this.length = rect.width * rect.height;
        this.width = rect.width;
        this.height = rect.height;
        this.data = Array(this.length);
    };
    PixelBuffer.prototype = {
        // getIndex: Index -> Color
        getIndex: function (i) {
            return this.data[i] || Color.blank;
        },
        
        // getXY: Index, Index -> Color 
        getXY: function (x, y) {
            return this.data[y * this.width + x] || Color.blank;
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
                color = this.getIndex(i).toRGBA();
                if (!color.isBlank()) {
                    j = i * 4;
                    buffer[j + 0] = color.red;
                    buffer[j + 1] = color.green;
                    buffer[j + 2] = color.blue;
                    buffer[j + 3] = color.alpha;
                }
            }

            return buffer;
        },

        // resizeTo: Rect -> SparsePixelBuffer 
        resizeTo: function (rect) {
            throw new Error("Not Implemented");
        },

        // drawToContext: Canvas2DRenderingContext ->
        drawToContext: function (ctx) {
            var buffer = ctx.getImageData(0, 0, this.width, this.height);
            this.writeBytes(buffer);
            ctx.putImageData(buffer, 0, 0);
        }
    };

    // Access the contents of an existing PixelBuffer through
    SparsePixelBuffer = function (buffer, rect) {
        this.rect = rect;
        this.buffer = buffer;
        this.innerRect = new Rect(
            rect.left - buffer.rect.left,
            rect.top - buffer.rect.top,
            Math.min(rect.width, buffer.rect.width),
            Math.min(rect.height, buffer.rect.height)
        ); 
    };
    SparsePixelBuffer.prototype = Object.create( PixelBuffer.prototype );

    SparsePixelBuffer.prototype.getIndex = function (i) {
        var y = Math.floor(i / this.rect.width),
            x = i % this.rect.width;

        return this.getXY(x, y);
    }; 

    SparsePixelBuffer.prototype.getXY = function (x, y) {
        // use rect.containsPoint
        return !this.innerRect.contains(x, y) ? new Color.FRGBA()
            :  this.buffer.getXY(x - this.innerRect.top, y - this.innerRect.left);
    };

    PixelBuffer.combine = function (top, bottom, blender) {
        throw new Error("Not Implemented");
    };

    return PixelBuffer;
});
