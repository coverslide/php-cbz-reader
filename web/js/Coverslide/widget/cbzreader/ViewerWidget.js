;(function($){
    'use strict';
    Coverslide('widget')('cbzreader').ViewerWidget = klass(EventEmitter2).extend({
        initialize: function (selector)
        {
            this.$root = $(selector);
        },
        setImageUrl: function (url)
        {
            this.url = url;
        }

    });
}(jQuery));