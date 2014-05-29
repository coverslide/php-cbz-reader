<?php

namespace Coverslide\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Symfony\Component\HttpFoundation\JsonResponse;
use Coverslide\ZipReader;

class ComicController
{
    const STATUS_OK = 0;
    const STATUS_ERROR = 1;
    
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

        if (!is_file($filepath)) {
            return new JsonResponse(
                array(
                    'status' => self::STATUS_ERROR
                ),
                404
            );
        }

        try {
            $zipReader = new ZipReader($filepath);
        } catch (\Exception $e) {
            return new JsonResponse(
                array(
                    'status' => self::STATUS_ERROR
                ),
                500
            );
        }
        
        $files = array_filter(
            $zipReader->listFiles(),
            function ($fileData) {
                return preg_match('/\.(png|jp[e]?g|gif|bmp)/i', $fileData['filename']);
            }
        );

        usort($files, function($a, $b) {
            return strnatcasecmp($a['filename'], $b['filename']);
        });

        return new JsonResponse(
            array(
                'status' => self::STATUS_OK,
                'data'   => $files
            )
        );
    }

    public function imageAction(Request $request)
    {
        $filename = $request->get('file');
        $offset = $request->query->getInt('offset');

        $filepath = join('/', array($this->rootPath, $filename));

        $etag = md5(stat($filepath)['mtime']);
        if ($request->headers->get('If-None-Match') === $etag) {
            return new Response('', 304);
        }

        try {
            $zipReader = new ZipReader($filepath);
            $fileInfo = $zipReader->getFileInfoAtOffset($offset);
        } catch (\Exception $e) {
            return new Response('', 500);
        }

        $responseHeaders = array(
            'Content-Type' => $this->inferContentType($fileInfo['filename']),
            'ETag'  => $etag
        );

        $acceptedEncodings = explode(',', $request->headers->get('accept-encoding'));

        if ($fileInfo['compressionType'] === ZipReader::COMPRESSION_UNCOMPRESSED) {
            $responseData = $zipReader->getRawDataFromFileInfo($fileInfo);
        } else if ($fileInfo['compressionType'] === ZipReader::COMPRESSION_DEFLATE) {
            if (in_array('gzip', $acceptedEncodings)) {
                $responseHeaders['Content-Encoding'] = 'gzip';
                return new StreamedResponse(
                    function () use ($zipReader, $fileInfo) {
                        echo $zipReader->createGzipDataFromFileInfo($fileInfo);
                    },
                    200,
                    $responseHeaders
                );
            } else {
                return new StreamedResponse(
                    function () use ($zipReader, $fileInfo) {
                        echo $zipReader->decompressDataFromFileInfo($fileInfo);
                    },
                    200,
                    $responseHeaders
                );
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
        } else {
            return 'application/octet-stream';
        }
    }
}
