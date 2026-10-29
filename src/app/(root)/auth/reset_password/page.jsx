"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { FiLock, FiArrowRight, FiArrowLeft, FiMail } from "react-icons/fi";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthForm from "@/components/auth/AuthForm";
import AuthInput from "@/components/auth/AuthInput";
import AuthButton from "@/components/auth/AuthButton";
import AuthDivider from "@/components/auth/AuthDivider";
import AuthLinks from "@/components/auth/AuthLinks";
import { ROUTES } from "@/routes/routes.constants";
import { resetPasswordSchema } from "@/lib/validations/auth/zodSchema";
import { useResetPasswordMutation } from "@/services/api/authApi";
import { useSnackbar } from "@/context/SnackbarContext";
import { usePasswordReset } from "@/context/PasswordResetContext";
import styles from "@/styles/auth/Shared.module.css";

const ResetPasswordPage = () => {
    const router = useRouter();
    const { showSnackbar } = useSnackbar();
    const { resetEmail, confirmToken, completePasswordReset, clearResetData } = usePasswordReset();
    const [resetPassword, { isLoading }] = useResetPasswordMutation();

    const methods = useForm({
        defaultValues: {
            email: resetEmail || "",
            confirm_token: confirmToken || "",
            password: "",
            password2: "",
        },
    });

    useEffect(() => {
        if (resetEmail) {
            methods.setValue("email", resetEmail);
        }
        if (confirmToken) {
            methods.setValue("confirm_token", confirmToken);
        }
    }, [resetEmail, confirmToken, methods]);

    const handleResetSubmit = async (data) => {
        // Check if context data exists before submitting
        if (!resetEmail || !confirmToken) {
            showSnackbar("Invalid password reset request. Please start over.", "error", 5000);
            router.push(ROUTES.AUTH.FORGOT_PASSWORD);
            return;
        }

        // Validate passwords match
        if (data.password !== data.password2) {
            methods.setError("password2", {
                type: "manual",
                message: "Passwords do not match",
            });
            return;
        }

        // Validate password length
        if (data.password.length < 8) {
            methods.setError("password", {
                type: "manual",
                message: "Password must be at least 8 characters",
            });
            return;
        }

        const res = await resetPassword(data);

        if (res.error) {
            const backendErrors = res.error.data?.errors;

            if (backendErrors?.field_errors) {
                Object.entries(backendErrors.field_errors).forEach(
                    ([field, messages]) => {
                        methods.setError(field, {
                            type: "server",
                            message: messages[0],
                        });
                    }
                );
            }

            if (backendErrors?.non_field_errors?.length) {
                showSnackbar(backendErrors.non_field_errors[0], "error", 5000);
            }

            return;
        }

        if (res.data) {
            showSnackbar("Password reset successfully! Please login with your new password.", "success", 5000);
            methods.reset();
            // Clear context data
            completePasswordReset();
            router.push(ROUTES.AUTH.LOGIN);
        }
    };

    const authLinks = [
        {
            text: "Back to Login",
            href: ROUTES.AUTH.LOGIN,
            showIcon: true,
            icon: <FiArrowLeft />,
        },
    ];

    return (
        <AuthLayout
            title="Reset Password"
            subtitle="Create your new password"
        >
            <AuthForm methods={methods} onSubmit={handleResetSubmit}>
                {/* Show email as read-only text */}
                {resetEmail && (
                    <div className={styles.infoBox}>
                        <div className={styles.emailDisplay}>
                            <FiMail className={styles.emailIcon} />
                            <span className={styles.emailText}>Resetting password for: {resetEmail}</span>
                        </div>
                    </div>
                )}

                <AuthInput
                    name="password"
                    label="New Password"
                    type="password"
                    placeholder="Create a new password"
                    icon={<FiLock />}
                    required
                    showPasswordToggle
                    autoComplete="new-password"
                />

                <AuthInput
                    name="password2"
                    label="Confirm New Password"
                    type="password"
                    placeholder="Confirm your new password"
                    icon={<FiLock />}
                    required
                    showPasswordToggle
                    autoComplete="new-password"
                />

                <AuthButton
                    type="submit"
                    isLoading={isLoading}
                    loadingText="Resetting..."
                    icon={<FiArrowRight />}
                    fullWidth
                >
                    Reset Password
                </AuthButton>

                <AuthDivider />

                <AuthLinks links={authLinks} />
            </AuthForm>
        </AuthLayout>
    );
};

export default ResetPasswordPage;