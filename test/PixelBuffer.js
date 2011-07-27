require(["src/Color", "src/PixelBuffer"], function (Color, PixelBuffer) {
    require.ready(function () {
        var width = 400, height = 400,
            buffer = new PixelBuffer(0, 0, width, height),
            canvas = document.createElement('canvas'),
            body = document.getElementsByTagName('body')[0],
            ctx, data, x, y, i;

        canvas.width = width;
        canvas.height = height;
        body.appendChild(canvas);

        ctx = canvas.getContext('2d');
        
        for (x = 0; x < width; x++) for (y = 0; y < height; y++) {
            i = y * width + x;
            buffer.data[i] = new Color.FRGBA(y/height, x/width, 0, 1); 
        } 

        buffer.drawToContext(ctx);
    });
});
