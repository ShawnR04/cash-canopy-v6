
import { Users } from 'lucide-react';
import React from 'react'

export default function AccountSwitcher() {
  return (
    <div className="relative w-full">
        <button 
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-lg  border border-primary px-3 py-2 text-sm font-medium text-primary hover:bg-primary/10 transition-colors duration-200"
        >
            <Users className="size-4"/>
            Switch Account
        </button>
    </div>
  )
}
