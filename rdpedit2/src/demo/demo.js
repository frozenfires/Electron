console.debug(global.abc);

jsPlumb.ready(function() {

	var instance = jsPlumb.getInstance({
		DragOptions : { cursor: "pointer", zIndex:2000 },
		HoverClass:"connector-hover"
	});

	var stateMachineConnector = {				
		connector:"StateMachine",
		paintStyle:{lineWidth:3,strokeStyle:"#056"},
		hoverPaintStyle:{strokeStyle:"#dbe300"},
		endpoint:"Blank",
		anchor:"Continuous",
		overlays:[ ["PlainArrow", {location:1, width:15, length:12} ]]
	};

	

	var stepurl = "CIMCashIn.xml";

	$.get(stepurl, {}, function(xmlObj){
		console.info(xmlObj);
		xmlObj = $.text2xml(xmlObj);
		buildStep(stepurl, xmlObj);

		render();

	}, 'text');

	// 步骤
	var stepItem = '<div class="component window" id="window1"><strong>Window 1</strong></div>';
	var stepHtml = [];
	var connectStr = [];
	var top = 25, left=30;
function buildStep (url, xmlObj) {
	
	var root = xmlObj.children[0];
	// stepHtml.push('<div class="component window xmlFile">');
	// stepHtml.push('<strong>'+root.getAttribute("Remark")+'</strong>');
	// stepHtml.push('</div>');

	for(var i=0; i<root.children.length; i++){
		top += 45; left += 45;
		var item = root.children[i];
		stepHtml.push('<div class="component window" id="'+item.nodeName+'" style="top:'+top+'px;left:'+left+'px;">');
		stepHtml.push(item.nodeName+'@');
		stepHtml.push(item.getAttribute('Remark'));
		stepHtml.push('</div>');

		var rets = item.getElementsByTagName('Return');
		if(rets.length > 0){
			var retObj = rets[0];
			var switchs = retObj.getElementsByTagName('switch');
			for(var n=0; n<switchs.length; n++){
				var switchObj = switchs[n];
				connectStr.push({source: ""+item.nodeName, 
					target: "" + switchObj.textContent, 
					label: "" + switchObj.nodeName + "("+switchObj.getAttribute('case')+")"});
			}
		}
	}

	$('#kitchensink-demo').append(stepHtml.join('\n'));
	
}

function render (argument) {


	// instance.connect({
	// 	source:"window3",
	// 	target:"window7",
	// 	label :"default"
	// }, stateMachineConnector);

	for(i in connectStr){
		var conn = connectStr[i];
		try{
			instance.connect(conn , stateMachineConnector);
		}catch(e){
			console.info(e);
		}
	}
	
	// make all .window divs draggable. note that here i am just using a convenience method - getSelector -
	// that enables me to reuse this code across all three libraries. In your own usage of jsPlumb you can use
	// your library's selector method - "$" for jQuery, "$$" for MooTools, "Y.all" for YUI3.
	//instance.draggable(jsPlumb.getSelector(".window"), { containment:".demo"});    
	instance.draggable(jsPlumb.getSelector(".window"), {
		drag:function() {
			//console.log("DRAG")
		}
	});    

	jsPlumb.fire("jsPlumbDemoLoaded", instance);
}
	
});	


