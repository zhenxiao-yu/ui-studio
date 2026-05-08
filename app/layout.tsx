import { Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";

import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "@/components/ErrorBoundary";

export const metadata = {
  title: "ui studio",
  description:
    "A minimalist and intuitive UI design web application inspired by Figma, designed to facilitate real-time collaboration and seamless design experiences.",
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
  display: "swap",
});

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
    <body className="bg-primary-grey-800 font-sans antialiased">
      <ErrorBoundary>
        <TooltipProvider delayDuration={120}>{children}</TooltipProvider>
        <Toaster theme="dark" position="bottom-right" richColors />
      </ErrorBoundary>
    </body>
  </html>
);

export default RootLayout;
