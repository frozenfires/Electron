(function() {
 //想获得   stepModel
 //想获得   xmlObj
 
/*
节点信息展示 信息
*/
// var TransClassDef = parent.require('../../common/getTransClassDef.js');
var TransClassDef = transClassDefParam();
var classIdJson = getClassDefId(TransClassDef);
window.nodeinfo = function(clickId,stepModel){
    var nodereturnJson = nodeReturnParam();
    for (stepname in stepModel.stepmap){
      var stepitem = stepModel.stepmap[stepname];
      var nodeName = stepitem.nodeName;

      if( clickId == nodeName){	
            //节点信息
            $('#nodeinfo-id').val(nodeName);
            $('#nodeinfo-remark').val(stepitem.remark);
            // $('#nodeinfo-classname').val(stepitem.className);

            var optionHtml = buildOptions(classIdJson, stepitem.className);
            var classParamJson = findClassParamByClassId(stepitem.className);
            $("#mySelect").html(optionHtml.join("\n"));

            //返回值信息
            var returnJson  =stepitem.return;
            var return_index =0
            for (var key in returnJson)
            {   
                var returnHtml = buildOptions(nodereturnJson, returnJson[key]);
                var return_param =$("#nodereturn div.return").eq(return_index).find('.return-param');
                var return_id =$("#nodereturn div.return").eq(return_index).find('.return-id');
				//return_param.val(key); 
                return_param.html(returnHtml.join("\n"));    
                return_id.val(key);
                return_index++;
            }

            //参数信息
            var paramJson = stepitem.param;
            var param_index =0
            for (var key in paramJson)
            {
                var paramidHtml = buildOptions(classParamJson, key);
                var param_id =$("#nodeparam div.param").eq(param_index).find('.param-id');
                var param_classname =$("#nodeparam div.param").eq(param_index).find('.param-classname');
                param_id.html(paramidHtml.join("\n"));   
                param_classname.val(paramJson[key]);//参数值
                param_index ++;
            }
        }
    }
}
/*
  动态节点框架的生成
  */ 
  window.nodeBuild = function(clickId,stepModel){
     var nodeinfoHtml =[];  
     var nodeparamHtml =[];
     var nodereturnHtml =[];
     for (stepname in stepModel.stepmap){
      var stepitem = stepModel.stepmap[stepname];
      var nodeName = stepitem.nodeName;
      if( clickId == nodeName){
      //节点信息
      $('#node-edit #nodeinfo div').remove();
      $('#node-edit #nodeparam div').remove();
      $('#node-edit #nodereturn div').remove();

      nodeinfoHtml.push('<div>');
		    nodeinfoHtml.push('<p class="nodeinfo">节点名</p>');//
            nodeinfoHtml.push('<input  id = "nodeinfo-id" type="text"  placeholder="请输入节点id" >');
            nodeinfoHtml.push('</div>');          

            nodeinfoHtml.push('<div>');	
            nodeinfoHtml.push('<p class="nodeinfo">节点描述</p>');//		  
            nodeinfoHtml.push('<input id = "nodeinfo-remark" type="text" placeholder="请输入节点描述">');	          
            nodeinfoHtml.push('</div>');	

            nodeinfoHtml.push('<div>');	
            nodeinfoHtml.push('<p class="nodeinfo">组件信息</p>');//		  
            nodeinfoHtml.push('<select id="mySelect" ></select>');
            // nodeinfoHtml.push('<input id = "nodeinfo-classname" type="text"  placeholder="请输入组件信息" >');	          
            nodeinfoHtml.push('</div>');	
            $('#node-edit #nodeinfo').append(nodeinfoHtml.join('\n'));
        //参数信息
        if(stepitem.paramSize>0){
           var paramHtml =[];
           for(var i=0;i<stepitem.paramSize;i++){
            paramHtml.push('<div class = "param" style="">');
            paramHtml.push('<div>');
                    paramHtml.push('<p class="nodeinfo">参数名<i class="layui-icon del_nodeparam">&#x1006;</i></p>');
                    paramHtml.push('<select class="param-id" ></select>');
        			//paramHtml.push('<input class="param-id" type="text" placeholder=请输入参数名">');
        			paramHtml.push('</div>');
        			
                    paramHtml.push('<div>');
        			paramHtml.push('<p class="nodeinfo">参数值</p>');//
        			paramHtml.push('<input class="param-classname" type="text" placeholder="请输入参数值">');
        			paramHtml.push('</div>');
                  //  paramHtml.push('<button class="del_nodeparam">删除</button>');
                    paramHtml.push('</div>');	
                }
                $('#node-edit #nodeparam').append(paramHtml.join('\n'));
            }
        $("#nodeparam div.param:last").attr("style","border:none");
      //返回值信息
      if(stepitem.returnSize>0){
       var returnHtml =[];
       for(var i=0;i<stepitem.returnSize;i++){
        returnHtml.push('<div class = "return" style="">');
        returnHtml.push('<div>');
                returnHtml.push('<p class="nodeinfo">返回参数<i class="layui-icon del_nodereturn">&#x1006;</i></p>');//
                returnHtml.push('<input class="return-id" type="text" placeholder="请输入返回参数" >');
                returnHtml.push('</div>');
                
                returnHtml.push('<div>');
    			returnHtml.push('<p class="nodeinfo">返回值</p>');//
                returnHtml.push('<select class="return-param" ></select>');
    			//returnHtml.push('<input class="return-param" type="text" placeholder="请输入返回值" >');
    			returnHtml.push('</div>');
               // returnHtml.push('<button class="del_nodereturn">删除</button>');
                returnHtml.push('</div>');
            }
            $('#node-edit #nodereturn').append(returnHtml.join('\n'));
        }			  
         $("#nodereturn div.return:last").attr("style","border:none");
    }
}
}

/**
获得本文的返回值信息
*/
function nodeReturnParam(){
    var windowData = window.popViewData();
    var stepNodes = windowData.children[0].children;
    var returnParam = {};
    for(var i = 0;i<stepNodes.length;i++){
      returnParam[stepNodes[i].tagName] = "";
    }
    return returnParam;
}

/**
*增加节点参数信息
*/
window.addNodeparam = function(){
    var paramHtml =[];
    paramHtml.push('<div class = "param" style="">');
    paramHtml.push('<div>');
        paramHtml.push('<p class="nodeinfo">参数名<i class="layui-icon del_nodeparam">&#x1006;</i></p>');//
        paramHtml.push('<select class="param-id" ></select>');
        //paramHtml.push('<input class="param-id" type="text" placeholder=请输入参数名">');
        paramHtml.push('</div>');

        paramHtml.push('<div>');
        paramHtml.push('<p class="nodeinfo">参数值</p>');//
        paramHtml.push('<input class="param-classname" type="text" placeholder="请输入参数值">');
        paramHtml.push('</div>');
       // paramHtml.push('<button class="del_nodeparam">删除</button>');
        paramHtml.push('</div>'); 
        
        var nodeFirstPram =  $("#node-edit #nodeparam").children(".param:first");
        if (nodeFirstPram.length>0){
         $(paramHtml.join('\n')).insertBefore(nodeFirstPram); 
     }else{
         $("#node-edit #nodeparam").append(paramHtml.join('\n'));
     }

     var selectedClassId = $("#mySelect").val();
     var classParamJson = findClassParamByClassId(selectedClassId);
     var paramSelect =['<options>'];
     for(index in classParamJson){
        paramSelect.push('<option selected="">'+index+'</option>');
    }
    paramSelect.push('<option value="" selected = "selected">----请选择---</option>');
    paramSelect.push('</options>');
        var param_id =$("#nodeparam div.param:first .param-id");
        //var param_classname =$("#nodeparam div.param").eq(param_index).find('.param-classname');
        param_id.html(paramSelect.join("\n"));   
        //param_classname.val(key);
    }



/**
*增加节点返回信息
*/ 
window.addNodereturn = function(){

    var returnHtml =[];
    returnHtml.push('<div class = "return" style="">');
    returnHtml.push('<div>');
            returnHtml.push('<p class="nodeinfo">返回参数<i class="layui-icon del_nodereturn">&#x1006;</i></p>');//
            returnHtml.push('<input class="return-id" type="text" placeholder="请输入返回参数" >');
            returnHtml.push('</div>');

            returnHtml.push('<div>');
            returnHtml.push('<p class="nodeinfo">返回值</p>');//
            returnHtml.push('<select class="return-param"></select>');
            //returnHtml.push('<input class="return-param" type="text" placeholder="请输入返回值" >');
            returnHtml.push('</div>');
            //returnHtml.push('<button class="del_nodereturn">删除</button>');
            returnHtml.push('</div>');
           // $('#node-edit #nodereturn').append(returnHtml.join('\n'));
           var nodeFirstReturn =  $("#node-edit #nodereturn").children(".return:first");
           if (nodeFirstReturn.length>0){
             $(returnHtml.join('\n')).insertBefore(nodeFirstReturn); 
         }else{
             $("#node-edit #nodereturn").append(returnHtml.join('\n'));
         } 
      // $("#nodeparam div.param:last").attr("style","boder:none");

      var nodereturnJson = nodeReturnParam();
	  console.info(nodereturnJson);
      var returnSelect =['<options>'];
      
      for(index in nodereturnJson){
        returnSelect.push('<option selected="">'+index+'</option>');
    }
    returnSelect.push('<option value="" selected = "selected">----请选择---</option>');
    returnSelect.push('</options>');
    var return_param =$("#nodereturn div.return:first .return-param");
        // var return_id =$("#nodereturn div.return").eq(return_index).find('.return-id');
        //return_param.val(key); 
        return_param.html(returnSelect.join("\n"));    
        //return_id.val(returnJson[key]);
    }


  /**
   * [newNodeBuild 右键生成空白结构框架]
   * @param  {[type]} rightclick [右击节点]
   * @param  {[type]} sign       [1:在右击之前添加;2:在右击之后添加 ]
   * @return {[type]}            [description]
   */
  window.newNodeBuild = function(rightclick,sign){
    $('#node-edit #nodeinfo div').remove();
    $('#node-edit #nodeparam div').remove();
    $('#node-edit #nodereturn div').remove();
		var nodeinfoHtml =[];  
		nodeinfoHtml.push('<div>');
		nodeinfoHtml.push('<p class="nodeinfo">节点名</p>');
		nodeinfoHtml.push('<input  id = "nodeinfo-id" type="text" placeholder="请输入节点名" >');
		nodeinfoHtml.push('</div>');          

		nodeinfoHtml.push('<div>');	
		nodeinfoHtml.push('<p class="nodeinfo">节点描述</p>');	  
		nodeinfoHtml.push('<input id = "nodeinfo-remark" type="text" placeholder="请输入节点描述">');	          
		nodeinfoHtml.push('</div>');	

		nodeinfoHtml.push('<div>');	
		nodeinfoHtml.push('<p class="nodeinfo">组件信息</p>');	  
		nodeinfoHtml.push('<select id="mySelect">');
		for(index in classIdJson){
                nodeinfoHtml.push('<option selected="">'+index+'</option>');
            }
		nodeinfoHtml.push('<option value="" selected = "selected">----请选择---</option>');
	    nodeinfoHtml.push('</select>');
		nodeinfoHtml.push('</div>');	
		$('#node-edit #nodeinfo').append(nodeinfoHtml.join('\n'));
	
	//参数信息
		var paramHtml =[];
       var selectedClassId = $("#mySelect").val();
      var classParamJson = findClassParamByClassId(selectedClassId);
		paramHtml.push('<div class = "param" style="">');
		paramHtml.push('<div>');
		paramHtml.push('<p class="nodeinfo">参数名<i class="layui-icon del_nodeparam">&#x1006;</i></p>');
		paramHtml.push('<select class="param-id">');

	    for(index in classParamJson){
			paramHtml.push('<option selected="">'+index+'</option>');
	    }
		paramHtml.push('<option value="" selected = "selected">----请选择---</option>');
		paramHtml.push('</select>');
		paramHtml.push('</div>');
		
		paramHtml.push('<div>');
		paramHtml.push('<p class="nodeinfo">参数值</p>');
		paramHtml.push('<input class="param-classname" type="text" placeholder="请输入参数值">');
		paramHtml.push('</div>');
		//paramHtml.push('<button class="del_nodeparam">删除</button>');
		paramHtml.push('</div>');	
		$('#node-edit #nodeparam').append(paramHtml.join('\n'));
    $("#nodeparam div.param:last").attr("style","border:none");

  //返回值信息
		var returnHtml =[];
		var nodereturnJson = nodeReturnParam();
		returnHtml.push('<div class = "return" style="">');
		returnHtml.push('<div>');
		returnHtml.push('<p class="nodeinfo">返回参数<i class="layui-icon del_nodereturn">&#x1006;</i></p>');
    if(sign === "1"){
      returnHtml.push('<input class="return-id" type="text" placeholder="请输入返回参数" value="default">');
    }else{
      returnHtml.push('<input class="return-id" type="text" placeholder="请输入返回参数" >');
	  rightclick = "";
    }
		
		returnHtml.push('</div>');
		
		returnHtml.push('<div>');
		returnHtml.push('<p class="nodeinfo">返回值</p>');
		returnHtml.push('<select class="return-param">');
	     var options = buildOptions(nodereturnJson, rightclick);
	    returnHtml.push(options);
		returnHtml.push('</select>');
		returnHtml.push('</div>');
		returnHtml.push('</div>');
		$('#node-edit #nodereturn').append(returnHtml.join('\n'));
    $("#nodereturn div.return:last").attr("style","border:none");
  }

/**
 * [给节点添加一个返回项]
 * @param {[type]} xmlObj    [节点DOM]
 * @param {[type]} caseValue [传进来的,默认的case值]
 * @param {[type]} stepValue [返回值]
 */
  window.addReturn = function(xmlObj,caseValue,stepValue){
    var rightReturnHtml =xmlObj.getElementsByTagName("Return")[0];
    var dCaseValue = jisuan_dCaseValue(rightReturnHtml,caseValue);
    var rightReturnParam = rightReturnHtml.ownerDocument.createElement('switch');//参数信息
        rightReturnParam.setAttribute("case",dCaseValue);
        rightReturnParam.innerHTML = stepValue;
        rightReturnHtml.appendChild(rightReturnParam); 
        insertBrNodeAfter(rightReturnParam,rightReturnHtml);
  }
	

 /**
  * [creatNodeFormat 创建新节点结构]
  * @param  {[type]} parentxmlObj [DOM文件]
  * @param  {[type]} sign         [1：在右击之前添加;2：在右击之后添加 ]
  * @param  {[type]} rightClick   [右击的节点id值]
  * @param  {[type]} xmlObj       [右击节点DOM]
  * @param  {[type]} newValue     [description]
  * @return {[type]}              [节点名]
  */
  window.creatNodeFormat = function(parentxmlObj,sign,rightClick,xmlObj,newValue){
   var newnodeHtml = xmlObj.ownerDocument.createElement(newValue);//新增加的
        newnodeHtml.setAttribute("Remark","");

    var className = newnodeHtml.ownerDocument.createElement('ClassName');//组件信息
        className.innerHTML = " "; 
    newnodeHtml.appendChild(newnodeHtml.ownerDocument.createTextNode('\n\t\t'));
    newnodeHtml.appendChild(className); 

    var paramsName = newnodeHtml.ownerDocument.createElement('Params');//参数信息
        paramsName.innerHTML = " "; 
    newnodeHtml.appendChild(newnodeHtml.ownerDocument.createTextNode('\n\t\t'));
    newnodeHtml.appendChild(paramsName); 

    var returnsName = newnodeHtml.ownerDocument.createElement('Return');//返回值信息
    if(sign === "1"){
      returnsName.innerHTML = "<switch case='default'>"+rightClick+"</switch>"; 
    }else if(sign === "2"){
      returnsName.innerHTML = " ";  
    }
    //页面上
    newnodeHtml.appendChild(newnodeHtml.ownerDocument.createTextNode('\n\t\t'));
    newnodeHtml.appendChild(returnsName);
    newnodeHtml.appendChild(newnodeHtml.ownerDocument.createTextNode('\n\t'));
    //返回值信息的换行
    var switchNaode = returnsName.childNodes[0];
	if(sign === "1")//之下增加节点不加换行
    insertBrNodeAfter(switchNaode,returnsName);
    //文档中
    if(sign ==="1"){
    	parentxmlObj.insertBefore(newnodeHtml,xmlObj);
		insertBrNodeAfter(newnodeHtml,parentxmlObj);
    }else if(sign === "2"){
      parentxmlObj.insertBefore(newnodeHtml,xmlObj.nextSibling.nextSibling);
	insertBrNodeAfter(newnodeHtml,parentxmlObj);
    }
  }
	
  /**
   * 鼠标右击样式！
   */
  window.rightClick_style = function(e,id,aString,bString){
    var titleWidth = $('#node-view').width();
    var sign = 275;
    var divWidth = $('#'+id).width();

        if(aString && bString){
            $('#'+id+' .action-label')[0].innerHTML = "分支流向 "+aString+"--"+bString;
            $('#'+id+' .action-label')[1].innerHTML = "分支流向 "+bString+"--"+aString;
        }

    if( $('#'+id).is(':hidden') ){
       $('#'+id).css("display","block");
      //鼠标坐标+div宽度 = 标题宽+固定值
      if((e.clientX + divWidth) >(titleWidth+sign)){ 
        $('#'+id).css("left", e.clientX - sign*(2/3) ); 
        $('#'+id).css("margin-top", e.clientY+1); 
      }else{
        $('#'+id).css("left", e.clientX); 
        $('#'+id).css("margin-top", e.clientY+1); 
      }
    }else{
       $('#'+id).css("display","none");
    }
  }
   
 /**
  * [selectRetNode 选取指定的返回值]
  * @param  {[type]} retList [返回值列表]
  * @param  {[type]} sign    [返回参数]
  * @return {[type]}         [description]
  */
  function  selectRetNode(retList,sign){
     for(var i = 0;i<retList.length;i++){
       if(retList[i].getAttribute('case')==sign){
        return retList[i];
        }
     }
  }

   /**
    * [nodeinfo_Id 节点名修改]
    * @param  {[type]} oldVal [修改前的值]
    * @param  {[type]} xmlObj [节点DOM]
    * @param  {[type]} newVal [修改后的值]
    * @return {[type]}        [description]
    */
  window.nodeinfo_Id = function(oldVal,xmlObj,newVal){
    try{
      var modify_Node_Name = xmlObj.ownerDocument.createElement(newVal);
      var mark = xmlObj.getAttribute("Remark");
      modify_Node_Name.setAttribute("Remark",mark)||"";
      modify_Node_Name.innerHTML  = xmlObj.innerHTML;
      xmlObj.ownerDocument.children[0].replaceChild(modify_Node_Name,xmlObj);//替换
      $('#kitchensink-demo > div.component.window#'+oldVal).attr("id",newVal);//html 中id名称的修改
    }catch(e){
       console.debug(e);
    }
  }
  
  /**
   * [nodeinfo_Remark 节点描述修改]
   * @param  {[type]} xmlObj [节点DOM]
   * @param  {[type]} newVal [修改后的值]
   * @return {[type]}        [description]
   */
  window.nodeinfo_Remark = function(xmlObj,newVal){  
    xmlObj.setAttribute("Remark",newVal);
  } 
  /**
   * [mySelect 组件信息修改]
   * @param  {[type]} xmlObj [节点DOM]
   * @param  {[type]} newVal [修改后的值]
   * @return {[type]}        [description]
   */
  window.mySelect = function(xmlObj,newVal){
    var className = xmlObj.getElementsByTagName('ClassName')[0];
    className.innerHTML = newVal; 
    //联动修改参数名
    $('#node-edit .param').remove();
  var paramHtml =[];
       var selectedClassId = $("#mySelect").val();
      var classParamJson = findClassParamByClassId(selectedClassId);
    paramHtml.push('<div class = "param" style="">');
    paramHtml.push('<div>');
    paramHtml.push('<p class="nodeinfo">参数名<i class="layui-icon del_nodeparam">&#x1006;</i></p>');
    paramHtml.push('<select class="param-id">');

      for(index in classParamJson){
      paramHtml.push('<option selected="">'+index+'</option>');
      }
    paramHtml.push('<option value="" selected = "selected">----请选择---</option>');
    paramHtml.push('</select>');
    paramHtml.push('</div>');
    
    paramHtml.push('<div>');
    paramHtml.push('<p class="nodeinfo">参数值</p>');
    paramHtml.push('<input class="param-classname" type="text" placeholder="请输入参数值">');
    paramHtml.push('</div>');
    //paramHtml.push('<button class="del_nodeparam">删除</button>');
    paramHtml.push('</div>'); 
    $('#node-edit #nodeparam').append(paramHtml.join('\n'));
    $("#nodeparam div.param:last").attr("style","border:none");
    var paramHtml = xmlObj.getElementsByTagName('Params')[0];
    paramHtml.innerHTML = ' ';

    // var classParamJson = findClassParamByClassId(newVal);
    // var optionHtml = buildOptions(classParamJson, "1");
    // $("#nodeparam .param-id").html(optionHtml.join("\n"));



  }

   /**
    * [param_Id 参数名的增加或修改]
    * @param  {[type]} xmlObj [参数DOM]
    * @param  {[type]} newVal [修改后的值]
    * @param  {[type]} oldVal [修改前的值]
    * @return {[type]}        [description]
    */
  window.param_Id = function(xmlObj,newVal,oldVal){
    try{
       if(oldVal === ''){//增加
       var beforeParam = xmlObj.firstElementChild;
       var newNode = xmlObj.ownerDocument.createElement(newVal);
         newNode.innerHTML = " ";
         xmlObj.insertBefore(newNode,beforeParam);
         insertBrNodeAfter(newNode,xmlObj);
      }else if(oldVal != ''){//修改
        var param = xmlObj.getElementsByTagName(oldVal)[0];
        var modify_Param_Name = param.ownerDocument.createElement(newVal);
        var mark = param.getAttribute("Remark")||"";
          modify_Param_Name.setAttribute("Remark",mark);
        modify_Param_Name.innerHTML  = param.innerHTML;
        param.parentElement.replaceChild(modify_Param_Name,param);
       }
     }catch(e){
      console.debug(e);
     }
  }

  /**
   * [param_Classname 参数值的增加或修改]
   * @param  {[type]} xmlObj  [参数DOM]
   * @param  {[type]} parName [参数名]
   * @param  {[type]} newVal  [参数值]
   * @return {[type]}         [description]
   */
  window.param_Classname = function(xmlObj,parName,newVal){
    var param = xmlObj.getElementsByTagName(parName)[0];
      param.innerHTML  = newVal;
  }

  /**
   * [return_Id 返回参数的增加或修改]
   * @param  {[type]} xmlObj  [返回值DOM]
   * @param  {[type]} retList [返回值项列表]
   * @param  {[type]} newVal  [修改后的值]
   * @param  {[type]} oldVal  [修改前的值]
   * @return {[type]}         [description]
   */
  window.return_Id = function(xmlObj,retList,newVal,oldVal){
      if(oldVal ===''){//增加 
      var beforeReturn = xmlObj.firstElementChild;
      var newReturn = xmlObj.ownerDocument.createElement("switch");
        newReturn.setAttribute("case", newVal);
        newReturn.innerHTML =" ";
        xmlObj.insertBefore(newReturn,beforeReturn);
        insertBrNodeAfter(newReturn,xmlObj);
      }else{//修改
        var returnSign  =  selectRetNode(retList ,oldVal);
        returnSign.setAttribute('case',newVal);   
      } 
  }
  
   /**
    * [return_Param 返回值的增加或修改]
    * @param  {[type]} retList [返回值值项列表]
    * @param  {[type]} retName [description]
    * @param  {[type]} newVal  [description]
    * @return {[type]}         [description]
    */
  window.return_Param = function(retList,retName,newVal){
    var returnSign  =  selectRetNode(retList ,retName);
    returnSign.innerHTML = newVal;
  }

  //节点参数信息的删除
  window.del_Nodeparam = function (e,xmlObj){
    var parent;
    if(e.target==null){
      var parent = e;
    }else{
      var parent = $(e.target).parents('.param');
    }
    var nodeId =  parent.find('.param-id').val();
    if(nodeId !=""){
       var oTestParams = xmlObj.getElementsByTagName('Params')[0];
       var removPram = oTestParams.getElementsByTagName(nodeId)[0];
       removeBrBefore(removPram,oTestParams);//删除节点参数前先删除换行节点
       oTestParams.removeChild(removPram);
    }
	  parent.remove();
    $("#nodeparam div.param:last").attr("style","border:none");
  }
  //节点返回信息的删除
  window.del_Nodereturn = function(e,xmlObj){
    var parent = $(e.target).parents('.return');
    var retNodeId =  parent.find('.return-id').val();
    if(retNodeId !=""){
       var oTestReturn = xmlObj.getElementsByTagName('Return')[0];
       var returnList =  xmlObj.getElementsByTagName('switch');
       var returnSign  =  selectRetNode(returnList ,retNodeId);
       removeBrBefore(returnSign,oTestReturn);
       oTestReturn.removeChild(returnSign);
    }
	  parent.remove();//节点返回值参数的删除
    $("#nodereturn div.return:last").attr("style","border:none");
  }
  /*在节点参数后加入换行节点*/
  function insertBrNodeAfter(beforeNode,parentNode){
    /*如果没有其他节点，按照格式插入节点*/
    if(beforeNode.previousSibling == null||beforeNode.previousSibling.data == " "){
      var brNode_front = parentNode.ownerDocument.createTextNode(parentNode.previousSibling.data+'\t');
      var brNode_back = parentNode.ownerDocument.createTextNode(parentNode.previousSibling.data);
      parentNode.insertBefore(brNode_front,beforeNode);
      parentNode.appendChild(brNode_back);
      return;
    }
    /*如果插入的节点前有换行，则复制他的换行符*/
  	if(beforeNode.previousSibling.nodeName =='#text'){
  		var brNode = parentNode.ownerDocument.createTextNode(beforeNode.previousSibling.data);
  		parentNode.insertBefore(brNode,beforeNode.nextSibling);
  	 }
  }
  /*删除节点参数前先删除换行节点*/
  function  removeBrBefore(removeNode,parentNode){
    //只有一个参数时删除后面的节点
    if(parentNode.childNodes.length<= 4){
      //没有空格加上空格
      if(parentNode.childNodes.length == 3){
          var spaceBr = parentNode.ownerDocument.createTextNode(" ");
          parentNode.insertBefore(spaceBr,removeNode.previousSibling);
      }
     parentNode.removeChild(removeNode.nextSibling);
    }
    if(removeNode.previousSibling != null && removeNode.previousSibling.nodeName =='#text'){
      parentNode.removeChild(removeNode.previousSibling);
    }
  }


/**
 * 构建options对象
 */
function buildOptions(optionData, selectedData) {
    var optionHtml = ['<options>'];
    var selectedClass;
    optionHtml.push('<option value="">----请选择---</option>');
    for(index in optionData){
        if(index == selectedData){
          optionHtml.push('<option selected="selected">'+index+'</option>');
          selectedClass = index;
        }else{
          optionHtml.push('<option>'+index+'</option>');
        }
    }
    if(!selectedClass&&selectedData!="")
      optionHtml.push('<option selected="selected">'+selectedData+'</option>');

    optionHtml.push('</options>');
    return optionHtml;
}

/**
 * [checkStepName 检查输入的参数名是否已存在]
 * @param  {[type]} newVal [输入的参数名]
 * @return {[type]}      true 存在 false 不存在
 */
 window.checkStepName = function(newVal){
  var stepJson = nodeReturnParam();
  for(index in stepJson){
       if(index === newVal){
        console.info('节点已存在...');
        return true;
       }  
  }
  return false;
}

/**
 * 判断a、b之间是否存在连线 default的值
 * @param  {[type]} renderData  连线的结果集
 * @param  {[type]} line_source 开始节点
 * @param  {[type]} line_target 结束节点
 * @param  {[type]} caseValue   连线值
 * @return true 存在连线 false 不存在连线
 */
window.existline = function(renderData,line_source,line_target,caseValue){
   for(index in renderData){
      if(renderData[index].source === line_source){
        if(renderData[index].target === line_target){
            if(renderData[index].label === caseValue){
              return true;
            }
        }
      }
    }
    return false;
}

/**
 * [jisuan_dCaseValue 重新定义case的默认值]
 * @param  {[type]} xmlObj    [返回节点的集合]
 * @param  {[type]} caseValue [默认定义的case值]
 * @return {[type]}           [重新默认定义的case值]
 */
window.jisuan_dCaseValue = function(xmlObj,caseValue){
  var dCaseSize = 0;
  var dCaseValue =caseValue;
  try{
    var switchs = xmlObj.getElementsByTagName('switch');
    for(var n=0; n<switchs.length; n++){
        var rCaseValue = switchs[n].getAttribute('case');
        if((rCaseValue).indexOf(caseValue)>-1){
           dCaseSize ++;
        }
    }
  }catch(e){
   console.debug(e);
  }
  if(dCaseSize>0){
   return  dCaseValue += dCaseSize;
  }
  return dCaseValue;
}

/*
*构建组件信息和参数名的 DOM模型
*/
function transClassDefParam(){
  try{
  var cfgPath = location.search.substr(1).split('&')[1].split('=')[1].replace(/STEP/,'CFG');
      cfgPath += "/TransClassDef.xml";
  var fs = parent.require('fs');
  var iconv = parent.require('iconv-lite');
  var cfgStr = fs.readFileSync(cfgPath, 'latin1');
      cfgStr = iconv.decode(cfgStr, 'GBK');
  var cfgObj = $.text2xml(cfgStr); 
}catch (e){
  console.debug(e);
}

  return cfgObj;
}
/*
*获得DOM模型的所有节点名
*/
function getClassDefId(cfgObj){
  var classDefId = {};
  var classTypes = cfgObj.children[0].children[0].children;
  try{
    for(var i = 0;i<classTypes.length;i++){
      var nodeObjs = classTypes[i].children;
      for(var j = 0;j<nodeObjs.length;j++){
        classDefId[nodeObjs[j].tagName] = "";
      }
    }
  }catch (e){
    console.debug(e);
  }
  return classDefId;
}
/*
*通过选取的组件信息获取参数名的下拉选项
*/
function findClassParamByClassId(selectedClassId){
    //联动修改参数名
    var classParamJson = {};
    if(TransClassDef.getElementsByTagName(selectedClassId)[0]!=null){
      var newSelections = TransClassDef.getElementsByTagName(selectedClassId)[0].getElementsByTagName("Params")[0].children;
      for(i=0;i<newSelections.length;i++){
          classParamJson[newSelections[i].tagName] = "";
      }
    }
    return classParamJson;
}


})()
