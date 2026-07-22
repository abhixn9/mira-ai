import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./fonts.css";
import "@/styles/tw-animate.css";
import "@/styles/shadcn-tailwind.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ResumeProvider } from "@/context/ResumeContext";
import { ToastProvider } from "@/context/ToastContext";
import { FloatingChat } from "@/components/chat/FloatingChat";
import { AuthProvider } from "@/components/auth-provider";
import { LogoAnimation } from '@/components/ui/LogoAnimation';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mira AI | Professional Resume Builder",
  description: "Build an ATS-optimized, premium resume with advanced AI in minutes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <ToastProvider>
              <ResumeProvider>
                {children}
                <FloatingChat />
              </ResumeProvider>
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
