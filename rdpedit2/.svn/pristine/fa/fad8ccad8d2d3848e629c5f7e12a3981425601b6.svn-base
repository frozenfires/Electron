$(function(){
	/* 增加和修改界面 */
	var defaultConfig = window.parent.require('./message/cn8583Config.js');
	var configDeal = window.parent.require('./message/configDeal.js');
	var definedConfig = null;
	var mess_unpack = window.parent.require('./message/mess_unpack.js');
	try{
		definedConfig = configDeal.loadConfigByName(window.parent.configName);
	}catch(e){
		//修改配置加载失败返回
		alert("读取配置文件出错,请检查是否有该文件名");
		var index = parent.layer.getFrameIndex(window.name);
		parent.layer.iframeSrc(index, 'views/configIndex.html');
		return;
	}
	//definedConfig不为空则为修改界面
	var loadConfig = definedConfig||defaultConfig;
	

	//保存
	$("#submit").click(function(){
		//判断修改还是增加
		if(definedConfig){
			//修改配置
			var data = getConfigData();
			var filename = $("#filename").val();
			if(!filename||filename.trim()==""){
				return;
			}
			configDeal.editConfig(window.parent.configName,filename,data,function(){
				mess_unpack.refreshConfig();
			});
			window.parent.configName = undefined;//将configName置空,才能判断增加与修改
		}else{
			//增加配置
			var data = getConfigData();
			var filename = $("#filename").val();
			if(!filename||filename.trim()==""){
				return;
			}
			configDeal.saveConfig(filename,data);
		}
		
		
		//iframe切换
		var index = parent.layer.getFrameIndex(window.name);
		parent.layer.iframeSrc(index, 'views/configIndex.html');
	});	
	//返回报文库界面
	$("#back").click(function(){
		var index = parent.layer.getFrameIndex(window.name);
		parent.layer.iframeSrc(index, 'views/configIndex.html');
	});	

	/* 重新加载表格 */
	layui.use('table', function(){
		//填充配置名
		if(definedConfig){
			$("#filename").val(window.parent.configName);
		}
		var table = layui.table;
		var config = loadConfig.cn8583Config;
		table.reload('commHeadField',{
			data: fillCommHeadField(config)
			});
		table.reload('fields',{
				data: fillFields(config)
			});
		table.reload('appFieldsConfig',{
				data: fillAppFieldsConfig(config)
			});
		//交易类别差异增加
		$("#appFieldsConfig_add").click(function(){
			var appFieldsConfig = table.cache.appFieldsConfig;
			appFieldsConfig.push({});
			table.reload('appFieldsConfig',{
					data: appFieldsConfig
				});
		});
		//报文头增加
		$("#commHeadField_add").click(function(){
			var commHeadField = table.cache.commHeadField;
			commHeadField.push({'id':commHeadField.length+1});
			table.reload('commHeadField',{
				data: commHeadField
			});
		});
	})
	
	

	//------------------------内部方法------------------------
	/* 获得报文头的配置信息 */
	function fillCommHeadField(config){
		var data = [];
		var head = config['commHeadField'];
		for(var i = 0;i<head.length;i++){
			head[i]['id'] = i+1;
			data.push(head[i]);
		}

		return data;
	}
	/* 获得域的配置信息 */
	function fillFields(config){
		var data = [];
		var fields = config['fields'];
		var fieldindex = 0;
		for(var i=2;i<=128;i++){
			//判断配置文件是否有该域
			if(!fields[fieldindex]||fields[fieldindex]['id'] != i){
				data.push({id:i});
				continue;
			}
			data.push(fields[fieldindex]);
			fieldindex++;
		}

		return data;
	}
	/* 获得交易类别差异字段配置信息 */
	function fillAppFieldsConfig(config){
		var data =[];
		var appConfig =config['appFieldsConfig'];
		for(var apptype in appConfig){
			if("object" == typeof(appConfig[apptype])){
				for(var field in appConfig[apptype]){
					appConfig[apptype][field]['APPTYPE'] = apptype;
					data.push(appConfig[apptype][field]);
				}
			}
		}
		return data;
	}
	

	/* 获得表格中的数据 */
	function getTableFields(tableName){
		var fieldsJ = {};
		var table = layui.table;
		var fields = table.cache[tableName];
		for(var i = 0;i<fields.length;i++){
			fieldsJ[fields[i].id] = fields[i].value;
		}
		return fieldsJ;
	}

	/* 获得表格中的数据,返回json对象 */
	function getConfigData(){
		var config = {};
		var cache = layui.table.cache;
		//获得报文头的表格数据
		var commHeadField = cache.commHeadField;
		commHeadField = filtJsonFields(commHeadField,['LAY_TABLE_INDEX']);
		//获得域的表格信息
		var fields = cache.fields;
		fields = filtJsonFields(fields,['LAY_TABLE_INDEX']);
		//获得交易类别差异表格信息
		var appFieldsConfig = cache.appFieldsConfig;
		//appFieldsConfig = filtJsonFields(appFieldsConfig,['LAY_TABLE_INDEX']);
		var app = {};
		appFieldsConfig.forEach(function(appfiled){
			var type = appfiled['APPTYPE'];
			if(type){
				delete appfiled.APPTYPE;
				delete appfiled.LAY_TABLE_INDEX;
				if(!app[type]){
					app[type]={};
				}
				app[type][appfiled.id] = appfiled;
			}
			
		});
		appFieldsConfig = app;
		config['headerLength'] = 4;
		config['commHeadField'] = commHeadField;
		config['appFieldsConfig'] = appFieldsConfig;
		config['fields'] = fields;
		return config;
		
	}
	
	/* 去掉json数组中不需要的字段 并去掉数据类型或长度为空的域*/
	function filtJsonFields(jsonArray,fieldArray){
		var data=[];
		for(var j =0;j<jsonArray.length;j++){
			var json = jsonArray[j];
			if(!(json['length']&&json['datatype'])||(json['length'].trim()==""||json['datatype'].trim()=="")){
				continue;
			}
			for(var i = 0;i<fieldArray.length;i++){
				delete json[fieldArray[i]];
			}
			data.push(json);
		}
		// jsonArray.forEach(function(json){
			// if(json['length']&&json['datatype']){
				
			// }
			// for(var i = 0;i<fieldArray.length;i++){
				// delete json[fieldArray[i]];
			// }
		// })
		return data;
	}
	
	
	
	
	
	
});