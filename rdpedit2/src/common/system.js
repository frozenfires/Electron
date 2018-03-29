(function(){
	var that = exports;
	var dialog = require('electron').remote.dialog;
	var BrowserWindow = require('electron').remote.BrowserWindow;
	var fs = require('fs');
	var View = require('./view.js');
	var shell = require('electron').shell;
	var rdpdir;
	var execute = require('./execute.js');
	var ipcRenderer = require('electron').ipcRenderer;

	/**
	 * 设置工程目录
	 */
	that.switchProject = function() {
		dialog.showOpenDialog({properties: ['openDirectory']}, function(dirs){
			if(typeof dirs == 'undefined') return;

			try{
				var dir = dirs[0];
				fs.accessSync(dir + "/step");
				fs.accessSync(dir + "/display");
				localStorage.setItem('projectDir', dir);
				
				$('#projectTree').html('');
				firstflag = dir;
				var treeData =  explor(dir);
				console.info(treeData);
				refreshNavTree(treeData, function(){
					View.closeAllFiles();
					View.updateTitleMsg(dir);
					dialog.showMessageBox({type:'info', message:'成功切换到'+dir})
				});
			}catch(e){
				console.info(e.stack);
				dialog.showErrorBox('路径错误', '不是一个合法的RDP工程路径');
			}
		});
	}
	
	/**
	 * 版本更新日志
     */
	that.showLogInfo = function(){
		var win = new BrowserWindow({width: 1024, height: 768, frame: false});
		win.on('close', function(){win = null})
		console.info(__dirname);
		win.loadURL('file://' + __dirname + '/../views/releasenote/index.html');
		win.show();
    }

    /**
     * 页面预览
     * @return 无返回值
     */
	that.funcPreview = function(){
		// 获取当前焦点所在的标签url
		var url = $('.layui-tab .layui-this').attr('fileUrl');
		if(!url){ url = ""; }
		var fileType = url.substring(url.lastIndexOf(".")+1, url.length);
		if(fileType.toLocaleLowerCase() !== "html"){
			alert('请选择html文件进行预览');
			return;
		}
		var browser = "iexplore";
		execute.openBrowser(url, browser);
    };

    /**
     * 根据路径打开程序
     * 无返回值
     */
    /* that.openExeByFilePath = function(){
		ipcRenderer.send('open-file-dialog');
    };*/

    // 接收文件路径选择结果
    /*ipcRenderer.on('selected-file', function (event, path) {
	  	execute.openExe(path[0]);
	})*/

    /**
     * 根据名称打开程序
     * 无返回值
     */
    var rdpdir = localStorage.getItem('projectDir');
    that.openExeByFileName_qiDong = function(){//运行启动
        var path = rdpdir+'\\EthinkBank.exe';
		execute.openExe(path);
    };
    that.openExeByFileName_jiaMi = function(){//加密
        var path = rdpdir+'\\NtCfgDataGenerator.exe';
		execute.openExe(path);
    };

    that.openExeByFileName_jieMi = function(){//解密
        var path = rdpdir+'\\NtCfgDataGeneratorDec.exe';
		execute.openExe(path);
    };

    that.openExeByFileName_peiZhi = function(){//参数配置
        var path = rdpdir+'\\NtIDESetting.exe';
		execute.openExe(path);
    };

    that.openExeByFileName_jianCe = function(){//xml流程检测
        var path = rdpdir+'\\NtStepCheck.exe';
		execute.openExe(path);
    };

    that.openExeByFileName_update = function(){//在线更新
        var path = rdpdir+'\\NtUpdate.exe';
		execute.openExe(path);
    };

    that.openExeByFileName_shouHu = function(){//守护进程
        var path = rdpdir+'\\NtRenew.exe';
		execute.openExe(path);
    };

	/**
	 * 创建树
     */
	that.loadNavTree = function(rdpdir){
		$('#projectTree').html('');
		firstflag = rdpdir;     //第一次文件路径
		var fileTree =  explor(rdpdir);
		refreshNavTree(fileTree, function(){
			View.updateTitleMsg(rdpdir);
		});
    }
	
	//----------------------------内部方法分界线--------------------------------------------------
	
	function refreshNavTree(treeData, callback) {
		layui.use('tree',function(){
			layui.tree({
				elem : '#projectTree' ,// 指定元素
				skin : 'as' ,
				drag : true ,
				nodes : treeData,
				click : function(event){
					if(event.id !='STEP'&&event.id !='SCRIPT'
					   &&event.id !='DISPLAY'&&event.id !='CFG'
					   &&event.id !='Form'&&event.id !='Config'){
						var closeTitle = $("#projectTree li").find('.title-this').removeClass('title-this');
						var openTitle = $("cite:contains('"+event.id+"')").parent().parent();
						  openTitle.addClass('title-this'); 

						$(".tabs").css("visibility","visible");
						var filePath = event.path + '\\' + event.name;
						var stat = require('fs').statSync(filePath);
						
						if(stat.isDirectory()){
							return;
						}else{
							View.open(filePath);
						}
					}
				}
			});
			callback();
			
		});
	}

	//递归读取项目文件内容
	function explor(path){
		var ret = [],
			files = [],
			docFile = ['STEP','SCRIPT','DISPLAY','CFG','Config','Form'],
			files = fs.readdirSync(path);
			
			files.forEach(function(file){
				if (path == firstflag) {        //判断是根节点  
					for (var i = 0; i < docFile.length; i++) {      //遍历docFile数组
						if(docFile[i]==file){  
							var stat = fs.statSync(path + '\\' + file);             
							if(stat.isDirectory()){
								ret.unshift({name: file, id: file,children: explor(path + '\\' + file), path: path});                 
							}else{
								ret.push({name: file, id:file, path: path});
							}
						}
					}
					
				}else{
					var stat = fs.statSync(path + '\\' + file);
					if(stat.isDirectory()){
						ret.unshift({name: file, id: file,children: explor(path + '\\' + file), path: path});                 
					}else{
						var parentNodes = path.substring(path.lastIndexOf("\\")+1,path.length)
						ret.push({name: file,parentNode:parentNodes, path: path, id:file});
					}
				}
			});
					
		return ret;
	}
	
	that.explorFile = function(path){
		var data =  explor(path);
		return data;
	}
	
})()