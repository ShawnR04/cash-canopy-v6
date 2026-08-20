"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isFilled } from "@/lib/checkIsFilled";
import { Asterisk, BadgeCheck, Loader2, Trash2, X } from "lucide-react";
import { useState, useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { deleteGoal, updateGoal } from "@/app/actions/goals";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

interface OpenModalProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  goal: Goal;
}

export interface Goal {
  id: number;
  name: string;
  targetAmount: string;
  currentAmount: string;
  currency: string;
  status: "active" | "achieved" | "paused" | string;
  targetDate: string | Date;
}

export default function UpdateGoalsModal({
  isOpen,
  setIsOpen,
  goal,
}: OpenModalProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isDeleting, setIsDeleting] = useState(false);

  const currentAmount = parseFloat(goal.currentAmount) || 0;

  const [formData, setFormData] = useState({
    name: goal.name,
    targetAmount: goal.targetAmount,
    addAmount: "0",
    currentAmount: goal.currentAmount,
    currency: goal.currency,
    status: goal.status,
    targetDate: goal.targetDate,
  });

  const formatDateForInput = (
    dateVal: Date | string | undefined | null
  ): string => {
    if (!dateVal) return "";
    const dateObj = typeof dateVal === "string" ? new Date(dateVal) : dateVal;
    return !isNaN(dateObj.getTime())
      ? dateObj.toISOString().split("T")[0]
      : "";
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fieldStatus = {
    name: isFilled(formData.name, "text"),
    targetAmount: isFilled(formData.targetAmount, "number"),
    addAmount: isFilled(formData.addAmount, "number"),
    currentAmount: isFilled(formData.currentAmount, "number"),
    currency: isFilled(formData.currency, "select"),
    status: isFilled(formData.status, "select"),
    targetDate: isFilled(formData.targetDate, "date"),
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const baseCurrent = parseFloat(formData.currentAmount) || 0;
    const addedVal = parseFloat(formData.addAmount) || 0;
    const finalCurrentAmount = (baseCurrent + addedVal).toString();

    const formattedTargetDate =
      formData.targetDate instanceof Date
        ? formData.targetDate.toISOString().split("T")[0]
        : String(formData.targetDate || "");

    const data = new FormData();
    data.append("id", String(goal.id));
    data.append("name", formData.name);
    data.append("targetAmount", formData.targetAmount);
    data.append("currentAmount", finalCurrentAmount);
    data.append("currency", formData.currency);
    data.append("status", formData.status);
    data.append("targetDate", formattedTargetDate);

    setIsSubmitting(true);

    const result = await updateGoal(data);

    if (result?.success) {
      toast({
        variant: "success",
        title: "Goal Updated",
        description: "Goal updated successfully!",
      });
      setFormData((prev) => ({
        ...prev,
        currentAmount: finalCurrentAmount,
        addAmount: "",
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

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const deleteFormData = new FormData();
    deleteFormData.append("id", String(goal.id));
    setIsDeleting(true);

    const result = await deleteGoal(deleteFormData);
    if (result?.success) {
      toast({
        variant: "success",
        title: "Goal Deleted",
        description: `${goal.name} deleted successfully!`,
      });
      setIsOpen(false);
      setIsDeleting(false);
      startTransition(() => {
        router.refresh();
      });
    } else {
      toast({
        variant: "error",
        title: "Deletion Failed",
        description: result?.error || "Something went wrong.",
      });
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-background">
      <div className="background-glow" />
      <form onSubmit={handleSubmit} className="modal-form">
        <div className="flex items-center justify-between relative">
          <div className="flex items-center max-w-19/20">
            <h1 className="form-heading">
              Update Goal: <span className="capitalize">{goal.name}</span>
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
          <div className="group flex flex-col gap-2">
            <div className="flex justify-between items-center gap-2">
              <Label htmlFor="name" className="custom-modal-label">
                Goal Name
              </Label>
              <Label
                className={`isfilled-badge ${
                  fieldStatus.name ? "badge-success" : "badge-destructive"
                }`}
              >
                {fieldStatus.name ? (
                  <BadgeCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                ) : (
                  <Asterisk className="w-4 h-4" />
                )}
              </Label>
            </div>
            <Input
              id="name"
              name="name"
              required
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. TV"
              className={`h-11 ${
                fieldStatus.name
                  ? "focus-visible:ring-success border-success/30"
                  : ""
              }`}
            />
          </div>

          <div className="grid grid-cols-1 gap-3">
            {/* Target Amount */}
            <div className="group flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="targetAmount" className="custom-modal-label">
                  Target Amount
                </Label>
                <Label
                  className={`isfilled-badge ${
                    fieldStatus.targetAmount
                      ? "badge-success"
                      : "badge-destructive"
                  }`}
                >
                  {fieldStatus.targetAmount ? (
                    <BadgeCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                  ) : (
                    <Asterisk className="w-4 h-4" />
                  )}
                </Label>
              </div>
              <Input
                id="targetAmount"
                name="targetAmount"
                required
                type="number"
                value={formData.targetAmount}
                onChange={handleChange}
                placeholder=""
                className={`h-11 ${
                  fieldStatus.targetAmount
                    ? "focus-visible:ring-success border-success/30"
                    : ""
                }`}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
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
                  {fieldStatus.currency ? (
                    <BadgeCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                  ) : (
                    <Asterisk className="w-4 h-4" />
                  )}
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

            {/* Target Date */}
            <div className="group flex flex-col gap-2">
              <div className="flex justify-between items-center gap-2">
                <Label htmlFor="targetDate" className="custom-modal-label">
                  Target Date
                </Label>
                <Label
                  className={`isfilled-badge ${
                    fieldStatus.targetDate
                      ? "badge-success"
                      : "badge-destructive"
                  }`}
                >
                  {fieldStatus.targetDate ? (
                    <BadgeCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                  ) : (
                    <Asterisk className="w-4 h-4" />
                  )}
                </Label>
              </div>
              <Input
                id="targetDate"
                name="targetDate"
                required
                type="date"
                value={formatDateForInput(formData.targetDate)}
                onChange={handleChange}
                placeholder=""
                className={`h-11 ${
                  fieldStatus.targetDate
                    ? "focus-visible:ring-success border-success/30"
                    : ""
                }`}
              />
            </div>
          </div>
        </div>

        {/* Metadata & Delete */}
        <div className="flex items-center justify-between gap-3 px-0.5 mt-3">
          <p className="text-sm text-muted-foreground">
            Current Savings:{" "}
            <span className="font-bold text-primary">
              ${currentAmount.toFixed(2)}
            </span>
          </p>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isSubmitting || isDeleting || isPending}
            className="bg-destructive/10 rounded-md text-destructive border border-destructive/20 hover:bg-destructive/20 h-9 px-3 flex items-center justify-center transition-colors disabled:opacity-50"
          >
            {isDeleting ? (
              <Loader2 className="animate-spin h-4 w-4" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </button>
        </div>

        <div className="flex gap-3 mt-5">
          <Button
            variant="outline"
            className="modal-button h-11"
            onClick={() => setIsOpen(!isOpen)}
            type="button"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting || isDeleting || isPending}
            className="modal-button h-11"
          >
            {isSubmitting ? "Updating..." : "Update Goal"}
          </Button>
        </div>
      </form>
    </div>
  );
}