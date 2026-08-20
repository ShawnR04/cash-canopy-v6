import React, { useState, useTransition } from "react";
import { CategoryOption } from "./createBudgetsModal";
import { useRouter } from "next/navigation";
import { isFilled } from "@/lib/checkIsFilled";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { updateBudget } from "@/app/actions/budgets";
import { toast } from "@/components/ui/use-toast";

interface OpenModalProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  categoryOption: CategoryOption[];
  budget: Budget;
}

export interface Budget {
  id: number;
  name: string;
  amount: string;
  currency: string;
  period: "Monthly" | "Weekly" | "Yearly" | "Custom";
  startDate: string | Date;
  endDate?: string | Date | null;
  categoryId?: number | string | null;
}

const formatDateForInput = (d?: string | Date | null): string => {
  if (!d) return "";
  const dateObj = typeof d === "string" ? new Date(d) : d;
  return isNaN(dateObj.getTime()) ? "" : dateObj.toISOString().split("T")[0];
};

export default function UpdateBudgetsModal({
  isOpen,
  setIsOpen,
  categoryOption,
  budget,
}: OpenModalProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState({
    name: budget.name || "",
    amount: budget.amount || "",
    currency: budget.currency || "USD",
    period: budget.period || "Monthly",
    startDate: formatDateForInput(budget.startDate),
    endDate: formatDateForInput(budget.endDate),
    categoryId: budget.categoryId ? String(budget.categoryId) : "",
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

  const handleSelectChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const fieldStatus = {
    name: isFilled(formData.name, "text"),
    amount: isFilled(formData.amount, "number"),
    currency: isFilled(formData.currency, "select"),
    period: isFilled(formData.period, "select"),
    startDate: isFilled(formData.startDate, "date"),
    endDate: isFilled(formData.endDate, "date"),
    categoryId: isFilled(formData.categoryId, "select"),
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append("id", String(budget.id));
    data.append("name", formData.name);
    data.append("amount", formData.amount);
    data.append("currency", formData.currency);
    data.append("period", formData.period);
    data.append("startDate", formData.startDate);
    data.append("endDate", formData.endDate);
    data.append("categoryId", formData.categoryId);

    setIsSubmitting(true);

    const result = await updateBudget(data);

    if (result?.success) {
      toast({
        variant: "success",
        title: "Budget Updated",
        description: "Budget updated successfully!",
      });

      setFormData((prev) => ({
        ...prev,
      }));

      setIsOpen(false);
      startTransition(() => {
        router.refresh();
      });
    } else {
      toast({
        variant: "error",
        title: "Update Failed",
        description: result?.error || "Something went wrong.",
      });
    }

    setIsSubmitting(false);
  };

  return (
    <>
      <div className="modal-background z-2">
        <div className="background-glow" />
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="flex items-center justify-between relative">
            <div className="flex items-center max-w-19/20">
              <h1 className="form-heading">
                Update Budget: <span>{formData.name}</span>
              </h1>
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
            {/* Name */}
            <div className="group flex flex-col gap-2">
              <div className="flex justify-between items-center gap-2">
                <Label htmlFor="name" className="custom-modal-label">
                  Budget Name
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
                value={formData.name}
                onChange={handleChange}
                placeholder=""
                className={`h-11 ${
                  fieldStatus.name
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
                      fieldStatus.amount ? "badge-success" : "badge-destructive"
                    }`}
                  >
                    {fieldStatus.amount ? "✓ Done" : "Required"}
                  </Label>
                </div>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder=""
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
                      fieldStatus.currency ? "badge-success" : "badge-destructive"
                    }`}
                  >
                    {fieldStatus.currency ? "✓ Done" : "Required"}
                  </Label>
                </div>
                <Select
                  value={formData.currency}
                  onValueChange={(value) => {
                    setFormData((prev) => ({
                      ...prev,
                      currency: value ?? "",
                    }));
                  }}
                >
                  <SelectTrigger className="w-full">
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

            {/* Category */}
            <div className="group flex flex-col gap-2">
              <div className="flex justify-between items-center gap-2">
                <Label htmlFor="categoryId" className="custom-modal-label">
                  Category
                </Label>
                <Label
                  className={`isfilled-badge ${
                    fieldStatus.categoryId ? "badge-success" : "badge-destructive"
                  }`}
                >
                  {fieldStatus.categoryId ? "✓ Done" : "Required"}
                </Label>
              </div>
              <Select
                value={formData.categoryId}
                onValueChange={(value) => {
                  setFormData((prev) => ({
                    ...prev,
                    categoryId: value ?? "",
                  }));
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Category..." />
                </SelectTrigger>
                <SelectContent>
                  {categoryOption.map((cat) => (
                    <SelectItem key={cat.id} value={String(cat.id)}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Period */}
            <div className="group flex flex-col gap-2">
              <div className="flex justify-between items-center gap-2">
                <Label htmlFor="period" className="custom-modal-label">
                  Period
                </Label>
                <Label
                  className={`isfilled-badge ${
                    fieldStatus.period ? "badge-success" : "badge-destructive"
                  }`}
                >
                  {fieldStatus.period ? "✓ Done" : "Required"}
                </Label>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {(["Monthly", "Weekly", "Yearly", "Custom"] as const).map((p) => {
                  const isActive = formData.period === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => handleSelectChange("period", p)}
                      className={`h-10 rounded-md text-sm font-medium transition-colors border ${
                        isActive
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background hover:bg-accent hover:text-accent-foreground border-input"
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Start Date */}
              <div className="group flex flex-col gap-2">
                <div className="flex justify-between items-center gap-2">
                  <Label htmlFor="startDate" className="custom-modal-label">
                    Start Date
                  </Label>
                  <Label
                    className={`isfilled-badge ${
                      fieldStatus.startDate ? "badge-success" : "badge-destructive"
                    }`}
                  >
                    {fieldStatus.startDate ? "✓ Done" : "Required"}
                  </Label>
                </div>
                <Input
                  id="startDate"
                  name="startDate"
                  required
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  placeholder=""
                  className={`h-11 ${
                    fieldStatus.startDate
                      ? "focus-visible:ring-success border-success/30"
                      : ""
                  }`}
                />
              </div>

              {/* End Date */}
              <div className="group flex flex-col gap-2">
                <div className="flex justify-between items-center gap-2">
                  <Label htmlFor="endDate" className="custom-modal-label">
                    End Date
                  </Label>
                  <Label
                    className={`isfilled-badge ${
                      fieldStatus.endDate ? "badge-success" : "badge-destructive"
                    }`}
                  >
                    {fieldStatus.endDate ? "✓ Done" : "Required"}
                  </Label>
                </div>
                <Input
                  id="endDate"
                  name="endDate"
                  required
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange}
                  placeholder=""
                  className={`h-11 ${
                    fieldStatus.endDate
                      ? "focus-visible:ring-success border-success/30"
                      : ""
                  }`}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <Button
                variant="outline"
                type="button"
                className="modal-button h-11"
                onClick={() => setIsOpen(!isOpen)}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting || isPending}
                className="modal-button h-11"
              >
                {isSubmitting ? "Saving..." : "Update Budget"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}