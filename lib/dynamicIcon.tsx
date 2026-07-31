import * as LucideIcons from "lucide-react";
import { type LucideIcon } from "lucide-react";

interface DynamicIconProps {
  // Allow string, null, or undefined to match DB/API types
  name?: string | null;
  className?: string;
}

// Dynamic Icon renderer
export function DynamicIcon({ name, className = "w-5 h-5" }: DynamicIconProps) {
  // Return fallback if name is null, undefined, or empty string
  if (!name || typeof name !== "string") {
    return <LucideIcons.HelpCircle className={`${className} opacity-50`} />;
  }

  // Format kebab-case or lower case to PascalCase (e.g., "shopping-bag" -> "ShoppingBag")
  const formattedName = name
    .trim()
    .replace(/(^\w|-\w)/g, (match) => match.replace("-", "").toUpperCase());

  const IconComponent = (LucideIcons as unknown as Record<string, LucideIcon>)[
    formattedName
  ];

  if (!IconComponent) {
    return <LucideIcons.HelpCircle className={`${className} opacity-50`} />;
  }

  return <IconComponent className={className} />;
}