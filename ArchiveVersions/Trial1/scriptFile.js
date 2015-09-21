
//function Library
function dist( x1, y1, x2, y2){// this is the distance function
		var distance = Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
		return distance;
	}

function lineAngle(x0, y0, x1, y1){// This function calculates the inclination angle of any given line
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

function componentToHex(c) {//this is color conversion function
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function HSLtoHex(h, s, l){// this is also a color conversion function
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

function renderAnchors(){// this function renders the anchors from the coordinate data in the array
	for(var i in anchor){
		bc.fillRect(anchor[i][0]-10, anchor[i][1]-10,20,20);
	}
}

function index(x,y) {
	var ind = 1;
	for(var a in anchor){
		ind /= Math.exp(0.005*dist(x,y,anchor[a][0],anchor[a][1])*anchor[a][2]);
	}
	return ind;
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
ic.lineWidth = 2;

var itemCanvas = document.getElementById('itemCanvas');
var Ic = itemCanvas.getContext('2d');
Ic.fillStyle = 'brown';
Ic.strokeStyle = 'black';
Ic.lineWidth = 1;

var anchor = [];
anchor['switchBoard'] = [440,300,1];
anchor['windowEnd1'] = [500,100,1];
anchor['windowEnd2'] = [500,235,1]

var indexData = [];//values of the field

renderAnchors();
function renderIndexes(){
var imgData = ic.getImageData(0,0,indexCanvas.width,indexCanvas.height);
imgData.data = [0];
for(var xx=0; xx < indexCanvas.width; xx++ ){
	var tempAr = [];
	for(var yy=0; yy < indexCanvas.height; yy++ ){
		imgData.data[((yy*indexCanvas.width)+xx)*4 + 3] = 255*index(xx,yy);
		tempAr.push(index(xx,yy));
	}
	indexData.push(tempAr);
}

ic.putImageData(imgData,0,0);
}

function placeTable(l,w){
	var length = Math.max(l,w);console.log(length);
	var width = Math.min(l,w);console.log(width);
	
	var score = 0;
	var isHor = false;
	var posX,posY=0;
	
	Ic.clearRect(0,0,itemCanvas.width,itemCanvas.height);
	
	for(var X = 0; X < itemCanvas.width;X++){
	for(var Y = 0; Y < itemCanvas.height;Y++){
		
		var sum1 = 0;
		var sum2 = 0;
		
		if((X+length <= itemCanvas.width)&&(Y+width <= itemCanvas.height)){
			for(var xx = X; xx < X+length; xx++){
			for(var yy = Y; yy < Y+width; yy++){
				sum1 += indexData[xx][yy];
			}
			}
		}else{sum1=0;}
		
		if((X+width <= itemCanvas.width)&&(Y+length <= itemCanvas.height)){
			for(var xx = X; xx < X+width; xx++){
			for(var yy = Y; yy < Y+length; yy++){
				sum2 += indexData[xx][yy];
			}
			}
		}else{sum2=0;}
		
		if(Math.max(sum1,sum2) > score){
			score = Math.max(sum1,sum2);
			posX = X; posY = Y;
			if(sum1 > sum2){
				isHor = true;
			}else{
				isHor = false;
			}
		}
		//console.log(score+' - '+isHor+' - '+posX+' - '+posY);
	}
	}
	
	if(isHor){
		Ic.fillRect(posX,posY,length,width);
		Ic.strokeRect(posX,posY,length,width);
	}else{
		Ic.fillRect(posX,posY,width,length);
		Ic.strokeRect(posX,posY,width,length);
	}
}

renderIndexes();
//placeTable(120,80);