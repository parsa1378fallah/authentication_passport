import { z } from "zod"
export type FormState = {
    error?: {
        firstName?: string[];
        lastName?: string[];
        email?: string[];
        password?: string[]
    };
    message?: string;
} | undefined




export const signUpFormSchema = z.object({
    firstName: z
        .string()
        .trim()
        .min(1, "first name is required")
        .min(2, "first name must be at least 2 characters")
        .max(100, "first name must be at most 50 characters"),
    lastName: z
        .string()
        .trim()
        .min(1, "last name is required")
        .min(2, "last name must be at least 2 characters")
        .max(100, "last name must be at most 50 characters"),


    email: z
        .string()
        .trim()
        .toLowerCase()
        .min(1, "Email is required")
        .pipe(z.email("Please enter a valid email address")),

    password: z
        .string()
        .min(1, "Password is required")
        .min(8, "Password must be at least 8 characters")
        .max(100, "Password is too long")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number"),
});



export const LoginFormSchema = z.object({
    email: z
        .string()
        .trim()
        .toLowerCase()
        .min(1, "Email is required")
        .pipe(z.email("Please enter a valid email address")),

    password: z
        .string()
        .min(1, "Password is required")
        .min(8, "Password must be at least 8 characters")
        .max(100, "Password is too long")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number"),
})

