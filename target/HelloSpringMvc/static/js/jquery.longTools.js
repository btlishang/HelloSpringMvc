/**
 * 常用的插件，包括幻灯片、选项卡、跑马灯、模拟弹窗
 * @author sunxjie
 * @emain sunxjie@gmail.com
 * @date 2013.01
 * @github https://github.com/sunxjie/
 */

;(function ($) {
    // 幻灯片
	$.fn.longSlide = function (options) {
		var defaults = {
			effect: 'fade',			//滚动的方向，fade_渐隐, top_向上，left_向左
			timer: 3000,			//滚动停顿的时间
			auto: true,				//是否自动播放
			navi: true,				//是否显示数字
			prev: '',
			next: ''
		};
		var opts = $.extend({}, defaults, options);

		return this.each(function () {
			var slide_box = $(this);
			var lens = slide_box.find('li').length,
				i = 0,
				box_width = slide_box.width(),
				box_height = slide_box.height();
			var mv;
			if ( lens > 1 ) {
				var ul = slide_box.find('ul'),
					moving;

				// auto_slide();
				if ( opts.auto ) {
					setTimeout(auto_slide, opts.timer);

					//鼠标hover在图片上
					// slide_box.on({
					// 	mouseover: function () {
					// 		clearTimeout(mv);
					// 	},
					// 	mouseout: function () {
					// 		auto_slide();
					// 	}
					// });
				}

				//是否显示数字
				if ( opts.navi && slide_box.find('.slide_navi').length < 1 ) {
					//动态插入数字
					var nums_html = '<div class="slide_navi"><span class="current">1</span>';
					for ( var x = 2; x <= lens; x++ ) {
						nums_html += '<span>' + x + '</span>';
					}
					nums_html += '</div>';
					slide_box.append(nums_html);

					//鼠标hover数字上
					// slide_box.find('.slide_navi span').on('click', function(event) {
					// 	// clearTimeout(mv);
					// 	i = $(this).index() - 1;
					// 	console.log(i);
					// 	auto_slide();
					// });
				}

				if (opts.effect == 'left') {
					ul.css('width', ul.find('li').innerWidth()*lens + 'px');
					ul.find('li').css('float', 'left');
				}
				if (opts.effect == 'top') {
					ul.css('height', ul.find('li').innerHeight()*lens + 'px');
				}
			} else {
				if ( opts.prev ) $(opts.prev).hide();
				if ( opts.next ) $(opts.next).hide();
			}

			if ( opts.next ) {
				$(opts.next).on('click', function() {
					if (ul.is(':animated')) return;
					clearTimeout(moving);
					auto_slide();
					if (opts.auto) moving = setInterval(auto_slide, opts.timer);
				})
			}

			if ( opts.prev ) {
				$(opts.prev).on('click', function() {
					if (ul.is(':animated')) return;
					clearInterval(moving);
					i--;
					i = i < 0 ? (lens-1) : i;

					if ( opts.navi ) {
						slide_box.find('.slide_navi span').eq(i).addClass('current').siblings().removeClass('current');
					}

					ul.children().eq(lens-1).prependTo(ul);
					ul.css('margin-left', '-' + box_width + 'px');
					ul.animate({marginLeft: '0px'}, 500);

					if (opts.auto) moving = setInterval(auto_slide, opts.timer);
				})
			}

			//滚动动画
			function auto_slide() {
				i++;
				if ( i >= lens ) i = 0;
				if ( opts.navi ) {
					slide_box.find('.slide_navi span').eq(i).addClass('current').siblings().removeClass('current');
				}
				if (opts.effect == 'fade') {
					ul.find('li').eq(i).animate({opacity: 'show'}, 500)
								 .siblings().animate({opacity: 'hide'}, 100);
				}
				if (opts.effect == 'left') {
					ul.animate({marginLeft: '-' + box_width + 'px'}, 500, function() {
						ul.css('margin-left', 0);
						ul.children().eq(0).appendTo(ul);
					});
				}
				if (opts.effect == 'top') {
					ul.animate({marginTop: '-' + box_height + 'px'}, 500, function() {
						ul.css('margin-top', 0);
						ul.children().eq(0).appendTo(ul);
					});
				}

				mv = setTimeout(function() {
					auto_slide();
				}, opts.timer);
			}

			//调试
			function debug (val) {
				console.info(val);
			}

		});
	}
})(jQuery);

;(function ($) {
    // 选项卡
    $.fn.longTab = function(options) {
        var defaults = {
            tab: 'li',
			event: 'mouseover',
            current: 'current',
			content: '',
			step: 1,
			hash: false
        };
        var opts = $.extend({},defaults, options);
        return this.each(function() {
			var content = $(opts.content);
			var initial = opts.step - 1;
			var that = $(this);
			var moving;

			if (opts.hash) {
				var hash = window.location.hash.slice(1);
				if (hash.length > 0) {
					that.find(opts.tab).each(function(i) {
						var dh = $(this).data('hash');
						if (dh == hash) {
							$(this).addClass(opts.current);
							initial = i;
							return false;
						} else {
							$(this).removeClass(opts.current);
						}
					});
				}
			}

			that.find(opts.tab).eq(initial).addClass(opts.current).siblings().removeClass(opts.current);
			content.eq(initial).show().siblings().hide();

			if (opts.event == 'click') {
				that.find(opts.tab).on({
					click: function() {
						var _this = $(this), index = _this.index();
						i = index;
						content.eq(i).show().siblings().hide();
						_this.addClass(opts.current).siblings().removeClass(opts.current);
						window.location.hash = _this.data('hash');
					}
				});
			} else {
				that.find(opts.tab).on({
					mouseover: function() {
						var _this = $(this), index = _this.index();
						moving = setTimeout(function() {
							i = index;
							content.eq(i).show().siblings().hide();
							_this.addClass(opts.current).siblings().removeClass(opts.current);
							window.location.hash = _this.data('hash');
						},
						100)
					},
					mouseout: function(event) {
						clearTimeout(moving);
					}
				});
			}
            function debug(val) {
                console.info(val)
            }
        })
	}
})(jQuery);

;(function ($) {
    // 跑马灯
    $.fn.longScroll = function(options) {
        var defaults = {
            direction: 'left',
			speed: 30
        };
        var opts = $.extend({},defaults, options);
		var scring;
        return this.each(function() {
            var scroll_box = $(this);

			scring = setInterval(scrolls, opts.speed);

			scroll_box.mouseover(function(){
				clearInterval(scring);
			}).mouseout(function() {
				scring = setInterval(scrolls, opts.speed);
			});

			function scrolls() {
				var items = scroll_box.children('.items').children();
				if (opts.direction == 'top') {
					var cur = scroll_box.scrollTop();
					if(cur >= (items.first().height())) {
						cur = 1;
						items.first().appendTo(scroll_box.children('.items'));
					} else {
						cur++;
					}
					scroll_box.scrollTop(cur);
				}
				else {
					var cur = scroll_box.scrollLeft();
					var twidth = items.length * items.first().width();
					scroll_box.find('.items').width(twidth);
					if(cur >= (items.first().width())) {
						cur = 1;
						items.first().appendTo(scroll_box.children('.items'));
					} else {
						cur++;
					}
					scroll_box.scrollLeft(cur);
				}
			}

            function debug(val) {
                console.info(val);
            }
        })
    }
})(jQuery);

// 输入框长度限制
;(function($) {
    $.fn.longLimit = function(options) {
        var defaults = {
            max: 0,
            tip: '',
            rule: 'asc'
        };
        var opts = $.extend({}, defaults, options);

        this.each(function() {
            var $this = $(this),
                $tipbox = $(opts.tip),
                _text = $this.val();

            // 返回val的长度
            var getLen = function(str) {
                var _textlen = 0,
                    regexCn = /[\x00-\xff]+/;
                for (var i = 0; i < str.length; i++) {
                    _textlen += !regexCn.test(str.charAt(i)) ? 2 : 1;
                }
                _textlen = Math.ceil(_textlen / 2);
                return _textlen;
            }

            // 返回val在规定字节长度内的值
            var getMaxVal = function(str, max) {
                var text = "";
                var _textlen = 0,
                    regexCn = /[\x00-\xff]+/;
                for (var i = 0; i < str.length; i++) {
                    _textlen += !regexCn.test(str.charAt(i)) ? 2 : 1;
                    if (_textlen > max * 2) break;
                    text += str[i];
                }
                return text;
            }

            // 初始化
            var inputInit = function(text) {
                var _tempnum = 0;
                var _textlen = getLen(text);
                if ($tipbox) {
                    if (_textlen < opts.max) {
                        if (opts.rule == "desc") _tempnum = opts.max - _textlen;
                        if (opts.rule == "asc") _tempnum = _textlen;
                    }
                    if (_textlen >= opts.max) {
                        if (opts.rule == "desc") _tempnum = 0;
                        if (opts.rule == "asc") _tempnum = opts.max;
                        $this.val(getMaxVal(text, opts.max));
                    }
                    $tipbox.text(_tempnum);
                } else {
                    if (_textlen >= opts.max) $this.val(getMaxVal(text, opts.max));
                }
            }

            $this.bind('focus keyup change', function() {
                var _text = $(this).val();
                inputInit(_text);
            });

            inputInit(_text);
        });

        return this;
    };
})(window.jQuery || window.Zepto);


// 模拟弹窗
;(function($) {
    var opts, okBtn, cancelBtn, submitBtn;

    // 插件
    $.fn.longAlert = function(options) {
        return this;
    };

    $.longAlert = function(options) {
        var defaults = {
            msg: "",
            title: "",
            textalign: "center",
            type: "alert",
            alert: {
                alertlabel: "确定",
                alertevent: function() {}
            },
            confirm: {
                cancellabel: "取消",
                submitlabel: "确定",
                cancelevent: function() {},
                submitevent: function() {}
			},
			width: "300"
        };
        opts = $.extend(true, {}, defaults, options);
        $.longAlert.init();
        return this;
    };

    $.longAlert.init = function() {
        $.longAlert.show();
        $.longAlert.event();
    };

    $.longAlert.show = function() {
        $("body").append(alertWrap = $('<div class="longAlert-wrap" />'));
        alertWrap.append(alertMain = $('<div class="longAlert-main" />'));
        if (opts.title) {
            alertMain.append(alertHead = $('<div class="longAlert-head">' + opts.title + '</div>'));
        }
        alertMain.append(
            alertCont = $('<div class="longAlert-cont text-' + opts.textalign + '">' + opts.msg + '</div>'),
            alertFoot = $('<div class="longAlert-foot" />')
        );
        if (opts.type == "alert") {
            alertFoot.append(okBtn = $('<span class="btn okBtn">' + opts.alert.alertlabel + '</span>'));
        }
        if (opts.type == "confirm") {
            alertFoot.append(
                cancelBtn = $('<span class="btn cancelBtn">' + opts.confirm.cancellabel + '</span>'),
                submitBtn = $('<span class="btn submitBtn">' + opts.confirm.submitlabel + '</span>')
            );
        }

		alertMain.css("max-width", opts.width + "px");

        $("body").on("touchmove", function(event) {
            event.preventDefault;
        }, false)
    };

    $.longAlert.hide = function() {
        $("body").unbind("touchmove");
        // alertWrap.addClass('out').one('webkitAnimationEnd animationend', function() {
		alertWrap.remove();
        // });
    };

    $.longAlert.event = function() {
        $(okBtn).on('click', function() {
			var func = opts.alert.alertevent();
			if (func === false) {
				return false;
			}
            $.longAlert.hide();
        });
        $(cancelBtn).on('click', function() {
			var func = opts.confirm.cancelevent();
			if (func === false) {
				return false;
			}
            $.longAlert.hide();
        });
        $(submitBtn).on('click', function() {
			var func = opts.confirm.submitevent();
			if (func === false) {
				return false;
			}
            $.longAlert.hide();
        });
    };
})(window.jQuery || window.Zepto);