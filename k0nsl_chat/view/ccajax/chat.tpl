<?php
/*
 * Allow remote domain support
 */
header('Access-Control-Allow-Origin: *'); // 
/*
 * Options
 */
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 'on');
$options = array('oneChatOfSite' => get_option('cc_oneChatOfSite'), 
                 'history'       => get_option('cc_history'), 
                 'adminPassword'  => get_option('cc_adminPassword')
                );

// add new online user
if (!isset($_COOKIE['chat_session'])) {
    $rand = rand(1,1000000000);
    setcookie('chat_session',md5($rand));
    $_COOKIE['chat_session'] = md5($rand);
}
if ($options['oneChatOfSite']) {
    $data = unserialize(@file_get_contents(cc_pluginDir . '/history/all'));
} else {
    $data = unserialize(@file_get_contents(cc_pluginDir . '/history/' . md5($_POST['url'])));
}
$f = fopen(cc_pluginDir . '/cache/active_users', 'a+');
fputs($f,time() . '|' . $_COOKIE['chat_session'] . "\n");
fclose($f);
if (!$data) {
    $data= array();
}

if (!$data) {
    $data= array();
}
// time now
$now = str_replace('.', '', microtime(1));
if (strlen($now) < 14) {
    $len = 14-strlen($now);
    for ($a=0;$a<$len;$a++) {
        $now.=0;
    }
}
if(isset($_POST['username']) && $_POST['username'] == 'preview-frame') {
$_POST['username'] = 'Guest';
}
if (isset($_GET['full'])) { // first resive history
    $_COOKIE['chat_last_resive'] = 0;
    if ($_POST['username'] != 'Guest' && trim($_POST['username'])) {
        if (!isset($_POST['msg']) || !$_POST['msg']) {
            $_POST['msg'] = get_option('cc_welcome_message'); 
            addMessage($now-1,$options,$data);
            $_POST['msg'] = '';
        }
    }
}
$isAdmin = isAdmin();
if (isset($_POST['msg']) && trim($_POST['msg']) && $_POST['username']) { // Add message
    addMessage($now,$options,$data,(isset($_POST['type'])?$_POST['type']:''));
} elseif (isset($_POST['admin']) && $_POST['admin']) { // Loginin as admin
    adminLogin($options,$now,$data);
} elseif (isset($_POST['admin-command'])) {
    if (!$isAdmin) {
        die('<p>You are not admin</p>');
    }
    switch ($_POST['admin-command']) {
        case 'banName':{ 
            if($_POST['name'] == 'Guest') {
                die('<p>' . $_POST['name'] . ' can\'t be banned<p>');
            }
            $exists = findInFile(cc_pluginDir . '/cache/ban.name.data', $_POST['name']); 
            if (!$exists) {
                $f=fopen(cc_pluginDir . '/cache/ban.name.data','a+');
                fputs($f,$_POST['name']);
                fclose($f);
            }
            die('<p>' . $_POST['name'] . ' banned<p>');
        }
        case 'banIp': { 
            $exists = findInFile(cc_pluginDir . '/cache/ban.ip.data', $_POST['ip']); 
            if (!$exists) {
                $f=fopen(cc_pluginDir . '/cache/ban.ip.data','a+');
                fputs($f,$_POST['ip']);
                fclose($f);
            }
            die('<p>' . $_POST['ip'] . ' banned<p>');
        }case 'unban': { 
            deleteInFile(cc_pluginDir . '/cache/ban.ip.data', $_POST['name']); 
            deleteInFile(cc_pluginDir . '/cache/ban.name.data', $_POST['name']); 
            die('<p>' . $_POST['ip'] . ' unbanned<p>');
        }case 'unbanall': { 
            @unlink(cc_pluginDir . '/cache/ban.ip.data'); 
            @unlink(cc_pluginDir . '/cache/ban.name.data'); 
            die('<p>All unbanned<p>');
        } case 'bannedips': {
            $ar = explode("\r",  @file_get_contents(cc_pluginDir . '/cache/ban.ip.data'));
            foreach ($ar as $el) {
                print '<p>' . $el . '</p>';
            }
            die;
        } case 'bannednames': {
            $ar = explode("\r",  @file_get_contents(cc_pluginDir . '/cache/ban.name.data')); 
            foreach ($ar as $el) {
                print '<p>' . $el . '</p>';
            }
            die;
        }
         case 'play': {
            $_POST['msg'] = '<script>var player = jQuery(\'#audioPlayer\')[0];
            if (player.SetVariable != undefined) {
            player.SetVariable("method:setUrl", "' . $_POST['command'] . '");
            player.SetVariable("method:play", "");
            player.SetVariable("enabled", "true");
            }
            </script>playning ' . $_POST['command'] . '!';
            addMessage($now, $options, $data);
        }
    }
}
$html = '';  

for ($a=0,$count=count($data);$count>$a;$count--) {
    if (isset($_COOKIE['chat_last_resive']) && $_COOKIE['chat_last_resive'] >= $data[$count-1]['mtime']) {
        continue;
    }
    if (isset($data[$count-1]['type']) && $data[$count-1]['type'] == 'private') {
        if ($_POST['username'] != $data[$count-1]['username'] && $_POST['username'] != $data[$count-1]['to_username']) {
            continue;
        }
        $html .= "<p>[" . date('H:i',$data[$count-1]['time']) . "]<strong>" . $data[$count-1]['username'] . ":</strong> " . $data[$count-1]['msg'] . "</p>";
    } elseif (isset($data[$count-1]['is_admin']) && $data[$count-1]['is_admin'] == 1) {
        $html .= "<p>[" . date('H:i',$data[$count-1]['time']) . "]<strong>" . $data[$count-1]['username'] . ":</strong> <b class='admin'>" . $data[$count-1]['msg'] . "</b></p>";
    } else {
        if ($isAdmin) {
            $html .= "<p id='" . $data[$count-1]['mtime'] . "'>[" . date('H:i',$data[$count-1]['time']) . "]<strong class='admin' data-user='" . json_encode($data[$count-1]) . "'>" . $data[$count-1]['username'] . ":</strong> " . $data[$count-1]['msg'] . "</p>";
        } else {
            $html .= "<p>[" . date('H:i',$data[$count-1]['time']) . "]<strong>" . $data[$count-1]['username'] . ":</strong> " . $data[$count-1]['msg'] . "</p>";
        }
    }
}

setcookie('chat_last_resive', $now);
print $html; 
function adminLogin($options,$now,$data)
{
    if ($options['adminPassword'] == $_POST['admin']) {
        $hash = md5(rand(0,100000000));
        setcookie('admin', $hash);
        getAdmins();
        $adms[] = $hash; 
        file_put_contents(cc_pluginDir. '/cache/adm.data', serialize($adms));
        die('<p>You now admin</p>');
    } else {
        print "<p>Invalid password</p>";
        die;
    }
}
function getAdmins()
{
    $adms = unserialize(@file_get_contents(cc_pluginDir . '/cache/adm.data')); 
    if (!$adms) {
        $adms = array();
    }
    return $adms;
}
function isAdmin()
{
    if (isset($_COOKIE['admin'])) { // check admin
        $adms = getAdmins();
        foreach ($adms as $adm) {
            if ($_COOKIE['admin'] == $adm) {
                return true;
            }
        }
    }
}
function addMessage($now,$options,&$data,$type = '')
{ 
    if (!isset($_SERVER['HTTP_X_REAL_IP'])) {
        $_SERVER['HTTP_X_REAL_IP'] = @$_SERVER['REMOTE_ADDR'];
    } 
    $_POST['msg'] = str_replace('\\\'','\'',$_POST['msg']);
    if($type == 'private') {
        $ar = explode(' ',$_POST['msg']);
        $username = $ar[1]; 
        $last = array('mtime' => $now,'time' => time(),'type' => 'private','to_username' => $username, 'username' => strip_tags(mb_substr($_POST['username'],0,30)),'msg' => '<b class="private">' . strip_tags(mb_substr(implode(' ',$ar),0,300)) . '</b>','ip' => $_SERVER['HTTP_X_REAL_IP']);
    } else {
        if (isAdmin()) {
            $last = array('mtime' => $now,'time' => time(), 'username' => strip_tags(mb_substr($_POST['username'],0,30)),'msg' => mb_substr($_POST['msg'],0,700),'ip' => $_SERVER['HTTP_X_REAL_IP']);
        } else {
            $last = array('mtime' => $now,'time' => time(), 'username' => strip_tags(mb_substr($_POST['username'],0,30)),'msg' => mb_substr(strip_tags($_POST['msg']),0,300),'ip' => $_SERVER['HTTP_X_REAL_IP']);
        }
    }
    /* history */
    if ($options['oneChatOfSite']) {
        $file = cc_pluginDir . '/history/all';
    } else {
        $file = cc_pluginDir . '/history/' . md5($_POST['url']);
    } 
    
    $f = fopen($file . '_full_' . date('Y-m-d'),'a+');
    fputs($f,"$last[time]|$last[username]|$last[msg]|$last[ip]\n");
    fclose($f);
    
    /* ban check */
    if(findInFile(cc_pluginDir . '/cache/ban.name.data', $last['username'])) {
        die ('<p>You are banned</p>');
        return;
    }
    if(findInFile(cc_pluginDir . '/cache/ban.ip.data', $_SERVER['HTTP_X_REAL_IP'])) {
        die ('<p>You are banned</p>');
        return;
    }
    if (isAdmin()) {
        $last['is_admin'] = 1;
    }
    for($a=0;$a<$options['history'];$a++) {
        if (!isset($data[$a])) {
            if ($last) {
                $data[$a] = $last;
            }
            break;
        } 
        $tmp = $data[$a];
        $data[$a] = $last;
        $last = $tmp; 
    } 
    file_put_contents($file,  serialize($data));
}
function findInFile($file, $text) {
    $f=@fopen($file,'r+');
    if(!$f) return;
    $exists = 0;
    while($str=fgets($f)) {
        if ($str == $text) {
            $exists = 1;
            break;
        }
    }
    fclose($f);
    return $exists;
}
function deleteInFile($file, $text)
{
    $ar = explode("\r",@file_get_contents($file));
    foreach ($ar as $i=>$el) {
        if ($el == $text) {
            unset($ar[$i]);
        }
    }
    file_put_contents($file, implode("\r", $ar));
}
