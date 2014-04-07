;(function($){
    'use strict';
    Coverslide('widget')('cbzreader').ToolbarWidget = klass(EventEmitter2).extend({
        initialize: function (selector)
        {
            this.$root = $(selector);
        },
    });
}(jQuery));
