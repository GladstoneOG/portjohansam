import type { Metadata, Viewport } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SiteProvider from "@/components/providers/site-provider";
import icon from "@/components/icon.png";

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Johan Samsudin — Prompt Engineer & AI-Augmented ABAP Architect",
  description:
    "Johan Samsudin · SAP ABAP IS-H developer engineering AI-native, agentic workflows across the SAP stack. Prompt engineering, context engineering, MCP tooling.",
  icons: { icon: icon.src },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0B",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${mono.variable}`}>
      <body>
        <SiteProvider>{children}</SiteProvider>
      </body>
    </html>
  );
}
