$(function(){
	var msgbase = window.parent.require('./msgbase/msgbase.js');
	var fieldsConfigMap = window.parent.require('./message/mess_unpack.js');
	fieldsConfigMap =  fieldsConfigMap.fieldsConfigMap;
	
	var headFieldMap = window.parent.require('./message/mess_unpack.js').headFieldMap;
	//保存
	$("#submit").click(function(){
		var newMsgback = new msgbase.msgback(
			null,
			getMscHead(),
			getFieldsId(),
			getFields(),
			$("#backname").val(),
			$("#def")[0].checked
		);
		msgbase.modifyBase(window.parent.msgback,newMsgback);
		//iframe切换
		var index = parent.layer.getFrameIndex(window.name);
		parent.layer.iframeSrc(index, 'views/operatemsg.html');
	});	
	//返回报文库界面
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
		loadData(window.parent.msgback,table);
		
	})
	//首次加载时填充数据
	function loadData(msgback,table){
		$("#backname").val(msgback.backname);
		$("#bitmap").val(msgback.bitmap);
		//加载报文头
		table.reload('commHeadField',{
			data: (function(){
					var data = [];
					var head = headFieldMap;
					//判断是否匹配
					var isMatch = true;
					var headlength = 0;
					for(var key in msgback.head){
						headlength++;
					}
					if(headlength!=head.length){
						isMatch = false;
					}
					head.forEach(function(field){
						field['value'] = msgback.head[field.mapping];
						if(!msgback.head[field.mapping]){
							isMatch = false;
						}
						data.push(field);
					});
					if(!isMatch){
						layer.alert('报文头不匹配！该返回报文报文头与当前配置不匹配', {icon: 2});
					}
					return data;
			})()
		});
		if(msgback.def){
			$("#def")[0].checked = true;
			layui.use('form', function(){
			  var form = layui.form;
			  form.render('checkbox');
			});
		}	
		table.reload('fields',{
				data: getTableDataFields(fieldsConfigMap,msgback.fields)
			});
	}
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

	/* 获得读取的报文获得域的值 */
	function  getTableDataFields(fieldsConfigMap,fields){
		var data = [];
		
		for(var id in fields){
			if(!fieldsConfigMap[id]){
				console.info(id+"域未定义");
				continue;
			}
			fieldsConfigMap[id]['value'] = fields[id];
			data.push(fieldsConfigMap[id]);
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