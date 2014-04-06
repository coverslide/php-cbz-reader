<?php

namespace Coverslide\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Coverslide\ZipReader;

class ComicController
{
    protected $rootPath;

    protected $decompress = false;

    public function setRootPath($rootPath)
    {
        $this->rootPath = $rootPath;
        return $this;
    }

    public function setDecompress($option)
    {
        $this->decompress = $option;
        return $this;
    }

    
    public function listAction(Request $request)
    {
        $filename = $request->get('file');

        $filepath = join('/', array($this->rootPath, $filename));

        $zipReader = new ZipReader($filepath);
        
        $files = $zipReader->listFiles();

        return new JsonResponse($files);
    }

    public function imageAction(Request $request)
    {
        $filename = $request->get('file');
        $offset = $request->query->getInt('offset');

        $filepath = join('/', array($this->rootPath, $filename));

        $zipReader = new ZipReader($filepath);
        $fileInfo = $zipReader->getFileInfoAtOffset($offset);

        $responseHeaders = array(
            'Content-Type' => $this->inferContentType($fileInfo['filename'])
        );

        $acceptedEncodings = explode(',', $request->headers->get('accept-encoding'));

        if ($fileInfo['compressionType'] === ZipReader::COMPRESSION_UNCOMPRESSED) {
            $responseData = $zipReader->getRawDataFromFileInfo($fileInfo);
        } else if ($fileInfo['compressionType'] === ZipReader::COMPRESSION_DEFLATE) {
            if (in_array('gzip', $acceptedEncodings)) {
                $responseHeaders['Content-Encoding'] = 'gzip';
                $responseData = $zipReader->createGzipDataFromFileInfo($fileInfo); 
            } else {
                $responseData = $zipReader->decompressDataFromFileInfo($fileInfo);
            }
        } else {
            return new Response('Unrecognized Compression Type', 500);
        }

        return new Response($responseData, 200, $responseHeaders);
    }

    private function inferContentType($filename)
    {
        if (preg_match('/.png$/i', $filename)) {
            return 'image/png';
        } else if (preg_match('/.jp[e]?g$/i', $filename)) {
            return 'image/jpeg';
        } else if (preg_match('/.gif$/i', $filename)) {
            return 'image/gif';
        } else if (preg_match('/.(bmp|dib)$/i', $filename)) {
            return 'image/bmp';
        }
    }
}
