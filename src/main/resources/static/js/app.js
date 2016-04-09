'use strict';
var poss = angular.module('poss', ['oc.lazyLoad', 'ngExtend', 'ui.router']);

//常量  基本页面路径
poss.constant('BASE_PATH', 'views');
poss.constant('BASE_JS_PATH', 'js');
poss.config(function ($stateProvider, BASE_PATH, BASE_JS_PATH, $controllerProvider, $filterProvider, $requireProvider, $urlRouterProvider, $provide) {
    poss.register = {
        controller: $controllerProvider.register,
        filter: $filterProvider.register,
        factory: $provide.factory
    };
    /**
     * 根据一定的规则取出依赖
     * abc/def/hg.html 以hg为依赖
     * @param url
     */
    function getDeps(url) {
        var dep = null;
        if (url) {
            dep = poss.parseURL(url).path;
        }
        return dep;
    }

    //处理url,添加后缀
    var suffix = '.html';

    function addSuffix(url) {
        if (url.indexOf('.') !== -1) {
            return url;
        }
        var index = url.indexOf('?');
        if (index === -1) {
            return url + suffix;
        } else {
            return url.substring(0, index) + suffix + url.substring(index);
        }
    }

    $urlRouterProvider.when(/^\/?$/, '/');
    $stateProvider
        //默认规则配置
        .state('def', {
            url: '{url:[^@]*}',
            templateUrl: function ($stateParams) {
                return addSuffix(BASE_PATH + $stateParams.url);
            },
            resolve: {
                require: function ($ocLazyLoad, $stateParams) {
                    return $ocLazyLoad.load({
                        name: 'poss',
                        files: [BASE_JS_PATH + getDeps($stateParams.url) + ".js"]
                    });
                }
            }
        })
        //子路由
        .state('def.child', {
            url: '@/{path:[^/]+}{a1:/?}{p1:[^/]*}{a2:/?}{p2:[^/]*}{a3:/?}{p3:[^/]*}{a4:/?}{p4:[^/]*}{a5:/?}{p5:[^/]*}',
            templateUrl: function ($stateParams) {
                var url = BASE_PATH + SUB_ROUTES + $stateParams.path;
                return addSuffix(url);
            },
            resolve: {
                require: function ($q, $stateParams) {
                    return resolve($q, $stateParams.path, [SUB_ROUTES + $stateParams.path.split(/[.\?]/)[0]]);
                }
            }
        });
});

angular.element(document).ready(function () {
    //阻止 # 导航
    $(document).delegate('a', 'click', function (event) {
        var href = $(this).attr('href');
        if (href === '#') {
            event.preventDefault();
        }
    });
    angular.bootstrap(document, ['poss']);
});
