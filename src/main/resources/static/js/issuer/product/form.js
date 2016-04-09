poss.register.controller('productFormController', function ($scope, $http, $location) {
    // 日期控件
    $('.form_datetime').datepicker({
        format: 'yyyy-mm-dd'
    });

    $scope.product = {};
    // 新增产品时测试数据
    $scope.product.id="";
    $scope.product.name="测试001";
    $scope.product.productNo="TEST001";
    $scope.product.productSpecies="股权产品";
    $scope.product.prdUserType="PERSONAL";
    $scope.product.description="产品：测试001";
    $scope.product.expectAnnualReturnRate="7";
    $scope.product.annualizationPrinciple="PRINCIPLE_365";
    $scope.product.shares="10000";
    $scope.product.nav="100";
    $scope.product.issuanceStart="2015-10-20";
    $scope.product.issuanceEnd="2015-11-20";
    $scope.product.prdPeriod="30";

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
    if($scope.id) {
        $scope.getProduct();
    }

    /**
     * 保存
     */
    $scope.save = function() {
        if (!$scope.validate()) {
            return;
        }
        $scope.setField();
        $http.post("issuer/products/save", $scope.product).success(function(data){
            if (data.success) {
                $('#productForm').data('bootstrapValidator').disableSubmitButtons(false)
                $scope.showInfo("保存成功");
            } else {
                $scope.showInfo("保存失败");
            }
        }).error(function(){
            $('#productForm').data('bootstrapValidator').disableSubmitButtons(false);
            $scope.showInfo("保存失败");
        });
    }

    /**
     * 发布
     */
    $scope.issue = function() {
        if (!$scope.validate()) {
            return;
        }
        $scope.setField();
        $http.post("issuer/products/issue", $scope.product).success(function(data){
            $scope.product = data.data.product;
            if (data.success) {
                $scope.showInfo("发布成功");
            } else {
                $scope.showInfo("发布失败");
            }
        });
    }

    /**
     * 保存非空字段
     */
    $scope.setField = function() {
        $scope.product.productCategory = "BILL";
        $scope.product.returnType = "固定收益";
        $scope.product.highLimitOfShares = $scope.product.shares;
        $scope.product.lowLimitOfShares = $scope.product.shares;
        $scope.product.highLimitOfInitInvestment = $scope.product.shares * $scope.product.nav;
        $scope.product.lowLimitOfInitInvestment = $scope.product.nav;
        $scope.product.highLimitOfAddInvestment = $scope.product.shares * $scope.product.nav;
        $scope.product.lowLimitOfAddInvestment = $scope.product.nav;
        $scope.product.stepOfAddInvestment = $scope.product.nav;
    }

    // 日期格式化
    $scope.dateFormat = function (val) {
        return dateUtil.format(new Date(val), "yyyy-MM-dd");
    }

    $scope.validate = function() {
        //$('#productForm').bootstrapValidator();
        $('#productForm').data('bootstrapValidator').validate();
        if (!$('#productForm').data('bootstrapValidator').isValid()) {
            return false;
        }
        return true;
    }
    // 页面有操作时就校验
    $('#productForm').bootstrapValidator();
});