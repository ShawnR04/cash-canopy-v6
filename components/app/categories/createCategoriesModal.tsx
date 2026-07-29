import { User, X } from 'lucide-react';
import React, { useState } from 'react'
import * as LucideIcons from "lucide-react";
import type { LucideIcon } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { isFilled } from '@/lib/checkIsFilled';
import { Button } from '@/components/ui/button';
import { createCategory } from '@/app/actions/categories';
import { toast } from 'sonner';

interface OpenModalProps{
  isOpen:boolean
  setIsOpen: (val: boolean) => void
}

// Pre-defined list of common icons
const FEATURED_ICONS = [
  "Folder",
  "ShoppingBag",
  "ShoppingCart",
  "CreditCard",
  "DollarSign",
  "Utensils",
  "Home",
  "Car",
  "HeartPulse",
  "Plane",
  "Briefcase",
  "Gift",
  "Film",
  "Smile",
] as const;

// Preset category color palette
const PRESET_COLORS = [
  "#3b82f6", // Blue
  "#10b981", // Emerald
  "#8b5cf6", // Purple
  "#f59e0b", // Amber
  "#ef4444", // Red
  "#ec4899", // Pink
  "#06b6d4", // Cyan
  "#84cc16", // Lime
  "#6366f1", // Indigo
  "#f97316", // Orange

];

// Dynamic Icon renderer
function DynamicIcon({
  name,
  className = "w-5 h-5",
}: {
  name: string;
  className?: string;
}) {
  const formattedName = name
    .trim()
    .replace(/(^\w|-\w)/g, (match) => match.replace("-","").toUpperCase())

  //const IconComponent = (LucideIcons as Record<string, any>)[formattedName];
  const IconComponent = (LucideIcons as unknown as Record<string, LucideIcon>)[formattedName];

  if(!IconComponent){
    return <LucideIcons.HelpCircle className={`${className} opacity-50`} />
  }

  return <IconComponent className={className}/>
}

export default function CreateCategoriesModal({ isOpen, setIsOpen }: OpenModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  type CategoryFormData = {
    name: string;
    icon: string;
    color: string;
  }

  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    icon: "",
    color: "#3b82f6"
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Filter icons based on what user types into formData.icon
  const searchTerm = formData.icon.trim().toLowerCase();
  const filteredIcons = FEATURED_ICONS.filter((iconName) =>
    iconName.toLowerCase().includes(searchTerm)
  );

  const fieldStatus = {
    name: isFilled(formData.name, "text"),
    icon: isFilled(formData.icon, "text"),
    color: isFilled(formData.color, "text"),
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try{
      await createCategory({
        name: formData.name,
        icon: formData.icon,
        color: formData.color,
        userId: "",
      });

      toast.success("Category created successfully")
      setIsOpen(false);
    }catch(error){
      toast.error("Error creating category. Make sure you are logged in!")
    }finally{
      setIsSubmitting(false)
    }
  }
  return (
    <>
        <div className="modal-background z-2">
            <div className="background-glow"/>
            <form onSubmit={handleSubmit} className="modal-form">
                <div className="flex items-center justify-between relative px-5">
                    <h1 className="form-heading">
                      Create Category
                    </h1>
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
                          Category Name
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
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Groceries"
                      className={`h-11 ${
                        fieldStatus.name ? "focus-visible:ring-success border-success/30" : ""
                      }`}
                    />
                  </div>

                  {/* --- ICON SELECTION & CUSTOM INPUT --- */}
                  <div className="group flex flex-col gap-2">
                      <div className="flex justify-between items-center gap-2">
                        <Label
                          htmlFor="icon"
                          className="custom-modal-label"
                        >
                          Icon
                        </Label>
                        <Label
                          className={`isfilled-badge ${
                            fieldStatus.icon
                            ? "badge-success"
                            : "badge-destructive"
                          }`}
                        >
                          {fieldStatus.icon ? "✓ Done" : "Required"}
                        </Label>
                      </div>
                      <div className="relative ">
                        <Input
                          id="icon"
                          name="icon"
                          type="text"
                          required
                          value={formData.icon}
                          onChange={handleChange}
                          placeholder="Type to search icon (e.g. ShoppingCart)..."
                          className={`h-11 pl-12 ${
                            fieldStatus.icon ? "focus-visible:ring-success border-success/30" : ""
                          }`}
                        />

                        <div className="absolute w-7 h-7 flex items-center justify-center left-3 top-2 rounded-md" style={{ backgroundColor: formData.color }}>
                          <DynamicIcon name={formData.icon} className="w-4 h-4"/>
                        </div>
                      </div>

                      <p className="text-[13px] text-muted-foreground my-2">
                        {filteredIcons.length > 0 
                          ? "Select a suggested icon below or type any custom Lucide icon name:" 
                          : "No suggestions match your search. You can still type any valid Lucide icon name!"
                        }
                      </p>
                        
                      {filteredIcons.length > 0 && (
                        <div className="grid grid-cols-7 gap-1.5 p-2 border border-border rounded-xl max-h-32 overflow-y-auto">
                          {filteredIcons.map((iconName) => {
                            const isSelected = formData.icon.toLowerCase() === iconName.toLowerCase();
                            return(
                              <button 
                                key={iconName} 
                                type="button"
                                title={iconName}
                                onClick={() =>
                                  handleChange({
                                    target: { name: "icon", value: iconName },
                                  } as React.ChangeEvent<HTMLInputElement>)
                                }
                                className={`p-2 flex items-center justify-center rounded-lg transition-all ${
                                  isSelected
                                    ? "bg-secondary shadow-sm"
                                    : "hover:bg-secondary/60"
                                }`}
                              >
                                <DynamicIcon name={iconName} className="w-4 h-4"/>
                              </button>
                            );
                          })}
                        </div>
                      )}
                  </div>

                  {/* --- COLOR SELECTION --- */}
                  <div className="group flex flex-col gap-2">
                    <div className="flex justify-between items-center gap-2">
                      <Label
                        htmlFor="color"
                        className="custom-modal-label"
                      >
                        Color Palette
                      </Label>
                      <Label
                        className={`isfilled-badge ${
                          fieldStatus.color
                          ? "badge-success"
                          : "badge-destructive"
                        }`}
                      >
                        {fieldStatus.color ? "✓ Done" : "Required"}
                      </Label>
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Swatches */}
                      <div className="grid grid-cols-5 gap-2 mb-3">
                        {PRESET_COLORS.map((presetColor) => {
                          const isSelected =formData.color.toLowerCase() === presetColor.toLowerCase();
                          return(
                            <button 
                              key={presetColor} 
                              type="button"
                              onClick={() =>
                                    handleChange({
                                      target: { name: "color", value: presetColor },
                                    } as React.ChangeEvent<HTMLInputElement>)
                                  }
                              className={`h-7 w-7 rounded-full flex items-center justify-center ${
                                isSelected
                                  ? "ring-2 ring-offset-1 scale-105 shadow-sm"
                                  : "hover:scale-105 opacity-90 hover:opacity-100"
                              }`}
                              style={{ backgroundColor: presetColor }}
                              title={presetColor}
                            >
                              {isSelected && (
                                <LucideIcons.Check className="w-4 h-4 drop-shadow" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                      
                      {/* Hex Input */}
                      <div className="w-1/2 flex items-center gap-3 mt-2">
                        <div className="relative w-11 h-11 shrink-0 overflow-hidden rounded-xl border border-border shadow-sm">
                          <input 
                            name="color"
                            type="color" 
                            value={formData.color}
                            onChange={handleChange}
                            className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer border-0 p-0"                          />
                        </div>

                        <div className="flex-1">
                          <Input 
                            name="color"
                            type="text" 
                            value={formData.color}
                            onChange={handleChange}
                            placeholder="#0000"
                          />
                        </div>
                      </div>
                    </div>
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
                    {isSubmitting ? "Saving..." : "Create Category"}
                  </Button>
                </div>
            </form>
        </div>
    </>
  )
}
