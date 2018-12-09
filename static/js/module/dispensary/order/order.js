// 采购入库js
//@ sourceURL=order.js
$(function () {
    // 后台根据默认条件查询订单，默认条件：最近三个月的未入库订单
    $.getJSON('static/data/order.json',{},loadOrder);


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
        // $('.form-search .selectpicker')[0].innerHTML = _options;
        $('.form-search .selectpicker').selectpicker('val', ['Mustard','Relish']);
    }

    /**
     * 初始化日期选择器
     * @param value
     */
    function initLayDate(value) {
        // 初始化日期选择器 .form-search input[name='dateRange']
        $("#dateTest").datetimepicker({
            todayBtn:  'linked',
            autoclose: true,
            todayHighlight: true,
        });
    }

});