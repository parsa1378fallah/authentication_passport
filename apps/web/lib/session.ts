"use server";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type Session = {
    user: {
        id: string,
        firstName: string,
        lastName: string
    };
    accessToken: string;
    refreshToken: string
}
const secretKey = process.env.SECRET_KEY;
const encodedKey = new TextEncoder().encode(secretKey)
export async function createSession(payload: Session) {
    const expiredAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const session = await new SignJWT(payload).setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(encodedKey)


        ; (await cookies()).set("session", session, {
            httpOnly: true,
            secure: true,
            expires: expiredAt,
            sameSite: "lax",
            path: '/'

        })
}

export async function getSession() {
    const cookie = (await cookies()).get("session")?.value;
    if (!cookie) return null;

    try {
        const { payload } = await jwtVerify(cookie, encodedKey, {
            algorithms: ["HS256"]
        })

        return payload as Session

    } catch (err) {
        console.error("Failed to verify the session", err)
        redirect("/auth/sign-in")
    }
}

export async function deleteSession() {
    (await cookies()).delete("session")
}


export async function updateToken({ accessToken, refreshToken }: { accessToken: string, refreshToken: string }) {
    const cookie = (await cookies()).get("session")?.value;
    if (!cookie) return null;
    const { payload } = await jwtVerify<Session>(cookie, encodedKey)
    if (!payload) throw new Error("session not found");
    const newPayload: Session = {
        user: {
            ...payload.user
        },
        accessToken,
        refreshToken
    }
    await createSession(newPayload)

}