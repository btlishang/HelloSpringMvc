// 直播
var live = {
    start: function (userid,classroomid,courseid) {
        var params = {
            userid: userid,
            classroomid: classroomid,
            courseid: courseid
        }
        $.ajax({
            type: 'GET',
            url: '${webpath}/classroom/startlive',
            dataType: 'json',
            data: params,
            success: function(data) {
                $.longAlert({
                    msg: "直播开启成功！",
                    alert: {
                        alertevent: function() {
                            var content = {};
                            content.content = '{"data":{"content":"","formUid":"'+userid+'","num":1,"targetId":"'+liveid+'", "toUid":0},"isApp":false,"type":4}';
                            sendMessageToChatroom('text', content);
                            window.location.reload();
                        }
                    }
                });
            },
            error: function(xhr, type) {
            }
        });
    },
    end: function (userid,classroomid,courseid) {
        var params = {
            userid: userid,
            classroomid: classroomid,
            courseid: courseid
        }
        $.ajax({
            type: 'GET',
            url: '${webpath}/classroom/endlive',
            dataType: 'json',
            data: params,
            success: function(data) {
                if(data.code == 0){
                    $.longAlert({
                        msg: "直播已结束！",
                        alert: {
                            alertevent: function() {
                                var content = {};
                                content.content = '{"data":{"content":"","formUid":"'+userid+'","num":1,"targetId":"'+liveid+'", "toUid":0},"isApp":false,"type":6}';
                                sendMessageToChatroom('text', content);
                                window.location.reload();
                            }
                        }
                    });
                }
            },
            error: function(xhr, type) {
            }
        });
    }
}

$(function() {
    // 礼物列表效果
    $('.roomplay-gift').on({
        mouseover: function() {
            $('#gift-pop').show();
        },
        mouseout: function() {
            if (isMouseLeaveOrEnter(event, this)) {
                $('#gift-pop').hide().removeClass('gift1').removeAttr('style');
            }
        }
    });
    // 礼物预览
    $('.roomplay-gift .gift').on({
        mouseover: function() {
            var index = $(this).index();
            var cont = $(this).data("content");

            $('#gift-pop').removeClass('gift1').css('left', 58 * index - 40 + 'px');

            $('#gift-pop .pic').attr('src', cont[0]);
            $('#gift-pop .name').text(cont[1]);
            $('#gift-pop .num').text(cont[2] + '龙币');
            $('#gift-pop .giftid').val(cont[3]);
        }
    });
});
// 送礼物
function givegift () {
    var params = {};
    var giftid = $('#gift-pop .giftid').val()
    params.giftid = giftid;
    params.touid = userid;
    params.classroomid = classroomid;
    $.ajax({
        type: 'GET',
        url: '/classroom/givegift',
        dataType: 'json',
        data: params,
        success: function(data) {
            $.longAlert({
                msg: "礼物赠送成功",
                alert: {
                    alertevent: function() {
                        // window.location.reload();
                        var content = {};
                        content.content = '{"data":{"content":"","formUid":"'+userid+'","num":1,"targetId":"'+liveid+'","giftId": "'+giftid+'", "toUid":0},"isApp":false,"type":3}';

                        if (courseStatus == 1) {
                            sendMessageToChatroom('text', content);
                        }
                    }
                }
            });
        },
        error: function(xhr, type) {
            $.longAlert({ msg: "网络连接失败，请重新尝试" });
        }
    });
}

// 加入聊天室
function enterChatroom(){
    var start = new Date().getTime();
    RongIMClient.getInstance().joinChatRoom(chatRoomId, count, {
        onSuccess: function(res) {
            showResult("加入聊天室成功",null,start);
        },
        onError: function(error) {
            showResult("加入聊天室失败",null,start);
        }
    });
}
// 退出聊天室
function quitChatroom(){
    var start = new Date().getTime();
    RongIMClient.getInstance().quitChatRoom(chatRoomId, {
        onSuccess: function() {
            showResult("退出聊天室成功",null,start);
        },
        onError: function(error) {
            showResult("退出聊天室失败",null,start);
        }
    });
}
// 发送聊天室消息
function sendMessageToChatroom(type, content){
    var content = content;
        content.user = userinfo;
    if (type == "text") {
        var msg = new RongIMLib.TextMessage(content);
    }
    if (type == "image") {
        var msg = new RongIMLib.ImageMessage(content);
    }

    var tpl = '<div class="livetv-im-item my">' +
                    '<img src="{avatar}" class="avatar">' +
                    '<div class="author">{name}</div>' +
                    '<div class="cont">{content}</div>' +
                '</div>'
    var tipTpl = '<div class="livetv-im-item tip">' +
                '<div class="cont">{content}</div>' +
            '</div>';
    var conversationType = RongIMLib.ConversationType.CHATROOM;
    var start = new Date().getTime();
    RongIMClient.getInstance().sendMessage(conversationType, chatRoomId, msg, {
        onSuccess: function (message) {
            var user = message.content.user;
            switch(message.content.messageName){
                case "TextMessage":
                    console.log(message.content.content);
                    var content = JSON.parse(message.content.content);
                    if (content.type == 1) {
                        var html = tpl.replace(/\{avatar}/g, user.portrait);
                            html = html.replace(/\{name}/g, user.name);
                            html = html.replace(/\{content}/g, content.data.content);
                    }
                    else if (content.type == 3) {
                        var giftname = getGiftName("g" + content.data.giftId);
                        var html = '<div class="livetv-im-item tip">' +
                                        '<div class="cont">' + user.name + '送给老师'+ giftname +'</div>' +
                                    '</div>';
                    }
                    else if (content.type == 4) {
                        var html = tipTpl.replace(/\{content}/g, "老师已开始直播");
                    }
                    else if (content.type == 6) {
                        var html = tipTpl.replace(/\{content}/g, "直播已结束");
                    }
                    $("#im-items").append(html);
                    break;
                case "ImageMessage":
                    var html = tpl.replace(/\{avatar}/g, user.portrait);
                        html = html.replace(/\{name}/g, user.name);
                        html = html.replace(/\{content}/g, '<li><a href="' + message.content.imageUri + '" target="_blank"><img src="data:image/jpeg;base64,' + message.content.content + '" /></a>');
                    $("#im-items").append(html);
                    break;
                default:
            }
            scrollBottom();
            $('#text').val('');
            showResult("发送聊天室消息成功", message);
        },
        onError: function (errorCode, message) {
            showResult("发送聊天室消息失败", message);
        }
    });
}

// 初始化
function chatroomInit(params, callbacks, modules ){
    var appKey = params.appKey;
    var token = params.token;

    RongIMLib.RongIMClient.init(appKey);
    // 连接状态监听器
    RongIMClient.setConnectionStatusListener({
        onChanged: function (status) {
            switch (status) {
                case RongIMLib.ConnectionStatus.CONNECTED:
                    console.log('链接成功');
                    enterChatroom();
                    break;
                case RongIMLib.ConnectionStatus.CONNECTING:
                    console.log('正在链接');
                    break;
                case RongIMLib.ConnectionStatus.DISCONNECTED:
                    console.log('断开连接');
                    break;
                case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
                    console.log('其他设备登录');
                    break;
                case RongIMLib.ConnectionStatus.DOMAIN_INCORRECT:
                    console.log('域名不正确');
                    break;
                case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
                    console.log('网络不可用');
                    break;
            }
        }
    });
    // 消息监听器
    RongIMClient.setOnReceiveMessageListener({
        // 接收到的消息
        onReceived: function (message) {
            var tpl = '<div class="livetv-im-item">' +
                            '<img src="{avatar}" class="avatar">' +
                            '<div class="author">{name}</div>' +
                            '<div class="cont">{content}</div>' +
                        '</div>';
            var tipTpl = '<div class="livetv-im-item tip">' +
                            '<div class="cont">{content}</div>' +
                        '</div>';
            console.log(message);
            var user = message.content.user;
            // 判断消息类型
            switch(message.messageType){
                case RongIMClient.MessageType.TextMessage:
                    if (!liveConfig.isChat) return false; //禁止聊天
                    var content = JSON.parse(message.content.content);
                    if (content.type == 1) {
                        var html = tpl.replace(/\{avatar}/g, user.portrait||user.icon);
                            html = html.replace(/\{name}/g, user.name);
                            html = html.replace(/\{content}/g, content.data.content);
                    }
                    else if (content.type == 3) {
                        var giftname = getGiftName("g" + content.data.giftId);
                        var cont = user.name + '送给老师'+ giftname;
                        var html = tipTpl.replace(/\{content}/g, cont);
                    }
                    else if (content.type == 4) {
                        var html = tipTpl.replace(/\{content}/g, "老师开始直播");
                    }
                    else if (content.type == 5) {
                        var html = tipTpl.replace(/\{content}/g, "老师离开直播间");
                    }
                    else if (content.type == 6) {
                        var html = tipTpl.replace(/\{content}/g, "直播已结束");
                    }
                    else if (content.type == 10) {
                        var html = tipTpl.replace(/\{content}/g, "老师进入");
                    }
                    else if (content.type == 11) {
                        var html = tipTpl.replace(/\{content}/g, "教室已允许聊天！");
                    }
                    else if (content.type == 12) {
                        var html = tipTpl.replace(/\{content}/g, "教室已禁止聊天！");
                    }
                    else if (content.type == 13) {
                        var html = tipTpl.replace(/\{content}/g, "教室已允许发送图片！");
                    }
                    else if (content.type == 14) {
                        var html = tipTpl.replace(/\{content}/g, "教室已禁止发送图片！");
                    }
                    $("#im-items").append(html);
                    break;
                case RongIMClient.MessageType.ImageMessage:
                    if (!liveConfig.isChat || !liveConfig.isPic) return false; //禁止发图
                    var cont;
                    if (!message.content.content) {
                        cont = message.content.imageUri;
                    } else {
                        cont = "data:image/jpeg;base64," + message.content.content;
                    }
                    var html = tpl.replace(/\{avatar}/g, user.portrait||user.icon);
                        html = html.replace(/\{name}/g, user.name);
                        html = html.replace(/\{content}/g, '<li><a href="' + message.content.imageUri + '" target="_blank"><img src="' + cont + '" /></a>');
                    $("#im-items").append(html);
                    break;
                default:
            }
            scrollBottom();
        }
    });

    RongIMClient.connect(token, {
        onSuccess: function(userId) {
            console.log("Connect successfully." + userId);
        },
        onTokenIncorrect: function() {
            console.log('token无效');
        },
        onError:function(errorCode){
            var info = '';
            switch (errorCode) {
                case RongIMLib.ErrorCode.TIMEOUT:
                    info = '超时';
                    break;
                case RongIMLib.ConnectionState.UNACCEPTABLE_PAROTOCOL_VERSION:
                    info = '不可接受的协议版本';
                    break;
                case RongIMLib.ConnectionState.IDENTIFIER_REJECTED:
                    info = 'appkey不正确';
                    break;
                case RongIMLib.ConnectionState.SERVER_UNAVAILABLE:
                    info = '服务器不可用';
                    break;
            }
            console.log(errorCode);
        }
    });
}

// 打印消息
function showResult(title, message) {
    console.log(title + ': ' + JSON.stringify(message));
}

// 上传图片
function uploadImgFile(obj, fun) {
    $(obj).change(function() {
        try {
            var file = this.files[0];
            if(!/image\/\w+/.test(file.type)) {
                $.longAlert({ msg: "请确保文件类型为图像类型"});
                return false;
            }
            var reader = new FileReader();
            reader.onload = function() {
                var img = new Image();
                img.src = reader.result;
                img.onload = function() {
                    var w = img.width,
                        h = img.height;
                    if (w > h) {
                        cw = w = 225;
                        ch = h = w / img.width * img.height;
                        if (h < 60) {
                            ch = h = 60;
                            w = h / img.height * img.width;
                        }
                    }
                    if (w < h) {
                        cw = w = 120;
                        ch = h = w / img.width * img.height;
                        if (h > 300) {
                            ch = 300;
                        }
                    }
                    if (w == h) {
                        cw = w = ch = h = 200;
                    }
                    var canvas = document.createElement('canvas');
                    var ctx = canvas.getContext('2d');
                    $(canvas).attr({
                        width: w,
                        height: h
                    });
                    ctx.drawImage(img, 0, 0, w, h);
                    var base64 = canvas.toDataURL('image/jpeg', 0.5);
                    var result = {
                        url: img.src,
                        base64: base64,
                        clearBase64: base64.substr(base64.indexOf(',') + 1),
                        suffix: base64.substring(base64.indexOf('/') + 1, base64.indexOf(';')),
                    };
                    fun(result);
                }
            }
            reader.readAsDataURL(this.files[0]);
        } catch(e) {
            _showMsg(e);
        }
    });
}

// 获取地址栏参数
function getUrlParam(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}
// 滚动区域到底部
function scrollBottom() {
    // console.log($('#im-items').height());
    $('#im-scroolbar').animate({scrollTop: $('#im-items').height()}, 300);
}
// 将base64图片url,转换为blob
function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}
// 获取礼物名称
function getGiftName(id) {
    return eval('giftList.' + id);
}