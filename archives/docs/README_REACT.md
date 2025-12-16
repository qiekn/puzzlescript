# PuzzleScript Next - React Edition

This is a React + Next.js + Tailwind CSS migration of PuzzleScript Next, an HTML5 puzzle game engine.

## Tech Stack

- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **JavaScript** - No TypeScript (as per requirements)

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── layout.js          # Root layout
│   ├── page.js            # Home page (gallery)
│   ├── editor/            # Editor page
│   │   └── page.js
│   └── play/              # Game player page
│       └── page.js
├── components/            # React components
│   ├── CodeEditor.js     # Code editor component
│   ├── Console.js        # Console output component
│   ├── GameCanvas.js     # Game canvas wrapper
│   ├── SplitPane.js      # Resizable split pane
│   └── Toolbar.js        # Toolbar component
├── lib/                   # JavaScript modules (game engine)
│   └── js/               # Original PuzzleScript JS files
├── public/               # Static assets
│   ├── images/          # UI images
│   ├── fonts/           # Custom fonts
│   ├── demo/            # Demo games
│   ├── Documentation/   # Documentation files
│   └── Gallery/         # Game gallery
└── src/                  # Original source files (legacy)
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Features

### Completed

- ✅ Next.js project structure with App Router
- ✅ Tailwind CSS configuration with custom theme
- ✅ Home page with game gallery
- ✅ Editor page with split-pane layout
- ✅ Code editor component (basic textarea, CodeMirror integration pending)
- ✅ Game canvas component
- ✅ Console component with toolbar
- ✅ Resizable split panes (horizontal and vertical)
- ✅ Toolbar with all original buttons
- ✅ Play page for standalone games
- ✅ Asset migration (images, fonts, documentation)

### Pending Integration

- ⏳ Game engine integration (lib/js/engine.js)
- ⏳ Compiler integration (lib/js/compiler.js)
- ⏳ CodeMirror integration for syntax highlighting
- ⏳ Sound generation (lib/js/sfxr.js)
- ⏳ GIF export functionality
- ⏳ Level editor
- ⏳ Game solver
- ⏳ Share/Export functionality
- ⏳ LocalStorage management for saved games
- ⏳ Example game loading

## Key Differences from Original

### Architecture

- **Component-based**: UI is split into reusable React components
- **State management**: Uses React hooks (useState, useEffect) instead of global variables
- **Routing**: Next.js App Router instead of separate HTML files
- **Styling**: Tailwind CSS utility classes instead of separate CSS files
- **Build system**: Next.js/Webpack instead of custom compile.js

### File Organization

- **Pages**: `app/` directory with Next.js routing
- **Components**: Reusable UI components in `components/`
- **Game engine**: Original JS modules in `lib/js/`
- **Assets**: Static files in `public/`

### Styling

Custom Tailwind theme colors:
- `puzzlescript-bg`: #1a1a2e (main background)
- `puzzlescript-panel`: #16213e (panel background)
- `puzzlescript-accent`: #0f3460 (accent color)
- `puzzlescript-highlight`: #e94560 (highlight/active color)

## Next Steps

### Immediate Tasks

1. **Integrate Game Engine**
   - Create a React hook for game engine state
   - Initialize engine with canvas element
   - Handle game loop and rendering

2. **Integrate Compiler**
   - Parse PuzzleScript code
   - Compile to game data
   - Handle errors and display in console

3. **Add CodeMirror**
   - Install `@uiw/react-codemirror` or similar
   - Add PuzzleScript syntax highlighting
   - Implement autocomplete

4. **Implement Save/Load**
   - LocalStorage integration
   - Save game list management
   - Example game loading

5. **Add Export/Share**
   - Generate standalone HTML
   - Create shareable links
   - Implement GitHub Gist integration

### Long-term Improvements

- Add state management library (Redux/Zustand) for complex state
- Implement proper error boundaries
- Add loading states and skeletons
- Optimize performance with React.memo
- Add keyboard shortcuts
- Implement mobile-friendly controls
- Add dark/light theme toggle
- Create comprehensive test suite

## Development Notes

### Working with the Game Engine

The original game engine files are in `lib/js/`. These are vanilla JavaScript modules that need to be integrated with React:

1. **Global Variables**: The engine uses many global variables. Consider wrapping in a context provider or custom hook.

2. **Canvas Rendering**: The engine directly manipulates the canvas. Use `useRef` to pass canvas element to engine.

3. **Event Listeners**: The engine adds event listeners directly. Clean up in `useEffect` return function.

4. **Module Loading**: Use dynamic imports for large modules to improve initial load time.

### Tailwind CSS Tips

- Use `@apply` directive in globals.css for common patterns
- Custom components are defined in `@layer components`
- Pixel-perfect canvas rendering uses `image-rendering: pixelated`

## Contributing

This is a migration project. The original PuzzleScript Next is at:
https://github.com/david-pfx/PuzzleScriptNext

## License

Same as original PuzzleScript Next project.
