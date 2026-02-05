import { BACKEND_URL } from "@/lib/constants";
import { deleteSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    await deleteSession();
    const response = await fetch(`${BACKEND_URL}/auth/signout`)
    revalidatePath("/")
    return NextResponse.redirect(new URL("/", req.nextUrl))
}