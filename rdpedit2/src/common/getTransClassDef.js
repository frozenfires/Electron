(function(){
    var that = exports;
    var fs = require('fs');
    var iconv = require('iconv-lite');
/**
 * 获得组件名
   返回值为 Object 对象,key为 组件名 value 为组件描述
 */
that.getClassDefId = function(){
   var ClassDefId ={
    "JumpNode":"节点跳转",
    "JumpStep":"流程跳转",
    "CallStep":"调用流程",
    "CallReturn":"调用流程返回",
    "InputData": "展示页面",
    "ShowPage": "展示页面",
    "KeybdInputData": "展示页面",
    "JournalPrint": "打印日志",
    "RunScript": "运行脚本",
    "SetData": "设置数据",
    "SwitchData": "Switch",
    "WaitMultipleEvent": "监听事件",
    "ClearUserData": "清除用户数据",
    "CompareData": "数据比较",
    "MsgComm": "通讯",
    "MsgPack": "打包",
    "ClearEvent": "清除事件"
  };

   return ClassDefId;
}

/**
 * 获得参数名
   返回值为 Object 对象,key为 参数名 value 为参数描述
 */
that.getClassDefParam = function() {
    var ClassDefParam ={
      "Node":"节点名",
      "Step":"流程名",
      "FunName":"函数名",
      "FileName":"脚本文件名",
      "Condition": "Condition",
      "ConnectName": "ConnectName",
      "CurrencyID": "CurrencyID",
      "CustomerData": "CustomerData",
      "Default": "Default",
      "FieldName": "FieldName",
      "FieldValue": "FieldValue",
      "FunParam": "FunParam",
      "GetData": "GetData",
      "PageID": "PageID",
      "PageName": "PageName",
      "PrintText1": "PrintText1",
      "ShowData": "ShowData",
      "Time": "Time",
      "TimeOut": "TimeOut",
      "VarName": "VarName",
      "VarValue": "VarValue",
      "WaitEvents": "WaitEvents"
    };
    
    return ClassDefParam;
}



//----------------------------内部方法分界线--------------------------------------------------
that.encodeZujian = function() {
//function encodeZujian(){
     var path = localStorage.getItem('projectDir')+'/cfg/TransClassDef.xml';
     var xmlstr = downloadXmlfile(path);
     var xmlObj = $.text2xml(xmlstr); 
     var rootXml = (xmlObj.children[0]).children[0];   
      
      var encodeClassDef =[]; 
     for(var i=0; i<rootXml.children.length; i++){
         var itemXml = rootXml.children[i];
         var buildStep = buildClassDefModel(itemXml);
      encodeClassDef.push(buildStep);
    }

      var stepmap =[];
      for(var index =0;index<encodeClassDef.length;index++){
        for(var i in encodeClassDef[index].stepmap){
          stepmap.push(encodeClassDef[index].stepmap[i]);
        }
      }
      console.info('----stepmap-----');
      console.info(stepmap);
   return stepmap;
}


function buildClassDefModel(root) {
    var myStep = {
            stepmap: {}, 
            noreturnstep: [],
            allreturn: {}
        };

    for(var i=0; i<root.children.length; i++){
        var item = root.children[i];
        var step;
        try{
            step = buildClassDefItem(item);
        }catch(e){
            continue;
            console.info(item.innerHTML);
        }

        if(step.returnSize < 1){
            myStep.noreturnstep.push(step);
        }else{
            for(nodeName in step.return){
                myStep.allreturn[nodeName] = nodeName;
            }
        }
        myStep.stepmap[step.nodeName] = step;
    }
    return myStep;
}


//解析每一节点信息
function buildClassDefItem(item) {
    var step = {};
    step.code = item.outerHTML;
    step.nodeName = item.nodeName;
  /*   step.remark = item.getAttribute('Remark');*/
    step.classDef ={};
    step.param ={};
    step.paramSize =0;
    step.classDef[item.nodeName] = item.getAttribute('Remark');
    var paramObj = item.getElementsByTagName('Params');
     if(paramObj.length > 0){
        var parObj = paramObj[0];
        var params = parObj.getElementsByTagName('*');
        for(var n=0; n<params.length; n++){
            var paramsObj = params[n];
            step.param[paramsObj.getAttribute('Remark')] = paramsObj.tagName;
            step.paramSize ++;
        }
    }
    return step;
}


    /**
     * 读取文件内容
     */
    function downloadXmlfile(xmlpath) {
        var xmlObj = fs.readFileSync(xmlpath, 'latin1');
        xmlObj = iconv.decode(xmlObj, 'GBK');
        // console.info(xmlObj);
        return xmlObj;
    }


}())





