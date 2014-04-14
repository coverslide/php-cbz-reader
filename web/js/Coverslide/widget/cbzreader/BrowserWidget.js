;(function($){
    'use strict';
    Coverslide('widget')('cbzreader').BrowserWidget = klass(EventEmitter2).extend({
        currentFile: null,
        $currentElement: null,
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
            var self = this;
            if (path == this.currentFile) {
                this.currentFile = null;

                var $directoryChildren = $element.children('.directory-children');
                $directoryChildren.slideUp();
            } else {
                if (this.$currentElement) {
                    this.$currentElement.removeClass('active');
                }
                this.$currentElement = $element;
                var $directoryChildren = $element.children('.directory-children');
                $directoryChildren.empty();
                $element.addClass('active');
                this.currentFile = path;
                $directoryChildren.hide();
                this.dao.getFileList(path, function (err, directory, files) {
                    if (err) return;
                    files.forEach(function (fileData) {
                        fileData.path = [directory, fileData.filename].join('/');
                        $directoryChildren.append(self.browserRowTemplate(fileData));
                    });
                    $directoryChildren.slideDown();
                });
            }
        },
        initializeTemplates: function () {
            this.browserRowTemplate = doT.compile($('#cbz-reader-template-browser-row').html());
        }
    });
}(jQuery));

