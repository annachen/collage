
const RESIZE_LEFT = 0;
const RESIZE_RIGHT = 1;
const RESIZE_TOP = 2;
const RESIZE_BOTTOM = 3;
const RESIZE_UPPERLEFT = 4;
const RESIZE_UPPERRIGHT = 5;
const RESIZE_LOWERLEFT = 6;
const RESIZE_LOWERRIGHT = 7;
const EDGE_MARGIN = 5;


//=====================================================


function MoveTool(collageCanvas){
	
	var This = this;
	this.cc = collageCanvas;
	this.lastX = 0;
	this.lastY = 0;
	this.mousePressed = false;

	this.mouseDown = function(x, y){
		This.lastX = x;
		This.lastY = y;
		This.mousePressed = true;
	}

	this.mouseMove = function(x, y){
		if(This.mousePressed == true){
			var moveX = x - This.lastX;
			var moveY = y - This.lastY;
			This.cc.layerArray[This.cc.focusedLayer].applyOffset(moveX, moveY);
			This.cc.draw();
			This.lastX = x;
			This.lastY = y;
		}
	}

	this.mouseUp = function(x, y){
		This.mousePressed = false;
	}

}


//=====================================================


function CutTool(collageCanvas){

	var This = this;
	this.cc = collageCanvas;
	this.mousePressed = false;
	this.currentOffset = null;
	this.currentImageSize = null;
	this.currentRatio = null;
	this.cutEdgePoints = null;
	this.center = null;
	this.angle = 0;

	if(MULTI_CANVAS == true)
		this.tempctx = null;

	this.mouseDown = function(x, y){
		This.mousePressed = true;
		This.currentOffset = This.cc.layerArray[This.cc.focusedLayer].getPosition();
		This.currentRatio = This.cc.layerArray[This.cc.focusedLayer].getScale();
		This.currentImageSize = This.cc.layerArray[This.cc.focusedLayer].getImageSize();

		if(MULTI_CANVAS == true){
			This.tempctx = This.cc.canvasArray[This.cc.canvasArray.length-1];
			This.tempctx.beginPath();
			This.tempctx.moveTo(x, y);
		}
		else{
			This.cc.ctx.beginPath();
			This.cc.ctx.moveTo(x, y);	
		}
		
		This.angle = This.cc.layerArray[This.cc.focusedLayer].angle;
		This.center = {
			x: This.currentOffset.x + This.currentImageSize.w/2,
			y: This.currentOffset.y + This.currentImageSize.h/2
		};

		This.cutEdgePoints = new Array();
		var pt = rotateAroundPoint({x:x, y:y}, This.center, -This.angle);
		This.cutEdgePoints.push({
			x: (pt.x - This.currentOffset.x) / This.currentRatio.w,
			y: (pt.y - This.currentOffset.y) / This.currentRatio.h
		});
	}

	this.mouseMove = function(x, y){	
		if(This.mousePressed == true){
			if(MULTI_CANVAS == true){
				This.tempctx.lineTo(x, y);
				This.tempctx.stroke();
			}
			else{
				This.cc.ctx.lineTo(x, y);
				This.cc.ctx.stroke();
			}

			var pt = rotateAroundPoint({x:x, y:y}, This.center, -This.angle);
			This.cutEdgePoints.push({
				x: (pt.x - This.currentOffset.x) / This.currentRatio.w,
				y: (pt.y - This.currentOffset.y) / This.currentRatio.h
			});
		}
	}

	this.mouseUp = function(x, y){
		if(MULTI_CANVAS == true){
			This.tempctx.closePath();
			This.tempctx.stroke();
		}
		else{
			This.cc.ctx.closePath();
			This.cc.ctx.stroke();
		}
		
		This.cc.layerArray[This.cc.focusedLayer].setCutEdgePoints(This.cutEdgePoints);
		This.cc.draw();

		This.mousePressed = false;
	}
}


//=====================================================


function ResizeTool(collageCanvas){
	var This = this;
	this.cc = collageCanvas;
	this.mousePressed = false;
	this.lastX = 0;
	this.lastY = 0;
	this.currentOffset = null;
	this.currentImageSize = null;
	this.resizeType = RESIZE_LOWERRIGHT;

	if(MULTI_CANVAS == true)
		this.tempctx = null;

	this.init = function(){
		This.currentOffset = This.cc.layerArray[This.cc.focusedLayer].getPosition();
		This.currentImageSize = This.cc.layerArray[This.cc.focusedLayer].getImageSize();

		if(MULTI_CANVAS == true){
			This.tempctx = This.cc.canvasArray[This.cc.canvasArray.length-1];
			This.tempctx.strokeRect(This.currentOffset.x, This.currentOffset.y, This.currentImageSize.w, This.currentImageSize.h);
		}
		else{
			This.cc.ctx.strokeRect(This.currentOffset.x, This.currentOffset.y, This.currentImageSize.w, This.currentImageSize.h);
		}
	}

	this.mouseDown = function(x, y){

		This.lastX = x;
		This.lastY = y;

/*
		var center = {
			x: This.currentOffset.x + This.currentImageSize.w/2,
			y: This.currentOffset.y + This.currentImageSize.h/2
		};
		var angle = This.cc.layerArray[This.cc.focusedLayer].angle;
*/
		//var cutEdgePoints = This.cc.layerArray[This.cc.focusedLayer].cutEdgePoints;
		//if(cutEdgePoints == null){
			var upperLeft = {
				x: This.currentOffset.x,
				y: This.currentOffset.y
			};
			var upperRight = {
				x: This.currentOffset.x + This.currentImageSize.w,
				y: This.currentOffset.y
			};
			var lowerLeft = {
				x: This.currentOffset.x,
				y: This.currentOffset.y + This.currentImageSize.h
			};
			var lowerRight = {
				x: This.currentOffset.x + This.currentImageSize.w,
				y: This.currentOffset.y + This.currentImageSize.h
			};
		//	upperLeft = rotateAroundPoint(upperLeft, center, angle);
		//	upperRight = rotateAroundPoint(upperRight, center, angle);
		//	lowerLeft = rotateAroundPoint(lowerLeft, center, angle);
		//	lowerRight = rotateAroundPoint(lowerRight, center, angle);
		//	upperLeft = {
		//		x: Math.min(upperLeft.x, upperRight.x, lowerLeft.x, lowerRight.x),
		//		y: Math.min(upperLeft.y, upperRight.y, lowerLeft.y, lowerRight.y)
		//	};
		//	lowerLeft = {
		//		x: Math.max(upperLeft.x, upperRight.x, lowerLeft.x, lowerRight.x),
		//		y: Math.max(upperLeft.y, upperRight.y, lowerLeft.y, lowerRight.y)
		//	};
		//}
		/*else{
			var xmin = This.cc.width;
			var xmax = 0;
			var ymin = This.cc.height;
			var ymax = 0;
			for(var i=0;i<cutEdgePoints.length;i++){
				var pt = rotateAroundPoint(cutEdgePoints[i], center, angle);
				if(pt.x < xmin)
					xmin = pt.x;
				if(pt.x > xmax)
					xmax = pt.x;
				if(pt.y < ymin)
					ymin = pt.y;
				if(pt.y > ymax)
					ymax = pt.y;
			}
			var upperLeft = {
				x: xmin,
				y: ymin
			};
			var lowerRight = {
				x: xmax,
				y: ymax
			};
		}*/

		if(x > upperLeft.x - EDGE_MARGIN && x < upperLeft.x + EDGE_MARGIN){
			if(y > upperLeft.y - EDGE_MARGIN && y < upperLeft.y + EDGE_MARGIN){
				// upperLeft corner
				This.resizeType = RESIZE_UPPERLEFT;
				This.mousePressed = true;
			}
			else if(y > lowerRight.y - EDGE_MARGIN && y < lowerRight.y + EDGE_MARGIN){
				// lowerLeft corner
				This.resizeType = RESIZE_LOWERLEFT;
				This.mousePressed = true;
			}
			else if(upperLeft.y < y && y < lowerRight.y){
				// left edge
				This.resizeType = RESIZE_LEFT;
				This.mousePressed = true;
			}
		}
		else if(x > lowerRight.x - EDGE_MARGIN && x < lowerRight.x + EDGE_MARGIN){
			if(y > upperLeft.y - EDGE_MARGIN && y < upperLeft.y + EDGE_MARGIN){
				// upperRight corner
				This.resizeType = RESIZE_UPPERRIGHT;
				This.mousePressed = true;
			}
			else if(y > lowerRight.y - EDGE_MARGIN && y < lowerRight.y + EDGE_MARGIN){
				// lowerRight corner
				This.resizeType = RESIZE_LOWERRIGHT;
				This.mousePressed = true;
			}
			else if(upperLeft.y < y && y < lowerRight.y){
				// right edge
				This.resizeType = RESIZE_RIGHT;
				This.mousePressed = true;
			}
		}
		else if(upperLeft.x < x && x < lowerRight.x){
			if(y > upperLeft.y - EDGE_MARGIN && y < upperLeft.y + EDGE_MARGIN){
				// top edge
				This.resizeType = RESIZE_TOP;
				This.mousePressed = true;
			}
			else if(y > lowerRight.y - EDGE_MARGIN && y < lowerRight.y + EDGE_MARGIN){
				// bottom edge
				This.resizeType = RESIZE_BOTTOM;
				This.mousePressed = true;
			}
		}
	}

	this.mouseMove = function(x, y){
		if(This.mousePressed == true){

			var moveX = x - This.lastX;
			var moveY = y - This.lastY;
			var layer = This.cc.layerArray[This.cc.focusedLayer];

			switch(This.resizeType){
				case RESIZE_LEFT:
					layer.applyOffset(moveX, 0);
					layer.setImageSize(This.currentImageSize.w - moveX, This.currentImageSize.h);
					break;
				case RESIZE_RIGHT:
					layer.setImageSize(This.currentImageSize.w + moveX, This.currentImageSize.h);
					break;
				case RESIZE_TOP:
					layer.applyOffset(0, moveY);
					layer.setImageSize(This.currentImageSize.w, This.currentImageSize.h - moveY);
					break;
				case RESIZE_BOTTOM:
					layer.setImageSize(This.currentImageSize.w, This.currentImageSize.h + moveY);
					break;
				case RESIZE_UPPERLEFT:
					layer.applyOffset(moveX, moveY);
					layer.setImageSize(This.currentImageSize.w - moveX, This.currentImageSize.h - moveY);
					break;
				case RESIZE_UPPERRIGHT:
					layer.applyOffset(0, moveY);
					layer.setImageSize(This.currentImageSize.w + moveX, This.currentImageSize.h - moveY);
					break;
				case RESIZE_LOWERLEFT:
					layer.applyOffset(moveX, 0);
					layer.setImageSize(This.currentImageSize.w - moveX, This.currentImageSize.h + moveY);
					break;
				case RESIZE_LOWERRIGHT:
					layer.setImageSize(This.currentImageSize.w + moveX, This.currentImageSize.h + moveY);
					break;
			}

			// redraw everything
			This.cc.draw();

			// draw the rect
			This.currentOffset = layer.getPosition();
			This.currentImageSize = layer.getImageSize();
			if(MULTI_CANVAS == true){
				This.tempctx.strokeRect(This.currentOffset.x, This.currentOffset.y, This.currentImageSize.w, This.currentImageSize.h);
			}
			else{
				This.cc.ctx.strokeRect(This.currentOffset.x, This.currentOffset.y, This.currentImageSize.w, This.currentImageSize.h);
			}

			// update for next move
			This.lastX = x;
			This.lastY = y;
		}
	}

	this.mouseUp = function(x, y){
		This.mousePressed = false;
	}
}


//=====================================================


function RotateTool(collageCanvas){
	var This = this;
	this.cc = collageCanvas;
	this.mousePressed = false;
	this.lastX = 0;
	this.lastY = 0;
	this.currentOffset = null;
	this.currentImageSize = null;
	this.center = null;
	this.angle = 0;

	if(MULTI_CANVAS == true)
		this.tempctx = null;

	this.init = function(){
		This.currentOffset = This.cc.layerArray[This.cc.focusedLayer].getPosition();
		This.currentImageSize = This.cc.layerArray[This.cc.focusedLayer].getImageSize();
		This.center = {
			x: This.currentOffset.x + This.currentImageSize.w/2,
			y: This.currentOffset.y + This.currentImageSize.h/2
		};
		This.angle = This.cc.layerArray[This.cc.focusedLayer].angle;

		if(MULTI_CANVAS == true){
			This.tempctx = This.cc.canvasArray[This.cc.canvasArray.length-1];
			This.tempctx.save();
			This.tempctx.translate(This.center.x, This.center.y);
			This.tempctx.rotate(angle);
			This.tempctx.strokeRect(-This.currentImageSize.w/2, -This.currentImageSize.h/2, This.currentImageSize.w, This.currentImageSize.h);
			This.tempctx.restore();
		}
		else{
			This.cc.ctx.save();
			This.cc.ctx.translate(This.center.x, This.center.y);
			This.cc.ctx.rotate(angle);
			This.cc.ctx.strokeRect(-This.currentImageSize.w/2, -This.currentImageSize.h/2, This.currentImageSize.w, This.currentImageSize.h);
			This.cc.ctx.restore();
		}
	}

	this.mouseDown = function(x, y){
		var upperLeft = {
			x: This.currentOffset.x,
			y: This.currentOffset.y
		};
		var upperRight = {
			x: This.currentOffset.x + This.currentImageSize.w,
			y: This.currentOffset.y
		};
		var lowerLeft = {
			x: This.currentOffset.x,
			y: This.currentOffset.y + This.currentImageSize.h
		};
		var lowerRight = {
			x: This.currentOffset.x + This.currentImageSize.w,
			y: This.currentOffset.y + This.currentImageSize.h
		};

		var pts = new Array();
		pts.push(rotateAroundPoint(upperLeft, This.center, angle));
		pts.push(rotateAroundPoint(upperRight, This.center, angle));
		pts.push(rotateAroundPoint(lowerLeft, This.center, angle));
		pts.push(rotateAroundPoint(lowerRight, This.center, angle));

		for(var i=0;i<4;i++){
			if(x > pts[i].x - EDGE_MARGIN && x < pts[i].x + EDGE_MARGIN && y > pts[i].y - EDGE_MARGIN && y < pts[i].y + EDGE_MARGIN){
				This.mousePressed = true;
				This.lastX = x;
				This.lastY = y;
				break;
			}
		}
	}

	this.mouseMove = function(x, y){
		if(This.mousePressed == true){
			var vec1 = {
				x: This.lastX - This.center.x,
				y: This.lastY - This.center.y
			};
			var vec2 = {
				x: x - This.center.x,
				y: y - This.center.y
			};

			var cosTheta = dot(vec1, vec2)/(norm(vec1)*norm(vec2));
			var theta = Math.acos(cosTheta);
			var tmp = cross(vec1, vec2);
			if(tmp < 0)
				theta = -theta;
			This.cc.layerArray[This.cc.focusedLayer].applyAngleOffset(theta);
			var angle = This.cc.layerArray[This.cc.focusedLayer].angle;

			// redraw
			This.cc.draw();

			// draw the rect
			if(MULTI_CANVAS == true){
				This.tempctx.save();
				This.tempctx.translate(This.center.x, This.center.y);
				This.tempctx.rotate(angle);
				This.tempctx.strokeRect(-This.currentImageSize.w/2, -This.currentImageSize.h/2, This.currentImageSize.w, This.currentImageSize.h);
				This.tempctx.restore();
			}
			else{
				This.cc.ctx.save();
				This.cc.ctx.translate(This.center.x, This.center.y);
				This.cc.ctx.rotate(angle);
				This.cc.ctx.strokeRect(-This.currentImageSize.w/2, -This.currentImageSize.h/2, This.currentImageSize.w, This.currentImageSize.h);
				This.cc.ctx.restore();
			}

			This.lastX = x;
			This.lastY = y;
		}
	}

	this.mouseUp = function(x, y){
		This.mousePressed = false;
	}

}

// angle is in radius
function rotateAroundPoint(rotatingPoint, refPoint, angle){
	var refCoor = {
		x: rotatingPoint.x - refPoint.x,
		y: rotatingPoint.y - refPoint.y
	};
	var refRotCoor = {
		x: refCoor.x * Math.cos(angle) - refCoor.y * Math.sin(angle),
		y: refCoor.x * Math.sin(angle) + refCoor.y * Math.cos(angle)
	};
	return {
		x: refRotCoor.x + refPoint.x,
		y: refRotCoor.y + refPoint.y
	};
}

function dot(v1, v2){
	return v1.x * v2.x + v1.y * v2.y;
}

function norm(v){
	return Math.sqrt(v.x*v.x + v.y*v.y);
}

function cross(v1, v2){
	return v1.x*v2.y - v1.y*v2.x;
}


