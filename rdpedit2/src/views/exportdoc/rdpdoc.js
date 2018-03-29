(function(){
    var os = require('os');

console.debug(StringUtil);

function init(){
    document.title = "RDP参考文档-" + localStorage.getItem('projectDir');

    var mdurl = os.tmpDir() + "/rdpide/index.html";
    document.querySelector('#docdiv').innerHTML = 
        '<webview src="'+mdurl+'" style="display:flex; height:100%; " autosize="on" allowpopups nodeintegration></webview>';
}



init();
}())