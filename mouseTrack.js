/*   
 *  Copyright (C) 2013  AJ Ribeiro
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

var rmousedown=false, moved=false, lmousedown=false
var rocker=false, trail=false
var mx,my,nx,ny,lx,ly,phi
var move="", omove=""
var pi =3.14159
var suppress=1
var canvas, myGests, ginv
var link=null, ls, myColor="red", myWidth=3
var loaded=false
var rocked=false

function createCanvas()
{
    canvas = document.createElement('canvas');
    canvas.id = "gestCanvas"
    canvas.style.width=document.body.scrollWidth
    canvas.style.height=document.body.scrollHeight
    canvas.width=window.document.body.scrollWidth
    canvas.height=window.document.body.scrollHeight     
    canvas.style.left="0px";
    canvas.style.top="0px";
    canvas.style.overflow = 'visible';
    canvas.style.position = 'absolute';
    canvas.style.zIndex="10000"
}
function draw(x,y){
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

document.onmousedown = function(event){
    if(event.which == 1){
        lmousedown = true
    }
    else if(event.which == 3){
        rmousedown = true
    }

    //leftrock
    if(event.which == 1 && rmousedown && suppress && rocker){
        if(! loaded){
            loadOptions()
            loaded=true
        }
        move = 'back'
        rocked = true
        exeRock()
    }
    //right mouse click
    else if(event.which == 3 && suppress){
        if(! loaded){
            loadOptions()
            loaded=true
        }
        if(lmousedown && rocker){
            if(! loaded){
                loadOptions()
                loaded=true
            }
            move = 'forward'
            rocked = true
            exeRock()
        }
        else{
            my = event.pageX;
            mx = event.pageY;
            lx = my
            ly = mx
            move = ""
            omove=""
            moved=false
            if(event.target.href){
                link = event.target.href
            }
            else if(event.target.parentElement.href){
                link = event.target.parentElement.href
            }
            else{
                link = null
            }
        }
    }

};

document.onmousemove = function(event)
{
    //track the mouse if we are holding the right button
    if(rmousedown)
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
                omove = tmove
            }
            if(moved == false)
            {
                createCanvas()
                document.body.appendChild(canvas);
            }
            moved=true

            if(trail){
                draw(ny,nx)
            }

            mx = nx
            my = ny
        }
    }
};


document.onmouseup = function(event)
{
    if(event.which == 1)
        lmousedown = false

    //right mouse release
    if(event.which == 3){
        rmousedown=false
        if(moved){
            cvs = document.getElementById('gestCanvas')
            if(cvs)
            {
                document.body.removeChild(canvas)
                cvs.width = cvs.width;
            }
            exeFunc()
        }
        else if(rocked){
            rocked = false
        }
        else{
            --suppress
        }
    }
};
function exeRock()
{
    action = move
    if(action == "back")
    {
        window.history.back()
    }
    else if(action == "forward")
    {
        window.history.forward()
    }
}

function exeFunc()
{
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
            if(link == null){
                chrome.runtime.sendMessage({msg: "newtab"});
            }
            else{
                window.open(link)
            }
        }
        else if(action == "closetab"){
            chrome.runtime.sendMessage({msg: "closetab"});
        }
        else if(action == "lasttab"){
            chrome.runtime.sendMessage({msg: "lasttab"});
        }
        else if(action == "reloadall"){
            chrome.runtime.sendMessage({msg: "reloadall"});
        }

        else if(action == "closeall"){
            chrome.runtime.sendMessage({msg: "closeall"});
        }

        else if(action == "nexttab") {
            chrome.runtime.sendMessage({msg: "nexttab"});
        }

        else if(action == "prevtab"){
            chrome.runtime.sendMessage({msg: "prevtab"});
        }

        else if(action == "closeback"){
            chrome.runtime.sendMessage({msg: "closeback"});
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
    if(suppress)
        return false
    else{
        suppress++
        return true
    }
};

function loadOptions(name)
{
    chrome.runtime.sendMessage({msg: "colorCode"},
        function(response) {
            if(response){
                myColor = response.resp
            }
        });
    chrome.runtime.sendMessage({msg: "width"},
        function(response) {
            if(response){
                myWidth = response.resp
            }
        });
    chrome.runtime.sendMessage({msg: "gests"},
        function(response)
        {
            if(response)
                myGests = response.resp
            ginv = invertHash(myGests)
        });

    chrome.runtime.sendMessage({msg: "rocker"},
        function(response)
        {
            if(response)
                rocker = response.resp
            if(rocker == 'true') rocker = true
            else rocker = false
        });

    chrome.runtime.sendMessage({msg: "trail"},
        function(response)
        {
            if(response)
                trail = response.resp
            if(trail == 'true') trail = true
            else trail = false
        });
}

document.addEventListener('DOMContentLoaded', loadOptions);
