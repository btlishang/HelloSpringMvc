var getListData = {
    init: function(type, params, pagesize) {
        var startNo = 0;
        var pageSize = pagesize||8;
        var ajaxurl;
        var params = JSON.parse(params);
        params.pageSize = pageSize;
        // console.log(pageSize);

        switch (type) {
            case "classroom":
                ajaxurl = "/roomModel/selectClassroomList";
                break;
            case "livevideo":
                ajaxurl = "/roomModel/coursesModeldetailsList";
                break;
            case "diy":
                ajaxurl = "/roomModel/zdyModeldetailsList";
                break;
            case "teacher":
                ajaxurl = "/roomModel/teacherModeldetailsList";
                break;
            case "search":
                ajaxurl = "/roomModel/selectRoomSearch";
                break;
            default:
                break;
        }

        $('#page-itemlist').dropload({
            scrollArea: window,
            distance: 0,
            threshold: 200,
            loadDownFn: function(me) {
                var html = "";
                startNo++;
                params.startNo = startNo;
                $.ajax({
                    type: 'GET',
                    url: ajaxurl,
                    dataType: 'json',
                    data: params,
                    success: function(res) {
                        console.log(res);
                        if (res.code == 0 && res.data.list.length > 0) {
                            if (type == "livevideo") {
                                html = getListData.livevideo(res.data.list);
                            } else if (type == "teacher") {
                                html = getListData.teacher(res.data.list);
                            } else {
                                html = getListData.classroom(res.data.list);
                            }

                            // console.log(startNo);
                        } else {
                            me.lock();
                            me.noData();
                        }
                        $('#item-lists').append(html);
                        me.resetload();
                    },
                    error: function(xhr, type) {
                        console.log('网络连接错误');
                        me.resetload();
                    }
                });
            }
        });
    },
    classroom: function(data) {
        var tpl = '<div class="room-card">\n' +
            '          <div class="room-pic">\n' +
            '              <a href="{url}"><img src="{pic}" alt="{title}" width="100%" class="pic" onerror="this.src=\'/img/room.png\'" /></a>\n' +
            '          </div>\n' +
            '          <div class="room-title">\n' +
            '              <a href="{url}">{title}</a>\n' +
            '          </div>\n' +
            '          <div class="room-info">{name}&nbsp;</div>\n' +
            '          <div class="room-nums">\n' +
            '              {charge}\n' +
            '              {num}人学习\n' +
            '          </div>\n' +
            '      </div>';
        var html = '', temp;

        for (var i = 0; i < data.length; i++) {
            temp = tpl.replace(/\{url}/g, webpath + '/classroom/detail?classroomid=' + data[i].classroomid);
            temp = temp.replace(/\{pic}/g, osspic(ossurl + data[i].classphotos, 320, 180));
            temp = temp.replace(/\{title}/g, data[i].classtitle);
            temp = temp.replace(/\{name}/g, data[i].displayname);
            temp = temp.replace(/\{num}/g, data[i].classinvoloed);
            if (data[i].isfree == 0) {
                temp = temp.replace(/\{charge}/g, '<span class="room-price free">免费</span>');
            }
            if (data[i].isfree == 1) {
                temp = temp.replace(/\{charge}/g, '<span class="room-price">'+ data[i].charge +'<small> 龙币</small></span>');
            }
            html += temp;
        }

        return html;
    },
    livevideo: function(data) {
        var tpl = '<div class="room-card room-livetv">\n' +
                    '<div class="room-state">{state}</div>\n' +
                    '<div class="room-pic">\n' +
                        '<a href="{url}">\n' +
                           '<img src="{pic}" alt="{title}" width="100%" class="pic" onerror="this.src=\'/img/livetv.png\'">\n' +
                           '<span class="date">{date}</span>\n' +
                        '</a>\n' +
                    '</div>\n' +
                    '<div class="room-title"><a href="{url}">{title}</a></div>\n' +
                    '<div class="room-info">教室：<a href="{url}">{roomname}</a></div>{charge}' +
                '</div>';
        var html = '', temp;
        for (var i = 0; i < data.length; i++) {
            var isfree = data[i].isfree;
            var course = data[i].liveCourses[0];
            var state = course.status;
            var d = "";
            if (state < 2) {
                var starttime = course.starttime,
                    endtime = course.endtime;
                var startM = new Date(starttime).getMonth()+1,
                    startD = new Date(starttime).getDate(),
                    startH = new Date(starttime).getHours(),
                    startI = new Date(starttime).getMinutes(),
                    endH = new Date(endtime).getHours(),
                    endI = new Date(endtime).getMinutes();
                startH = startH < 10 ? "0"+ startH : startH;
                startI = startI < 10 ? "0"+ startI : startI;
                endH = endH < 10 ? "0"+ endH : endH;
                endI = endI < 10 ? "0"+ endI : endI;
                d = startM + "月" + startD + "日 " + startH + ":" + startI + " - " + endH + ":" + endI;
            }
            var url = state == 1 ? webpath + "/classroom/livevideo?classroomid=" + data[i].classroomid + "&courseid=" + course.id : webpath + "/classroom/detail?classroomid=" + data[i].classroomid + "&courseid=" + course.id + "#livetv";
            var charge = isfree == 0 ? '<span class="room-price free">免费</span>' : '<span class="room-price">'+ data[i].charge +'<small> 龙币</small></span>';

            temp = tpl.replace(/\{state}/g, liveState(state));
            temp = temp.replace(/\{roomname}/g, data[i].classtitle);
            temp = temp.replace(/\{date}/g, d);
            temp = temp.replace(/\{pic}/g, osspic(ossurl + course.pickey, 320, 240));
            temp = temp.replace(/\{title}/g, course.coursetitle);
            temp = temp.replace(/\{url}/g, url);
            temp = temp.replace(/\{charge}/g, charge);

            html += temp;
        }
        return html;
    },
    teacher: function(data) {
        var tpl = '<div class="company-card">\n' +
            '        <div class="pic">\n' +
            '            <img src="{avatar}" alt="{name}" width="100%" class="pic" onerror="this.src=\'/img/square.png\'" />\n' +
            '        </div>\n' +
            '        <div class="title">{name}</div>\n' +
            '        <div class="info">{info}</div>\n' +
            '        <div class="nums">\n' +
            '            <span>{courses}节课</span>\n' +
            '            <span>{num}人学习</span>\n' +
            '        </div>\n' +
            '        <div class="comm">\n' +
            '            推荐教室：\n' +
            '            <a href="{classurl}">{classtitle}</a>\n' +
            '        </div>\n' +
            '    </div>';
        var html = '', temp;
        for (var i = 0; i < data.length; i++) {
            temp = tpl.replace(/\{name}/g, data[i].nickname);
            temp = temp.replace(/\{avatar}/g, osspic(ossurl + data[i].avatar, 200, 200));
            temp = temp.replace(/\{info}/g, data[i].brief);
            temp = temp.replace(/\{courses}/g, data[i].courses);
            temp = temp.replace(/\{num}/g, data[i].classinvoloed);
            temp = temp.replace(/\{classtitle}/g, data[i].classtitle);
            temp = temp.replace(/\{classurl}/g, webpath + "/classroom/detail?classroomid=" + data[i].classroomid);
            html += temp;
        }
        return html;
    }
}

var liveState = function(i) {
    var txt = ["直播预告", "正在直播", "直播结束", "观看回放"];
    return txt[i||0];
}