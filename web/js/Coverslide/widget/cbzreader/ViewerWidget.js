;(function($){
    'use strict';

    // how much to divide deltaX by
    var ZOOM_DIVIDEND = 100;
    var MIN_ZOOM_AMT = 2.5;
    var MIN_ZOOM = 100;
    var MAX_ZOOM = 200;

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
                var e = evt.originalEvent;
                var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
                if (e.shiftKey) {
                    e.preventDefault();
                    self.zoom(delta);
                }
            });

            this.bindPinchEvents();
        },
        bindPinchEvents: function () {
            var self = this;;
            var pinchData = {
                currentZoom: 100
            };

            this.$image.on('touchstart', function (evt) {
                var touches = evt.originalEvent.touches;
                if(touches.length >= 2){
                    pinchData.startDistance = Coverslide.util.distance(touches[0], touches[1]);
                    pinchData.startZoom = pinchData.currentZoom;
                }
            });

            this.$image.on('touchmove', function (evt) {
                var touches = evt.originalEvent.touches;
                if(touches.length >= 2){
                    evt.preventDefault();
                    var dist = Coverslide.util.distance(touches[0],touches[1]);
                    var newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, pinchData.startZoom * (dist / pinchData.startDistance)));
                    pinchData.currentZoom = newZoom;
                    self.$image[0].style.width = newZoom + "%";
                }
            });
        },
        zoom: function (delta)
        {
            var element = this.$image[0];
            var width = element.style.width;
            var percentage = Number(width.replace(/%$/,''));
            if ((delta > 0 && percentage < MAX_ZOOM) || (delta < 0 && percentage > MIN_ZOOM)) {
                var zoomAmt = delta / ZOOM_DIVIDEND;
                var normZoomAmt = Math.max(MIN_ZOOM_AMT, Math.abs(zoomAmt));
                percentage += zoomAmt < 0 ? -normZoomAmt : normZoomAmt;
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
