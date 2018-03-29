$(function(){
	var msgbase = window.parent.require('./msgbase/msgbase.js');
	var fieldsConfigMap = window.parent.require('./message/mess_unpack.js');
	fieldsConfigMap =  fieldsConfigMap.fieldsConfigMap;
	var log = window.parent.require('./log.js');
	
	var headFieldMap = window.parent.require('./message/mess_unpack.js').headFieldMap;
	//保存
	$("#submit").click(function(){
		if($("#bitmap").val()==""||$("#backname").val()==""){
			return;
		}
		var msgback = new msgbase.msgback(
			null,
			getMscHead(),
			getFieldsId(),
			getFields(),
			$("#backname").val(),
			$("#def")[0].checked
		);
		msgbase.operateMessbase(msgback,'add');
		//iframe切换
		var index = parent.layer.getFrameIndex(window.name);
		parent.layer.iframeSrc(index, 'views/operatemsg.html');
		log.setLog("新增报文保存成功");
	});	
	//返回
	$("#back").click(function(){
		var index = parent.layer.getFrameIndex(window.name);
		parent.layer.iframeSrc(index, 'views/operatemsg.html');
	});	

	/* 重新加载表格 */
	layui.use('table', function(){
		var table = layui.table;
		//位图改变事件
		$("#bitmap").on('input', function(){
			//console.info("change");
			table.reload('fields',{
				data: getTableData(fieldsConfigMap)
			});
		});
		table.reload('commHeadField',{
			data: (function(){
					var data = [];
					var head = headFieldMap;
					head.forEach(function(field){
						data.push(field);
					});
					return data;
			})()
		});
		
	})
	
	//------------------------内部方法------------------------
	
	/* 通过位图获得域的值 */
	function  getTableData(fieldsConfigMap){
		var data = [];
		var bitmap = $("#bitmap").val();
		var fieldsId = bitmap.split(',');
		$("#bitmap_mess").text("");
		var undefinedMess = "";
		for(var i = 0;i<fieldsId.length;i++){
			if(!fieldsConfigMap[fieldsId[i]]){
				console.info(fieldsId[i]+"域未定义");
				undefinedMess = undefinedMess ==""?fieldsId[i]:(undefinedMess+","+fieldsId[i]);
				continue;
			}
			data.push(fieldsConfigMap[fieldsId[i]]);
		}	
		if(undefinedMess!=""){		
			$("#bitmap_mess").text(undefinedMess+" 域未定义");
		}
		return data;
	}

	
	/* 获得表格中的数据 */
	function getFields(){
		var fieldsJ = {};
		var table = layui.table;
		var fields = table.cache.fields;
		for(var i = 0;i<fields.length;i++){
			fieldsJ[fields[i].id] = fields[i].value;
		}
		return fieldsJ;
	}
	/* 获得报文头的信息 */
	function getMscHead(){
		var head = {};
		var table = layui.table;
		var headvalue = table.cache.commHeadField;
		for(var i = 0;i<headvalue.length;i++){
			if(headvalue[i].value){
				head[headvalue[i].mapping] = headvalue[i].value;
			}
		}
		return head;
	}
	/* 获得表格中的位图 */
	function getFieldsId(){
		var fieldsIds = "";
		var table = layui.table;
		var fields = table.cache.fields;
		for(var i = 0;i<fields.length;i++){
			fieldsIds = fieldsIds==""?fields[i].id:fieldsIds+","+fields[i].id;
		}
		return fieldsIds;
	}
});