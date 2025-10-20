/**
 * Tests for utility functions
 */

// Load the utils module
const fs = require('fs');
const path = require('path');

// Read and evaluate the utils.js file
const utilsCode = fs.readFileSync(path.join(__dirname, '..', 'utils.js'), 'utf8');
eval(utilsCode);

describe('Utils', () => {
  describe('invertHash', () => {
    test('should invert a simple hash correctly', () => {
      const input = { a: '1', b: '2', c: '3' };
      const expected = { '1': 'a', '2': 'b', '3': 'c' };
      expect(invertHash(input)).toEqual(expected);
    });

    test('should handle gesture mappings', () => {
      const gestures = { U: 'newtab', R: 'forward', L: 'back', UD: 'closetab' };
      const inverted = invertHash(gestures);

      expect(inverted['newtab']).toBe('U');
      expect(inverted['forward']).toBe('R');
      expect(inverted['back']).toBe('L');
      expect(inverted['closetab']).toBe('UD');
    });

    test('should handle empty hash', () => {
      const input = {};
      const expected = {};
      expect(invertHash(input)).toEqual(expected);
    });

    test('should handle single entry', () => {
      const input = { key: 'value' };
      const expected = { value: 'key' };
      expect(invertHash(input)).toEqual(expected);
    });

    test('should overwrite duplicate values', () => {
      // Last key wins when values are duplicated
      const input = { a: 'same', b: 'same' };
      const result = invertHash(input);

      // Result should have 'same' as key, but only one of 'a' or 'b' as value
      expect(result['same']).toBeDefined();
      expect(['a', 'b']).toContain(result['same']);
    });
  });
});
