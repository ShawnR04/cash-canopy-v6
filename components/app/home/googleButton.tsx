'use client'

import { handleGoogleAuth } from '@/app/actions/google';
import { authClient } from '@/lib/auth-client';
import { Loader2 } from 'lucide-react';
import { useState } from 'react'
import { FaGoogle } from 'react-icons/fa';
import { toast } from "sonner"

interface GoogleButtonProps{
    mode: "signup" | "login";
}
export default function GoogleButton({ mode }: GoogleButtonProps) {
    const [isPending, setIsPending] = useState(false);
    
    return (
      <>
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={isPending}
            className="w-full h-11 gap-2 rounded-md font-bold text-base flex items-center justify-center gap-2bg-transparent border-2 border-muted-foreground text-foreground hover:bg-muted-foreground/8 transition-colors duration-300"
          >
              
              {isPending ? (
                <Loader2 className="w-5 h-5 animate-spin"/>
              ) : (
                <FaGoogle className="w-6 h-6"/>
              )}
              {mode === "signup" ? "Sign up with Google" : "Login with Google"}
          </button>
      </>
    )
}
