"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// UI Components
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import ButtonLoading from "@/components/Application/ButtonLoading";

// Assets & Icons
import Logo from "@/components/Application/Logo";
import { FiMail, FiArrowRight, FiKey, FiArrowLeft, FiCheckCircle } from "react-icons/fi";

// Routes
import { ROUTES } from "@/routes/routes.constants";

// Zod Schema
import { resetPasswordRequestSchema } from "@/lib/zodSchema";

// API Hooks
import { useSendPasswordResetEmailMutation } from "@/services/api/authApi";

// Snackbar Context
import { useSnackbar } from "@/context/SnackbarContext";

// Styles
import styles from "@/styles/auth.module.css";

const ForgotPasswordPage = () => {
    const router = useRouter();
    const { showSnackbar } = useSnackbar();

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [sendPasswordResetEmail, { isLoading }] = useSendPasswordResetEmailMutation();

    const form = useForm({
        resolver: zodResolver(resetPasswordRequestSchema),
        defaultValues: {
            email: "",
        },
    });

    const handleForgotSubmit = async (data) => {
        const res = await sendPasswordResetEmail(data);

        // Handle API Errors
        if (res.error) {
            const backendErrors = res.error.data?.errors;

            // Field-Level Errors
            if (backendErrors?.field_errors) {
                Object.entries(backendErrors.field_errors).forEach(
                    ([field, messages]) => {
                        form.setError(field, {
                            type: "server",
                            message: messages[0],
                        });
                    }
                );
            }

            // Global Errors
            if (backendErrors?.non_field_errors?.length) {
                showSnackbar(backendErrors.non_field_errors[0], "error", 5000);
            }

            return;
        }

        // Successful Login
        if (res.data) {
            showSnackbar(res.data.message, "success", 5000);
            setIsSubmitted(true);
            // Don't reset form immediately to show success state
            // form.reset();

            // // Important: DO NOT delay, because Snackbar is global
            // router.push(ROUTES.AUTH.LOGIN);
        }
    };

    return (
        <div className={styles.authContainer}>
            {/* Background Pattern */}
            <div className={styles.backgroundPattern}>
                <div className={styles.patternCircle1}></div>
                <div className={styles.patternCircle2}></div>
                <div className={styles.patternCircle3}></div>
            </div>

            <div className={styles.forgotWrapper}>
                {/* Logo Section */}
                <div className={styles.logoSection}>
                    <div className={styles.logoContainer}>
                        <Logo width={80} height={80} />
                        <h1 className={styles.projectName}>LifeHub</h1>
                        <p className={styles.projectTagline}>Reset your password securely</p>
                    </div>
                </div>

                {/* Forgot Password Card */}
                <Card className={styles.forgotCard}>
                    <CardContent className={styles.cardContent}>
                        {/* Back Button */}
                        <button
                            onClick={() => router.push(ROUTES.AUTH.LOGIN)}
                            className={styles.backButton}
                        >
                            <FiArrowLeft /> Back to Login
                        </button>

                        <div className={styles.formHeader}>
                            <div className={styles.titleIcon}>
                                <FiKey size={32} />
                            </div>
                            <h2 className={styles.formTitle}>
                                {isSubmitted ? 'Check Your Email' : 'Forgot Password'}
                            </h2>
                            <p className={styles.formSubtitle}>
                                {isSubmitted
                                    ? 'We sent password reset instructions to your email'
                                    : 'Enter your email to reset your password'
                                }
                            </p>
                        </div>

                        {isSubmitted ? (
                            /* Success State */
                            <div className={styles.successState}>
                                <div className={styles.successIcon}>
                                    <FiCheckCircle size={48} />
                                </div>
                                <div className={styles.successMessage}>
                                    <h3>Email Sent Successfully!</h3>
                                    <p>
                                        We've sent password reset instructions to the email
                                        address you provided. Please check your inbox and
                                        follow the link to reset your password.
                                    </p>
                                </div>
                                <div className={styles.successTips}>
                                    <h4>Didn't receive the email?</h4>
                                    <ul>
                                        <li>Check your spam or junk folder</li>
                                        <li>Make sure you entered the correct email address</li>
                                        <li>Wait a few minutes and try again</li>
                                    </ul>
                                </div>
                                <div className={styles.successActions}>
                                    <button
                                        onClick={() => setIsSubmitted(false)}
                                        className={styles.tryAgainButton}
                                    >
                                        Try Again
                                    </button>
                                    <button
                                        onClick={() => router.push(ROUTES.AUTH.LOGIN)}
                                        className={styles.backToLoginButton}
                                    >
                                        Back to Login
                                    </button>
                                </div>
                            </div>
                        ) : (
                            /* Form State */
                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(handleForgotSubmit)}
                                    className={styles.forgotForm}
                                >
                                    {/* Email Field */}
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem className={styles.formItem}>
                                                <FormLabel className={styles.formLabel}>
                                                    <FiMail className={styles.inputIcon} />
                                                    Email Address
                                                </FormLabel>
                                                <div className={styles.inputContainer}>
                                                    <FormControl>
                                                        <Input
                                                            type="email"
                                                            placeholder="you@example.com"
                                                            {...field}
                                                            className={styles.formInput}
                                                        />
                                                    </FormControl>
                                                </div>
                                                <FormMessage className={styles.errorMessage} />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Submit Button */}
                                    <ButtonLoading
                                        type="submit"
                                        text="Send Reset Instructions"
                                        isLoading={isLoading}
                                        className={styles.submitButton}
                                        icon={<FiArrowRight />}
                                    />
                                </form>
                            </Form>
                        )}

                        {/* Additional Information */}
                        <div className={styles.infoSection}>
                            <div className={styles.infoBox}>
                                <h4>Need help?</h4>
                                <p>
                                    If you're having trouble resetting your password,
                                    please contact our support team at{' '}
                                    <a href="mailto:support@lifehub.com" className={styles.supportLink}>
                                        support@lifehub.com
                                    </a>
                                </p>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className={styles.divider}>
                            <span>or</span>
                        </div>

                        {/* Register Link */}
                        <div className={styles.registerSection}>
                            <p>Don't have an account?</p>
                            <Link
                                href={ROUTES.AUTH.REGISTER}
                                className={styles.registerLink}
                            >
                                Create an account <FiArrowRight />
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Footer */}
                <div className={styles.footer}>
                    <p className={styles.footerText}>
                        © {new Date().getFullYear()} LifeHub. All rights reserved.
                    </p>
                    <div className={styles.footerLinks}>
                        <Link href="/privacy" className={styles.footerLink}>Privacy Policy</Link>
                        <Link href="/terms" className={styles.footerLink}>Terms of Service</Link>
                        <Link href="/help" className={styles.footerLink}>Help Center</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;