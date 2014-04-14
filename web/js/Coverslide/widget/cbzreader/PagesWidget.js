;(function($){
    'use strict';
    Coverslide('widget')('cbzreader').PagesWidget = klass(EventEmitter2).extend({
        currentFile: null,
        currentPage: null,
        lastPage: null,
        $currentElement: null,
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
            this.lastPage = pages.length;
            this.$currentFileList.empty();
            this.$currentFileList.scrollTop(0);
            pages.forEach(function (page, index) {
                self.$currentFileList.append('<li data-offset="' + page.fileOffset + '"><a href="#!' + path + '::' + (index + 1) +'"><span class="badge">' + (index + 1) + '</span><span class="page-filename">' + page.filename + '</span></a></li>')
            });
        },
        selectPage: function (page)
        {
            if (this.$currentElement) {
                this.$currentElement.removeClass('active');
            }
            var $pageElement = this.$currentFileList.find('li').eq(page - 1);
            $pageElement.addClass('active');
            var offset = $pageElement.attr('data-offset');
            this.$currentElement = $pageElement;
            this.emit('page', this.currentFile, offset);
        }
    });
}(jQuery));

