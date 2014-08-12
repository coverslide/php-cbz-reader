(function () {
    'use strict';

    Coverslide('util').distance = function (a, b) {
        return Math.pow(Math.pow(a.pageX - b.pageX, 2) + Math.pow(a.pageY - b.pageY, 2), .5);
    }
})();
