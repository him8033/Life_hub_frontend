import { z } from "zod";

// Login Schema
export const loginSchema = z.object({
    email: z
        .string()
        .min(1, "Email is required")
        .email("Invalid email address"),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters"),
});

// Register Schema
export const registerSchema = z
    .object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z
            .string()
            .min(1, "Email is required")
            .email("Invalid email address"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        password2: z.string().min(6, "Confirm Password must be at least 6 characters"),
        tc: z.boolean().refine(val => val === true, {
            message: "You must accept the Terms & Conditions",
        }),
    })
    .refine((data) => data.password === data.password2, {
        message: "Passwords do not match",
        path: ["password2"], // error under confirm password
    });

// Change Password Schema
export const changePasswordSchema = z
    .object({
        password: z.string()
            .min(8, "Password must be at least 8 characters")
            .regex(/[a-z]/, "Password must contain at least one lowercase letter")
            .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
            .regex(/[0-9]/, "Password must contain at least one number"),
        password2: z.string()
    }).refine((data) => data.password === data.password2, {
        message: "Passwords do not match",
        path: ["password2"]
    });

// Reset Password Request Schema (send email)
export const resetPasswordRequestSchema = z.object({
    email: z
        .string()
        .min(1, "Email is required")
        .email("Invalid email address"),
});

// Reset Password Schema (set new password)
export const resetPasswordSchema = z
    .object({
        password: z.string().min(6, "Password must be at least 6 characters"),
        password2: z.string().min(6, "Confirm Password must be at least 6 characters"),
    })
    .refine((data) => data.password === data.password2, {
        message: "Passwords do not match",
        path: ["password2"],
    });
