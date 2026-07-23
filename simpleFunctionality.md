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
  const [type, setType] = useState<"Income" | "Expense">("Expense");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const [categoryId, setCategoryId] = useState<number | "">("");
  const [budgetId, setBudgetId] = useState<number | "">("");
  const [goalId, setGoalId] = useState<number | "">("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- MUTUAL EXCLUSIVITY FLAGS ---
  const hasCategory = categoryId !== "";
  const hasBudget = budgetId !== "";
  const hasGoal = goalId !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await createTransaction({
        description,
        amount,
        currency,
        type,
        date: date ? new Date(`${date}T00:00:00`).toISOString() : new Date().toISOString(),
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

        {/* --- MUTUALLY EXCLUSIVE SELECTORS --- */}
        <div className="flex flex-col gap-3 pt-2 border-t border-zinc-100">
          <p className="text-[11px] font-medium text-zinc-400">
            Link to one of the following (optional):
          </p>

          {/* CATEGORY SELECTOR */}
          <div>
            <label className="block text-xs font-semibold uppercase text-zinc-500 mb-1.5 tracking-wider">
              Category
            </label>
            <select
              disabled={hasBudget || hasGoal}
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : "")}
              className="w-full bg-zinc-50/50 border border-zinc-200 text-zinc-900 text-sm p-3 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all disabled:opacity-40 disabled:bg-zinc-100 disabled:cursor-not-allowed"
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
                disabled={hasCategory || hasGoal}
                value={budgetId}
                onChange={(e) => setBudgetId(e.target.value ? Number(e.target.value) : "")}
                className="w-full bg-zinc-50/50 border border-zinc-200 text-zinc-900 text-sm p-2.5 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all text-xs disabled:opacity-40 disabled:bg-zinc-100 disabled:cursor-not-allowed"
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
                disabled={hasCategory || hasBudget}
                value={goalId}
                onChange={(e) => setGoalId(e.target.value ? Number(e.target.value) : "")}
                className="w-full bg-zinc-50/50 border border-zinc-200 text-zinc-900 text-sm p-2.5 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all text-xs disabled:opacity-40 disabled:bg-zinc-100 disabled:cursor-not-allowed"
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
