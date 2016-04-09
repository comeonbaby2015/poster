'use strict';
angular.module('poss').controller('moduleController', function ($scope, $rootScope, $state, $location) {
    //查询模块
    $scope.moduleList = [{
        moduleKey: 'ruleManager',
        moduleName: '规则管理'
    }, {
        moduleKey: 'test',
        moduleName: '测试'
    }];
    //改变左侧导航菜单
    $scope.changeMenu = function (key) {
        $rootScope.menus = {
            key: key, list: $rootScope.menuList[key]
        };
        $location.url($rootScope.menuList[key][0].href);
    };
});
angular.module('poss').controller('menuController', function ($scope, $rootScope, $state, $location) {
    // 查询菜单
    $rootScope.menuList = {
        ruleManager: [ {
            href: '/ruleManager/rule/index',
            icon: 'fa fa-industry fa-fw',
            text: '规则管理'
        }],
        test: [{
            href: '/test/index',
            icon: 'fa fa-search',
            text: '测试'
        }]
    };
    $rootScope.CUR_MENU_PATH = {one_code: null, two_code: null, three_code: null, path: null}; //当前菜单路径
    if (!$rootScope.menus) {
        $rootScope.menus = {
            key: 'ruleManager', list: $rootScope.menuList['ruleManager']
        };
    }
});