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


chrome.tabs.onRemoved.addListener(
    function(tabId, removeInfo){
        chrome.tabs.get(tabId, function(tab){
            x = tabId.toString()
            chrome.storage.local.get(x,function(items){
                chrome.storage.local.set({"lasturl":items[x].slice(9,items[x].length)},function (){});
                chrome.storage.local.remove(x, function(Items){});
            });
        });
    });


chrome.tabs.onUpdated.addListener(
    function(tabId,changeInfo,tab){
        chrome.tabs.get(tabId, function(tab){
            var kk = tabId.toString()
            var x = {}
            x[kk] += tab.url
            chrome.storage.local.set(x,function(){});
        });

    });



chrome.extension.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(request.msg == "newtab"){
            chrome.tabs.create({})
            sendResponse({resp: "tab open"});
        }

        if(request.msg == "closetab"){
            chrome.tabs.getSelected(null, 
            function(tab){
                chrome.tabs.remove(tab.id);
            });
            sendResponse({resp: "tab closed"});
        }

        if(request.msg == "colorCode")
            sendResponse({resp: localStorage["colorCode"]});
        
        if(request.msg == "width")
            sendResponse({resp: localStorage["width"]});

        if(request.msg == "gests")
        {
          gests = {}
          for(key in localStorage)
          {
            if(key == "colorCode" || key == "width")
              continue
            gests[key]=localStorage[key]
          }
          sendResponse({resp: gests});
        }

        if(request.msg == "rocker")
        {
          sendResponse({resp: localStorage["rocker"]});
        }

        if(request.msg == "trail")
        {
          sendResponse({resp: localStorage["trail"]});
        }

        if(request.msg == "lasttab")
        {
            chrome.storage.local.get('lasturl', function(result){
                chrome.tabs.create({'url':result.lasturl}, function(tab){})
            });
            sendResponse({resp:"tab opened"})
        }


        if(request.msg == "reloadall")
        {
            chrome.tabs.getAllInWindow(null, 
                function(tabs) {
                    for(var i = 0; i < tabs.length; i++)
                        chrome.tabs.update(tabs[i].id, {url: tabs[i].url});
                });
            sendResponse({resp:"tabs reloaded"})
        }

    if(request.msg == "nexttab")
        {
            chrome.tabs.getSelected(null, 
                function(tab) {
                    chrome.tabs.getAllInWindow(null, 
                        function(tabs) {
                            for(var i = 0; i < tabs.length; i++){
                                if(tabs[i].id == tab.id){
                                    if(i == tabs.length-1)
                                        chrome.tabs.update(tabs[0].id,{active:true})
                                    else
                                        chrome.tabs.update(tabs[i+1].id,{active:true})
                                    break
                                }
                            }
                        });
                });
            sendResponse({resp: "tab switched"});
        }

        if(request.msg == "prevtab")
        {
            chrome.tabs.getSelected(null, 
                function(tab) 
                {
                    chrome.tabs.getAllInWindow(null, 
                        function(tabs) 
                        {
                            for(var i = 0; i < tabs.length; i++)
                            {
                                if(tabs[i].id == tab.id)
                                {
                                    if(i == 0)
                                        chrome.tabs.update(tabs[tabs.length-1].id,{active:true})
                                    else
                                        chrome.tabs.update(tabs[i-1].id,{active:true})
                                    break
                                }
                    }
                  });
                });
            sendResponse({resp: "tab switched"});
        }

        if(request.msg == "closeback")
        {
            chrome.tabs.getSelected(null, 
                function(tab) 
                {
                    chrome.tabs.getAllInWindow(null, 
                        function(tabs) 
                        {
                            for(var i = 0; i < tabs.length; i++)
                            {
                                if(tabs[i].id != tab.id)
                                    chrome.tabs.remove(tabs[i].id);
                            }
                  });
                });
            sendResponse({resp: "background closed"});
        }

        if(request.msg == "closeall")
        {
            chrome.tabs.getAllInWindow(null, 
                function(tabs) 
                {
                for(var i = 0; i < tabs.length; i++)
                chrome.tabs.remove(tabs[i].id);
          });
            sendResponse({resp:"tabs closed"})
    }

        sendResponse({resp: "probs"});
  }
);

