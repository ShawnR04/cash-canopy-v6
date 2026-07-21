import { auth } from "@/lib/auth"; 
import { headers } from "next/headers";

export async function getAuthenticatedUser(){
    // 1. Getting current user session from the server
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    // 2. Auth Guard
    if (!session || !session.user) {
        throw new Error("Unauthorized: You must be logged in.");
    }
    return session.user.id;
}