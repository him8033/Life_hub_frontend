"use client";

import { createContext, useContext, useState, useEffect } from "react";

const PasswordResetContext = createContext(null);

export const PasswordResetProvider = ({ children }) => {
  const [resetEmail, setResetEmail] = useState(null);
  const [resetToken, setResetToken] = useState(null);
  const [confirmToken, setConfirmToken] = useState(null);

  // Load from sessionStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedEmail = sessionStorage.getItem('reset_email');
      const storedResetToken = sessionStorage.getItem('reset_token');
      const storedConfirmToken = sessionStorage.getItem('confirm_token');

      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (storedEmail) setResetEmail(storedEmail);
      if (storedResetToken) setResetToken(storedResetToken);
      if (storedConfirmToken) setConfirmToken(storedConfirmToken);
    }
  }, []);

  // Save to sessionStorage when state changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (resetEmail) {
        sessionStorage.setItem('reset_email', resetEmail);
      } else {
        sessionStorage.removeItem('reset_email');
      }

      if (resetToken) {
        sessionStorage.setItem('reset_token', resetToken);
      } else {
        sessionStorage.removeItem('reset_token');
      }

      if (confirmToken) {
        sessionStorage.setItem('confirm_token', confirmToken);
      } else {
        sessionStorage.removeItem('confirm_token');
      }
    }
  }, [resetEmail, resetToken, confirmToken]);

  const startPasswordReset = (email, token) => {
    setResetEmail(email);
    setResetToken(token);
  };

  const completeOTPVerification = (confirmToken) => {
    setConfirmToken(confirmToken);
    setResetToken(null); // Clear reset_token after use
  };

  const completePasswordReset = () => {
    // Clear all data after password reset
    setResetEmail(null);
    setResetToken(null);
    setConfirmToken(null);
  };

  const clearResetData = () => {
    setResetEmail(null);
    setResetToken(null);
    setConfirmToken(null);
  };

  return (
    <PasswordResetContext.Provider
      value={{
        resetEmail,
        resetToken,
        confirmToken,
        startPasswordReset,
        completeOTPVerification,
        completePasswordReset,
        clearResetData,
      }}
    >
      {children}
    </PasswordResetContext.Provider>
  );
};

export const usePasswordReset = () => {
  const context = useContext(PasswordResetContext);
  if (!context) {
    throw new Error("usePasswordReset must be used within PasswordResetProvider");
  }
  return context;
};
