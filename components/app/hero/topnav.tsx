"use client"

import Link from "next/link";

export default function TopNav(){
    return(
        <div className="h-full flex items-center">
            <div className=""></div>
            <div className="">
                <Link 
                    href="/auth/login"
                    className=""
                >
                    Login
                </Link>
                <Link 
                    href="/auth/signup"
                    className=""
                >
                    Get Started
                </Link>
            </div>
        </div>
    );
}