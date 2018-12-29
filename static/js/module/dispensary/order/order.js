// 采购入库js
//@ sourceURL=order.js
$(function () {
    // 后台根据默认条件查询订单，默认条件：最近三个月的未入库订单
    $.getJSON('static/data/order.json', {}, loadOrder);
    // 订单查询条件改变事件
    $('.div-search .form-control').on('change', reloadOrder);
    // 初始化日期控件
    initDatetimepicker();
    // 初始化表格
    $('#orderTable').bootstrapTable();
    // 订单下拉框的change事件
    $('.div-search .selectpicker').on('change', queryOrderDetail);
    // 切换查询条件 显示/隐藏 的状态
    $('#toggleSearch').on('click',function () {
        $('.div-search form').toggle();
        if ($('.div-search form').is(':hidden')) {
            // 隐藏
            $(this).removeClass('glyphicon-chevron-down');
            $(this).addClass('glyphicon-chevron-up');
        } else {
            $(this).removeClass('glyphicon-chevron-up');
            $(this).addClass('glyphicon-chevron-down');
        }
    });

    /**
     * 加载订单明细
     * @param even
     */
    function queryOrderDetail(even) {
        var orderId = $('.div-search .selectpicker').val();
        // 根据orderId查询订单和订单明细
        $.getJSON('/static/data/orderDetail.json', {orderId: orderId}, loadOrderDetail);
    }

    /**
     * 加载订单明细
     * @param data
     */
    function loadOrderDetail(data) {
        $('.div-detail form p[name="date"]').html(data.date);
        $('.div-detail form p[name="dealer"]').html(data.dealer);
        $('.div-detail form p[name="phone"]').html(data.phone);
        $('.div-detail form p[name="totalPrice"]').html(data.totalPrice + '元');
        $('#orderTable').bootstrapTable('load', data.orderDetail);// 表格
    }

    /**
     * 查询参数改变后重新加载订单
     */
    function reloadOrder() {
        var data = {};
        $('.div-search .form-control').each(function (index, element) {
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
        $('.div-search .selectpicker').change();
    }

    /**
     * 初始化日期选择器
     * @param value
     */
    function initDatetimepicker(value) {
        var option = {
            format: 'yyyy-mm',
            autoclose: true,
            todayHighlight: true,
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

    // 定义表格列
    // 药品属性：药品名称，药品规格，药品分类，药品剂型，拼音简码，条形码，产地/厂家，生产日期，有效期至
    // 订单属性：进货数量，进货单位，进货单价，总价
    // 销售属性：零售单位，入库售价加成%，零售单价

});

/**
 * 表格操作列
 * @param value
 * @param row
 * @param index
 * @returns {string}
 */
function operateFormatter(value, row, index) {
    return [
        '<a class="like" href="javascript:void(0)" title="修改">',
        '<span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>',
        '</a>  ',
        '<a class="remove" href="javascript:void(0)" title="删除">',
        '<span class="glyphicon glyphicon-trash" aria-hidden="true"></span>',
        '</a>'
    ].join('');
}

/**
 * 表格操作列按钮点击事件
 */
window.operateEvents = {
    'click .like': function (e, value, row, index) {
        alert('You click like action, row: ' + JSON.stringify(row));
    },
    'click .remove': function (e, value, row, index) {
        $table.bootstrapTable('remove', {
            field: 'id',
            values: [row.id]
        });
    }
};
