"use client";

import "./globals.css";
import { Assistant } from "next/font/google";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { SnackbarProvider } from "@/context/SnackbarContext";
import GlobalSnackbarRenderer from "@/components/Application/GlobalSnackbarRenderer";
import { ConfirmProvider } from "@/context/ConfirmContext";
import { ThemeProvider } from "next-themes";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { usePathname } from "next/navigation";

const assistant = Assistant({ subsets: ["latin"], weight: ["400", "600", "700"] });

function ThemeToggleWrapper() {
  const pathname = usePathname();

  // Hide theme toggle on preview and public portfolio/resume pages
  const isPreviewPage = pathname?.includes('/portfolio-preview') ||
                       pathname?.includes('/resume-preview');

  if (isPreviewPage) {
    return null;
  }

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 99999 }}>
      <ThemeToggle />
    </div>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${assistant.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Provider store={store}>
            <SnackbarProvider>
              <GlobalSnackbarRenderer />
              <ConfirmProvider>
                {children}
                <ThemeToggleWrapper />
              </ConfirmProvider>
            </SnackbarProvider>
          </Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}