"use server";

import { z } from "zod";
import { FormState, LoginFormSchema, signUpFormSchema } from "./type";
import { redirect } from "next/navigation"
import { createSession } from "./session";
const BACKEND_URL = process.env.BACKEND_URL
export async function signUp(
    state: FormState,
    formData: FormData
): Promise<FormState> {

    const isValidationFields = signUpFormSchema.safeParse({
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        email: formData.get("email"),
        password: formData.get("password"),
    });

    if (!isValidationFields.success) {
        const treeError = z.treeifyError(isValidationFields.error);

        return {
            error: {
                firstName: treeError.properties?.firstName?.errors,
                lastName: treeError.properties?.lastName?.errors,
                email: treeError.properties?.email?.errors,
                password: treeError.properties?.password?.errors,
            },
        };
    }

    const response = await fetch(
        `${BACKEND_URL}/auth/sign-up`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(isValidationFields.data),
        }
    );
    console.log(response)
    console.log("STATUS:", response.status);
    console.log("OK:", response.ok);
    console.log("TEXT:", await response.text());
    if (response.ok) {
        redirect("/auth/sign-in");
    } else
        return {
            message:
                response.status === 409
                    ? "The user is already existed!"
                    : response.statusText,
        };
}


export async function signIn(state: FormState, formData: FormData): Promise<FormState> {
    const isValidationFields = LoginFormSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password")
    })
    if (!isValidationFields.success) {
        const treeError = z.treeifyError(isValidationFields.error);

        return {
            error: {

                email: treeError.properties?.email?.errors,
                password: treeError.properties?.password?.errors,
            },
        };
    }
    const response = await fetch(`${BACKEND_URL}/auth/sign-in`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(isValidationFields.data)
    })

    if (response.ok) {
        const result = await response.json();

        await createSession({
            user: {
                id: result.id,
                firstName: result.firstName,
                lastName: result.lastName
            }
        })
        redirect("/")
    }
    else {
        return {
            message: response.status === 401 ? "Invalid credentials" : response.statusText
        }
    }
}


