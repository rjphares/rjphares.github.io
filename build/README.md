# TypeScript Web Application Setup

## Project Structure

```
LevenEditor/
├── index.html          # Main HTML file
├── package.json        # Node.js dependencies
├── tsconfig.json       # TypeScript configuration
├── src/
│   └── main.ts         # TypeScript source code
└── dist/
    └── main.js         # Compiled JavaScript (for now manually created)
```

## Prerequisites

To fully use TypeScript development, you need to install:

1. **Node.js** (includes npm): Download from https://nodejs.org/
2. **TypeScript globally** (after installing Node.js):
   ```bash
   npm install -g typescript
   ```

## Setup Instructions

### Option 1: With Node.js/npm (Recommended)

1. Install Node.js from https://nodejs.org/
2. Open PowerShell in the project directory
3. Run: `npm install`
4. Run: `npm run build` (compiles TypeScript to JavaScript)
5. Run: `npm run serve` (starts a local server)
6. Open http://localhost:3000 in your browser

### Option 2: Without Node.js (Current Setup)

1. Open `index.html` directly in your browser
2. The page should work with the pre-compiled JavaScript

## Development Workflow

### With TypeScript Compiler

1. Edit files in the `src/` directory
2. Run `tsc` or `npm run build` to compile
3. Refresh your browser to see changes

### Available npm Scripts

- `npm run build` - Compile TypeScript once
- `npm run dev` - Watch for changes and auto-compile
- `npm run serve` - Start a local development server
- `npm start` - Build and serve the application

## Features Included

- ✅ TypeScript configuration (`tsconfig.json`)
- ✅ Strong typing with interfaces and classes
- ✅ DOM manipulation with type safety
- ✅ Event handling
- ✅ Modern ES2020 features
- ✅ Source maps for debugging
- ✅ Development server setup

## TypeScript Features Demonstrated

1. **Interfaces**: `User` interface with optional properties
2. **Classes**: `Calculator` and `App` classes with methods
3. **Type Safety**: Method parameters and return types
4. **Union Types**: `'add' | 'multiply'` operation types
5. **Optional Chaining**: `?.` operator for safe DOM access
6. **Access Modifiers**: `private` methods in the App class

## Next Steps

1. Install Node.js to enable full TypeScript development
2. Add more TypeScript files to the `src/` directory
3. Explore advanced TypeScript features like generics
4. Add CSS preprocessing or bundling tools
5. Consider using a framework like React or Vue with TypeScript
