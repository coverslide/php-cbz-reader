;(function($){
    'use strict';
    Coverslide('widget')('cbzreader').ToolbarWidget = klass(EventEmitter2).extend({
        initialize: function (selector)
        {

            this.$root = $(selector);
            this.bindEvents();
        },
        bindEvents: function ()
        {
            var self = this;
            this.$root.on('click', 'a', function (e) {
                var action = $(this).attr('data-action');
                self.emit('click', action);
            });
        },
    });
}(jQuery));
