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

// Icons & Assets
import Logo from "@/components/Application/Logo";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";

// Schema
import { resetPasswordSchema } from "@/lib/zodSchema";

// Routes
import { ROUTES } from "@/routes/routes.constants";

// API
import { useResetPasswordMutation } from "@/services/api/authApi";

// Snackbar
import { useSnackbar } from "@/context/SnackbarContext";

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
        <Card className="w-full max-w-sm">
            <CardContent>
                {/* Logo */}
                <div className="flex justify-center mb-5">
                    <Logo width={60} height={60} />     {/* This is Main Project logo */}
                </div>

                {/* Page Title */}
                <div className="text-center mb-5">
                    <h1 className="text-3xl font-bold">
                        Reset Password Into <span className="text-blue-600">LifeHub</span>
                    </h1>
                </div>

                {/* Form */}
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleResetPasswordSubmit)}
                        className="space-y-6"
                    >
                        {/* Password */}
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="*********"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Confirm Password */}
                        <FormField
                            control={form.control}
                            name="password2"
                            render={({ field }) => (
                                <FormItem className="relative">
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type={isPasswordVisible ? "text" : "password"}
                                            placeholder="*********"
                                            {...field}
                                        />
                                    </FormControl>

                                    {/* Toggle Password Visibility */}
                                    <button
                                        type="button"
                                        className="absolute right-3 top-[32px] text-gray-400"
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

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Submit Button */}
                        <ButtonLoading
                            type="submit"
                            text="Change Password"
                            isLoading={isLoading}
                            className="w-full cursor-pointer"
                        />
                    </form>
                </Form>

                <div className="text-center">
                    <span>Back to </span>
                    <Link
                        href={ROUTES.AUTH.LOGIN}
                        className="text-blue-600 hover:underline"
                    >
                        Login
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
};

export default ResetPassword;
