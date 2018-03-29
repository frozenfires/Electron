(function(){

/**
 * 设置tab内容区域高度
 */
window.setTabHeight = function(){
    var tabPanelHeight = document.getElementById('tabPanel').offsetHeight - 30;
    // console.info(tabPanelHeight);
    $('#fileTabContent').css('height', tabPanelHeight + 'px');
    $('#fileTabContent').css('display', '');
    $('#tabTitle').css('display', '');
};


}());