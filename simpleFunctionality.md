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

## GOALS FORM
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

## CATEGORIES FORM
```tsx
"use client";

import React, { useState } from "react";
import * as LucideIcons from "lucide-react";
import { createCategory } from "@/app/actions/categories";

// Pre-defined list of common icons
const FEATURED_ICONS = [
  "Folder",
  "ShoppingBag",
  "ShoppingCart",
  "CreditCard",
  "DollarSign",
  "Utensils",
  "Home",
  "Car",
  "HeartPulse",
  "Plane",
  "Briefcase",
  "Gift",
  "Film",
  "Smile",
] as const;

// Preset category color palette
const PRESET_COLORS = [
  "#3b82f6", // Blue
  "#10b981", // Emerald
  "#8b5cf6", // Purple
  "#f59e0b", // Amber
  "#ef4444", // Red
  "#ec4899", // Pink
  "#06b6d4", // Cyan
  "#84cc16", // Lime
  "#6366f1", // Indigo
  "#f97316", // Orange
  "#14b8a6", // Teal
  "#64748b", // Slate
];

// Dynamic Renderer with Fallback Icon
function DynamicIcon({
  name,
  className = "w-5 h-5",
}: {
  name: string;
  className?: string;
}) {
  const formattedName = name
    .trim()
    .replace(/(^\w|-\w)/g, (match) => match.replace("-", "").toUpperCase());

  const IconComponent = (LucideIcons as Record<string, any>)[formattedName];

  if (!IconComponent) {
    return <LucideIcons.HelpCircle className={`${className} opacity-50`} />;
  }

  return <IconComponent className={className} />;
}

export default function CategoryForm() {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("Folder");
  const [color, setColor] = useState("#3b82f6");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await createCategory({
        name,
        icon,
        color,
      } as any);

      if (!res.success) {
        alert(res.error);
        return;
      }

      // Reset form
      setName("");
      setIcon("Folder");
      setColor("#3b82f6");
      alert("Category created successfully!");
    } catch (err) {
      console.error(err);
      alert("Error creating category");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white border border-zinc-200/80 rounded-2xl shadow-sm">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        
        {/* --- LIVE PREVIEW CARD --- */}
        <div className="flex items-center gap-4 p-4 rounded-xl border border-zinc-100 bg-gradient-to-r from-zinc-50 to-zinc-100/60 shadow-inner">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md transition-all duration-300 scale-100"
            style={{ backgroundColor: color }}
          >
            <DynamicIcon name={icon} className="w-6 h-6 drop-shadow-sm" />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              Category Preview
            </span>
            <span className="font-semibold text-zinc-900 text-lg leading-snug">
              {name || "Category Name"}
            </span>
          </div>
        </div>

        {/* --- CATEGORY NAME --- */}
        <div>
          <label className="block text-xs font-semibold uppercase text-zinc-500 mb-1.5 tracking-wider">
            Category Name
          </label>
          <input
            type="text"
            required
            placeholder="e.g., Groceries, Rent, Salary"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-zinc-50/50 border border-zinc-200 text-zinc-900 text-sm p-3 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all placeholder:text-zinc-400"
          />
        </div>

        {/* --- ICON SELECTION & CUSTOM INPUT --- */}
        <div>
          <label className="block text-xs font-semibold uppercase text-zinc-500 mb-1.5 tracking-wider">
            Category Icon
          </label>
          
          <div className="relative mb-2.5">
            <input
              type="text"
              placeholder="Search or type icon (e.g. Coffee, Zap, PiggyBank)"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="w-full bg-zinc-50/50 border border-zinc-200 text-zinc-900 text-sm p-3 pl-10 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all placeholder:text-zinc-400"
            />
            <div className="absolute left-3 top-3.5 text-zinc-400">
              <DynamicIcon name={icon} className="w-4 h-4" />
            </div>
          </div>

          <p className="text-[11px] text-zinc-400 mb-1.5">Or choose a quick suggestion:</p>
          <div className="grid grid-cols-7 gap-1.5 p-2 bg-zinc-50/60 border border-zinc-200/70 rounded-xl max-h-32 overflow-y-auto">
            {FEATURED_ICONS.map((iconName) => {
              const isSelected = icon.toLowerCase() === iconName.toLowerCase();
              return (
                <button
                  key={iconName}
                  type="button"
                  onClick={() => setIcon(iconName)}
                  className={`p-2 rounded-lg flex items-center justify-center transition-all ${
                    isSelected
                      ? "bg-zinc-900 text-white shadow-sm"
                      : "hover:bg-zinc-200/60 text-zinc-600"
                  }`}
                  title={iconName}
                >
                  <DynamicIcon name={iconName} className="w-4 h-4" />
                </button>
              );
            })}
          </div>
        </div>

        {/* --- COLOR SELECTION --- */}
        <div>
          <label className="block text-xs font-semibold uppercase text-zinc-500 mb-1.5 tracking-wider">
            Color Palette
          </label>

          {/* Swatches */}
          <div className="grid grid-cols-6 gap-2 mb-3">
            {PRESET_COLORS.map((presetColor) => {
              const isSelected = color.toLowerCase() === presetColor.toLowerCase();
              return (
                <button
                  key={presetColor}
                  type="button"
                  onClick={() => setColor(presetColor)}
                  className={`h-9 rounded-xl transition-all flex items-center justify-center ${
                    isSelected
                      ? "ring-2 ring-offset-2 ring-zinc-900 scale-105 shadow-sm"
                      : "hover:scale-105 opacity-90 hover:opacity-100"
                  }`}
                  style={{ backgroundColor: presetColor }}
                  title={presetColor}
                >
                  {isSelected && (
                    <LucideIcons.Check className="w-4 h-4 text-white drop-shadow" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Hex Input */}
          <div className="flex gap-2.5 items-center">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-11 h-11 border-0 p-0 rounded-xl cursor-pointer overflow-hidden shadow-sm bg-transparent"
            />
            <input
              type="text"
              value={color}
              placeholder="#000000"
              onChange={(e) => setColor(e.target.value)}
              className="w-full bg-zinc-50/50 border border-zinc-200 text-zinc-900 text-sm p-2.5 rounded-xl font-mono uppercase focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* --- SUBMIT BUTTON --- */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-zinc-900 text-white p-3 rounded-xl hover:bg-zinc-800 active:scale-[0.99] disabled:opacity-50 font-medium text-sm transition-all shadow-sm flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <LucideIcons.Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <span>Create Category</span>
          )}
        </button>
      </form>
    </div>
  );
}
```

## CATEGORIES SERVERT ACTION
```tsx
"use server";

import { db } from "@/db";
import { categoriesTable, InsertCategory } from "@/db/schema";
import { getAuthenticatedUser } from "./getAuthenticatedUser";

export async function createCategory(data: InsertCategory) {
  try {
    const userId = await getAuthenticatedUser();

    await db.insert(categoriesTable).values({
      name: data.name,
      icon: data.icon,
      color: data.color,
      userId: userId,
    });

    return { success: true, error: null };
  } catch (error) {
    console.error("Failed to create category:", error);
    
    // Return a structured object instead of throwing so the client gets the exact message
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to save category." 
    };
  }
}
```

## BUDGETS FORM
```tsx
"use client";

import React, { useState } from "react";
import * as LucideIcons from "lucide-react";
import { createBudget } from "@/app/actions/budgets";

interface CategoryOption {
  id: number;
  name: string;
  icon: string;
  color: string;
}

// --- NEW HELPER: Dynamically renders the Lucide icon from a string ---
function DynamicIcon({ name, className }: { name?: string; className?: string }) {
  if (!name) return <LucideIcons.Wallet className={className} />; // Fallback for "Overall" budget

  // Format string to PascalCase just in case (e.g. "shopping-cart" -> "ShoppingCart")
  const formattedName = name
    .trim()
    .replace(/(^\w|-\w)/g, (match) => match.replace("-", "").toUpperCase());

  // Look up the icon in the Lucide library
  const IconComponent = (LucideIcons as Record<string, any>)[formattedName];

  // If the icon isn't found, default to Wallet
  if (!IconComponent) return <LucideIcons.Wallet className={className} />;

  return <IconComponent className={className} />;
}

// Added default parameter `= []` and optional `?` operator to avoid `undefined.find()` errors
export default function BudgetForm({ categories = [] }: { categories?: CategoryOption[] }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [period, setPeriod] = useState<"Monthly" | "Weekly" | "Yearly" | "Custom">("Monthly");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await createBudget({
        name,
        amount,
        currency,
        period,
        startDate: startDate ? new Date(`${startDate}T00:00:00`).toISOString() : new Date().toISOString(),
        endDate: endDate ? new Date(`${endDate}T00:00:00`).toISOString() : null,
        categoryId: categoryId ? Number(categoryId) : null,
      } as any);

      if (!res.success) {
        alert(res.error);
        return;
      }

      // Reset form
      setName("");
      setAmount("");
      setStartDate("");
      setEndDate("");
      setCategoryId("");
      alert("Budget created successfully!");
    } catch (err) {
      console.error(err);
      alert("Error creating budget.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Safe navigation with optional chaining (`categories?.find`)
  const selectedCategory = categories?.find((c) => c.id === Number(categoryId));

  return (
    <div className="max-w-md mx-auto p-6 bg-white border border-zinc-200/80 rounded-2xl shadow-sm">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        
        {/* --- LIVE PREVIEW CARD --- */}
        <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-100 bg-gradient-to-r from-zinc-50 to-zinc-100/60 shadow-inner">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm transition-all"
              style={{ backgroundColor: selectedCategory?.color || "#18181b" }}
            >
              {/* --- UPDATED: Using DynamicIcon here --- */}
              <DynamicIcon name={selectedCategory?.icon} className="w-5 h-5 drop-shadow-sm" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                {period} Budget
              </span>
              <span className="font-semibold text-zinc-900 text-base">
                {name || "Budget Name"}
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-lg font-bold text-zinc-900">
              {currency === "USD" ? "$" : currency} {amount || "0.00"}
            </span>
          </div>
        </div>

        {/* --- BUDGET NAME --- */}
        <div>
          <label className="block text-xs font-semibold uppercase text-zinc-500 mb-1.5 tracking-wider">
            Budget Name
          </label>
          <input
            type="text"
            required
            placeholder="e.g., Monthly Groceries, Vacation Spending"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-zinc-50/50 border border-zinc-200 text-zinc-900 text-sm p-3 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
          />
        </div>

        {/* --- AMOUNT & CURRENCY --- */}
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <label className="block text-xs font-semibold uppercase text-zinc-500 mb-1.5 tracking-wider">
              Amount
            </label>
            <input
              type="number"
              step="0.01"
              required
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-zinc-50/50 border border-zinc-200 text-zinc-900 text-sm p-3 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-zinc-500 mb-1.5 tracking-wider">
              Currency
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full bg-zinc-50/50 border border-zinc-200 text-zinc-900 text-sm p-3 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
            >
              <option value="USD">USD</option>
              <option value="CAD">CAD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </div>
        </div>

        {/* --- CATEGORY SELECTOR --- */}
        <div>
          <label className="block text-xs font-semibold uppercase text-zinc-500 mb-1.5 tracking-wider">
            Category (Optional)
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : "")}
            className="w-full bg-zinc-50/50 border border-zinc-200 text-zinc-900 text-sm p-3 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
          >
            <option value="">Overall (All Categories)</option>
            {categories?.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* --- PERIOD SWITCHER --- */}
        <div>
          <label className="block text-xs font-semibold uppercase text-zinc-500 mb-1.5 tracking-wider">
            Period
          </label>
          <div className="grid grid-cols-4 gap-1.5 p-1 bg-zinc-50 border border-zinc-200 rounded-xl">
            {(["Monthly", "Weekly", "Yearly", "Custom"] as const).map((p) => {
              const isSelected = period === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPeriod(p)}
                  className={`p-2 rounded-lg text-xs font-medium transition-all ${
                    isSelected
                      ? "bg-zinc-900 text-white shadow-sm"
                      : "text-zinc-600 hover:bg-zinc-200/50"
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>

        {/* --- DATES --- */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase text-zinc-500 mb-1.5 tracking-wider">
              Start Date
            </label>
            <input
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-zinc-50/50 border border-zinc-200 text-zinc-900 text-sm p-2.5 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-zinc-500 mb-1.5 tracking-wider">
              End Date (Optional)
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-zinc-50/50 border border-zinc-200 text-zinc-900 text-sm p-2.5 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* --- SUBMIT BUTTON --- */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-zinc-900 text-white p-3 rounded-xl hover:bg-zinc-800 active:scale-[0.99] disabled:opacity-50 font-medium text-sm transition-all shadow-sm flex items-center justify-center gap-2 mt-2"
        >
          {isSubmitting ? (
            <>
              <LucideIcons.Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <span>Create Budget</span>
          )}
        </button>
      </form>
    </div>
  );
}
```

## BUDGETS PAGE
```tsx
import { getCategories } from "@/app/actions/categories";
import BudgetForm from "./budgetsClient";

export default async function BudgetsPage() {
  // Fetch user categories directly on the server
  const categories = await getCategories();

  return (
    <div className="p-6">
      <BudgetForm categories={categories} />
    </div>
  );
}
```

## BUDGETS SERVER ACTION
```tsx
"use server";

import { db } from "@/db";
import { budgetsTable, InsertBudget } from "@/db/schema";
import { getAuthenticatedUser } from "./getAuthenticatedUser";

// Accept dates as strings from the client form
type CreateBudgetInput = Omit<
  InsertBudget,
  "id" | "userId" | "createdAt" | "updatedAt" | "startDate" | "endDate"
> & {
  startDate: string;
  endDate?: string | null;
};

export async function createBudget(data: CreateBudgetInput) {
  try {
    const userId = await getAuthenticatedUser();

    // Spread input data and cast directly to satisfy Drizzle's single-row insert type
    await db.insert(budgetsTable).values({
      ...data,
      userId,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : null,
      categoryId: data.categoryId ?? null,
    } as InsertBudget);

    return { success: true, error: null };
  } catch (error) {
    console.error("Failed to create budget:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save budget.",
    };
  }
}
```

## TRANSACTION FORM
```tsx
"use client";

import React, { useState } from "react";
import * as LucideIcons from "lucide-react";
import { createTransaction } from "@/app/actions/transactions";

interface OptionItem {
  id: number;
  name: string;
  icon?: string;
  color?: string;
}

interface TransactionFormProps {
  categories?: OptionItem[];
  budgets?: OptionItem[];
  goals?: OptionItem[];
}

function DynamicIcon({ name, className }: { name?: string; className?: string }) {
  if (!name) return <LucideIcons.Receipt className={className} />;

  const formattedName = name
    .trim()
    .replace(/(^\w|-\w)/g, (match) => match.replace("-", "").toUpperCase());

  const IconComponent = (LucideIcons as Record<string, any>)[formattedName];

  if (!IconComponent) return <LucideIcons.Receipt className={className} />;

  return <IconComponent className={className} />;
}

export default function TransactionForm({
  categories = [],
  budgets = [],
  goals = [],
}: TransactionFormProps) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [type, setType] = useState<"Expense" | "Income">("Expense");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const [categoryId, setCategoryId] = useState<number | "">("");
  const [budgetId, setBudgetId] = useState<number | "">("");
  const [goalId, setGoalId] = useState<number | "">("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create local ISO timestamp without UTC shifting issues
      const selectedDate = date 
        ? new Date(`${date}T12:00:00.000Z`).toISOString() 
        : new Date().toISOString();

      const res = await createTransaction({
        description,
        amount,
        currency,
        type,
        date: selectedDate,
        categoryId: categoryId ? Number(categoryId) : null,
        budgetId: budgetId ? Number(budgetId) : null,
        goalId: goalId ? Number(goalId) : null,
      } as any);

      if (!res.success) {
        alert(res.error);
        return;
      }

      // Reset form on success
      setDescription("");
      setAmount("");
      setCategoryId("");
      setBudgetId("");
      setGoalId("");
      alert("Transaction saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Error creating transaction.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCategory = categories?.find((c) => c.id === Number(categoryId));

  return (
    <div className="max-w-md mx-auto p-6 bg-white border border-zinc-200/80 rounded-2xl shadow-sm">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        
        {/* --- LIVE PREVIEW CARD --- */}
        <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-100 bg-gradient-to-r from-zinc-50 to-zinc-100/60 shadow-inner">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm transition-all"
              style={{
                backgroundColor: selectedCategory?.color || (type === "Income" ? "#10b981" : "#ef4444"),
              }}
            >
              <DynamicIcon name={selectedCategory?.icon} className="w-5 h-5 drop-shadow-sm" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                {type} Transaction
              </span>
              <span className="font-semibold text-zinc-900 text-base">
                {description || "Description"}
              </span>
            </div>
          </div>
          <div className="text-right">
            <span
              className={`text-lg font-bold ${
                type === "Income" ? "text-emerald-600" : "text-zinc-900"
              }`}
            >
              {type === "Income" ? "+" : "-"}
              {currency === "USD" ? "$" : currency} {amount || "0.00"}
            </span>
          </div>
        </div>

        {/* --- TYPE TOGGLE (Income / Expense) --- */}
        <div>
          <label className="block text-xs font-semibold uppercase text-zinc-500 mb-1.5 tracking-wider">
            Transaction Type
          </label>
          <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-50 border border-zinc-200 rounded-xl">
            {(["Expense", "Income"] as const).map((t) => {
              const isSelected = type === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`p-2.5 rounded-lg text-xs font-semibold transition-all ${
                    isSelected
                      ? t === "Income"
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "bg-zinc-900 text-white shadow-sm"
                      : "text-zinc-600 hover:bg-zinc-200/50"
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>

        {/* --- DESCRIPTION --- */}
        <div>
          <label className="block text-xs font-semibold uppercase text-zinc-500 mb-1.5 tracking-wider">
            Description
          </label>
          <input
            type="text"
            required
            placeholder="e.g., Apple Store, Grocery Shopping, Salary"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-zinc-50/50 border border-zinc-200 text-zinc-900 text-sm p-3 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
          />
        </div>

        {/* --- AMOUNT & CURRENCY --- */}
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <label className="block text-xs font-semibold uppercase text-zinc-500 mb-1.5 tracking-wider">
              Amount
            </label>
            <input
              type="number"
              step="0.01"
              required
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-zinc-50/50 border border-zinc-200 text-zinc-900 text-sm p-3 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-zinc-500 mb-1.5 tracking-wider">
              Currency
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full bg-zinc-50/50 border border-zinc-200 text-zinc-900 text-sm p-3 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
            >
              <option value="USD">USD</option>
              <option value="CAD">CAD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </div>
        </div>

        {/* --- DATE --- */}
        <div>
          <label className="block text-xs font-semibold uppercase text-zinc-500 mb-1.5 tracking-wider">
            Transaction Date
          </label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-zinc-50/50 border border-zinc-200 text-zinc-900 text-sm p-2.5 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
          />
        </div>

        {/* --- SELECTORS (REMOVED MUTUAL EXCLUSIVITY) --- */}
        <div className="flex flex-col gap-3 pt-2 border-t border-zinc-100">
          <p className="text-[11px] font-medium text-zinc-400">
            Link to category, budget, or goal (optional):
          </p>

          {/* CATEGORY SELECTOR */}
          <div>
            <label className="block text-xs font-semibold uppercase text-zinc-500 mb-1.5 tracking-wider">
              Category
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : "")}
              className="w-full bg-zinc-50/50 border border-zinc-200 text-zinc-900 text-sm p-3 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
            >
              <option value="">Uncategorized</option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* BUDGET SELECTOR */}
            <div>
              <label className="block text-xs font-semibold uppercase text-zinc-500 mb-1.5 tracking-wider">
                Budget
              </label>
              <select
                value={budgetId}
                onChange={(e) => setBudgetId(e.target.value ? Number(e.target.value) : "")}
                className="w-full bg-zinc-50/50 border border-zinc-200 text-zinc-900 text-sm p-2.5 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all text-xs"
              >
                <option value="">None</option>
                {budgets?.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* GOAL SELECTOR */}
            <div>
              <label className="block text-xs font-semibold uppercase text-zinc-500 mb-1.5 tracking-wider">
                Goal
              </label>
              <select
                value={goalId}
                onChange={(e) => setGoalId(e.target.value ? Number(e.target.value) : "")}
                className="w-full bg-zinc-50/50 border border-zinc-200 text-zinc-900 text-sm p-2.5 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all text-xs"
              >
                <option value="">None</option>
                {goals?.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* --- SUBMIT BUTTON --- */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-zinc-900 text-white p-3 rounded-xl hover:bg-zinc-800 active:scale-[0.99] disabled:opacity-50 font-medium text-sm transition-all shadow-sm flex items-center justify-center gap-2 mt-2"
        >
          {isSubmitting ? (
            <>
              <LucideIcons.Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <span>Add Transaction</span>
          )}
        </button>
      </form>
    </div>
  );
}
```

## TRANSACTION PAGE
```tsx
import { getCategories } from "@/app/actions/categories";
import TransactionForm from "./transactionsClient";
import { getBudgets } from "@/app/actions/budgets";
import { getGoals } from "@/app/actions/goals";

export default async function TransactionsPage() {
  // Fetch all dropdown options on the server concurrently
  const [categories, budgets, goals] = await Promise.all([
    getCategories(),
    getBudgets(),
    getGoals(),
  ]);

  return (
    <div className="p-6">
      <TransactionForm
        categories={categories}
        budgets={budgets}
        goals={goals}
      />
    </div>
  );
}
```

## TRANSACTION SERVER ACTION
```tsx
"use server";

import { db } from "@/db";
import { transactionsTable } from "@/db/schema";
import { getAuthenticatedUser } from "./getAuthenticatedUser"; // Adjust import path if needed
import { InferInsertModel } from "drizzle-orm";

export type InsertTransaction = InferInsertModel<typeof transactionsTable>;

type CreateTransactionInput = Omit<
  InsertTransaction,
  "id" | "userId" | "createdAt" | "updatedAt" | "date"
> & {
  date: string;
};

export async function createTransaction(data: CreateTransactionInput) {
  try {
    const userId = await getAuthenticatedUser();

    await db.insert(transactionsTable).values({
      ...data,
      userId,
      date: new Date(data.date),
      currency: data.currency ?? "USD",
      categoryId: data.categoryId ?? null,
      budgetId: data.budgetId ?? null,
      goalId: data.goalId ?? null,
    } as InsertTransaction);

    return { success: true, error: null };
  } catch (error) {
    console.error("Failed to create transaction:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save transaction.",
    };
  }
}
```

## CARDS PAGE
```tsx
import React from "react";
import {
  TransactionCard,
  BudgetCard,
  GoalCard,
  CategoryCard,
} from "@/components/app";
import { getDashboardData } from "@/app/actions/dashboard";

export default async function DashboardPage() {
  const { categories, budgets, goals, transactions } = await getDashboardData();

  // Map categories by ID for O(1) lookup when attaching to transactions/budgets
  const categoryMap = new Map(categories.map((c: any) => [c.id, c]));

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Financial Overview</h1>
        <p className="text-sm text-zinc-500">
          Track your recent activity, active budgets, and savings progress.
        </p>
      </div>

      {/* --- RECENT TRANSACTIONS --- */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
          Recent Transactions
        </h2>
        {transactions.length === 0 ? (
          <div className="p-8 text-center bg-zinc-50 border border-dashed border-zinc-200 rounded-2xl">
            <p className="text-sm text-zinc-500">No transactions recorded yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {transactions.map((tx: any) => (
              <TransactionCard
                key={tx.id}
                transaction={tx}
                category={categoryMap.get(tx.categoryId)}
              />
            ))}
          </div>
        )}
      </section>

      {/* --- BUDGETS & GOALS GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* BUDGETS */}
        <section className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Active Budgets
          </h2>
          {budgets.length === 0 ? (
            <div className="p-8 text-center bg-zinc-50 border border-dashed border-zinc-200 rounded-2xl">
              <p className="text-sm text-zinc-500">No active budgets set up.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {budgets.map((b: any) => (
                <BudgetCard
                  key={b.id}
                  budget={b}
                  spent={0} // Wire up calculated transaction totals here
                  category={categoryMap.get(b.categoryId)}
                />
              ))}
            </div>
          )}
        </section>

        {/* GOALS */}
        <section className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Savings Goals
          </h2>
          {goals.length === 0 ? (
            <div className="p-8 text-center bg-zinc-50 border border-dashed border-zinc-200 rounded-2xl">
              <p className="text-sm text-zinc-500">No savings goals created.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {goals.map((g: any) => (
                <GoalCard key={g.id} goal={g} />
              ))}
            </div>
          )}
        </section>

      </div>

      {/* --- CATEGORIES PALETTE --- */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
          Categories
        </h2>
        {categories.length === 0 ? (
          <div className="p-8 text-center bg-zinc-50 border border-dashed border-zinc-200 rounded-2xl">
            <p className="text-sm text-zinc-500">No categories created yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {categories.map((c: any) => (
              <CategoryCard key={c.id} category={c} />
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
```

## CARDS
```tsx
"use client";

import React from "react";
import * as LucideIcons from "lucide-react";

// --- Dynamic Icon Helper ---
function DynamicIcon({ name, fallback = "Wallet", className = "w-5 h-5" }: { name?: string; fallback?: string; className?: string }) {
  const iconName = name || fallback;
  const formattedName = iconName
    .trim()
    .replace(/(^\w|-\w)/g, (match) => match.replace("-", "").toUpperCase());

  const                    IconComponent = (LucideIcons as Record<string, any>)[formattedName] || LucideIcons.Wallet;
  return <IconComponent className={className} />;
}

// --- 1. TRANSACTION CARD ---
export function TransactionCard({ transaction, category }: { transaction: any; category?: any }) {
  const isIncome = transaction.type === "Income";
  const formattedDate = new Date(transaction.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <div className="flex items-center justify-between p-3.5 bg-white border border-zinc-200/80 rounded-xl hover:border-zinc-300 transition-all shadow-sm">
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm"
          style={{
            backgroundColor: category?.color || (isIncome ? "#10b981" : "#18181b"),
          }}
        >
          <DynamicIcon name={category?.icon || (isIncome ? "TrendingUp" : "Receipt")} className="w-5 h-5 drop-shadow-sm" />
        </div>
        <div>
          <p className="font-semibold text-zinc-900 text-sm">{transaction.description}</p>
          <p className="text-xs text-zinc-400 font-medium">
            {category?.name || "Uncategorized"} • {formattedDate}
          </p>
        </div>
      </div>
      <span className={`font-bold text-sm ${isIncome ? "text-emerald-600" : "text-zinc-900"}`}>
        {isIncome ? "+" : "-"}${Number(transaction.amount).toFixed(2)}
      </span>
    </div>
  );
}

// --- 2. BUDGET CARD ---
export function BudgetCard({ budget, spent = 0, category }: { budget: any; spent?: number; category?: any }) {
  const limit = Number(budget.amount) || 1;
  const percentage = Math.min(Math.round((spent / limit) * 100), 100);
  const isOver = spent > limit;

  return (
    <div className="p-4 bg-white border border-zinc-200/80 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-sm"
            style={{ backgroundColor: category?.color || "#18181b" }}
          >
            <DynamicIcon name={category?.icon || "PieChart"} className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-semibold text-zinc-900 text-sm">{budget.name}</h4>
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              {budget.period}
            </span>
          </div>
        </div>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
          isOver ? "bg-red-50 text-red-600" : "bg-zinc-100 text-zinc-600"
        }`}>
          {percentage}% Used
        </span>
      </div>

      <div>
        <div className="flex justify-between text-xs mb-1.5 font-medium">
          <span className="text-zinc-500">${spent.toFixed(2)} spent</span>
          <span className="text-zinc-900 font-bold">${limit.toFixed(2)} limit</span>
        </div>
        <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isOver ? "bg-red-500" : percentage > 85 ? "bg-amber-500" : "bg-zinc-900"
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// --- 3. GOAL CARD ---
export function GoalCard({ goal }: { goal: any }) {
  const current = Number(goal.currentAmount || 0);
  const target = Number(goal.targetAmount || 1);
  const percentage = Math.min(Math.round((current / target) * 100), 100);

  return (
    <div className="p-4 bg-white border border-zinc-200/80 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center font-bold">
            <LucideIcons.Target className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-semibold text-zinc-900 text-sm">{goal.name}</h4>
            {goal.targetDate && (
              <span className="text-[10px] text-zinc-400 font-medium">
                Target: {new Date(goal.targetDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
          {percentage}%
        </span>
      </div>

      <div>
        <div className="flex justify-between text-xs mb-1.5 font-medium">
          <span className="text-zinc-500">${current.toFixed(2)} saved</span>
          <span className="text-zinc-900 font-bold">${target.toFixed(2)} target</span>
        </div>
        <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// --- 4. CATEGORY PILL / CARD ---
export function CategoryCard({ category }: { category: any }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-white border border-zinc-200/80 rounded-xl hover:border-zinc-300 transition-all shadow-sm">
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center text-white shadow-sm"
        style={{ backgroundColor: category.color || "#3b82f6" }}
      >
        <DynamicIcon name={category.icon} className="w-4 h-4 drop-shadow-sm" />
      </div>
      <span className="font-semibold text-zinc-800 text-sm">{category.name}</span>
    </div>
  );
}
```

## CARDS SERVER ACTIONS
```tsx
"use server";

import { db } from "@/db";
import { categoriesTable, budgetsTable, goalsTable, transactionsTable } from "@/db/schema";
import { getAuthenticatedUser } from "./getAuthenticatedUser"; // Adjust import path
import { eq, desc } from "drizzle-orm";

export async function getDashboardData() {
  try {
    const userId = await getAuthenticatedUser();

    const [categories, budgets, goals, transactions] = await Promise.all([
      db.select().from(categoriesTable).where(eq(categoriesTable.userId, userId)),
      db.select().from(budgetsTable).where(eq(budgetsTable.userId, userId)),
      db.select().from(goalsTable).where(eq(goalsTable.userId, userId)),
      db
        .select()
        .from(transactionsTable)
        .where(eq(transactionsTable.userId, userId))
        .orderBy(desc(transactionsTable.date))
        .limit(10), // Latest 10 transactions
    ]);

    return { categories, budgets, goals, transactions };
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
    return { categories: [], budgets: [], goals: [], transactions: [] };
  }
}
```

## DASHBOARD PAGE
```tsx
import React from "react";
import * as LucideIcons from "lucide-react";
import { getDashboardMetrics } from "@/app/actions/dashboard";
import DashboardCharts from "./dashboardClient";

export default async function DashboardPage() {
  const data = await getDashboardMetrics();

  if (!data) {
    return (
      <div className="p-8 text-center text-zinc-400 bg-[#06090e] min-h-screen">
        Failed to load dashboard metrics.
      </div>
    );
  }

  const { metrics, categoryBreakdown, timelineData, recentTransactions, categories } = data;
  const categoryMap = new Map(categories.map((c) => [c.id, c]));

  return (
    <div className="min-h-screen bg-[#06090e] text-zinc-100 p-6 space-y-6">
      
      {/* --- TOP METRICS CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Balance */}
        <div className="p-4 bg-[#0a0f1d] border border-zinc-800/80 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-zinc-400">Total Balance</p>
            <h3 className="text-2xl font-bold text-[#00a3ff] mt-1">
              ${metrics.totalBalance.toFixed(2)}
            </h3>
            <p className="text-[11px] text-cyan-400/80 flex items-center gap-1 mt-1">
              <span>↑</span> Active Net Flow
            </p>
          </div>
          <div className="p-3 bg-cyan-950/40 rounded-xl text-[#00a3ff]">
            <LucideIcons.Wallet className="w-5 h-5" />
          </div>
        </div>

        {/* Monthly Income */}
        <div className="p-4 bg-[#0a0f1d] border border-zinc-800/80 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-zinc-400">Total Income</p>
            <h3 className="text-2xl font-bold text-emerald-400 mt-1">
              ${metrics.totalIncome.toFixed(2)}
            </h3>
            <p className="text-[11px] text-zinc-500 flex items-center gap-1 mt-1">
              <LucideIcons.ArrowUpRight className="w-3 h-3 text-emerald-400" /> All time
            </p>
          </div>
          <div className="p-3 bg-emerald-950/30 rounded-xl text-emerald-400">
            <LucideIcons.ArrowUpRight className="w-5 h-5" />
          </div>
        </div>

        {/* Monthly Expenses */}
        <div className="p-4 bg-[#0a0f1d] border border-zinc-800/80 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-zinc-400">Total Expenses</p>
            <h3 className="text-2xl font-bold text-rose-500 mt-1">
              ${metrics.totalExpenses.toFixed(2)}
            </h3>
            <p className="text-[11px] text-zinc-500 flex items-center gap-1 mt-1">
              <LucideIcons.ArrowDownRight className="w-3 h-3 text-rose-500" /> All time
            </p>
          </div>
          <div className="p-3 bg-rose-950/30 rounded-xl text-rose-500">
            <LucideIcons.ArrowDownRight className="w-5 h-5" />
          </div>
        </div>

        {/* Savings Rate */}
        <div className="p-4 bg-[#0a0f1d] border border-zinc-800/80 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-zinc-400">Savings Rate</p>
            <h3 className="text-2xl font-bold text-zinc-100 mt-1">
              {metrics.savingsRate}%
            </h3>
            <p className="text-[11px] text-zinc-500 mt-1">% Of Total Income</p>
          </div>
          <div className="p-3 bg-indigo-950/30 rounded-xl text-indigo-400">
            <LucideIcons.PiggyBank className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* --- RECHARTS SECTION --- */}
      <DashboardCharts
        categoryBreakdown={categoryBreakdown}
        totalExpenses={metrics.totalExpenses}
        totalIncome={metrics.totalIncome}
      />

      {/* --- LIVE TRANSACTIONS TABLE --- */}
      <div className="bg-[#0a0f1d] border border-zinc-800/80 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#0e1626] text-cyan-400 font-bold uppercase tracking-wider border-b border-zinc-800/80">
            <tr>
              <th className="p-4">Date</th>
              <th className="p-4">Description</th>
              <th className="p-4">Category</th>
              <th className="p-4">Type</th>
              <th className="p-4">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50 text-zinc-200">
            {recentTransactions.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-zinc-500">
                  No transactions found in database.
                </td>
              </tr>
            ) : (
              recentTransactions.map((tx) => {
                const cat = tx.categoryId ? categoryMap.get(tx.categoryId) : null;
                const isIncome = tx.type === "Income";

                return (
                  <tr key={tx.id} className="hover:bg-[#0e1626]/40 transition-colors">
                    <td className="p-4 font-medium">
                      {new Date(tx.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="p-4 font-semibold">{tx.description}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-950/40 text-teal-400 border border-teal-800/40 font-medium">
                        {cat?.name || "Uncategorized"}
                      </span>
                    </td>
                    <td className={`p-4 font-bold ${isIncome ? "text-emerald-400" : "text-rose-500"}`}>
                      {tx.type}
                    </td>
                    <td className={`p-4 font-bold ${isIncome ? "text-emerald-400" : "text-rose-500"}`}>
                      {isIncome ? "+" : "-"}${Number(tx.amount).toFixed(2)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
```

## DASHBOARD CLIENT
```tsx
"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DashboardChartsProps {
  categoryBreakdown: any[];
  totalExpenses: number;
  totalIncome: number;
}

export default function DashboardCharts({
  categoryBreakdown,
  totalExpenses,
  totalIncome,
}: DashboardChartsProps) {
  const overviewData = [
    { name: "Income", amount: totalIncome, color: "#10b981" },
    { name: "Expenses", amount: totalExpenses, color: "#ef4444" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Spending By Category Donut */}
      <div className="p-5 bg-[#0a0f1d] border border-zinc-800/80 rounded-2xl flex flex-col justify-between">
        <h3 className="text-sm font-semibold text-[#00a3ff]">Spending by Category</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4 my-4">
          <div className="h-48 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryBreakdown.length > 0 ? categoryBreakdown : [{ name: "None", amount: 1, color: "#27272a" }]}
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="amount"
                >
                  {categoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center">
              <span className="text-[10px] text-zinc-400 font-semibold tracking-wider uppercase block">
                TOTAL EXPENSES
              </span>
              <span className="text-lg font-bold text-zinc-100">
                ${totalExpenses.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Dynamic Legend Pills */}
          <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
            {categoryBreakdown.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between p-2 bg-[#0e1626] border border-zinc-800/60 rounded-xl"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-xs font-medium text-zinc-200">{cat.name}</span>
                  <span className="text-[10px] text-zinc-500">({cat.percentage})</span>
                </div>
                <span className="text-xs font-bold text-zinc-100">
                  ${cat.amount.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Total Overview Bar Chart */}
      <div className="p-5 bg-[#0a0f1d] border border-zinc-800/80 rounded-2xl flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-zinc-100">Total Overview</h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Net Cash Flow:{" "}
              <span className="text-emerald-400 font-bold bg-emerald-950/40 px-1.5 py-0.5 rounded">
                + ${(totalIncome - totalExpenses).toFixed(2)}
              </span>
            </p>
          </div>
        </div>

        <div className="h-52 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={overviewData} barSize={60}>
              <XAxis dataKey="name" stroke="#52525b" fontSize={11} tickLine={false} />
              <YAxis stroke="#52525b" fontSize={11} tickLine={false} />
              <Tooltip
                cursor={{ fill: "transparent" }}
                contentStyle={{ backgroundColor: "#0e1626", borderColor: "#27272a", borderRadius: "8px" }}
              />
              <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                {overviewData.map((entry, index) => (
                  <Cell key={`bar-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
```

## DASHBOARD SERVER ACTION
```tsx
"use server";

import { db } from "@/db";
import { transactionsTable, categoriesTable, budgetsTable, goalsTable } from "@/db/schema";
import { getAuthenticatedUser } from "./getAuthenticatedUser";
import { eq, sql, desc, gte } from "drizzle-orm";

export async function getDashboardMetrics() {
  try {
    const userId = await getAuthenticatedUser();

    // 1. Fetch raw data in parallel
    const [transactions, categories, budgets, goals] = await Promise.all([
      db
        .select()
        .from(transactionsTable)
        .where(eq(transactionsTable.userId, userId))
        .orderBy(desc(transactionsTable.date)),
      db.select().from(categoriesTable).where(eq(categoriesTable.userId, userId)),
      db.select().from(budgetsTable).where(eq(budgetsTable.userId, userId)),
      db.select().from(goalsTable).where(eq(goalsTable.userId, userId)),
    ]);

    // 2. Map Categories for fast lookup
    const categoryMap = new Map(categories.map((c) => [c.id, c]));

    // 3. Compute High-Level Financial Metrics
    let totalIncome = 0;
    let totalExpenses = 0;
    const categoryTotals: Record<number, number> = {};

    transactions.forEach((tx) => {
      const amount = Number(tx.amount);
      if (tx.type === "Income") {
        totalIncome += amount;
      } else if (tx.type === "Expense") {
        totalExpenses += amount;
        if (tx.categoryId) {
          categoryTotals[tx.categoryId] = (categoryTotals[tx.categoryId] || 0) + amount;
        }
      }
    });

    const netBalance = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) : 0;

    // 4. Build Category Spending Breakdown with Percentages
    const categoryBreakdown = Object.entries(categoryTotals).map(([catId, amount]) => {
      const category = categoryMap.get(Number(catId));
      const percentage = totalExpenses > 0 ? ((amount / totalExpenses) * 100).toFixed(1) : "0.0";
      return {
        id: Number(catId),
        name: category?.name || "Uncategorized",
        icon: category?.icon || "Folder",
        color: category?.color || "#3b82f6",
        amount,
        percentage: `${percentage}%`,
      };
    }).sort((a, b) => b.amount - a.amount);

    // 5. Build Monthly Timeline Data (12 Months) for Line/Area Charts
    const monthlyMap: Record<string, { month: string; income: number; expense: number }> = {};
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    months.forEach((m) => {
      monthlyMap[m] = { month: m, income: 0, expense: 0 };
    });

    transactions.forEach((tx) => {
      const d = new Date(tx.date);
      const monthName = months[d.getMonth()];
      const amount = Number(tx.amount);

      if (monthlyMap[monthName]) {
        if (tx.type === "Income") monthlyMap[monthName].income += amount;
        if (tx.type === "Expense") monthlyMap[monthName].expense += amount;
      }
    });

    const timelineData = Object.values(monthlyMap);

    return {
      metrics: {
        totalBalance: netBalance,
        totalIncome,
        totalExpenses,
        savingsRate,
      },
      categoryBreakdown,
      timelineData,
      recentTransactions: transactions.slice(0, 5), // Top 5 recent
      categories,
      budgets,
      goals,
    };
  } catch (error) {
    console.error("Error computing dashboard metrics:", error);
    return null;
  }
}
```

## REPORT PAGE
```tsx
import React from "react";
import * as LucideIcons from "lucide-react";
import { getReportsData } from "@/app/actions/report";
import ReportsCharts from "./reportClient";


export default async function ReportsPage() {
  const data = await getReportsData();

  if (!data) {
    return (
      <div className="p-8 text-center text-zinc-400 bg-[#06090e] min-h-screen">
        Failed to load report data.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#06090e] text-zinc-100 p-6 space-y-6">
      
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-100">Financial Reports</h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Annual spending, income trends, and category distribution.
          </p>
        </div>

        <button className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#0e1626] border border-cyan-500/30 text-cyan-400 text-xs font-medium hover:bg-cyan-950/30 transition-all">
          <LucideIcons.UserCheck className="w-3.5 h-3.5" />
          <span>Switch account</span>
        </button>
      </div>

      {/* Dynamic Report Charts */}
      <ReportsCharts
        timelineData={data.timelineData}
        topExpenses={data.topExpenses}
        categoryBreakdown={data.categoryBreakdown}
      />

    </div>
  );
}
```

## REPORT CLIENT
```tsx
"use client";

import React from "react";
import * as LucideIcons from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ReportsChartsProps {
  timelineData: any[];
  topExpenses: any[];
  categoryBreakdown: any[];
}

function DynamicIcon({ name, className }: { name?: string; className?: string }) {
  if (!name) return <LucideIcons.ShoppingBag className={className} />;

  const formattedName = name
    .trim()
    .replace(/(^\w|-\w)/g, (match) => match.replace("-", "").toUpperCase());

  const IconComponent = (LucideIcons as Record<string, any>)[formattedName];
  if (!IconComponent) return <LucideIcons.ShoppingBag className={className} />;

  return <IconComponent className={className} />;
}

export default function ReportsCharts({
  timelineData,
  topExpenses,
  categoryBreakdown,
}: ReportsChartsProps) {
  return (
    <div className="space-y-6">
      
      {/* --- ANNUAL TIMELINE CURVE AREA CHART --- */}
      <div className="p-5 bg-[#0a0f1d] border border-zinc-800/80 rounded-2xl">
        <div className="h-64 mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timelineData}>
              <XAxis dataKey="month" stroke="#52525b" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#52525b"
                fontSize={11}
                tickLine={false}
                tickFormatter={(val) => `$${val}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0e1626",
                  borderColor: "#27272a",
                  borderRadius: "8px",
                }}
              />

              {/* Income Line */}
              <Area
                type="monotone"
                dataKey="income"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#incomeGradient)"
              />

              {/* Expense Line */}
              <Area
                type="monotone"
                dataKey="expense"
                stroke="#ef4444"
                strokeWidth={2}
                fill="url(#expenseGradient)"
              />

              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* --- TOP EXPENSES & CATEGORY BREAKDOWN GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Top Expenses */}
        <div className="p-5 bg-[#0a0f1d] border border-zinc-800/80 rounded-2xl flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-[#00a3ff]">Top Expenses</h3>
          <div className="flex flex-col gap-3">
            {topExpenses.length === 0 ? (
              <p className="text-xs text-zinc-500 py-4">No recorded expenses.</p>
            ) : (
              topExpenses.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-[#0e1626] border border-zinc-800/60 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                      style={{ backgroundColor: item.color }}
                    >
                      <DynamicIcon name={item.icon} className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-zinc-200">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-rose-500">
                    ${item.amount.toFixed(2)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Category Breakdown List */}
        <div className="p-5 bg-[#0a0f1d] border border-zinc-800/80 rounded-2xl flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-[#00a3ff]">Category Breakdown</h3>
          <div className="flex flex-col gap-3">
            {categoryBreakdown.length === 0 ? (
              <p className="text-xs text-zinc-500 py-4">No category data.</p>
            ) : (
              categoryBreakdown.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between p-3 bg-[#0e1626] border border-zinc-800/60 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                      style={{ backgroundColor: cat.color }}
                    >
                      <DynamicIcon name={cat.icon} className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-zinc-200">
                      {cat.name}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-zinc-400">
                    {cat.percentage} (${cat.amount.toFixed(2)})
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
```

## REPORT SERVER ACTION
```tsx
"use server";

import { db } from "@/db";
import { transactionsTable, categoriesTable } from "@/db/schema";
import { getAuthenticatedUser } from "./getAuthenticatedUser";
import { eq, desc } from "drizzle-orm";

export async function getReportsData() {
  try {
    const userId = await getAuthenticatedUser();

    // Fetch transactions and categories in parallel
    const [transactions, categories] = await Promise.all([
      db
        .select()
        .from(transactionsTable)
        .where(eq(transactionsTable.userId, userId))
        .orderBy(desc(transactionsTable.date)),
      db.select().from(categoriesTable).where(eq(categoriesTable.userId, userId)),
    ]);

    const categoryMap = new Map(categories.map((c) => [c.id, c]));

    // --- 1. Compute 12-Month Annual Timeline Data ---
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyMap: Record<string, { month: string; income: number; expense: number }> = {};

    months.forEach((m) => {
      monthlyMap[m] = { month: m, income: 0, expense: 0 };
    });

    let totalExpenses = 0;
    const categoryTotals: Record<number, number> = {};

    transactions.forEach((tx) => {
      const d = new Date(tx.date);
      const monthName = months[d.getMonth()];
      const amount = Number(tx.amount);

      if (tx.type === "Income") {
        if (monthlyMap[monthName]) monthlyMap[monthName].income += amount;
      } else if (tx.type === "Expense") {
        if (monthlyMap[monthName]) monthlyMap[monthName].expense += amount;
        totalExpenses += amount;

        if (tx.categoryId) {
          categoryTotals[tx.categoryId] = (categoryTotals[tx.categoryId] || 0) + amount;
        }
      }
    });

    const timelineData = Object.values(monthlyMap);

    // --- 2. Compute Top Expenses ---
    const topExpenses = transactions
      .filter((tx) => tx.type === "Expense")
      .slice(0, 5)
      .map((tx) => {
        const cat = tx.categoryId ? categoryMap.get(tx.categoryId) : null;
        return {
          id: tx.id,
          name: tx.description,
          amount: Number(tx.amount),
          color: cat?.color || "#3b82f6",
          icon: cat?.icon || "ShoppingBag",
        };
      });

    // --- 3. Compute Category Breakdown ---
    const categoryBreakdown = Object.entries(categoryTotals)
      .map(([catId, amount]) => {
        const category = categoryMap.get(Number(catId));
        const percentage = totalExpenses > 0 ? ((amount / totalExpenses) * 100).toFixed(1) : "0.0";
        return {
          id: Number(catId),
          name: category?.name || "Uncategorized",
          icon: category?.icon || "Folder",
          color: category?.color || "#10b981",
          amount,
          percentage: `${percentage}%`,
        };
      })
      .sort((a, b) => b.amount - a.amount);

    return {
      timelineData,
      topExpenses,
      categoryBreakdown,
    };
  } catch (error) {
    console.error("Failed to fetch reports data:", error);
    return null;
  }
}
```

## Input Div
```tsx
<div className="group flex flex-col gap-2">
                        <div className="flex justify-between items-center gap-2">
                          <Label
                            htmlFor=""
                            className="custom-modal-label"
                          ></Label>
                          <Label
                            className={`isfilled-badge ${
                              fieldStatus
                              ? "badge-success"
                              : "badge-destructive"
                            }`}
                          >
                            {fieldStatus ? "✓ Done" : "Required"}
                          </Label>
                        </div>
                        <Input
                        id=""
                        name=""
                        type="text"
                        value={formData}
                        onChange={handleChange}
                        placeholder=""
                        className={`h-11 ${
                          fieldStatus ? "focus-visible:ring-success border-success/30" : ""
                        }`}
                      />
                    </div>
```

```tsx
"use client";

import React, { useState, useMemo } from 'react';
import { X } from 'lucide-react';
import * as LucideIcons from "lucide-react";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { isFilled } from '@/lib/checkIsFilled';
import { Button } from '@/components/ui/button';
import { createCategory } from '@/app/actions/categories';
import { toast } from 'sonner';
import { DynamicIcon } from '@/lib/dynamicIcon';

interface OpenModalProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}

// Default icons shown before the user starts typing
const DEFAULT_SUGGESTED_ICONS = [
  "Folder",
  "ShoppingBag",
  "ShoppingCart",
  "CreditCard",
  "DollarSign",
  "Utensils",
  "Home",
  "Car",
  "HeartPulse",
  "Plane",
  "Briefcase",
  "Gift",
  "Film",
  "Smile",
  "Repeat",        // Added for subscriptions
  "RefreshCw",     // Added for subscriptions
  "CalendarSync",  // Added for subscriptions
  "Receipt",       // Added for subscriptions
  "Coins",         // Added for cash/expenses
  "Wallet",
] as const;

// Preset category color palette
const PRESET_COLORS = [
  "#3b82f6", // Blue
  "#10b981", // Emerald
  "#8b5cf6", // Purple
  "#f59e0b", // Amber
  "#ef4444", // Red
  "#ec4899", // Pink
  "#06b6d4", // Cyan
  "#84cc16", // Lime
  "#6366f1", // Indigo
  "#f97316", // Orange
];

export default function CreateCategoriesModal({ isOpen, setIsOpen }: OpenModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  type CategoryFormData = {
    name: string;
    icon: string;
    color: string;
  };

  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    icon: "",
    color: "#3b82f6",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // --- SOLUTION 1: DYNAMIC LUCIDE SEARCH ---
  const filteredIcons = useMemo(() => {
    const searchTerm = formData.icon.trim().toLowerCase();

    // 1. Extract all valid icon export names from lucide-react
    const allLucideIconNames = Object.keys(LucideIcons).filter((key) => {
      // Exclude internal React utility exports, types, and helper components
      return (
        key !== "default" &&
        key !== "createLucideIcon" &&
        typeof (LucideIcons as Record<string, unknown>)[key] === "object"
      );
    });

    // 2. If search input is empty, return default set
    if (!searchTerm) {
      return DEFAULT_SUGGESTED_ICONS;
    }

    // 3. Search through ALL Lucide icons (limited to 35 for render performance)
    return allLucideIconNames
      .filter((iconName) => iconName.toLowerCase().includes(searchTerm))
      .slice(0, 35);
  }, [formData.icon]);

  const fieldStatus = {
    name: isFilled(formData.name, "text"),
    icon: isFilled(formData.icon, "text"),
    color: isFilled(formData.color, "text"),
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createCategory({
        name: formData.name,
        icon: formData.icon,
        color: formData.color,
        userId: "",
      });

      toast.success("Category created successfully");
      setIsOpen(false);
    } catch (error) {
      toast.error("Error creating category. Make sure you are logged in!");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-background z-2">
      <div className="background-glow" />
      <form onSubmit={handleSubmit} className="modal-form">
        <div className="flex items-center justify-between relative px-5">
          <h1 className="form-heading">Create Category</h1>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="close-modal"
            aria-label="Close Modal"
            type="button"
          >
            <X />
          </button>
        </div>

        <div className="flex flex-col gap-3 mt-5">
          {/* --- CATEGORY NAME --- */}
          <div className="group flex flex-col gap-2">
            <div className="flex justify-between items-center gap-2">
              <Label htmlFor="name" className="custom-modal-label">
                Category Name
              </Label>
              <Label
                className={`isfilled-badge ${
                  fieldStatus.name ? "badge-success" : "badge-destructive"
                }`}
              >
                {fieldStatus.name ? "✓ Done" : "Required"}
              </Label>
            </div>
            <Input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Subscriptions"
              className={`h-11 ${
                fieldStatus.name ? "focus-visible:ring-success border-success/30" : ""
              }`}
            />
          </div>

          {/* --- ICON SELECTION & DYNAMIC SEARCH --- */}
          <div className="group flex flex-col gap-2">
            <div className="flex justify-between items-center gap-2">
              <Label htmlFor="icon" className="custom-modal-label">
                Icon
              </Label>
              <Label
                className={`isfilled-badge ${
                  fieldStatus.icon ? "badge-success" : "badge-destructive"
                }`}
              >
                {fieldStatus.icon ? "✓ Done" : "Required"}
              </Label>
            </div>
            <div className="relative">
              <Input
                id="icon"
                name="icon"
                type="text"
                required
                value={formData.icon}
                onChange={handleChange}
                placeholder="Search any Lucide icon (e.g. Repeat, Receipt, Sparkles)..."
                className={`h-11 pl-12 ${
                  fieldStatus.icon ? "focus-visible:ring-success border-success/30" : ""
                }`}
              />

              <div
                className="absolute w-7 h-7 flex items-center justify-center left-3 top-2 rounded-md"
                style={{
                  backgroundColor: `${formData.color}20`,
                  color: formData.color,
                }}
              >
                <DynamicIcon name={formData.icon} className="w-4 h-4" />
              </div>
            </div>

            <p className="text-[13px] text-muted-foreground my-1">
              {formData.icon.trim() === ""
                ? "Popular suggestions:"
                : filteredIcons.length > 0
                ? `Showing matching Lucide icons:`
                : "No exact icon match found, but custom Lucide string will still work!"}
            </p>

            {filteredIcons.length > 0 && (
              <div className="grid grid-cols-7 gap-1.5 p-2 border border-border rounded-xl max-h-36 overflow-y-auto">
                {filteredIcons.map((iconName) => {
                  const isSelected =
                    formData.icon.toLowerCase() === iconName.toLowerCase();
                  return (
                    <button
                      key={iconName}
                      type="button"
                      title={iconName}
                      onClick={() =>
                        handleChange({
                          target: { name: "icon", value: iconName },
                        } as React.ChangeEvent<HTMLInputElement>)
                      }
                      className={`p-2 flex items-center justify-center rounded-lg transition-all ${
                        isSelected
                          ? "bg-secondary shadow-sm ring-1 ring-primary/40"
                          : "hover:bg-secondary/60"
                      }`}
                    >
                      <DynamicIcon name={iconName} className="w-4 h-4" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* --- COLOR SELECTION --- */}
          <div className="group flex flex-col gap-2">
            <div className="flex justify-between items-center gap-2">
              <Label htmlFor="color" className="custom-modal-label">
                Color Palette
              </Label>
              <Label
                className={`isfilled-badge ${
                  fieldStatus.color ? "badge-success" : "badge-destructive"
                }`}
              >
                {fieldStatus.color ? "✓ Done" : "Required"}
              </Label>
            </div>

            <div className="flex items-center justify-between">
              {/* Swatches */}
              <div className="grid grid-cols-5 gap-2 mb-3">
                {PRESET_COLORS.map((presetColor) => {
                  const isSelected =
                    formData.color.toLowerCase() === presetColor.toLowerCase();
                  return (
                    <button
                      key={presetColor}
                      type="button"
                      onClick={() =>
                        handleChange({
                          target: { name: "color", value: presetColor },
                        } as React.ChangeEvent<HTMLInputElement>)
                      }
                      className={`h-7 w-7 rounded-full flex items-center justify-center ${
                        isSelected
                          ? "ring-2 ring-offset-1 scale-105 shadow-sm"
                          : "hover:scale-105 opacity-90 hover:opacity-100"
                      }`}
                      style={{ backgroundColor: presetColor }}
                      title={presetColor}
                    >
                      {isSelected && (
                        <LucideIcons.Check className="w-4 h-4 drop-shadow text-white" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Hex Input */}
              <div className="w-1/2 flex items-center gap-3 mt-2">
                <div className="relative w-11 h-11 shrink-0 overflow-hidden rounded-xl border border-border shadow-sm">
                  <input
                    name="color"
                    type="color"
                    value={formData.color}
                    onChange={handleChange}
                    className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer border-0 p-0"
                  />
                </div>

                <div className="flex-1">
                  <Input
                    name="color"
                    type="text"
                    value={formData.color}
                    onChange={handleChange}
                    placeholder="#000000"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-5">
          <Button
            type="button"
            variant="outline"
            className="modal-button h-11"
            onClick={() => setIsOpen(!isOpen)}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="modal-button h-11"
          >
            {isSubmitting ? "Saving..." : "Create Category"}
          </Button>
        </div>
      </form>
    </div>
  );
}

```