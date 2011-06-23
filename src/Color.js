define("Color", [], function () {
    var Color, RGBA, HSLA, FRGBA, 
        floor = Math.floor,
        inv_255 = 1 / 255;

    Color = function () {};

    Color.prototype = {
        convertTo: function (type) {
            switch (type) {
                case RGBA: return this.toRGBA();
                case HSLA: return this.toHSLA();
                case FRGBA: return this.toFRGBA();
            }
        },

        toRGBA: function () {
            return this.toFRGBA().toRGBA();
        },

        toHSLA: function () {
            return this.toFRGBA().toHSLA();
        }
    };

    FRGBA = function (red, green, blue, alpha) {
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;
    };

    FRGBA.prototype = Object.create( Color.prototype );

    FRGBA.prototype.toFRGBA = function () {
        return this;
    };

    FRGBA.prototype.toHSLA = function () {
        var red = this.red, 
            green = this.green, 
            blue = this.blue,
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

    FRGBA.prototype.toRGBA = function () {
        var red = floor(this.red * 255),
            green = floor(this.green * 255),
            blue = floor(this.blue * 255),
            alpha = floor(this.alpha * 255);

        return new RGBA(red, green, blue, alpha); 
    };

    RGBA = function (red, green, blue, alpha) {
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;
    };
    RGBA.prototype = Object.create( Color.prototype );

    RGBA.prototype.toRGBA = function () {
        return this;
    };

    RGBA.prototype.toFRGBA = function () {
        var red = this.red * inv_255,
            green = this.green * inv_255,
            blue = this.blue * inv_255,
            alpha = this.alpha * inv_255;

        return new FRGBA(red, green, blue, alpha);
    };

    HSLA = function (hue, saturation, luminosity, alpha) {
        this.hue = hue;
        this.saturation = saturation;
        this.luminosity = luminosity;
        this.alpha = alpha;
    };
    HSLA.prototype = Object.create( Color.prototype );

    HSLA.prototype.toHSLA = function () {
        return this;
    };

    HSLA.prototype.toFRGBA = function () {
        var red, green, blue,
            value, median, shifted, hue,
            sextant, fract, vsf, mid1, mid2;

        red = green = blue = this.luminosity; 

        if (this.luminosity <= 0.5) {
            value = this.luminosity * (1 + this.saturation);
        } else {
            value = this.luminosity + this.saturation - this.luminosity * this.saturation;
        } 
        
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

        return new FRGBA(red, green, blue, this.alpha);
    };

    Color.RGBA = RGBA;
    Color.HSLA = HSLA;
    Color.FRGBA = FRGBA;

    return { Color: Color };
});
