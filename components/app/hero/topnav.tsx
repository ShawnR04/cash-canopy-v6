'use client'

import Image from "next/image";
import Link from "next/link";

export default function TopNav(){
    return(
        <>
            <div className="h-full w-full bg-background flex items-center justify-between z-9999">
                <div className="flex items-center gap-2">
                    <Image
                        src="/favicon.ico"
                        alt="logo"
                        width={100}
                        height={100}
                        className="h-12 w-12 rounded-full"
                    />
                    <h1 className="font-bold text-2xl tracking-wide bg-clip-text text-transparent bg-linear-to-r from-primary to-primary/60">Cash Canopy</h1>
                </div>

                <div className="flex items-center gap-2 md:gap-4">
                    <Link
                        href="/auth/login"
                        className="border-2 border-border p-2 rounded-md hover:bg-border/60 transition-colors duration-300"
                    >
                        Login
                    </Link>

                    <Link
                        href="/auth/signup"
                        className="bg-primary border-border border-2 p-2 rounded-md hover:bg-primary/60 transition-colors duration-300"
                    >
                        Get Started
                    </Link>
                </div>
            </div>
        </>
    );
}