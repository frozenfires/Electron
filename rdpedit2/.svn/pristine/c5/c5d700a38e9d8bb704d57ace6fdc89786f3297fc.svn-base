(function(){

var fs = require("fs");
var path ='./src/p_port/message/config/';
var log = require("../log.js");

//
exports.loadConfig = loadConfig;
//
exports.findConfigFiles = findConfigFiles;
//
exports.loadConfigByName = loadConfigByName;
//
exports.saveConfig = saveConfig;
//
exports.editConfig = editConfig;
//
exports.delConfig = delConfig;
//
exports.defaultName = defaultName;
//
exports.setDefault = setDefault;

/* 设置当前配置文件 */
function setDefault(filename,callback){
	filename = chineseToCharCode(filename);
	fs.writeFile('./src/p_port/message/default.txt',filename,function(err){
		if(err){
			log.setLog("设置当前配置文件失败");
			return console.error(err);
		}
		log.setLog("设置当前配置文件成功");
		console.log("设置当前配置文件成功");
		callback();
	});
}
/* 读取当前配置文件名 */
function defaultName(){
	var data = fs.readFileSync('./src/p_port/message/default.txt','utf-8');
	return data;
}
/* 删除配置文件 */
function delConfig(filename){
	try{
		filename = chineseToCharCode(filename);
		fs.unlinkSync(path+filename+'.js');
	}catch(e){
		return console.error(e);
	}
}
/* 修改配置文件 */
function editConfig(oldfile,newfile,data,callback){
	try{
		oldfile = chineseToCharCode(oldfile);
		fs.unlinkSync(path+oldfile+'.js');
		newfile = chineseToCharCode(newfile);
		var start = "void function(){\n var cn8583Config =";
		var end = ";\n exports.cn8583Config = cn8583Config;}();";
		var filetxt = start+JSON.stringify(data)+end;
		fs.writeFile(path+newfile+'.js',filetxt,function(err){
			if(err){
				log.setLog("配置文件修改失败");
				return console.error(err);
			}
			log.setLog("配置文件修改成功");
			console.log("配置文件修改成功");
			//刷新配置文件
			callback();
		});
	}catch(e){
		console.error("配置文件修改失败"+e);
	}
}
/* 保存配置文件 */
function saveConfig(filename,data){
	var start = "void function(){\n var cn8583Config =";
	var end = ";\n exports.cn8583Config = cn8583Config;}();";
	var filetxt = start+JSON.stringify(data)+end;
	filename = chineseToCharCode(filename);
	fs.writeFile(path+filename+'.js',filetxt,function(err){
		if(err){
			log.setLog("配置文件保存失败");
			return console.error(err);
		}
		log.setLog("配置文件保存成功 filename:"+filename);
		console.log("配置文件保存成功");
	});
}
/* 读取当前配置文件 */
function loadConfig(){
	var data = fs.readFileSync('./src/p_port/message/default.txt','utf-8');
	try{
		//delete require.cache[require.resolve('./config/'+data+'.js')];
		var config = require('./config/'+data+'.js');
		return config.cn8583Config;
	}catch(e){
		console.error("当前配置文件读取失败");
		return null;
	}
}
	
/* 查找自定义配置文件名 */
function findConfigFiles(){
		var files;
		try{
			files = fs.readdirSync(path);	
		}catch(e){
			console.log("创建目录");
			fs.mkdir(path,function(err){
				if (err) {
					return console.error(err);
				}
				console.log("目录创建成功。");
			});
			return console.error(err);	
		}
		return files;
}

/* 通过配置文件名加载配置 */
function loadConfigByName(cNname){
	if(!cNname){
		return null;
	}
	var fileName = chineseToCharCode(cNname);
	try{
		//清掉require缓存
		delete require.cache[require.resolve('./config/'+fileName+'.js')];
		var configcname = require('./config/'+fileName+'.js');
		return configcname;
	}catch(e){
		log.setLog("读取配置文件出错,请检查是否有该文件名");
		console.error("读取配置文件出错");
		throw e;
	}
}

/* 中文转为编码 */
function chineseToCharCode(cn){
	var str = "";
	for(var i=0;i<cn.length;i++){
		if(str==""){
			str += cn.charCodeAt(i);
		}else{
			str = str+"_"+cn.charCodeAt(i);
		}
	}
	return str;
}





	
})()









