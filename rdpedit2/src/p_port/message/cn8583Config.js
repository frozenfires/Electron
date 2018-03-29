void function(){
	
	var cn8583Config ={
//<!-- These are the 8583 headers to be prepended to the message types specified -->
//<!-- length属性表示该报文头的应该长度， "0200"为该报文类型ID-->
		'headerLength' : 4,

	  //<!-- 报文头信息 -->
	    'commHeadField': [
			{id:"1", datadesc:"tpdu", datatype:"NUMERIC", length:"5", mapping:"TPDU"},
	        {id:"2", datadesc:"nettype", datatype:"ASCII", length:"2", mapping:"NETTYPE"},
	        {id:"3", datadesc:"seqno", datatype:"ASCII", length:"8", mapping:"SEQNO"},
	        {id:"4", datadesc:"errcode", datatype:"NUMERIC", length:"4", mapping:"ERRCODE"},
	        {id:"5", datadesc:"apptype", datatype:"ASCII", length:"4", mapping:"APPTYPE"}
	        
	        
	    ],
		// 配置交易类别差异字段
		'appFieldsConfig' : {
			"0810" : {
			"48" : {id:"48", datatype:"LLVAR", enco:"BCD", length:"999", mapping:"Field48"}
			}

		},

	    'fields':[
	              {id:"2", datatype:"LLVAR", length:"19", mapping:"ACCOUNT"},
	              {id:"3", datatype:"ASCII", length:"6", mapping:"PROCESSCODE"},
	              {id:"4", datatype:"NUMERIC", length:"12", mapping:"Field4"},
	              {id:"7", datatype:"ASCII", length:"2", mapping:"Field7", },
	              {id:"11", datadesc:"系统跟踪号", datatype:"ASCII", length:"8", mapping:"Field11"},
	              {id:"12", datatype:"ASCII", length:"6", mapping:"Field12"},
	              {id:"13", datatype:"ASCII", length:"8", mapping:"Field13"},
	              {id:"14", datatype:"ASCII", length:"8", mapping:"Field14"},
	              {id:"15", datatype:"ASCII", length:"8", mapping:"Field15"},
	              {id:"16", datatype:"ASCII", length:"2", mapping:"Field16"},
	              {id:"18", datatype:"ASCII", length:"4", mapping:"Field18"},
	              {id:"20", datatype:"ASCII", length:"8", mapping:"Field20"},
	              {id:"21", datatype:"ASCII", length:"36", mapping:"Field21"},
	              {id:"22", datatype:"ASCII", length:"3", mapping:"Field22"},
	              {id:"23", datatype:"ASCII", length:"3", mapping:"Field23"},
	              {id:"24", datatype:"ASCII", length:"80", mapping:"Field24"},
	              {id:"25", datatype:"ASCII", length:"2", mapping:"Field25"},
	              {id:"28", datatype:"ASCII", length:"8", mapping:"Field28"},
	              {id:"29", datatype:"ASCII", length:"8", mapping:"Field29"},
	              {id:"30", datatype:"ASCII", length:"8", mapping:"Field30"},
	              {id:"32", datatype:"LLVAR", length:"11", mapping:"Field32"},
	              {id:"33", datatype:"LLVAR", length:"11", mapping:"Field33"},
	              {id:"35", datatype:"LLVAR", length:"37", mapping:"Field35"},
	              {id:"36", datatype:"LLLVAR", length:"104", mapping:"Field36"},
	              {id:"37", datatype:"ASCII", length:"12", mapping:"Field37"},
	              {id:"38", datatype:"ASCII", length:"16", mapping:"Field38"},
	              {id:"39", datatype:"ASCII", length:"2", mapping:"RESPONSECODE"},
	              {id:"40", datatype:"LLVAR", length:"51", mapping:"Field40"},
	              {id:"41", datatype:"ASCII", length:"8", mapping:"Field41"},
	              {id:"42", datatype:"ASCII", length:"15", mapping:"CardAcceptor_Identification_42"},
	              {id:"45", datatype:"LLLVAR", length:"10", mapping:"Field45"},
	              {id:"46", datatype:"ASCII", length:"10", mapping:"Field46"},
	              {id:"48", datatype:"LLLVAR", length:"999", mapping:"Field48"},
	              {id:"49", datatype:"ASCII", length:"3", mapping:"Field49"},
	              {id:"51", datatype:"ASCII", length:"7", mapping:"Field51", fill:"L"},
	              {id:"52", datatype:"ASCII", length:"8", mapping:"Field52"},
	              {id:"53", datatype:"ASCII", length:"16", mapping:"Field53"},
	              {id:"54", datatype:"ASCII", length:"39", mapping:"Field54"},
	              {id:"55", datatype:"LLLVAR", length:"255", mapping:"Field55"},
	              {id:"59", datatype:"LLLVAR", length:"100", mapping:"Field59"},
	              {id:"60", datatype:"ASCII", length:"4", mapping:"Field60"},
	              {id:"61", datatype:"LLVAR", length:"54", mapping:"Field61"},
	              {id:"62", datatype:"ASCII", length:"64", mapping:"Field62"},
	              {id:"63", datatype:"LLVAR", length:"22", mapping:"Field63"},
	              {id:"68", datatype:"ASCII", length:"20", mapping:"Field68"},
	              {id:"72", datatype:"ASCII", length:"4", mapping:"Field72"},
	              {id:"90", datatype:"ASCII", length:"40", mapping:"Field90"},
	              {id:"93", datatype:"ASCII", length:"3", mapping:"Field93"},
	              {id:"96", datatype:"ASCII", length:"24", mapping:"Field96"},
	              {id:"102", datatype:"LLVAR", length:"28", mapping:"Account_Identification1_102"},
	              {id:"103", datatype:"LLVAR", length:"28", mapping:"Field103"},
	              {id:"106", datatype:"ASCII", length:"16", mapping:"Field106"},
	              {id:"120", datatype:"LLLVAR", length:"999", mapping:"Field120"},
	              {id:"121", datatype:"LLLVAR", length:"999", mapping:"Field121"},
	              {id:"122", datatype:"LLLVAR", length:"999", mapping:"Field122"},
	              {id:"123", datatype:"LLLVAR", length:"999", mapping:"Field123"},
	              {id:"127", datatype:"LLLVAR", length:"126", mapping:"Field127"},
	              {id:"128", mac:true, datatype:"ASCII", length:"8", mapping:"MESSAGEAUDITCODE"}
	          ],
    
    /**
     * 该方法是公共报文域进行集中处理，供发送报文前调用。
     * 各项目应参照下面的代码做差异化实现，各项目需要处理的公共域差异较大切勿照搬。
     */
    PackNormalFieldForMsg : function(cmdCode){
        console.debug("PackNormalFieldForMsg :: cmdCode =" + cmdCode);
        
        var currentDate = Util.current();
        //声明对象存放DAO.selectSystemRunningInfo()的查询结果
        var runningInfo = DAO.selectSystemRunningInfo();
        var currentSysTraceNo = runningInfo.traceno;
        var deviceInfo = DAO.getDeviceInfo();
        var deviceNo = Util.pad(deviceInfo.deviceno, 8);

        DataContainer.setBodyData(DataContainer.N10DateTime, currentDate.date.substring(4) + currentDate.time);
        DataContainer.setBodyData(DataContainer.SeqNo, Util.pad(currentSysTraceNo, 6));
        DataContainer.setBodyData("CURRENCYCODE", "156");
        DataContainer.setBodyData(DataContainer.DeviceID, deviceNo);
        var strField122 = ""+cmdCode;
        strField122 += "                 ";
        strField122 += Util.padExt(TCRTools.GetLocalIp(),15," ","right");
        strField122 +=Util.pad(runningInfo.batch,6);
        DataContainer.setBodyData("BRANCHINNERDATA", strField122);
        DataContainer.setBodyData("CURRENCYCODE", "156");
        DataContainer.setBodyData("PROCESSCODE", cmdCode);
        DataContainer.setBodyData("Field12", currentDate.time);
        DataContainer.setBodyData("Field13", currentDate.date);
        DataContainer.setBodyData("Field51", DataContainer.getSysData("tellerNo"));
        DataContainer.setBodyData("Field72", runningInfo.batch);
        DataContainer.setBodyData(DataContainer.DeviceID, deviceNo);
        DataContainer.setHeadData("transeqno", Util.padExt(currentSysTraceNo, 20,' ',"right"));
        DataContainer.setHeadData(DataContainer.DeviceID, deviceNo);
        DataContainer.setHeadData("DeviceStatus", deviceInfo.status);
        
        var batch = runningInfo.batch;
        DataContainer.setBodyData("currentBatchNo", Util.padExt(batch,4,' ',"right")); 
        DataContainer.setBodyData("nextBatchNo", Util.padExt(nextBatchNo(batch), 4, "0","left")); 
        
        //-----------------内部私有方法----------------------------------------------------
        function nextBatchNo(batch) {
            var nextbatch = parseInt(batch) + parseInt(1);
            if (nextbatch > 9999){
              nextbatch = 1;
            }
            return nextbatch;
        }

        function pad(num, n) {
            var len = num.toString().length;
            while (len < n) {
                num = "0" + num;
                len++;
            }
            return num;
        }
        
        
    },
 
	};
exports.cn8583Config = cn8583Config;
}();









