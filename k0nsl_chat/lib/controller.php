<?php
class cc_controller {
    var $_data = array();
    var $_renderFile;
    var $_action;
    var $_controller;
    function __construct() {
        if (!isset($_SERVER['HTTP_X_REAL_IP'])) {
            $_SERVER['HTTP_X_REAL_IP'] = $_SERVER['REMOTE_ADDR'];
        }
        $this->_controller = (isset($_GET['controller'])?$_GET['controller']:'index');
        $this->_action = (isset($_GET['action'])?$_GET['action']:'index');
    }
    function __set($name, $value) {
        $this->_data[$name] = $value;
    }
    function __get($name) {
        if (isset($this->_data[$name])) {
            return $this->_data[$name];
        }
    }
    function setRender($controller, $action)
    {
        $this->_renderFile = 'view/' . $controller . '/' . $action . '.tpl';
    }
    function renderLayout()
    { 
        include(cc_pluginDir . '/' . 'layout/index.tpl');
    }
    function render($file = false) {
        if ($file) {
            include cc_pluginDir . '/view/' . $file;
        } else {
            include cc_pluginDir . '/' . $this->_renderFile;  
        }
    }
    function url($params)
    {
        $tmp = $_GET;
        foreach ($tmp as $key => $param) {
            if (isset($params[$key])) {
                $tmp[$key] = $params[$key];
                unset($params[$key]);
            }
        }
        $params = $params+$tmp; 
        $url = '?';
        $i = 0;
        foreach ($params as $key => $param) {
            if ($i) $url .= '&';
            $url .= $key . '=' . $param;
            $i++;
        }
        return $url;
    }
}