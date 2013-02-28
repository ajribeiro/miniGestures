var mousedown = false
var mx,my,nx,ny,lx,ly,count,phi
var move="", omove, tmove
var pi =3.14159
var moved=true
var canvas

function createCanvas()
{
	canvas = document.createElement('canvas');
	canvas.id = "gestCanvas"
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
	var ctx = document.getElementById('gestCanvas').getContext('2d');
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
// 	if(event.which == 3)
		
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
		cvs = document.getElementById('gestCanvas')
		if(cvs)
		{
			document.body.removeChild(cvs)
			cvs.width = cvs.width;
		}
		mousedown = false
		if(move != "")
		{
			exeFunc()
		}
		else
		{
			moved=false
			chrome.extension.sendMessage({msg: "context"}, 
			function(response)
			{
				console.log(response.resp);
			});
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
		var r = Math.sqrt(Math.pow(nx-mx,2)+Math.pow(ny-my,2))
		if(r > 16)
		{
			draw(ny,nx)
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
	if(move == "left")
	{
		window.history.back()
	}
	else if(move == "right")
	{
		window.history.forward()
	}
	else if(move == "up")
	{
		chrome.extension.sendMessage({msg: "newtab"}, 
			function(response)
			{
				console.log(response.resp);
			});
	}
 	else if(move == "updown") 
	{
		chrome.extension.sendMessage({msg: "closetab"}, 
			function(response)
			{
				console.log(response.resp);
			});
	}
	else if(move == "rightdownleft")
	{
		window.location.reload()
	}
}


document.oncontextmenu = function()
{
	return false;
};
