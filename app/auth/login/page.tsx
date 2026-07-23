"use client"

import { authClient } from "@/lib/auth-client";
import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import { handleGoogleAuth } from "@/app/actions/google";

export default function Login(){
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");

    const router = useRouter();

    async function handleLogin(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();

        const inputVal = identifier.trim();

        try{
            let result;

            if(inputVal.includes("@")){
                result = await authClient.signIn.email({
                    email: inputVal.toLowerCase(),
                    password: password.trim(),
                })
            } else{
                result = await authClient.signIn.username({
                    username: inputVal,
                    password: password.trim(),
                })
            }

            toast.success("Sign in successful")

            router.push("/home")
        }catch(error){
            toast.error("Sign in failed")
            console.log(error)
        }
    }
    return(
        <>
            <div className="">
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
            </div>
        </>
    );
}