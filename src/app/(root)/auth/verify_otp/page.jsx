"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { FiRefreshCw, FiArrowRight, FiMail, FiArrowLeft } from "react-icons/fi";

// Auth Components
import AuthLayout from "@/components/auth/AuthLayout";
import AuthForm from "@/components/auth/AuthForm";
import AuthButton from "@/components/auth/AuthButton";
import AuthDivider from "@/components/auth/AuthDivider";
import { ROUTES } from "@/routes/routes.constants";
import { useVerifyOTPMutation, useResendOTPMutation } from "@/services/api/authApi";
import { tokenService } from "@/services/auth/token.service";
import { useSnackbar } from "@/context/SnackbarContext";
import { usePasswordReset } from "@/context/PasswordResetContext";
import styles from "@/styles/auth/Shared.module.css";
import AuthLinks from "@/components/auth/AuthLinks";

const VerifyOTPContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { showSnackbar } = useSnackbar();
    const { resetEmail, resetToken, completeOTPVerification, clearResetData, startPasswordReset } = usePasswordReset();
    const [verifyOTP, { isLoading: isVerifying }] = useVerifyOTPMutation();
    const [resendOTP, { isLoading: isResending }] = useResendOTPMutation();
    const [countdown, setCountdown] = useState(0);
    const [attemptsRemaining, setAttemptsRemaining] = useState(3);
    const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
    const inputRefs = useRef([]);

    const queryEmail = searchParams.get("email");
    const queryPurpose = searchParams.get("purpose");

    const effectivePurpose = queryPurpose || (resetToken ? "forgot_password" : "email_verification");
    const effectiveEmail = queryEmail || resetEmail || "";
    const isEmailVerification = effectivePurpose === "email_verification";

    const methods = useForm({
        defaultValues: {
            email: effectiveEmail,
            otp_code: "",
            purpose: effectivePurpose,
            reset_token: resetToken || "",
        },
    });

    useEffect(() => {
        if (effectiveEmail) {
            methods.setValue("email", effectiveEmail);
        }
        if (effectivePurpose) {
            methods.setValue("purpose", effectivePurpose);
        }
        if (resetToken) {
            methods.setValue("reset_token", resetToken);
        }
    }, [effectiveEmail, effectivePurpose, resetToken, methods]);

    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [countdown]);

    // Handle OTP input changes
    const handleOtpChange = (index, value) => {
        methods.clearErrors();
        const numericValue = value.replace(/[^0-9]/g, "");

        if (!numericValue) {
            setOtpDigits((prev) => {
                const next = [...prev];
                next[index] = "";
                methods.setValue("otp_code", next.join(""));
                return next;
            });
            return;
        }

        if (numericValue.length > 1) {
            // Typing over existing character: use the last character typed
            if (numericValue.length === 2 && otpDigits[index]) {
                const char = numericValue.slice(-1);
                setOtpDigits((prev) => {
                    const next = [...prev];
                    next[index] = char;
                    methods.setValue("otp_code", next.join(""));
                    return next;
                });
                if (index < 5) {
                    inputRefs.current[index + 1]?.focus();
                }
                return;
            }

            // Autofill or multi-character paste
            const chars = numericValue.slice(0, 6 - index).split("");
            setOtpDigits((prev) => {
                const next = [...prev];
                chars.forEach((c, i) => {
                    if (index + i < 6) {
                        next[index + i] = c;
                    }
                });
                methods.setValue("otp_code", next.join(""));
                return next;
            });
            const nextFocus = Math.min(5, index + chars.length);
            inputRefs.current[nextFocus]?.focus();
            return;
        }

        // Single digit entered
        setOtpDigits((prev) => {
            const next = [...prev];
            next[index] = numericValue;
            methods.setValue("otp_code", next.join(""));
            return next;
        });

        if (numericValue && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    // Handle backspace
    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace") {
            methods.clearErrors();
            if (!otpDigits[index] && index > 0) {
                inputRefs.current[index - 1]?.focus();
            } else if (otpDigits[index]) {
                setOtpDigits((prev) => {
                    const next = [...prev];
                    next[index] = "";
                    methods.setValue("otp_code", next.join(""));
                    return next;
                });
            }
        }
    };

    // Handle paste
    const handlePaste = (e) => {
        e.preventDefault();
        methods.clearErrors();
        const pastedData = e.clipboardData.getData("text").replace(/[^0-9]/g, "");

        if (pastedData) {
            const chars = pastedData.slice(0, 6).split("");
            const newOtpDigits = ["", "", "", "", "", ""];
            chars.forEach((c, i) => {
                newOtpDigits[i] = c;
            });
            setOtpDigits(newOtpDigits);
            methods.setValue("otp_code", newOtpDigits.join(""));
            const focusIndex = Math.min(5, chars.length);
            inputRefs.current[focusIndex]?.focus();
        }
    };

    const handleVerifySubmit = async (data) => {
        methods.clearErrors();

        if (effectivePurpose === "forgot_password") {
            if (!effectiveEmail || !resetToken) {
                showSnackbar("Invalid password reset request. Please start over.", "error", 5000);
                router.push(ROUTES.AUTH.FORGOT_PASSWORD);
                return;
            }
        } else {
            if (!effectiveEmail) {
                showSnackbar("Missing email address. Please register again.", "error", 5000);
                router.push(ROUTES.AUTH.REGISTER);
                return;
            }
        }

        const otpCode = methods.getValues("otp_code") || otpDigits.join("");
        if (otpCode.length !== 6) {
            showSnackbar("Please enter a complete 6-digit OTP code.", "error", 4000);
            return;
        }

        const payload = {
            ...data,
            email: effectiveEmail,
            otp_code: otpCode,
            purpose: effectivePurpose,
        };

        if (effectivePurpose === "forgot_password") {
            payload.reset_token = resetToken;
        }

        const res = await verifyOTP(payload);

        if (res.error) {
            const backendErrors = res.error.data?.errors;

            // Check for attempts remaining
            if (backendErrors?.non_field_errors?.length) {
                const errorMsg = backendErrors.non_field_errors[0];
                showSnackbar(errorMsg, "error", 5000);

                // Update attempts remaining if the error message contains it
                const attemptsMatch = errorMsg.match(/(\d+) attempts? remaining/);
                if (attemptsMatch) {
                    setAttemptsRemaining(parseInt(attemptsMatch[1]));
                }
            }

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

            // Clear OTP input on error
            setOtpDigits(["", "", "", "", "", ""]);
            methods.setValue("otp_code", "");
            inputRefs.current[0]?.focus();

            // Stay on the same page for user to retry
            return;
        }

        if (res.data) {
            methods.reset();

            if (effectivePurpose === "forgot_password") {
                showSnackbar("OTP verified successfully!", "success", 5000);
                const confirmToken = res.data.data?.confirm_token;

                if (!confirmToken) {
                    showSnackbar("Invalid response from server. Please try again.", "error", 5000);
                    return;
                }

                // Store in context
                completeOTPVerification(confirmToken);
                // Redirect to reset password page without email in URL
                router.push(ROUTES.AUTH.RESET_PASSWORD);
            } else {
                const responseData = res.data?.data;
                if (responseData?.tokens) {
                    const tokens = responseData.tokens;
                    const session = responseData.session;
                    const user = responseData.user;
                    tokenService.store({
                        access: tokens.access,
                        refresh: tokens.refresh,
                        user: user,
                        session_id: session?.session_id,
                        device: session?.device,
                    });
                    showSnackbar("Email verified successfully! Welcome to your dashboard.", "success", 5000);
                    router.push(ROUTES.DASHBOARD.HOME);
                } else {
                    showSnackbar("Email verified successfully! You can now log in.", "success", 5000);
                    router.push(ROUTES.AUTH.LOGIN);
                }
            }
        }
    };

    const handleResendOTP = async () => {
        if (countdown > 0) return;

        const res = await resendOTP({
            email: effectiveEmail,
            purpose: effectivePurpose,
        });

        if (res.error) {
            const backendErrors = res.error.data?.errors;

            if (backendErrors?.non_field_errors?.length) {
                showSnackbar(backendErrors.non_field_errors[0], "error", 5000);
            }

            return;
        }

        if (res.data) {
            showSnackbar("OTP sent successfully!", "success", 5000);

            // Update reset_token if returned (for forgot_password flow)
            const newResetToken = res.data.data?.reset_token;
            if (newResetToken) {
                if (startPasswordReset) {
                    startPasswordReset(effectiveEmail, newResetToken);
                }
                methods.setValue("reset_token", newResetToken);
            }

            // Set countdown from response or default to 60 seconds
            const cooldownTime = res.data.data?.cooldown_seconds || 60;
            setCountdown(cooldownTime);

            // Reset attempts
            setAttemptsRemaining(3);

            // Clear OTP input
            setOtpDigits(["", "", "", "", "", ""]);
            methods.setValue("otp_code", "");
            inputRefs.current[0]?.focus();
        }
    };

    const hasAutoSentRef = useRef(false);
    useEffect(() => {
        const autoSend = searchParams.get("auto_send") === "true" || searchParams.get("send_otp") === "true";
        if (autoSend && effectiveEmail && !hasAutoSentRef.current) {
            hasAutoSentRef.current = true;
            handleResendOTP();
        }
    }, [searchParams, effectiveEmail]);

    const authLinks = isEmailVerification
        ? [
            {
                text: "Back to Login",
                href: ROUTES.AUTH.LOGIN,
                showIcon: true,
                icon: <FiArrowLeft />,
            },
            {
                prefix: "Need a new account?",
                text: "Create an account",
                href: ROUTES.AUTH.REGISTER,
                showIcon: true,
            },
        ]
        : [
            {
                text: "Back to Forgot Password",
                href: ROUTES.AUTH.FORGOT_PASSWORD,
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
            title={isEmailVerification ? "Verify Your Email" : "Verify OTP"}
            subtitle={
                isEmailVerification
                    ? "Enter the 6-digit code sent to your email to activate your account"
                    : "Enter the 6-digit code sent to your email"
            }
        >
            <AuthForm methods={methods} onSubmit={handleVerifySubmit}>
                {/* Show email as read-only text */}
                {effectiveEmail && (
                    <div className={styles.infoBox}>
                        <div className={styles.emailDisplay}>
                            <FiMail className={styles.emailIcon} />
                            <span className={styles.emailText}>OTP sent to: {effectiveEmail}</span>
                        </div>
                    </div>
                )}

                {/* OTP Input Boxes */}
                <div className={styles.otpContainer}>
                    {otpDigits.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => (inputRefs.current[index] = el)}
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            onPaste={handlePaste}
                            className={styles.otpInput}
                            autoComplete="one-time-code"
                        />
                    ))}
                </div>

                {/* Attempts Remaining */}
                {attemptsRemaining < 3 && (
                    <div className={styles.attemptsWarning}>
                        <span className={styles.attemptsText}>
                            {attemptsRemaining} attempt{attemptsRemaining !== 1 ? "s" : ""} remaining
                        </span>
                    </div>
                )}

                {/* Resend Button with Timer */}
                <div className={styles.resendSection}>
                    <button
                        type="button"
                        onClick={handleResendOTP}
                        disabled={isResending || countdown > 0}
                        className={styles.resendButton}
                    >
                        {isResending ? (
                            "Sending..."
                        ) : countdown > 0 ? (
                            `Resend in ${countdown}s`
                        ) : (
                            <>
                                <FiRefreshCw /> Resend OTP
                            </>
                        )}
                    </button>
                </div>

                <AuthButton
                    type="submit"
                    isLoading={isVerifying}
                    loadingText="Verifying..."
                    icon={<FiArrowRight />}
                    fullWidth
                >
                    {isEmailVerification ? "Verify Email" : "Verify OTP"}
                </AuthButton>

                <AuthDivider />

                {/* Back Button */}
                <AuthLinks links={authLinks} />
            </AuthForm>
        </AuthLayout>
    );
};

const VerifyOTPPage = () => {
    return (
        <Suspense fallback={<div>Loading verification...</div>}>
            <VerifyOTPContent />
        </Suspense>
    );
};

export default VerifyOTPPage;