jsPlumb.ready(function() {
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
    rdpdir = urlparams['rdpdir'],
    stepid = urlparams['stepid'],
    postionConfPath = localStorage.getItem('projectDir') + '/.ide/position/'+stepid+'.position';

    
    if(!rdpdir || !stepid){
        throw new Error("参数错误,stepip="+stepid+",rdpdir="+rdpdir);
        return;
    }

    var fs = parent.require('fs');
    var iconv = parent.require('iconv-lite');
    var ipcRenderer = parent.require('electron').ipcRenderer;
    //var TransClassDef = parent.require('../../common/getTransClassDef.js');

    var filePath = rdpdir + "/" + stepid + ".xml";
    var stepModel;
    var lastpostionstr='';
    var defaultLeft = '900px';
    var defaultTop = '500px';
    var instance = jsPlumb.getInstance({
        DragOptions : { cursor: "pointer", zIndex:2000 },//拖动时的演示
        HoverClass:"connector-hover" //hover时线样式
    });
    var stateMachineConnector = {
        connector:"StateMachine",
        paintStyle:{lineWidth:3,strokeStyle:"#056"},
        hoverPaintStyle:{strokeStyle:"#dbe300"},
        endpoint:"Blank",
        anchor:"Continuous",
        overlays:[ ["PlainArrow", {location:1, width:15, length:12} ]]
    };
    var windowData ='';// 数据模型
    var windowData_bak = '';
    var clickId ='';//当前点击的节点
	var rightClick = "";//右击的节点
    var AddSign;//1在右击之前添加;2在右击之后添加 
    var line_a,line_b;//连线的A、B
    var renderData //连线的结果集
    var return_case ='default';

    /**
     * 初始化
     */
    function initApp(argument){
        $("#node-view").width(parent.$('body').width());
        $('#node-edit').css("display","none");

    window.onresize = function(){//浏览器大小改变时触发事件
        if(clickId !=''){
           var nodeViewWidth = parent.$('body').width()-$('#node-edit').width(); 
        }else{
            var nodeViewWidth = parent.$('body').width(); 
        }
        $("#node-view").width(nodeViewWidth);
    }

    document.title = filePath;
    initConfigDir();

    $("#resetPosition").click(resetPosition);

    
    windowData = executeStep(filePath,windowData);
    windowData_bak = (new XMLSerializer()).serializeToString(windowData);

    document.querySelectorAll('.CallStep a, .JumpStep a').forEach(function(dom){
        var mouseOper = null;
        dom.addEventListener('mousedown', function(){ 
            mouseOper = "mousedown"; 
        });
        dom.addEventListener('mousemove', function(){ 
            if(mouseOper === "mousedown") mouseOper = "mousemove"; 
        });
        dom.addEventListener('mouseup', function(){ 
            if(mouseOper === "mousedown") openStepview(this.id); mouseOper = null; 
        });
    });
		 
    //节点内容的操作
     var oldValue;//改变之前的值
    $('#node-edit').on('click',function(e){
		oldValue = e.target.value;
		try{
			if(e.target.className ==='layui-icon add_nodeparam'){//节点参数的添加
			  window.addNodeparam();
              // executeStep(filePath,windowData);
			}
			if( e.target.className ==='layui-icon add_nodereturn'){//节点返回值的添加
			  window.addNodereturn();
              //executeStep(filePath,windowData);
			}
			if( e.target.className ==='layui-icon del_nodeparam'){//节点参数信息的删除
			  var oldnodeHtml =windowData.getElementsByTagName(clickId)[0];
				window.del_Nodeparam(e,oldnodeHtml);
                executeStep(filePath,windowData);
			} 
			if( e.target.className ==='layui-icon del_nodereturn'){//节点返回信息的删除
				var oldnodeHtml =windowData.getElementsByTagName(clickId)[0];
				window.del_Nodereturn(e,oldnodeHtml);
                executeStep(filePath,windowData);
			}
		}catch(e){ console.debug(e);}
    });

	
	 $("#nodeinfo").on('change',function(e){
           var newValue  = e.target.value;//改变之后的值
				if(e.target.id === 'nodeinfo-id'){//节点名
                   var checkFlag = window.checkStepName(newValue);
                   if(checkFlag){
                        window.parent.top.alert('参数名已存在,请重新输入');
                        e.target.value ="";
                        return;
                    }
				   if (rightClick !=""){
                        var parentObjxml = windowData.children[0];
                        var rightClickHtml =windowData.getElementsByTagName(rightClick)[0];//右击的
                    if(AddSign === "1" ){//在之前添加节点
                        window.creatNodeFormat(parentObjxml,AddSign,rightClick,rightClickHtml,newValue);
                        clickId = newValue;
                        savePositions(argument);//保存新增节点的位置信息
                        executeStep(filePath,windowData);

                    }if(AddSign === "2"){//在之后添加节点
                        window.creatNodeFormat(parentObjxml,AddSign,rightClick,rightClickHtml,newValue);
                        window.addReturn(rightClickHtml,return_case,newValue);
                        clickId = newValue;
                        savePositions(argument);//保存新增节点的位置信息
                        executeStep(filePath,windowData);
                       }
                   } else{//修改节点名
                        var oldnodeHtml =windowData.getElementsByTagName(clickId)[0];//选取那个节点的内容
                        window.nodeinfo_Id(clickId,oldnodeHtml,newValue);//更改节点名
                        modifyPostionNodeName(newValue,clickId);
                        clickId = newValue;
                        executeStep(filePath,windowData);
                   }
                    
				}
                if (clickId === $("#nodeinfo-id").val()&&clickId!=''){
                   var oldnodeHtml =windowData.getElementsByTagName(clickId)[0];
    				if(e.target.id === 'nodeinfo-remark'){//节点描述
    					window.nodeinfo_Remark(oldnodeHtml,newValue);
                        executeStep(filePath,windowData);
    				}
    				if(e.target.id === 'mySelect'){//组件信息
    					window.mySelect(oldnodeHtml,newValue);
                        executeStep(filePath,windowData);
    				}
                }
	 });
	 $("#nodeparam").on('change',function(e){
        if(clickId === $("#nodeinfo-id").val()&&clickId!=''){
    		var oldnodeHtml =windowData.getElementsByTagName(clickId)[0];//选取那个节点的内容
            var oTestParams = oldnodeHtml.getElementsByTagName('Params')[0];//那个节点的参数
    		var newValue  = e.target.value;//改变之后的值

            //判断参数名是否重复
            for(i=1;i<$(".param-id").length;i++){
                if(newValue == $($(".param-id")[i]).val()){
                $(e.target).parents('.param').find('.param-id').val("");
                    window.parent.top.alert('参数名重复');
                    return;
                } 
            }
    		 	if(e.target.className === 'param-id'){//参数名
    				window.param_Id(oTestParams,newValue,oldValue);
    			}
    			if(e.target.className === 'param-classname'){//参数值 
    			    var parent = $(e.target).parents('.param');
    			    var paramName =  parent.find('.param-id').val();
    				if(paramName ===''){
    					window.parent.top.alert('请先输入参数名');
                        e.target.value =" ";
                        return;
    				}else{
                        window.param_Classname(oTestParams,paramName,newValue);
    				}	
    			}
  
    		  executeStep(filePath,windowData);
        }else{
           window.parent.top.alert('请先输入节点名');
           e.target.value = "";
           return;
        }
	 });
	 
	 $("#nodereturn").on('change',function(e){
        if(clickId === $("#nodeinfo-id").val()&&clickId!=''){
    		var oldnodeHtml =windowData.getElementsByTagName(clickId)[0];//选取那个节点的内容
    		var oTestReturn = oldnodeHtml.getElementsByTagName('Return')[0];//那个节点的返回值
    		var returnList =  oldnodeHtml.getElementsByTagName('switch');
    		var newValue  = e.target.value;//改变之后的值
    			if(e.target.className === 'return-id'){//返回参数
                  window.return_Id(oTestReturn,returnList,newValue,oldValue);
    			}
    			if(e.target.className === 'return-param'){//返回值
    				var parent = $(e.target).parents('.return');
    				var returnName =  parent.find('.return-id').val();//获取返回参数			
    				if(returnName === ''){//返回参数为空
    					window.parent.top.alert('请先输入返回参数');
                        e.target.value = "";
                        return;
    				}else{
    					window.return_Param (returnList,returnName,newValue);
    				}
    		   }
               
                executeStep(filePath,windowData);
        }else{
            window.parent.top.alert('请先输入节点名');
            e.target.value = "";
            return;
        }
	 });
	
	 
	   // 标签页右键菜单-单击事件绑定
	$('#rightClickNode li a').on('click',function(e){
		
            window.newNodeBuild(rightClick,AddSign);
        
		if(this.id === "beforeAdd"){//在此之前添加一个节点
		  if($(this).css('opacity')!=0.2){
			AddSign = "1";
            $('#kitchensink-demo').find('.line-this').removeClass('line-this');
			creatNodeDisplay(e);
		}}
       	
		 else if(this.id === "afterAdd"){//在此之后添加一个节点
		  if($(this).css('opacity')!=0.2){ 
            AddSign = "2";
            $('#kitchensink-demo').find('.line-this').removeClass('line-this');
            creatNodeDisplay(e); 
        }		
		}else if(this.id === "delNode"){//删除该节点
			if(window.top.confirm("确定要删除此节点吗?")){
                 $('#kitchensink-demo').find('.line-this').removeClass('line-this');
				 del_Nodeinfo();
			}
		}
		$('#rightClickNode').css("display","none");
	});
    

        // 标签页右键菜单-单击事件绑定
    $('#rightClickLine li a').on('click',function(e){
        var aNodeObj = windowData.getElementsByTagName(line_a)[0];
        var bNodeObj = windowData.getElementsByTagName(line_b)[0];
        var aline =line_a,bline =line_b;
        var sign;
        if(this.id === "aTob"){//a->b
            window.addReturn(aNodeObj,return_case,bline);
            executeStep(filePath,windowData);   
            $('#rightClickLine').css("display","none");
            $('#kitchensink-demo > div#'+bline).addClass('line-this');
        }else if(this.id === "bToa"){//b->a
            window.addReturn(bNodeObj,return_case,aline);
            executeStep(filePath,windowData);  
            $('#rightClickLine').css("display","none");
            $('#kitchensink-demo > div#'+bline).addClass('line-this');
        }
    });

    $('#node-view').on('click',function(e){
        if(e.target.id === "newNode"){//点击空白节点
            $('#kitchensink-demo').find('.line-this').removeClass('line-this');
            $('#kitchensink-demo > div#newNode').addClass('line-this'); 
            window.newNodeBuild(rightClick,AddSign);
        }
        if(e.target.id ==="node-view"){//点击窗口空白地方
            line_a = '';
            line_b = '';
          //  $('#kitchensink-demo').find('.line-this').removeClass('line-this');
            $('#rightClickNode').css("display","none");
            $('#rightClickLine').css("display","none");
        }

    });
}
    /**
     * 分析选定的step
     */
    function executeStep(xmlpath,_xmlObj) {
        $('#main').html('<div class="demo kitchensink-demo" id="kitchensink-demo"></div>');

        try{
            var xmlstr = downloadXmlfile(xmlpath);
            if (_xmlObj ===''){
                _xmlObj = $.text2xml(xmlstr); 
            }else{//如果不是首次加载,必定是模型改变啦
                parent.triggerEvent('stepModel');
            }
            var root = _xmlObj.children[0];
            if(root.outerHTML.indexOf('This page contains the following errors:') > -1){
                // xml语法有误
                $('#main').html(root.outerHTML);
                return;
            }
            
            // 构建step模型
            stepModel =  buildStepModel(root);
            stepModel.id = xmlpath;
            $("#rootRemark").html(stepModel.remark);
            // 计算step位置
            positionStep(stepModel);
            // 构建step图形
            renderData = buildStepHtml(stepModel);
            // 绘制连线
            render(renderData);
            //添加节点解析
            line_a = '';
            line_b = '';
			rightClick  = '';
            //节点点击
            $('#kitchensink-demo > div.component.window').click( function(e){
                var nodeViewWidth = parent.$('body').width()-$('#node-edit').width(); 
                $("#node-view").width(nodeViewWidth);
                $('#node-edit').css("display","block");
                $('#rightClickNode').css("display","none");//右键div的隐藏
                $('#rightClickLine').css("display","none");
                $('#kitchensink-demo').find('.line-this').removeClass('line-this');//去掉选中状态

                if (clickId && e.ctrlKey){//ctr键+点击
                    line_a = clickId;
                    line_b = this.id;
                    $('#kitchensink-demo > div#'+line_a).addClass('line-this'); 
                    $('#kitchensink-demo > div#'+line_b).addClass('line-this');
                }
                   clickId = this.id;
                   $('#kitchensink-demo > div#'+clickId).addClass('line-this');
                   window.nodeBuild(clickId,stepModel);//创建div
                   window.nodeinfo(clickId,stepModel);//输入div内的信息  
            });
			
		    //空白节点的右键点击
			$('#kitchensink-demo').on("mousedown",function(e){
				if(3 == e.which){
					if(e.target.id === "newNode"){
						addGray("beforeAdd","afterAdd");//弹窗添加置灰效果
						rightClick = e.target.id;
						if(rightClick){
							window.rightClick_style(e,"rightClickNode","","");
						}
					}else{
						removeGray("beforeAdd","afterAdd");
					}
					
				}
			});
		    
			//鼠标点击
			$("#kitchensink-demo > div.component.window").on("mousedown",function(e){ 
				if(3 == e.which){//鼠标右击
                    if(this.id === line_b ){//显示连线
                        removeGray("aTob","bToa");
                        rightClick = this.id;
                        sign1 = window.existline(renderData,line_a,line_b,return_case);
                        sign2 = window.existline(renderData,line_b,line_a,return_case);
                        if(sign1){
                            document.getElementById("aTob").setAttribute("style","opacity: 0.2");
                        }if(sign2){
                            document.getElementById("bToa").setAttribute("style","opacity: 0.2");
                        }
                        if(rightClick){ 
                            window.rightClick_style(e,"rightClickLine",line_a,line_b);
                        } 
                    }else{//显示节点
                        var length = $('#newNode').length;
                        if(length>0){addGray("beforeAdd","afterAdd"); }else{removeGray("beforeAdd","afterAdd");};
                        rightClick = this.id;
                        if(rightClick){ 
                            window.rightClick_style(e,"rightClickNode","","");
                        } 
                    }
                }
                e.stopPropagation();
			});
			
			
            // 节点位置变化
            $('#kitchensink-demo > div.component.window').mouseup(savePositions);

            // 保存位置信息
            // savePositions();
            return _xmlObj;
        }catch(e){
            $('#main').html('<div style="padding-top:100px; text-align:center; color:red;">处理出错:'+e.stack+'</div>');
            console.info(e.stack);
        }
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
    

/**
 * 构建step图形
 */
function buildStepHtml (stepModel) {
    
    var connectStr = [];
    var stepHtml = [];
    var nullNodeCount = 0;
        
    for (stepname in stepModel.stepmap){
        
        var stepitem = stepModel.stepmap[stepname];
        var nodeName = stepitem.nodeName;
        var itemclass = "component window " + stepitem.cssClass.join(" ");
        var top = stepitem.position.top || defaultTop;
        var left = stepitem.position.left || defaultLeft;
        var stepidclass = ['id'];
        top = top == 'auto' ? defaultTop : top;
        left = left == 'auto' ? defaultLeft : left;

        stepHtml.push('<div class="'+itemclass+'" id="'+nodeName+'" title="'
            + encodeHtml(stepitem.code)+'" style="top:'+top+';left:'+left+';">');

        if(stepitem.cssClass.indexOf('CallStep') >= 0 || stepitem.cssClass.indexOf('JumpStep') >= 0){
            stepHtml.push('<a id="'+stepitem.targetStep+'" target="_blank" href="../step/steps.html?stepid='+stepitem.targetStep+'&rdpdir='+rdpdir+'">');
            stepidclass.push('');
        }
        stepHtml.push('<div class="content"><span class="'+stepidclass.join(' ')+'">'+nodeName+'</span>');
        stepHtml.push('<span>'+stepitem.remark+'</span>');
        stepHtml.push('<span>'+stepitem.className+'</span>');
        stepHtml.push('</div>');
        if(stepitem.cssClass.indexOf('CallStep') >= 0 || stepitem.cssClass.indexOf('JumpStep') >= 0)
            stepHtml.push('</a>');
        stepHtml.push('</div>');

        for(returnName in stepitem.return){
             var returnNode = stepitem.return[returnName];
            if(!stepModel.stepmap[returnNode]){
                returnNode = "nullNode";
                nullNodeCount++;
            }
            var returnDesc = returnName;
            connectStr.push({source: ""+nodeName, 
                    target: "" + returnNode, 
                    label: "" + returnDesc});
        }
    }

    
    $('#kitchensink-demo').append(stepHtml.join('\n'));
    if(nullNodeCount > 0){
        $('#nullNode').show();
    }
    
    return connectStr;
}

function render (connectStr) {

    for(i in connectStr){
        var conn = connectStr[i];
        try{
           /* //点击‘请选择’时不创建连线
            if(conn.target == 'nullNode'){
                continue;
            }*/
            instance.connect(conn , stateMachineConnector);
        }catch(e){
            console.info("erred connectStr:%o",conn);
            console.info(e.stack);
        }
    }
    
    // make all .window divs draggable. note that here i am just using a convenience method - getSelector -
    // that enables me to reuse this code across all three libraries. In your own usage of jsPlumb you can use
    // your library's selector method - "$" for jQuery, "$$" for MooTools, "Y.all" for YUI3.
    //instance.draggable(jsPlumb.getSelector(".window"), { containment:".demo"});    
    instance.draggable(jsPlumb.getSelector(".window"), {
        drag:function() {
            //console.log("DRAG")
        }
    });    

    jsPlumb.fire("jsPlumbDemoLoaded", instance);
}

/**
 * 加载文件列表下拉数据
 */
function loadFilelistOptions(argument) {
    console.info('************');
    $.get("/rdp/selectStepOption", {}, function(list){
        console.info("xmlList,%o", list);
        var optionHtml = ["<options>"];
        optionHtml.push("<option value=''>----请选择---</option>");
        for(var i=0;i<list.length; i++){
            optionHtml.push("<option value='"+list[i]+"'>"+list[i]+"</option>");
        }
        optionHtml.push("</options>");
        $("#xmlFile").html(optionHtml.join("\n"));
     }, 'json');
}


function positionStep(stepModel) {
    var positionObj;

    if(fs.existsSync(postionConfPath)){
        var postionContent = fs.readFileSync(postionConfPath);
        try{positionObj = JSON.parse(postionContent);}catch(e){}
    }

    var allreturn = stepModel.allreturn;
    var nolinkinstep = stepModel.nolinkinstep;
    var topstart = 85, leftstart=30;
    // step坐标
    var x=1, y=1;
    // 每行7个step
    var xmax = 6;
    // 未使用的step统一到到第9列
    var nousex=9, nousey=1


    for(stepname in stepModel.stepmap){
        var step = stepModel.stepmap[stepname];
        if(typeof allreturn[stepname] == 'undefined'){
            nolinkinstep.push(step);

            if(countUsedReturn(step, stepModel) > 0){// 起始节点
                step.cssClass.push("startpoint");
                step.position = {x: x, y: y};
                x++;
            }else{// 无用节点
                step.cssClass.push("nouse");
                step.position = {x: nousex, y: nousey};
                nousey ++;
            }
        }else{
            step.position = {x: x, y: y};
            x++;
        }

        if(positionObj){
            try{
                var nodePosition = (positionObj[step.nodeName]==null?positionObj['newNode']:positionObj[step.nodeName]);
                step.position.top = nodePosition.top || '500px';
                step.position.left = nodePosition.left || '500px';

                // if(step.position.top == 'undefined' || step.position.left == 'undefined' 
                //     || step.position.top == 'auto' || step.position.left == 'auto'
                //     || (step.position.top == '85px' && step.position.left == '30px')){
                //     step.position.top = '500px';
                //     step.position.left = '500px';
                // }

            }catch(e){
                
            }
        }else{
            step.position.top = topstart + (step.position.y -1) * 145;
            step.position.top = step.position.top + "px";
            step.position.left = leftstart + (step.position.x - 1) * 185;
            step.position.left = step.position.left + "px";
        }
        

        if( x > xmax){
            y ++;
            x = 1;
        }
    }

    return stepModel;
}

function countUsedReturn(destStep, stepModel) {
    if(destStep.returnSize < 1){
        return 0;
    }else{
        var count = 0;
        for(returnName in destStep.return){
            var nodeStep = destStep.return[returnName];
            if(typeof stepModel.stepmap[nodeStep] != 'undefined'){
                count ++;
            }
        }
        return count;
    }
}

/**
 * 构建step模型。
 * {
        id: "",
        stepmap: {},
        steplist: [],
        noreturnstep: [],
        allreturn: {},
        nolinkinstep: [],
        nousestep:[]
    }
 */
function buildStepModel(root) {
    var myStep = {
            remark: root.getAttribute('Remark'),
            stepmap: {}, 
            steplist: [], 
            noreturnstep: [],
            allreturn: {},
            nolinkinstep: [],
            nousestep:[],
            position:{}
        };

    for(var i=0; i<root.children.length; i++){
        var item = root.children[i];
        var step;
        try{
            step = buildStepItem(item);
        }catch(e){
            continue;
            console.info(item.innerHTML);
            }
            if(step.returnSize < 1){
                myStep.noreturnstep.push(step);
            }else{
                for(nodeName in step.return){
                    var nodeStep = step.return[nodeName];
                    myStep.allreturn[nodeStep] = nodeStep;
                }
            }
            myStep.stepmap[step.nodeName] = step;
        }

    // 添加无效节点
    myStep.stepmap['nullNode'] = {
            code:'--',
            nodeName:'nullNode',
            remark:'无效节点',
            className:'',
            returnSize: 0,
            cssClass: ['nullNode'],
            position: {top:50, left:50}
       };
    return myStep;
}


/**
 * 构建单个step对象
   {
        code:'',
        nodeName:'',
        remark:'',
        className:'',
        return:{nodeName: caseName},
        returnSize: size,
        cssClass: [],
        position: {top:, left:}
   }
 */
function buildStepItem(item) {
    var step = {};
    step.code = item.outerHTML;
    step.nodeName = item.nodeName;
    step.remark = item.getAttribute('Remark');
    step.className = item.getElementsByTagName('ClassName')[0].textContent;
    step.cssClass = [step.className];
    
	step.param ={};
    step.return = {};
    step.returnSize = 0;
	step.paramSize =0;
    var returnObj = item.getElementsByTagName('Return');
	var paramObj = item.getElementsByTagName('Params');
    if(returnObj.length > 0){
        var retObj = returnObj[0];
        var switchs = retObj.getElementsByTagName('switch');
        for(var n=0; n<switchs.length; n++){
            var switchObj = switchs[n];
            step.return[switchObj.getAttribute('case')] = switchObj.textContent;
            step.returnSize ++;
        }
    }

	 if(paramObj.length > 0){
        var parObj = paramObj[0];
        var params = parObj.getElementsByTagName('*');
        for(var n=0; n<params.length; n++){
            var paramsObj = params[n];
            step.param[paramsObj.tagName] = paramsObj.textContent;
            step.paramSize ++;
        }
    }

    if(step.className == 'CallStep' || step.className == 'JumpStep'){
        try{
            var paramObj = item.getElementsByTagName('Params')[0];
            step.targetStep = paramObj.getElementsByTagName('Step')[0].innerHTML;
        }catch(e){
          console.debug('Step的跳转项为空...'+e);
        }
    }

    if(step.returnSize < 1){
        step.cssClass.push("endpoint");
    }

    return step;
}


/**
 * 对html进行转义
 */
function encodeHtml(s){
      return (typeof s != "string") ? s :
          s.replace(/"|&|'|<|>|[\x00-\x20]|[\x7F-\xFF]|[\u0100-\u2700]/g,
				function($0){
					var c = $0.charCodeAt(0), r = ["&#"];
					c = (c == 0x20) ? 0xA0 : c;
					r.push(c); r.push(";");
					return r.join("");
				});
};


/**
 * 保存节点位置信息。
 * 2秒钟自动保存
 */
function savePositions(argument) {

    var positions = {};
    $('#kitchensink-demo > div.component.window').each(function(item){
        positions[this.id] = {top: $(this).css('top'), left: $(this).css('left')};
    });

    positions = {id: stepModel.id, values: JSON.stringify(positions)};
    // positions = JSON.stringify(positions);
    positions = positions.values;
    if(lastpostionstr != positions){
        console.info("节点位置发生变化，保存位置信息...");
        lastpostionstr = positions;
        // $.post("/rdp/position/save", positions, function(res){});
        try{
            fs.writeFileSync(postionConfPath, positions);
        }catch(e){
            console.debug(e);

        }
    }else{
        // 位置信息无变化，不需要保存。
    }

}

/**
 * 重置位置
 */
function resetPosition(argument) {
    if(!stepModel.id){
        alert("当前未打开流程文件");
        return;
    }
    if(window.confirm("确定要重置位置信息吗？")){
        $.post("/rdp/position/reset", JSON.stringify({id: stepModel.id}), function(res){
            $("#reloadFilelist").click();
        });
    }
    
}

/**
 * 联动打开制定流程图。
 */
function openStepview(id) {
    console.debug(id);
    ipcRenderer.send('viewEvent', 'open', id+".xml");
}

/**
 * 舒适化配置文件路径
 */
function initConfigDir(argument) {
    var rootdir = localStorage.getItem('projectDir');
    // try{fs.accessSync(rootdir + "/.ide")){
    try{
        fs.mkdirSync(rootdir + "/.ide");
        fs.mkdirSync(rootdir + "/.ide/position");
    }catch(e){}
}
initApp();

//---------------------------------------------------------------------------------------------------------
function creatNodeDisplay(e){
    //1创建空白节点
    var newNodeHtml = [];
        newNodeHtml.push('<div class = "component window line-this" id ="newNode" style="top:'+window.event.clientY+'px ;left:'+window.event.clientX+'px;"></div>');
    $('#kitchensink-demo').append(newNodeHtml.join('\n'));

    //2创建连线
    var addNoderender =[];
    if(AddSign ==="1"){
       addNoderender.push({source: ""+"newNode", 
                    target: "" + rightClick, 
                    label: ""+return_case});
       render(addNoderender); 
    }else if(AddSign ==="2"){
	   var rightClickHtml =windowData.getElementsByTagName(rightClick)[0];//右击的
	   var aReturnsXmlObj =rightClickHtml.getElementsByTagName("Return")[0];
	   var dCaseValue = window.jisuan_dCaseValue(aReturnsXmlObj,return_case);
       addNoderender.push({source: ""+rightClick, 
                    target: "" + "newNode", 
                    label: dCaseValue});
       render(addNoderender);
    }   
    //3创建右侧空白div
    window.newNodeBuild(rightClick,AddSign);
}


	//右键点击节点信息的删除
	function  del_Nodeinfo(){
		  if(rightClick=="newNode"){//右击的节点id是不是空白节点id
			   var thisNode=document.getElementById("newNode");
             thisNode.parentNode.removeChild(thisNode);
		  }else{
              var oldnodeHtml = windowData.getElementsByTagName(rightClick)[0];
			    var oTestNode = windowData.children[0];
                if(oldnodeHtml.previousSibling != null && oldnodeHtml.previousSibling.nodeName =='#text'){
                  oTestNode.removeChild(oldnodeHtml.previousSibling);
                }
				oTestNode.removeChild(oldnodeHtml); 
		  }
				executeStep(filePath,windowData);
	}
	//弹窗添加置灰效果
	  function addGray(id1,id2){
         var beforeStyle = document.getElementById(id1);   
		 beforeStyle.setAttribute("style","opacity: 0.2");
         var afterStyle = document.getElementById(id2);
         afterStyle.setAttribute("style","opacity: 0.2");
		 
	  }
	 //弹窗移除置灰效果
	 function removeGray(id1,id2){
         var beforeStyle = document.getElementById(id1);
		 beforeStyle.removeAttribute("style");
         var afterStyle = document.getElementById(id2);
         afterStyle.removeAttribute("style");
	 }
	 
	
    window.popViewData = function(){
        return windowData;
    }
    window.getViewData_bak = function(){
        return windowData_bak;
    }

function modifyPostionNodeName(newVal,oldVal){
    var positionObj ={};
    if(fs.existsSync(postionConfPath)){
        var postionContent = fs.readFileSync(postionConfPath);
        try{positionObj = JSON.parse(postionContent);}catch(e){}
    }
    positionObj[newVal] = positionObj[oldVal];
    delete positionObj[oldVal];
    var positions  = {id: stepModel.id, values: JSON.stringify(positionObj)};
    try{
        fs.writeFileSync(postionConfPath, positions.values);
    }catch(e){
            console.debug(e);
    }
}




});


