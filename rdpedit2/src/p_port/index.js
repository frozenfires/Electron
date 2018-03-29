(function(){

	const http = require('http');
	const url = require('url');
	const util = require('util');
	const querystring = require('querystring');
	const service = require('./service.js');
	const mess_unpack = require('./message/mess_unpack.js');
	var EventEmitter = require('events').EventEmitter; 
	var event = new EventEmitter(); 
	var log = require('./log.js');
	var remote = require('electron').remote;
	var server;
	//const StringDecoder = require('string_decoder');
	//菜单栏
	var template = [{
		label: '编辑报文库',
		click:function(){
					layer.open({
					title: '编辑报文库',
					type: 2,
					area: ['800px', '600px'],	
					id:"frame",
					content: ['views/operatemsg.html', 'no']
					});  
				}

		},{
		label: '报文解析配置',
		click:function(){
			//打开解析报文配置
			  layer.open({
				title: '报文解析配置',
				type: 2,
				area: ['800px', '600px'],	
				id:"frame",
				content: ['views/configIndex.html']
				});  
			}
		},{
		label: '打开开发者工具',
		click:function(){
			remote.getCurrentWindow().openDevTools();
				}

		}];
	
	var Menu = remote.Menu;
	var menu = Menu.buildFromTemplate(template);
	//Menu.setApplicationMenu(menu);


	window.addEventListener('contextmenu', (e) => {
	   e.preventDefault();
		menu.popup(remote.getCurrentWindow());
	}, false);
	//创建服务器,messdeal为回调函数
	$("#creat_service").click(function(){
		var ip = $("#ip").val();
		var port = parseInt($("#port").val());
		try{
			var newServer = service.creatServer(ip,port,messdeal);
			setTimeout(function() { 
				if(newServer.address()!=null){
					console.log('Server listening on ' + newServer.address().address +':'+ newServer.address().port);
					log.setLog("创建服务器成功，host:"+newServer.address().address +':'+ newServer.address().port);
					server = newServer;
					$("#creat_service i").addClass('layui-anim-loop');
					$("#creat_service span").text("服务器已启动");
				}else{
					log.setLog("创建服务器失败!");
				}
			}, 300);
			
		}catch (e){
			log.setLog("创建服务器失败"+e);
		}
	});
	$("#close_service").click(function(){;
		try{
			if(server){
				server.close();
				log.setLog("服务器已关闭");
				server=undefined;
				$("#creat_service i").removeClass('layui-anim-loop');
				$("#creat_service span").text("创建服务器");
			}else{
				log.setLog("服务器未启动");
			}
		}catch (e){
			log.setLog("服务器关闭失败");
		}
	});
	
	//
	layui.use('layer', function(){
	  var layer = layui.layer;
	  //打开报文库编辑页面
	  $("#edit_base").click(function(){
		  layer.open({
			title: '编辑报文库',
			type: 2,
			area: ['800px', '600px'],	
			id:"frame",
			content: ['views/operatemsg.html', 'no']
			});  
	  });

	}); 
	//填充解析报文区域区域	
	layui.use('table', function(){
		var table = layui.table;

	})	
	
	//----------------------------我是内部方法分界线--------------------------------------------------
	function messdeal(mess,sendMess){
		//将报文信息加载至页面
		var table = layui.table;
		table.reload('show_mess',{
				data: getTableData(mess)
		});
		var backtype = $("[name='sendtype']")[0].checked?true:false;
		var backmess;
		if(backtype){
			//返回消息
			//backmess = serve.dealMess(mess);
			if(!backmess){
				var msgbase = require("./msgbase/msgbase.js");
				var backfile = msgbase.operateMessbase(mess,'findDefault');
				//var backfile = mess;
				if(!backfile){
					log.setLog("没有默认返回报文");
					return;					
				}
				//业务处理模块
				var process = require('./msgbase/processing.js');
				backfile = process.dealMess(mess,backfile);
				backmess = mess_unpack.encode(backfile);
			}
			console.info(backmess);
			$("#default_back").val(backmess);
		}else{
			backmess = $("#user_defined").val();
			log.setLog("使用自定义返回报文");
		}
		//使用回调函数返回报文
		sendMess(backmess);
	}
	function getTableData(mess){
		var data = [];
		for(var id in mess){
			if(typeof(mess[id])!="object"||id=='bitmap'){
				data.push({'type':id,'value':mess[id]});
				continue;
			}
			for(var type in mess[id]){
				if(id == 'fields'){
					data.push({'type':type+'域','value':mess[id][type]});
				}else{
					data.push({'type':type,'value':mess[id][type]});
				}
			}
		}
		return data;
	}
	
})()