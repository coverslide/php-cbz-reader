;(function($){
    'use strict';
    Coverslide('widget')('cbzreader').BrowserWidget = klass(EventEmitter2).extend({
        initialize: function (selector)
        {
            this.$root = $(selector);
            this.initializeTemplates();
        },
        setAjaxUrl: function (url)
        {
            this.url = url;
        },
        start: function ()
        {
            this.getFiles('/', this.$root.children('.browser-root').children('.directory-children').eq(0));
        },
        getFiles: function (path, $element)
        {
            var self = this;
            $.ajax({
                url: this.url,
                data: {directory: path},
                success: function (returnValue) {
                    if (returnValue.status === 0) {
                        returnValue.data.forEach(function (fileData) {
                            $element.append(self.browserRowTemplate(fileData));
                        });
                    }
                }
            })
        },
        initializeTemplates: function () {
            this.browserRowTemplate = doT.compile($('#cbz-reader-template-browser-row').html());
        }
    });
}(jQuery));

