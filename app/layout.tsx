import { Work_Sans } from "next/font/google";
import { Toaster } from "sonner";

import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "@/components/ErrorBoundary";

export const metadata = {
  title: "ui studio",
  description:
    "A minimalist and intuitive UI design web application inspired by Figma, designed to facilitate real-time collaboration and seamless design experiences.",
};

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  weight: ["400", "600", "700"],
});

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang='en'>
    <body className={`${workSans.className} bg-primary-grey-800`}>
      <ErrorBoundary>
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster theme="dark" position="bottom-right" richColors />
      </ErrorBoundary>
    </body>
  </html>
);

export default RootLayout;
