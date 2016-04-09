//使用闭包
(function () {
    //使用严格模式
    'use strict';
    //避免声明变量，而是使用getter的链式语法
    angular.module('poss').controller('FmallProductIndexController', FmallProductIndexController);
    function FmallProductIndexController($scope, $myhttp, $location) {
        var vm = this;
        //-------------初始化设置和调用----------------------
        vm.page = {currentPage: 1, pageSize: 10};
        vm.channelOperate = {
            ON_LINE_OPERATE: "上架",
            OFF_LINE_OPERATE: "下架",
            ON_SALE_OPERATE: "开始销售",
            OFF_SALE_OPERATE: "停止销售",
            INVEST_OPERATE: "放款",
            REFUND_OPERATE: "退款",
            REPAYMENT_OPERATE: "还本金",
            PROFIT_OPERATE: "发收益",
            OVERDUE_REPAYMENT_OPERATE: "备用金还款"
        };
        resetSortField();
        queryProductList();
        //---------------可绑定成员放到顶部-------------------
        //查询列表
        vm.queryProductList = queryProductList;
        // 列表列头排序
        vm.headSort = headSort;
        //更改产品上下架状态
        vm.changeState = changeState;
        //更改销售状态
        vm.changeSaleState = changeSaleState;
        //放款
        vm.loan = loan;
        //退款
        vm.refund = refund;
        //同步产品
        vm.synchProduct = synchProduct;
        //还款
        vm.repay = repay;
        //备用金还款
        vm.reserveRepayment = reserveRepayment;

        //-----------------成员函数列表------------------
        /**
         * 查询列表
         * @param pageIndex
         */
        function queryProductList(pageIndex) {
            vm.page.currentPage = pageIndex || vm.page.currentPage || 1;
            vm.queryLoading = true;
            var param = {
                page: vm.page.currentPage,
                pageSize: vm.page.pageSize,
                sortStr: vm.sortStr,
                direction: vm.direction
            };
            $myhttp('queryLoading', vm).post('fmall/products.json', JSON.stringify(param), function (response) {
                if (!response.success) {
                    alert(response.message);
                } else {
                    var rs = response.data.rs;
                    vm.records = rs.data;
                    $.each(vm.records, function (i, product) {
                        $.each(product.channelOperate, function (j, channelOperate) {
                            product[channelOperate.operate] = true;
                            if (channelOperate.operate === "NONE_OPERATE") {
                                product.message = channelOperate.message;
                            }
                        });
                    });
                    vm.page.totalPage = rs.recordsTotal;
                }
            }, 'JSON');

        }

        /**
         * 设置排序字段
         */
        function resetSortField() {
            vm.orderCodes = {
                status: {
                    field: 'status',
                    css: 'sorting',
                    title: '产品状态'
                },
                shares: {
                    field: 'shares',
                    css: 'sorting',
                    title: '投资总金额'
                }
            };
        }

        /**
         *列表列头排序
         * @param orderCode
         */
        function headSort(orderCode) {
            if (vm.orderCodes[orderCode].css == 'sorting' || vm.orderCodes[orderCode].css == 'sorting_desc') {
                resetSortField();
                vm.orderCodes[orderCode].css = 'sorting_asc';
                vm.direction = 'ASC';
            } else {
                resetSortField()
                vm.orderCodes[orderCode].css = 'sorting_desc';
                vm.direction = 'DESC';
            }
            vm.sortStr = vm.orderCodes[orderCode].field;
            queryProductList();
        };

        /**
         * 更改产品上下架状态
         * @param product
         */
        function changeState(product, productSale, tag) {
            $scope.confirmCfg = $.extend(true, $scope.confirmCfg, {
                msg: "确定" + vm.channelOperate[tag] + product.name + "?",
                onclose: function () {
                },
                onconfirm: function () {
                    var param = {productMatrixId: product.productExchangeId, productChannelState: productSale};
                    $myhttp.post('fmall/products/changeState', JSON.stringify(param), function (response) {
                        if (response) {
                            var msg = response.message;
                            queryProductList();
                            $scope.doConfirmCfg.msg = msg;
                            poss.info(msg, 1000);
                        }
                    }, 'JSON');
                }
            });
            $scope.confirmCfg.handle.show();
        }

        /**
         * 更改销售状态
         * @param product
         */
        function changeSaleState(product, productSale, tag) {
            $scope.confirmCfg = $.extend(true, $scope.confirmCfg, {
                msg: "确定" + vm.channelOperate[tag] + product.name + "?",
                onclose: function () {
                },
                onconfirm: function () {
                    var param = {productId: product.productExchangeId, productSale: productSale};
                    $myhttp.post('fmall/products/changeSaleState', JSON.stringify(param), function (response) {
                        if (response) {
                            var msg = response.message;
                            queryProductList();
                            $scope.doConfirmCfg.msg = msg;
                            poss.info(msg, 1000);
                        }
                    }, 'JSON');
                }
            });
            $scope.confirmCfg.handle.show();
        }

        /**
         * 放款确认loan
         */
        function loan(product) {
            $scope.confirmCfg = $.extend(true, $scope.confirmCfg, {
                msg: "确定为" + product.name + "放款?",
                onconfirm: function () {
                    console.log("确定放款");
                    $myhttp.post('fmall/products/loan', product.productExchangeId, function (response) {
                        if (response) {
                            var msg = response.message;
                            queryProductList();
                            $scope.doConfirmCfg.msg = msg;
                            poss.info(msg, 1000);
                        }
                    }, 'JSON');
                }
            });
            $scope.confirmCfg.handle.show();
        }

        /**
         * 退款
         * @param product
         */
        function refund(product) {
            $scope.confirmCfg = $.extend(true, $scope.confirmCfg, {
                msg: "确定为" + product.name + "退款?",
                onconfirm: function () {
                    var param = {productId: product.productExchangeId};
                    $myhttp.post('fmall/products/refund', JSON.stringify(param), function (response) {
                        if (response) {
                            var msg = response.message;
                            queryProductList();
                            $scope.doConfirmCfg.msg = msg;
                            poss.info(msg, 1000);
                        }
                    }, 'JSON');
                }
            });
            $scope.confirmCfg.handle.show();
        }

        /**
         * 同步产品
         */
        function synchProduct() {
            $myhttp.post('fmall/products/synchProduct', null, function (response) {
                if (response) {
                    var msg = response.message;
                    queryProductList();
                    $scope.doConfirmCfg.msg = msg;
                    poss.info(msg, 1000);
                }
            }, 'JSON');
        }

        /**
         * 还款
         * PROFIT 还收益 REPAYMENT 换本金
         */
        function repay(product, fundtype, tag) {
            $scope.confirmCfg = $.extend(true, $scope.confirmCfg, {
                msg: "确定" + vm.channelOperate[tag] + product.name + "?",
                onclose: function () {
                },
                onconfirm: function () {
                    var param = {productExchangeId: product.productExchangeId, fundtype: fundtype};
                    $myhttp.post('fmall/products/repay', JSON.stringify(param), function (response) {
                        if (response) {
                            var msg = response.message;
                            queryProductList();
                            $scope.doConfirmCfg.msg = msg;
                            poss.info(msg, 1000);
                        }
                    }, 'JSON');
                }
            });
            $scope.confirmCfg.handle.show();
        }

        /**
         * 备用金还款
         */
        function reserveRepayment(product) {
            $scope.confirmCfg = $.extend(true, $scope.confirmCfg, {
                msg: "确定为" + product.name + "备用金还款?",
                onconfirm: function () {
                    $myhttp.post('fmall/products/reserveRepayment', product.productExchangeId, function (response) {
                        if (response) {
                            var msg = response.message;
                            queryProductList();
                            $scope.doConfirmCfg.msg = msg;
                            poss.info(msg, 1000);
                        }
                    }, 'JSON');
                }
            });
            $scope.confirmCfg.handle.show();
        }
    };
})();
