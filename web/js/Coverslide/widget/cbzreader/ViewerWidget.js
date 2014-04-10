;(function($){
    'use strict';
    Coverslide('widget')('cbzreader').ViewerWidget = klass(EventEmitter2).extend({
        initialize: function (selector)
        {
            this.$root = $(selector);
            this.$image = this.$root.find('.image');
        },
        setImageUrl: function (url)
        {
            this.url = url;
        },
        loadPage: function (file, offset) {
            this.$image.attr('src', this.url + '?file=' + encodeURIComponent(file) + '&offset=' + offset);
        }
    });
}(jQuery));
