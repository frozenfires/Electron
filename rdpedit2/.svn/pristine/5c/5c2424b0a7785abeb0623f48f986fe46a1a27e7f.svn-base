(function(){

var fs = require('fs');
var iconv = require('iconv-lite');
var editorData = {};
var ipcRenderer = require('electron').ipcRenderer;




/**
 * 保存文件
 * @param  {string} fileId   文件id
 * @return 文件保存结果
 */
window.saveFile = function (fileId){
    return _saveFile(fileId);
};

/**
 * 获取文件状态
 * @param  {string} fileId   文件id
 * @return 无
 */
window.getfileStatus = function (fileId){
    return _getfileStatus(fileId);
};

/**
 * 保存编辑器对象信息
 * @param  {string} editorId   编辑器对象id
 * @param  {object} editorInfo 编辑器对象信息
 * @return undefined
 */
window.putEditorInfo = function (editorId, editorInfo){
    _putEditorInfo(editorId, editorInfo);
};

/**
 * 保存编辑器模型对象信息
 * @param  {string} editorId    编辑器对象id
 * @param  {object} editorModel 模型对象信息
 * @return undefined
 */
window.putEditorModel = function (editorId, editorModel){
    _putEditorModel (editorId, editorModel);
};




//*******************************************内部方法****************************************************

function _putEditorInfo (editorId, editorInfo){
    if(!editorData[editorId]){
        editorData[editorId] = editorInfo;
        _sendFileUrl(editorId);
    }
};

function _removeEditorInfo (editorId){
    if(editorData[editorId]){
        delete editorData[editorId];
    }
};

function _putEditorModel (editorId, editorModel){
    var modelValue = editorData[editorId]['modelValue'];
    var changeModelValue = editorModel.getValue();
    if(modelValue === changeModelValue){
        console.info('收到文件修改事件:当前修改后的内容与原内容一致，无需保存...');
        _removeEditorModel (editorId, 'changeModel');
        // 发送取消文件修改事件
        ipcRenderer.send('tabEvent', 'cmd_view_fileChange_cancel', editorId);
        return;
    }
    if(!editorData[editorId]['changeModel']){
        editorData[editorId]['changeModel'] = editorModel;
        // 发送文件修改事件
        console.info('收到文件修改事件:当前修改后的内容与原内容不一致，需要保存...');
        ipcRenderer.send('tabEvent', 'cmd_view_fileChange', editorId);
    }
};

function _removeEditorModel (editorId, modelId){
    if(editorData[editorId][modelId]) delete editorData[editorId][modelId];
};

function _getEditorInfoAll (){
    return editorData;
};

function _getEditorInfoById (editorId){
    return editorData[editorId];
};

function _getFileUrl (editorId){
    if(editorData[editorId]){
        return editorData[editorId]['urlparams']['fileUrl'];
    }else{
        return '';
    }
};

function _sendFileUrl (editorId){
    ipcRenderer.send('tabEvent', 'cmd_view_updateTitle', _getFileUrl(editorId));
};

function _getfileStatus (editorId){
    var changeFlag = false;
    if(editorData[editorId]['changeModel']) changeFlag = true;
    return {
        "file" : editorData[editorId]['urlparams']['fileId'],
        "isChange" : changeFlag
    };
};

/**
 * 保存当前文件
 * @param {string} editorId 编辑器对象id
 * @return {string} 0:成功 -1:失败
 */
function _saveFile (editorId){
    var editor = _getEditorInfoById(editorId);
    var model = editor['changeModel'];
    if(!model){ 
        console.info('当前文件未做修改，取消保存！'); 
        return {
            "fileId" : editorId,
            "result" : "1",
            "message" : ""
        };
    }
    var filePath = editor.urlparams.fileUrl;
    var newContent = iconv.encode(model.getValue(), editor.encoding);
    try{
        fs.writeFileSync(filePath, newContent);
        console.info('保存文件成功...');
        editorData[editorId]['modelValue'] = model.getValue();
        _removeEditorModel(editorId, 'changeModel');
        // 发送取消文件修改事件
        ipcRenderer.send('tabEvent', 'cmd_view_fileChange_cancel', editorId);
        return {
            "fileId" : editorId,
            "result" : "0",
            "message" : ""
        };
    }catch(e){
        console.info('保存文件时发生异常:');
        console.info(e.message || e.stack || e);
        return {
            "fileId" : editorId,
            "result" : "-1",
            "message" : e.message
        };
    }
};




}());