(function(){
    var fs = require('fs');
    var iconv = require('iconv-lite');

    var that = exports;

/**
 * 解析step模型
 * {
        error: '', // 解析失败时该属性出现并记录错误原因
        doc: '', // 流程顶部注释
        remark: '', // remark
        module: '', // 所属模块
        order: '', // 排序序号
        steps: {// 所有流程节点对象
            code: '', // 源码片段
            id: '', // stepid
            remark: '', // remark
            class: '', // class
            params: {}, // 参数对象
            returns: {} // returns对象
        }, 
        stepGroup: {} // 流程节点按class分组
    }
 */
that.parse = function(path){
    var stepObj = {};
    var xmlObj = fs.readFileSync(path);
    xmlObj = iconv.decode(xmlObj, 'GBK');
    xmlObj = $.text2xml(xmlObj);
    var root = xmlObj.documentElement;

    // xml语法有误
    if(root.outerHTML.indexOf('This page contains the following errors:') > -1){
        stepObj.error = root.outerHTML;
        return stepObj;
    }

    stepObj.doc = (xmlObj.firstChild.nodeType = xmlObj.COMMENT_NODE) 
        ? xmlObj.firstChild.nodeValue : '';
    stepObj.remark = root.getAttribute('Remark');
    stepObj.module = root.getAttribute('module') || '';
    stepObj.order = root.getAttribute('order') || '';
    stepObj.steps = {};
    stepObj.stepGroup = {};

    for(var index=0; index<root.children.length; index++){
        var itemobj = parseStepitem(root.children[index]);
        if(itemobj.error){
            console.info(path);
            console.error(itemobj.error);
        }
        
        if(!stepObj.stepGroup[itemobj.class])
            stepObj.stepGroup[itemobj.class] = {};
        stepObj.stepGroup[itemobj.class][itemobj.id] = itemobj;

        stepObj.steps[itemobj.id] = itemobj;
    }

    return stepObj;
}



//----------------------------内部方法分界线--------------------------------------------------


/**
 * 解析流程步骤
 */
function parseStepitem(item) {
    var itemobj = {};

    try{
        itemobj.code = item.outerHTML;
        itemobj.id = item.nodeName;
        itemobj.remark = item.getAttribute('Remark');
        itemobj.class = item.querySelector('ClassName').textContent;

        var paramsNode = item.querySelector('Params');
        var returnNode = item.querySelector('Return');
        itemobj.params = paramsNode ? parseParam(paramsNode) : {};
        itemobj.returns = returnNode ? parseReturn(returnNode) : {};
    }catch(e){
        itemobj.class = 'error';
        itemobj.error = item.outerHTML;
    }

    return itemobj;
}

/**
 * 解析参数节点
 */
function parseParam(paramNode) {
    var param = {};
    for(var index=0; index<paramNode.children.length; index++){
        var itemNode = paramNode.children[index];

        // param[itemNode.nodeName] = {remark: itemNode.getAttribute('Remark'), 
        //     value: itemNode.textContent};

        param[itemNode.nodeName] = itemNode.textContent;

        // param.length++;
    }

    return param;
}

/**
 * 解析Return节点
 */
function parseReturn(retNode) {
    var returns = {};
    for(var index=0; index<retNode.children.length; index++){
        var node = retNode.children[index];

        returns[node.case] = node.textContent;
        // returns.length++;
    }

    return returns;
}

}())