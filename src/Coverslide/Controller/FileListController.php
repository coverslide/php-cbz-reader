<?php

namespace Coverslide\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Coverslide\FileLister;

class FileListController
{
    const STATUS_OK                     =   0;
    const STATUS_ERROR_NOT_DIRECTORY    =   1;

    protected $rootPath;

    public function setRootPath($rootPath)
    {
        $this->rootPath = $rootPath;
        return $this;
    }

    public function filesAction(Request $request)
    {
        $directory = $request->get('directory');

        $path = join('/', array($this->rootPath, $directory));

        if (!is_dir($path)) {
            return new JsonResponse(
                array(
                    'status'    => self::STATUS_ERROR_NOT_DIRECTORY,
                    'message'   => 'Path is not a directory'
                ),
                400
            );
        }

        $files = (new FileLister($path))->listFiles();


        return new JsonResponse(
            array(
                'status'    => self::STATUS_OK,
                'directory' => $directory,
                'data'      => $files
            )
        );
    }
}
