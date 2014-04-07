;(function ($) {
    'use strict';
    Coverslide('dao')('cbzreader').CbzReaderDao = klass({
        initialize: function ()
        {
            this.comicPagesUrl = null;
            this.fileListUrl   = null;
        },
        setComicPagesUrl: function (url)
        {
            this.comicPagesUrl = url
        },
        setFileListUrl: function (url)
        {
            this.fileListUrl = url
        },
        getFileList: function (path, cb)
        {
            $.ajax({
                url: this.fileListUrl,
                data: {directory: path},
                success: function (returnValue) {
                    if (returnValue.status === 0) {
                        cb(null, path, returnValue.data);
                    } else {
                        cb(new Error('Bad Status'));
                    }
                },
                error: function (err) {
                    cb(err);
                }
            });
        },
        getComicPages: function (path, cb)
        {
            $.ajax({
                url: this.comicPagesUrl,
                data: {file: path},
                success: function (returnValue) {
                    if (returnValue.status === 0) {
                        cb(null, path, returnValue.data);
                    } else {
                        cb(new Error('Bad Status'));
                    }
                },
                error: function (err) {
                    cb(err);
                }
            });
        }
    });
}(jQuery));
