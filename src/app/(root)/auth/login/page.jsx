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
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { FiArrowRight, FiLock, FiMail } from "react-icons/fi";

// Routes
import { ROUTES } from "@/routes/routes.constants";

// Zod Schema
import { loginSchema } from "@/lib/zodSchema";

// API Hooks
import { useLoginUserMutation } from "@/services/api/authApi";
import { tokenService } from "@/services/auth/token.service";

// Snackbar Context
import { useSnackbar } from "@/context/SnackbarContext";

// Styles
import styles from "@/styles/auth.module.css";

const LoginPage = () => {
    const router = useRouter();
    const { showSnackbar } = useSnackbar();

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isRememberMe, setIsRememberMe] = useState(false);
    const [LoginUser, { isLoading }] = useLoginUserMutation();

    const form = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const handleLoginSubmit = async (data) => {
        const res = await LoginUser(data);

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

            // Save Tokens (using new industry-level token service)
            tokenService.store(res.data.data);
            form.reset();
            router.push(ROUTES.DASHBOARD.DASHBOARD);
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

            <div className={styles.loginWrapper}>
                {/* Logo Section */}
                <div className={styles.logoSection}>
                    <div className={styles.logoContainer}>
                        <Logo width={80} height={80} />
                        <h1 className={styles.projectName}>LifeHub</h1>
                        <p className={styles.projectTagline}>Manage your life, one hub at a time</p>
                    </div>
                </div>

                {/* Login Form Card */}
                <Card className={styles.loginCard}>
                    <CardContent className={styles.cardContent}>
                        <div className={styles.formHeader}>
                            <h2 className={styles.formTitle}>Welcome Back</h2>
                            <p className={styles.formSubtitle}>Sign in to continue to your dashboard</p>
                        </div>

                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(handleLoginSubmit)}
                                className={styles.loginForm}
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
                                            <FormControl>
                                                <Input
                                                    type="email"
                                                    placeholder="you@example.com"
                                                    {...field}
                                                    className={styles.formInput}
                                                />
                                            </FormControl>
                                            <FormMessage className={styles.errorMessage} />
                                        </FormItem>
                                    )}
                                />

                                {/* Password Field */}
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem className={styles.formItem}>
                                            <FormLabel className={styles.formLabel}>
                                                <FiLock className={styles.inputIcon} />
                                                Password
                                            </FormLabel>
                                            <div className={styles.passwordContainer}>
                                                <FormControl>
                                                    <Input
                                                        type={isPasswordVisible ? "text" : "password"}
                                                        placeholder="Enter your password"
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

                                {/* Remember Me & Forgot Password */}
                                <div className={styles.formOptions}>
                                    <label className={styles.rememberMe}>
                                        <input
                                            type="checkbox"
                                            checked={isRememberMe}
                                            onChange={(e) => setIsRememberMe(e.target.checked)}
                                            className={styles.checkbox}
                                        />
                                        <span>Remember me</span>
                                    </label>
                                    <Link
                                        href={ROUTES.AUTH.FORGOT_PASSWORD}
                                        className={styles.forgotPassword}
                                    >
                                        Forgot Password?
                                    </Link>
                                </div>

                                {/* Submit Button */}
                                <ButtonLoading
                                    type="submit"
                                    text="Sign In"
                                    isLoading={isLoading}
                                    className={styles.submitButton}
                                    icon={<FiArrowRight />}
                                />

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
                            </form>
                        </Form>
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

export default LoginPage;