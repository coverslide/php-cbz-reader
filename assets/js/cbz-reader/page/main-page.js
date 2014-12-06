'use strict';

var $ = require('jquery');
var klass = require('klass');
var EventEmitter = require('events').EventEmitter;
var fullscreen = require('fullscreen')
var ToolbarWidget = require('../widget/toolbar.js');
var BrowserWidget = require('../widget/browser.js');
var PagesWidget = require('../widget/pages.js');
var ViewerWidget = require('../widget/viewer.js');

var CbzReaderDao = require('../dao/cbz-reader.js');

var MODE_NONE    = 0;
var MODE_BROWSER = 1;
var MODE_PAGES   = 2;

module.exports = klass(EventEmitter).extend({
    fullscreen: false,
    fullscreenEl: false,
    initialize: function ()
    {
        this.mode = MODE_NONE;

        this.$body = $(document.body);
        this.toolbar = new ToolbarWidget('#cbz-reader-toolbar');
        this.browser = new BrowserWidget('#cbz-reader-browser');
        this.pages   = new PagesWidget('#cbz-reader-pages');
        this.viewer  = new ViewerWidget('#cbz-reader-viewer');
        this.fullscreenEl = fullscreen(document.body);
        this.attachDao();
        this.bindEvents();
        this.start();
    },
    attachDao: function ()
    {
        var dao = new CbzReaderDao();

        this.browser.setDao(dao);
        this.pages.setDao(dao);
    },
    bindEvents: function ()
    {
        window.addEventListener('hashchange', this.onHashChange.bind(this));

        this.toolbar.on('click', this.onToolbarClick.bind(this));
        this.pages.on('page', this.onPage.bind(this));
        this.pages.on('update', this.onPageUpdate.bind(this));
    },
    onPage: function (path, offset)
    {
        this.viewer.loadPage(path, offset);
    },
    onPageUpdate: function(pages, page)
    {
        this.toolbar.togglePrevious(page != 1);
        this.toolbar.toggleNext(page <= pages - 1);
    },
    onToolbarClick: function (action)
    {
        if (action == 'toggle-browser') {
            if (this.mode == MODE_BROWSER) {
                this.setMode(MODE_NONE)
            } else {
                this.setMode(MODE_BROWSER)
            }
        } else if (action == 'toggle-pages') {
            if (this.mode == MODE_PAGES) {
                this.setMode(MODE_NONE)
            } else {
                this.setMode(MODE_PAGES)
            }
        } else if (action == 'next-page') {
            this.pages.nextPage();
        } else if (action == 'previous-page') {
            this.pages.previousPage();
        } else if (action == 'fullscreen') {
            this.toggleFullscreen();
        }
    },
    toggleFullscreen: function ()
    {
        if (this.fullscreen) {
            this.fullscreen = false;
            this.fullscreenEl.release();
        } else {
            this.fullscreen = true;
            this.fullscreenEl.request();
        }
        /*
        if (document.fullscreenEnabled) {
            document.exitFullscreen();
        } else {
            document.body.requestFullscreen();
        }
        */
    },
    onHashChange: function ()
    {
        var hash = window.location.hash;
        var fileMatch = /^#\!(.+)::(.+)$/.exec(hash);
        if (fileMatch) {
            if (this.mode == MODE_BROWSER) { 
                this.setMode(MODE_PAGES);
            }
            this.pages.loadPage(fileMatch[1], fileMatch[2]);
        } else {
            this.setMode(MODE_BROWSER);
            var directory = hash.replace(/^#\!/, '');
            this.browser.getFiles(directory, $('[data-path="' + directory + '"]'));
        }
    },
    start: function()
    {
        var self = this;
        this.setMode(MODE_BROWSER);
        this.browser.start();
        this.browser.once('start', function () {
            self.onHashChange();
        });
    },
    setMode: function(mode)
    {
        if (mode === MODE_BROWSER) {
            this.$body.removeClass('pages').addClass('browser');
        } else if (mode === MODE_PAGES) {
            this.$body.removeClass('browser').addClass('pages');
        } else if (mode === MODE_NONE) {
            this.$body.removeClass('pages browser');
        }
        this.mode = mode;
    }
});
