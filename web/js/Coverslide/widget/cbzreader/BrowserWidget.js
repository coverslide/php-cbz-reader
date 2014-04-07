;(function($){
    'use strict';
    Coverslide('widget')('cbzreader').BrowserWidget = klass(EventEmitter2).extend({
        initialize: function (selector)
        {
            this.$root = $(selector);
            this.initializeTemplates();
        },
        setDao: function (dao)
        {
            this.dao = dao;
        },
        start: function ()
        {
            this.getFiles('', this.$root.children('.browser-root'));
        },
        getFiles: function (path, $element)
        {
            var $directoryChildren = $element.children('.directory-children');
            $directoryChildren.empty();
            $element.addClass('active');
            var self = this;
            this.dao.getFileList(path, function (err, directory, files) {
                if (err) return;
                files.forEach(function (fileData) {
                    fileData.path = [directory, fileData.filename].join('/');
                    $directoryChildren.append(self.browserRowTemplate(fileData));
                });
            });
        },
        initializeTemplates: function () {
            this.browserRowTemplate = doT.compile($('#cbz-reader-template-browser-row').html());
        }
    });
}(jQuery));

