"use client";

import React, { useState } from "react";
import Image from "next/image";
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

// Routes
import { ROUTES } from "@/routes/routes.constants";

// Zod Schema
import { resetPasswordRequestSchema } from "@/lib/zodSchema";

// API Hooks
import { useSendPasswordResetEmailMutation } from "@/services/api/authApi";

// Snackbar Context
import { useSnackbar } from "@/context/SnackbarContext";

const ForgotPasswordPage = () => {
    const router = useRouter();
    const { showSnackbar } = useSnackbar();

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
            form.reset();

            // Important: DO NOT delay, because Snackbar is global
            router.push(ROUTES.AUTH.LOGIN);
        }
    };

    return (
        <Card className="w-full max-w-sm">
            <CardContent>
                {/* Logo */}
                <div className="flex justify-center mb-5">
                    <Logo width={60} height={60} />     {/* This is Main Project logo */}
                </div>

                {/* Page Title */}
                <div className="text-center mb-5">
                    <h1 className="text-3xl font-bold">
                        Forgot Password <span className="text-blue-600">LifeHub</span>
                    </h1>
                </div>

                {/* Login Form */}
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleForgotSubmit)}
                        className="space-y-6"
                    >
                        {/* Email Field */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="example@email.com"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Submit Button */}
                        <ButtonLoading
                            type="submit"
                            text="Send Email"
                            isLoading={isLoading}
                            className="w-full cursor-pointer"
                        />

                        {/* Footer Links */}
                        <div className="text-center">
                            <div>
                                <span>Back to </span>
                                <Link
                                    href={ROUTES.AUTH.LOGIN}
                                    className="text-blue-600 hover:underline"
                                >
                                    Login
                                </Link>
                            </div>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};

export default ForgotPasswordPage;
