
//function Library
function dist( x1, y1, x2, y2){// this is the distance function
		var distance = Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
		return distance;
	}

function lineAngle(x0, y0, x1, y1){// This function calculates the inclination angle of any given line with positive x
		var angle;
		
		if(x1>x0){
			if(y1>y0){//quadrant 1
				angle = Math.atan((y1-y0)/(x1-x0));
			}
			else if(y1==y0){//on +ve x axis
					angle = 0;
			}
			else{//quadrant 4
				angle = (Math.atan((y1-y0)/(x1-x0)))+(2*Math.PI);
			}
		}
		else if(x1==x0){
			if(y1>y0){//on +ve y axis
				angle = 0.5*Math.PI;
			}
			else if(y1==y0){
				angle = null;
			}
			else{// on -ve y axis
				angle = 1.5*Math.PI;
			}
		}
		else{
			if(y1>y0){//quadrant 2
				angle = (1*Math.PI)+(Math.atan((y1-y0)/(x1-x0)));
			}
			else if(y1==y0){//on -ve x axis
				angle = 1*Math.PI;
			}
			else{//quadrant 3
				angle = (1*Math.PI)+(Math.atan((y1-y0)/(x1-x0)));
			}
		}
			
		return angle;
	}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function HSLtoHex(h, s, l){
	var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
   // return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
   return "#" + componentToHex(Math.round(r * 255)) + componentToHex(Math.round(g * 255)) + componentToHex(Math.round(b * 255));
}

function renderAnchors(){
	bc.clearRect(0,0,baseCanvas.width,baseCanvas.height);
	for(var i in anchor){
		bc.fillRect(anchor[i][0]-10, anchor[i][1]-10,20,20);
	}
}

var baseCanvas = document.getElementById('baseCanvas');
var bc = baseCanvas.getContext('2d');
bc.fillStyle = 'rgb(255,0,0)';
bc.strokeStyle = 'black';
bc.lineWidth = 2;

var indexCanvas = document.getElementById('indexCanvas');
var ic = indexCanvas.getContext('2d');
ic.fillStyle = 'black';
ic.strokeStyle = 'black';
ic.lineWidth = 1;

var itemCanvas = document.getElementById('itemCanvas');
var Ic = itemCanvas.getContext('2d');
Ic.fillStyle = 'rgba(132,29,29,0.7)';
Ic.strokeStyle = 'black';
Ic.lineWidth = 1;

var anchor = [];
anchor['switchBoard'] = [440,300,1];
anchor['windowEnd1'] = [500,100,1];
anchor['windowEnd2'] = [500,235,1];

var noTool = document.getElementById('none');
var placeAnchor = document.getElementById('placeAnchor');
var anchorName = document.getElementById('anchorName');

function addAnchor(str,x,y,n){
	if(!isNaN(x) && !isNaN(y) && !isNaN(y)){
		if(typeof str === 'string'){
			anchor[str] = [x,y,n];
		}else{
			anchor[toString(str)] = [x,y,n];
		}
	}
	renderAnchors();
}

var indexData = [];//values of the field

renderAnchors();

function uSum(x,y){//measures the sum of unit vectors from all the anchors
	var vecSum = [0,0];//vector sum of unit vectors in [i,j] format
	
	for(a in anchor){
		vecSum[0] += anchor[a][2]*Math.cos(lineAngle(x,y,anchor[a][0],anchor[a][1]));
		vecSum[1] += anchor[a][2]*Math.sin(lineAngle(x,y,anchor[a][0],anchor[a][1]));
	}
	
	/*Ic.beginPath();
	Ic.moveTo(x,y);
	Ic.lineTo(x+(10*vecSum[0]),y+(10*vecSum[1]));
	Ic.stroke();*/
	
	return vecSum;
}

function moveTableFrom(x1,y1,l,w){//travels from a given point towards the decreasing sum of unit vectors until zero is reached
	var ln = Math.max(l,w);
	var wd = Math.min(l,w);
	var x,y;
	var stp=2;//this is the length of each step
	var vec = [];//unit vector perpendicular to uSum
	var uVec = [];//unit vector parallel to uSum
	var maxX,maxY,minX,minY;//used to check if the table corners lie inside the room
	
	x = x1;//xSum/n;//these two line define the weighted mean coordinates
	y = y1;//ySum/n;
	
	var minUSum=dist(0,0,uSum(x,y)[0],uSum(x,y)[1]);//using the distance function to calculate
	
	for(var i=0;i<300;i++){//console.log(x,y);
		if(minUSum > dist(0,0,uSum(x,y)[0],uSum(x,y)[1])){
			minUSum = dist(0,0,uSum(x,y)[0],uSum(x,y)[1]);
		}
		
		Ic.clearRect(0,0,itemCanvas.width,itemCanvas.height);
		Ic.translate(x,y);
		Ic.rotate(lineAngle(0,0,uSum(x,y)[0],uSum(x,y)[1])-(Math.PI/2));
		Ic.fillRect(-ln/2,-wd/2,ln,wd);
		Ic.strokeRect(-ln/2,-wd/2,ln,wd);
		Ic.rotate((Math.PI/2)-lineAngle(0,0,uSum(x,y)[0],uSum(x,y)[1]));
		Ic.translate(-x,-y);
		
		ic.beginPath();
		ic.moveTo(x,y);
		ic.lineTo(x+stp*uSum(x,y)[0],y+stp*uSum(x,y)[1]);
		ic.stroke();
	
		x += stp*uSum(x,y)[0];
		y += stp*uSum(x,y)[1];
		//checking that all the four corners lie inside the room
		uVec[0] = uSum(x,y)[0]/dist(0,0,uSum(x,y)[0],uSum(x,y)[1]);
		uVec[1] = uSum(x,y)[1]/dist(0,0,uSum(x,y)[0],uSum(x,y)[1]);
		vec[0] = -uVec[1];
		vec[1] = uVec[0];
		maxX = Math.max(x+(wd*uVec[0]*0.5)+(ln*vec[0]*0.5),
						x-(wd*uVec[0]*0.5)+(ln*vec[0]*0.5),
						x+(wd*uVec[0]*0.5)-(ln*vec[0]*0.5),
						x-(wd*uVec[0]*0.5)-(ln*vec[0]*0.5));
		minX = Math.min(x+(wd*uVec[0]*0.5)+(ln*vec[0]*0.5),
						x-(wd*uVec[0]*0.5)+(ln*vec[0]*0.5),
						x+(wd*uVec[0]*0.5)-(ln*vec[0]*0.5),
						x-(wd*uVec[0]*0.5)-(ln*vec[0]*0.5));
		maxY = Math.max(y+(wd*uVec[1]*0.5)+(ln*vec[1]*0.5),
						y-(wd*uVec[1]*0.5)+(ln*vec[1]*0.5),
						y+(wd*uVec[1]*0.5)-(ln*vec[1]*0.5),
						y-(wd*uVec[1]*0.5)-(ln*vec[1]*0.5));
		minY = Math.min(y+(wd*uVec[1]*0.5)+(ln*vec[1]*0.5),
						y-(wd*uVec[1]*0.5)+(ln*vec[1]*0.5),
						y+(wd*uVec[1]*0.5)-(ln*vec[1]*0.5),
						y-(wd*uVec[1]*0.5)-(ln*vec[1]*0.5));
		if(maxX > itemCanvas.width){
			x -= maxX-itemCanvas.width;
		}
		if(minX < 0){
			x -= minX;
		}
		if(maxY > itemCanvas.height){
			y -= maxY-itemCanvas.height;
		}
		if(minY < 0){
			y -= minY;
		}
		//console.log(maxX,maxY,minX,minY,x,y);
	}
}

function placeTable(l,w){
	var ln = Math.max(l,w);
	var wd = Math.min(l,w);
	var xSum=0,ySum=0,n=0;
	var x,y;
	var stp=2;//this is the length of each step
	var vec = [];//unit vector perpendicular to uSum
	var uVec = [];//unit vector parallel to uSum
	var maxX,maxY,minX,minY;//used to check if the table corners lie inside the room
	
	for(a in anchor){
		xSum +=  anchor[a][2]*anchor[a][0];
		ySum +=  anchor[a][2]*anchor[a][1];
		n += anchor[a][2];
	}
	
	x = xSum/n;//these two line define the weighted mean coordinates
	y = ySum/n;
	
	var minUSum=dist(0,0,uSum(x,y)[0],uSum(x,y)[1]);//using the distance function to calculate
	
	for(var i=0;i<300;i++){//console.log(x,y);
		if(minUSum > dist(0,0,uSum(x,y)[0],uSum(x,y)[1])){
			minUSum = dist(0,0,uSum(x,y)[0],uSum(x,y)[1]);
		}
		
		Ic.clearRect(0,0,itemCanvas.width,itemCanvas.height);
		Ic.translate(x,y);
		Ic.rotate(lineAngle(0,0,uSum(x,y)[0],uSum(x,y)[1])-(Math.PI/2));
		Ic.fillRect(-ln/2,-wd/2,ln,wd);
		Ic.strokeRect(-ln/2,-wd/2,ln,wd);
		Ic.rotate((Math.PI/2)-lineAngle(0,0,uSum(x,y)[0],uSum(x,y)[1]));
		Ic.translate(-x,-y);
		
		ic.beginPath();
		ic.moveTo(x,y);
		ic.lineTo(x+stp*uSum(x,y)[0],y+stp*uSum(x,y)[1]);
		ic.stroke();
	
		x += stp*uSum(x,y)[0];
		y += stp*uSum(x,y)[1];
		//checking that all the four corners lie inside the room
		uVec[0] = uSum(x,y)[0]/dist(0,0,uSum(x,y)[0],uSum(x,y)[1]);
		uVec[1] = uSum(x,y)[1]/dist(0,0,uSum(x,y)[0],uSum(x,y)[1]);
		vec[0] = -uVec[1];
		vec[1] = uVec[0];
		maxX = Math.max(x+(wd*uVec[0]*0.5)+(ln*vec[0]*0.5),
						x-(wd*uVec[0]*0.5)+(ln*vec[0]*0.5),
						x+(wd*uVec[0]*0.5)-(ln*vec[0]*0.5),
						x-(wd*uVec[0]*0.5)-(ln*vec[0]*0.5));
		minX = Math.min(x+(wd*uVec[0]*0.5)+(ln*vec[0]*0.5),
						x-(wd*uVec[0]*0.5)+(ln*vec[0]*0.5),
						x+(wd*uVec[0]*0.5)-(ln*vec[0]*0.5),
						x-(wd*uVec[0]*0.5)-(ln*vec[0]*0.5));
		maxY = Math.max(y+(wd*uVec[1]*0.5)+(ln*vec[1]*0.5),
						y-(wd*uVec[1]*0.5)+(ln*vec[1]*0.5),
						y+(wd*uVec[1]*0.5)-(ln*vec[1]*0.5),
						y-(wd*uVec[1]*0.5)-(ln*vec[1]*0.5));
		minY = Math.min(y+(wd*uVec[1]*0.5)+(ln*vec[1]*0.5),
						y-(wd*uVec[1]*0.5)+(ln*vec[1]*0.5),
						y+(wd*uVec[1]*0.5)-(ln*vec[1]*0.5),
						y-(wd*uVec[1]*0.5)-(ln*vec[1]*0.5));
		if(maxX > itemCanvas.width){
			x -= maxX-itemCanvas.width;
		}
		if(minX < 0){
			x -= minX;
		}
		if(maxY > itemCanvas.height){
			y -= maxY-itemCanvas.height;
		}
		if(minY < 0){
			y -= minY;
		}
		//console.log(maxX,maxY,minX,minY,x,y);
	}
}

$('.canvas').click(function(e){
	var mouse1X, mouse1Y;
	if(placeAnchor.checked){
		mouse1X = (e.pageX - this.offsetLeft)/2;
		mouse1Y = (e.pageY - this.offsetTop)/2;
		
		addAnchor(anchorName.value,mouse1X,mouse1Y,1);
	}
});