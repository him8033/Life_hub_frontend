"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiMail, FiLock, FiArrowRight } from "react-icons/fi";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthForm from "@/components/auth/AuthForm";
import AuthInput from "@/components/auth/AuthInput";
import AuthCheckbox from "@/components/auth/AuthCheckbox";
import AuthButton from "@/components/auth/AuthButton";
import AuthDivider from "@/components/auth/AuthDivider";
import AuthLinks from "@/components/auth/AuthLinks";
import { ROUTES } from "@/routes/routes.constants";
import { loginSchema } from "@/lib/validations/auth/zodSchema";
import { useLoginUserMutation, useResendOTPMutation } from "@/services/api/authApi";
import { tokenService } from "@/services/auth/token.service";
import { useSnackbar } from "@/context/SnackbarContext";
import styles from "@/styles/auth/Shared.module.css";
import AuthSocialButtons from "@/components/auth/AuthSocialButtons";

const LoginPage = () => {
    const router = useRouter();
    const { showSnackbar } = useSnackbar();
    const [loginUser, { isLoading }] = useLoginUserMutation();
    const [resendOTP, { isLoading: isSendingOTP }] = useResendOTPMutation();
    const [needsVerificationEmail, setNeedsVerificationEmail] = useState(null);

    const methods = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
    });

    const handleLoginSubmit = async (data) => {
        setNeedsVerificationEmail(null);
        const res = await loginUser(data);

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
                const errorMsg = backendErrors.non_field_errors[0];
                showSnackbar(errorMsg, "error", 5000);
                if (errorMsg.toLowerCase().includes("verify your email")) {
                    setNeedsVerificationEmail(data.email);
                }
            }

            return;
        }

        if (res.data) {
            showSnackbar(res.data.message, "success", 5000);
            // Store tokens and user profile from the new response format
            const tokens = res.data.data.tokens;
            const session = res.data.data.session;
            const user = res.data.data.user;
            tokenService.store({
                access: tokens.access,
                refresh: tokens.refresh,
                user: user,
                session_id: session.session_id,
                device: session.device,
            });

            // tokenService.store() already saves session_id to cookies
            // No need to call saveSessionId() separately

            // if (isRememberMe) {
            //     localStorage.setItem('rememberMe', 'true');
            // }

            methods.reset();
            router.push(ROUTES.DASHBOARD.HOME);
        }
    };

    const handleSocialLogin = async (provider) => {
        // Show loading state or snackbar
        showSnackbar(`Redirecting to ${provider}...`, "info", 3000);

        // Simulate OAuth redirect
        setTimeout(() => {
            window.location.href = `/api/auth/${provider}`;
        }, 1000);
    };

    const handleVerifyEmailClick = async (e) => {
        if (e) e.preventDefault();
        if (!needsVerificationEmail) return;

        try {
            const res = await resendOTP({
                email: needsVerificationEmail,
                purpose: "email_verification",
            });

            if (res.error) {
                const backendErrors = res.error.data?.errors;
                const errorMsg = backendErrors?.non_field_errors?.[0] || res.error.data?.message || "Failed to send verification OTP";
                showSnackbar(errorMsg, "error", 5000);
                router.push(`${ROUTES.AUTH.VERIFY_OTP}?email=${encodeURIComponent(needsVerificationEmail)}&purpose=email_verification`);
                return;
            }

            showSnackbar("Verification code sent to your email!", "success", 5000);
            router.push(`${ROUTES.AUTH.VERIFY_OTP}?email=${encodeURIComponent(needsVerificationEmail)}&purpose=email_verification`);
        } catch (err) {
            showSnackbar("Failed to send verification code. Please try again.", "error", 5000);
            router.push(`${ROUTES.AUTH.VERIFY_OTP}?email=${encodeURIComponent(needsVerificationEmail)}&purpose=email_verification`);
        }
    };

    const authLinks = [
        {
            prefix: "Don't have an account?",
            text: "Create an account",
            href: ROUTES.AUTH.REGISTER,
            showIcon: true,
        },
    ];

    return (
        <AuthLayout
            title="Welcome Back"
            subtitle="Sign in to continue to your dashboard"
        >
            <AuthForm methods={methods} onSubmit={handleLoginSubmit}>
                <AuthInput
                    name="email"
                    label="Email Address"
                    type="email"
                    placeholder="you@example.com"
                    icon={<FiMail />}
                    required
                    autoComplete="email"
                />

                <AuthInput
                    name="password"
                    label="Password"
                    type="password"
                    placeholder="Enter your password"
                    icon={<FiLock />}
                    required
                    showPasswordToggle
                    autoComplete="current-password"
                />

                <div className={styles.formOptions}>
                    <AuthCheckbox
                        name="rememberMe"
                        label="Remember me"
                    />
                    <a
                        href={ROUTES.AUTH.FORGOT_PASSWORD}
                        className={styles.forgotPassword}
                    >
                        Forgot Password?
                    </a>
                </div>

                <AuthButton
                    type="submit"
                    isLoading={isLoading}
                    loadingText="Signing In..."
                    icon={<FiArrowRight />}
                    fullWidth
                >
                    Sign In
                </AuthButton>

                {needsVerificationEmail && (
                    <div className={styles.infoBox} style={{ marginTop: "1rem", textAlign: "center" }}>
                        <p className={styles.infoText} style={{ marginBottom: "0.5rem" }}>
                            Your email is not verified yet.
                        </p>
                        <button
                            type="button"
                            onClick={handleVerifyEmailClick}
                            disabled={isSendingOTP}
                            style={{
                                background: "none",
                                border: "none",
                                color: "var(--primary)",
                                fontWeight: 600,
                                textDecoration: "underline",
                                cursor: isSendingOTP ? "not-allowed" : "pointer",
                                fontSize: "var(--text-sm)",
                            }}
                        >
                            {isSendingOTP ? "Sending OTP..." : "Verify Email Now"}
                        </button>
                    </div>
                )}


                {/* Social Login Buttons */}
                {/* <AuthSocialButtons
                    providers={['google', 'facebook', 'github']}
                    onProviderClick={handleSocialLogin}
                    layout="row"
                    buttonVariant="outline"
                    buttonSize="default"
                    showDivider={true}
                    dividerText="Or continue with"
                /> */}

                <AuthDivider />

                <AuthLinks links={authLinks} />
            </AuthForm>
        </AuthLayout>
    );
};

export default LoginPage;