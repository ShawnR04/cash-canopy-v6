import React from "react";
import { DynamicIcon } from "@/lib/dynamicIcon";

interface Category {
  id?: string | number;
  name: string;
  icon: string;
  color: string;
  itemCount?: number; // Optional metadata like "12 items" or "5 transactions"
}

export default function CategoriesCardItem({ category }: { category?: Category }) {
  // Safety guard against undefined category
  if (!category) return null;

  const { name, icon, color, itemCount } = category;

  return (
    <div className="group relative flex items-center justify-between p-4 rounded-2xl border border-border/60 bg-card hover:bg-accent/40 transition-all duration-200 hover:shadow-md cursor-pointer">
      <div className="flex items-center gap-3.5">
        {/* Color-tinted icon container */}
        <div
          className="flex items-center justify-center w-11 h-11 rounded-xl shadow-xs transition-transform group-hover:scale-105 shrink-0"
          style={{
            backgroundColor: `${color}15`, // Adds 15% opacity tint for light background
            color: color,                 // Applies full color to the icon
          }}
        >
          <DynamicIcon name={icon} className="w-5 h-5" />
        </div>

        {/* Category Details */}
        <div className="flex flex-col gap-0.5">
          <h3 className="font-semibold text-foreground text-base tracking-tight group-hover:text-primary transition-colors">
            {name}
          </h3>
          {itemCount !== undefined && (
            <p className="text-xs text-muted-foreground">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </p>
          )}
        </div>
      </div>

      {/* Accent pill indicator on hover */}
      <div 
        className="w-1.5 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{ backgroundColor: color }}
      />
    </div>
  );
}

///////////////////////////////////////////////////////////

"use client" 

import React from "react";
import { DynamicIcon } from "@/lib/dynamicIcon";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Category {
  id?: string | number;
  name: string;
  icon: string;
  color: string;
  itemCount?: number;
}

export default function CategoriesCardItem({ category }: { category?: Category }) {
  if (!category) return null;

  const { name, icon, color, itemCount } = category;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-card to-card/50 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-border/80">
      {/* Background Soft Glow Effect */}
      <div
        className="absolute -top-12 -right-12 h-32 w-32 rounded-full blur-3xl transition-opacity duration-300 opacity-20 group-hover:opacity-40"
        style={{ backgroundColor: color }}
      />

      <div className="relative z-10 flex flex-col justify-between h-full gap-4">
        {/* Header Row: Icon Badge + More Options Button */}
        <div className="flex items-center justify-between">
          <div
            className="flex items-center justify-center w-12 h-12 rounded-2xl shadow-sm ring-1 ring-black/5 dark:ring-white/10"
            style={{
              backgroundColor: color,
              color: "#ffffff",
            }}
          >
            <DynamicIcon name={icon} className="w-6 h-6 stroke-[2.2]" />
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              // Add menu handling logic here
            }}
          >
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>

        {/* Footer Row: Label & Count */}
        <div className="flex flex-col gap-0.5 mt-2">
          <h3 className="font-bold text-foreground text-lg tracking-tight">
            {name}
          </h3>
          <p className="text-xs font-medium text-muted-foreground/80">
            {itemCount !== undefined ? `${itemCount} items` : "Active category"}
          </p>
        </div>
      </div>
    </div>
  );
}