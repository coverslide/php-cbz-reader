<?php

namespace Coverslide;

class FileLister
{
    private $directory;

    private $directoryHandle;

    public function __construct($directory)
    {
        $this->directory       = $directory;
        $this->directoryHandle = opendir($directory);
    }

    public function __destruct()
    {
        closedir($this->directoryHandle);
    }

    public function listFiles($regexFilter = null)
    {
        $directory = $this->directory;

        $files = array();

        while ($dirEntry = readdir($this->directoryHandle)) {
            if (preg_match('/^\./', $dirEntry)) {
                continue;
            }

            $filepath = join('/', array($directory, $dirEntry));

            $isDirectory = is_dir($filepath);

            if (!$isDirectory && $regexFilter && !preg_match($regexFilter, $dirEntry)) {
                continue;
            }

            $stat = stat($filepath);

            $files[] = array(
                'filename'  => $dirEntry,
                'size'      => $stat['size'],
                'directory' => $isDirectory
            );
        }

        return $files;
    }
}
