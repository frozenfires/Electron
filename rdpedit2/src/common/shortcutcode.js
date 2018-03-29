(function(){
	var that = exports;
	/**
	 * [ShortcutCode 定义快捷键]
	 * @type {Object}
	 * F11 和 Ctrl+F12 是主进程的快捷键，不能再定义啦
	 */
	var ShortcutCode = {
       //Monaco 中定义的快捷键
        "001" : {
		    desc : "查找下一个",
		    label : "F3"
		},
		"002" : {
		    desc : "查找",
		    label : "Ctrl+F"
		},
		"003" : {
		    desc : "查找下一个选中",
		    label : "Ctrl+F3"
		},
		"004" : {
		    desc : "替换",
		    label : "Ctrl+H"
		},
        "005" : {
		    desc : "行缩进",
		    label : "Ctrl+]"
		},
		"006" : {
		    desc : "行减少缩进",
		    label : "Ctrl+["
		},
		"007" : {
		    desc : "切换行注释",
		    label : "Ctrl+/"
		},
		"008" : {
		    desc : "删除行",
		    label : "Ctrl+Shift+K"
		},
        "009" : {
		    desc : "查找文件",
		    label : "Ctrl+Shift+F"
		},
		"010" : {
		    desc : "查找上一个选中",
		    label : "Ctrl+Shift+F3"
		},
		 "012" : {
		    desc : "格式化代码",
		    label : "Ctrl+Alt+F"
		},
		"013" : {
		    desc : "查找上一个",
		    label : "Shift+F3"
		},
		"014" : {
		    desc : "查找所有引用",
		    label : "Shift+F12"
		},
		"015" : {
		    desc : "切换块注释",
		    label : "Shift+Ctrl+A"
		},
		"016" : {
		    desc : "向上复制行",
		    label : "Shift+Alt+Up"
		},
		"017" : {
		    desc : "向下复制行",
		    label : "Shift+Alt+Down"
		},
		"018" : {
		    desc : "查看定义",
		    label : "Alt+F12"
		},
		"019" : {
		    desc : "向上移动行",
		    label : "Alt+Up"
		},
		"020" : {
		    desc : "向下移动行",
		    label : "Alt+Down"
		},
		//自定义的快捷键
		"021" : {
		    desc : "刷新页面",
		    label : "F5"
		},
        "022" : {
		    desc : "保存",
		    label : "Ctrl+S"
		},
		"023" : {
		    desc : "保存所有",
		    label : "Ctrl+Shift+S"
		},
        "024" : {
		    desc : "关闭当前",
		    label : "Ctrl+W"
		},
		"025" : {
		    desc : "关闭所有",
		    label :"Ctrl+Shift+W",
		},
		"026" : {
		    desc : "前进",
		    label : "Ctrl+Q"
		},
		"027" : {
		    desc : "后退",
		    label :"Ctrl+A",
		},
		"028" : {
		    desc : "页面预览",
		    label :"Ctrl+B",
		},
		"029" : {
		    desc : "启动",
		    label :"Ctrl+Alt+1",
		},
		"030" : {
		    desc : "加密",
		    label :"Ctrl+Alt+2",
		},
		"031" : {
		    desc : "解密",
		    label :"Ctrl+Alt+3",
		},
		"032" : {
		    desc : "参数配置",
		    label :"Ctrl+Alt+4",
		},
		"033" : {
		    desc : "xml流程检测",
		    label :"Ctrl+Alt+5",
		},
		"034" : {
		    desc : "在线更新",
		    label :"Ctrl+Alt+6",
		},
		"035" : {
		    desc : "守护进程",
		    label :"Ctrl+Alt+7",
		},
	
	}

	that.getShortcutCode = function(code){
       return ShortcutCode[code].label;
    }

}())