jQuery.validator.addMethod("username",
    function(value, element) {
        return this.optional(element) || /^[\u0391-\uFFE5\w]+$/.test(value);
    }, "只能包括中文字母、英文字母、数字和下划线");

// 字符最大为28字符长度验证（一个中文字符长度为2）
jQuery.validator.addMethod("stringMaxLength", function(value, element, param) {
    var length = value.length;
    for (var i = 0; i < value.length; i++) {
        if (value.charCodeAt(i) > 127) {
            length++;
        }
    }
    return this.optional(element) || (length <= 28);
}, $.validator.format("长度不能大于28个字符!"));

// 字符最大为26字符长度验证（一个中文字符长度为2）
jQuery.validator.addMethod("stringMaxLength26", function(value, element, param) {
    var length = value.length;
    for (var i = 0; i < value.length; i++) {
        if (value.charCodeAt(i) > 127) {
            length++;
        }
    }
    return this.optional(element) || (length <= 26);
}, $.validator.format("长度不能大于26个字符!"));

jQuery.extend(jQuery.validator.messages, {
    required: "必选字段",
    idcard: "请输入正确格式的身份证",
    remote: "请修正该字段",
    email: "请输入正确格式的电子邮件",
    url: "请输入合法的网址",
    date: "请输入合法的日期",
    dateISO: "请输入合法的日期 (ISO).",
    number: "请输入合法的数字",
    digits: "只能输入整数",
    creditcard: "请输入合法的信用卡号",
    equalTo: "请再次输入相同的值",
    accept: "请输入拥有合法后缀名的字符串",
    maxlength: jQuery.validator.format("请输入一个长度最多是 {0} 的字符串"),
    minlength: jQuery.validator.format("请输入一个长度最少是 {0} 的字符串"),
    rangelength: jQuery.validator.format("请输入一个长度介于 {0} 和 {1} 之间的字符串"),
    range: jQuery.validator.format("请输入一个介于 {0} 和 {1} 之间的值"),
    max: jQuery.validator.format("请输入一个最大为 {0} 的值"),
    min: jQuery.validator.format("请输入一个最小为 {0} 的值")
});