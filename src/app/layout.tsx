import type { Metadata, Viewport } from "next";
import { Montserrat, Inter } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Railyug — Tickets & Comfort | Simulated Journey Assistant",
  description: "A resilient railway journey-management simulation for IMPACTX 2026. Living plan under uncertainty, accessibility and caregiver protections.",
  icons: {
    icon: "/logo.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#1B0F4A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-[var(--canvas)] text-[var(--brand-indigo)] font-sans selection:bg-[var(--brand-amber)] selection:text-[var(--brand-indigo)]">
        {children}
      </body>
    </html>
  );
}
