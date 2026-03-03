import { AuthProvider } from "@/lib/auth";
import "./globals.css";

export const metadata = {
  title: "ACE — Interactive Coding Learning Platform",
  description:
    "Learn Linux, C, C++, and Python through interactive lessons, real-time coding, and gamified challenges.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
