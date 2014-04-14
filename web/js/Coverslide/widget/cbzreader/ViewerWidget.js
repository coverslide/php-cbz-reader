;(function($){
    'use strict';
    Coverslide('widget')('cbzreader').ViewerWidget = klass(EventEmitter2).extend({
        initialize: function (selector)
        {
            this.$root = $(selector);
            this.$image = this.$root.find('.image');
            this.bindEvents();
        },
        bindEvents: function()
        {
            var self = this;
            this.$image[0].onload = function() {
                self.$image.show();
            }

            this.$image.on('dblclick', function()
            {
                var $this = $(this);
                if ($this.hasClass('zoom')) {
                    $this.removeClass('zoom');
                } else {
                    $this.addClass('zoom');
                }
            })
        },
        setImageUrl: function (url)
        {
            this.url = url;
        },
        loadPage: function (file, offset)
        {
            this.$root.scrollTop(0);
            this.$image.hide();
            this.$image.attr('src', this.url + '?file=' + encodeURIComponent(file) + '&offset=' + offset);
        }
    });
}(jQuery));
