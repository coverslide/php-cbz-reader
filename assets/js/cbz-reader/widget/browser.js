'use strict';

var $ = require('jquery');
var EventEmitter = require('events').EventEmitter;
var klass = require('klass');
var doT = require('dot');

module.exports = klass(EventEmitter).extend({
    initialize: function (selector)
    {
        this.$root = $(selector);
        this.initialized = false;
        this.$currentElement = null;
        this.initializeTemplates();
        this.bindEvents();
    },
    setDao: function (dao)
    {
        this.dao = dao;
    },
    start: function ()
    {
        this.getFiles('', this.$root.children('.browser-root'));
    },
    bindEvents: function ()
    {
        var self = this;
        this.$root.on('click', 'a', function (evt) {
            var $this = $(this);
            var $element = $this.parent();
            if ($element.attr('data-expanded')) {
                $element.removeAttr('data-expanded');
                var $directoryChildren = $element.children('.directory-children');
                $directoryChildren.slideUp();
                evt.stopPropagation();
                window.location.hash = '#';
                return false;
            }
        });
    },
    getFiles: function (path, $element)
    {
        var self = this;
        if (this.$currentElement) {
            this.$currentElement.removeClass('active');
        }
        this.$currentElement = $element;
        var $directoryChildren = $element.children('.directory-children');
        $directoryChildren.empty();
        $element.addClass('active');
        $directoryChildren.hide();
        this.dao.getFileList(path, function (err, directory, files) {
            if (err) return;
            files.forEach(function (fileData) {
                fileData.path = [directory, fileData.filename].join('/');
                $directoryChildren.append(self.browserRowTemplate(fileData));
                $element.attr('data-expanded', true);
            });
            if (!self.initialized) {
                self.emit('start');
            }
            $directoryChildren.slideDown();
        });
    },
    initializeTemplates: function () {
        this.browserRowTemplate = doT.compile($('#cbz-reader-template-browser-row').html());
    }
});
