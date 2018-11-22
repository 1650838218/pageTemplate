$(function(){
    // 加载菜单
    /* $.ajax({
        url:"../data/menu.json",
        type:"get",
        dataType:"json",
        success:function(data, textStatus, jqXHR){
            if (data) {
                initMenu(data);
            } else {
                layer.msg('菜单加载失败！', {icon: 2, time: 1000});
            }
        },
        error:function(XMLHttpRequest, textStatus, errorThrown) {
            layer.msg('菜单加载失败！', {icon: 2, time: 1000});
        }
    }); */
    initMenu(menuData);
    
    // 根据查询结果初始化菜单
    function initMenu(menuData) {
        var menuHtml = "";
        menuHtml += "<ul>";
        $.each(menuData,function(i,n){
            menuHtml += "<li>";
            menuHtml += "<a href=\"" + n.url + "\">";
            menuHtml += "<i class=\"" + n.icon + " nav-icon\"></i>";
            
            if (n.children.length > 0) {
                menuHtml += "<span class=\"nav-text icon-right\">" + n.name + "</span>";
                menuHtml += "<i class=\"icon iconfont icon-i-arrow-right\"></i>";
            } else {
                menuHtml += "<span class=\"nav-text\">" + n.name + "</span>";
            }
            menuHtml += "</a>";
            if (n.children.length > 0) {
                menuHtml += "<ul>";
                $.each(n.children, function(j,m){
                    menuHtml += "<li>";
                    menuHtml += "<a class=\"subnav-text\" href=\"" + m.url + "\">" + m.name + "</a>";
                    menuHtml += "</li>";
                }); 
                menuHtml += "</ul>";
            }
            menuHtml += "</li>";
        });
        menuHtml += "</ul>";
        $("nav.main-menu").prepend(menuHtml);
    }
});