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
import { FiArrowRight, FiLock, FiMail, FiShield, FiMapPin, FiUsers } from "react-icons/fi";

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
import styles from "@/styles/auth/Login.module.css";

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
            router.push(ROUTES.DASHBOARD.HOME);
        }
    };

    return (
        <div className={styles.authLayout}>
            {/* Left Side - Branding (Hidden on mobile except logo/slogan) */}
            <div className={styles.brandingSection}>
                <div className={styles.brandingContent}>
                    {/* Logo and Slogan - Always Visible */}
                    <div className={styles.logoContainer}>
                        <div className={styles.logoWrapper}>
                            <Logo width={48} height={48} />
                            <h1 className={styles.projectName}>LifeHub</h1>
                        </div>
                        <p className={styles.projectTagline}>
                            Your gateway to amazing travel experiences
                        </p>
                    </div>

                    {/* Features List - Hidden on Mobile */}
                    <div className={styles.featuresList}>
                        <div className={styles.featureItem}>
                            <div className={styles.featureIcon}>
                                <FiShield />
                            </div>
                            <div className={styles.featureText}>
                                <h3>Secure Authentication</h3>
                                <p>Bank-level security for your account</p>
                            </div>
                        </div>
                        <div className={styles.featureItem}>
                            <div className={styles.featureIcon}>
                                <FiMapPin />
                            </div>
                            <div className={styles.featureText}>
                                <h3>Travel Spot Management</h3>
                                <p>Manage all your travel destinations</p>
                            </div>
                        </div>
                        <div className={styles.featureItem}>
                            <div className={styles.featureIcon}>
                                <FiUsers />
                            </div>
                            <div className={styles.featureText}>
                                <h3>Community Sharing</h3>
                                <p>Share experiences with fellow travelers</p>
                            </div>
                        </div>
                    </div>

                    {/* Testimonial - Hidden on Mobile */}
                    <div className={styles.testimonial}>
                        <p className={styles.testimonialText}>
                            "LifeHub transformed how I plan and document my travels. The community features helped me discover hidden gems I would have otherwise missed. Highly recommended!"
                        </p>
                        <div className={styles.testimonialAuthor}>
                            <div className={styles.authorAvatar}>S</div>
                            <div className={styles.authorInfo}>
                                <h4>Sarah Johnson</h4>
                                <p>Travel Enthusiast & Blogger</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className={styles.formSection}>
                <div className={styles.formWrapper}>
                    <Card className={styles.loginCard}>
                        <CardContent className={styles.cardContent}>
                            <div className={styles.formHeader}>
                                <h2 className={styles.formTitle}>Welcome Back</h2>
                                <p className={styles.formSubtitle}>
                                    Sign in to continue to your dashboard
                                </p>
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
                                                    Email Address
                                                </FormLabel>
                                                <div className={styles.inputContainer}>
                                                    <FiMail className={styles.inputIcon} />
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

                                    {/* Password Field */}
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem className={styles.formItem}>
                                                <FormLabel className={styles.formLabel}>
                                                    Password
                                                </FormLabel>
                                                <div className={styles.inputContainer}>
                                                    <FiLock className={styles.inputIcon} />
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
                                                        tabIndex={-1}
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
                                        <span>Don't have an account?</span>
                                    </div>

                                    {/* Register Link */}
                                    <div className={styles.registerSection}>
                                        <Link
                                            href={ROUTES.AUTH.REGISTER}
                                            className={styles.registerLink}
                                        >
                                            Create an account
                                        </Link>
                                    </div>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>

                    {/* Footer Links */}
                    <div className={styles.formFooter}>
                        <div className={styles.footerLinks}>
                            <Link href="/privacy" className={styles.footerLink}>
                                Privacy Policy
                            </Link>
                            <span className={styles.separator}>•</span>
                            <Link href="/terms" className={styles.footerLink}>
                                Terms of Service
                            </Link>
                            <span className={styles.separator}>•</span>
                            <Link href="/help" className={styles.footerLink}>
                                Help Center
                            </Link>
                        </div>
                        <p className={styles.copyright}>
                            © {new Date().getFullYear()} LifeHub. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;