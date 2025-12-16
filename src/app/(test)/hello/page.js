export default function HelloPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-4">
          Hello World! 👋
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Next.js + React + Tailwind CSS 正在运行！
        </p>
        <div className="space-y-2 text-left bg-gray-800 p-6 rounded-lg">
          <p className="text-green-400">✅ Next.js 13.5.6</p>
          <p className="text-green-400">✅ React 18</p>
          <p className="text-green-400">✅ Tailwind CSS</p>
          <p className="text-green-400">✅ src 目录结构</p>
        </div>
        <div className="mt-8 space-x-4">
          <a
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            返回首页
          </a>
          <a
            href="/editor"
            className="inline-block px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            打开编辑器
          </a>
        </div>
      </div>
    </div>
  )
}
