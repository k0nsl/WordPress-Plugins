<?php
//error_reporting(E_ALL);
//ini_set("display_errors", 1);  
define('cc_pluginDirUrl', plugin_dir_url(__FILE__));
define('cc_pluginDir', dirname(__FILE__));
include_once cc_pluginDir . '/lib/controller.php';  
class ccBootstrap { 
    var $_route; 
    function run($controller = false,$action=false,$noLayout = false)
    {
        if ($controller && file_exists(dirname(__FILE__)  . '/controllers/'.preg_replace("/[^a-zA-Z0-9]+/", "", $controller) . '.php')) {
            $this->_route['controller'] = preg_replace("/[^a-zA-Z0-9]+/", "", $controller);
        } elseif (isset($_GET['controller']) && preg_replace("/[^a-zA-Z0-9]+/", "", $_GET['controller']) && file_exists(dirname(__FILE__)  . '/controllers/'.preg_replace("/[^a-zA-Z0-9]+/", "", $_GET['controller']) . '.php')) {
            $this->_route['controller'] = preg_replace("/[^a-zA-Z0-9]+/", "", $_GET['controller']);
        } else {
            $this->_route['controller'] = 'ccindex';
        }
        if ($action && preg_replace("/[^a-zA-Z0-9]+/", "", $action)) {
            $this->_route['action'] = preg_replace("/[^a-zA-Z0-9]+/", "", $action);
        } elseif (isset($_GET['action']) && preg_replace("/[^a-zA-Z0-9]+/", "", $_GET['action'])) {
            $this->_route['action'] = preg_replace("/[^a-zA-Z0-9]+/", "", $_GET['action']);
        } else {
            $this->_route['action'] = 'index';
        } 
        include cc_pluginDir . '/controllers/'.preg_replace("/[^a-zA-Z0-9]+/", "", $this->_route['controller']) . '.php';
        $controller = new $this->_route['controller']; 
        $controller->setRender($this->_route['controller'], $this->_route['action']);
        $method = $this->_route['action'] . 'Action'; 
        $controller->$method();
        if (!$noLayout) {
            $controller->renderLayout();
        } else {
            $controller->render();
        }
    }
    function events()
    {
        
    }
}
