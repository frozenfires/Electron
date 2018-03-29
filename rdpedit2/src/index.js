(function(){

var ipcRenderer = require('electron').ipcRenderer;

var System = require('./common/system.js');
var menu = require('./common/menu.js');
var View = require('./common/view.js');
var basepath = process.cwd();
var confpath = basepath + '/conf/system.json';
var leftPos;
var mouseEventTarget = {target:null, basex:null, basey:null};

var init = function(){
    $(".tabs").css("visibility","hidden");//隐藏菜单

    initNavTree();
    menu.loadMenu();
    initIPC();
    initFindFiles();
    $(document).mousemove(event_mousemove);
    $(document).mousedown(event_mousedown);
    $(document).mouseup(event_mouseup);
};

function event_mousedown(e) {
    mouseEventTarget.target = e.target;
    mouseEventTarget.basex = e.pageX;
    mouseEventTarget.basey = e.pageY;
}

function event_mouseup(e) {
    mouseEventTarget.target = null;
}

function event_mousemove(e) {
    if(mouseEventTarget.target && mouseEventTarget.target.id == 'splitor'){
        var offset = mouseEventTarget.basex - e.pageX;

        resizeMain(e.pageX);
    }
}


/**
 * 调整主窗口大小
 * offset调整大小的偏移量
 * offset > 0时向左移动
 * offset < 0时向右移动
 */
function resizeMain(offset) {
    if(isNaN(offset) || offset == 0){
        console.info("参数非法，无法调整");
        return;
    }else if(offset <=25 || offset >= 410){
        // 超出最大宽度范围
        return;
    }

    var menuWidth = $('div.navator').width();
    var newWidth = offset;

    $('div.navator').width(newWidth);
    $('div.sysmain').css('padding-left', newWidth + 'px');
}

/**
 * 初始化ipc事件处理 
 */
function initIPC(argument) {
    // 进程通讯事件
    ipcRenderer.on('cmd_view_open', function(event, arg){
        // 现有的树菜单做不到用id直接定位
        $('#projectTree cite').each(function(index,element){
          if(arg === element.innerHTML){
            console.info('收到流程节点跳转事件,跳转目标:'+arg);
            element.click();
          }
        });
    });

    ipcRenderer.on('cmd_view_fileChange', function(event, arg){
        View.setFileChangeIcon(arg);
    });

    ipcRenderer.on('cmd_view_fileChange_cancel', function(event, arg){
        View.removeFileChangeIcon(arg);
    });

    ipcRenderer.on('cmd_view_updateTitle', function(event, arg){
        View.updateTitleMsg(arg);
    });
}

/**
 * 初始化导航菜单树
 */
function initNavTree(argument) {
     try{
        var projectDir = localStorage.getItem('projectDir');
        if(!projectDir){
            showSettingView();
        }else{
           System.loadNavTree(projectDir);//创建树
           $("#left").click(leftjump);
           $("#rignt").click(rightjump);
           $("#rightSign").attr("style","display:block");//显示右按钮


           $('.layui-tab-title').on('click', function(e){ 
               if( e.target.classList.value ==='layui-icon layui-unselect layui-tab-close'){
                  var tabId = e.target.parentNode.getAttribute("lay-id");
                  View.closeFile(tabId);
               } 
           });

            $('#titleright').on('click', function(e){ 
              if( e.target.classList.value ==='clickTitle'){
                  View.jumpToTitle(e);
               } 
           });


           // $('.clickTitle').click(function(){ View.jumpToTitle;})

           //标题的隐藏或显示
           $('#rightSign').click(showOrHidden_Title);
            
            //鼠标-右击
            var tabId;
            $("#fileTabTitle").on('mousedown', function(e){ 
                if(3 == e.which){
                  tabId = e.target.getAttribute("lay-id");
                  if(tabId){ 
                    rightClick_style(e);
                    } 
                }
            });

            // 标签页右键菜单-单击事件绑定
            $('#rightClick-Window li a').click(function(){
                if(this.id === "refresh"){
                    View.reloadFocuseTab();
                }else if(this.id === "save"){
                    View.saveFile(tabId);
                }else if(this.id === "saveAll"){
                    View.saveAllFile();
                }else if(this.id === "close"){
                    View.closeFile(tabId);
                }else if(this.id === "closeOther"){
                    View.closeOtherFiles(tabId);
                }else if(this.id === "closeAll"){
                    View.closeAllFiles();
                }
                $('#rightClick-Window').css("display","none");
            });

            // 单击标签栏时隐藏相关菜单
            $('#fileTabTitle').click(function(){
                $('#rightClick-Window').css("display","none");
                $('#openTitle').css("display","none");
            });


        }
    }catch(e){
        console.debug(e);
    }
}

function showSettingView(argument) {
    document.querySelector('#projectTree').innerHTML 
        = '<button type="button" id="setProject" style="font-size: 23px;color: #59595d; margin-left: 40px; margin-top: 90px; padding: 9px 35px 9px 35px;">设置路径</button>';
    document.querySelector('#setProject').addEventListener('click', System.switchProject);
}
//叶签左移
function leftjump(argument) {
	leftPos = $('.layui-tab-title').scrollLeft();
	$(".layui-tab-title").scrollLeft(leftPos + 100) ;
}
//叶签右移
function rightjump(argument) {
    leftPos = $('.layui-tab-title').scrollLeft();
	$(".layui-tab-title").scrollLeft(leftPos - 100);
}
      

//隐藏或显示下拉框
function showOrHidden_Title(){
	if($('#openTitle dl.layui-nav-child').is(':hidden')){//显示
		$('#openTitle').attr("style","display:block");
	    $('#openTitle dl.layui-nav-child').attr("style","display:block");
	}else{//隐藏
		$('#openTitle dl.layui-nav-child').attr("style","display:none");
	}
}
   

//鼠标右击样式
function rightClick_style(e){
	var titleWidth = $('#fileTabTitle').width();
    var sign = 275;
    var divWidth = $('#rightClick-Window').width();

		if( $('#rightClick-Window').is(':hidden') ){
	         $('#rightClick-Window').css("display","block");
            
            //鼠标坐标+div宽度 = 标题宽+固定值
            if((e.clientX + divWidth) >(titleWidth+sign)){ 
                $('#rightClick-Window').css("left", e.clientX - sign*(2/3) ); 
           	    $('#rightClick-Window').css("margin-top", e.clientY+1); 
            }else{
            	$('#rightClick-Window').css("left", e.clientX); 
           	    $('#rightClick-Window').css("margin-top", e.clientY+1); 
            }
		}else{
			 $('#rightClick-Window').css("display","none");
		}
}
/*
*全局查找文件内容（未完成）
*/
/*$("#findButton").click(function findInFiles(){
	  try{
		  var cfgPath = window.localStorage.projectDir;
			  cfgPath += "/CFG/TransClassDef.xml";
		  var fs = parent.require('fs');
		  var iconv = parent.require('iconv-lite');
		  var cfgStr = fs.readFileSync(cfgPath, 'latin1');
			  cfgStr = iconv.decode(cfgStr, 'GBK');
		  //console.info(cfgStr);
		  var findName = $("#findName").val();
		  var re = new RegExp("^\\d+$","gim");
			checkNum.test($(this).val());
		}catch (e){
		  console.debug(e);
		}
});*/
/*
*全局查找文件名
*/
function initFindFiles(){
	var cfgPath = window.localStorage.projectDir;
	var treeData = System.explorFile(cfgPath);
	var dataJson = searchData(treeData);
	var fifltParam = {"jpg":"0","png":"0","wav":"0","swf":"0","gif":"0","JPG":"0"};
	for(key in dataJson){
		var fileType = key.split(".")[key.split(".").length-1];
		if(fifltParam[fileType]!="0"){
			$("#fileNameSelect").append("<option>"+key+"------"+dataJson[key]+"</option>");
		}
       
    }
	
};
//将所有文件名和文件地址拼成json
function searchData(treeData){
	var dataJson = {};
	if(treeData.children!=null){
		for(i in treeData.children){
			addJson(dataJson,searchData(treeData.children[i]));
		}
	}else if(treeData.length!=null){
		for(i in treeData){
			addJson(dataJson,searchData(treeData[i]));
		}
	}else{
		dataJson[treeData.name] = treeData.path;
	}
	return dataJson;
}
//将一个json添加进另一个json
function addJson(oldJson,newJson){
	$.each(newJson,function(name,value) {
		oldJson[name] = value;
	});
	/*for(var key in newJson){
		oldJson[name] = newJson[key];
	}*/
}
//绑定查找文件事件
$("#fileNameSelect").on('change',function(e){
	var newValue  = e.target.value;
	if(newValue!=null&&newValue!=""){
		var closeTitle = $("#projectTree li").find('.title-this').removeClass('title-this');
		var openTitle = $("cite:contains('"+newValue.split('------')[0]+"')").parent().parent();
		openTitle.addClass('title-this'); 
		$(".tabs").css("visibility","visible");
		var filePath = newValue.split('------')[1]+ '\\' +newValue.split('------')[0];
		var stat = require('fs').statSync(filePath);
		if(stat.isDirectory()){
			return;
		}else{
			View.open(filePath);
			//$("#fileNameSelect").val("");
			$("#find_files_window").removeClass("findFile");
			$("#find_files_window").addClass("closeFindFile");
		}						
	}
			
});

init();
})()


 