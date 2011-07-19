define(function () {
    Object.create = Object.create || function (o) {
        var F = function (){};
        F.prototype = o;
        return new F();
    };

    Array.create = Array.create || function (n) {
        if (typeof(n) !== "number") {
            throw new TypeError();
        }
        return new Array(n);
    };

    Number.prototype.times = Number.prototype.times || function (fn, bind) {
        var out = [],
            i = this;

        while (i--) {
            out[i] = fn.call(bind, i, i);
        }
    };
});
