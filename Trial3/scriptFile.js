
//function Library
function dist( x1, y1, x2, y2){// this is the distance function
		var distance = Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
		return distance;
	}

function lineAngle(x0, y0, x1, y1){// This function calculates the inclination angle of any given line with positive x, placing the origin at (x0,y0)
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

function mod(vec){//gives the modulus of a vector
	var r = Math.sqrt((vec[0]*vec[0])+(vec[1]*vec[1]));
	return r;
}

function dot(vec1,vec2){//gives the dot product of two vectors
	var d = (vec1[0]*vec2[0])+(vec1[1]*vec2[1]);
	return d;
}

function vSum(vec1,vec2){//returns the sum of two vectors
	var vSum = [];
	vSum[0] = vec1[0]+vec2[0];
	vSum[1] = vec1[1]+vec2[1];
	return vSum;
}

function vDiff(vec1,vec2){//returns vector1-vector2 in that order
	var vDiff = [];
	vDiff[0] = vec1[0] - vec2[0];
	vDiff[1] = vec1[1] - vec2[1];
	return vDiff;
}

function renderAnchors(){//renders all the anchors in the anchor array
	bc.clearRect(0,0,baseCanvas.width,baseCanvas.height);
	for(var i in anchor){//this is for point anchors
		if(anchor[i][2] > 0){//this is for positive anchors to be painted blue, with their influence factor as alpha
			bc.fillStyle = 'rgba(0,0,255,'+Math.abs(anchor[i][2])+')';
			bc.fillRect(anchor[i][0]-10, anchor[i][1]-10,20,20);
		}else{//this is for positive anchors to be painted red, with their influence factor as alpha
			bc.fillStyle = 'rgba(255,0,0,'+Math.abs(anchor[i][2])+')';
			bc.fillRect(anchor[i][0]-10, anchor[i][1]-10,20,20);
		}
	}
	
	for(var i in lAnchor){
		/*var xx = ((lAnchor[i][2]*lAnchor[i][1])-(lAnchor[i][0]*lAnchor[i][3]))/(lAnchor[i][1]-lAnchor[i][3]);
		var yy = ((lAnchor[i][2]*lAnchor[i][1])-(lAnchor[i][0]*lAnchor[i][3]))/(lAnchor[i][2]-lAnchor[i][0]);//console.log(xx,yy);
		//calculating the Intercepts of the line parallel to the lAnchor on the axes
		if(Math.abs(xx) == Infinity){
			bc.moveTo(0,yy);
			bc.lineTo(baseCanvas.width,yy);
			bc.stroke();
		}else if(Math.abs(yy) == Infinity){
			bc.moveTo(xx,0);
			bc.lineTo(xx,baseCanvas.height);
			bc.stroke();
		}else{
			bc.moveTo(xx,0);
			bc.lineTo(0,yy);//console.log('here');
			bc.stroke();
		}*/
		bc.moveTo(lAnchor[i][0],lAnchor[i][1]);
		bc.lineTo(lAnchor[i][2],lAnchor[i][3]);
		bc.stroke();
		
	}
}

function lineDist(vec1,vec2,vec){//gives the perpendicular distance vector from point vec to line joining vec1 and vec2
	var w = [vec2[0]-vec1[0],vec2[1]-vec1[1]];//console.log(w);//this is the vector along the lAnchor
	var p = [vec[0]-vec1[0],vec[1]-vec1[1]];
	var d = [vec1[0]+((dot(p,w)/Math.pow(mod(w),2))*w[0])-vec[0],vec1[1]+((dot(p,w)/Math.pow(mod(w),2))*w[1])-vec[1]]; //console.log(d);
	return d;
}

var baseCanvas = document.getElementById('baseCanvas');
var bc = baseCanvas.getContext('2d');
bc.fillStyle = 'rgb(255,0,0)';
bc.strokeStyle = 'green';
bc.lineWidth = 6;

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
anchor['switchBoard2'] = [240,300,1];


var lAnchor = [];
lAnchor['window'] = [500,100,500,235,1];

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

function uSum2(x,y){//measures the sum of unit vectors from all the anchors but handles lAnchors as infinite lines. this is not used currently
	var vecSum = [0,0];//vector sum of unit vectors in [i,j] format
	var p = [x,y];
	
	for(var a in anchor){
		vecSum[0] += anchor[a][2]*Math.cos(lineAngle(x,y,anchor[a][0],anchor[a][1]));
		vecSum[1] += anchor[a][2]*Math.sin(lineAngle(x,y,anchor[a][0],anchor[a][1]));
	}
	
	for(var l in lAnchor){
		var e1 = [lAnchor[l][0],lAnchor[l][1]];
		var e2 = [lAnchor[l][2],lAnchor[l][3]];//two ends of the lAnchor
		var d = lineDist(e1,e2,p);
		//console.log(d);
		if(mod(d)==0){//in case p lies on the line Anchor, denominator should not be zero.
			vecSum[0] += (lAnchor[l][4]*d[0]);//this value is actually a zero
			vecSum[1] += (lAnchor[l][4]*d[1]);//this value is also a zero
		}else{
			vecSum[0] += (lAnchor[l][4]*d[0])/mod(d);
			vecSum[1] += (lAnchor[l][4]*d[1])/mod(d);
		}
	}
	/*Ic.beginPath();
	Ic.moveTo(x,y);
	Ic.lineTo(x+(10*vecSum[0]),y+(10*vecSum[1]));
	Ic.stroke();*/
	return vecSum;
}

function uSum(x,y){//measures the sum of unit vectors from all the anchors but handles the lAnchors as finite segments. this is used currently
	var vecSum = [0,0];//vector sum of unit vectors in [i,j] format
	var p = [x,y];
	
	for(var a in anchor){
		vecSum[0] += anchor[a][2]*Math.cos(lineAngle(x,y,anchor[a][0],anchor[a][1]));
		vecSum[1] += anchor[a][2]*Math.sin(lineAngle(x,y,anchor[a][0],anchor[a][1]));
	}
	
	for(var l in lAnchor){
		var e1 = [lAnchor[l][0],lAnchor[l][1]];
		var e2 = [lAnchor[l][2],lAnchor[l][3]];//two ends of the lAnchor
		var Ln = vDiff(e2,e1);//line Anchor itself
		var d = lineDist(e1,e2,p);
		var ln1 = vDiff(vDiff(e1,p),d); 
		var ln2 = vDiff(vDiff(e2,p),d);
		var r1,r2;//weights of the two portions of the line
		if(mod(d) != 0){
			r1 = (dot(vDiff(p,e1),vDiff(e2,e1))/mod(Ln))/mod(Ln);
			r2 = (dot(vDiff(p,e2),vDiff(e1,e2))/mod(Ln))/mod(Ln);
			A1 = Math.atan(mod(vDiff(vDiff(e1,p),d))/mod(d));
			A2 = Math.atan(mod(vDiff(vDiff(e2,p),d))/mod(d));
		
			var vC=[0,0];
			if(mod(ln1) != 0){
				vC[0] += (r1*(1/Math.tan(A1))*Math.log(Math.abs(Math.tan(A1)+(1/Math.cos(A1)))))*(d[0]/mod(d));
				vC[1] += (r1*(1/Math.tan(A1))*Math.log(Math.abs(Math.tan(A1)+(1/Math.cos(A1)))))*(d[1]/mod(d));
				vC[0] += (r1*(1/Math.tan(A1))*((1/Math.cos(A1))-1))*(ln1[0]/mod(ln1));
				vC[1] += (r1*(1/Math.tan(A1))*((1/Math.cos(A1))-1))*(ln1[1]/mod(ln1));
			}
			if(mod(ln2) != 0){
				vC[0] += (r2*(1/Math.tan(A2))*Math.log(Math.abs(Math.tan(A2)+(1/Math.cos(A2)))))*(d[0]/mod(d));
				vC[1] += (r2*(1/Math.tan(A2))*Math.log(Math.abs(Math.tan(A2)+(1/Math.cos(A2)))))*(d[1]/mod(d));
				vC[0] += (r2*(1/Math.tan(A2))*((1/Math.cos(A2))-1))*(ln2[0]/mod(ln2));
				vC[1] += (r2*(1/Math.tan(A2))*((1/Math.cos(A2))-1))*(ln2[1]/mod(ln2));
			}
		}else if(mod(d) ==0){
				vC[0] = ((e1[0]+e2[0])/2)-p[0];
				vC[0] = ((e1[1]+e2[1])/2)-p[1];
		}
		vecSum[0] += (lAnchor[l][4]*vC[0])/mod(vC);
		vecSum[1] += (lAnchor[l][4]*vC[1])/mod(vC);
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
	var itNum = 2000;//number of movement Iterations to be carried out
	var vec = [];//unit vector perpendicular to uSum
	var uVec = [];//unit vector parallel to uSum
	var maxX,maxY,minX,minY;//used to check if the table corners lie inside the room
	
	x = x1;//xSum/n;//these two line define the weighted mean coordinates
	y = y1;//ySum/n;
	
	var minUSum=dist(0,0,uSum(x,y)[0],uSum(x,y)[1]);//using the distance function to calculate
	var iter = 0;
	Ic.clearRect(0,0,itemCanvas.width,itemCanvas.height);
	function move(){setTimeout(function(){//console.log(x,y);
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
		iter++;
		if(iter < itNum){move();}else if(iter == itNum){console.log('done');}
	},30*((itNum-iter)/itNum));}//this is the number of milliseconds between consecutive frames of animation. I am trying to speed up the 
	move();				//as it progresses because the velocity of the table is decreasing.
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