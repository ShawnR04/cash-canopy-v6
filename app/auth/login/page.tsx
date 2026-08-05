"use client"

import { authClient } from "@/lib/auth-client";
import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import { handleGoogleAuth } from "@/app/actions/google";
import Link from 'next/link';
import { Eye, EyeOff, Loader2, Lock, Sparkles, User } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import GoogleButton from "@/components/app/home/googleButton";

export default function Login(){
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false)
    const [isPending, setIsPending] = useState(false)

    const router = useRouter();

    async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();

      const inputVal = identifier.trim();

      try {
        let result;

        if (inputVal.includes("@")) {
          result = await authClient.signIn.email({
            email: inputVal.toLowerCase(),
            password: password.trim(),
          });
        } else {
          result = await authClient.signIn.username({
            username: inputVal,
            password: password.trim(),
          });
        }

        // Better Auth returns an error object on failure instead of throwing
        if (result.error) {
          toast.error(result.error.message || "Sign in failed");
          return;
        }

        toast.success("Sign in successful");
        router.push("/home");
      } catch (error) {
        toast.error("An unexpected error occurred");
        console.error(error);
      }
    }
    return(
        <>
            {/*<div className="">
                <form onSubmit={handleLogin}>
                    <div className="">
                        <label htmlFor="">Identifier</label>
                        <input type="text" name="identifier" id="identifier" value={identifier} onChange={(e) => setIdentifier(e.target.value)} />
                    </div>
                    <div className="">
                        <label htmlFor="">Password</label>
                        <input type="text" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <button onClick={handleGoogleAuth}>google</button>
                    <button type="submit">Login</button>
                </form>
            </div>*/}

            <div className="h-dvh flex flex-col items-center justify-center relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-1/6 left-1/2 -translate-x-1/2 w-125 h-125 bg-primary/5 rounded-full blur-3xl pointer-events-none " />

                {/* Content */}
                <div className="w-full flex flex-col items-center justify-center mb-2">
                    <div className="flex flex-col items-center gap-1.5 shrink-0">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 bg-muted/50 hover:bg-muted/80 transition-colors rounded-full px-3 py-1 border font-bold bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent"
                        >
                            <Sparkles className="text-primary w-4 h-4"/>
                            CashCanopy
                        </Link>
                        <h1 className="text-2xl font-bold tracking-tight bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                            Welcome Back!
                        </h1>
                    </div>
                </div>

                {/* Form */}
                <div className="rounded-md border bg-card backdrop-blur-xs flex shadow-md">
                    <form 
                        onSubmit={handleLogin}
                        className=" w-80 md:w-100 flex flex-col px-3 py-5 gap-3"
                    >
                        <div>
                            <GoogleButton mode="login"/>
                        </div>
                        <div className="space-y-2">
                          {/* Identifier */}  
                          <Label className="text-sm font-semibold">Username/Email</Label>
                            <div className="relative">
                                <User className="w-6 h-6 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2"/>
                                <Input
                                    type="text" 
                                    name="identifier" 
                                    id="identifier" 
                                    value={identifier} 
                                    onChange={(e) => setIdentifier(e.target.value)} 
                                    className="h-11 indent-8 bg-transparent border-muted-foreground/20 rounded-lg text-base focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-all duration-200 focus:placeholder:text-transparent"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                          {/* Password */} 
                          <Label className="text-sm font-semibold">Password</Label>
                          <div className="relative">
                            <Lock className="w-6 h-6 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2"/>
                            <Input 
                                type={showPassword ? "text" : "password"}
                                name="password"     
                                id="password"  
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)}
                                className="h-11 indent-8 bg-transparent border-muted-foreground/20 rounded-lg text-base focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-all duration-200 focus:placeholder:text-transparent"
                            />

                            <button 
                                    type="button"
                                    aria-label="Toggle password visibility"
                                    disabled={isPending}
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-md text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
                                </button>
                          </div>
                        </div>

                        <div className="h-8 flex items-center">
                            <Link
                                href="./signup"
                                className="font-semibold text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                                Don&apos;t have an account?
                            </Link>
                        </div>

                        <div className="flex justify-center">
                                <Button
                                    type="submit"
                                    disabled={isPending}
                                    className="w-4/5 h-11 text-base font-bold transition-colors duration-300"
                                >
                                    {isPending ?(
                                        <>
                                            Logging In...
                                            <Loader2 className="w-4 h-4 animate-spin"/>
                                        </>
                                    ):(
                                        <>
                                            Login
                                        </>
                                    )}
                                </Button>
                            </div>
                    </form>
                </div>
            </div>
        </>
    );
}