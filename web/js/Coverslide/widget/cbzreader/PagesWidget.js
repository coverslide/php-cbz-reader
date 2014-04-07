;(function($){
    'use strict';
    Coverslide('widget')('cbzreader').PagesWidget = klass(EventEmitter2).extend({
        initialize: function (selector)
        {
            this.$root = $(selector);
        },
        setAjaxUrl: function (url)
        {
            this.url = url;
        }

    });
}(jQuery));

