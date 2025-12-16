import './globals.css'

export const metadata = {
  title: 'PuzzleScript Next',
  description: 'HTML5 puzzle game engine',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-puzzlescript-bg text-white">{children}</body>
    </html>
  )
}
