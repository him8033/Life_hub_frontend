"use client";
import React, { createContext, useContext, useState, useCallback } from "react";

const SnackbarContext = createContext();

export const SnackbarProvider = ({ children }) => {
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        type: "info",
        duration: 5000,
    });

    const showSnackbar = useCallback((message, type = "info", duration = 5000) => {
        setSnackbar({ open: true, message, type, duration });
    }, []);

    const closeSnackbar = useCallback(() => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    }, []);

    return (
        <SnackbarContext.Provider value={{ snackbar, showSnackbar, closeSnackbar }}>
            {children}
        </SnackbarContext.Provider>
    );
};

export const useSnackbar = () => {
    const ctx = useContext(SnackbarContext);
    if (!ctx) throw new Error("useSnackbar must be used within SnackbarProvider");
    return ctx;
};


// "use client";
// import { createContext, useContext, useState, useCallback } from "react";

// const SnackbarContext = createContext();

// export const SnackbarProvider = ({ children }) => {
//     const [snackbar, setSnackbar] = useState({
//         open: false,
//         message: "",
//         type: "info",
//         duration: 5000,
//     });

//     const showSnackbar = useCallback((message, type = "info", duration = 5000) => {
//         setSnackbar({ open: true, message, type, duration });
//     }, []);

//     const closeSnackbar = () => {
//         setSnackbar((prev) => ({ ...prev, open: false }));
//     };

//     return (
//         <SnackbarContext.Provider value={{ snackbar, showSnackbar, closeSnackbar }}>
//             {children}
//         </SnackbarContext.Provider>
//     );
// };

// export const useSnackbar = () => useContext(SnackbarContext);
