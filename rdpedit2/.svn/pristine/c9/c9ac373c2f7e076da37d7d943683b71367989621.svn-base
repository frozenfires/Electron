(function(){

	var processing = parent.require('./msgbase/processing.js');
	var monacoEditor;
	//设置插件路径
	require.config({ paths: { 'vs': '../../node_modules/monaco-editor/min/vs' } });
	//读取文件内容
	var fileContent = processing.loadProcessingCode(window.parent.processingCode);
	//绑定对象
	require(['vs/editor/editor.main'], function () {
		//container为要绑定的对象
		monacoEditor = monaco.editor.create(document.getElementById('container'), {
			value: fileContent,
			theme : "vs-dark",
			language: 'javascript'
		});
	});
	//自适应宽度
			window.onresize = function () {
				if (monacoEditor) {
					monacoEditor.layout();
				}
			};
	//保存
	$("#save").click(function(){
		var processingCodeName = window.parent.processingCode+'.js';
		processing.saveProcessingCode(processingCodeName,monacoEditor.getValue());
		var index = parent.layer.getFrameIndex(window.name);
		parent.layer.iframeSrc(index, 'views/operatemsg.html');
	});
	//取消
	$('#cancel').click(function(){
		var index = parent.layer.getFrameIndex(window.name);
		parent.layer.iframeSrc(index, 'views/operatemsg.html');
	});
	//重置
	$('#reset').click(function(){
		parent.layer.confirm('确定重置?', function(index){
			var template = processing.getTemplate();
			monacoEditor.setValue(template);
			parent.layer.close(index);
		});
	});
	
})()