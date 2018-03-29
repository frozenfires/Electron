 (function(){
	 
	const hex_bin_map = {
		'0':'0000',
		'1':'0001',
		'2':'0010',
		'3':'0011',
		'4':'0100',
		'5':'0101',
		'6':'0110',
		'7':'0111',
		'8':'1000',
		'9':'1001',
		'A':'1010',
		'B':'1011',
		'C':'1100',
		'D':'1101',
		'E':'1110',
		'F':'1111'
	}
	exports.hexToBin = function(hex){
		return _hexToBin(hex);
	}
	exports.binToHex = function(bin){
		return _binToHex(bin);
	}
	
	function _hexToBin(hex){
		var bin_str = "";
		for(var i= 0;i<hex.length;i++){
			var key = hex.charAt(i);
			bin_str += (hex_bin_map[key]==null ?"":hex_bin_map[key]);
		}
		return bin_str.toString();
	}
 
 })();
