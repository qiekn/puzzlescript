# PuzzleScript Next - React Edition

这是 PuzzleScript Next 的 React + Next.js + Tailwind CSS 版本。

原项目: https://github.com/david-pfx/PuzzleScriptNext

## 技术栈

- **Next.js 13.5.6** - React 框架（使用 App Router）
- **React 18** - UI 库
- **Tailwind CSS** - CSS 框架
- **JavaScript** - 纯 JS（无 TypeScript）

## 项目结构

```
├── src/                    # 源代码目录
│   ├── app/               # Next.js App Router 页面
│   │   ├── layout.js     # 根布局
│   │   ├── page.js       # 首页（游戏画廊）
│   │   ├── editor/       # 编辑器页面
│   │   └── play/         # 游戏播放器页面
│   ├── components/       # React 组件
│   │   ├── CodeEditor.js    # 代码编辑器
│   │   ├── Console.js       # 控制台
│   │   ├── GameCanvas.js    # 游戏画布
│   │   ├── SplitPane.js     # 可调整大小的分割面板
│   │   └── Toolbar.js       # 工具栏
│   └── lib/              # JavaScript 模块（游戏引擎）
│       └── js/           # 原始 PuzzleScript JS 文件
├── public/               # 静态资源
│   ├── images/          # UI 图片
│   ├── fonts/           # 字体
│   ├── demo/            # 示例游戏
│   ├── Documentation/   # 文档
│   └── Gallery/         # 游戏画廊
├── archives/            # 归档文件（原始源代码和构建文件）
│   ├── src-original/   # 原始 HTML/JS 源代码
│   ├── bin/            # 原始构建输出
│   └── ...             # 其他原始文件
└── 配置文件
    ├── next.config.js      # Next.js 配置
    ├── tailwind.config.js  # Tailwind CSS 配置
    ├── jsconfig.json       # JavaScript 配置（路径别名）
    └── package.json        # 项目依赖
```

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

### 3. 在浏览器中打开

访问 [http://localhost:3000](http://localhost:3000)

## 可用页面

- **首页** - http://localhost:3000
- **编辑器** - http://localhost:3000/editor
- **播放器** - http://localhost:3000/play

## 可用命令

```bash
npm run dev      # 启动开发服务器
npm run build    # 构建生产版本
npm start        # 启动生产服务器
npm run lint     # 运行 ESLint
```

## 已完成功能

- ✅ Next.js 项目结构（使用 src 目录）
- ✅ Tailwind CSS 配置和自定义主题
- ✅ 首页（游戏画廊）
- ✅ 编辑器页面（可调整大小的分割面板）
- ✅ 代码编辑器组件（基础 textarea，待集成 CodeMirror）
- ✅ 游戏画布组件
- ✅ 控制台组件（带工具栏）
- ✅ 工具栏（所有按钮，功能待实现）
- ✅ 播放器页面
- ✅ 响应式布局
- ✅ 资源迁移（图片、字体、文档）

## 待集成功能

UI 已完成，但游戏引擎需要集成。详见 `archives/` 目录中的集成指南。

- ⏳ 游戏引擎集成 (src/lib/js/engine.js)
- ⏳ 编译器集成 (src/lib/js/compiler.js)
- ⏳ CodeMirror 语法高亮
- ⏳ 声音生成
- ⏳ GIF 导出
- ⏳ 关卡编辑器
- ⏳ 游戏求解器
- ⏳ 分享/导出功能
- ⏳ LocalStorage 管理
- ⏳ 示例游戏加载

## 路径别名

项目使用路径别名，在 `jsconfig.json` 中配置：

```javascript
"@/*": ["./src/*"]
"@/components/*": ["src/components/*"]
"@/lib/*": ["src/lib/*"]
```

使用示例：

```javascript
import Toolbar from '@/components/Toolbar'
import { useGameEngine } from '@/lib/hooks/useGameEngine'
```

## 自定义主题

编辑 `tailwind.config.js` 来修改颜色：

```javascript
colors: {
  'puzzlescript-bg': '#1a1a2e',        // 主背景
  'puzzlescript-panel': '#16213e',     // 面板背景
  'puzzlescript-accent': '#0f3460',    // 强调色
  'puzzlescript-highlight': '#e94560', // 高亮色
}
```

## 故障排除

### 端口已被占用

```bash
npm run dev -- -p 3001
```

### 模块未找到

```bash
rm -rf node_modules package-lock.json
npm install
```

### 构建错误

```bash
rm -rf .next
npm run build
```

## 归档文件说明

`archives/` 目录包含原始 PuzzleScript Next 的源代码和构建文件，保留用于参考和游戏引擎集成。

## 文档

- 原始 PuzzleScript Next: https://github.com/david-pfx/PuzzleScriptNext
- Next.js 文档: https://nextjs.org/docs
- React 文档: https://react.dev
- Tailwind CSS 文档: https://tailwindcss.com/docs

## 许可证

与原始 PuzzleScript Next 项目相同。
