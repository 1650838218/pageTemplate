// 采购入库js
//@ sourceURL=order.js
$(function () {
    // 后台根据默认条件查询订单，默认条件：最近三个月的未入库订单
    $.getJSON('static/data/order.json', {}, loadOrder);

    $('.div-search .form-control').on('change',reloadOrder);

    // 初始化日期控件
    initDatetimepicker();

    /**
     * 查询参数改变后重新加载订单
     */
    function reloadOrder() {
        var data = {};
        $('.div-search .form-control').each(function (index,element) {
            var name = $(element).attr('name');
            var val = $(element).val();
            console.log(element);
            data[name] = val;
        });
        // console.log(data);
        $.getJSON('static/data/order.json', data, loadOrder);
    }

    /**
     * 加载订单
     * @param data
     */
    function loadOrder(data) {
            // 初始化日期选择器和单选按钮
        $(".div-search input[name='startDate']").val(data.startDate);
        $(".div-search input[name='endDate']").val(data.endDate);
        $(".div-search select[name='type']").val(data.type);
        initSelectPicker(data.content);
    }

    /**
     * 初始化订单下拉框
     * @param content
     */
    function initSelectPicker(content) {
        if (!content || content.length <= 0) return;
        var options = [], _options;
        for (var i = 0; i < content.length; i++) {
            var option = '';
            if (i == 0) {
                option = '<option selected value="' + content[i].id + '">' + content[i].name + '</option>';
            } else {
                option = '<option value="' + content[i].id + '">' + content[i].name + '</option>';
            }
            options.push(option);
        }
        _options = options.join('');
        $('.div-search .selectpicker')[0].innerHTML = _options;
        $('.div-search .selectpicker').selectpicker('render');
    }

    /**
     * 初始化日期选择器
     * @param value
     */
    function initDatetimepicker(value) {
        var option = {
            format: 'yyyy-mm',
            autoclose:true,
            todayHighlight:true,
            startView: 3,
            minView: 3
        };
        var startDate = $(".div-search input[name='startDate']");
        var endDate = $(".div-search input[name='endDate']");
        startDate.datetimepicker(option).on('click', function (e) {
            startDate.datetimepicker("setEndDate", endDate.val());
        });
        endDate.datetimepicker(option).on('click', function (e) {
            endDate.datetimepicker("setStartDate", startDate.val());
        });
    }

});