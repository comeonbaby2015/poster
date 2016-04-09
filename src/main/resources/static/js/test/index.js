angular.module('poss').controller('testIndexController', function ($scope, $http) {
    $scope.positionRpc_toHistory = function (pageIndex) {
        $http.post("test/positionRpc_toHistory").success(function(data){
            if (data.success) {
                $scope.showInfo("成功");
            } else {
                $scope.showInfo("失败");
            }
        }).error(function(){
            $scope.showInfo("失败");
        });
    }
});