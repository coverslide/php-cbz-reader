<?php

namespace Coverslide\Controller;

use Symfony\Component\HttpFoundation\Request;
use Silex\Application;
use \Twig_Environment;

class RootController
{
    protected $twig;

    public function setTwig(Twig_Environment $twig)
    {
        $this->twig = $twig;
        return $this;
    }

    public function indexAction (Request $request)
    {
        return $this->twig->render('index.html.twig');
    }
}
