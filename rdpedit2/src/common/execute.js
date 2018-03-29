(function(){

//*******************************************参数配置区域****************************************************
var childProcess = require('child_process');
var browserList = ["iexplore", "chrome", "firefox"];

//*******************************************外部调用方法****************************************************

/**
 * 打开浏览器
 * @param  {string} url     浏览地址
 * @param  {string} browser 浏览器(不选时以默认浏览器打开)
 *                          取  值[iexplore,chrome,firefox]
 * @return 无返回值
 */
exports.openBrowser = function(url, browser){
    var _browser = browserList.indexOf(browser) < 0 ? "" : browser;
    url = browser === "firefox" ? ("file:///"+url) : url;
    childProcess.exec("start "+_browser+" "+url,function(data){
        if(data !== null){
            console.info("openBrowser error data: \n" + data);
        }
    });
};


/**
 * 打开exe程序
 * @param  {string} exeFile 执行文件绝对路径
 *                          或者执行文件名称(后缀名没有限制)
 * @return 无返回值
 */
exports.openExe = function(exeFile){
    var file = 'start ' + exeFile;
    if(exeFile.indexOf('/') > -1 || exeFile.indexOf('\\') > -1){
        file = '"'+exeFile+'"';
    }
    childProcess.exec(file, function(data){//当成功时，data 会是 null
    	if(data !== null){
            console.info("openExe error ret: \n" + data);
    		console.info("error path: " + file);
    		alert('打开程序失败：请检查执行文件的路径或名称是否有误！'
                +'\n当前执行文件(名称/路径)：\n' + file);
    	}
    });
};


})();