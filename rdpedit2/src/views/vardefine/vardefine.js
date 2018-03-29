(function(){
    /**
     * 获取基本参数，如果参数有误直接抛错
     */
    var urlparams = function(){
        var ret = {};
        try{
            var params = location.search.substr(1).split('&');
            for(var i=0; i<params.length; i++){
                var keyvalue = params[i].split('=');
                ret[keyvalue[0]] = keyvalue[1];
            }
        }catch(e){
            console.debug(e);
        }
        return ret;
    }(),
    vardir = urlparams['vardir'],
    varid = urlparams['varid'];
  //  postionConfPath = localStorage.getItem('projectDir') + '/.ide/position/'+varid+'.position';
    
    if(!vardir || !varid){
        throw new Error("参数错误,stepip="+stepid+",rdpdir="+rdpdir);
        return;
    }

    var fs = parent.require('fs');
    var iconv = parent.require('iconv-lite');
    var ipcRenderer = parent.require('electron').ipcRenderer;


    var filePath = vardir + "/" + varid + ".xml";
    var varDefModel;//xml文件处理后的数据
    var xmlObj ='';//DOM文档
    var windowData_bak = '';
    var getCheckednum;//构建的表格
    /**
     * 初始化
     */
    function initApp(argument){
        executeStep();
        windowData_bak = (new XMLSerializer()).serializeToString(xmlObj);
        $('#editorAdd').click(editorAdd);
        $('#editorEdit').click(editorEdit);
	    	$('#editorDel').click(editorDel);
        $('#addOk').click(editorAddSubmit);
        
    }
    /**
     * 删除变量
     * @return {[type]} [description]
     */
    function editorDel(){
      var checkedRows= getCheckednum.getCheckedRows();
        if (null!=checkedRows && checkedRows.length >0){
          if(checkedRows.length === 1){
            if(window.top.confirm("确定要删除此节点吗?")){
              var oldObj = checkedRows[0];
              dealwithEncode("deal",oldObj);
              executeStep();      
            }
          }else{  alert('请选择一条');}
        }
    }
/**
 * 修改变量
 * @return {[type]} [description]
 */
    function editorEdit(){
      var checkedRows= getCheckednum.getCheckedRows();
      if (null!=checkedRows && checkedRows.length >0){
          if(checkedRows.length === 1){
            //1获取修改的变量
            var oldObj = checkedRows[0];
            //2写入获取的变量
             var DataList = $('#editorTable tr td input');
                 DataList.eq(0).val(oldObj.id);
                 DataList.eq(1).val(oldObj.nodeName);
                 DataList.eq(2).val(oldObj.remark);
                 DataList.eq(3).val(oldObj.content);
            //3显示
             $('#editor').attr("style","display:block");
            //4开始
             $('#editorOk').click(function(){editorSubmit(oldObj);});
          }else{alert('请选择一条');}
      };
    }
/**
 * 修改变量的提交
 * @param  {[type]} oldObj [description]
 * @return {[type]}        [description]
 */
    function editorSubmit(oldObj){
       //4.1获取
         var modifyDataList = $('#editorTable tr td input');
         var id = modifyDataList.eq(0).val()
         ,name = modifyDataList.eq(1).val()
         ,remark = modifyDataList.eq(2).val()
         ,content = modifyDataList.eq(3).val()
        //4.2 检测
         if(name ==='' ||name ==='undefined'){
         alert('请输入变量名!');
        //if 开头不能是数字、标点符号 ->return;
         return;
         }
         for(index in varDefModel.dataList ){
            var a = varDefModel.dataList[index].nodeName;
            if(a===name){
            alert('变量名重复!');
            return;
            }
          }
        //4.3 写入
        var modifyObj = {};
        modifyObj.id = id;//分组
        modifyObj.nodeName = name;
        modifyObj.remark = remark;
        modifyObj.content = content;
        console.info(modifyObj);
        //4.3 比较
        var result = {
              change:{},
              old:{},
              id:oldObj.id,
            }; //改变的数据
        for (i in oldObj){
          result.old[i]=oldObj[i];
          for(j in modifyObj){
              if(i == j){
               if( oldObj[i] !=modifyObj[j] ){
                     result.change[j]=modifyObj[j];
                  }
                break;
               }
          }
        }
        //写入DOM文件
        dealwithEncode('editor',result);
        var editorDataList = $('#editorTable tr td input');
        for(var i = 0;i< editorDataList.length;i++){
         editorDataList.eq(i).val('');
        }
        $('#editor').attr("style","display:none");
        //5刷新
        executeStep();

    }
    /*增加变量*/
    function editorAdd(){  $('#add').attr("style","display:block");};
    /**
     * 增加变量的提交
     * @return {[type]} [description]
     */
    function editorAddSubmit(){
          //1获取
           var addDataList = $('#addTable tr td input');
           var id = addDataList.eq(0).val()
           ,name = addDataList.eq(1).val()
           ,remark = addDataList.eq(2).val()
           ,content = addDataList.eq(3).val();
            //2检查
            if(id!='PreData'&& id!='UserData'&&
               id!='GlobalData' && id!='PersistData'){
               alert('分组错误，请重新确认分组!');
              return;
            }
            if(name ==='' ||name ==='undefined'){
               alert('请输入变量名!');
              //if 开头不能是数字、标点符号 ->return;
               return;
            }
            for(index in varDefModel.dataList ){
              var a = varDefModel.dataList[index].nodeName;
              if(a===name){
              alert('变量名重复!');
              return;
              }
            }

            //3写入
            //3.1准备
            var addObj = {};
            window.aa = varDefModel;
            addObj.id = id+varDefModel[id].count;//分组+一个数字
            addObj.name = name;
            addObj.remark = remark;
            addObj.content = content;
            console.info(addObj);
            //3.2开始
            dealwithEncode('add',addObj);
            //4关闭  
            var addDataList = $('#addTable tr td input');
            for(var i = 0;i< addDataList.length;i++){
                 addDataList.eq(i).val('');
            }
            $('#add').attr("style","display:none");
            //5刷新
            executeStep();
    }
     /**
      * DOM文档中对变量进行增删改操作
      * @param  {[type]} sign [增删改的标识]
      * @param  {[type]} obj  获取的数据对象
      * @return {[type]}      [description]
      */
    function dealwithEncode(sign,obj){
        var groupName =trimNumber(obj.id);
        console.info(groupName);
        var groupxmlObj = xmlObj.children[0].getElementsByTagName(groupName)[0];
         console.info(xmlObj);
         window.a  = xmlObj;
        if(sign ==='add'){
            var newVar = xmlObj.children[0].ownerDocument.createElement(obj.name);
            var mark = obj.remark||"";
                newVar.setAttribute("Remark",mark);
                newVar.innerHTML  = obj.content||"";
            groupxmlObj.insertBefore(newVar,null);
            dealwithBr('add',newVar,groupxmlObj);
            
            //验证
            // windowData_bak = (new XMLSerializer()).serializeToString(xmlObj);
            // console.info(windowData_bak);
        }
        if (sign ==='editor'){//不要修改顺序！
          var editorVar = groupxmlObj.getElementsByTagName(obj.old.nodeName)[0];
          if(obj.change.hasOwnProperty('remark')){
              editorVar.setAttribute("Remark",obj.change.remark);
          }if(obj.change.hasOwnProperty('content')){
              editorVar.innerHTML = obj.change.content;
          }if(obj.change.hasOwnProperty('nodeName')){
              var newVar = xmlObj.children[0].ownerDocument.createElement(obj.change.nodeName);
              var mark = editorVar.getAttribute("Remark");
              var content = editorVar.innerHTML;
               newVar.setAttribute("Remark",mark)||"";
               newVar.innerHTML  = content;
               groupxmlObj.replaceChild(newVar,editorVar);
          }
          console.info(xmlObj);
          //验证
          // windowData_bak = (new XMLSerializer()).serializeToString(xmlObj);
          // console.info(windowData_bak);
        }
    	  if(sign ==="deal"){
    		  var editorVar = groupxmlObj.getElementsByTagName(obj.nodeName)[0];
    		  dealwithBr('deal',editorVar,groupxmlObj);//先删除换行节点
          groupxmlObj.removeChild(editorVar);
    		   
    		  console.info(xmlObj);
          //验证
          // windowData_bak = (new XMLSerializer()).serializeToString(xmlObj);
          // console.info(windowData_bak);
    	  }
    }

    /**
     * DOM中，对进行操作的变量,格式处理
     * @param  {[type]} sign       [增删改的标识]
     * @param  {[type]} beforeNode [操作的变量]
     * @param  {[type]} parentNode [变量父类]
     * @return {[type]}            [description]
     */
  function dealwithBr(sign,beforeNode,parentNode){
    if(sign === "add"){
      //在变量后插入换行符
      var brNode_back = parentNode.ownerDocument.createTextNode('\n'+'\t');
      parentNode.appendChild(brNode_back); 
      if(parentNode.childNodes.length = 3){
        //如果插入的变量是第一个变量
        var brNode_front = parentNode.ownerDocument.createTextNode(parentNode.childNodes[0].data+'\t');
        parentNode.replaceChild(brNode_front ,beforeNode.previousSibling);    
      }
      if(parentNode.childNodes.length>4){
        //如果插入的变量不是第一个变量
        var node_front = parentNode.childNodes[0].data;
        var brNode_front = parentNode.ownerDocument.createTextNode(node_front);
        parentNode.replaceChild(brNode_front ,beforeNode.previousSibling);
      }
    }
    if(sign === "deal"){
        parentNode.removeChild(beforeNode.previousSibling);
    }
  }


    /**去除字符串中的数字 */
    function trimNumber(str){ 
        return str.replace(/\d+/g,''); 
    } 
    /**
     * 处理数据,显示表格
     */
    function executeStep(){
        try{
            var xmlstr = downloadXmlfile(filePath);
            if (xmlObj ===''){
                xmlObj = $.text2xml(xmlstr); 
            }else{//如果不是首次加载,必定是模型改变啦
                parent.triggerEvent('varModel');
            }
            var root = xmlObj.children[0];
            if(root.outerHTML.indexOf('This page contains the following errors:') > -1){
                // xml语法有误
                $('#main').html(root.outerHTML);
                return;
            }
            // 1构建step模型
            varDefModel =  buildVarModel(root);
            varDefModel.id = filePath;
            // 2处理数据
            var nodeDataList = encodeVarDef(varDefModel);
            //3显示表格
            displayTable(nodeDataList);
        }catch(e){
            $('#main').html('<div style="padding-top:100px; text-align:center; color:red;">处理出错:'+e.stack+'</div>');
            console.info(e.stack);
        }  
	  }

    /**
     * 显示表格
     * @return {[type]} [description]
     */
    function displayTable(DataList){
        var con=[        
              {name: 'id', display: 'ID', width: 80, frozen:true}
              ,{name: 'nodeName', display: '变量名', width: 160}
              ,{name: 'remark', display: '描述', width: 150}
              ,{name: 'content', display: '变量值', width: 150}
              // ,{display:"操作", render:function(val){return "<a href=javascript:alert("+val.userid+")>查看</a>"} }
           ];
        getCheckednum=  $("#table1").ligerGrid({
          columns:con,
          data:{ Rows:DataList},
          tree:{columnName:"name"},
          usePager:true ,
          pageSizeOptions:[5,8,15,20], 
          pageSize:5,
          rownumbers:true,
          //checkbox:true,
        });

    }

    /**
     * [encodeVarDef 对解析的数据进行处理]
     * @param  {[type]} obj [获得的数据]
     * @return {[type]}     处理后的数据
     * return :格式[{},{},{}]
     */
    function encodeVarDef(obj){
        var varDefList = [];
        for (key in obj.dataList){
            var nodeinfo = obj.dataList[key];
            varDefList.push(nodeinfo);
        }
        console.info(varDefList);
    return varDefList
    }



    /**
     * 解析varDef节点
     * @param  {[type]} root [整个DOM文件]
     * @return {[type]}      [解析整个varDef节点]
     * 格式 {id:val}
     */
    function buildVarModel(root) {
        var myVarDef = {
            remark: root.getAttribute('Remark'),
            PreData :{},
            UserData:{},
            GlobalData:{},
            PersistData:{},
            dataList:{},
        };
        for(var i=0; i<root.children.length; i++){
            var itemXml = root.children[i];
            var buildStep = buildVarDataModel(itemXml);
            if(itemXml.nodeName === "PreData"){
                myVarDef.PreData = buildStep;
            }else if(itemXml.nodeName === "UserData"){    
                myVarDef.UserData = buildStep;
            }else if(itemXml.nodeName === "GlobalData"){
                myVarDef.GlobalData = buildStep;
            }else{
                myVarDef.PersistData = buildStep;
            }
        }
        myVarDef.dataList = $.extend({}, myVarDef.PreData.data,myVarDef.UserData.data,myVarDef.GlobalData.data,myVarDef.PersistData.data);
       console.info(myVarDef);
       return myVarDef;
            
    }
    /**
     * [对单个大节点的解析]
     * @param  {[type]} root [PreData 或UserData或GlobalData或PersistData级的DOM]
     * @return {[type]}      [解析单个大节点]
     * 格式 {data:{},count:个数}
     */
    function buildVarDataModel(root) {
        var dataList = {
                data: {},
            };
        if(root.children.length === 0){dataList.count  = 0;}
        for(var i=0; i<root.children.length; i++){
            var item = root.children[i];
            var varDataList;
            try{
                varDataList = buildVarDataItem(item);
                varDataList.id = root.nodeName+i;//定义id
            }catch(e){
                continue;
                console.info(item.innerHTML);
            }
            dataList.data[varDataList.id] = varDataList;
            dataList.count  = i+1;
        }
        return dataList;
    }
    /**
     * [对单个节点的解析]
     * @param  {[type]} root [单个节点的DOM]
     * @return {[type]}      [解析单个节点]
     * 格式 {id:value0,key1:value1,key2:value2....}
     */
    function buildVarDataItem(item){
        var nodeinfo = {
            code:item.outerHTML,
            nodeName:item.nodeName,
            remark:item.getAttribute('Remark'),
            content:item.textContent,
        };
        return nodeinfo;
    }

    /**
     * 读取文件内容
     */
    function downloadXmlfile(xmlpath) {
        var xmlObj = fs.readFileSync(xmlpath, 'latin1');
        xmlObj = iconv.decode(xmlObj, 'GBK');
        return xmlObj;
    }
    /**获取DOM数据*/
    window.popViewData = function(){
        return xmlObj;
    }
    /**原始数据,序列号*/
    window.getViewData_bak = function(){
        return windowData_bak;
    }

    initApp();
})()


