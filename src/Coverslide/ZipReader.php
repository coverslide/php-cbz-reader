<?php

namespace Coverslide;

class ZipReader
{
    const COMPRESSION_UNCOMPRESSED  =   0;
    const COMPRESSION_DEFLATE       =   8;

    const HEADER_SIZE_FILEHEADER    =   30;
    const HEADER_SIZE_CDHEADER      =   46;
    const HEADER_SIZE_ENDHEADER     =   22;

    private $fileHandle;

    public function __construct($path)
    {
        $this->fileHandle = fopen($path, 'rb');
    }

    public function __destruct()
    {
        fclose($this->fileHandle);
    }

    public function listFiles()
    {
        fseek($this->fileHandle, 0 - self::HEADER_SIZE_ENDHEADER, SEEK_END);

        $endBlock = fread($this->fileHandle, self::HEADER_SIZE_ENDHEADER);

        $endBlockInfo = $this->unpackEndBlock($endBlock);

        fseek($this->fileHandle, $endBlockInfo['cdOffset']);

        $files = array();

        foreach (range(0, $endBlockInfo['fileCount'] - 1) as $index) {

            $cdBlock = fread($this->fileHandle, self::HEADER_SIZE_CDHEADER);

            $cdBlockInfo = $this->unpackCdBlock($cdBlock);

            $filename = $cdBlockInfo['filenameLength'] ? fread($this->fileHandle, $cdBlockInfo['filenameLength']) : '';
            $extraField = $cdBlockInfo['extraFieldLength'] ? fread($this->fileHandle, $cdBlockInfo['extraFieldLength']) : '';

            $comment = $cdBlockInfo['commentLength'] ? fread($this->fileHandle, $cdBlockInfo['commentLength']) : '';

            $cdBlockInfo = array_merge($cdBlockInfo, compact('filename', 'comment'));

            $files[] = $cdBlockInfo;
        }

        return $files;
    }

    public function getFileInfoAtOffset($offset)
    {
        fseek($this->fileHandle, $offset);

        $fileBlock = fread($this->fileHandle, self::HEADER_SIZE_FILEHEADER);

        $fileInfo = $this->unpackFileBlock($fileBlock);

        $fileInfo['offset'] = $offset;
        $fileInfo['filename'] = $fileInfo['filenameLength'] ? fread($this->fileHandle, $fileInfo['filenameLength']) : '';
        $fileInfo['extraField'] = $fileInfo['extraFieldLength'] ? fread($this->fileHandle, $fileInfo['extraFieldLength']) : '';

        return $fileInfo;
    }

    public function getRawDataFromFileInfo($fileInfo)
    {
        $totalOffset = self::HEADER_SIZE_FILEHEADER + $fileInfo['offset'] + $fileInfo['filenameLength'] + $fileInfo['extraFieldLength'];
        fseek($this->fileHandle, $totalOffset);
        return fread($this->fileHandle, $fileInfo['csize']);
    }

    public function createGzipDataFromFileInfo($fileInfo)
    {
        $gzipData = '';
        $gzipData .= pack('nCCCCV', 0x1f8b,8,0,0,0,0); //gzip header
        $gzipData .= $this->getRawDataFromFileInfo($fileInfo); //raw data
        $gzipData .= pack('VV', $fileInfo['crc32'], $fileInfo['usize']); //gzip footer

        return $gzipData;
    }

    public function decompressDataFromFileInfo($fileInfo)
    {
        return zlib_decode($this->getRawDataFromFileInfo($fileInfo));
    }

    private function unpackFileBlock($fileBlock)
    {
        return unpack(
            'H8header/' .
            'vversion/' .
            'vflags/' .
            'vcompressionType/' .
            'vmtime/' .
            'vmdate/' .
            'Vcrc32/' .
            'Vcsize/' .
            'Vusize/' .
            'vfilenameLength/' . 
            'vextraFieldLength/', 
            $fileBlock
        );
        
    }

    private function unpackCdBlock($cdBlock)
    {
        return unpack(
            'H8header/' .
            'vversion/' .
            'vversionNeeded/' .
            'vflags/' .
            'vcompressionType/' .
            'vmtime/' .
            'vmdate/' .
            'Vcrc32/' .
            'Vcsize/' .
            'Vusize/' .
            'vfilenameLength/' .
            'vextraFieldLength/' .
            'vcommentLength/' .
            'vdiskStart/' .
            'vinternalAttr/' .
            'VexternalAttr/' . 
            'VfileOffset/',
            $cdBlock
        );
    }

    private function unpackEndBlock($endBlock)
    {
        return unpack(
            'Nsignature/' .
            'vdisk/' .
            'vcdDisk/' .
            'vdiskCount/' .
            'vfileCount/' .
            'VcdSize/' .
            'VcdOffset',
            $endBlock
        );
    }
}
