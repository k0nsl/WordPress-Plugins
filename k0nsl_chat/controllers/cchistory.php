<?php
class cchistory extends cc_controller {
    public function indexAction()
    {
        $dir = cc_pluginDir . "/history/"; 
        $files = array();
        if (is_dir($dir)) {
           if ($dh = opendir($dir)) {
               while (($file = readdir($dh)) !== false) {
                   if ($file != '.' && $file != '..' && $file != 'all')
                       $files[] = $file;
               }
               closedir($dh);
           }
        }
        $this->files = $files;
        if (isset($_GET['file'])) {
            $data = explode("\n",@file_get_contents($dir . str_replace('/','',$_GET['file'])));
            foreach ($data as &$el) {
                $time = strtok($el,'|');
                $el = str_replace($time,date('H:i',$time),$el);
            }
            $this->data = implode('<br>',$data);
        }
    } 
}