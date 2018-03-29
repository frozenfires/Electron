(function(){

	var log="";
	exports.setLog = function setLog(log){
		log = log;
		var info = $("#screen").html();
		$("#screen").html(info+"<br/>"+log);
		var div = $("#screen")[0];
		div.scrollTop = div.scrollHeight;
	}
	exports.getLog = function getLog(){
		return log;
	}
	
})()