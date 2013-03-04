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
var move="", omove=""
var pi =3.14159
var suppress=1
var canvas, myGests, ginv
var link, ls, myColor="red", myWidth=3
var loaded=false

function invertHash(hash)
{
  inv = {}
  for(key in hash)
    inv[hash[key]] = key
  return inv
}

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
	ctx.strokeStyle = myColor
	ctx.lineWidth = myWidth
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
		if(! loaded)
		{
			loadOptions()
			loaded=true
		}
		my = event.pageX;
		mx = event.pageY;
		lx = my
		ly = mx
		move = ""
		omove=""
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
				// if(moved)
				// 	link.href='Gesture: '+move
				omove = tmove
			}
			if(moved == false)
			{
				
				createCanvas()
				// link = document.createElement('a');
				// link.href='Gesture: '+move
				// link.appendChild(canvas)
				// document.body.appendChild(link);
				document.body.appendChild(canvas);
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
				// document.body.removeChild(link)
				document.body.removeChild(canvas)
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
	console.log('exeFunc '+move)
	if(ginv[move])
	{
		action = ginv[move]
		if(action == "back")
		{
			window.history.back()
		}
		else if(action == "forward")
		{
			window.history.forward()
		}
		else if(action == "newtab")
		{
			chrome.extension.sendMessage({msg: "newtab"}, 
				function(response)
				{
					if(response != null)
						console.log(response.resp);
					else
					{
						console.log('problem executing open tab')
						if(chrome.extension.lastError)
							console.log(chrome.extension.lastError.message)
					}
				});
		}
	 	else if(action == "closetab") 
		{
			chrome.extension.sendMessage({msg: "closetab"}, 
				function(response)
				{
					console.log(response.resp);
				});
		}

	 	else if(action == "reloadall") 
		{
			chrome.extension.sendMessage({msg: "reloadall"}, 
				function(response)
				{
					console.log(response.resp);
				});
		}

	 	else if(action == "closeall") 
		{
			chrome.extension.sendMessage({msg: "closeall"}, 
				function(response)
				{
					console.log(response.resp);
				});
		}

	 	else if(action == "nexttab") 
		{
			chrome.extension.sendMessage({msg: "nexttab"}, 
				function(response)
				{
					console.log(response.resp);
				});
		}

	 	else if(action == "prevtab") 
		{
			chrome.extension.sendMessage({msg: "prevtab"}, 
				function(response)
				{
					console.log(response.resp);
				});
		}

	 	else if(action == "closeback") 
		{
			console.log('closeback')
			chrome.extension.sendMessage({msg: "closeback"}, 
				function(response)
				{
					console.log(response.resp);
				});
		}


	 	else if(action == "scrolltop") 
			window.scrollTo(0,0)

		else if(action == "scrollbottom") 
			window.scrollTo(0,document.body.scrollHeight)

		else if(action == "reload")
			window.location.reload()

		else if(action == "stop")
			window.stop()

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

function loadOptions(name)
{
	chrome.extension.sendMessage({msg: "colorCode"}, 
		function(response) 
		{
			if(response)
				myColor = response.resp
			else
				console.log('error getting colorCode')
		});
	chrome.extension.sendMessage({msg: "width"}, 
		function(response) 
		{
			if(response)
				myWidth = response.resp
			else
				console.log('error getting width')
		});
	chrome.extension.sendMessage({msg: "gests"}, 
		function(response) 
		{
			console.log('getting gests '+response.resp)
			if(response)
				myGests = response.resp
			else
				console.log('error getting gestures')
			ginv = invertHash(myGests)
		});
}

document.addEventListener('DOMContentLoaded', loadOptions);
