import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { isFilled } from '@/lib/checkIsFilled';
import { X } from 'lucide-react';
import React, { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface OpenModalProps{
  isOpen:boolean
  setIsOpen: (val: boolean) => void
}

export default function GoalsModal({ isOpen, setIsOpen }: OpenModalProps) {
  //const [name, setName] = useState("");
  //const [targetAmount, setTargetAmount] = useState("");
  //const [currentAmount, setCurrentAmount] = useState("");
  //const [currency, setCurrency] = useState("USD");
  //const [status, setStatus] = useState<"active" | "achieved" | "paused">("active");
  //const [targetDate, setTargetDate] = useState("");
  // Define the shape of the form state for TypeScript
  const [isSubmitting, setIsSubmitting] = useState(false);
  type GoalFormData = {
    name: string;
    targetAmount: string;
    currentAmount: string;
    currency: string;
    status: "active" | "achieved" | "paused";
    targetDate: string;
  }

  const [formData, setFormData] = useState<GoalFormData>({
    name: "",
    targetAmount: "",
    currentAmount: "",
    currency: "",
    status: "active",
    targetDate: ""
  })
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fieldStatus = {
    name: isFilled(formData.name, "text"),
    targetAmount: isFilled(formData.targetAmount, "number"),
    currentAmount: isFilled(formData.currentAmount, "number"),
    currency: isFilled(formData.currency, "select"),
    status: isFilled(formData.status, "select"),
    targetDate: isFilled(formData.targetDate, "date")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
  }

  return (
    <>
        <div className="modal-background z-2">
            <div className="background-glow"/>
            <form onSubmit={handleSubmit} className="modal-form">
                <div className="flex items-center justify-between relative">
                    <div className="">
                        <h1 className="form-heading">
                          Create New Goal
                        </h1>
                        <p className="text-sm text-muted-foreground">
                          Define your milestones and track your journey
                        </p>
                    </div>
                    <button
                      onClick={() => setIsOpen(!isOpen)}
                      className="close-modal"
                      aria-label="Close Modal"
                      type="button"
                    >
                      <X/>
                    </button>
                </div>

                <div className="flex flex-col gap-3 mt-5">
                  <div className="group flex flex-col gap-2">
                    <div className="flex justify-between items-center gap-2">
                      <Label
                        htmlFor="name"
                        className="custom-modal-label"
                      >
                        Goal Name
                      </Label>
                      <Label
                        className={`isfilled-badge ${
                          fieldStatus.name
                          ? "badge-success"
                          : "badge-destructive"
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
                      placeholder="e.g. TV"
                      className={`h-11 ${
                        fieldStatus.name ? "focus-visible:ring-success border-success/30" : ""
                      }`}
                    />
                  </div>

                  <div className="flex justify-around gap-2">
                    {/* Target Amount */}
                    <div className="group flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                          <Label
                            htmlFor="targetAmount"
                            className="custom-modal-label"
                          >
                            Target Amount
                          </Label>
                          <Label
                            className={`isfilled-badge ${
                              fieldStatus.targetAmount
                              ? "badge-success"
                              : "badge-destructive"
                            }`}
                          >
                            {fieldStatus.targetAmount ? "✓ Done" : "Required"}
                          </Label>
                        </div>
                        <Input
                        id="targetAmount"
                        name="targetAmount"
                        type="number"
                        value={formData.targetAmount}
                        onChange={handleChange}
                        placeholder=""
                        className={`h-11 ${
                          fieldStatus.targetAmount ? "focus-visible:ring-success border-success/30" : ""
                        }`}
                      />
                    </div>

                    {/* Current Amount */}
                    <div className="group flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                          <Label
                            htmlFor="currentAmount"
                            className="custom-modal-label"
                          >
                            Current Amount
                          </Label>
                          <Label
                            className={`isfilled-badge ${
                              fieldStatus.currentAmount
                              ? "badge-success"
                              : "badge-destructive"
                            }`}
                          >
                            {fieldStatus.currentAmount ? "✓ Done" : "Required"}
                          </Label>
                        </div>
                        <Input
                        id="currentAmount"
                        name="currentAmount"
                        type="number"
                        value={formData.currentAmount}
                        onChange={handleChange}
                        placeholder=""
                        className={`h-11 ${
                          fieldStatus.currentAmount ? "focus-visible:ring-success border-success/30" : ""
                        }`}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between gap-2">
                    {/* Currency */}
                    <div className="group flex flex-col gap-2">
                        <div className="flex justify-between items-center gap-2">
                          <Label
                            htmlFor=""
                            className="custom-modal-label"
                          >
                            Currency
                          </Label>
                          <Label
                            className={`isfilled-badge ${
                              fieldStatus.currency
                              ? "badge-success"
                              : "badge-destructive"
                            }`}
                          >
                            {fieldStatus ? "✓ Done" : "Required"}
                          </Label>
                        </div>
                        <Select
                          id="currency"
                          name="currency"
                          value={formData.currency}
                          onValueChange={(value) => {
                            setFormData((prev) => ({
                              ...prev,
                              currency:value ?? ""
                            }));
                          }}
                        >
                          <SelectTrigger
                          className="w-full"
                          >
                            <SelectValue placeholder="Select Currency..."/>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USD">USD ($)</SelectItem>
                            <SelectItem value="EUR">EUR (€)</SelectItem>
                            <SelectItem value="GBP">GBP (£)</SelectItem>
                            <SelectItem value="CAD">CAD ($)</SelectItem>
                          </SelectContent>
                        </Select>
                    </div>

                    {/* Status */}
                    <div className="group flex flex-col gap-2">
                        <div className="flex justify-between items-center gap-2">
                          <Label
                            htmlFor=""
                            className="custom-modal-label"
                          >
                            Status
                          </Label>
                          <Label
                            className={`isfilled-badge ${
                              fieldStatus.status
                              ? "badge-success"
                              : "badge-destructive"
                            }`}
                          >
                            {fieldStatus ? "✓ Done" : "Required"}
                          </Label>
                        </div>
                        <Select
                          id="currency"
                          name="currency"
                          value={formData.status}
                          onValueChange={(value) => {
                            setFormData((prev) => ({
                              ...prev,
                              status:value as "active" | "achieved" | "paused"
                            }));
                          }}
                        >
                          <SelectTrigger
                          className="w-full"
                          >
                            <SelectValue placeholder="Select Status..."/>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            {/*TODO:  This is for the update logic */}
                            {/*<SelectItem value="achieved">Achieved</SelectItem>
                            <SelectItem value="paused">Paused</SelectItem>*/}
                          </SelectContent>
                        </Select>
                    </div>
                  </div>

                  <div className="group flex flex-col gap-2">
                        <div className="flex justify-between items-center gap-2">
                          <Label
                            htmlFor="targetDate"
                            className="custom-modal-label"
                          >
                            Target Date
                          </Label>
                          <Label
                            className={`isfilled-badge ${
                              fieldStatus.targetDate
                              ? "badge-success"
                              : "badge-destructive"
                            }`}
                          >
                            {fieldStatus.targetDate ? "✓ Done" : "Required"}
                          </Label>
                        </div>
                        <Input
                        id="targetDate"
                        name="targetDate"
                        type="date"
                        value={formData.targetDate}
                        onChange={handleChange}
                        placeholder=""
                        className={`h-11 ${
                          fieldStatus.targetDate ? "focus-visible:ring-success border-success/30" : ""
                        }`}
                      />
                    </div>

                </div>

                <div className="flex gap-3 mt-5">
                  <Button
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
                    {isSubmitting ? "Saving..." : "Create Goal"}
                  </Button>
                </div>
            </form>
        </div>
    </>
  )
}
