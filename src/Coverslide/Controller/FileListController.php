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

        $files = array_filter(
            (new FileLister($path))->listFiles(),
            function ($fileInfo) {
                if ($fileInfo['directory']) {
                    return true;
                } else if (preg_match('/\.cbz$/i', $fileInfo['filename'])) {
                    return true;
                }
                return false;
            }
        );

        usort($files, function($a, $b) {
            if ($a['directory'] && !$b['directory']) {
                return -1;
            } else if ($b['directory'] && !$a['directory']) {
                return 1;
            }
            return strnatcasecmp($a['filename'], $b['filename']);
        });


        return new JsonResponse(
            array(
                'status'    => self::STATUS_OK,
                'directory' => $directory,
                'data'      => $files
            )
        );
    }
}
