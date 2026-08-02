"use client";

import { Asterisk, BadgeCheck, X } from "lucide-react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { isFilled } from "@/lib/checkIsFilled";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createTransaction } from "@/app/actions/transactions";
import { toast } from "sonner";

interface OpenModalProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  transactions: TransactionOption;
}

interface OptionItem {
  id: number;
  name: string;
  icon?: string;
  color?: string;
}

export interface TransactionOption {
  categories: OptionItem[];
  budgets: OptionItem[];
  goals: OptionItem[];
}

export default function CreateTransactionsModal({
  isOpen,
  setIsOpen,
  transactions,
}: OpenModalProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  type TransactionFormData = {
    date: string;
    description: string;
    amount: string;
    currency: string;
    type: "Income" | "Expense";
    categoryId: string;
    budgetId: string;
    goalId: string;
  };

  const [formData, setFormData] = useState<TransactionFormData>({
    date: new Date().toISOString().split("T")[0],
    description: "",
    amount: "",
    currency: "USD",
    type: "Expense",
    categoryId: "",
    budgetId: "",
    goalId: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (
    field: keyof TransactionFormData,
    value: string
  ) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };

      // Mutual Exclusivity Safeguards
      if (field === "budgetId" && value) {
        updated.categoryId = "";
        updated.goalId = "";
      } else if (field === "goalId" && value) {
        updated.categoryId = "";
        updated.budgetId = "";
        // Force type to Expense when a goal is selected
        updated.type = "Expense";
      } else if (field === "categoryId" && value) {
        updated.budgetId = "";
        updated.goalId = "";
      }

      return updated;
    });
  };

  const hasCategory = Boolean(formData.categoryId);
  const hasBudget = Boolean(formData.budgetId);
  const hasGoal = Boolean(formData.goalId);

  const fieldStatus = {
    date: isFilled(formData.date, "date"),
    description: isFilled(formData.description, "text"),
    amount: isFilled(formData.amount, "number"),
    currency: isFilled(formData.currency, "select"),
    type: isFilled(formData.type, "select"),
    categoryId: isFilled(formData.categoryId, "select"),
    budgetId: isFilled(formData.budgetId, "select"),
    goalId: isFilled(formData.goalId, "select"),
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const validDate = formData.date
        ? new Date(`${formData.date}T00:00:00`).toISOString()
        : new Date().toISOString();

      const categoryId = formData.categoryId ? Number(formData.categoryId) : null;
      const budgetId = formData.budgetId ? Number(formData.budgetId) : null;
      const goalId = formData.goalId ? Number(formData.goalId) : null;

      const result = await createTransaction({
        date: validDate,
        description: formData.description,
        amount: formData.amount,
        currency: formData.currency || "USD",
        type: formData.type,
        categoryId,
        budgetId,
        goalId,
      });

      if (result?.success) {
        toast.success("Transaction created successfully!");
        setIsOpen(false);
        // Triggers Next.js Server Component data refresh so Goal Cards update instantly
        router.refresh();
      } else {
        toast.error(result?.error || "Failed to create transaction.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while creating the transaction.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="modal-background z-2">
        <div className="background-glow" />
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="flex items-center justify-between relative">
            <div>
              <h1 className="form-heading">Create New Transaction</h1>
              <p className="text-sm text-muted-foreground">
                Log your recent income or expense to keep your accounts accurate
                and up to date.
              </p>
            </div>
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
            {/* Description */}
            <div className="group flex flex-col gap-2">
              <div className="flex justify-between items-center gap-2">
                <Label htmlFor="description" className="custom-modal-label">
                  Description
                </Label>
                <Label
                  className={`isfilled-badge ${
                    fieldStatus.description
                      ? "badge-success"
                      : "badge-destructive"
                  }`}
                >
                  {fieldStatus.description ? "✓ Done" : "Required"}
                </Label>
              </div>
              <Input
                id="description"
                name="description"
                type="text"
                required
                value={formData.description}
                onChange={handleChange}
                placeholder="e.g. Grocery Shopping"
                className={`h-11 ${
                  fieldStatus.description
                    ? "focus-visible:ring-success border-success/30"
                    : ""
                }`}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Amount */}
              <div className="group flex flex-col gap-2">
                <div className="flex justify-between items-center gap-2">
                  <Label htmlFor="amount" className="custom-modal-label">
                    Amount
                  </Label>
                  <Label
                    className={`isfilled-badge ${
                      fieldStatus.amount
                        ? "badge-success"
                        : "badge-destructive"
                    }`}
                  >
                    {fieldStatus.amount ? "✓ Done" : "Required"}
                  </Label>
                </div>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  required
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="0.00"
                  className={`h-11 ${
                    fieldStatus.amount
                      ? "focus-visible:ring-success border-success/30"
                      : ""
                  }`}
                />
              </div>

              {/* Currency */}
              <div className="group flex flex-col gap-2">
                <div className="flex justify-between items-center gap-2">
                  <Label htmlFor="currency" className="custom-modal-label">
                    Currency
                  </Label>
                  <Label
                    className={`isfilled-badge ${
                      fieldStatus.currency
                        ? "badge-success"
                        : "badge-destructive"
                    }`}
                  >
                    {fieldStatus.currency ? "✓ Done" : "Required"}
                  </Label>
                </div>
                <Select
                  value={formData.currency}
                  onValueChange={(value) =>
                    handleSelectChange("currency", value ?? "")
                  }
                >
                  <SelectTrigger className="w-full h-11">
                    <SelectValue placeholder="Select Currency..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="CAD">CAD ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Type (Disabled for Income when Goal is selected) */}
              <div className="group flex flex-col gap-2">
                <div className="flex justify-between items-center gap-2">
                  <Label className="custom-modal-label">Type</Label>
                  <Label
                    className={`isfilled-badge ${
                      fieldStatus.type ? "badge-success" : "badge-destructive"
                    }`}
                  >
                    {fieldStatus.type ? "✓ Done" : "Required"}
                  </Label>
                </div>

                <div className="grid grid-cols-2 gap-2 h-11">
                  {(["Expense", "Income"] as const).map((t) => {
                    const isActive = formData.type === t;
                    const isDisabled = hasGoal && t === "Income";

                    return (
                      <button
                        key={t}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => handleSelectChange("type", t)}
                        className={`h-full rounded-md text-sm font-medium transition-colors border ${
                          isActive
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background hover:bg-accent hover:text-accent-foreground border-input"
                        } ${isDisabled ? "opacity-40 cursor-not-allowed hover:bg-background" : ""}`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Date */}
              <div className="group flex flex-col gap-2">
                <div className="flex justify-between items-center gap-2">
                  <Label htmlFor="date" className="custom-modal-label">
                    Date
                  </Label>
                  <Label
                    className={`isfilled-badge ${
                      fieldStatus.date ? "badge-success" : "badge-destructive"
                    }`}
                  >
                    {fieldStatus.date ? "✓ Done" : "Required"}
                  </Label>
                </div>
                <Input
                  id="date"
                  name="date"
                  required
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  className={`h-11 ${
                    fieldStatus.date
                      ? "focus-visible:ring-success border-success/30"
                      : ""
                  }`}
                />
              </div>
            </div>

            {/* Target Selectors: Category, Budget, Goal */}
            <div className="grid grid-cols-3 gap-3">
              {/* Category */}
              <div className="group flex flex-col gap-2">
                <div className="flex justify-between items-center gap-2">
                  <Label className="custom-modal-label">Category</Label>
                  <Label
                    className={`isfilled-badge ${
                      fieldStatus.categoryId
                        ? "badge-success"
                        : "badge-destructive"
                    }`}
                  >
                    {fieldStatus.categoryId ? (
                      <BadgeCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                    ) : (
                      <Asterisk className="w-4 h-4" />
                    )}
                  </Label>
                </div>
                <Select
                  disabled={hasBudget || hasGoal}
                  value={formData.categoryId}
                  onValueChange={(val) =>
                    handleSelectChange("categoryId", val ?? "")
                  }
                >
                  <SelectTrigger className="w-full h-11">
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {transactions?.categories?.map((cat) => (
                      <SelectItem key={cat.id} value={String(cat.id)}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Budget */}
              <div className="group flex flex-col gap-2">
                <div className="flex justify-between items-center gap-2">
                  <Label className="custom-modal-label">Budget</Label>
                  <Label
                    className={`isfilled-badge ${
                      fieldStatus.budgetId
                        ? "badge-success"
                        : "badge-destructive"
                    }`}
                  >
                    {fieldStatus.budgetId ? (
                      <BadgeCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                    ) : (
                      <Asterisk className="w-4 h-4" />
                    )}
                  </Label>
                </div>
                <Select
                  disabled={hasCategory || hasGoal}
                  value={formData.budgetId}
                  onValueChange={(val) => handleSelectChange("budgetId", val ?? "")}
                >
                  <SelectTrigger className="w-full h-11">
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {transactions?.budgets?.map((b) => (
                      <SelectItem key={b.id} value={String(b.id)}>
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Goal */}
              <div className="group flex flex-col gap-2">
                <div className="flex justify-between items-center gap-2">
                  <Label className="custom-modal-label">Goal</Label>
                  <Label
                    className={`isfilled-badge ${
                      fieldStatus.goalId
                        ? "badge-success"
                        : "badge-destructive"
                    }`}
                  >
                    {fieldStatus.goalId ? (
                      <BadgeCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                    ) : (
                      <Asterisk className="w-4 h-4" />
                    )}
                  </Label>
                </div>
                <Select
                  disabled={hasCategory || hasBudget}
                  value={formData.goalId}
                  onValueChange={(val) => handleSelectChange("goalId", val ?? "")}
                >
                  <SelectTrigger className="w-full h-11">
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {transactions?.goals?.map((g) => (
                      <SelectItem key={g.id} value={String(g.id)}>
                        {g.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <Button
                variant="outline"
                type="button"
                className="modal-button h-11"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="modal-button h-11"
              >
                {isSubmitting ? "Saving..." : "Create Transaction"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}