define("Color", [], function () {
    var Color, RGBA, HSLA, inv_255 = 1 / 255;

    Color = function () {};

    RGBA = function (red, green, blue, alpha) {
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.green = green;
    };
    RGBA.prototype = Object.create( Color.prototype );

    RGBA.prototype.toRGBA = function () {
        return this;
    };

    RGBA.prototype.toHSLA = function () {
        var red = this.red * inv_255, 
            green = this.green * inv_255, 
            blue = this.blue * inv_255,
            min = Math.min(red, green, blue),
            max = Math.max(red, green, blue),
            range = max - min,
            h, s, l;

            l = (min + max) * 0.5;

        if (max === min) {
            return new HSLA(0, 0, l, this.alpha);
        } 

        s = l < 0.5 ? (range/(max + min)):(range/(2 - range));
        h = red === max ? (green - blue) / range
            : green === max ? 2 + (blue - red) / range 
            : 4 + (red - green) / range;

        return new HSLA(h / 6, s, l, this.alpha);
    };

    HSLA = function (hue, saturation, luminosity, alpha) {
        this.hue = hue;
        this.saturation = saturation;
        this.luminosity = luminosity;
        this.alpha = alpha;
    };
    HSLA.prototype = Object.create( Color.prototype );

    HSLA.prototype.toRGBA = function () {
        var red, green, blue, scale,
            value, median, shifted, hue, sextant, fract, vsf, mid1, mid2,
            result;

        red = green = blue = Math.floor(this.luminosity * 255);

        if (this.luminosity <= 0.5) {
            value = this.luminosity * (1 + this.saturation);
        } else {
            value = this.luminosity + this.saturation - this.luminosity * this.saturation;
        } 

        result = new RGBA();
        
        if (value > 0) {
            median = 2 * this.luminosity - value;
            shifted = (value - median) / value;
            hue = this.hue * 6;
            sextant = Math.floor(hue);
            fract = hue - sextant;
            vsf = value * shifted * fract;
            mid1 = median + vsf;
            mid2 = value - vsf;

            switch (sextant) {
                case 0: case 6:
                    red = value;
                    green = mid1;
                    blue = median;
                break;

                case 1:
                    red = mid2;
                    green = value;
                    blue = median; 
                break;

                case 2:
                    red = median;
                    green = value;
                    blue = mid1;
                break;

                case 3:
                    red = median;
                    green = mid2;
                    blue = value;
                break;

                case 4:
                    red = mid1;
                    green = median;
                    blue = value;
                break;

                case 5:
                    red = value;
                    green = median;
                    blue = mid2;
            }
        }

        scale = function (n) {
            return Math.floor(n * 255);
        };

        return new RGBA(scale(red),
                        scale(green),
                        scale(blue),
                        this.alpha);
    };

    HSLA.prototype.toHSLA = function () {
        return this;
    };

    Color.RGBA = RGBA;
    Color.HSLA = HSLA;

    return { Color: Color };
});
