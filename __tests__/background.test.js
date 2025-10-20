/**
 * Tests for background script functionality
 */

describe('Background Script', () => {
  let messageListener;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Mock localStorage
    global.localStorage = {
      colorCode: 'ff3300',
      width: '3',
      rocker: 'true',
      trail: 'true',
      U: 'newtab',
      R: 'forward',
      L: 'back',
      UD: 'closetab'
    };

    // Load background.js
    const fs = require('fs');
    const path = require('path');
    const backgroundCode = fs.readFileSync(path.join(__dirname, '..', 'background.js'), 'utf8');

    // Execute the background script
    eval(backgroundCode);

    // Capture the message listener
    messageListener = chrome.runtime.onMessage.addListener.mock.calls[0][0];
  });

  describe('Message Handling', () => {
    test('should handle newtab message', () => {
      const sendResponse = jest.fn();
      const request = { msg: 'newtab' };

      messageListener(request, {}, sendResponse);

      expect(chrome.tabs.create).toHaveBeenCalledWith({});
      expect(sendResponse).toHaveBeenCalledWith({ resp: 'tab open' });
    });

    test('should handle closetab message', () => {
      const sendResponse = jest.fn();
      const request = { msg: 'closetab' };

      // Mock query to return a tab
      chrome.tabs.query.mockImplementation((query, callback) => {
        callback([{ id: 123 }]);
      });

      messageListener(request, {}, sendResponse);

      expect(chrome.tabs.query).toHaveBeenCalledWith(
        { active: true, currentWindow: true },
        expect.any(Function)
      );
      expect(sendResponse).toHaveBeenCalledWith({ resp: 'tab closed' });
    });

    test('should handle colorCode message', () => {
      const sendResponse = jest.fn();
      const request = { msg: 'colorCode' };

      messageListener(request, {}, sendResponse);

      expect(sendResponse).toHaveBeenCalledWith({ resp: 'ff3300' });
    });

    test('should handle width message', () => {
      const sendResponse = jest.fn();
      const request = { msg: 'width' };

      messageListener(request, {}, sendResponse);

      expect(sendResponse).toHaveBeenCalledWith({ resp: '3' });
    });

    test('should handle gests message', () => {
      const sendResponse = jest.fn();
      const request = { msg: 'gests' };

      messageListener(request, {}, sendResponse);

      expect(sendResponse).toHaveBeenCalledWith({
        resp: expect.objectContaining({
          U: 'newtab',
          R: 'forward',
          L: 'back',
          UD: 'closetab'
        })
      });
    });

    test('should handle rocker message', () => {
      const sendResponse = jest.fn();
      const request = { msg: 'rocker' };

      messageListener(request, {}, sendResponse);

      expect(sendResponse).toHaveBeenCalledWith({ resp: 'true' });
    });

    test('should handle trail message', () => {
      const sendResponse = jest.fn();
      const request = { msg: 'trail' };

      messageListener(request, {}, sendResponse);

      expect(sendResponse).toHaveBeenCalledWith({ resp: 'true' });
    });

    test('should handle lasttab message', () => {
      const sendResponse = jest.fn();
      const request = { msg: 'lasttab' };

      chrome.storage.local.get.mockImplementation((key, callback) => {
        callback({ lasturl: 'https://example.com' });
      });

      messageListener(request, {}, sendResponse);

      expect(chrome.storage.local.get).toHaveBeenCalledWith('lasturl', expect.any(Function));
      expect(sendResponse).toHaveBeenCalledWith({ resp: 'tab opened' });
    });

    test('should handle reloadall message', () => {
      const sendResponse = jest.fn();
      const request = { msg: 'reloadall' };

      chrome.tabs.query.mockImplementation((query, callback) => {
        callback([
          { id: 1, url: 'https://example.com' },
          { id: 2, url: 'https://test.com' }
        ]);
      });

      messageListener(request, {}, sendResponse);

      expect(chrome.tabs.query).toHaveBeenCalledWith(
        { currentWindow: true },
        expect.any(Function)
      );
      expect(sendResponse).toHaveBeenCalledWith({ resp: 'tabs reloaded' });
    });

    test('should handle nexttab message', () => {
      const sendResponse = jest.fn();
      const request = { msg: 'nexttab' };

      // First call returns active tab
      // Second call returns all tabs
      chrome.tabs.query
        .mockImplementationOnce((query, callback) => {
          callback([{ id: 1 }]);
        })
        .mockImplementationOnce((query, callback) => {
          callback([{ id: 1 }, { id: 2 }, { id: 3 }]);
        });

      messageListener(request, {}, sendResponse);

      expect(chrome.tabs.query).toHaveBeenCalledTimes(2);
      expect(sendResponse).toHaveBeenCalledWith({ resp: 'tab switched' });
    });

    test('should handle prevtab message', () => {
      const sendResponse = jest.fn();
      const request = { msg: 'prevtab' };

      chrome.tabs.query
        .mockImplementationOnce((query, callback) => {
          callback([{ id: 2 }]);
        })
        .mockImplementationOnce((query, callback) => {
          callback([{ id: 1 }, { id: 2 }, { id: 3 }]);
        });

      messageListener(request, {}, sendResponse);

      expect(chrome.tabs.query).toHaveBeenCalledTimes(2);
      expect(sendResponse).toHaveBeenCalledWith({ resp: 'tab switched' });
    });
  });

  describe('Tab Event Listeners', () => {
    test('should register onRemoved listener', () => {
      expect(chrome.tabs.onRemoved.addListener).toHaveBeenCalled();
    });

    test('should register onUpdated listener', () => {
      expect(chrome.tabs.onUpdated.addListener).toHaveBeenCalled();
    });
  });
});
