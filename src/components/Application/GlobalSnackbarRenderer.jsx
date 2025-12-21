"use client";
import Snackbar from "./SnackBar";
import { useSnackbar } from "@/context/SnackbarContext";

export default function GlobalSnackbarRenderer() {
    const { snackbar, closeSnackbar } = useSnackbar();

    return (
        <Snackbar
            open={snackbar.open}
            message={snackbar.message}
            type={snackbar.type}
            duration={snackbar.duration}
            onClose={closeSnackbar}
        />
    );
}
