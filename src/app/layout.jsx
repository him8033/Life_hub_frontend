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

const assistant = Assistant({ subsets: ["latin"], weight: ["400", "600", "700"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${assistant.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Provider store={store}>
            <SnackbarProvider>
              <GlobalSnackbarRenderer />
              <ConfirmProvider>
                {/* <div className="min-h-screen flex flex-col">
                  <main className="flex-1 relative">
                    {children}

                    <div className="fixed bottom-5 right-5 z-50">
                      <ThemeToggle />
                    </div>
                  </main>
                </div> */}
                {children}
                {/* Move ThemeToggle outside children flow with high z-index */}
                <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 99999 }}>
                  <ThemeToggle />
                </div>
              </ConfirmProvider>
            </SnackbarProvider>
          </Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}