'use strict';

module.exports = function (a, b) {
    return Math.pow(Math.pow(a.pageX - b.pageX, 2) + Math.pow(a.pageY - b.pageY, 2), .5);
}
