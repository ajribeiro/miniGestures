miniGestures
=============

A lightweight Google Chrome extension that enables mouse gestures for navigation and tab management.

## Features

- Mouse gesture recognition (Up, Down, Left, Right combinations)
- Rocker gestures (right-click + left-click for back/forward)
- Visual gesture trails
- Customizable colors and line width
- Tab management (open, close, switch, reload)
- History navigation
- Scroll shortcuts

## Development

### Testing

This project includes automated tests using Jest. See [README_TESTS.md](README_TESTS.md) for details.

```bash
npm install        # Install dependencies
npm test          # Run tests
npm run test:coverage  # Run with coverage report
```

### Recent Improvements

- ✅ Removed commented-out debug code
- ✅ Replaced deprecated Chrome APIs with modern equivalents
- ✅ Removed jQuery dependency (268KB saved!)
- ✅ Fixed variable initialization bugs
- ✅ Consolidated duplicate code
- ✅ Added automated test suite
- ✅ Improved code quality and maintainability

### Browser Compatibility

Currently using Manifest V2. Chrome extensions using Manifest V2 are still supported but will eventually need migration to Manifest V3.
