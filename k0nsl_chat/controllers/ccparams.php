<?php
class ccparams extends cc_controller {
    function indexAction()
    {
    } 
    function saveAction()
    {
        update_option('cc_width', $_POST['cc_width']);
        update_option('cc_useronline_text', $_POST['cc_useronline_text']);
        update_option('cc_welcome_message', $_POST['cc_welcome_message']);
        update_option('cc_auth_link', $_POST['cc_auth_link']); 
        update_option('cc_design', $_POST['cc_design']);  
        update_option('cc_history', $_POST['cc_history']);  
        update_option('cc_oneChatOfSite', isset($_POST['cc_oneChatOfSite']));
        update_option('cc_adminPassword', $_POST['cc_adminPassword']);  
        update_option('cc_show_users_online', isset($_POST['cc_show_users_online']));
        update_option('cc_show_top_open_button', isset($_POST['cc_show_top_open_button']));
        update_option('cc_guest_wright_messages', isset($_POST['cc_guest_wright_messages']));
        update_option('cc_can_change_name', isset($_POST['cc_can_change_name']));
        update_option('cc_key_to_open', $_POST['cc_key_to_open']);
        update_option('cc_pressed_key_to_open', $_POST['cc_pressed_key_to_open']); 
        update_option('cc_display', $_POST['cc_display']); 
    } 
}