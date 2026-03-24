"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiUser, FiMail, FiLock, FiArrowRight } from "react-icons/fi";

// Auth Components
import AuthLayout from "@/components/auth/AuthLayout";
import AuthForm from "@/components/auth/AuthForm";
import AuthInput from "@/components/auth/AuthInput";
import AuthCheckbox from "@/components/auth/AuthCheckbox";
import AuthButton from "@/components/auth/AuthButton";
import AuthDivider from "@/components/auth/AuthDivider";
import AuthLinks from "@/components/auth/AuthLinks";
import { ROUTES } from "@/routes/routes.constants";
import { registerSchema } from "@/lib/zodSchema";
import { useRegisterUserMutation } from "@/services/api/authApi";
import { useSnackbar } from "@/context/SnackbarContext";
import styles from "@/styles/auth/Shared.module.css";

const RegisterPage = () => {
    const router = useRouter();
    const { showSnackbar } = useSnackbar();
    const [registerUser, { isLoading }] = useRegisterUserMutation();

    const methods = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            password2: "",
            tc: false,
        },
    }); //TODO: handle zod errors in form

    const handleRegisterSubmit = async (data) => {
        const res = await registerUser(data);

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
            showSnackbar("Registration successful! Please login.", "success", 5000);
            methods.reset();
            router.push(ROUTES.AUTH.LOGIN);
        }
    };

    const authLinks = [
        {
            prefix: "Already have an account?",
            text: "Sign in",
            href: ROUTES.AUTH.LOGIN,
            showIcon: true,
        },
    ];

    return (
        <AuthLayout
            title="Create Account"
            subtitle="Join LifeHub to start your journey"
        >
            <AuthForm methods={methods} onSubmit={handleRegisterSubmit}>
                <AuthInput
                    name="name"
                    label="Full Name"
                    type="text"
                    placeholder="John Doe"
                    icon={<FiUser />}
                    required
                    autoComplete="name"
                />

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
                    placeholder="Create a password"
                    icon={<FiLock />}
                    required
                    showPasswordToggle
                    autoComplete="new-password"
                />

                <AuthInput
                    name="password2"
                    label="Confirm Password"
                    type="password"
                    placeholder="Confirm your password"
                    icon={<FiLock />}
                    required
                    showPasswordToggle
                    autoComplete="new-password"
                />

                <div className={styles.formOptions}>
                    <AuthCheckbox
                        name="tc"
                        label="I agree to the Terms and Conditions"
                    />
                </div>

                <AuthButton
                    type="submit"
                    isLoading={isLoading}
                    loadingText="Creating Account..."
                    icon={<FiArrowRight />}
                    fullWidth
                >
                    Create Account
                </AuthButton>

                <AuthDivider />

                <AuthLinks links={authLinks} />
            </AuthForm>
        </AuthLayout>
    );
};

export default RegisterPage;