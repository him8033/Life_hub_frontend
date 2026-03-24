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
import { resetPasswordRequestSchema } from "@/lib/zodSchema";
import { useSendPasswordResetEmailMutation } from "@/services/api/authApi";
import { useSnackbar } from "@/context/SnackbarContext";
import styles from "@/styles/auth/Shared.module.css";

const ForgotPasswordPage = () => {
    const router = useRouter();
    const { showSnackbar } = useSnackbar();
    const [sendPasswordResetEmail, { isLoading }] = useSendPasswordResetEmailMutation();

    const methods = useForm({
        resolver: zodResolver(resetPasswordRequestSchema),
        defaultValues: {
            email: "",
        },
    });

    const handleForgotSubmit = async (data) => {
        const res = await sendPasswordResetEmail(data);

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
            showSnackbar(res.data.message, "success", 5000);
            methods.reset();
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
                        We'll send you a link to reset your password. The link will expire in 24 hours.
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
                    loadingText="Sending..."
                    icon={<FiArrowRight />}
                    fullWidth
                >
                    Send Reset Instructions
                </AuthButton>

                <AuthDivider />

                <AuthLinks links={authLinks} />
            </AuthForm>
        </AuthLayout>
    );
};

export default ForgotPasswordPage;