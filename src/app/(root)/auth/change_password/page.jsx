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
import DashboardLayout from "@/components/dashboard/DashboardLayout";

// Icons & Assets
import Logo from "@/components/Application/Logo";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { FiLock, FiArrowLeft } from "react-icons/fi";

// Schema
import { changePasswordSchema } from "@/lib/zodSchema";

// Routes
import { ROUTES } from "@/routes/routes.constants";

// API
import { useChangeUserPasswordMutation } from "@/services/api/authApi";

// Snackbar
import { useSnackbar } from "@/context/SnackbarContext";

// Styles
import styles from "@/styles/dashboard.module.css";

const ChangePassword = () => {
    const router = useRouter();
    const { showSnackbar } = useSnackbar();

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [changeUserPassword, { isLoading }] = useChangeUserPasswordMutation();

    const form = useForm({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            password: "",
            password2: "",
        },
    });

    const handleChangePasswordSubmit = async (data) => {
        const res = await changeUserPassword(data);

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
            // router.push(WEBSITE_DASHBOARD);
        }
    };

    return (
        <DashboardLayout>
            <div className={styles.changePasswordContainer}>
                {/* Back Button */}
                <div className={styles.backButtonWrapper}>
                    <button
                        onClick={() => router.back()}
                        className={styles.backButton}
                    >
                        <FiArrowLeft /> Back
                    </button>
                </div>

                <div className={styles.changePasswordCard}>
                    <CardContent className={styles.cardContent}>
                        {/* Page Title */}
                        <div className={styles.titleSection}>
                            <div className={styles.titleIcon}>
                                <FiLock size={32} />
                            </div>
                            <h1 className={styles.pageTitle}>
                                Change Password
                            </h1>
                            <p className={styles.pageSubtitle}>
                                Update your password to keep your account secure
                            </p>
                        </div>

                        {/* Form */}
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(handleChangePasswordSubmit)}
                                className={styles.changePasswordForm}
                            >
                                {/* Password */}
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem className={styles.formItem}>
                                            <FormLabel className={styles.formLabel}>
                                                New Password
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="password"
                                                    placeholder="Enter new password"
                                                    {...field}
                                                    className={styles.formInput}
                                                />
                                            </FormControl>
                                            <FormMessage className={styles.errorMessage} />
                                        </FormItem>
                                    )}
                                />

                                {/* Confirm Password */}
                                <FormField
                                    control={form.control}
                                    name="password2"
                                    render={({ field }) => (
                                        <FormItem className={styles.formItem}>
                                            <FormLabel className={styles.formLabel}>
                                                Confirm Password
                                            </FormLabel>
                                            <div className={styles.passwordContainer}>
                                                <FormControl>
                                                    <Input
                                                        type={isPasswordVisible ? "text" : "password"}
                                                        placeholder="Confirm new password"
                                                        {...field}
                                                        className={styles.formInput}
                                                    />
                                                </FormControl>
                                                <button
                                                    type="button"
                                                    className={styles.eyeButton}
                                                    onClick={() =>
                                                        setIsPasswordVisible((prev) => !prev)
                                                    }
                                                >
                                                    {isPasswordVisible ? (
                                                        <FaRegEye />
                                                    ) : (
                                                        <FaRegEyeSlash />
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
                                    text="Change Password"
                                    isLoading={isLoading}
                                    className={styles.submitButton}
                                />

                                {/* Clear Form Button */}
                                <button
                                    type="button"
                                    onClick={() => form.reset()}
                                    className={styles.clearButton}
                                    disabled={isLoading}
                                >
                                    Clear Form
                                </button>
                            </form>
                        </Form>
                    </CardContent>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ChangePassword;