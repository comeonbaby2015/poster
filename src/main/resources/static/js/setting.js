'use strict';
/**
 * JQUERY 默认ajax设置
 */
$.ajaxSetup({
    headers: {'Content-type': 'application/json;charset=UTF-8'}
});
var infodlg = null, infomsg = null;
/**
 * 显示一些提示性信息
 * @param msg 要显示的提示信息
 * @param timeout 超时自动关闭时间，默认2000,0表示不进行自动关闭
 */
poss.info = function (msg, timeout) {
    timeout = timeout === undefined ? 2000 : timeout;
    if (!infodlg) {
        infodlg = $('#infodialog');
        infomsg = infodlg.find('#infomsg');
    }
    infomsg.text(msg);
    infodlg.show().find('.box').hide().slideDown(600);

    if (timeout > 0) {
        setTimeout(function () {
            poss.info.hide();
        }, timeout);
    }
};
poss.info.hide = function () {
    infodlg.find('.box').slideUp(600, function () {
        infodlg.hide();
    });
};

poss.parseURL = function (url) {
    var items = url.split('/'), menu = {one_code: null, two_code: null, three_code: null, path: null};
    menu.one_code = items[1];
    menu.two_code = items[2];
    menu.three_code = items[3];
    menu.path = url;
    return menu;
};