
// need to be consistant with index.html
const TOOL_MOVE = 'move';
const TOOL_CUT = 'cut';
const TOOL_RESIZE = 'resize';
const TOOL_ROTATE = 'rotate';

const MULTI_CANVAS = false;

// These should be consistant with those in css
const MIDDLE_BORDER_WIDTH = 1;
const MAIN_CANVAS_BORDER_WIDTH = 0;
const PREVIEW_CANVAS_BORDER_WIDTH = 3;
const RIGHT_PADDING = 7;
const LAYER_CLASS = 'layer';
const LAYER_CLASS_LENGTH = 5; // length of the class name

const PREVIEW_CANVAS_DEFAULT_HEIGHT = 230;

$(function(){
	
	if(MULTI_CANVAS == true){
		$("#middlePane").html("<div id=\"mainCanvas\"></div>");
	}
	else{
		$("#middlePane").html("<canvas id=\"mainCanvas\"></canvas>");
	}

	window.collageCanvas = new CollageCanvas("mainCanvas"); 
	window.previewCanvas = new PreviewCanvas("previewCanvas");
	window.layerControl = new LayerControl("input-linkAddress", "layers", window.collageCanvas, window.previewCanvas);

	initDisplay();
	initEvents();
	initTool();

});


function initDisplay(){

	var all = $("#mainPane").innerWidth();
	var left = $("#leftPane").outerWidth();
	var rightOut = $("#rightPane").outerWidth();
	var rightIn = $("#rightPane").innerWidth();
	$("#middlePane").width(all - left - rightOut - MIDDLE_BORDER_WIDTH*2);
	$("#previewDiv").width(rightIn - 2*RIGHT_PADDING);

	var width = $("#middlePane").innerWidth() - 2*MAIN_CANVAS_BORDER_WIDTH;
	var height = $("#middlePane").innerHeight() - 2*MAIN_CANVAS_BORDER_WIDTH;
	window.collageCanvas.fullSize(width, height);
	window.collageCanvas.size(width, height);
	window.previewCanvas.size($("#previewDiv").innerWidth() - 2*PREVIEW_CANVAS_BORDER_WIDTH , PREVIEW_CANVAS_DEFAULT_HEIGHT);

	$("#layers").width(rightIn - 2*RIGHT_PADDING);
	$("#layers").height($("#rightPane").innerHeight() - $("#linkInputDiv").outerHeight(true) - $("#previewDiv").outerHeight(true));

}

function initEvents(){
	$("#button-addLayer").live("click", window.layerControl.addLayer);
	$(".layer-link").live("click", function(){
		var id = $(this).attr('id');
		var idNumStr = id.substring(LAYER_CLASS_LENGTH);
		var layerID = parseInt(idNumStr);
		window.layerControl.focusOnLayer(layerID);
	});
	$(".layer-moveup").live('click', function(){
		var id = $(this).attr('id');
		var idNumStr = id.substring(LAYER_CLASS_LENGTH);
		var layerID = parseInt(idNumStr);
		window.layerControl.moveFrontLayer(layerID);
	});
	$(".layer-movedown").live('click', function(){
		var id = $(this).attr('id');
		var idNumStr = id.substring(LAYER_CLASS_LENGTH);
		var layerID = parseInt(idNumStr);
		window.layerControl.moveBackLayer(layerID);
	});
	$(".radio-tool").live('click', function(){
		window.collageCanvas.setTool($(this).val());
		window.collageCanvas.resetEvents();
	});
	$("#tool-resize").live('click', function(){
		window.collageCanvas.initRect();
	});
	$("#tool-rotate").live('click', function(){
		window.collageCanvas.initRect();
	});

	if(MULTI_CANVAS == true){
		$(".canvas").live('mousedown', function(e){
			var offset = $('#mainCanvas').offset();
			window.collageCanvas.mouseDown(e.pageX - offset.left, e.pageY - offset.top);
		});
		$(".canvas").live('mousemove', function(e){
			var offset = $('#mainCanvas').offset();
			window.collageCanvas.mouseMove(e.pageX - offset.left, e.pageY - offset.top);
		});
		$(".canvas").live('mouseup', function(e){
			var offset = $('#mainCanvas').offset();
			window.collageCanvas.mouseUp(e.pageX - offset.left, e.pageY - offset.top);
		});
	}
	else{
		$("#mainCanvas").live('mousedown', function(e){
			var offset = $('#mainCanvas').offset();
			window.collageCanvas.mouseDown(e.pageX - offset.left, e.pageY - offset.top);
		});
		$("#mainCanvas").live('mousemove', function(e){
			var offset = $('#mainCanvas').offset();
			window.collageCanvas.mouseMove(e.pageX - offset.left, e.pageY - offset.top);
		});
		$("#mainCanvas").live('mouseup', function(e){
			var offset = $('#mainCanvas').offset();
			window.collageCanvas.mouseUp(e.pageX - offset.left, e.pageY - offset.top);
		});
	}
	$("#input-width").focusout(function(){
		var width = parseInt($("#input-width").val());
		var height = parseInt($("#input-height").val());
		window.collageCanvas.size(width, height);
	});
	$("#input-height").focusout(function(){
		var width = parseInt($("#input-width").val());
		var height = parseInt($("#input-height").val());
		window.collageCanvas.size(width, height);
	});
	$(".layer-inputName").live('focusout', function(){
		var id = $(this).attr('id');
		var idNumStr = id.substring(LAYER_CLASS_LENGTH);
		var layerID = parseInt(idNumStr);
		window.layerControl.layerArray[layerID].setName($(this).val());
		window.layerControl.layerArray[layerID].disableEditName();
	});
	//TODO: change cursor style
	//$('selector').css( 'cursor', 'pointer' );
}

function initTool(){
	$("#tool-move").attr('checked', 'checked');
	window.collageCanvas.setTool(TOOL_MOVE);
}


// disable selection. Copied from http://stackoverflow.com/questions/2700000/how-to-disable-text-selection-using-jquery
/*
(function($){
	$.fn.disableSelection = function() {
	    return this.each(function() {           
	        $(this).attr('unselectable', 'on')
	               .css({
	                   '-moz-user-select':'none',
	                   '-webkit-user-select':'none',
	                   'user-select':'none',
	                   '-ms-user-select':'none'
	               })
	               .each(function() {
	                   this.onselectstart = function() { return false; };
	               });
	    });
	};
})(jQuery);
*/
