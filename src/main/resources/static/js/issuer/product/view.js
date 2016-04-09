poss.register.controller('productViewController', function($scope, $http, $location) {
    $scope.product = {};
    $scope.timeLine = []; //从后台取的数据
    $scope.timeLine_new = []; //对timeLine按time分组
    $scope.id = $location.search().id;

    /**
     * 加载product数据
     */
    $scope.getProduct = function() {
        $http.post("issuer/products/detail/" + $scope.id).success(function(data){
            if (data.success) {
                $scope.product = data.data.product;
                $scope.product.issuanceEnd = $scope.dateFormat($scope.product.issuanceEnd);
                $scope.product.issuanceStart = $scope.dateFormat($scope.product.issuanceStart);
            }
        });
    }
    $scope.getProduct();

    // 日期格式化
    $scope.dateFormat = function (val) {
        return dateUtil.format(new Date(val), "yyyy-MM-dd");
    }

    /**
     * 发布
     */
    $scope.issue = function() {
        $http.post("issuer/products/issue/" + $scope.id).success(function(data){
            $scope.product = data.data.product;
            if (data.success) {
                $scope.showInfo("发布成功");
            } else {
                $scope.showInfo("发布失败");
            }
        });
    }

    /**
     * 加载product timeLine数据
     */
    $scope.getTimeLine = function() {
        $http.post("issuer/products/timeline/" + $scope.id).success(function(data){
            if (data.success) {
                $scope.timeLine = data.data.timeLine;

                // 对timeLine按time分组，放入新数组timeLine_new
                for (var i = 0; i < $scope.timeLine.length ; i++)
                {
                    // 判断timeLine_new是否已经包含当前循环timeLine[i].operateTime，有则跳过
                    var has = false;
                    for (var m = 0; m < $scope.timeLine_new.length ; m++)
                    {
                        if ($scope.timeLine_new[m]["operateTime"] == $scope.timeLine[i]["operateTime"]) {
                            has = true;
                            break;
                        }
                    }
                    if (has) {
                        continue;
                    }
                    //当前日期timeLine[i].time还没有在timeLine_new里，则push，并新增eventss属性
                    var timeLine_new = $scope.timeLine[i];
                    $scope.timeLine_new.push(timeLine_new);
                    timeLine_new["eventss"] = [];
                    timeLine_new["eventss"].push($scope.timeLine[i]["events"])
                    //从i开始往后找，如果有相同日期timeLine[i].time的，且它的events没在timeLine_new里，则将其events放入timeLine_new里的eventss
                    for (var j = i; j < $scope.timeLine.length ; j++)
                    {
                        if (timeLine_new["operateTime"] == $scope.timeLine[j]["operateTime"] && timeLine_new["events"] != $scope.timeLine[j]["events"]) {
                            timeLine_new["eventss"].push($scope.timeLine[j]["events"])
                        }
                    }
                }
            }
        });
    }
    $scope.getTimeLine();
});