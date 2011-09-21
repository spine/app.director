<?php

class DirectorAppController extends AppController {

  var $name = 'DirectorApp';
  var $uses = array('Gallery', 'Album', 'Image');
  var $helpers = array('Js');

  function beforeFilter() {
    Configure::write('debug', 0);
    $this->autoRender = true;
    $this->layout = 'director_layout';
    $this->Auth->allowedActions = array('index');
  }

  function index() {
    $this->Gallery->recursive = 1;
    $galleries = $this->Gallery->find('all', array('fields' => array('id', 'name', 'author', 'description')));
    $albums = $this->Album->find('all', array('fields' => array('id', 'name', 'title', 'description')));
    $images = $this->Image->find('all', array('fields' => array('id', 'title', 'exif', 'description')));
    //$json = $this->requestAction(array('controller' => 'galleries', 'action' => 'index'));
    $this->set(compact('galleries', 'albums', 'images'));
    //$this->log($json, LOG_DEBUG);
    //$this->render(SIMPLE_JSON, 'ajax');
    //$json = $set('json', $js->object($json));
  }
}

?>