import type { Metadata } from "next";
import "./globals.css";
import { Fira_Code } from "next/font/google";
import SmoothScrollProvider from "../components/providers/smooth-scroll-provider";
import MatrixCanvas from "../components/canvas/matrix-canvas";
import icon from "../components/icon.png";

const display = Fira_Code({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Johan Samsudin",
  description: "Johan Samsudin | SAP IS-H & ABAP Developer.",
  icons: {
    icon: icon.src,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${display.variable} bg-black text-white font-mono`}>
        <MatrixCanvas />
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
