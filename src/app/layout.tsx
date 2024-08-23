import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { cn } from "@/libs/utils";
import { ThemeProvider } from "@/components/ThemeProvider";
import { TailwindIndicator } from "@/components/TailwindIndicator";
import { Toaster } from "@/components/ui/toaster"

import "./globals.css";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Release Viewer",
  description: "Created by Lei Zhang",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex min-h-screen w-full flex-col">{children}</div>
        </ThemeProvider>

        <TailwindIndicator />

				<Toaster />
      </body>
    </html>
  );
}
