(function(){

	const mess_unpack = require('./message/mess_unpack.js');
	const net = require('net');
	const { StringDecoder } = require('string_decoder');
	var EventEmitter = require('events').EventEmitter; 
	var event = new EventEmitter(); 
	var log = require('./log.js');
	//const StringDecoder = require('string_decoder');
	//创建服务器
	exports.creatServer = creatServer;
	
	
	//----------------------------内部方法分界线--------------------------------------------------
	function creatServer(host,port,callback){
		
		// 创建一个TCP服务器实例，调用listen函数开始监听指定端口
		// 传入net.createServer()的回调函数将作为”connection“事件的处理函数
		// 在每一个“connection”事件中，该回调函数接收到的socket对象是唯一的
		var server = net.createServer(function(sock) {

			// 我们获得一个连接 - 该连接自动关联一个socket对象
			console.log('CONNECTED: ' +
				sock.remoteAddress + ':' + sock.remotePort);
			log.setLog('CONNECTED: ' +
				sock.remoteAddress + ':' + sock.remotePort);
			// 为这个socket实例添加一个"data"事件处理函数
			sock.on('data', function(data) {
				//将Buffer以utf8读取出来
				const decoder = new StringDecoder('utf8');
				data = decoder.write(data);
			log.setLog("收到报文，正在解析-------");
					var mess = mess_unpack.decode(data);
					console.info(mess);
					log.setLog("解析成功,报文类型"+mess.head.APPTYPE);
					
					//使用回调函数
					callback(mess,function(backmess){
						log.setLog("返回报文");
						sock.write(backmess);
					});
					
			});

			// 为这个socket实例添加一个"close"事件处理函数
			sock.on('close', function(data) {
				console.log('CLOSED: ' +
					sock.remoteAddress + ' ' + sock.remotePort);
			});

		}).listen(port, host);

		return server;
		
/* 		//创建客户端
		var client  = new net.Socket();
		client.connect(PORT,HOST,function(){
			console.log('CONNECTED TO: ' + HOST + ':' + PORT);
			// 建立连接后立即向服务器发送数据，服务器将收到这些数据 
			client.write('hello server');
		});
		// 为客户端添加“data”事件处理函数
		// data是服务器发回的数据
		client.on('data',function(data){
			console.log('DATA: ' + data);
			client.destory();
		});
		// 为客户端添加“close”事件处理函数
		client.on('close', function() {
			console.log('Connection closed');
		}); */

	}
	/**
	*收到消息
	*/
	function receive(data){
		console.log('DATA ' + sock.remoteAddress + ': ' + data);
		
	}
	/**
	*发送消息
	*/
	function sendMess(sock,backmess){
		// 回发该数据，客户端将收到来自服务端的数据
		sock.write(backmess);
	}
})()