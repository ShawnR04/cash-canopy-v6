import { X } from 'lucide-react';
import React from 'react'

interface OpenModalProps{
  isOpen:boolean
  setIsOpen: (val: boolean) => void
}

export default function GoalsModal({ isOpen, setIsOpen }: OpenModalProps) {
  return (
    <>
        <div className="modal-background z-2">
            <div className="background-glow"/>
            <form action="" className="modal-form">
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
            </form>
        </div>
    </>
  )
}
