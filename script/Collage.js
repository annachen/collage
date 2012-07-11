
// need to be consistant with index.html
const TOOL_MOVE = 'move';
const TOOL_CUT = 'cut';
const TOOL_RESIZE = 'resize';
const TOOL_ROTATE = 'rotate';

const MULTI_CANVAS = false;

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
	$("#middlePane").width(all - left - rightOut);
	$("#previewDiv").width(rightIn);

	//$("#mainCanvas").attr("width", all-left-right);
	window.collageCanvas.size($("#middlePane").innerWidth(), $("#middlePane").innerHeight());
	window.previewCanvas.size($("#previewDiv").innerWidth(), 300);
	//window.collageCanvas.updateUI();
	//$("#previewCanvas").attr("width", right);

	//$("#mainCanvas").css("border", "solid 1px black");
	//$("#previewCanvas").css("border", "none");
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
	//TODO: change cursor style
	//$('selector').css( 'cursor', 'pointer' );
}

function initTool(){
	$("#tool-move").attr('checked', 'checked');
	window.collageCanvas.setTool(TOOL_MOVE);
}

/*
function dis

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
