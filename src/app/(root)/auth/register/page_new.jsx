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

// Icons & Assets
import Logo from "@/components/Application/Logo";
import { FaRegEyeSlash, FaRegEye, FaShieldAlt, FaMapMarkedAlt, FaUsers } from "react-icons/fa";
import { FiArrowRight, FiUser, FiMail, FiLock, FiCheck, FiShield, FiMapPin, FiUserCheck } from "react-icons/fi";

// Schema
import { registerSchema } from "@/lib/zodSchema";

// Routes
import { ROUTES } from "@/routes/routes.constants";

// API
import { useRegisterUserMutation } from "@/services/api/authApi";

// Snackbar
import { useSnackbar } from "@/context/SnackbarContext";

// Styles
import styles from "@/styles/auth/Register.module.css"; // Create a new CSS module

const RegisterPage = () => {
    const router = useRouter();
    const { showSnackbar } = useSnackbar();

    const [isPasswordVisible, setIsPasswordVisible] = useState({
        password: false,
        confirmPassword: false
    });
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [registerUser, { isLoading }] = useRegisterUserMutation();

    const form = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: "",
            name: "",
            password: "",
            password2: "",
            tc: false,
        },
    });

    // Check password strength
    const checkPasswordStrength = (password) => {
        let strength = 0;

        if (password.length >= 8) strength += 25;
        if (/[a-z]/.test(password)) strength += 25;
        if (/[A-Z]/.test(password)) strength += 25;
        if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) strength += 25;

        setPasswordStrength(strength);
    };

    const handlePasswordChange = (value) => {
        checkPasswordStrength(value);
    };

    const getStrengthColor = () => {
        if (passwordStrength <= 25) return "#ef4444";
        if (passwordStrength <= 50) return "#f59e0b";
        if (passwordStrength <= 75) return "#3b82f6";
        return "#10b981";
    };

    const getStrengthText = () => {
        if (passwordStrength <= 25) return "Weak";
        if (passwordStrength <= 50) return "Fair";
        if (passwordStrength <= 75) return "Good";
        return "Strong";
    };

    const togglePasswordVisibility = (field) => {
        setIsPasswordVisible(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handleRegisterSubmit = async (data) => {
        const res = await registerUser(data);

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
            setPasswordStrength(0);
            router.push(ROUTES.AUTH.LOGIN);
        }
    };

    const passwordRequirements = [
        { text: "At least 8 characters", check: (pwd) => pwd.length >= 8 },
        { text: "Contains lowercase letter", check: (pwd) => /[a-z]/.test(pwd) },
        { text: "Contains uppercase letter", check: (pwd) => /[A-Z]/.test(pwd) },
        { text: "Contains number or special character", check: (pwd) => /[0-9]/.test(pwd) || /[^A-Za-z0-9]/.test(pwd) },
    ];

    return (
        <div className={styles.authLayout}>
            {/* Left Side - Branding */}
            <div className={styles.brandingSection}>
                <div className={styles.brandingContent}>
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
                                <FiUserCheck />
                            </div>
                            <div className={styles.featureText}>
                                <h3>Join Our Community</h3>
                                <p>Connect with fellow travelers worldwide</p>
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

            {/* Right Side - Register Form */}
            <div className={styles.formSection}>
                <div className={styles.formWrapper}>
                    <Card className={styles.registerCard}>
                        <CardContent className={styles.cardContent}>
                            <div className={styles.formHeader}>
                                <h2 className={styles.formTitle}>Create Account</h2>
                                <p className={styles.formSubtitle}>
                                    Join LifeHub and start your journey today
                                </p>
                            </div>

                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(handleRegisterSubmit)}
                                    className={styles.registerForm}
                                >
                                    {/* Name Field */}
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem className={styles.formItem}>
                                                <FormLabel className={styles.formLabel}>
                                                    Full Name
                                                </FormLabel>
                                                <div className={styles.inputContainer}>
                                                    <FiUser className={styles.inputIcon} />
                                                    <FormControl>
                                                        <Input
                                                            type="text"
                                                            placeholder="John Doe"
                                                            {...field}
                                                            className={styles.formInput}
                                                        />
                                                    </FormControl>
                                                </div>
                                                <FormMessage className={styles.errorMessage} />
                                            </FormItem>
                                        )}
                                    />

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
                                                            type={isPasswordVisible.password ? "text" : "password"}
                                                            placeholder="Create a strong password"
                                                            {...field}
                                                            onChange={(e) => {
                                                                field.onChange(e);
                                                                handlePasswordChange(e.target.value);
                                                            }}
                                                            className={styles.formInput}
                                                        />
                                                    </FormControl>
                                                    <button
                                                        type="button"
                                                        className={styles.eyeButton}
                                                        onClick={() => togglePasswordVisibility("password")}
                                                        tabIndex={-1}
                                                    >
                                                        {isPasswordVisible.password ? (
                                                            <FaRegEyeSlash />
                                                        ) : (
                                                            <FaRegEye />
                                                        )}
                                                    </button>
                                                </div>

                                                {/* Password Strength Meter */}
                                                {field.value && (
                                                    <div className={styles.strengthMeter}>
                                                        <div className={styles.strengthBar}>
                                                            <div
                                                                className={styles.strengthFill}
                                                                style={{
                                                                    width: `${passwordStrength}%`,
                                                                    backgroundColor: getStrengthColor()
                                                                }}
                                                            />
                                                        </div>
                                                        <div className={styles.strengthText}>
                                                            <span>Strength: </span>
                                                            <span style={{ color: getStrengthColor(), fontWeight: 600 }}>
                                                                {getStrengthText()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Password Requirements */}
                                                {field.value && (
                                                    <div className={styles.requirementsGrid}>
                                                        {passwordRequirements.map((req, index) => (
                                                            <div key={index} className={styles.requirementItem}>
                                                                {req.check(field.value) ? (
                                                                    <FiCheck className={styles.requirementIconValid} />
                                                                ) : (
                                                                    <div className={styles.requirementIconInvalid} />
                                                                )}
                                                                <span className={`${styles.requirementText} ${req.check(field.value) ? styles.requirementMet : ''
                                                                    }`}>
                                                                    {req.text}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

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
                                                    Confirm Password
                                                </FormLabel>
                                                <div className={styles.inputContainer}>
                                                    <FiLock className={styles.inputIcon} />
                                                    <FormControl>
                                                        <Input
                                                            type={isPasswordVisible.confirmPassword ? "text" : "password"}
                                                            placeholder="Confirm your password"
                                                            {...field}
                                                            className={styles.formInput}
                                                        />
                                                    </FormControl>
                                                    <button
                                                        type="button"
                                                        className={styles.eyeButton}
                                                        onClick={() => togglePasswordVisibility("confirmPassword")}
                                                        tabIndex={-1}
                                                    >
                                                        {isPasswordVisible.confirmPassword ? (
                                                            <FaRegEyeSlash />
                                                        ) : (
                                                            <FaRegEye />
                                                        )}
                                                    </button>
                                                </div>

                                                {/* Password Match Indicator */}
                                                {form.watch("password") && field.value && (
                                                    <div className={styles.matchIndicator}>
                                                        {form.watch("password") === field.value ? (
                                                            <div className={styles.matchValid}>
                                                                <FiCheck /> Passwords match
                                                            </div>
                                                        ) : (
                                                            <div className={styles.matchInvalid}>
                                                                <div className={styles.xIcon} /> Passwords do not match
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                <FormMessage className={styles.errorMessage} />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Terms & Conditions */}
                                    <FormField
                                        control={form.control}
                                        name="tc"
                                        render={({ field }) => (
                                            <FormItem className={styles.termsItem}>
                                                <div className={styles.termsContainer}>
                                                    <input
                                                        type="checkbox"
                                                        id="tc"
                                                        checked={field.value}
                                                        onChange={(e) => field.onChange(e.target.checked)}
                                                        className={styles.termsCheckbox}
                                                    />
                                                    <label htmlFor="tc" className={styles.termsLabel}>
                                                        I agree to the <Link href="/terms" className={styles.termsLink}>Terms of Service</Link> and <Link href="/privacy" className={styles.termsLink}>Privacy Policy</Link>
                                                    </label>
                                                </div>
                                                <FormMessage className={styles.errorMessage} />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Submit Button */}
                                    <ButtonLoading
                                        type="submit"
                                        text="Create Account"
                                        isLoading={isLoading}
                                        className={styles.submitButton}
                                        icon={<FiUserCheck />}
                                    />

                                    {/* Divider */}
                                    <div className={styles.divider}>
                                        <span>Already have an account?</span>
                                    </div>

                                    {/* Login Link */}
                                    <div className={styles.loginSection}>
                                        <Link
                                            href={ROUTES.AUTH.LOGIN}
                                            className={styles.loginLink}
                                        >
                                            Sign in to your account <FiArrowRight />
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

export default RegisterPage;