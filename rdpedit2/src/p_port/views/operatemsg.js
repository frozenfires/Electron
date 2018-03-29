$(function(){
	var msgbase = window.parent.require('./msgbase/msgbase.js');
	var fieldsConfigMap = window.parent.require('./message/mess_unpack.js');
	fieldsConfigMap =  fieldsConfigMap.fieldsConfigMap;
	var mess_unpack = window.parent.require('./message/mess_unpack.js');
	var log = window.parent.require('./log.js');
	const dialog = window.parent.require('electron').remote.dialog;
	//增加报文
	$("#add").click(function(){
		//iframe切换
		delete window.parent.require.cache[window.parent.require.resolve("./views/addmsg.js")];
		var index = parent.layer.getFrameIndex(window.name);
		parent.layer.iframeSrc(index, 'views/addmsg.html');
	});	
	
	//修改
	$("#modify").click(function(){
		//iframe切换
		var index = parent.layer.getFrameIndex(window.name);
		var table = layui.table;
		var rows = table.checkStatus('msgbase').data; 
		if(rows.length!=1){
			alert("请选择一项内容修改");
			return;
		}
		parent.layer.iframeSrc(index, 'views/modifymsg.html');
		var msgback = new msgbase.msgback(
				null,
				{'APPTYPE':rows[0].APPTYPE},
				null,
				null,
				rows[0].backname
			);
		var data = msgbase.operateMessbase(msgback,'open');
		try{
			data = JSON.parse(data);
			if(data){
				data.backname = rows[0].backname;
				data.def = rows[0].def;
			}
			window.parent.msgback = data;
			//mess_unpack.encode(data);
		}catch (e){
			console.error(e);
		}

	});	

	/* 重新加载表格 */
	layui.use('table', function(){
		var table = layui.table;
		//开始时加载
		table.reload('msgbase',{
				data: getTableData()
			});
			
		//删除
		$("#delete").click(function(){
		var rows = table.checkStatus('msgbase').data; 
		//console.log(checkStatus.data);
		rows.forEach(function(row){
			var msgback = new msgbase.msgback(
				null,
				{'APPTYPE':row.APPTYPE},
				null,
				null,
				row.backname
			);
			msgbase.operateMessbase(msgback,'del');
		});
		table.reload('msgbase',{
				data: getTableData()
			});
		log.setLog("删除报文成功");
		});	
		//查找
		$("#find").click(function(){
			var condition = {};
			condition['APPTYPE'] = $("#APPTYPE").val();
			condition['backname'] = $("#backname").val();
			table.reload('msgbase',{
					data: getTableData(condition)
				});
		});

		//重新生成索引
		$("#bulid_index").click(function(){
			msgbase.bulidIndex();
			table.reload('msgbase',{
					data: getTableData()
				});
		});
		//导入报文库
		$("#import").click(function(dirs){
			dialog.showOpenDialog({properties: ['openFile','multiSelections'],filters: [ 
				{name: '报文库', extensions: ['txt', 'xml']}]}, function(dirs){
				if(!dirs){return;}
				msgbase.importBase(dirs);
				setTimeout(function() { 
					msgbase.bulidIndex();
					log.setLog("导入成功");
					table.reload('msgbase',{
						data: getTableData()
					});
				},500);
			});
		});
		//转为8583报文
		$("#export").click(function(){
			var table = layui.table;
			var rows = table.checkStatus('msgbase').data; 
			if(rows.length!=1){
				alert("请选择一项内容");
				return;
			}
			var msgback = new msgbase.msgback(
					null,
					{'APPTYPE':rows[0].APPTYPE},
					null,
					null,
					rows[0].backname
				);
			var data = msgbase.operateMessbase(msgback,'open');

				data = JSON.parse(data);

				var mess8583 = mess_unpack.encode(data);
				log.setLog("导出为："+mess8583);
		});
		
		//监听工具条
		table.on('tool(msgbase_table)',function(obj){
			var data = obj.data; //获得当前行数据
			var layEvent = obj.event; //获得 lay-event 对应的值
			var tr = obj.tr; //获得当前行 tr 的DOM对象
			if(layEvent === 'edit'){
				window.parent.processingCode = data.processingCode;
				var index = parent.layer.getFrameIndex(window.name);
				parent.layer.iframeSrc(index, 'views/processingcode.html');
				
			}
			
		});
	})
	
	
	//------------------------内部方法------------------------
	/* 获得查询的报文 */
	function  getTableData(condition){
		if(condition){}
		var data = [];
		try{
			var indexFiles = msgbase.findMess(condition);
			if(indexFiles==""){
				return data;
			}
			var index = JSON.parse(indexFiles);
			for(apptype in index){
				var backnames =  index[apptype];
				for(backname in backnames){
					var back = {};
					if(condition){
						if(condition['APPTYPE']!=""&&condition['APPTYPE']!= apptype){
							continue;
						}
						if(condition['backname']!=""&&condition['backname']!= backname){
							continue;
						}
					}
					back['APPTYPE'] = apptype;
					back['backname'] = backname;
					back['length'] = backnames[backname]['length'];
					back['bitmap'] = backnames[backname]['bitmap'];
					back['def'] = backnames[backname]['def'];
					back['processingCode'] = backnames[backname]['processingCode'];
					data.push(back);
				}
			}
			
			console.info(data);
		}catch (e){
			console.error(e);
			return data;
		}
		return data;
	}


	
	
});