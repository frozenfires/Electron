(function(){
	var fs = require("fs");
	var path = './src/p_port/msgbase/processingCode/';
	var log = require('../log.js');
	
	exports.dealMess = preprocess;
	exports.saveProcessingCode = saveProcessingCode;
	exports.loadProcessingCode = loadProcessingCode;
	exports.getTemplate = getTemplate;
	var template = fs.readFileSync('./src/p_port/msgbase/processTemplate.js','utf-8');
		
	/* 读取自定义处理方法并执行，返回处理后的返回报文 */
	function preprocess(mess,msgback){
		var filename = msgback['fields']['3'];
		//读取自定义处理方法
		try{
			var dealFunction = fs.readFileSync(path+filename+'.js','utf-8');
			log.setLog('已找到自定义方法代码，正在运行----');
			dealFunction = new Function('return '+dealFunction)();
			msgback['fields'] = dealFunction(mess['fields'],msgback['fields']);
			log.setLog('自定义方法代码运行成功！');
		}catch(e){
			console.log("没有自定义处理方法或处理方法出错！返回默认报文");
			log.setLog('没有自定义处理方法或处理方法出错！返回默认报文');
			return msgback;
		}
		return msgback;
	}
	//保存自定义方法文件
	function saveProcessingCode(fileName,fileTxt){
		fs.writeFile(path+fileName,fileTxt, function (err){
			 if (err) {
			   return console.error(err);
			}
			console.log("自定义方法文件保存成功！");
		});
	}
	//读取自定义处理方法
	function loadProcessingCode(filename){
		try{
			var fileContent = fs.readFileSync(path+filename+'.js','utf-8');
			return fileContent;
		}catch(e){
			console.log('该交易处理码没有自定义方法文件，正在创建--');
			log.setLog('该交易处理码没有自定义方法文件');
			return template;
		}
	}
	
	function getTemplate(){
		return template;
	}
})()