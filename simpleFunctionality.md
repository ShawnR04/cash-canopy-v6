## SIGNUP

```tsx
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
```

## LOGIN
```tsx
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

```

## GOALS CLIENT
```tsx
"use client";

import { createGoal } from "@/app/actions/goals";
import React, { useState } from "react";

export default function Goals() {
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [status, setStatus] = useState<"active" | "achieved" | "paused">("active");
  const [targetDate, setTargetDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createGoal({
        name,
        targetAmount,
        currentAmount: currentAmount || "0",
        currency,
        status,
        targetDate: targetDate ? new Date(targetDate) : new Date(),
        userId: "", // Satisfies TypeScript; server overwrites with session user ID
      });

      // Reset form on success
      setName("");
      setTargetAmount("");
      setCurrentAmount("");
      setTargetDate("");
      alert("Goal created successfully!");
    } catch (err) {
      console.error(err);
      alert("Error creating goal. Make sure you are logged in!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium">Goal Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Target Amount</label>
          <input
            type="number"
            step="0.01"
            required
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Current Amount</label>
          <input
            type="number"
            step="0.01"
            value={currentAmount}
            onChange={(e) => setCurrentAmount(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Currency</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Status</label>
          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as "active" | "achieved" | "paused")
            }
            className="w-full border p-2 rounded"
          >
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="achieved">Achieved</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Target Date</label>
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Create Goal"}
        </button>
      </form>
    </div>
  );
}
```

## GOALS SERVER ACTION
```tsx
"use server";

import { db } from "@/db";
import { goalsTable, insertGoal } from "@/db/schema";
import { getAuthenticatedUser } from "./getAuthenticatedUser";

export async function createGoal(data: insertGoal) {
  try {
    // 1. Get the authenticated user ID on the server
    const userId = await getAuthenticatedUser();

    // 2. Insert into database using an explicit object
    await db.insert(goalsTable).values({
      name: data.name,
      targetAmount: data.targetAmount,
      currentAmount: data.currentAmount,
      currency: data.currency,
      status: data.status,
      targetDate: data.targetDate,
      userId: userId, // Uses the real server-authenticated user ID
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to create goal:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to save goal.");
  }
}
```