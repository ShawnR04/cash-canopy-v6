import { X } from 'lucide-react';
import React, { useState } from 'react'

interface OpenModalProps{
  isOpen:boolean
  setIsOpen: (val: boolean) => void
}

export default function CreateBudgetsModal({ isOpen, setIsOpen }: OpenModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  type BudgetFormData = {
    name: string;
    amount: string;
    currency: string;
    period: string;
    startData: string;
    endDate: string;
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
            </form>
        </div>
    </>
  )
}
