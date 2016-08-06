<form method="post" action="<?php print $this->url(array('action' => 'save','controller' => 'ccparams')); ?>">
<h2>Backend</h2>
<table>
<tr>
    <td width="300px">
        Chat history limit:
    </td>
    <td>
        <input type="text" name="cc_history" value="<?php print get_option('cc_history') ?>"/><br/><i>Messages</i>
    </td>
</tr>
<tr>
    <td>
        One chat for all pages:
    </td>
    <td>
        <input type="checkbox" name="cc_oneChatOfSite" value="1" <?php if(get_option('cc_oneChatOfSite')) print 'checked' ?> /><br><i>If not checked - in all pages has been unique chat history</i>
    </td>
</tr>
<tr>
    <td>
        Admin password:
    </td>
    <td>
        <input type="text" name="cc_adminPassword" value="<?php print get_option('cc_adminPassword') ?>"/>
    </td>
</tr>

</table>
<h2>Frontend</h2>
<table>
    <tr>
        <td width="300px">
            Width:
        </td>
        <td>
            <input type="text" name="cc_width" value="<?php print get_option('cc_width') ?>"/>
        </td>
    </tr>
    <tr>
        <td>
            Display on:
        </td>
        <td>
    <lable><input type="radio" name="cc_display" value="top" <?php if(get_option('cc_display') == 'top') print 'checked' ?> /> top</lable><br/>
    <label><input type="radio" name="cc_display" value="bottom" <?php if(get_option('cc_display') == 'bottom') print 'checked' ?>/> bottom</lable>
        </td>
    </tr>
    <tr>
        <td>
            Show count of users online:
        </td>
        <td>
            <input type="checkbox" name="cc_show_users_online" <?php if(get_option('cc_show_users_online')) print 'checked' ?>/>
        </td>
    </tr>
    <tr>
        <td>
            Text on %useronline% box:
        </td>
        <td>
            <input type="text" name="cc_useronline_text" value="<?php print get_option('cc_useronline_text') ?>"/>
        </td>
    </tr>
    <tr>
        <td>
            Welcome message:
        </td>
        <td>
            <input type="text" name="cc_welcome_message" value="<?php print get_option('cc_welcome_message') ?>"/>
        </td>
    </tr>
    <tr>
        <td>
            Show top open button:
        </td>
        <td>
            <input type="checkbox" name="cc_show_top_open_button" <?php if(get_option('cc_show_top_open_button')) print 'checked' ?>/>
        </td>
    </tr>
    <tr>
        <td>
            Can gusets wright messages:
        </td>
        <td>
            <input type="checkbox" name="cc_guest_wright_messages" <?php if(get_option('cc_guest_wright_messages')) print 'checked' ?>/>
        </td>
    </tr>
    <tr>
        <td>
            Can users\guests change name:
        </td>
        <td>
            <input type="checkbox" name="cc_can_change_name" <?php if(get_option('cc_can_change_name')) print 'checked' ?>/>
        </td>
    </tr>
    <tr>
        <td>
            Link to auth:
        </td>
        <td>
            <input type="text" name="cc_auth_link" value="<?php print get_option('cc_auth_link') ?>"/>
        </td>
    </tr>
    <tr>
        <td>
            Key to open:
        </td>
        <td>
            <input type="text" name="cc_key_to_open" value="<?php print get_option('cc_key_to_open') ?>" class="watch_keys" onkeyup="this.value=event.keyCode;" onfocus="this.value=''"/>
            
        </td>
    </tr>
    <tr>
        <td>
            Pressed key to open:
        </td>
        <td>
            <input type="text" name="cc_pressed_key_to_open" value="<?php print get_option('cc_pressed_key_to_open') ?>" class="watch_keys" onkeyup="this.value=event.keyCode;" onfocus="this.value=''"/>
        </td>
    </tr>
    <tr>
        <td>
            Design:
        </td>
        <td>
            <input type="radio" name="cc_design" value="" <?php if(get_option('cc_design') == '') print 'checked' ?> />green<br/>
            <input type="radio" name="cc_design" value="white" <?php if(get_option('cc_design') == 'white') print 'checked' ?>/>white<br/>
            <input type="radio" name="cc_design" value="black" <?php if(get_option('cc_design') == 'black') print 'checked' ?>/>black
        </td>
    </tr>
    <tr>
        <td>
            
        </td>
        <td>
            <input type="submit" value="Save"/>
        </td>
    </tr>
</table>
</form> 