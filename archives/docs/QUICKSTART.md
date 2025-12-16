# Quick Start Guide

## Installation

1. **Install dependencies** (requires Node.js 18+):

```bash
npm install
```

2. **Run development server**:

```bash
npm run dev
```

3. **Open in browser**:

Navigate to [http://localhost:3000](http://localhost:3000)

## What's Working

### ✅ Completed Features

- **Home Page** (`/`) - Game gallery with links to editor and documentation
- **Editor Page** (`/editor`) - Full editor interface with:
  - Resizable split panes (horizontal and vertical)
  - Code editor (basic textarea, ready for CodeMirror integration)
  - Game canvas area
  - Console with toolbar
  - All toolbar buttons (UI only, functionality pending)
- **Play Page** (`/play`) - Standalone game player interface
- **Responsive Layout** - Tailwind CSS styling with custom theme
- **Asset Migration** - All images, fonts, documentation, and demos copied

### ⏳ Pending Integration

The UI is complete, but the game engine needs to be integrated. See `INTEGRATION_GUIDE.md` for details.

- Game engine (lib/js/engine.js)
- Compiler (lib/js/compiler.js)
- CodeMirror syntax highlighting
- Sound generation
- GIF export
- Level editor
- Game solver
- Save/load functionality
- Example game loading

## Project Structure

```
├── app/                    # Next.js pages
│   ├── layout.js          # Root layout
│   ├── page.js            # Home page
│   ├── editor/page.js     # Editor
│   └── play/page.js       # Game player
├── components/            # React components
│   ├── CodeEditor.js
│   ├── Console.js
│   ├── GameCanvas.js
│   ├── SplitPane.js
│   └── Toolbar.js
├── lib/                   # Game engine modules
│   └── js/               # Original JS files
├── public/               # Static assets
│   ├── images/
│   ├── fonts/
│   ├── demo/
│   ├── Documentation/
│   └── Gallery/
└── src/                  # Original source (legacy)
```

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## Next Steps

### 1. Test the UI

```bash
npm run dev
```

Visit:
- http://localhost:3000 - Home page
- http://localhost:3000/editor - Editor
- http://localhost:3000/play - Player

### 2. Integrate Game Engine

Follow the steps in `INTEGRATION_GUIDE.md` to connect the original game engine with React components.

Key tasks:
- Create `useGameEngine` hook
- Load engine modules dynamically
- Connect canvas to engine
- Implement compile/run functionality
- Add keyboard/mouse input handling

### 3. Add CodeMirror

Install a React CodeMirror package:

```bash
npm install @uiw/react-codemirror
```

Replace the textarea in `components/CodeEditor.js` with CodeMirror.

### 4. Implement Save/Load

Add localStorage integration for:
- Saving current game
- Loading saved games
- Managing save list

### 5. Add Advanced Features

- GIF export
- Level editor
- Game solver
- Share/export functionality

## Customization

### Theme Colors

Edit `tailwind.config.js` to change colors:

```javascript
theme: {
  extend: {
    colors: {
      'puzzlescript-bg': '#1a1a2e',        // Main background
      'puzzlescript-panel': '#16213e',     // Panel background
      'puzzlescript-accent': '#0f3460',    // Accent color
      'puzzlescript-highlight': '#e94560', // Highlight color
    },
  },
}
```

### Layout

Edit `app/globals.css` for global styles or component files for specific styling.

## Troubleshooting

### Port already in use

```bash
# Use a different port
npm run dev -- -p 3001
```

### Module not found

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build errors

```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

## Documentation

- `README_REACT.md` - Full project documentation
- `INTEGRATION_GUIDE.md` - Game engine integration guide
- `public/Documentation/` - Original PuzzleScript documentation

## Support

- Original PuzzleScript Next: https://github.com/david-pfx/PuzzleScriptNext
- Next.js Docs: https://nextjs.org/docs
- React Docs: https://react.dev
- Tailwind CSS Docs: https://tailwindcss.com/docs
