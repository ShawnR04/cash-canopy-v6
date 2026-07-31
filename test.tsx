import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { isFilled } from '@/lib/checkIsFilled';
import { Cat, X } from 'lucide-react';
import React, { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button';

interface OpenModalProps{
  isOpen:boolean
  setIsOpen: (val: boolean) => void
  categoryOption: CategoryOption[]
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
    period: string;
    startDate: "Monthly" | "Weekly" | "Yearly" | "Custom";
    endDate: string;
    categoryId: string;
  }

  const [formData, setFormData] = useState<BudgetFormData>({
    name: "",
    amount: "",
    currency: "",
    period: "",
    startDate: "Monthly",
    endDate: "",
    categoryId: ""
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
    amount: isFilled(formData.amount, "number"),
    currency: isFilled(formData.currency, "select"),
    period: isFilled(formData.period, "select"),
    startDate: isFilled(formData.startDate, "date"),
    endDate: isFilled(formData.endDate, "date"),
    categoryId: isFilled(formData.categoryId, "select"),

  }
  return (
    <>
        <div className="modal-background z-2">
            <div className="background-glow"/>
            <form action="" className="modal-form">
                <div className="flex items-center justify-between relative">
                    <div className="">
                        <h1 className="form-heading">
                          Create New Budget
                        </h1>
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
                      <X/>
                    </button>
                </div>

                {/* Live Preview */}
                <div className=""></div>

                <div className="flex flex-col gap-3 mt-5">
                  <div className="group flex flex-col gap-2">
                      <div className="flex justify-between items-center gap-2">
                        <Label
                          htmlFor=""
                          className="custom-modal-label"
                        >
                          Budget Name
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
                      placeholder=""
                      className={`h-11 ${
                        fieldStatus.name ? "focus-visible:ring-success border-success/30" : ""
                      }`}
                    />
                  </div>

                  <div className="flex justify-between gap-2">
                    <div className="group flex flex-col gap-2">
                        <div className="flex justify-between items-center gap-2">
                          <Label
                            htmlFor=""
                            className="custom-modal-label"
                          >
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
                        value={formData.amount}
                        onChange={handleChange}
                        placeholder=""
                        className={`h-11 ${
                          fieldStatus.amount ? "focus-visible:ring-success border-success/30" : ""
                        }`}
                      />
                    </div>

                    {/* Category */}
                    <div className="group flex flex-col gap-2">
                        <div className="flex justify-between items-center gap-2">
                          <Label
                            htmlFor=""
                            className="custom-modal-label"
                          >
                            Category
                          </Label>
                          <Label
                            className={`isfilled-badge ${
                              fieldStatus.categoryId
                              ? "badge-success"
                              : "badge-destructive"
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
                              categoryId:value ?? ""
                            }));
                          }}
                        >
                          <SelectTrigger
                          className="w-full"
                          >
                            <SelectValue placeholder="Select Currency..."/>
                          </SelectTrigger>
                          <SelectContent>
                            {categoryOption.map((cat) => (
                              <SelectItem key={cat.id} value={String(cat.name)}>
                                {cat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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

                    {/* Period */}
                    <div className="group flex flex-col gap-2">
                        <div className="flex justify-between items-center gap-2">
                          <Label
                            htmlFor=""
                            className="custom-modal-label"
                          >
                            Period
                          </Label>
                          <Label
                            className={`isfilled-badge ${
                              fieldStatus.period
                              ? "badge-success"
                              : "badge-destructive"
                            }`}
                          >
                            {fieldStatus.period ? "✓ Done" : "Required"}
                          </Label>
                        </div>
                        <Select
                          id="period"
                          name="period"
                          required
                          value={formData.period}
                          onValueChange={(value) => {
                            setFormData((prev) => ({
                              ...prev,
                              period:value ?? ""
                            }));
                          }}
                        >
                          <SelectTrigger
                          className="w-full"
                          >
                            <SelectValue placeholder="Select Time Period..."/>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Weekly">Weekly</SelectItem>
                            <SelectItem value="Montly">Monthly</SelectItem>
                            <SelectItem value="Yearly">Yearly</SelectItem>
                            <SelectItem value="Custom">Custom</SelectItem>
                          </SelectContent>
                        </Select>
                    </div>
                  </div>

                  <div className="flex justify-between gap-2">
                    {/* StartDate */}
                    <div className="group flex flex-col gap-2">
                        <div className="flex justify-between items-center gap-2">
                          <Label
                            htmlFor="targetDate"
                            className="custom-modal-label"
                          >
                            Start Date
                          </Label>
                          <Label
                            className={`isfilled-badge ${
                              fieldStatus.startDate
                              ? "badge-success"
                              : "badge-destructive"
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
                          <Label
                            htmlFor="endDate"
                            className="custom-modal-label"
                          >
                            End Date
                          </Label>
                          <Label
                            className={`isfilled-badge ${
                              fieldStatus.endDate
                              ? "badge-success"
                              : "badge-destructive"
                            }`}
                          >
                            {fieldStatus.endDate ? "✓ Done" : "Required"}
                          </Label>
                        </div>
                        <Input
                        id="targetDate"
                        name="targetDate"
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
  )
}
