/**
 * Tests for options page functionality
 */

describe('Options Page', () => {
  let fillMenu, save_options, restore_options;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Setup DOM
    document.body.innerHTML = `
      <table id="optsTab"></table>
      <select id="color">
        <option value="red">red</option>
        <option value="green">green</option>
        <option value="blue">blue</option>
        <option value="yellow">yellow</option>
      </select>
      <select id="width">
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
      </select>
      <input type="checkbox" id="rocker" />
      <input type="checkbox" id="trail" />
      <div id="status"></div>
      <button id="save">Save</button>
    `;

    // Mock localStorage
    global.localStorage = {
      colorCode: 'ff3300',
      width: '3',
      U: 'newtab',
      R: 'forward',
      L: 'back',
      UD: 'closetab',
      setItem: jest.fn(),
      removeItem: jest.fn()
    };

    // Load utils first
    const fs = require('fs');
    const path = require('path');
    const utilsCode = fs.readFileSync(path.join(__dirname, '..', 'utils.js'), 'utf8');
    eval(utilsCode);

    // Load options.js
    const optionsCode = fs.readFileSync(path.join(__dirname, '..', 'options.js'), 'utf8');
    eval(optionsCode);

    // Expose functions for testing
    fillMenu = global.fillMenu;
    save_options = global.save_options;
    restore_options = global.restore_options;
  });

  describe('fillMenu', () => {
    test('should populate the options table with gestures', () => {
      fillMenu();

      const table = document.getElementById('optsTab');
      expect(table.rows.length).toBeGreaterThan(0);
    });

    test('should create input fields for each command', () => {
      fillMenu();

      const inputs = document.getElementsByTagName('input');
      // Should have inputs for gestures plus rocker and trail checkboxes
      expect(inputs.length).toBeGreaterThan(2);
    });

    test('should use default gestures if localStorage is empty', () => {
      global.localStorage = {
        colorCode: 'ff3300',
        width: '3',
        setItem: jest.fn(),
        removeItem: jest.fn()
      };

      fillMenu();

      const table = document.getElementById('optsTab');
      expect(table.rows.length).toBeGreaterThan(0);
    });
  });

  describe('restore_options', () => {
    test('should restore color selection from localStorage', () => {
      restore_options();

      const colorSelect = document.getElementById('color');
      expect(colorSelect.children[0].selected).toBe('true');
    });

    test('should restore width selection from localStorage', () => {
      restore_options();

      const widthSelect = document.getElementById('width');
      // Width 3 should be selected (index 2)
      expect(widthSelect.children[2].selected).toBe('true');
    });

    test('should use defaults if localStorage is empty', () => {
      global.localStorage = {
        setItem: jest.fn(),
        removeItem: jest.fn()
      };

      restore_options();

      const colorSelect = document.getElementById('color');
      const widthSelect = document.getElementById('width');

      // Should default to red and width 3
      expect(colorSelect.children[0].selected).toBe('true');
      expect(widthSelect.children[2].selected).toBe('true');
    });
  });

  describe('save_options', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test('should save color selection to localStorage', () => {
      const colorSelect = document.getElementById('color');
      colorSelect.selectedIndex = 1; // green

      save_options();

      expect(localStorage['colorCode']).toBe('008000');
    });

    test('should save width selection to localStorage', () => {
      const widthSelect = document.getElementById('width');
      widthSelect.selectedIndex = 4; // width 5

      save_options();

      expect(localStorage['width']).toBe('5');
    });

    test('should save rocker checkbox state', () => {
      const rockerCheckbox = document.getElementById('rocker');
      rockerCheckbox.checked = true;

      save_options();

      expect(localStorage['rocker']).toBe(true);
    });

    test('should save trail checkbox state', () => {
      const trailCheckbox = document.getElementById('trail');
      trailCheckbox.checked = false;

      save_options();

      expect(localStorage['trail']).toBe(false);
    });

    test('should display status message', () => {
      save_options();

      const status = document.getElementById('status');
      expect(status.innerHTML).toBe('Configuration Saved');
    });

    test('should clear status message after timeout', () => {
      save_options();

      const status = document.getElementById('status');
      expect(status.innerHTML).toBe('Configuration Saved');

      jest.advanceTimersByTime(750);

      expect(status.innerHTML).toBe('');
    });
  });
});
