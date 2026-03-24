"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiLock, FiArrowRight, FiKey } from "react-icons/fi";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthForm from "@/components/auth/AuthForm";
import AuthInput from "@/components/auth/AuthInput";
import AuthButton from "@/components/auth/AuthButton";
import AuthDivider from "@/components/auth/AuthDivider";
import AuthLinks from "@/components/auth/AuthLinks";
import { ROUTES } from "@/routes/routes.constants";
import { resetPasswordSchema } from "@/lib/zodSchema";
import { useResetPasswordMutation } from "@/services/api/authApi";
import { useSnackbar } from "@/context/SnackbarContext";

const ResetPasswordPage = ({ params }) => {
    const router = useRouter();
    const { showSnackbar } = useSnackbar();

    const [resetPassword, { isLoading }] = useResetPasswordMutation();

    const methods = useForm({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: "",
            password2: "",
        },
    });

    const handleResetPasswordSubmit = async (data) => {
        const paramsObject = await params;
        const { id, token } = paramsObject;

        const res = await resetPassword({ data, id, token });

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
            showSnackbar("Password reset successful! Please login with your new password.", "success", 5000);
            methods.reset();
            router.push(ROUTES.AUTH.LOGIN);
        }
    };

    const authLinks = [
        {
            prefix: "Remember your password?",
            text: "Back to Login",
            href: ROUTES.AUTH.LOGIN,
            showIcon: true,
        },
    ];

    return (
        <AuthLayout
            title="Reset Password"
            subtitle="Create a new password for your account"
        >
            <AuthForm methods={methods} onSubmit={handleResetPasswordSubmit}>
                <AuthInput
                    name="password"
                    label="New Password"
                    type="password"
                    placeholder="Enter new password"
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