"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiMail, FiArrowRight, FiArrowLeft } from "react-icons/fi";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthForm from "@/components/auth/AuthForm";
import AuthInput from "@/components/auth/AuthInput";
import AuthButton from "@/components/auth/AuthButton";
import AuthDivider from "@/components/auth/AuthDivider";
import AuthLinks from "@/components/auth/AuthLinks";
import { ROUTES } from "@/routes/routes.constants";
import { resetPasswordRequestSchema } from "@/lib/validations/auth/zodSchema";
import { useForgotPasswordMutation } from "@/services/api/authApi";
import { useSnackbar } from "@/context/SnackbarContext";
import { usePasswordReset } from "@/context/PasswordResetContext";
import styles from "@/styles/auth/Shared.module.css";

const ForgotPasswordPage = () => {
    const router = useRouter();
    const { showSnackbar } = useSnackbar();
    const { startPasswordReset } = usePasswordReset();
    const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

    const methods = useForm({
        resolver: zodResolver(resetPasswordRequestSchema),
        defaultValues: {
            email: "",
        },
    });

    const handleForgotSubmit = async (data) => {
        const res = await forgotPassword(data);

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
            showSnackbar("Password reset OTP sent to your email", "success", 5000);
            methods.reset();

            // Get the reset_token from response
            const resetToken = res.data.data?.reset_token;

            // Store in context (not URL, not localStorage/sessionStorage)
            startPasswordReset(data.email, resetToken);

            // Redirect to OTP verification page without email in URL
            router.push(ROUTES.AUTH.VERIFY_OTP);
        }
    };

    const authLinks = [
        {
            text: "Back to Login",
            href: ROUTES.AUTH.LOGIN,
            showIcon: true,
            icon: <FiArrowLeft />,
        },
        {
            prefix: "Don't have an account?",
            text: "Create an account",
            href: ROUTES.AUTH.REGISTER,
            showIcon: true,
        },
    ];

    return (
        <AuthLayout
            title="Forgot Password"
            subtitle="Enter your email to reset your password"
        >
            <AuthForm methods={methods} onSubmit={handleForgotSubmit}>
                <div className={styles.infoBox}>
                    <p className={styles.infoText}>
                        We&apos;ll send you a 6-digit OTP to reset your password. The OTP will expire in 15 minutes.
                    </p>
                </div>

                <AuthInput
                    name="email"
                    label="Email Address"
                    type="email"
                    placeholder="you@example.com"
                    icon={<FiMail />}
                    required
                    autoComplete="email"
                />

                <AuthButton
                    type="submit"
                    isLoading={isLoading}
                    loadingText="Sending OTP..."
                    icon={<FiArrowRight />}
                    fullWidth
                >
                    Send Reset OTP
                </AuthButton>

                <AuthDivider />

                <AuthLinks links={authLinks} />
            </AuthForm>
        </AuthLayout>
    );
};

export default ForgotPasswordPage;