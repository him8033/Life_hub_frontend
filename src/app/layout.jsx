"use client";

import "./globals.css";
import { Assistant } from "next/font/google";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { SnackbarProvider } from "@/context/SnackbarContext";
import GlobalSnackbarRenderer from "@/components/Application/GlobalSnackbarRenderer";
import { ConfirmProvider } from "@/context/ConfirmContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { usePathname } from "next/navigation";
import { ThemeProvider } from "next-themes"; // ✅ ADD
import { ThemeToggle } from "@/components/common/ThemeToggle";

const assistant = Assistant({ subsets: ["latin"], weight: ["400", "600", "700"] });

export default function RootLayout({ children }) {
  const pathname = usePathname();

  const isAuthRoute = pathname?.startsWith('/auth');
  const isDashboardRoute = pathname?.startsWith('/dashboard');

  const showHeaderFooter = !isAuthRoute && !isDashboardRoute;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${assistant.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Provider store={store}>
            <SnackbarProvider>
              <GlobalSnackbarRenderer />
              <ConfirmProvider>
                <div className="min-h-screen flex flex-col">
                  {showHeaderFooter && <Header />}

                  <main className="flex-1 relative">
                    {children}

                    {/* GLOBAL THEME BUTTON */}
                    <div className="fixed bottom-5 right-5 z-50">
                      <ThemeToggle />
                    </div>
                  </main>

                  {showHeaderFooter && <Footer />}
                </div>
              </ConfirmProvider>
            </SnackbarProvider>
          </Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}