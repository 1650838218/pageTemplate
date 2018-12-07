// 采购入库js
//@ sourceURL=order.js
$(function () {
    // 后台根据默认条件查询订单，默认条件：最近三个月的未入库订单
    $.getJSON('url','data',loadOrder);


    /**
     * 加载订单
     * @param data
     */
    function loadOrder(data) {
        if (data.init) {
            // 初始化日期选择器和单选按钮
            initLayDate(data.dateRange);
            $(".form-search input[type='radio'][name='type'][value='2']").attr('checked',true);
        }
    }

    // 初始化日期选择器
    laydate.render({
        elem: ".form-search input[name='dateRange']",
        type: 'month',
        range: true,
        value: '1989-10-14'
    });

    // 后台请求订单数据
    // 初始化下拉框
});