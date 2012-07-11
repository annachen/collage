
function CollageCanvas(id){

	var This = this;

	if(MULTI_CANVAS == true){
		this.canvasDiv = id;
		this.canvasArray = new Array();
		this.tempctx = null;
	}
	else{
		this.id = id;
		this.ctx = $("#"+this.id)[0].getContext("2d");
	}

	this.width = 1024;
	this.height = 768;
	this.layerArray = null;
	this.focusedLayer = -1;
	this.tool = '';

	this.moveTool = new MoveTool(this);
	this.cutTool = new CutTool(this);
	this.resizeTool = new ResizeTool(this);
	this.rotateTool = new RotateTool(this);

	this.rectInitiated = false;


	this.setFocusedLayer = function(layerID){
		This.focusedLayer = layerID;
	}

	this.setTool = function(tool){
		This.tool = tool;
	}

	this.size = function(width, height){
		This.width = width;
		This.height = height;
		This.updateUI();
	}

	this.updateUI = function(){
		if(MULTI_CANVAS == true){
			$("#"+This.canvasDiv).width(This.width);
			$("#"+This.canvasDiv).height(This.height);
		}
		else{
			$("#"+This.id).attr("width", This.width);
			$("#"+This.id).attr("height", This.height);
		}
	}

	this.setLayerArray = function(layerArray){
		This.layerArray = layerArray;
	}

	this.outputCanvasDiv = function(canvasID){
		This.canvasID = canvasID;
		var output = '<div id=' + This.canvasID + 'Div class=canvasDiv>';
		output += '<canvas id=' + This.canvasID + ' class=canvas></canvas>';
		output += '</div>';
		return output;
	}

	this.addCanvas = function(){
		var canvasID = "canvas" + This.canvasArray.length;
		var html = This.outputCanvasDiv(canvasID);
		$("#"+This.canvasDiv).append(html);
		$("#"+canvasID).attr("width", This.width);
		$("#"+canvasID).attr("height", This.height);
		This.canvasArray.push($("#"+canvasID)[0].getContext("2d"));
	}

	this.clearCanvas = function(){
		if(MULTI_CANVAS == true){
			for(var i=0;i<This.canvasArray.length;i++){
				This.canvasArray[i].clearRect(0, 0, This.width, This.height);
			}
		}
		else
			This.ctx.clearRect(0, 0, This.width, This.height);
	}

	this.draw = function(){
		if(This.layerArray == null){
			console.log('Layers not loaded.');
			alert('Layers not loaded');
			return;
		}

		if(MULTI_CANVAS == true && This.layerArray.length != This.canvasArray.length){
			console.log('Layer number does not match canvas number');
			alert('Layer number does not match canvas number');
			return;
		}

		This.clearCanvas();

		if(MULTI_CANVAS == true){
			for(var i = 0; i < This.layerArray.length; i++){
				This.layerArray[i].drawLayer(This.canvasArray[i]);
			}
		}
		else{
			for(var i = 0; i < This.layerArray.length; i++){
				This.layerArray[i].drawLayer(This.ctx);
			}
		}
	}

	this.resetEvents = function(){
		This.mousePressed = false;
		if(This.rectInitiated == true){
			This.rectInitiated = false;
			This.draw();
		}
	}

	this.initRect = function(){
		This.rectInitiated = true;
		
		if(This.tool == TOOL_RESIZE)
			This.resizeTool.init();
		else if(This.tool == TOOL_ROTATE)
			This.rotateTool.init();

		return;
	}

	// move all the mouse events implementation into another file for easier reading
	this.mouseDown = function(x, y){
		if(This.focusedLayer < 0)
			return;

		switch(This.tool){
			case TOOL_MOVE:
				This.moveTool.mouseDown(x, y);
				break;
			case TOOL_CUT:
				This.cutTool.mouseDown(x, y);
				break;
			case TOOL_RESIZE:
				This.resizeTool.mouseDown(x, y);
				break;
			case TOOL_ROTATE:
				This.rotateTool.mouseDown(x, y);
				break;
		}
	}

	this.mouseMove = function(x, y){
		if(This.focusedLayer < 0)
			return;
		
		switch(This.tool){
			case TOOL_MOVE:
				This.moveTool.mouseMove(x, y);
				break;
			case TOOL_CUT:
				This.cutTool.mouseMove(x, y);
				break;
			case TOOL_RESIZE:
				This.resizeTool.mouseMove(x, y);
				break;
			case TOOL_ROTATE:
				This.rotateTool.mouseMove(x, y);
				break;
		}
	}

	this.mouseUp = function(x, y){
		if(This.focusedLayer < 0)
			return;
		
		switch(This.tool){
			case TOOL_MOVE:
				This.moveTool.mouseUp(x, y);
				break;
			case TOOL_CUT:
				This.cutTool.mouseUp(x, y);
				break;
			case TOOL_RESIZE:
				This.resizeTool.mouseUp(x, y);
				break;
			case TOOL_ROTATE:
				This.rotateTool.mouseUp(x, y);
				break;
		}
	}

}

