import type { Metadata } from "next";
import "@/styles/globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "S Theater Reserve",
  description: "reserve system of the theater",
};

import { AuthProvider } from "@/components/AuthProvider";
import "@/styles/globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
      <Header />
        <AuthProvider>{children}</AuthProvider>
      <Footer />
      </body>
    </html>
  );
}

