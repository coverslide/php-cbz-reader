;(function(){
    'use strict';
    var MODE_NONE    = 0;
    var MODE_BROWSER = 1;
    var MODE_PAGES   = 2;
    Coverslide('page')('cbzreader').CbzReaderPage = klass(EventEmitter2).extend({
        initialize: function ()
        {
            this.$body = $(document.body);
            this.toolbar = new Coverslide.widget.cbzreader.ToolbarWidget('#cbz-reader-toolbar');
            this.browser = new Coverslide.widget.cbzreader.BrowserWidget('#cbz-reader-browser');
            this.pages   = new Coverslide.widget.cbzreader.PagesWidget('#cbz-reader-pages');
            this.viewer  = new Coverslide.widget.cbzreader.ViewerWidget('#cbz-reader-viewer');
            this.injectUrls();
            this.start();
        },
        injectUrls: function ()
        {
            this.browser.setAjaxUrl(Coverslide.urls.cbzreader.fileListUrl);
            this.pages.setAjaxUrl(Coverslide.urls.cbzreader.comicPagesUrl);
            this.viewer.setImageUrl(Coverslide.urls.cbzreader.comicImageUrl);
        },
        start: function()
        {
            this.setMode(MODE_BROWSER);
            this.browser.start();
        },
        setMode: function(mode)
        {
            if (mode === MODE_BROWSER) {
                this.$body.removeClass('pages').addClass('browser');
            } else if (mode === MODE_PAGES) {
                this.$body.removeClass('browser').addClass('pages');
            } else if (mode === MODE_NONE) {
                this.body.removeClass('pages browser');
            }
        }
    }, EventEmitter2);
}());
