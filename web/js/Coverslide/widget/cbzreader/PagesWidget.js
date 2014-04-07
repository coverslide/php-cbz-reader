;(function($){
    'use strict';
    Coverslide('widget')('cbzreader').PagesWidget = klass(EventEmitter2).extend({
        initialize: function (selector)
        {
            this.currentFile = null;
            this.$root = $(selector);
            this.$currentFileList = this.$root.find('.current-file-list');
        },
        setDao: function (dao)
        {
            this.dao = dao;
        },
        setCurrentFile: function (filename)
        {
            this.currentFile = filename;
        },
        loadPage: function (filename, page)
        {
            var self = this;
            if (this.currentFile != filename) {
                this.dao.getComicPages(filename, function (err, path, pages) {
                    if (err) return;
                    self.setCurrentFile(filename);
                    self.updatePages(path, pages);
                    self.selectPage(page);
                });
            } else {
                self.selectPage(page);
            }
        },
        updatePages: function (path, pages)
        {
            var self = this;
            this.$currentFileList.empty();
            pages.forEach(function (page, index) {
                self.$currentFileList.append('<li data-offset="' + page.fileOffset + '"><a href="#!' + path + '::' + (index + 1) +'">' + (index + 1) + page.filename + '</a></li>')
            });
        },
        selectPage: function (page)
        {
           var offset = this.$currentFileList.find('li').eq(page - 1).attr('data-offset');
           this.emit('page', this.currentFile, offset);
        }
    });
}(jQuery));

