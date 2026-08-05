"use client"

import { handleGoogleAuth } from "@/app/actions/google";
import { authClient } from "@/lib/auth-client";
import { Link, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function SignUp(){
    return(
        <>
            <div className="h-dvh flex flex-col items-center justify-center relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-1/6 left-1/2 -translate-x-1/2 w-125 h-125 bg-primary/5 rounded-full blur-3xl pointer-events-none " />

                {/* Content */}
                <div className="">
                    <div className="flex flex-col items-center gap-1.5 shrink-0">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 bg-muted/50 hover:bg-muted/80 transition-colors rounded-full px-3 py-1 border font-bold bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent"
                        >
                            <Sparkles className="text-primary w-4 h-4"/>
                            CashCanopy
                        </Link>
                        <h1 className="text-2xl font-bold tracking-tight bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                            Create An Account!
                        </h1>
                    </div>
                </div>
            </div>
        </>
    );
}