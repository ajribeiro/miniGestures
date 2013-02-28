var mousedown = false
var mx,my,nx,ny,lx,ly,count,phi
var move="", omove, tmove
var pi =3.14159
var moved=true
var canvas, canvasContainer

function createCanvas()
{
      canvas = document.createElement('canvas');    
	  canvas.style.width=document.width
	  canvas.style.height=document.height
		canvas.width=document.width
		canvas.height=document.height	  
		canvas.style.left="0px";
		canvas.style.top="0px";
      canvas.style.overflow = 'visible';
      canvas.style.position = 'absolute';
	  canvas.style.zIndex="1000"
}
function draw(x,y)
{
	var ctx = canvas.getContext('2d');
	// alert('draw')
	// alert(ctx)
	// ctx.style.zIndex  = 1000"
	ctx.beginPath();
	ctx.strokeStyle="ff3300"
	ctx.lineWidth=3
	ctx.moveTo(lx,ly);
	ctx.lineTo(x,y);
	ctx.stroke()
    lx=x
	ly=y
}
document.onmousedown = function(event)
{
	//right mouse click
	if(event.which == 3 && moved)
	{
		createCanvas()
		document.body.appendChild(canvas);
		moved=true
		count = 0
		my = event.pageX;
		mx = event.pageY;
		lx = my
		ly = mx
		mousedown = true
	}
};

document.onmouseup = function(event)
{
	//right mouse click
	if(event.which == 3)
	{
		document.body.removeChild(canvas)
		canvas.width = canvas.width;
		mousedown = false
		if(move != "")
		{
			exeFunc()
		}
		else
		{
			moved=false
			document.trigger({type: 'mousedown',which: 3});
		}
	}
};


document.onmousemove = function(event)
{
	//track the mouse if we are holding the right button
	if(mousedown)
	{
		ny = event.pageX;
		nx = event.pageY;
		draw(ny,nx)
		var r = Math.sqrt(Math.pow(nx-mx,2)+Math.pow(ny-my,2))
		if(r > 9)
		{
			phi = Math.atan2(ny-my,nx-mx)
			if(phi < 0) phi += 2.*pi
			if(phi >= pi/4. && phi < 3.*pi/4.)
				tmove="right"
			else if(phi >= 3.*pi/4. && phi < 5.*pi/4.)
				tmove="up"
			else if(phi >= 5.*pi/4. && phi < 7.*pi/4.)
				tmove="left"
			else if(phi >= 7.*pi/4. || phi < pi/4.)
				tmove="down"
			mx = nx
			my = ny
			if(tmove != omove)
			{
				move += tmove
				omove = tmove
			}
		}
	}
};

function exeFunc()
{
	if(move == "left") window.history.back()
	else if(move == "right") window.history.forward()
	else if(move == "up") window.open()
 	else if(move == "updown") 
	{
		 window.open('','_self',''); 
		 self.close()
	}
	move=""
}


document.oncontextmenu = function()
{
	if(moved)
		return false;
	else
		moved=true
		return true
};
