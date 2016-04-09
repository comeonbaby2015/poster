angular.module('poss').controller('noticesSystemIndexController', function ($scope, $http, $rootScope) {
    $scope.page = {currentPage: 1, pageSize: 10};

    /**
     * 查询列表
     */
    $scope.queryList = function (pageIndex) {
        $scope.page.currentPage = pageIndex || 1;
        $scope.queryLoading = true;
        var param = {
            page: parseInt($scope.page.currentPage) - 1,
            size: $scope.page.pageSize
        };
        $http.post("notices/list", param).success(function(data){
            if (data.success) {
                $scope.notices = data.data.pageResp.content;
                // 设置总页数
                $scope.page.totalPage = Math.ceil(parseInt(data.data.pageResp.total) / parseInt($scope.page.pageSize));
            } else {
                $scope.showInfo("查询失败");
            }
        }).error(function(){
            $scope.showInfo("查询失败");
        });
    }
    $scope.queryList();

    /**
     * 设置为已读
     */
    $scope.setRead = function (notices) {
        $http.post("notices/read/" + notices.id).success(function(data){
            if (data.success) {
                $rootScope.count = $rootScope.count - 1;
                $scope.showInfo("设置已读成功");
                $scope.queryList();
            } else {
                $scope.showInfo("设置已读失败");
            }
        }).error(function(){
            $scope.showInfo("设置已读失败");
        });
    }

    /**
     * 全部标为已读
     */
    $scope.readAll = function () {
        $http.post("notices/readAll/").success(function(data){
            if (data.success) {
                $rootScope.count = 0
                $scope.queryList();
            } else {
                $scope.showInfo("设置已读失败");
            }
        }).error(function(){
            $scope.showInfo("设置已读失败");
        });
    }

})