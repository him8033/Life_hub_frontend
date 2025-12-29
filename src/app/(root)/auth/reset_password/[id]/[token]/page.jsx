"use client";

import React, { useState } from "react";
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

// Icons & Assets
import Logo from "@/components/Application/Logo";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { FiLock, FiCheck, FiX, FiArrowRight, FiKey } from "react-icons/fi";

// Schema
import { resetPasswordSchema } from "@/lib/zodSchema";

// Routes
import { ROUTES } from "@/routes/routes.constants";

// API
import { useResetPasswordMutation } from "@/services/api/authApi";

// Snackbar
import { useSnackbar } from "@/context/SnackbarContext";

// Styles
import styles from "@/styles/auth.module.css";

const ResetPassword = ({ params }) => {
    const router = useRouter();
    const { showSnackbar } = useSnackbar();

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [resetPassword, { isLoading }] = useResetPasswordMutation();

    const form = useForm({
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

        // Handle Backend Errors
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

        // Successful Registration
        if (res.data) {
            showSnackbar(res.data.message, "success", 5000);
            form.reset();
            router.push(ROUTES.AUTH.LOGIN);
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

            <div className={styles.resetWrapper}>
                {/* Logo Section */}
                <div className={styles.logoSection}>
                    <div className={styles.logoContainer}>
                        <Logo width={80} height={80} />
                        <h1 className={styles.projectName}>LifeHub</h1>
                        <p className={styles.projectTagline}>Reset your password securely</p>
                    </div>
                </div>

                {/* Reset Password Card */}
                <Card className={styles.resetCard}>
                    <CardContent className={styles.cardContent}>
                        <div className={styles.formHeader}>
                            <div className={styles.titleIcon}>
                                <FiKey size={32} />
                            </div>
                            <h2 className={styles.formTitle}>Reset Password</h2>
                            <p className={styles.formSubtitle}>
                                Create a new password for your LifeHub account
                            </p>
                        </div>

                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(handleResetPasswordSubmit)}
                                className={styles.resetForm}
                            >
                                {/* Password Field */}
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem className={styles.formItem}>
                                            <FormLabel className={styles.formLabel}>
                                                <FiLock className={styles.inputIcon} />
                                                New Password
                                            </FormLabel>
                                            <div className={styles.passwordContainer}>
                                                <FormControl>
                                                    <Input
                                                        type="password"
                                                        placeholder="Enter new password"
                                                        {...field}
                                                        className={styles.formInput}
                                                    />
                                                </FormControl>
                                            </div>
                                            <FormMessage className={styles.errorMessage} />
                                        </FormItem>
                                    )}
                                />

                                {/* Confirm Password Field */}
                                <FormField
                                    control={form.control}
                                    name="password2"
                                    render={({ field }) => (
                                        <FormItem className={styles.formItem}>
                                            <FormLabel className={styles.formLabel}>
                                                <FiLock className={styles.inputIcon} />
                                                Confirm Password
                                            </FormLabel>
                                            <div className={styles.passwordContainer}>
                                                <FormControl>
                                                    <Input
                                                        type={isPasswordVisible ? "text" : "password"}
                                                        placeholder="Confirm your password"
                                                        {...field}
                                                        className={styles.formInput}
                                                    />
                                                </FormControl>
                                                <button
                                                    type="button"
                                                    className={styles.eyeButton}
                                                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                                                >
                                                    {isPasswordVisible ? (
                                                        <FaRegEyeSlash />
                                                    ) : (
                                                        <FaRegEye />
                                                    )}
                                                </button>
                                            </div>
                                            <FormMessage className={styles.errorMessage} />
                                        </FormItem>
                                    )}
                                />

                                {/* Submit Button */}
                                <ButtonLoading
                                    type="submit"
                                    text="Reset Password"
                                    isLoading={isLoading}
                                    className={styles.submitButton}
                                    icon={<FiArrowRight />}
                                />
                            </form>
                        </Form>

                        {/* Back to Login Link */}
                        <div className={styles.backToLoginSection}>
                            <p>
                                <span>Remember your password? </span>
                                <a
                                    href={ROUTES.AUTH.LOGIN}
                                    className={styles.backToLoginLink}
                                >
                                    Back to Login
                                </a>
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Footer */}
                <div className={styles.footer}>
                    <p className={styles.footerText}>
                        © {new Date().getFullYear()} LifeHub. All rights reserved.
                    </p>
                    <div className={styles.footerLinks}>
                        <a href="/privacy" className={styles.footerLink}>Privacy Policy</a>
                        <a href="/terms" className={styles.footerLink}>Terms of Service</a>
                        <a href="/help" className={styles.footerLink}>Help Center</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;