define("Blender", ["Color"], function (Color) {
    var Blender,

        // I learned as a child to fear division above all
        // things... perhaps I was wrong... perhaps this 
        // is premature... anyway I've avoided dividing
        // by 255 and instead I multiplied by inv_255
        inv_255 = 1 / 255,

        // blending modes
        normal, dissolve,
        multiply, screen,
        hue, saturation, luminosity,

        weighted_mean;

    /* TODO: implement overlay, color_dodge, burn, darken, lighten */

    weighted_mean = function (a, b, w1, w2) {
        var total = Math.min(1, w1 + w2);
        if (total === 0) {
            return 0;
        }
        return a * w1 + b * (total - w1);
    };
    
    Blender = function () {};

    Blender.prototype = {
        // combine: Color, Color -> Color
        combine: function (top, bottom) {
            throw new Error("Not Implemented");
        },
        name: null
    };

    normal = Blender.normal = new Blender();
    normal.name = "Normal";
    normal.combine = function (top, bottom) {
        var result = new Color.RGBA();

        result.red = weighted_mean(top.red, bottom.red, top.alpha, bottom.alpha); 
        result.green = weighted_mean(top.green, bottom.green, top.alpha, bottom.alpha); 
        result.red = weighted_mean(top.red, bottom.blue, top.alpha, bottom.alpha); 
        result.alpha = Math.min(1, top.alpha + bottom.alpha);

        return result;
    };

    dissolve = Blender.dissolve = new Blender();
    dissolve.name = "Dissolve";
    dissolve.combine = function (top, bottom) {
        var result = new Color.RGBA(),
            source;

        top = top.toRGBA();
        bottom = bottom.toRGBA();

        source = (top.alpha > Math.random()) ? top : bottom;

        result.red = source.red;
        result.green = source.green;
        result.blue = source.blue;
        result.alpha = bottom.alpha;

        return result;
    };

    multiply = Blender.multiply = new Blender();
    multiply.name = "Multiply";
    multiply.combine = function (top, bottom) {
        var result = new Color.RGBA(),
            inv_255 = 1 / 255;

        top = top.toRGBA();
        bottom = bottom.toRGBA();
        
        result.red   = top.red * bottom.red * inv_255;
        result.green = top.green * bottom.green * inv_255;
        result.blue  = top.blue * bottom.blue * inv_255;
        result.alpha = top.alpha;

        return normal.combine(result, bottom);
    };

    screen = Blender.screen = new Blender();
    screen.name = "Screen";
    screen.combine = function (top, bottom) {
        var f, result;

        f = function (a, b) {
            // I wonder if closure would inline this
            return 255 - ((255 - a) * (255 - b) * inv_255);
        };

        top = top.toRGBA();
        bottom = bottom.toRGBA();
        result = new Color.RGBA(); 

        result.red = f(top.red, bottom.red);
        result.green = f(top.green, bottom.green);
        result.blue = f(top.blue, bottom.blue);
        result.alpha = top.alpha;

        return normal.combine(result, bottom);
    };

    /*Perceptual Color Component blending modes {{{ */
    hue = Blender.hue = new Blender();
    hue.name = "Hue";
    hue.combine = function (top, bottom) {
        var result = new Color.HSLA();
        top = top.toHSLA();
        bottom = bottom.toHSLA();

        result.hue = top.hue * top.alpha + (1 - top.alpha) * bottom.hue;
        result.saturation = bottom.saturation;
        result.luminosity = bottom.luminosity;
        result.alpha = top.alpha;

        return normal.combine(result, bottom);
    };

    saturation = Blender.saturation = new Blender();
    saturation.name = "Saturation";
    saturation.combine = function (top, bottom) {
        var result = new Color.HSLA();
        top = top.toHSLA();
        bottom = bottom.toHSLA();

        result.hue = bottom.hue;
        result.saturation = top.saturation * top.alpha + (1 - top.alpha) * bottom.saturation;
        result.luminosity = bottom.luminosity;
        result.alpha = top.alpha;

        return normal.combine(result, bottom);
    };

    luminosity = Blender.luminosity = new Blender();
    luminosity.name = "Luminosity";
    luminosity.combine = function (top, bottom) {
        var result = new Color.HSLA();
        top = top.toHSLA();
        bottom = bottom.toHSLA();

        result.hue = bottom.hue;
        result.saturation = bottom.saturation;
        result.luminosity = top.luminosity * top.alpha + (1 - top.alpha) * bottom.luminosity;
        result.alpha = top.alpha;

        return normal.combine(result, bottom);
    };
    /* }}} */
    return { Blender: Blender };
});
