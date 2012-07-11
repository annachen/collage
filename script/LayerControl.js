
const IMAGE_LOADED = 0;
const IMAGE_LOAD_ERROR = 1;

function LayerControl(linkId, layersDiv, collageCanvas, previewCanvas){
	
	var This = this;

	this.linkId = linkId;
	this.layersDiv = layersDiv;
	this.layerArray = new Array();
	this.focusedLayer = -1;
	this.collageCanvas = collageCanvas;
	this.previewCanvas = previewCanvas;
	this.tempLayer;

	this.collageCanvas.setLayerArray(this.layerArray);

	this.message = function(msg){
		if(msg == IMAGE_LOADED){
			console.log(This.tempLayer.imgsrc + " successful loaded.");
			This.layerArray.push(This.tempLayer);
			console.log("Number of layers: " + This.layerArray.length);

			var html = This.layerArray[This.layerArray.length-1].outputLayerDiv('layer'+(This.layerArray.length-1));
			$("#"+This.layersDiv).prepend(html);
			This.focusOnLayer(This.layerArray.length - 1);
			
			// reset tool selection
			initTool();

			if(MULTI_CANVAS == true)
				This.collageCanvas.addCanvas();
			This.collageCanvas.draw();
		}
		else if(msg == IMAGE_LOAD_ERROR){
			console.log("Invalid link address.");
			console.log("Number of layers: " + This.layerArray.length);
		}
	}

	this.addLayer = function(){
		var link = $("#"+This.linkId).val();
		This.tempLayer = new Layer(link);
		This.tempLayer.loadImage();
		// wait for layer to send message back
	}

	this.focusOnLayer = function(layerID){
		if(This.focusedLayer >= 0)
			This.layerArray[This.focusedLayer].unfocus();

		This.focusedLayer = layerID;
		This.previewCanvas.clearCanvas();
		This.layerArray[This.focusedLayer].drawImage(This.previewCanvas.getContext());
		This.layerArray[This.focusedLayer].focus();

		This.collageCanvas.setFocusedLayer(This.focusedLayer);
	}

	// top layer has the highest ID
	// back layer has lower ID
	this.moveBackLayer = function(layerID){
		if(layerID == 0)
			return;
		var tmp = This.layerArray[layerID - 1];
		This.layerArray[layerID - 1] = This.layerArray[layerID];
		This.layerArray[layerID] = tmp;
		if(This.focusedLayer == layerID)
			This.focusedLayer = layerID - 1;
		else if(This.focusedLayer == layerID - 1)
			This.focusedLayer = layerID;

		This.collageCanvas.draw();
		This.rerenderLayerList();
		This.focusOnLayer(This.focusedLayer);
	}

	this.moveFrontLayer = function(layerID){
		if(layerID == This.layerArray.length - 1)
			return;
		var tmp = This.layerArray[layerID + 1];
		This.layerArray[layerID + 1] = This.layerArray[layerID];
		This.layerArray[layerID] = tmp;
		if(This.focusedLayer == layerID)
			This.focusedLayer = layerID + 1;
		else if(This.focusedLayer == layerID + 1)
			This.focusedLayer = layerID;

		This.collageCanvas.draw();
		This.rerenderLayerList();
		This.focusOnLayer(This.focusedLayer);
	}

	this.rerenderLayerList = function(){
		$("#"+This.layersDiv).html('');
		for(var i=0; i<this.layerArray.length; i++){
			var html = This.layerArray[i].outputLayerDiv('layer'+i);
			$("#"+This.layersDiv).prepend(html);
		}
	}
}
