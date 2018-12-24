// 采购入库js
//@ sourceURL=order.js
$(function () {
    // 后台根据默认条件查询订单，默认条件：最近三个月的未入库订单
    $.getJSON('static/data/order.json', {}, loadOrder);

    $('.div-search .form-control').on('change',reloadOrder);

    // 初始化日期控件
    initDatetimepicker();

    $('#orderTable').bootstrapTable({
        url: '',
        columns: orderTableColumns,
    });

    // 订单下拉框的change事件
    $('.div-search .selectpicker').on('change',queryOrderDetail);

    /**
     * 加载订单明细
     * @param even
     */
    function queryOrderDetail(even) {
        var orderId = $('.div-search .selectpicker').val();
        // 根据orderId查询订单和订单明细
        $.getJSON('/static/data/orderDetail.json',{orderId:orderId}, loadOrderDetail);
    }

    /**
     * 加载订单明细
     * @param data
     */
    function loadOrderDetail(data) {

    }
    
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

    // 定义表格列
    var orderTableColumns = [{
        field: 'name',
        title: '名称'
    }, {
        field: 'type',
        title: '类型'
    }, {
        field: 'specifications',
        title: '规格'
    }, {
        field: 'count',
        title: '数量'
    }, {
        field: 'unitPrice',
        title: '单价'
    }, {
        field: 'productionDate',
        title: '生产日期'
    }, {
        field: 'effectiveDate',
        title: '有效期至'
    }, {
        field: 'producer',
        title: '生产企业'
    }, {
        field: 'totalPrice',
        title: '总价'
    }];

    /**
     * 表格操作列
     * @param value
     * @param row
     * @param index
     * @returns {string}
     */
    function operateFormatter(value, row, index) {
        return [
            '<a class="like" href="javascript:void(0)" title="Like">',
            '<i class="fa fa-heart-o"></i>',
            '</a>  ',
            '<a class="remove" href="javascript:void(0)" title="Remove">',
            '<i class="fa fa-trash"></i>',
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
});