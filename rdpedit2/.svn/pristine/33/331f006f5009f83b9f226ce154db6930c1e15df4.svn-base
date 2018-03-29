 (function(){


/**
 * 获取url参数
 * @return {json} url参数
 */
exports.getUrlParams = function(){
    return _parseUrlToJson(location.search.substr(1));
}

/**
 * 将url参数转换为json
 * @param {string} url url字符串
 * @return {json} json数据
 */
exports.parseUrlToJson = function(url){
    return _parseUrlToJson(url);
}

/**
 * 字符串转为16进制
 */
exports.stringToHex = function(str){
    return _stringToHex(str);
}

/**
 * 16进制转为字符串
 */
exports.hexToString = function(hex){
    return _hexToString(hex);
}

//----------------------------内部方法分界线--------------------------------------------------

function _parseUrlToJson(url){
	var ret = {};
    try{
        var params = url.split('&');
        for(var i=0; i<params.length; i++){
            var keyvalue = params[i].split('=');
            ret[keyvalue[0]] = keyvalue[1];
        }
    }catch(e){
        console.error(e);
    }
    return ret;
}

function _getUrlParams(){
    return _parseUrlToJson(location.search.substr(1));
}
 

function _stringToHex(str) {
    var val = "";
    for (var i = 0; i < str.length; i++) {
    	val += (str.charCodeAt(i)).toString(16);
    }
    return val;
}

function _hexToString(hex) {
    var val = "";
    for (i = 0; i < hex.length; i += 2) {
        val += String.fromCharCode('0x' + hex.charAt(i) + hex.charAt(i + 1)); //fromCharCode接收指定的unicode值，返回一个字符串
    }
    return val;
}


})();