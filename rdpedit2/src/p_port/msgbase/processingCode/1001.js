function process(receiveFields,backFields){
//自定义返回报文处理方法
//receiveFields,backFields分别为上送报文域的内容和默认返回报文域的内容
//返回处理后的返回报文域
//使用node.js语言
	backFields['15'] = '123456789';
	backFields['52'] = '8888';
	var i = 1;
	while(i++<10){
		alert(receiveFields[i]);
	}
	return backFields;
}