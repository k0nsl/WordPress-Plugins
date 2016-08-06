<?php
/*
Plugin Name: Console Chat
Description: Add chat to your blog
Version: 1.01
Author: Grebennikov Pavel
Author email: nekwave@gmail.com
*/ 
add_action('admin_menu', 'ccMenu'); 
wp_enqueue_style('cc-css', plugin_dir_url(__FILE__) . 'css/styles.css');
wp_enqueue_script('cc-js', plugin_dir_url(__FILE__) . 'js/scripts.js');  
wp_enqueue_script('jquery', plugin_dir_url(__FILE__) . 'js/jquery-1.10.2.min.js', array('jquery'), '1.10.2' );
function ccMenu()
{
    include 'ccBootstrap.php';
    $obj = new ccBootstrap();
    add_menu_page('Console Chat - WP Plugin', 'Console chat', 2, 'wp-cc',array($obj,'run')); 
}
function console_data($content) {
    include 'ccBootstrap.php';
    $obj = new ccBootstrap();
    $obj->run('ccfrontend',null,1);
    return $content;
}
function console_ajax()
{
    include 'ccBootstrap.php';
    $obj = new ccBootstrap();
    if ($_GET) {
        $_POST+=$_GET;
    }
    $obj->run('ccajax',$_GET['method'],1);  
    die;
}
function cc_install() {
    include 'ccBootstrap.php';
    $obj = new ccBootstrap();
    $obj->run('ccindex','install',1);  
}
register_activation_hook( __FILE__, 'cc_install');
add_action( 'wp_ajax_nopriv_chat', 'console_ajax');
add_action( 'wp_ajax_chat', 'console_ajax');
add_filter( 'wp_head', 'console_data' );
?>
