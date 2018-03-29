(function(){

var StringUtil = require('./stringUtil.js');


//*******************************************参数配置区域****************************************************

var editorConfig = {
    // 代码编辑器
    'codeEditor': './views/editor/default_editor.html',
    // 流程编辑器
    'stepEditor': './views/editor/step_editor.html',
    // 页面编辑器
    'htmlEditor': './views/editor/html_editor.html',
    //变量编辑器
    'varEditor': './views/editor/var_editor.html',
};

// monaco-edit 主题列表："vs", "vs-dark", "hc-black"
  exports.editorTheme = localStorage.getItem('theme');


//*******************************************外部调用方法****************************************************
/**
 * 获取标签页所需参数
 * @param  {string} filePath 文件全路径
 * @return {json}            标签页所需参数
 */
exports.getEditor = function (filePath){
    var editor = _saveFileInfo(filePath);
    if(editor.relativePath.toUpperCase() == 'STEP' && editor.suffix == "xml"){
        editor.editorURL = editorConfig.stepEditor;
    }else if(editor.relativePath.toUpperCase() == 'CFG' && editor.suffix == "xml"){
        editor.editorURL = editorConfig.varEditor;
    }
    else if(editor.suffix == "html"){
        editor.editorURL = editorConfig.htmlEditor;
    }else{
        editor.editorURL =editorConfig.codeEditor;
    }
    return editor
};


//*******************************************内部调用方法****************************************************

function _saveFileInfo(filePath){
    var rdpdir = localStorage.getItem('projectDir');
    var path = filePath.substring(0, filePath.lastIndexOf('\\'));
    path = path.replace('/', '\\');
    var relativePath = path.substr(rdpdir.length+1);
    
    var file = filePath.substring(filePath.lastIndexOf('\\')+1, filePath.length);
    var fileName = file.substring(0, file.lastIndexOf('.'));
    var suffix = file.substring(file.lastIndexOf('.')+1, file.length);
    var fileType;

    if(suffix === 'js') {   fileType = 'javascript'     }
    else {      fileType = suffix;      }

    var tabParams = {};
    tabParams.path = path;
    tabParams.file = file;
    tabParams.fileName = fileName;
    tabParams.suffix = suffix;
    tabParams.fileType = fileType;
    tabParams.fileUrl = filePath;
    tabParams.relativePath = relativePath;

    return tabParams;
}



})();