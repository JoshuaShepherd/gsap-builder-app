import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { MainNavigation } from "@/components/ui/main-navigation";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GSAP Studio - Animation Builder & SVG Path Maker",
  description: "Professional GSAP animation builder and SVG path maker tools",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MainNavigation />
        <main>{children}</main>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
