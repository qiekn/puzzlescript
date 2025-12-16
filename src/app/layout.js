import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";

export const metadata = {
  title: "PuzzleScript Next",
  description: "HTML5 puzzle game engine",
  icons: {
    icon: [
      { url: "/images/mascot_32.png", sizes: "32x32", type: "image/png" },
      { url: "/images/mascot_64.png", sizes: "64x64", type: "image/png" },
    ],
    apple: [
      { url: "/images/mascot_256.png", sizes: "256x256", type: "image/png" },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-theme text-theme">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
