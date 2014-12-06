'use strict';

var $ = require('jquery');
var EventEmitter = require('events').EventEmitter;
var klass = require('klass');

module.exports = klass(EventEmitter).extend({
    currentFile: null,
    page: null,
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
                self.emit('update', self.lastPage, page);
            });
        } else {
            this.selectPage(page);
            this.emit('update', this.lastPage, page);
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
        this.page = +page;
        var $pageElement = this.$currentFileList.find('li').eq(page - 1);
        $pageElement.addClass('active');
        var offset = $pageElement.attr('data-offset');
        this.$currentElement = $pageElement;
        this.emit('page', this.currentFile, offset);
    },
    nextPage: function()
    {
        if (this.currentFile && this.page <= this.lastPage - 1) {
            window.location.hash = '#!' + this.currentFile + '::' + (this.page + 1);
        }
    },
    previousPage: function()
    {
        if (this.currentFile && this.page > 1) {
            window.location.hash = '#!' + this.currentFile + '::' + (this.page - 1);
        }
    }
});
