# PHP-CBZ-Reader #

This is a Silex app for browsing .cbz comic book archives

### Requirements ###

* PHP 5.3
* Composer

### Installation ###

1. Clone the repository
2. Run `composer install`
3. Point your vhost to `path/to/project/root/web`
4. Copy `config/config.ini.example` to `config/config.ini`
5. Edit `config.ini` and change `cbz.root` to the root directory of your cbz file collection.

### Notice ###

This only works on .cbz files, for various reasons. You will need to convert any other format to .cbz. Also, file extensions must be .cbz or else they are ignored. 

In order to convert files, look at the converter scripts for [.cbr files](https://github.com/coverslide/cbz-web/blob/master/bin/cbrtocbz) and [.pdf files](https://github.com/coverslide/cbz-web/blob/master/bin/pdftocbz).

### License ###

MIT

### Contributors ###

Richard Hoffman