
import { Download } from 'lucide-react';
import React from 'react'

export default function ExportData() {
  return (
    <>
        <button 
            type="button"
            aria-label="Export Data"
            className="flex gap-2 bg-primary hover:bg-secondary hover:scale-105 p-2 rounded-md font-semibold transition-all duration-300 cursor-pointer shadow-sm outline-none"
        >
            <Download className="w-6 h-6"/>
            Export Data
        </button>
    </>
  )
}
