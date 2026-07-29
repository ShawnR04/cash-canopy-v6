import * as LucideIcons from "lucide-react";
import { type LucideIcon } from "lucide-react";

interface DynamicIconProps {
  name: string;
  className?: string;
}

// Dynamic Icon renderer
export function DynamicIcon({ name, className = "w-5 h-5" }: DynamicIconProps) {
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