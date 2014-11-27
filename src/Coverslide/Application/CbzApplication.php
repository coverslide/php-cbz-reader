<?php

namespace Coverslide\Application;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\ParameterBag;
use Silex\Application;
use Silex\Provider\TwigServiceProvider;
use Silex\Provider\ServiceControllerServiceProvider;
use Coverslide\Controller\RootController;
use Coverslide\Controller\FileListController;
use Coverslide\Controller\ComicController;

class CbzApplication extends Application
{
    use Application\TwigTrait;

    /**
     * @var string
     */
    private $rootPath;
    private $config;

    public function setRootPath($path)
    {
        $this->rootPath = $path;
    }

    public function initialize()
    {
        $this->configure();
        $this->registerProviders();
        $this->registerControllers();
        $this->defineRoutes();
    }

    protected function configure()
    {
        $this->config = new ParameterBag(parse_ini_file($this->rootPath . '/config/config.ini'));

        $this['debug'] = $this->config->get('debug', false);
    }

    protected function registerProviders()
    {
        $this->register(new ServiceControllerServiceProvider());

        $this->register(
            new TwigServiceProvider(),
            array(
                'twig.path' => $this->rootPath . '/views'
            )
        );
    }

    protected function registerControllers()
    {
        $this['Coverslide.RootController'] = $this->share(
            \Closure::bind(
                function () {
                    return (new RootController())
                        ->setTwig($this['twig']);
                },
                $this
            )
        );

        $this['Coverslide.FileListController'] = $this->share(
            \Closure::bind(
                function () {
                    return (new FileListController())
                        ->setRootPath($this->config->get('cbz.root', $this->rootPath));
                },
                $this
            )
        );

        $this['Coverslide.ComicController'] = $this->share(
            \Closure::bind(
                function () {
                    return (new ComicController())
                        ->setRootPath($this->config->get('cbz.root', $this->rootPath))
                        ->setDecompress($this->config->get('decompress', false));
                },
                $this
            )
        );
    }

    protected function defineRoutes()
    {
        //$this->get('/', "Coverslide.RootController:indexAction");
        $this->get('/file-list', "Coverslide.FileListController:filesAction");
        $this->get('/comic/list', "Coverslide.ComicController:listAction");
        $this->get('/comic/image', "Coverslide.ComicController:imageAction");
    }
}
