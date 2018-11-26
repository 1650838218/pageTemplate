/*数据字典*/
//@ sourceURL=dictionary.js
$(function () {
    // 查询并加载数据字典 tree
    $.getJSON('static/data/dictionary.json', loadTree);
    // 模态框隐藏时重置表单
    $('#dictionaryModal').on('hidden.bs.modal', function (e) {
        $("#dictionaryModal input").val('');
    });
    // 模态框 保存 按钮绑定点击事件
    $('#saveBtn').on('click', saveBtnClick);

    /**
     * 模态框 保存 按钮点击事件
     */
    function saveBtnClick() {
        $('#dictionaryModal form').bootstrapValidator('validate');// 触发校验
        var flag = $('#dictionaryModal form').data('bootstrapValidator').isValid();// 获取校验结果
        if (flag) {
            saveDictionary($('#dictionaryModal form').serialize());
        }
    }

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
                    if (node.type == 0) {
                        node.isParent = true;
                    }
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
            if (parentNode) {
                $("#dictionaryModal input[name='pId']").val(parentNode.pId);// 设置pId
            } else {
                $("#dictionaryModal input[name='pId']").val(0);// 设置pId
            }
            $("#dictionaryModal input[name='type']").val(treeNode.level);// 设置节点类型
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
     * 数据字典保存
     * @param data
     */
    function saveDictionary(data) {
        $.post('', data, function (resultData, textStatus, jqXHR) {
            if (resultData) {
                layer.msg(MSG.save_success, {offset: 'rb', time: 2000});
                // 数据设置
                resultData.showName = resultData.name + "【" + resultData.code + "】";
                if (resultData.type == 0) {
                    resultData.isParent = true;
                }
                var treeobj = $.fn.zTree.getZTreeObj('dictionaryTree');// 获取ztree
                var oldNode = treeobj.getNodeByParam('id',resultData.id,null);// 根据id查询是否存在该节点
                if (oldNode == null) {// 新增 不存在
                    var parentNode = treeobj.getNodeByParam('id', resultData.pId, null);
                    var newNodes = treeobj.addNodes(parentNode, resultData);
                    treeobj.selectNode(newNodes[0]);
                } else {// 修改 存在
                    oldNode.name = resultData.name;
                    oldNode.code = resultData.code;
                    oldNode.showName = resultData.showName;
                    treeobj.updateNode(oldNode);
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
                var msg = MSG.delete_confirm + ' ' + treeNode.name + ' 吗?';
                var url = '';
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

