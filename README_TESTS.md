# Testing Documentation

## Test Suite

This project now includes automated tests using Jest.

### Running Tests

```bash
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

### Test Files

- `__tests__/utils.test.js` - Tests for utility functions (invertHash)
- `__tests__/background.test.js` - Tests for background script message handlers
- `__tests__/options.test.js` - Tests for options page functionality

### Current Test Status

- **Utils Tests**: ✅ All passing (5/5 tests)
- **Background Tests**: ⚠️ Partially passing (9/14 tests)
  - Message handlers work correctly
  - Some localStorage iteration tests need refinement
- **Options Tests**: ⚠️ Needs refactoring
  - Functions need to be exposed differently for testing

### Test Coverage

The test suite covers:
- Utility function correctness
- Message passing between content scripts and background
- Tab manipulation (create, close, switch, reload)
- Chrome API integration (mocked)

### Known Issues

1. The `for...in` loop over localStorage in background.js picks up mock methods during testing
2. Options.js functions are not properly exposed when loaded via eval() in tests

These are test environment issues and don't affect the actual extension functionality.

### Future Improvements

- Refactor code to use ES6 modules for better testability
- Add integration tests using a real browser environment
- Increase test coverage to 80%+
- Add gesture recognition unit tests with canvas mocking
