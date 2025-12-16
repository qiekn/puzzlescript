# Deployment Configuration

## GitHub Pages Deployment

This project uses environment variables to configure the basePath, allowing flexible adaptation to different repository names.

### How to Change Repository Name

If you rename your GitHub repository, simply update the `.env.production` file:

```bash
# .env.production
NEXT_PUBLIC_BASE_PATH=/your-new-repo-name
```

### Environment Configuration Files

- **`.env.local`** - Local development environment (no basePath needed)
- **`.env.production`** - Production environment (GitHub Pages deployment)

### Build and Deploy

```bash
# Local development
npm run dev

# Production build (automatically uses .env.production)
npm run build

# Deploy to GitHub Pages
# Built files are in /out directory, configure GitHub Pages to use this directory
```

### Image Paths

All image paths use the `/images/...` format, and Next.js automatically handles the basePath:

- `<Image>` component automatically adds basePath
- Icon paths in metadata are also automatically handled
- No need to manually concatenate paths

### Example

Current configuration:
- Repository name: `puzzlescript`
- Access URL: `qiekn.github.io/puzzlescript`
- basePath: `/puzzlescript`

If changed to:
- Repository name: `my-puzzle-game`
- Access URL: `qiekn.github.io/my-puzzle-game`
- Simply update `NEXT_PUBLIC_BASE_PATH=/my-puzzle-game` in `.env.production`
