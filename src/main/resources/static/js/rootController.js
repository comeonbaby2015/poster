'use strict';
angular.module('poss').controller('rootController', function ($scope, $rootScope, $state, $location, $myhttp) {
    $rootScope.doConfirmCfg = {
        msg: '操作成功', //确认信息 必选
        onconfirm: function () { //确认时回调 可选
        }
    };
    $rootScope.confirmCfg = {
        msg: '', //确认信息 必选
        onclose: function () {  //关闭时回调 可选
        },
        onconfirm: function () { //确认时回调 可选
        }
    }
    $rootScope.showInfo = function (msg, timeout) {
        timeout = timeout === undefined ? 2000 : timeout;
        $rootScope.doConfirmCfg.msg = msg;
        poss.info(msg, timeout);
    }
    $rootScope.UI_VIEW_LOADING = false; //是否正在加载视图
    //路由改变事件
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        $rootScope.UI_VIEW_LOADING = true;
        $(document).unbind('.poss'); //取消带命名空间的绑定
    });
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        $rootScope.UI_VIEW_LOADING = false;
        //解析url
        $rootScope.CUR_MENU_PATH = poss.parseURL($location.url());
        $rootScope.menus = {
            key: $rootScope.CUR_MENU_PATH.one_code, list: $rootScope.menuList[$rootScope.CUR_MENU_PATH.one_code]
        };
        setTimeout(function () {
            $(document).scrollTop(0);
        }, 100);
    });
    $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
        console.error('路由改变错误!', toState, toParams, fromState, fromParams, error);
    });

    /**
     * 获取系统通知信息，未读数量，新消息数量
     */
    $rootScope.getNoticesInfo = function() {
        $myhttp.get('notices/info', function (response) {
            if (response.success) {
                $rootScope.countNew = response.data.countNew;
                $rootScope.count = response.data.count;
                $rootScope.showNoticesInfo();
            }
            $rootScope.getNoticesInfo();
        }, "JSON");
    }
    $rootScope.getNoticesInfo();

    /**
     * 显示新通知对话框
     */
    $rootScope.showNoticesInfo = function () {
        $rootScope.isShowNoticesInfo = true;
    }
    /**
     * 关闭新通知对话框
     */
    $rootScope.hideNoticesInfo = function() {
        $rootScope.isShowNoticesInfo = false;
    }

    var getViewWidthHeight = function () {
        var pageWidth = window.innerWidth;
        var pageHeight = window.innerHeight;
        if (typeof pageWidth !== 'number') {
            if (document.compatMode === 'CSS1Compat') {
                pageWidth = document.documentElement.clientWidth;
                pageHeight = document.documentElement.clientHeight;
            } else {
                pageWidth = document.body.clientWidth;
                pageHeight = document.body.clientHeight;
            }
        }
        return {
            width: pageWidth,
            height: pageHeight
        };
    };
    //设置最小高度
    var view = getViewWidthHeight();
    $rootScope.minHeight = view.height - 50;
}).controller('userController', function ($scope, $myhttp, $rootScope) {
    $scope.user = {};
    $myhttp.get('user/info', function (response) {
        if (!response.success) {
            console.error("查询用户信息出错");
        } else {
            $scope.user = response.data.user;
            $rootScope.count = response.data.count;
        }
    }, "JSON");
});