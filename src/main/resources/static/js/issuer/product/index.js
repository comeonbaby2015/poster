poss.register.controller('productIndexController', function ($scope, $myhttp, $rootScope, $location, $http) {
    $scope.page = {currentPage: 1, pageSize: 10};
    $scope.operateAction = {};
    // 列头排序
    function resetOrderCode() {
        $scope.orderCodes = {
            status: {
                field: 'status',
                css: 'sorting',
                title: '产品状态'
            },
            amount: {
                field: 'amount',
                css: 'sorting',
                title: '投资总金额'
            }
        };
    }

    resetOrderCode();
    //查询列表
    $scope.queryProductList = function (pageIndex) {
        $scope.page.currentPage = pageIndex || 1;
        $scope.queryLoading = true;
        var param = {
            page: parseInt($scope.page.currentPage) - 1,
            size: $scope.page.pageSize,
            sortStr: $scope.sortStr,
            direction: $scope.direction
        };
        $myhttp('queryLoading', $scope).post('issuer/products.json', JSON.stringify(param), function (response) {
            if (!response.success) {
                alert(response.message);
            } else {
                var rs = response.data.rs;
                $scope.records = rs.data;
                $scope.page.totalPage = Math.ceil(parseInt(rs.recordsTotal) / parseInt($scope.page.pageSize));
            }
        }, 'JSON');
    }
// 列表列头排序
    $scope.headOrder = function (orderCode) {
        if ($scope.orderCodes[orderCode].css == 'sorting' || $scope.orderCodes[orderCode].css == 'sorting_desc') {
            resetOrderCode();
            $scope.orderCodes[orderCode].css = 'sorting_asc';
            $scope.direction = 'ASC';
        } else {
            resetOrderCode()
            $scope.orderCodes[orderCode].css = 'sorting_desc';
            $scope.direction = 'DESC';
        }
        $scope.sortStr = $scope.orderCodes[orderCode].field;

        $scope.queryProductList();
    };
    $scope.queryProductList();

    /**
     * 加载所有操作
     */
    $scope.getOperation = function() {
        $http.post("issuer/products/operations").success(function(data){
            if (data.success) {
                $scope.operations = data.data;
            }
        });
    }
    $scope.getOperation();

    /**
     * 操作确认
     * @param operation
     * @param id
     */
    $scope.operateConfirm = function(operation, id) {
        $('#operateConfirmDialog').show();
        $scope.operateMsg = "确定操作：" + $scope.operations[operation] + "?";
        $scope.operateAction.id = id;
        $scope.operateAction.operation = operation;
    }

    /**
     * 操作取消
     * @param operation
     * @param id
     */
    $scope.closeOperateConfirmDialog = function(operation, id) {
        $('#operateConfirmDialog').hide();
    }

    /**
     * 进行操作
     * @param operation
     * @param id
     */
    $scope.operate = function() {
        $scope.operateAction.params_date = $scope.params_date;
        $scope.closeOperateConfirmDialog();
        if ($scope.operateAction.operation == "EDIT") {
            location.href = "#/issuer/product/form?id=" + $scope.operateAction.id;
            return;
        }
        $http.post("issuer/products/operate", $scope.operateAction).success(function(data){
            $scope.showInfo(data.message);
            // 成功后，列表重新加载，否则状态和按钮不会变
            if (data.success) {
                $scope.queryProductList(1);
            }
        });
    }

    // 日期控件
    $('.form_datetime').datepicker({
        format: 'yyyy-mm-dd'
    });
})