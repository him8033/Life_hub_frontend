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

const assistant = Assistant({ subsets: ["latin"], weight: ["400", "600", "700"] });

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // Check if current route is auth or dashboard
  const isAuthRoute = pathname?.startsWith('/auth');
  const isDashboardRoute = pathname?.startsWith('/dashboard');

  // Show header/footer only for public routes
  const showHeaderFooter = !isAuthRoute && !isDashboardRoute;

  return (
    <html lang="en">
      <body className={`${assistant.className} antialiased`}>
        <Provider store={store}>
          <SnackbarProvider>
            <GlobalSnackbarRenderer />
            <ConfirmProvider>
              <div className="min-h-screen flex flex-col">
                {showHeaderFooter && <Header />}
                <main className="flex-1">
                  {children}
                </main>
                {showHeaderFooter && <Footer />}
              </div>
            </ConfirmProvider>
          </SnackbarProvider>
        </Provider>
      </body>
    </html>
  );
}
