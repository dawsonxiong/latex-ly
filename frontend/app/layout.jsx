import "../styles/globals.css";
import Navbar from "/components/Navbar";

export const metadata = {
  title: 'LaTeX.ly | Math to LaTeX Converter',
  description: 'Convert mathematical equations to LaTeX code instantly with AI-powered OCR',
};

export default function Layout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-blue-50 via-white to-blue-50 text-gray-900 min-h-screen">
        <Navbar />
        <main className="container mx-auto px-4 py-8 max-w-7xl">{children}</main>
      </body>
    </html>
  );
}
