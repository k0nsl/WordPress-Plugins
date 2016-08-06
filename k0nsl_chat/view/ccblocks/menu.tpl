<?php
$menu = array(  array(  'title'  => 'About',
                        'params' =>  array('controller' => 'ccindex',
                                           'action'     => 'index')),
                array(  'title'  => 'Options',
                        'params' =>  array('controller' => 'ccparams',
                                           'action'     => 'index')),
                array(  'title'  => 'History',
                        'params' =>  array('controller' => 'cchistory',
                                           'action'     => 'index')),
    );
?>
<ul class="subsubsub" >
        <?php
        foreach ($menu as $i => $m) {
            if ($this->_controller == $m['params']['controller'] && $this->_action == $m['params']['action']) {
                print '<li><a href="' . $this->url($m['params']) . '" class="current">' . $m['title'] . '</a>|</li>';
            } else {
                print '<li><a href="' . $this->url($m['params']) . '">' . $m['title'] . '</a>|</li>';
            }
        } ?>
</ul>
<br/><br/><br/>