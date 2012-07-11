
function PreviewCanvas(id){
	
	var This = this;
	this.id = id;
	this.width = 300;
	this.height = 100;
	this.ctx = $("#"+this.id)[0].getContext("2d");

	this.size = function(width, height){
		This.width = width;
		This.height = height;
		This.updateUI();	
	}

	this.updateUI = function(){
		$("#"+this.id).attr("width", This.width);
		$("#"+this.id).attr("height", This.height);
		//$("#"+this.id).width(this.width);
		//$("#"+this.id).height(this.height);
	}

	this.getContext = function(){
		return This.ctx;
	}

	this.clearCanvas = function(){
		This.ctx.clearRect(0, 0, This.width, This.height);
	}
}

