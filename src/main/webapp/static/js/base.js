var indexMenuHeight = function() {
    var n = $('.menu-body').children().length;
    n = n > 10 ? 10 : n;
    $('.menu-body .item-name').css('line-height', ((384 - 44) / n) + 'px');
};

// 搜索验证
var checkSearch = function() {
    var key = $('.site-search [name=keyword]').val();
    if ($.trim(key).length < 1) {
        $.longAlert({
            msg: '请输入搜索关键词',
        });
        return false;
    }
}

// 下载APP
var appdown = function() {
    var tpl = '<div class="site-appdown">' +
            '<p class="txt">扫一扫下方二维码下载 APP ，获取完整体验</p>' +
            '<div class="qrcode"></div>' +
        '</div>';
    $.longAlert({
        msg: tpl,
        width: 480
    });
}

// 口令加入教室
var roomJoinKey = function() {
    var html = '<div class="roomjoin-key">'+
            '<div class="row">' +
                '<input type="text" name="key" placeholder="请输入教室口令" />' +
                '<p class="tip" id="roomjoin-tip"><p>' +
            '</div>' +
        '</div>';

    $.longAlert({
        title: "口令入教室",
        width: 360,
        msg: html,
        type: "confirm",
        confirm: {
            submitevent: function() {
                var key = $('.roomjoin-key [name=key]').val();
                if ($.trim(key).length < 1) {
                    $('#roomjoin-tip').text('请输入私密教室口令');
                    return false;
                }

                $.ajax({
                    type: "get",
                    url: "/roomModel/selectRoomSearch",
                    data: {keyword: key, searchByCodeword: 1},
                    dataType: "json",
                    success: function(res) {
                        console.log(res);
                        if (res.code == 0 && res.data.list.length > 0) {
                            var roomid = res.data.list[0].classroomid;
                            //$('.roomjoin-key').text('加入私密教室成功');
                            window.location.href = '/classroom/detail?classroomid=' + roomid;
                        }
                        if (res.code == 0 && res.data.list.length == 0) {
                            $('#roomjoin-tip').text('私密教室口令错误');
                        }
                    }
                });
                return false;
            }
        }
    });
}

// OSS图片路径处理
var osspic = function(picurl, width, height) {
    if (width && height) {
        return picurl + "?x-oss-process=image/resize,m_fill,w_" + width + ",h_" + height;
    } else {
        return picurl;
    }
}



// 是否登录
var isLogin = function(){
    var flag = false;
    $.ajax({
        type: "get",
        url: "/islogin",
        dataType: "json",
        async: false,
        success: function(res) {
            flag = res.code == 0;
        }
    });
    return flag;
}
// 阻止冒泡
function stopDefault(e) {
    if (e && e.preventDefault)
        e.preventDefault();
    else
        window.event.returnValue = false;
    return false;
}

function stopBubble(e) {
    if (e && e.stopPropagation)
        e.stopPropagation();
    else
        window.event.cancelBubble = true;
    return false;
}


// 解决 mouseout 冒泡问题
var isMouseLeaveOrEnter = function(e, handler) {
    if (e.type != 'mouseout' && e.type != 'mouseover') return false;
    var reltg = e.relatedTarget ? e.relatedTarget : e.type == 'mouseout' ? e.toElement : e.fromElement;
    while (reltg && reltg != handler)
        reltg = reltg.parentNode;
    return (reltg != handler);
}