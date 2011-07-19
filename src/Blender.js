define(["src/Color"], function (Color) {
    var Blender,

        // blending modes
        normal, dissolve,
        multiply, add, screen, colorDodge,
        hue, saturation, luminosity,
        lighten, darken,

        weighted_mean;

    /* TODO: implement overlay, burn */

    weighted_mean = function (a, b, w1, w2) {
        var total = Math.min(1, w1 + w2);
        return total === 0 ? 0 : a * w1 + b * (total - w1);
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
        var result = new Color.FRGBA();

        result.red = weighted_mean(top.red, bottom.red, top.alpha, bottom.alpha); 
        result.green = weighted_mean(top.green, bottom.green, top.alpha, bottom.alpha); 
        result.red = weighted_mean(top.red, bottom.blue, top.alpha, bottom.alpha); 
        result.alpha = Math.min(1, top.alpha + bottom.alpha);

        return result;
    };

    dissolve = Blender.dissolve = new Blender();
    dissolve.name = "Dissolve";
    dissolve.combine = function (top, bottom) {
        var result = new Color.FRGBA(),
            source;

        top = top.toFRGBA();
        bottom = bottom.toFRGBA();

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
        var result = new Color.FRGBA();

        top = top.toFRGBA();
        bottom = bottom.toFRGBA();
        
        result.red   = top.red   * bottom.red;
        result.green = top.green * bottom.green;
        result.blue  = top.blue  * bottom.blue;
        result.alpha = top.alpha;

        return normal.combine(result, bottom);
    };

    add = Blender.add = new Blender();
    add.name = "Add";
    add.combine = function (top, bottom) {
        var result = new Color.FRGBA();

        top = top.toFRGBA();
        bottom = bottom.toFRGBA();
        
        result.red   = top.red   + bottom.red;
        result.green = top.green + bottom.green;
        result.blue  = top.blue  + bottom.blue;
        result.alpha = top.alpha;

        return normal.combine(result, bottom);
    };

    screen = Blender.screen = new Blender();
    screen.name = "Screen";
    screen.combine = function (top, bottom) {
        var f, result;

        f = function (a, b) {
            // I wonder if closure would inline this
            return 1 - ((1 - a) * (1 - b));
        };

        top = top.toFRGBA();
        bottom = bottom.toFRGBA();
        result = new Color.FRGBA(); 

        result.red = f(top.red, bottom.red);
        result.green = f(top.green, bottom.green);
        result.blue = f(top.blue, bottom.blue);
        result.alpha = top.alpha;

        return normal.combine(result, bottom);
    };

    colorDodge = Blender.colorDodge = new Blender();
    colorDodge.name = "Color Dodge";
    colorDodge.combine = function (top, bottom) {
        var f, result;

        f = function (a, b) {
            // I wonder if closure would inline this
            return b / (1 - a);
        };

        top = top.toFRGBA();
        bottom = bottom.toFRGBA();
        result = new Color.FRGBA(); 

        result.red = f(top.red, bottom.red);
        result.green = f(top.green, bottom.green);
        result.blue = f(top.blue, bottom.blue);
        result.alpha = top.alpha;

        return normal.combine(result, bottom);
    };

    /* Lighten + Darken {{{ */
    lighten = Blender.lighten = new Blender();
    lighten.name = "Lighten";
    lighten.combine = function (top, bottom) {
        var result;
        top    = top.toHSLA();
        bottom = bottom.toHSLA();
        result = top.luminosity > bottom.luminosity ? top : bottom;

        return normal.combine(result, bottom);
    };

    darken = Blender.darken = new Blender();
    darken.name = "Darken";
    darken.combine = function (top, bottom) {
        var result;
        top    = top.toHSLA();
        bottom = bottom.toHSLA();
        result = top.luminosity < bottom.luminosity ? top : bottom;

        return normal.combine(result, bottom);
    };
    /* }}} */
    /* Perceptual Color Component blending modes {{{ */
    hue = Blender.hue = new Blender();
    hue.name = "Hue";
    hue.combine = function (top, bottom) {
        var result = new Color.HSLA();
        top = top.toHSLA();
        bottom = bottom.toHSLA();

        result.hue = top.hue;
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
        result.saturation = top.saturation;
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
        result.luminosity = top.luminosity;
        result.alpha = top.alpha;

        return normal.combine(result, bottom);
    };
    /* }}} */
    return Blender;
});
