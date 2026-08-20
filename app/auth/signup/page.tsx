"use client";

import { handleGoogleAuth } from "@/app/actions/google";
import GoogleButton from "@/components/app/home/googleButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { AtSign, Eye, EyeOff, Loader2, Lock, Mail, Sparkles, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

export default function SignUp() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);

    try {
      const result = await authClient.signUp.email({
        email: formData.email.trim().toLowerCase(),
        password: formData.password.trim(),
        name: formData.name.trim(),
        username: formData.username.trim(),
      });

      if (result.error) {
        toast({
          variant: "error",
          duration: 3000,
          title: "Sign Up Failed",
          description: result.error.message || "Failed to create account.",
        });
        return;
      }

      toast({
        variant: "success",
        title: "Account Created",
        description: "Your account has been created successfully!",
      });

      router.push("/home");
    } catch (error) {
      console.error(error);
      toast({
        variant: "error",
        title: "Error",
        description: "An unexpected error occurred during sign up.",
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="h-dvh flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/6 left-1/2 -translate-x-1/2 w-125 h-125 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      {/* Content Header */}
      <div className="w-full flex flex-col items-center justify-center mb-2">
        <div className="flex flex-col items-center gap-1.5 shrink-0">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-muted/50 hover:bg-muted/80 transition-colors rounded-full px-3 py-1 border font-bold bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent"
          >
            <Sparkles className="text-primary w-4 h-4" />
            CashCanopy
          </Link>
          <h1 className="text-2xl font-bold tracking-tight bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Create An Account!
          </h1>
        </div>
      </div>

      {/* Form Card */}
      <div className="rounded-md border bg-card backdrop-blur-xs flex shadow-md">
        <form
          onSubmit={handleSignUp}
          className="w-80 md:w-100 flex flex-col px-3 py-5 gap-3"
        >
          <div>
            <GoogleButton mode="signup" />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold">Full Name</Label>
            <div className="relative">
              <User className="w-6 h-6 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                id="name"
                name="name"
                type="text"
                required
                disabled={isPending}
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                className="h-11 indent-8 bg-transparent border-muted-foreground/20 rounded-lg text-base focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-all duration-200 focus:placeholder:text-transparent"
              />
            </div>
          </div>

          <div className="flex justify-between gap-2">
            <div className="space-y-2 flex-1">
              <Label className="text-sm font-semibold">Username</Label>
              <div className="relative">
                <AtSign className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                <Input
                  id="username"
                  name="username"
                  type="text"
                  required
                  disabled={isPending}
                  placeholder="user_name00"
                  value={formData.username}
                  onChange={handleChange}
                  className="h-11 indent-8 bg-transparent border-muted-foreground/20 rounded-lg text-base focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-all duration-200 focus:placeholder:text-transparent"
                />
              </div>
            </div>

            <div className="space-y-2 flex-1">
              <Label className="text-sm font-semibold">Email Address</Label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  disabled={isPending}
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="h-11 indent-8 bg-transparent border-muted-foreground/20 rounded-lg text-base focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-all duration-200 focus:placeholder:text-transparent"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold">Password</Label>
            <div className="relative">
              <Lock className="w-6 h-6 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                disabled={isPending}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="h-11 indent-8 bg-transparent border-muted-foreground/20 rounded-lg text-base focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-all duration-200 focus:placeholder:text-transparent"
              />

              <button
                type="button"
                aria-label="Toggle password visibility"
                disabled={isPending}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-md text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground pt-0.5">
              Must be at least 8 characters long
            </p>
          </div>

          <div className="h-8 flex items-center">
            <Link
              href="/auth/login"
              className="font-semibold text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Already have an account?
            </Link>
          </div>

          <div className="flex justify-center">
            <Button
              type="submit"
              disabled={isPending}
              className="w-4/5 h-11 text-base font-bold transition-colors duration-300 flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <span>Creating Account...</span>
                  <Loader2 className="w-4 h-4 animate-spin" />
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}