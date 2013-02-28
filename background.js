chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) 
	{
    if(request.msg == "newtab")
		{
			chrome.tabs.create({})
      sendResponse({resp: "tab open"});
		}
    if(request.msg == "closetab")
		{
			chrome.tabs.getSelected(null, function(tab) {
					chrome.tabs.remove(tab.id, function() { });
			});
      sendResponse({resp: "tab closed"});
		}
    if(request.msg == "context")
		{
			chrome.contextMenus.create({});
      sendResponse({resp: "context open"});
		}
		sendResponse({resp: "probs"});
  });

