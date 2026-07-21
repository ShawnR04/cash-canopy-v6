"use client"

import { handleGoogleAuth } from "@/app/actions/google";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function SignUp(){
    const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const router = useRouter();

  async function handleSignup(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault();


        try{
            const { data, error } = await authClient.signUp.email({
                name: username.trim(),
                email: email.trim().toLowerCase(),
                password: password,
                username: username.trim(),
                //callbackURL: "/auth/login"
            });

            if(error){
                toast.error(error.message ?? "Sign up failed")
                
                return;
            }
            
            toast.success("User created successfully")
            console.log("User created successfully",data)
            
            setTimeout(() => {
                router.push("/auth/login");
            }, 1200);
        }catch(error){
            console.log(error);
            toast.error("Sign up failed");
        }
  }
    return(
        <>
            <form onSubmit={handleSignup}>
                <div className="">
                    <label htmlFor="">Username</label>
                    <input type="text" name="username" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className="">
                    <label htmlFor="">Email</label>
                    <input type="text" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="">
                    <label htmlFor="">Password</label>
                    <input type="text" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="">
                    <button onClick={handleGoogleAuth}>Google</button>
                </div>
                <div className="">
                    <button type="submit" className="bg-green-400">Create</button>
                </div>
            </form>
        </>
    );
}