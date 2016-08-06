<?php
class ccajax extends cc_controller {
    function chatAction()
    {
        
    } 
    function countAction()
    {
        $f = @fopen(cc_pluginDir . '/cache/active_users','r+');
        $users = array();
        $data = '';
        while ($str = @fgets($f)) {
            if (strtok($str,'|') > (time()-20)) { 
                if (array_search($tmp = strtok(''), $users) === false) {
                    $users[] = $tmp;
                    $data .= $str;
                } 
            } 
        }
        @fclose($f);
        @file_put_contents(cc_pluginDir . '/cache/active_users', $data);
        die(get_option('cc_useronline_text') . count($users));
    }
}