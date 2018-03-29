(function(){


var cn8583Config = require("./cn8583Config.js").cn8583Config;
var binmap = {'0': '0000', '1': '0001', '2': '0010', '3': '0011', 
              '4': '0100', '5': '0101', '6': '0110', '7': '0111', 
              '8': '1000', '9': '1001', 
              'a': '1010', 'b': '1011', 'c': '1100', 'd': '1101', 'e': '1110', 'f': '1111'};
var binmapReverse = reverseMap(binmap);

/**
 * 默认8583模板
 */
var defaultTemplte = cn8583Config;
var templete8583 = require("./configDeal.js").loadConfig();
/* 当前模版导出 */
exports.fieldsConfigMap = decodeMapping(templete8583?templete8583.fields:defaultTemplte.fields);
/* 当前模版导出报文头 */
exports.headFieldMap = templete8583?templete8583.commHeadField:defaultTemplte.commHeadField;
/* 刷新当前模版设置 */
exports.refreshConfig = function(){
	//delete require.cache[require.resolve("./configDeal.js")];
	templete8583 = require("./configDeal.js").loadConfig();
	console.info(templete8583);
}

/**
 * 将对象按照8583规则序列化成16进制字符串
 */
exports.encode = function(msgobj){
    var templete = templete8583 || defaultTemplte;
    var fieldMapping = encodeMapping(templete.fields);
    console.info("----------------开始序列化8583报文, APPTYPE:"+msgobj.head.APPTYPE);
    console.info(msgobj);
    console.info(templete);
    // 计算各域的16进制表达
	var apptype = msgobj.head.APPTYPE;
    var _fields = {}, _indexarr = [];
    for(fieldName in msgobj.fields){
        var field = msgobj.fields[fieldName];
		var appfieldConf = templete.appFieldsConfig[apptype] ? templete.appFieldsConfig[apptype][fieldName] : undefined;
        var fieldConf = appfieldConf||fieldMapping[fieldName];
        try{
            var fieldHexValue = encodeField(fieldConf, field);
        }catch(e){
            console.info(fieldConf);
            console.info(fieldName);
            throw new Error(e);
        }

        _fields[fieldConf.id] = {name: fieldName, value: field, conf: fieldConf, hexvalue: fieldHexValue};
        _indexarr.push(fieldConf.id);
    }

    // console.debug('_fields=%o'+ jsonUtil.toString(_fields));
    console.info('域列表'+ JSON.stringify(_indexarr));

    // 计算位图
    _indexarr = _indexarr.sort(function(a, b){return a-b});
    var bitmap = buildBitmap(_indexarr);
    console.info("位图16进制：" + bitmap);

    var head = buildHead(msgobj.head, templete);
    console.info("head=" + head);
    var hexstr = head + bitmap + buildFieldHex(_indexarr, _fields);
    var length = build8583Length(templete.headerLength, hexstr.length);
    console.info(templete.headerLength);
    console.info(hexstr);
    console.info("----------------序列化8583报文结束, APPTYPE:"+msgobj.head.APPTYPE);
    console.debug(length + hexstr);
    return length + hexstr;
}

/**
 * 将8583格式的16进制字符串，解析成对象
 */
exports.decode = function(hexstr, templete){
	if(!hexstr){
		console.debug("报文为空");
		return;
	}
    console.info("----------------反序列化8583报文开始");
     var templete = templete8583 || defaultTemplte;
    console.info(templete);
    // 位置游标
    var cursor = {
        value : 0,
        add : function(offset){
            this.value+=offset;
        }
    };

    var length = hexstr.substring(cursor.value, cursor.value+templete.headerLength);
    cursor.add(length.length);
    var intLength = parseInt(length, 16) * 2;
    console.info("报文长度为:"+length+"," + intLength);

    var headObj = decodeHead(cursor, hexstr, templete.commHeadField);
	var apptype = headObj.APPTYPE || '';
    // 解析位图
    var bitmap = decodeBitmap(cursor, hexstr);
    // 解析各业务域
    var fields = {};
    var fieldMapping = decodeMapping(templete.fields);
    for(var i=0; i<bitmap.length; i++){
        var index = bitmap[i];
		var appfieldConf = templete.appFieldsConfig[apptype] ? templete.appFieldsConfig[apptype][index] : undefined;
        var fieldConf = appfieldConf||fieldMapping[index];
		try{
			if(fieldConf){
				var field = decodeField(cursor, hexstr, fieldConf);
				fields[fieldConf.id] = field;
			}else{
				console.info("解析错误,"+index+"域未定义");
			}
        }catch(e){
             console.info("解析"+index+"域错误" + e);
        }
    }

    console.info("----------------反序列化8583报文结束,APPTYPE:"+apptype);
    //定义报文对象
		var mess = new Object();
		mess.length = intLength;
		mess.head = headObj;
		mess.bitmap = bitmap;
		mess.fields = fields;
		
		return mess;
}



//-----------------私有方法分割线----------------------------------------------------

/**
 * 字符串转为16进制
 */
function stringToHex(str){
	var val="";
	for(var i=0;i<str.length;i++){
		if(val == "")
			val = str.charCodeAt(i).toString(16);
		else
			val += "" + str.charCodeAt(i).toString(16);
	}
	return val;
}

/**
 * 16进制转为字符串
 */
function hexToString(hex){
	var val = "";
	var arr = hex;
	for(i = 0;i<arr.length; i+=2){
		val += String.fromCharCode('0x'+arr.charAt(i)+arr.charAt(i+1));//fromCharCode接收指定的unicode值，返回一个字符串
	}
	return val;
}

/**
 * 16进制转为2进制字符串
 */
function hexToBinary (hexstr) {
    var binstr = "";
    for(var i=0; i<hexstr.length; i++){
        binstr += binmap[hexstr.charAt(i).toLowerCase()];
    }

    return binstr;
}

/**
 * 将map的key变成value，value变成key
 */
function reverseMap (srcmap) {
    var destmap = {};
    for(key in srcmap){
        destmap[srcmap[key]] = key;
    }
    return destmap;
}

/**
 * 计算encode时使用的mapping映射。
 */
function encodeMapping (fieldsConfig) {
    var mapping = {};
    for(var i=0; i<fieldsConfig.length; i++){
        mapping[fieldsConfig[i].id] = fieldsConfig[i];
    }

    return mapping;
}

/**
 * 计算decode时使用的mapping映射。
 
 */
function decodeMapping (fieldsConfig) {
    var mapping = {};
    for(var i=0; i<fieldsConfig.length; i++){
        mapping[fieldsConfig[i].id] = fieldsConfig[i];
    }

    return mapping;
}

/**
 * 按照配置将字段的值转换为16进制字符串
 */
function encodeField (fieldConf, fieldValue) {
    // console.debug("fieldConf=%o,fieldValue=%o", fieldConf, fieldValue);

    var type = "LLVAR,LLLVAR".indexOf(fieldConf.datatype);
    var strValue, hexValue;
    fieldValue=fieldValue+'';

	//判断Mac域，如果是Mac域则不作处理直接返回原值
	if(fieldConf.mac){
        strValue = fieldValue;
	}
    else if(type > -1){
        // 变长域

        var lenLength=type>0? 3: 2;
        var fieldlength = fieldValue.length + '';
        for(var i=0; i<lenLength-(fieldValue.length + '').length; i++){
            fieldlength = "0" + fieldlength;
        }
        // console.debug("变长域的长度为:"+fieldlength);
        strValue = fieldlength + fieldValue;
        fieldConf['bytelength'] = fieldlength;
    }else{
        // 定长域 数字域左补零，其他格式右补空格

        strValue = fieldValue;
        var left = fieldConf.datatype == 'NUMERIC' ? '0' : ' ';
        for(var i=0; i< fieldConf.length - fieldValue.length; i++){
            if(fieldConf.datatype == 'NUMERIC'){
                strValue = left + strValue;
            }else{
                strValue = strValue + left;
            }
        }
        fieldConf['bytelength'] = fieldConf.length;
    }

    fieldConf['stringvalue'] = strValue;
    hexValue = fieldConf.mac ? strValue : stringToHex(strValue);
    
    console.info(fieldConf.mapping + ":" + fieldValue + "--->" + 
        fieldConf.id + ":" + fieldConf['bytelength'] + "," + strValue + "," + hexValue);
    return hexValue;
}

/**
 * 将字段域解析为field对象
 */
function decodeField (cursorObj, hexstr, fieldConfig) {
    //console.debug(fieldConfig.datatype);
    var type = "LLVAR,LLLVAR".indexOf(fieldConfig.datatype);
    var strValue, hexValue, hexLength;
    var cursor = cursorObj.value;
    var fieldHexstr = hexstr.substring(cursor);
    if(type > -1){
        // 变长域
        type=type>0? 6: 4;
        var lengthstr = hexLength = hexstr.substring(cursor, cursor + type);
        cursorObj.add(type);
        hexLength = parseInt(hexToString(hexLength)) * 2;

        cursor = cursorObj.value;
        hexValue = hexstr.substring(cursor, cursor + hexLength);
        cursorObj.add(hexLength);

        strValue = hexToString(hexValue);
        hexValue = lengthstr + hexValue;
    }else{
        // 定长域 数字域左补零，其他格式左补空格
        hexLength = parseInt(fieldConfig.length) * 2;
        var hexValue = hexstr.substring(cursor, cursor + hexLength);
        cursorObj.add(hexLength);

        //判断Mac域，如果是Mac域则不作处理直接返回原值
        strValue = fieldConfig.mac ? hexValue : hexToString(hexValue);
    }

    console.info(fieldConfig.id + ":" + fieldConfig.datatype + "," +  hexValue + "--->" +
        fieldConfig.mapping + ":" + hexLength + "," + strValue);
    return strValue;
}

/**
 * 构建位图
 */
function buildBitmap (indexarr) {
    console.info("<<<<<<<<<<构建位图>>>>>>>>>>");
    var bitmap='';
    var lastIndex = indexarr[indexarr.length-1];
    var bitmapLength = 64;
    if(parseInt(lastIndex) > 64){
        bitmapLength = 128;
    }

    var fieldindex = 0;
    for(var i=1; i<=bitmapLength; i++){
        if(bitmapLength == 128 && i == 1){
            bitmap += "1";
        }else{
            if(i == indexarr[fieldindex]){
                fieldindex++;
                bitmap += "1";
            }else{
                bitmap += "0";
            }
        }
    }

    console.info("位图2进制：" + bitmap);
    var bitmaphex = "";
    for(var i=0; i<bitmap.length; i+=4){
        var str4 = bitmap.substring(i, i+4);
        bitmaphex += binmapReverse[str4];
    }

    return bitmaphex;
}

/**
 * 解析位图
 */
function decodeBitmap(cursorObj, hexstr) {
    var cursor = cursorObj.value;
    var firstBit = hexstr.charAt(cursor);
    firstBit = hexToBinary(firstBit);
    var bitmapLength = firstBit.charAt(0) == '0' ? 16 : 32;

    var bitmapHex = hexstr.substring(cursor, cursor + bitmapLength);
    cursorObj.add(bitmapLength);
    console.info("bitmapHex=" + bitmapHex);

    var bitarr = [];
    var bitmap=hexToBinary(bitmapHex);
    for(var i=1; i<bitmap.length; i++){
        if(bitmap[i] == '1'){
            bitarr.push(i + 1);
        }
    }

    console.info("解析位图:"+bitmapHex+","+bitmap+",["+bitarr+"]");
    return bitarr;
}

/**
 * 构建头部信息
 */
function buildHead (headData, config) {
    console.info("<<<<<<构建表头信息>>>>>>>>");
    var headConf = config.commHeadField;
    var head = "";
    for(var i=0; i<headConf.length; i++){
        var conf = headConf[i];
		var headValue = headData[conf.mapping];
		if(typeof headValue == 'undefined'){
				// no-op
		}
		else{
			var headhex = encodeField(conf, headValue);
			head += headhex;
		}
    }

    return head;
}

/**
 * 构建报文长度
 */
function build8583Length (lengthConf, length) {
    console.info("<<<<<<<<<<构件报文长度>>>>>>>>>>>>>");
    length = length/2;
    /*length = length.toString(16);
    console.debug("lengthConf=%o, length=%o",lengthConf, length);
    var lenhex = length.length;
    console.debug("lenhex=" + lenhex);
    var hexLength = lenhex;
    for(var i=0; i<lengthConf-hexLength; i++){
        length = "0" + length;
    }*/
    //*************现场更改***************************************
        length += 2;  //报文总长度  包括长度域 
       
        var Num  = parseInt(Number(length)/256);
        var Num1 = Number(length) - Num * 256;

        Num = Num.toString(16);
        if (Num.length < 2)
        {
            Num = "0" + Num;
        }

        Num1 = Num1.toString(16);
        if (Num1.length < 2)
        {
            Num1 = "0" + Num1;
        }
        
   //*************现场更改***************************************
    console.debug("...");
    console.debug(Num + Num1);
    return Num + Num1;
}

/**
 * 构建body域hex形式
 */
function buildFieldHex (indexarr, fields) {
    var hexstr = "";
    for(var i=0; i<indexarr.length; i++){
        hexstr += fields[indexarr[i]].hexvalue;
    }
    return hexstr;
}

/**
 * 拆解报文头部信息
 */
function decodeHead (cursor, hexstr, headTemplate) {
    var head = {};
    for(var i=0; i<headTemplate.length; i++){
        var conf = headTemplate[i];
		head[conf.mapping] = decodeField(cursor, hexstr, conf);
    }

    return head;
}

console.info("cn8583模块加载成功...");

 

 
	/* 获得数组从startIndex,长度为length的值，返回数组 */
	// function getArrayIndexData(startIndex,length,args){
		// if(length<1||startIndex+length>args.length){
			// console.debug("下标参数错误");
			// return;
		// }
		// var arrayIndex = [];
		// var sum = 0;
		// for(var i = 0;i<length;i++){
			// arrayIndex[sum++] =  args[startIndex+i];
		// }
		// return arrayIndex;
	// }
	// /* 创建8583报文对象 */
	// function creatMsg_8583(args){
		// var msg_8583 = new Object();
		// msg_8583.mess_type = getArrayIndexData(0,2,args);
		// //判断位图是基本位图（64域）还是扩展位图（128域）
		// var domain = getArrayIndexData(2,1,args);
		// var domain_l =  hexUtil.hexToBin(domain[0]);
		// if('0' == domain_l.charAt(0)){
			// msg_8583.bitmap = getArrayIndexData(2,8,args);
		// }else{
			// msg_8583.bitmap = getArrayIndexData(2,16,args);
		// }
		// //位图中存在的域
		// var  domains = [];
		// for(var i = 0;i<msg_8583.bitmap.length;i++){
			// var bit = hexUtil.hexToBin(msg_8583.bitmap[i]);
			// for(var j=0;j<bit.length;j++){
				// if(bit.charAt(j)=='1'){
					// domains.push(j+1+8*i);
				// }
			// }
		// }
		// msg_8583.domains = domains;
		// var dataIndex = 2+msg_8583.bitmap.length;
		// msg_8583.data = getArrayIndexData(dataIndex,args.length-dataIndex,args);
		// return msg_8583;
	// }
	
	
})()