"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client"; // Adjust path to your auth client
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Lock, AtSign, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function SignUpCard() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setIsSubmitting(true);

    try {
      const result = await authClient.signUp.email({
        email: formData.email.trim().toLowerCase(),
        password: formData.password.trim(),
        name: formData.name.trim(),
        username: formData.username.trim(),
      });

      // Better Auth returns an error object rather than throwing
      if (result.error) {
        toast.error(result.error.message || "Failed to create account.");
        setIsSubmitting(false);
        return;
      }

      toast.success("Account created successfully!");
      router.push("/home");
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred during sign up.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 sm:p-8 bg-[#0a0f1d] border border-zinc-800/80 rounded-2xl shadow-2xl relative overflow-hidden space-y-6">
      {/* Background Ambient Glow */}
      <div className="absolute -top-16 -right-16 w-36 h-36 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="text-center space-y-1.5 relative z-10">
        <h1 className="text-2xl font-extrabold tracking-tight text-zinc-100">
          Create an Account
        </h1>
        <p className="text-xs text-zinc-400">
          Join CashCanopy to track expenses, budgets, and savings goals
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSignUp} className="space-y-4 relative z-10">
        {/* Full Name */}
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-xs font-semibold text-zinc-300">
            Full Name
          </Label>
          <div className="relative">
            <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <Input
              id="name"
              name="name"
              type="text"
              required
              disabled={isSubmitting}
              placeholder="Shawn Rimai"
              value={formData.name}
              onChange={handleChange}
              className="h-11 pl-10 bg-[#0e1626] border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-primary rounded-xl text-xs"
            />
          </div>
        </div>

        {/* Username */}
        <div className="space-y-1.5">
          <Label htmlFor="username" className="text-xs font-semibold text-zinc-300">
            Username
          </Label>
          <div className="relative">
            <AtSign className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <Input
              id="username"
              name="username"
              type="text"
              required
              disabled={isSubmitting}
              placeholder="shawnrimai"
              value={formData.username}
              onChange={handleChange}
              className="h-11 pl-10 bg-[#0e1626] border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-primary rounded-xl text-xs"
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs font-semibold text-zinc-300">
            Email Address
          </Label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <Input
              id="email"
              name="email"
              type="email"
              required
              disabled={isSubmitting}
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              className="h-11 pl-10 bg-[#0e1626] border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-primary rounded-xl text-xs"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-xs font-semibold text-zinc-300">
            Password
          </Label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <Input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              disabled={isSubmitting}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="h-11 pl-10 bg-[#0e1626] border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-primary rounded-xl text-xs"
            />
          </div>
          <p className="text-[10px] text-zinc-500 pt-0.5">
            Must be at least 8 characters long
          </p>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl text-xs transition-all shadow-md mt-2 flex items-center justify-center gap-2 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Creating Account...
            </>
          ) : (
            <>
              Sign Up <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </form>

      {/* Footer Link */}
      <div className="text-center border-t border-zinc-800/80 pt-4 relative z-10">
        <p className="text-xs text-zinc-400">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-primary font-semibold hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
