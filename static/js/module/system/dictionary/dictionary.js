/*数据字典*/
//@ sourceURL=dictionary.js
$(function () {
    // 查询并加载数据字典 tree
    $.getJSON('static/data/dictionary.json', loadTree);
    // 模态框隐藏时重置表单
    $('#dictionaryModal').on('hidden.bs.modal', function (e) {
        $("#dictionaryModal input").val('');
    });
    // 模态框 保存 按钮点击事件
    $('#saveBtn').on('click', function () {
        // flag = true/false
        var flag = $(formName).data(“bootstrapValidator”).isValid();
    });
    // 表单验证
    $('#dictionaryModal form').bootstrapValidator({
        message: 'This value is not valid',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            name: {
                // message: '名称验证失败',
                validators: {
                    notEmpty: {
                        message: '名称不能为空！'
                    }
                }
            },
            code: {
                validators: {
                    notEmpty: {
                        message: '值不能为空！'
                    }
                }
            }
        }
    });

    // ztree 参数设置
    var setting = {
        view: {
            addHoverDom: addHoverDom,
            removeHoverDom: removeHoverDom,
            showLine: false,
            selectedMulti: false
        },
        edit: {
            enable: true,
            showRemoveBtn: showRenameAndRemoveBtn,
            showRenameBtn: showRenameAndRemoveBtn,
            removeTitle: BTN.delete,
            renameTitle: BTN.edit
        },
        data: {
            simpleData: {
                enable: true
            },
            key:{
              name:"showName"
            }
        },
        callback: {
            beforeEditName: beforeEditName,
            beforeRemove: beforeRemove
        }
    };

    /**
     * 是否显示编辑删除按钮
     * @param treeId
     * @param treeNode
     * @returns {boolean}
     */
    function showRenameAndRemoveBtn(treeId, treeNode) {
        return treeNode.pId != null;
    }

    /**
     * 加载数据字典
     * @param zNodes
     */
    function loadTree(zNodes) {
        if (zNodes.length > 0) {
            $.each(zNodes,function (i,node) {
                if (node.pId != null) {
                    node.showName = node.name + "【" + node.code + "】";
                } else {
                    node.showName = node.name;
                    node.isParent = true;
                }
            });
            var dictionaryTree = $.fn.zTree.init($("#dictionaryTree"), setting, zNodes);
            dictionaryTree.expandAll(true);
            // 搜索框内容改变监听事件
            fuzzySearch('dictionaryTree', '#searchInput', null, true); //初始化模糊搜索方法
            dictionaryTree.selectNode(dictionaryTree.getNodes()[0])
            $('.blank-text-div').hide();// 隐藏提示信息
        } else {
            // 没有数据时显示提示信息
            $('.blank-text-div').show();
        }
    }

    /**
     * 显示添加按钮
     * @param treeId
     * @param treeNode
     */
    function addHoverDom(treeId, treeNode) {
        var sObj = $("#" + treeNode.tId + "_span");
        if (treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0) return;
        var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
            + "' title='添加' onfocus='this.blur();'></span>";
        sObj.after(addStr);
        var btn = $("#addBtn_"+treeNode.tId);
        if (btn) {
            btn.bind("click", treeNode, add);
        }
    };

    /**
     * 移除添加按钮
     * @param treeId
     * @param treeNode
     */
    function removeHoverDom(treeId, treeNode) {
        $("#addBtn_"+treeNode.tId).unbind().remove();
    };

    /**
     * 点击添加图标触发
     */
    function add(event) {
        if (!event) return;
        var treeNode = event.data;
        if (treeNode) {
            var parentNode = treeNode.getParentNode();
            $("#dictionaryModal input[name='pId']").val(parentNode.pId);// 设置pId
        }
        $('#dictionaryModal').modal();
    }
    
    /**
     * 点击编辑图标触发
     */
    function beforeEditName(treeId, treeNode) {
        if (treeNode) {// 给表单赋值
            $("#dictionaryModal input[name='id']").val(treeNode.id);
            $("#dictionaryModal input[name='pId']").val(treeNode.getParentNode().id);
            $("#dictionaryModal input[name='name']").val(treeNode.name);
            $("#dictionaryModal input[name='code']").val(treeNode.code);
        }
        $('#dictionaryModal').modal();
        return false;
    }

    /**
     * 弹出编辑框
     */
    function showEditWindow(option, callback) {
        // 将编辑面板移动到index.html的layerPanel中，不做这一步，遮罩会有问题
        $("#layerPanel").append($("#layerContent div"));
        var localOption = {
            skin: 'layer-myskin',
            title: '基本信息',
            btn: [BTN.save],
            content: $("#layerPanel"),
            end: function () {
                // 重置所有输入项
                $("#layerPanel").find("input").each(function (index, element) {
                    $(element).val('');
                });
                // 将弹出框源码放到原位置
                $("#layerContent").append($("#layerPanel div"));
            },
            yes: function (index, layero) {
                // 获取表单的数据，并保存
                var data = {};
                $("#layerPanel").find("input").each(function (index, element) {
                    data[$(element).attr('name')] = $(element).val();
                });
                if (callback.validate(data)) {
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                    callback.save(data);// 回调方法，保存
                }
            }
        };
        layer.prompt($.extend(localOption, option));
    }

    /**
     * 数据校验
     * @param data
     */
    function validate(data) {
        if (!data || !data.name) {
            layer.msg('请填写疾病名称！', {icon: 2, time: 1000});
            $("#layerPanel").find("input[name='name']").focus();
            return false;
        } else if (data.name.length > 10) {
            layer.msg('疾病名称不能超过10个汉字！', {icon: 2, time: 2000});
            $("#layerPanel").find("input[name='name']").focus();
            return false;
        }
        return true;
    }

    /**
     * 疾病保存
     * @param data
     */
    function saveDictionary(data) {
        $.post('/prescription/Dictionary/save', data, function (data, textStatus, jqXHR) {
            if (data) {
                layer.msg(MSG.save_success, {offset: 'rb', time: 2000});
                // 增加节点并选中
                var treeobj = $.fn.zTree.getZTreeObj('dictionaryTree');
                if (treeobj != null) {
                    data.isDictionary = true;
                    var oldNode = treeobj.getNodeByParam('id',data.id,null);
                    if (oldNode == null) {// 新增
                        var newNodes = [];
                        if (data.pId == -1) {
                            newNodes = treeobj.addNodes(null, data);
                        } else {
                            var parentNode = treeobj.getNodeByParam('id', data.pId, null);
                            newNodes = treeobj.addNodes(parentNode, data);
                        }
                        treeobj.selectNode(newNodes[0]);
                        treeobj.setting.callback.onClick(null, treeobj.setting.treeId, newNodes[0]);
                    } else {// 修改
                        oldNode.name = data.name;
                        treeobj.updateNode(oldNode);
                        // treeobj.setting.callback.onClick(null, treeobj.setting.treeId, oldNode);
                    }
                } else {
                    $.getJSON('/prescription/Dictionary/loadTree', loadTree);
                }
            } else {
                layer.msg(MSG.save_fail, {offset: 'rb', time: 2000});
            }
        })
    }

    /**
     * 点击删除图标触发
     */
    function beforeRemove(treeId, treeNode) {
        if (treeNode) {
            if (treeNode.children) {// 有子节点
                layer.msg('请先删除子节点！',{time:2000});
            } else {
                var msg = '',url = '';
                if (treeNode.isDictionary) {
                    msg = MSG.delete_confirm + '名为' + treeNode.name + '的疾病类型及其处方吗?';
                    url = '/prescription/Dictionary/delete/';
                } else {
                    msg = MSG.delete_confirm + '名为' + treeNode.name + '的处方吗?';
                    url = '/prescription/prescribe/delete/';
                }
                layer.confirm(msg, {icon: 3, title: BTN.delete }, function (index) {
                    // 后台删除
                    $.ajax({
                        url: url + treeNode.id,
                        type: 'DELETE',
                        success: function (data, textStatus, jqXHR) {
                            if (data) {
                                layer.msg(MSG.delete_success, {offset: 'rb', time: 2000});
                                // ztree删除节点
                                var treeobj = $.fn.zTree.getZTreeObj(treeId);
                                treeobj.removeNode(treeNode, false);// 不触发回调方法
                            } else {
                                layer.msg(MSG.delete_fail, {offset: 'rb', time: 2000});
                            }
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            layer.msg(MSG.delete_fail, {offset: 'rb', time: 2000});
                        }
                    });
                    layer.close(index);
                });
            }
        }
        return false;
    }

});

