import type { Metadata } from "next";
import { Be_Vietnam_Pro, Geist_Mono } from "next/font/google";
import "./globals.css";

const vietnamSans = Be_Vietnam_Pro({
  variable: "--font-vietnam-sans",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tong Thoi Duy Hung — Fullstack Developer & Frontend Specialist",
  description:
    "Portfolio of Tong Thoi Duy Hung — Fresh IT Graduate specializing in modern Frontend (React, Next.js, TypeScript) and Fullstack development (Laravel, Node.js, MySQL).",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="vi"
      className={`${vietnamSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#000000] text-white font-sans text-[12px] leading-tight tracking-tight antialiased">
        {children}
      </body>
    </html>
  );
}
