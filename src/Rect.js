define(function () {
    var Rect = function (top, left, width, height) {
        this.top = top;
        this.left = left;
        this.width = width;
        this.height = height; 
        this.right = left + width;
        this.bottom = top + height;
    };

    Rect.prototype = {
    }; 

    Rect.toContain = function (/* rect, ... */) {
        var left , top, right, bottom, width, height, i;

        left = top = +Infinity;
        right = bottom = -Infinity;

        i = arguments.length;

        while (i--) {
            left = Math.min(left, arguments[i].left); 
            top = Math.min(top, arguments[i].top); 
            right = Math.max(right, arguments[i].right); 
            bottom = Math.max(bottom, arguments[i].bottom); 
        }

        width = right - left;
        height = bottom - top;

        return new Rect(top, left, width, height);
    };

    Rect.prototype.containsPoint = function (x, y) {
        if (x < this.left || y < this.right) {
            return false;
        } else {
            return x - this.left < this.width &&
                y - this.top < this.height;
        } 
    };

    return Rect;
});
