<?php
class ccindex extends cc_controller {
    public function indexAction()
    {
        
    }
    public function installAction()
    {
        add_option('cc_width', '100%');
        add_option('cc_useronline_text', 'Click to Chat, online:');
        add_option('cc_welcome_message', 'joined the chatroom!');
        add_option('cc_auth_link', site_url('/wp-login.php')); 
        add_option('cc_design', 'white');  
        add_option('cc_show_users_online', 1);
        add_option('cc_show_top_open_button', 1);
        add_option('cc_guest_wright_messages', 0);
        add_option('cc_can_change_name', 0); 
        add_option('cc_key_to_open', 192); 
        add_option('cc_pressed_key_to_open', 17); 
        add_option('cc_display', 'top');  
        add_option('cc_history', 30);  
        add_option('cc_oneChatOfSite', 1);
        add_option('cc_adminPassword', 123);  
    }
}