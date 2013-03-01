/*   
 * 	Copyright (C) 2013  AJ Ribeiro
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.   
*/

var mousedown=false, moved=false
var mx,my,nx,ny,lx,ly,phi
var move="", omove
var pi =3.14159
var suppress=1
var canvas
var link

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
	console.log('mousedown '+suppress)
	//right mouse click
	if(event.which == 3 && suppress)
	{
		my = event.pageX;
		mx = event.pageY;
		lx = my
		ly = mx
		move = ""
		mousedown=true
		moved=false
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
			phi = Math.atan2(ny-my,nx-mx)
			if(phi < 0) phi += 2.*pi
			if(phi >= pi/4. && phi < 3.*pi/4.)
				var tmove="R"
			else if(phi >= 3.*pi/4. && phi < 5.*pi/4.)
				var tmove="U"
			else if(phi >= 5.*pi/4. && phi < 7.*pi/4.)
				var tmove="L"
			else if(phi >= 7.*pi/4. || phi < pi/4.)
				var tmove="D"
			if(tmove != omove)
			{
				move += tmove
				if(moved)
					link.href='Gesture: '+move
				omove = tmove
			}
			if(moved == false)
			{
				
				createCanvas()
				link = document.createElement('a');
				link.href='Gesture: '+move
				link.appendChild(canvas)
				document.body.appendChild(link);
			}
			moved=true
			draw(ny,nx)
			mx = nx
			my = ny
		}
	}
};


document.onmouseup = function(event)
{
	console.log('mouse is up '+suppress)
	//right mouse click
	if(event.which == 3)
	{
		console.log('suppress is '+suppress)
		mousedown=false
		if(moved)
		{
			cvs = document.getElementById('gestCanvas')
			if(cvs)
			{
				document.body.removeChild(link)
				cvs.width = cvs.width;
			}
			exeFunc()
		}
		else
		{
			--suppress
			console.log('no move '+suppress)
			$('#target').mousedown(which=3);
		}
	}
};


function exeFunc()
{
	if(move == "L")
	{
		window.history.back()
	}
	else if(move == "R")
	{
		window.history.forward()
	}
	else if(move == "U")
	{
		chrome.extension.sendMessage({msg: "newtab"}, 
			function(response)
			{
				console.log(response.resp);
			});
	}
 	else if(move == "UD") 
	{
		chrome.extension.sendMessage({msg: "closetab"}, 
			function(response)
			{
				console.log(response.resp);
			});
	}
	else if(move == "RDL")
	{
		window.location.reload()
	}
}


document.oncontextmenu = function()
{
	console.log('ctx menu suppress is '+suppress)
	if(suppress)
	{
		return false
	}
	else
	{
		console.log("open it");
		suppress++
		return true
	}
};
