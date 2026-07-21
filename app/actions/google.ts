import { authClient } from "@/lib/auth-client";

export const handleGoogleAuth = async () => {
    await authClient.signIn.social({
        provider: "google",
        callbackURL: "/home"
    });
};