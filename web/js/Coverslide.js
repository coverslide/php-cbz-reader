;(function () {
    'use strict';

    function addNamespace () {
        return function currentNamespace(property) {
            if (typeof currentNamespace[property] == 'undefined') {
                currentNamespace[property] = addNamespace();
            }
            return currentNamespace[property];
        }
    }

    window.Coverslide = addNamespace();
}());
