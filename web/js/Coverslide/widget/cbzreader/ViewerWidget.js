;(function($){
    'use strict';

    // how much to divide deltaX by
    var ZOOM_DIVIDEND = 100;

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
            };

            this.$image.on('dblclick', function()
            {
                //we cannot use .css(), we need the actual percentage, not computed style
                if (this.style.width === '200%') {
                    this.style.width = '100%';
                } else {
                    this.style.width = '200%';
                }
            });

            this.$image.on('mousewheel', function (evt) {
                if (evt.shiftKey) {
                    evt.preventDefault();
                    /*
                    console.log(
                        evt.originalEvent.deltaX, evt.originalEvent.deltaY, self.$root.scrollTop(), self.$root.scrollLeft(),
                        evt.pageX, evt.pageY, this.offsetTop, this.offsetLeft,
                        this.style.width)
                    */
                    self.zoom(evt.originalEvent.deltaX);
                }
            });
        },
        zoom: function (delta)
        {
            var element = this.$image[0];
            var width = element.style.width;
            var percentage = Number(width.replace(/%$/,''));
            if ((delta > 0 && percentage < 200) || (delta < 0 && percentage > 100)) {
                var zoomAmt = delta / ZOOM_DIVIDEND;
                percentage += zoomAmt;
                element.style.width = percentage + '%';
            }
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
            this.$image.css('width', '100%');
        }
    });
}(jQuery));
