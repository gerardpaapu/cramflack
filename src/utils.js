define(function () {
    Object.create = Object.create || function (o) {
        var F = function (){};
        F.prototype = o;
        return new F();
    };
});
