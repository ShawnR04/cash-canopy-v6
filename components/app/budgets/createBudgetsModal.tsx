import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { isFilled } from '@/lib/checkIsFilled';
import { X } from 'lucide-react';
import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { createBudget } from '@/app/actions/budgets';
import { toast } from 'sonner';

interface OpenModalProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  categoryOption: CategoryOption[];
}

export interface CategoryOption {
  id: number;
  name: string;
  icon: string;
  color: string;
}

export default function CreateBudgetsModal({ isOpen, setIsOpen, categoryOption }: OpenModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  type BudgetFormData = {
    name: string;
    amount: string;
    currency: string;
    period: "Monthly" | "Weekly" | "Yearly" | "Custom";
    startDate: string;
    endDate: string;
    categoryId: string;
  };

  const [formData, setFormData] = useState<BudgetFormData>({
    name: "",
    amount: "",
    currency: "",
    period: "Monthly",
    startDate: "",
    endDate: "",
    categoryId: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (field: keyof BudgetFormData, value: string) => {
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
    setIsSubmitting(true);

    try {
      // Build native FormData matching the server action expects
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("amount", formData.amount);
      payload.append("currency", formData.currency || "USD");
      payload.append("period", formData.period);
      payload.append("startDate", formData.startDate);
      payload.append("endDate", formData.endDate || "");
      payload.append("categoryId", formData.categoryId || "");

      const result = await createBudget(payload);

      if (result.success) {
        toast.success("Budget created successfully");
        setIsOpen(false);
      } else {
        toast.error(result.error || "Failed to create budget");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error creating budget. Make sure you are logged in");
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
              <h1 className="form-heading">Create New Budget</h1>
              <p className="text-sm text-muted-foreground">
                Establish your financial milestones and monitor your progress.
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
            <div className="grid grid-cols-2 gap-3">
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
                    fieldStatus.name ? "focus-visible:ring-success border-success/30" : ""
                  }`}
                />
              </div>

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
                    fieldStatus.amount ? "focus-visible:ring-success border-success/30" : ""
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
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
                  id="categoryId"
                  name="categoryId"
                  required
                  value={formData.categoryId}
                  onValueChange={(value) => {
                    setFormData((prev) => ({
                      ...prev,
                      categoryId: value ?? ""
                    }));
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Currency..." />
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
                  id="currency"
                  name="currency"
                  required
                  value={formData.currency}
                  onValueChange={(value) => {
                    setFormData((prev) => ({
                      ...prev,
                      currency: value ?? ""
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
              {/* StartDate */}
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
                    fieldStatus.startDate ? "focus-visible:ring-success border-success/30" : ""
                  }`}
                />
              </div>

              {/* EndDate */}
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
                    fieldStatus.endDate ? "focus-visible:ring-success border-success/30" : ""
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
                disabled={isSubmitting}
                className="modal-button h-11"
              >
                {isSubmitting ? "Saving..." : "Create Budget"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}