<script>
    var runConsoleChat = function()
    { 
        jQuery(document).ready(function(){
            consoleChat({chatUrl:'<?php print admin_url('admin-ajax.php') ?>?action=chat&method=chat',
                         usersOnlineUrl:'<?php print admin_url('admin-ajax.php') ?>?action=chat&method=count',
                         name:'<?php print (@wp_get_current_user()->display_name?@wp_get_current_user()->display_name:'Guest') ?>',
                         pluginDir:'<?php print cc_pluginDirUrl ?>',
                         showOnlineUsers:<?php print (get_option('cc_show_users_online')?1:0) ?>,
                         appendOpenButton:<?php print (get_option('cc_show_top_open_button')?1:0) ?>,
                         allowGuest:<?php print (get_option('cc_guest_wright_messages')?1:0) ?>,
                         allowChangeName:<?php print (get_option('cc_can_change_name')?1:0) ?>,
                         siteAuthLink:'<?php print get_option('cc_auth_link') ?>',
                         keyToOpen:'<?php print get_option('cc_key_to_open') ?>',
                         display:'<?php print get_option('cc_display') ?>',
                         width:'<?php print get_option('cc_width') ?>', 
                         shiftKey:'<?php print get_option('cc_pressed_key_to_open') ?>',
                         needPressShift:<?php print (get_option('cc_pressed_key_to_open')?1:0) ?>,
                         cssClass:'<?php print get_option('cc_design') ?>'
                     }); 
        })
    } 
    runConsoleChat(); 
</script> 
