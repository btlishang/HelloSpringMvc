var initRoomDetail = function() {
    // 老师名片
    $('.room-teachers').longSlide({
        effect: 'left', prev: '.teacherPrev', next: '.teacherNext', auto: false, navi: false
    });
    // 选项卡
    $('.room-tabs').longTab({
        event: 'click', tab: 'div', content: '.room-box .tab-box', hash: true
    });
    // 课程目录默认
    $('.room-course').children().eq(0).addClass('open');
    $('.room-course .course-head').on('click', function() {
        $(this).toggleClass('open');
    });
    // 公告
    $('.affice-box').on('click', function() {
        var html = $('.affice-content').html();
        $.longAlert({
            title: "公告", msg: html, textalign: "left", type: "alert", width: "600"
        });
    });
    // 作业音频
    // $('.room-audio').audioPlayer();
    // 作业图片
    // $(".room-picgroup").colorbox({});
    // 发布作业字数限制
    // $('#publish-content').longLimit({max: 3000, tip: "#publish-num"});
    // 内容区最小高度
    var sideHeight = $('.rm-right').height();
    $('#main-box').css('min-height', (sideHeight - 96) + "px");
}

// 教室介绍视频
var roomIntroVideo = {
    show: function() {
        $('.room-video-window').show();
        videojs('intro-video').play();
    },
    hide: function() {
        $('.room-video-window').hide();
        videojs('intro-video').pause();
    }
}

// 教室答疑
var roomQA = {
    // 提问
    add: function(input) {
        var str = $(input).val();
        if ($.trim(str).length < 1) {
            $.longAlert({
                msg: "请输入问题",
                type: "alert"
            });
            return;
        }

        console.log("添加提问成功");
    },
    // 添加回答
    reAdd: function(index) {
        var $ele = $('#question'+ index);
        var tpl = '<div class="re-form">' +
                '<input type="text" class="re-input" placeholder="输入回答" />\n' +
                '<button class="re-btn" onclick="roomQA.reSave('+ index +')">回答</button>\n' +
                '<button class="re-btn2" onclick="roomQA.reCanel('+ index +')">取消</button>' +
            '</div>';
        $ele.find('.add').hide();
        $ele.find('.cont').append(tpl);
    },
    // 保存回答
    reSave: function(index) {
        var $ele = $('#question'+ index);

        var str = $ele.val();
        if ($.trim(str).length < 1) {
            $.longAlert({
                msg: "请输入问题",
                type: "alert"
            });
            return;
        }

        $ele.find('.re-form').remove();

        console.log("添加回答成功");
    },
    // 取消回答
    reCanel: function(index) {
        var $ele = $('#question'+ index);
        $ele.find('.add').show();
        $ele.find('.re-form').remove();

        console.log("回答取消");
    },
    // 删除回答
    reDel: function(id) {
        $.longAlert({
            msg: "确认要删除吗？",
            type: "confirm",
            confirm: {
                submitevent: function() {
                    toDel(id);
                }
            }
        });

        function toDel(id) {
            console.log('删除');
        }
    }
}

// 加入
var roomJoinin = function() {
    var html = '<div class="room-join-alert"><i></i>加入成功</div>';
    $.longAlert({
        msg: html, type: 'alert', width: '360'
    });
}

// 教室送礼物
var roomGift = {
    show: function(classroomid) {
        var params = {};
        params.classroomid = classroomid;
        $.ajax({
            type: 'GET',
            url: '/classroom/giftlist',
            dataType: 'json',
            data: params,
            success: function(data) {
                console.log(data);
                if(data.code == 0) {
                    var giftlist = data.data;
                    var giftHtml = "";
                    giftHtml += '<div class="room-gift">';
                    for(var i=0;i<giftlist.length;i++){
                        giftHtml += '<div class="gift-item" data-id="'+giftlist[i].giftid+'" data-price="'+giftlist[i].price+'" onclick="roomGift.select(this)">' +
                            '<div class="inner">' +
                            '<img src="'+giftlist[i].picurl+'" class="pic">' +
                            '<div class="name">'+giftlist[i].title+'</div>' +
                            '<div class="num">'+giftlist[i].price+'龙币</div>' +
                            '</div></div>';
                    }
                    giftHtml += '<div class="longbi">我的龙币数量：<strong id="mymoney">'+ data.expandData.totalmoney +'</strong><a href="' + WEB_SERVICE_URL +'/usercenter/recharge" target="_blank" id="topay">充值</a></div>';
                    giftHtml += '<input type="hidden" id="select-giftid"/><input type="hidden" id="select-giftprice"/></div>';
                    $.longAlert({
                        title: "送礼物", msg: giftHtml, width: "750", textalign: "left",
                        type: "confirm",
                        confirm: {
                            submitlabel: "赠送",
                            submitevent: function() {
                                var str = $('#select-giftid').val();
                                var m = $('#mymoney').text();
                                if (str.length < 1) {
                                    alert('请选择一个礼物');
                                    return false;
                                }
                                var prices = $('#select-giftprice').val();
                                if (parseInt(m) < parseInt(prices)) {
                                    alert('你的龙币不足，请先去钱包中充值。');
                                    return false;
                                }
                                roomGift.givegift(str, ''+data.expandData.touid+'',''+data.expandData.classroomid+'');
                            }
                        }
                    });
                }
                else {
                    $.longAlert({ msg: data.rtnInfo });
                }
            },
            error: function(xhr, type) {
                window.location.href="/login";
                // $.longAlert({ msg: "网络连接失败，请重新尝试" });
            }
        });
    },
    select: function(obj) {
        var id = $(obj).data('id');
        var price = $(obj).data('price');
        $(obj).addClass('active').siblings().removeClass('active');
        $('#select-giftid').val(id);
        $('#select-giftprice').val(price);
    },
    givegift: function (giftid,touid,classroomid) {
        var params = {};
        params.giftid = giftid;
        params.touid = ''+touid+'';
        params.classroomid = ''+classroomid+'';
        $.ajax({
            type: 'GET',
            url: '/classroom/givegift',
            dataType: 'json',
            data: params,
            success: function(data) {
                $.longAlert({ msg: "操作成功" });
                window.location.reload();
            },
            error: function(xhr, type) {
                window.location.href="/login";
                // $.longAlert({ msg: "网络连接失败，请重新尝试" });
            }
        });
    }
}

// 教室礼物列表
var roomGiftList = function(classroomid) {
    var params = {};
    params.classroomid = classroomid;

    $.ajax({
        type: 'GET',
        url: '/classroom/selectLiveGift',
        dataType: 'json',
        data: params,
        success: function(res) {
            console.log(res);
            if(res.code == 0){
                var giftHtml = "", data = res.data;
                if (!data || data.length == 0) {
                    giftHtml = '<div style="text-align: center;">暂未收到礼物</div>';
                } else {
                    giftHtml += '<div class="room-giftlist">';
                    for (var i = 0; i < data.length; i++) {
                        giftHtml += '<div class="gift-item" data-id="'+i+'">' +
                            '<div class="inner">' +
                            '<img src="' + data[i].picurl + '" class="pic">' +
                            '<div class="name">' + data[i].gifttitle + '</div>' +
                            '<div class="num">获得 ' + data[i].num + ' 个</div>' +
                            '</div></div>';
                    }
                    giftHtml += '</div>';
                }
                $.longAlert({
                    title: "收到的礼物", msg: giftHtml, width: "750"
                });
            }
            else {
                $.longAlert({ msg: res.rtnInfo });
            }
        },
        error: function(res) {
            window.location.href="/login";
            // $.longAlert({ msg: "网络连接失败，请重新尝试" });
        }
    });
}

//关注 取消关注
var roomFollow = {
    on: function (classroomid) {
        var params = {};
        params.classroomid = classroomid;

        $.ajax({
            type: 'GET',
            url: '/classroom/insertUserBusinessConcern',
            dataType: 'json',
            data: params,
            success: function(data) {
                if(data.code == 0) {
                    $.longAlert({
                        msg: "关注成功",
                        alert: {
                            alertevent: function() {
                                window.location.reload();
                            }
                        }
                    });
                }
                else {
                    $.longAlert({ msg: data.rtnInfo });
                }
            },
            error: function(xhr, type) {
                window.location.href="/login";
                // $.longAlert({ msg: "网络连接失败，请重新尝试" });
            }
        });
    },
    off: function (classroomid) {
        var params = {};
        params.classroomid = classroomid;

        $.ajax({
            type: 'GET',
            url: '/classroom/removeUserBusinessConcern',
            dataType: 'json',
            data: params,
            success: function(data) {
                if(data.code == 0) {
                    $.longAlert({
                        msg: "操作成功",
                        alert: {
                            alertevent: function() {
                                window.location.reload();
                            }
                        }
                    });
                }else{
                    $.longAlert({ msg: data.rtnInfo });
                }
            },
            error: function(xhr, type) {
                window.location.href="/login";
                // $.longAlert({ msg: "网络连接失败，请重新尝试" });
            }
        });
    }
}