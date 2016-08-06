/* 
 * Developer: Pavel Grebennikov, nekwave@gmail.com
 */
var myListener = new Object(); 
var consoleChat = function(options) { 
    var self = this.consoleChat; 
    self.keyToOpen = options.keyToOpen; //`     (Key codes you can watch at http://help.adobe.com/en_US/AS2LCR/Flash_10.0/help.html?content=00000520.html)
    self.shiftKey = options.shiftKey; //16 - shift, 17 - control
    self.needPressShift = options.needPressShift; // 0 - do't need press two buttons for open
    self.chatUrl = options.chatUrl; // request new messages and send youres
    self.usersOnlineUrl = options.usersOnlineUrl; // request new messages and send youres
    self.username = options.name; //guest name
    self.pluginDir = options.pluginDir;
    self.cssClass = options.cssClass; // '', 'white', 'black'
    self.allowGuest = options.allowGuest; // Send user to auth on site
    self.siteAuthLink = options.siteAuthLink;// Auth link
    self.showOnlineUsers = options.showOnlineUsers; 
    if (name != undefined && name) {
        self.username = name;
    } 
    self.appendOpenButton = 1; // add button on page header to open the chat
    self.resives = 0; // count ajax requests for recive history
    self.messages = new Array(); // history of sended messages
    self.updateTimer = 5000; // time for request history (defaule 5sec)
    self.allowChangeName = options.allowChangeName; // allow change name
    self.soundEnabled = 1;
    
    if (self.username == 'Guest') {
        if (getCookie('chat_last_name')) {
            self.username = getCookie('chat_last_name');
        }
    }
    self.shiftPressed = false;
    jQuery('#wpadminbar').css('z-index',254);
    if (self.showOnlineUsers) {
        jQuery(document.body).append('<div id="chat-button2"><div id="chat-status"><p>Loading...</p></div></div>'); 
        jQuery('#chat-button2').on('click',function() {
            self.toggle();
        });
    }
    if (self.appendOpenButton) {
        jQuery(document.body).append('<div id="chat-button"></div>');
        jQuery('#chat-button').on('click',function(){
            self.toggle();
        });
    }
    self.getUsersOnline = function(){
        if (jQuery('#chat-button2').css('display') != 'none') {
            jQuery('#chat-status p').load(self.usersOnlineUrl);
        }
        setTimeout(self.getUsersOnline,10000);
    }
    self.getUsersOnline();
    jQuery(document).on('keydown',function(event) { 
        if (self.displayed) {
            self.input.focus();
        }
        if (self.needPressShift) { // save, shift is down
            if(event.keyCode == self.shiftKey) { 
                self.shiftPressed = true;
            }
        }
    })
    jQuery(document).on('keyup',function(event) {
        if (self.needPressShift) { // save, shift is up
            if(event.keyCode == self.shiftKey) { 
                self.shiftPressed = false;
            }
        } 
        if(event.keyCode == self.keyToOpen) {
            if ((self.needPressShift && self.shiftPressed) || !self.needPressShift) { 
                self.toggle();
            } 
        }
    });
    self.displayed = false;
    self.toggle = function() {
        if (self.displayed) { //hide 
            self.displayed = false;
            self.getNewHistory(1);
            jQuery('#chat').hide();
            jQuery('#chat-button').show();
            jQuery('#chat-button2').show();
        } else { // show
            if (!self.created) {
                self.getNewHistory(0,!self.created); 
                self.create();
            } else {
                self.historyUpdateTime = setTimeout('window.consoleChat.getNewHistory(0);', self.updateTimer);
            }
            jQuery('#chat').show();
            self.displayed = true; 
            jQuery('#chat-button').hide();
            jQuery('#chat-button2').hide();
            self.input.focus();
        }
    }
    self.created = false;
    self.input = false;
    self.nowSend = false; 
    self.selectedText = 0;
    self.isAdmin = false;
    self.lastMsg = '';
    jQuery(document).ajaxStart(function() { 
        self.nowSend = 1;
    }); 
    jQuery(document).ajaxStop(function() { 
        self.nowSend = 0;
    }); 
    jQuery.postChat = function(url, data, callback, type) {  
        if (self.nowSend == 1) {
            setTimeout(function(){ 
                jQuery.postChat(url, data, callback, type);
            },100); 
        } else {
            jQuery.post(url, data, callback, type);
        }
    }
    self.sound = function(){
        if (self.soundEnabled) {
            if(!jQuery('#audioPlayer').length) {
                var html = '<object id="audioPlayer" name="audioPlayer" type="application/x-shockwave-flash" data="'+self.pluginDir+'flash/player.swf" width="1" height="1"><param name="movie" value="'+self.pluginDir+'flash/player.swf" /><param name="AllowScriptAccess" value="always" /><param name="FlashVars" value="listener=myListener&amp;interval=500" /></object>';
                jQuery('#chat').after(html);  
                myListener.onInit = function()
                {
                    this.position = 0;
                }; 
                myListener.onUpdate = function()
                {
                    if (this.isPlaying == 'false') {
                        current_play_id = 0;
                    }
                }; 

            }
            var player = jQuery('#audioPlayer')[0]; 
            if (player.SetVariable == undefined) { // flash block
                return;
            }
            player.SetVariable("method:setUrl",self.pluginDir+'flash/sound.mp3' );
            player.SetVariable("method:play", "");
            player.SetVariable("enabled", "true"); 
            //http://f11.pleer.com/0957abbeb666579b7724cfe2c403b43d90b2a23f22aa86c5c3035480ec7ed511800aa57b6060f196136183af6d57834f5bb55f38709b384fd427b447b955cd2a3868ac7d1e3f51435de589188d1081/34ae31cbc3.mp3

        }
    }
    self.create = function(){
        self.created = true; 
        var margin = '';
        if (parseInt(options.width) < 100) {
            margin = 'margin-left: '+((100-parseInt(options.width))/2)+'% !important;'
        }
        var position = 'top:0;'
        if (options.display != 'top') {
            position = 'bottom:0;';
        }
        self.input = jQuery(document.body).append('<div id="chat" class="'+self.cssClass+'" style="width:'+options.width+';'+margin+position+'height:'+(jQuery(window).height()/2.2)+'px !important;"><div class="chat_history"></div>><input type="text"/><a href="#" class="close_chat"></a></div>').find('#chat input');
        jQuery(self.input).val('Welcome to the chatroom! Say something...');
        setTimeout(function(){
            jQuery(self.input).val('');
        },1000);
        jQuery('#chat .close_chat').on('click',function(){
            self.toggle();
            return false;
        });
        self.input.on('keydown',function(event){
            if(event.keyCode == 38) { 
                if (self.messages[self.selectedText] != undefined) {
                    jQuery(this).val(self.messages[self.selectedText]);
                    self.selectedText--;
                } else {
                    if (!self.selectedText) return;
                    self.selectedText = self.messages.length-1;
                    jQuery(this).val(self.messages[self.selectedText]);
                }
            }
            if(event.keyCode == 40) { 
                if (self.messages[self.selectedText] != undefined) {
                    jQuery(this).val(self.messages[self.selectedText]);
                    self.selectedText++;
                } else {
                    if (!self.selectedText) return;
                    self.selectedText = 0;
                    jQuery(this).val(self.messages[self.selectedText]);
                }
            }
            if(event.keyCode == 13){ // enter press
                if (self.username == 'Guest' && !self.allowGuest) {
                    jQuery('#chat .chat_history').append('<p><a href="'+self.siteAuthLink+'">Login to Chat</a></p>');
                    self.scrollChat();
                    return;
                }
                var text = this.value;
                this.value = '';
                for (var i in self.commands) {
                    if (text.indexOf(self.commands[i].name, 0) === 0) {
                        self.nowSend = 0;
                        self.value = '';
                        return self.commands[i].func(text);
                    }
                }
                self.sendMessage(text);
                
            }
        });
    }
    self.com = {
        help:function(){
            jQuery('#chat .chat_history').append('<p>/help - watch this text</p>');
            jQuery('#chat .chat_history').append('<p>/name - change name</p>');
            jQuery('#chat .chat_history').append('<p>/sound - on/off sound</p>');
            jQuery('#chat .chat_history').append('<p>/admin - try to login as admin</p>');
            jQuery('#chat .chat_history').append('<p>/ban - ban</p>');
            jQuery('#chat .chat_history').append('<p>/w %username% %message% - private message</p>');
            jQuery('#chat .chat_history').append('<p>/banip - ban ip</p>');
            jQuery('#chat .chat_history').append('<p>/play - play sound</p>');
            jQuery('#chat .chat_history').append('<p>/unban - unban ip or name</p>');
            jQuery('#chat .chat_history').append('<p>/unbanall - Unban all names and ips</p>');
            jQuery('#chat .chat_history').append('<p>/bannednames - show all banned names</p>');
            jQuery('#chat .chat_history').append('<p>/bannedips - show all banned ips</p>');
            self.scrollChat();
        },
        name:function(command){
            if (!self.allowChangeName) {
                jQuery('#chat .chat_history').append('<p>Change name is not allowed</p>');
                self.scrollChat();
                return;
            }
            var name = jQuery.trim(command.replace('/name', ''));
            if (name.length > 2) {
                self.sendMessage('Change name to ' + name + '',1);
                self.username = name; 
                setCookie('chat_last_name', name)
            } else {
                jQuery('#chat .chat_history').append('<p>Name is to short. Min length is 3</p>');
                self.scrollChat();
            }
        },
        admin:function(command){
            var password = jQuery.trim(command.replace('/admin', ''));
            jQuery.postChat(self.chatUrl,{
                url:document.location.href,
                'admin':password,
                'username':self.username
            },function(data){ 
                if (data) {
                    self.resiveChat(data);
                    self.scrollChat();
                } 
            });
        },
        ban: function(command){
            var name = jQuery.trim(command.replace('/ban', ''));
            jQuery.postChat(self.chatUrl,{
                url:document.location.href,
                'admin-command':'banName',
                name:name,
                'username':self.username
            },function(data){
                self.resiveChat(data);
                self.scrollChat();
            });
        },
        play: function(command){ 
            var command = jQuery.trim(command.replace('/play', ''));
            jQuery.postChat(self.chatUrl,{
                url:document.location.href,
                'admin-command':'play',
                'username':self.username,
                command:command
            },function(data){
                jQuery('#chat .chat_history').append(data);
                self.scrollChat();
            });
        },
        sound: function(command){ 
            if(self.soundEnabled) {
                self.soundEnabled = 0;
                jQuery('#chat .chat_history').append('<p>Sound off</p>');
                self.scrollChat();
            } else {
                self.soundEnabled = 1;
                Query('#chat .chat_history').append('<p>Sound on</p>');
                self.scrollChat();
            }
        },
        banip: function(command){
            var ip = jQuery.trim(command.replace('/banip', ''));
            jQuery.postChat(self.chatUrl,{
                url:document.location.href,
                'admin-command':'banIp',
                ip:ip
            },function(data){
                jQuery('#chat .chat_history').append(data);
                self.scrollChat();
            });
        },
        unban: function(command){
            var name = jQuery.trim(command.replace('/unban', ''));
            jQuery.postChat(self.chatUrl,{
                url:document.location.href,
                'admin-command':'unban',
                name:name
            },function(data){
                jQuery('#chat .chat_history').append(data);
                self.scrollChat();
            });
        },
        unbanall: function(command){ 
            jQuery.postChat(self.chatUrl,{
                url:document.location.href,
                'admin-command':'unbanall'
            },function(data){
                jQuery('#chat .chat_history').append(data);
                self.scrollChat();
            });
        },
        bannedips: function(command){ 
            jQuery.postChat(self.chatUrl,{
                url:document.location.href,
                'admin-command':'bannedips'
            },function(data){
                jQuery('#chat .chat_history').append(data);
                self.scrollChat();
            });
        },
        bannednames: function(command){ 
            jQuery.postChat(self.chatUrl,{
                url:document.location.href,
                'admin-command':'bannednames'
            },function(data){
                jQuery('#chat .chat_history').append(data);
                self.scrollChat();
            });
        },
        clear: function(command){ 
            jQuery('#chat .chat_history').html('');
        },
        privateMsg: function(command) {
            jQuery.postChat(self.chatUrl,{
                url:document.location.href,
                'type':'private',
                'msg':command,
                username:self.username
            },function(data){
                jQuery('#chat .chat_history').append(data);
                self.scrollChat();
            });
        }
    }
    self.scrollChat = function(){
        jQuery('#chat .chat_history').animate({
            scrollTop:100000000
        },0);
    }
    self.commands = new Array({
        name:'/help',
        func:self.com.help
    },

    {
        name:'/name',
        func:self.com.name
    },
    
    {
        name:'/w',
        func:self.com.privateMsg
    },

    {
        name:'/admin',
        func:self.com.admin
    },

    {
        name:'/banip',
        func:self.com.banip
    },

    {
        name:'/bannedips',
        func:self.com.bannedips
    },

    {
        name:'/bannednames',
        func:self.com.bannednames
    },

    {
        name:'/ban',
        func:self.com.ban
    },
    {
        name:'/sound',
        func:self.com.sound
    },

    {
        name:'/unbanall',
        func:self.com.unbanall
    },

    {
        name:'/clear',
        func:self.com.clear
    },

    {
        name:'/cls',
        func:self.com.clear
    },
    {
        name:'/play',
        func:self.com.play
    },

    {
        name:'/unban',
        func:self.com.unban
    });
    
    self.sendMessage = function(text,dontSave) {  
        if (dontSave==undefined || dontSave != 1) {
            self.messages[self.messages.length] = text; 
        }
        jQuery.postChat(self.chatUrl,{
            url:document.location.href,
            'msg':text,
            'username':self.username
        },function(data){ 
            self.resiveChat(data);
        });
    }
    self.historyUpdateTime = false;
    self.getNewHistory = function(stop,full){
        if (stop) {
            clearTimeout(self.historyUpdateTime)
        } else {  
            self.historyUpdateTime = setTimeout('window.consoleChat.getNewHistory(0);', self.updateTimer);
            if (full != undefined && full) {
                jQuery.postChat(self.chatUrl+'&full',{
                    url:document.location.href,
                    'username':self.username
                },self.resiveChat);
            } else {
                jQuery.postChat(self.chatUrl,{
                    url:document.location.href,
                    'username':self.username
                },self.resiveChat);
            }
            
        }
    }
    self.resiveChat = function(data,clear) {
        if(jQuery(data).find('strong').length) {
            self.sound();
        }
        if (clear != undefined && clear == 1) {
            jQuery('#chat .chat_history').html('');
        }
        clearTimeout(self.historyUpdateTime);
        self.historyUpdateTime = setTimeout('window.consoleChat.getNewHistory(0);', self.updateTimer);
        if (self.resives == 0) {
            if (self.username == 'Guest' && !self.allowGuest) {
                jQuery('#chat .chat_history').append(data+'<p><a href="'+self.siteAuthLink+'">Login to Chat</a></p>');
            } else {
                jQuery('#chat .chat_history').append(data+'<p>Try /help for watch commands</p>');
            }
        } else {
            jQuery('#chat .chat_history').append(data);
        }
        jQuery('#chat .chat_history p strong').off('click',self.appendAdminMenu);
        jQuery('#chat .chat_history p strong').on('click',self.appendAdminMenu);
        self.scrollChat();
        self.nowSend = 0;
        self.resives++;
    }
    self.appendAdminMenu = function(){
        if (jQuery('#chat .chat_history').next().data('submenu')) {
            jQuery('#chat .chat_history').next().remove();
        }
        console.log(jQuery(this).data('user'));
        var data = jQuery(this).data('user');
        var menu = '[<a href="#" onclick="jQuery(this).parent().remove();return false;">x</a>]<br/>'; 
        menu += '<a href="#" onclick="chatAdmin.banName(\''+data.username+'\');return false;">Ban name '+data.username+'</a><br/>';
        menu += '<a href="#" onclick="chatAdmin.banIp(\''+data.ip+'\');return false;">Ban ip '+data.ip+'</a>';
        jQuery('#chat .chat_history').after('<div class="chat-modal" data-submenu="1">'+menu+'</div>');
    }
}
var chatAdmin = {
    deleteMessage: function(id) {
        jQuery('#'+id).html('deleted');
        jQuery.postChat(self.chatUrl,{
            url:document.location.href,
            'admin-command':'deleteMsg',
            id:id
        },function(data){
            jQuery('#chat .chat_history').append(data);
        });
    },
    banName: function(name){
        jQuery.postChat(self.chatUrl,{
            url:document.location.href,
            'admin-command':'banName',
            name:name
        },function(data){
            jQuery('#chat .chat_history').append(data);
        });
    },
    banIp: function(ip){
        jQuery.postChat(self.chatUrl,{
            url:document.location.href,
            'admin-command':'banIp',
            ip:ip
        },function(data){
            jQuery('#chat .chat_history').append(data);
        });
    }
}


function getCookie(c_name)
{
    var c_value = document.cookie;
    var c_start = c_value.indexOf(" " + c_name + "=");
    if (c_start == -1)
    {
        c_start = c_value.indexOf(c_name + "=");
    }
    if (c_start == -1)
    {
        c_value = null;
    }
    else
    {
        c_start = c_value.indexOf("=", c_start) + 1;
        var c_end = c_value.indexOf(";", c_start);
        if (c_end == -1)
        {
            c_end = c_value.length;
        }
        c_value = unescape(c_value.substring(c_start,c_end));
    }
    return c_value;
}

function setCookie(c_name,value,exdays)
{
    var exdate=new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
    document.cookie=c_name + "=" + c_value;
}
