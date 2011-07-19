require(["src/Color"], function (Color) {
    var getContext, runTests, width = 150, height = 150;

    getContext = function (width, height) {
        var c = document.createElement('canvas');
        c.width = width;
        c.height = height;
        return c.getContext('2d');
    };

    require.ready(function () {
        var body = document.getElementsByTagName('body')[0];
        // Draw an HSLA circle
        (function () {
            var buffer, ctx,
            x, y, h, s, l, radius, i, j, color;

            ctx = getContext(width, height);
            buffer = ctx.createImageData(width, height);
            body.appendChild(ctx.canvas);
            i = buffer.data.length;
            radius = width / 2;

            while (i--) {
                x = width * 0.5 - (i % width);
                y = height * 0.5 - Math.floor(i / width);
                h = (Math.atan2(y, x) + Math.PI) / (2 * Math.PI);
                s = Math.sqrt(x * x + y * y) / radius;
                l = 0.5;
                color = new Color.HSLA(h, s, l, 1).toRGBA();

                if (s < 1) {
                    j = i * 4; 
                    buffer.data[j + 0] = color.red; 
                    buffer.data[j + 1] = color.green; 
                    buffer.data[j + 2] = color.blue; 
                    buffer.data[j + 3] = 255;
                }
            }  

            ctx.putImageData(buffer, 0, 0);
        }.call(null));

        // Draw the RGBA square
        (function () {
            var buffer, ctx,
            x, y, r, g, b, i, j, color;

            ctx = getContext(width, height);
            buffer = ctx.createImageData(width, height);
            body.appendChild(ctx.canvas);
            i = buffer.data.length;

            while (i--) {
                x = i % width;
                y = Math.floor(i / width);
                r = x / width;
                g = y / height;
                b = 1;
                color = new Color.FRGBA(r, g, b, 1).toRGBA();
                j = i * 4; 
                buffer.data[j + 0] = color.red; 
                buffer.data[j + 1] = color.green; 
                buffer.data[j + 2] = 0; 
                buffer.data[j + 3] = 255;
            }  

            ctx.putImageData(buffer, 0, 0);
        }.call(null));
    });
});

