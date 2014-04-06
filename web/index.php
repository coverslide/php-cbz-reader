<?php
// web/index.php

$filename = __DIR__.preg_replace('#(\?.*)$#', '', $_SERVER['REQUEST_URI']);
if (php_sapi_name() === 'cli-server' && is_file($filename)) {
    return false;
}

require __DIR__.'/../vendor/autoload.php';

$app = new \Coverslide\Application\CbzApplication();
$app->setRootPath(__DIR__ . '/../');
$app->initialize();
$app->run();
