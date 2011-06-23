define("Rect", [], function () {
    var Rect = function (top, left, width, height) {
        this.top = top;
        this.left = left;
        this.width = width;
        this.height = height; 
    };

    Rect.prototype = {
        getRight: function () { return this.left + this.width; },    
        getBottom: function () { return this.top + this.height; }
    }; 

    Rect.toContain = function (/* rect, ... */) {
        var left , top, right, bottom, width, height, i;

        left = top = +Infinity;
        right = bottom = -Infinity;

        i = arguments.length;

        while (i--) {
            left = Math.min(left, arguments[i].left); 
            top = Math.min(top, arguments[i].top); 
            right = Math.max(right, arguments[i].getRight()); 
            bottom = Math.max(bottom, arguments[i].getBottom()); 
        }

        width = right - left;
        height = bottom - top;

        return new Rect(top, left, width, height);
    };

    return { Rect: Rect };
});
