
const LAYER_FOCUS_BG = '#aaaaff';
const LAYER_UNFOCUS_BG = '#ffffff';
const LAYER_CLASS_LENGTH = 5; // length of the class name

function Layer(link){

	var This = this;
	this.image = new Image();
	this.imgsrc = link;
	this.loaded = false;
	this.divID = "";

	// position of the layer on collageCanvas
	this.posX = 0;
	this.posY = 0;

	// points of cut
	this.cutEdgePoints = null;

	// size of scaling (different than original image size)
	this.sizeW = -1;
	this.sizeH = -1;

	// angle of rotation (in radius)
	this.angle = 0;

	this.loadImage = function(){
		This.image.onload = function(){
			This.loaded = true;
			This.sizeW = This.image.width;
			This.sizeH = This.image.height;
			window.layerControl.message(IMAGE_LOADED);
		}
		This.image.onerror = function(){
			alert("Cannot load image");
			window.layerControl.message(IMAGE_LOAD_ERROR);
		}

		try{ // this cannot catch invalid link error, which is therefore handled by onerror
			This.image.src = This.imgsrc;
		} catch(err){
			alert(err);
		}
	}

	this.drawImage = function(ctx){
		if(This.loaded == true){
			var imageWidth = This.image.width;
			var imageHeight = This.image.height;
			var canvasWidth = ctx.canvas.width;
			var canvasHeight = ctx.canvas.height;
			if(canvasWidth >= imageWidth && canvasHeight >= imageHeight)
				ctx.drawImage(This.image, 0, 0);
			else if(canvasWidth < imageWidth && canvasHeight < imageHeight){
				var widthRatio = imageWidth/canvasWidth;
				var heightRatio = imageHeight/canvasHeight;
				if(widthRatio > heightRatio){ // resize to fill width
					var destWidth = canvasWidth;
					var destHeight = imageHeight/widthRatio;
					ctx.drawImage(This.image, 0, 0, destWidth, destHeight);
				}	
				else{ // resize to fill height
					var destWidth = imageWidth/heightRatio;
					var destHeight = canvasHeight;
					ctx.drawImage(This.image, 0, 0, destWidth, destHeight);
				}
			}
			else if(canvasWidth < imageWidth){ // resize to fill width
				var widthRatio = imageWidth/canvasWidth;
				var destWidth = canvasWidth;
				var destHeight = imageHeight/widthRatio;
				ctx.drawImage(This.image, 0, 0, destWidth, destHeight);
			}
			else{ // resize to fill height
				var heightRatio = imageHeight/canvasHeight;
				var destWidth = imageWidth/heightRatio;
				var destHeight = canvasHeight;
				ctx.drawImage(This.image, 0, 0, destWidth, destHeight);
			}
		}
		else{
			alert('Image not loaded.');
			console.log('Image not loaded');
		}
	}

	this.outputLayerDiv = function(divID){
		This.divID = divID;
		var output = '<div id='+ This.divID +' class=' + LAYER_CLASS + '>';
		output += '<div class=layer-link id=' + This.divID +'-link>' + This.imgsrc + '</div>';
		output += '<input type=button value="+" class=layer-moveup id=' + This.divID +'-moveup/>';
		output += '<input type=button value="-" class=layer-movedown id=' + This.divID + '-movedown/>';
		output += '</div>';
		return output;
	}
	this.focus = function(){
		if(This.divID == ''){
			alert('Layer div not initiated.');
			console.log('Layer div not initiated.');
		}
		else{
			$("#"+This.divID).css('background-color', LAYER_FOCUS_BG);
		}
	}

	this.unfocus = function(){
		if(This.divID == ''){
			alert('Layer div not initiated.');
			console.log('Layer div not initiated.');
		}
		else{
			$("#"+This.divID).css('background-color', LAYER_UNFOCUS_BG);
		}
	}

	this.setCutEdgePoints = function(cutEdgePoints){
		This.cutEdgePoints = new Array();
		for(var i=0;i<cutEdgePoints.length;i++)
			This.cutEdgePoints.push(cutEdgePoints[i]);
	}

	this.drawLayer = function(ctx){
		if(This.loaded != true){
			console.log(This.imgsrc + ' not loaded.');
			return;
		}

		ctx.save();
		
		if(This.cutEdgePoints != null && This.cutEdgePoints.length > 0){
			var widthRatio = This.sizeW / This.image.width;
			var heightRatio = This.sizeH / This.image.height;
			ctx.beginPath();
			var center = {
				x: This.posX + This.sizeW/2,
				y: This.posY + This.sizeH/2
			};
			for(var i=0;i<This.cutEdgePoints.length;i++){
				var pt = {
					x: This.posX + This.cutEdgePoints[i].x * widthRatio,
					y: This.posY + This.cutEdgePoints[i].y * heightRatio
				};
				pt = rotateAroundPoint(pt, center, This.angle);
				if(i == 0)
					ctx.moveTo(pt.x, pt.y);
				else
					ctx.lineTo(pt.x, pt.y);
			}
			ctx.closePath();
			ctx.clip();
		}

		ctx.translate(This.posX + This.sizeW/2, This.posY + This.sizeH/2);
		ctx.rotate(This.angle);

		ctx.drawImage(This.image, -This.sizeW/2, -This.sizeH/2, This.sizeW, This.sizeH);

		ctx.restore();
	}

	this.applyOffset = function(xOffset, yOffset){
		This.posX += xOffset;
		This.posY += yOffset;
	}

	this.getPosition = function(){
		return {
			x: This.posX,
			y: This.posY
		};
	}

	this.getImageSize = function(){
		return {
			w: This.sizeW,
			h: This.sizeH
		};
	}

	this.setImageSize = function(w, h){
		This.sizeW = w;
		This.sizeH = h;
	}

	this.getScale = function(){
		if(This.loaded != true)
			return null;
		
		return{
			w: This.sizeW / This.image.width,
			h: This.sizeH / This.image.height
		};
	}

	this.applyAngleOffset = function(angle){
		This.angle += angle;
	}
}




