;(function($){
    'use strict';
    Coverslide('widget')('cbzreader').ToolbarWidget = klass(EventEmitter2).extend({
        initialize: function (selector)
        {
            this.$root = $(selector);
            this.$previousBtn = this.$root.find('[data-action="previous-page"]')
            this.$nextBtn = this.$root.find('[data-action="next-page"]')
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
        toggleNext: function(state)
        {
            this.$nextBtn.attr('disabled', !state);
        },
        togglePrevious: function(state)
        {
            this.$previousBtn.attr('disabled', !state);
        }
    });
}(jQuery));
