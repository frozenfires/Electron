$(function(){
	
	var log = window.parent.require('./log.js');
	var fs = window.parent.require('fs');
	var configDeal = window.parent.require('./message/configDeal.js');
	var mess_unpack = window.parent.require('./message/mess_unpack.js');
	//增加配置
	$("#add").click(function(){
		window.parent.configName = null;
		//iframe切换
		var index = parent.layer.getFrameIndex(window.name);
		parent.layer.iframeSrc(index, 'views/editconfig.html');
	});	

	//修改
	$("#modify").click(function(){
		//iframe切换
		var index = parent.layer.getFrameIndex(window.name);
		var table = layui.table;
		var rows = table.checkStatus('config_table').data; 
		if(rows.length!=1){
			alert("请选择一项内容修改");
			return;
		}
		window.parent.configName = rows[0].name;
		parent.layer.iframeSrc(index, 'views/editconfig.html');
		
	});	
	//重置
	$("#reset").click(function(){
		var callback = function(){
			var table = layui.table;
			table.reload('config_table',{
				data: getTableData()
			});
			mess_unpack.refreshConfig();
		}
		configDeal.setDefault('',callback); 
	});

	/* 重新加载表格 */
	layui.use('table', function(){
		var table = layui.table;
		//开始时加载
		table.reload('config_table',{
				data: getTableData()
			});
			
			
		//监听工具条
		table.on('tool(config_table)', function(obj){ //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
		  var data = obj.data; //获得当前行数据
		  var layEvent = obj.event; //获得 lay-event 对应的值
		  var tr = obj.tr; //获得当前行 tr 的DOM对象
		 
		  if(layEvent === 'add'){ //增加
			window.parent.configName = null;
			//iframe切换
			var index = parent.layer.getFrameIndex(window.name);
			parent.layer.iframeSrc(index, 'views/editconfig.html');
			
		  } else if(layEvent === 'del'){ //删除
			layer.confirm('你真的确定吗！', function(index){
				configDeal.delConfig(data.name);
				var table = layui.table;
				table.reload('config_table',{
					data: getTableData()
				});
				layer.close(index);
			});
		  } else if(layEvent === 'edit'){ //编辑
			//iframe切换
			var index = parent.layer.getFrameIndex(window.name);
			var table = layui.table;
			
			window.parent.configName = data.name;
			parent.layer.iframeSrc(index, 'views/editconfig.html');
		  }else if(layEvent === 'setdef'){//设为当前配置报文
			  var callback = function(){
				  var table = layui.table;
					table.reload('config_table',{
						data: getTableData()
					});
					
					mess_unpack.refreshConfig();
			  }
			  configDeal.setDefault(data.name,callback); 
		  }
		});
			

	});
	
	//------------------------内部方法------------------------
//表格中填充数据
	function getTableData(callback){
		var data = [];
		var files = configDeal.findConfigFiles();
		//读取当前配置文件名
		var defaultname = configDeal.defaultName();
		files.forEach(function(file){
			file = file.substring(0,file.lastIndexOf("."));
			var name = charCodeToChinese(file);
			if(file == defaultname){
				data.push({'name':name,'def':"是"});
			}else{
				data.push({'name':name});
			}
		});
		return data;
	}
	
/* 将字符编码转为中文或其他字符 */
function charCodeToChinese(string){
	var name = "";
	var strArr = string.split('_');
	for(var i = 0;i<strArr.length;i++){
		var cn = String.fromCharCode(strArr[i]);
		name += cn;
	}
	return name;
}
	
	
})