void function(){
	const fs = require("fs");
	var path = './src/p_port/msgbase/base/';
	
	var indexPath = './src/p_port/msgbase/base/index.js';
	//定义msg对象
	function msgback(length,head,bitmap,fields,backname,def){
		this.length = length,
		this.head = head,
		this.bitmap = bitmap,
		this.fields = fields,
		this.backname = backname,
		this.def = def
	};
	//增、删、打开接口
	exports.operateMessbase = function(msgback,type){
		if(type=="add"){
			addMess(msgback);
		}else if("modify"==type){
			//modifyMess(msgback);
		}else if("del"==type){
			delMess(msgback);
		}else if("open"==type){
			var data = openFile(msgback);
			return data;
		}else if('findDefault' == type){
			return findDefault(msgback);
		}
	}
	//查询接口,返回按条件查找出来的文件名
	exports.findMess = function(condition){
		//var filenames = [];
		//同步读取,不然可能返回空的文件列表;
		var index = fs.readFileSync(indexPath,'utf-8');
		  // files.forEach( function (file){
			   // //console.log( file );
			   // if(file.substring(file.lastIndexOf("."))==".txt"){
				   // var filename = file.substring(0,file.lastIndexOf("."));
				   // filenames.push(filename);
			   // }  
		   // });
		
		return index;
	}
	exports.msgback = msgback;
	//生成索引接口
	exports.bulidIndex = bulidIndex;
	//修改接口
	exports.modifyBase = modifyMess;
	//导入接口
	exports.importBase = importBase;
	//----------------------------我是内部方法分界线--------------------------------------------------
	/* 增加返回报文文件 */
	function addMess(msgback){
		if(!msgback){
			console.error("msgback未定义");
			return;
		}
		var file_name = msgback.head.APPTYPE+"_"+msgback.backname+".txt";
		var file_text = JSON.stringify(msgToJson(msgback));
		//writeFile会将整个内容全部加载到缓冲区，然后全部写入，不太好。
		fs.writeFile(path+file_name,file_text, function (err){
			 if (err) {
			   return console.error(err);
			}
			console.log("数据写入成功！");
		});
		addIndex(msgback);

	}
	
	/* 删除报文库文件 */
	function delMess(msgback){
		if(!msgback){
			console.error("msgback未定义");
			return;
		}
		var file_name = msgback.head.APPTYPE+"_"+msgback.backname+".txt";
		fs.unlinkSync(path+file_name); 
		console.log("文件删除成功！");
		delIndex(msgback);
	}
	
	/* 修改报文库文件 */
	function modifyMess(oldMess,newMess){
		if(!oldMess||!newMess){
			console.error("修改报文库信息不全");
			return;
		}
		delMess(oldMess);
		addMess(newMess);
		console.info("修改成功");
	}
	/* 将msgback转化为json,去掉不需要的值 */
	function msgToJson(msgback){
		var newJson = {};
		newJson['length'] = msgback.length;
		newJson['head'] = msgback.head;
		newJson['bitmap'] = msgback.bitmap;
		newJson['fields'] = msgback.fields;
		return newJson;
	}
	/* 读取指定的文件，返回字符串 */
	function openFile(msgback){
		if(!msgback){
			console.error("msgback未定义");
			return;
		}
		var file_name = msgback.head.APPTYPE+"_"+msgback.backname+".txt";
		var data = fs.readFileSync(path+file_name,'utf-8');
		return data;
	}
	/* 导入报文库 */
	function importBase(dirs){
		var readStream, writeStream ; 
		dirs.forEach(function(filePath){
			 fs.stat(filePath,function(err,stats){
				 if(err){
					 console.error(err);
				 }
				 //是否为文件
				 if(stats.isFile()){
					 var fileName = filePath.substring(filePath.lastIndexOf('\\')+1);
					 //创建读取流
					 var readStream = fs.createReadStream(filePath);
					 //创建写入流
					 var writeStream = fs.createWriteStream(path+fileName);
					// 通过管道来传输流
					readStream.pipe(writeStream);
				 }
			 });
		});

	}
	
	
	//--------------------------索引的方法----------------------------------
	/* 重新生成索引 */
	function bulidIndex(){
		//存储默认配置信息
		var oldDefault = {};
		//无论是否发生错误，都会生成索引
		try{
			var index = fs.readFileSync(indexPath,'utf-8');
			if(index!=""){
				index = JSON.parse(index);
				for(var apptype in index){
					for(var backname in index[apptype]){
						if(index[apptype][backname]['def'] == true){
							oldDefault[apptype] = backname;
						}
					}
				}
			}
		}catch (e){
			console.error(e);
		}finally{
		//读取所有文件，并添加默认值
		var newIndex = {};
		var files = fs.readdirSync(path); 
		  files.forEach( function (file){
			   //console.log( file );
			   if(file.substring(file.lastIndexOf("."))==".txt"){
					var data = fs.readFileSync(path+file,'utf-8');
					data = JSON.parse(data);
					var filename = file.substring(0,file.lastIndexOf("."));
					var apptype =  filename.split('_')[0];
					var backname =  filename.split('_')[1];
					if(!newIndex[apptype]){ 
						newIndex[apptype] ={};
					}
					var value = {};
					value['length'] = data['length'];
					value['bitmap'] = data['bitmap'];
					value['processingCode'] = data['fields']['3'];
					if(oldDefault[apptype] == backname){
						value['def'] = true;
					}
					newIndex[apptype][backname] = value;	
			   }  
		   });
		 writeIndexFile(indexPath,JSON.stringify(newIndex),'索引生成成功');
		
		}
		
	}
	/* 增加索引 */
	function addIndex(msgback){
		var index = fs.readFileSync(indexPath,'utf-8');
		if(index!=""){
			index = JSON.parse(index);
		}else{
			index = {};
		}
		var apptype = msgback.head.APPTYPE;
		if(index[apptype]){
			if(index[apptype][msgback.backname]){
				console.info('返回名称重复');
				return;
			}
		}else{
			index[apptype] = {};
		}
		var data = {};
		data['length'] = msgback.length;
		data['bitmap'] = msgback.bitmap;
		
		//判断是否是默认值
		if(msgback.def==true){
			index[apptype] = delDefault(index[apptype]);
			data['def'] = true;
		}
		//交易处理码
		data['processingCode'] = msgback['fields']['3'];
		
		index[apptype][msgback.backname] = data;

		writeIndexFile(indexPath,JSON.stringify(index),'索引添加成功');
	}
	/* 修改索引 */
	function editIndex(){
		
	}
	/* 删除索引 */
	function delIndex(msgback){
		var index = fs.readFileSync(indexPath,'utf-8');
		if(index!=""&&index!=null){
			index = JSON.parse(index);
		}else{
			return;
		}
		if(!(msgback.backname&&msgback.head.APPTYPE)){
			console.info('删除信息错误');
		}
		delete index[msgback.head.APPTYPE][msgback.backname];
		writeIndexFile(indexPath,JSON.stringify(index),'索引删除成功');
	}
	
	/* 索引重新写入 */
	function writeIndexFile(path,string,showlog){
		// fs.writeFile(path,string, function (err){
			 // if (err) {
				 // alert('索引写入失败');
			   // return console.error(err);
			// }
			// console.log(showlog);
		// });
		fs.writeFileSync(path,string);
		console.log(showlog);
	}
	
	/* 删除消息类型的所有默认值 */
	function delDefault(apptype){
		for(var backname in apptype){
			delete apptype[backname]['def'];
		}
		return apptype;
	}
	/* 查找消息类型的返回名称的默认值 */
	function findDefault(msgBackInfo){
		var apptype = msgBackInfo.head.APPTYPE;
		var processingCode = msgBackInfo['fields']['3'];
		var index = fs.readFileSync(indexPath,'utf-8');
		if(index!=""){
			index = JSON.parse(index);
		}else{
			index = {};
		}
		
		for(var backname in index[apptype]){
			if(index[apptype][backname]['processingCode'] == processingCode){
				var data = fs.readFileSync(path+apptype+"_"+backname+'.txt','utf-8');
				data = JSON.parse(data);
				var  msg = new msgback(data['length'],data['head'],data['bitmap'],data['fields']);

				return msg;
			};
		}
		
	}
	
	
}()