"use client";
import "./globals.css";
import { Assistant } from "next/font/google";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { SnackbarProvider } from "@/context/SnackbarContext";
import GlobalSnackbarRenderer from "@/components/Application/GlobalSnackbarRenderer";
import { ConfirmProvider } from "@/context/ConfirmContext";

const assistant = Assistant({ subsets: ["latin"], weight: ["400", "600", "700"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${assistant.className} antialiased`}>
        <Provider store={store}>
          <SnackbarProvider>
            <GlobalSnackbarRenderer />
            <ConfirmProvider>
              {children}
            </ConfirmProvider>
          </SnackbarProvider>
        </Provider>
      </body>
    </html>
  );
}
