"use client";

import React, { useEffect, useState } from "react";
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
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";

// Routes
import { ROUTES } from "@/routes/routes.constants";

// Zod Schema
import { loginSchema } from "@/lib/zodSchema";

// API Hooks
import { useLoginUserMutation } from "@/services/api/authApi";
import { tokenService } from "@/services/auth/token.service";

// Snackbar Context
import { useSnackbar } from "@/context/SnackbarContext";

const LoginPage = () => {
    const router = useRouter();
    const { showSnackbar } = useSnackbar();

    const [isPasswordVisible, setIsPasswordVisible] = useState(true);
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
            router.push(ROUTES.AUTH.DASHBOARD);
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
                        Login Into <span className="text-blue-600">LifeHub</span>
                    </h1>
                </div>

                {/* Login Form */}
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleLoginSubmit)}
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

                        {/* Password Field */}
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem className="relative">
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type={isPasswordVisible ? "password" : "text"}
                                            placeholder="*********"
                                            {...field}
                                        />
                                    </FormControl>

                                    {/* Show/Hide Icon */}
                                    <button
                                        type="button"
                                        className="absolute right-3 top-[32px] text-gray-400"
                                        onClick={() =>
                                            setIsPasswordVisible(!isPasswordVisible)
                                        }
                                    >
                                        {isPasswordVisible ? (
                                            <FaRegEyeSlash />
                                        ) : (
                                            <FaRegEye />
                                        )}
                                    </button>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Submit Button */}
                        <ButtonLoading
                            type="submit"
                            text="Login"
                            isLoading={isLoading}
                            className="w-full cursor-pointer"
                        />

                        {/* Footer Links */}
                        <div className="text-center">
                            <div>
                                <span>Don't have an account? </span>
                                <Link
                                    href={ROUTES.AUTH.REGISTER}
                                    className="text-blue-600 hover:underline"
                                >
                                    Register
                                </Link>
                            </div>
                            <div>
                                <Link
                                    href={ROUTES.AUTH.FORGOT_PASSWORD}
                                    className="text-blue-600 hover:underline"
                                >
                                    Forgot Password?
                                </Link>
                            </div>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};

export default LoginPage;
