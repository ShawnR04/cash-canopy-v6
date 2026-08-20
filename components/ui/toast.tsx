"use client";

import * as React from "react";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";
import { useToast, ToastItem } from "./use-toast";

export interface ToasterProps {
  defaultDuration?: number;
  position?: "top-right" | "bottom-right" | "top-center" | "bottom-center" | "top-left" | "bottom-left";
}

const variantStyles: Record<
  string,
  { bg: string; border: string; text: string; progress: string; icon: React.ElementType | null }
> = {
  default: {
    bg: "bg-card",
    border: "border-border",
    text: "text-card-foreground",
    progress: "bg-foreground/20",
    icon: null,
  },
  success: {
    bg: "bg-success/10",
    border: "border-success/40",
    text: "text-success",
    progress: "bg-success",
    icon: CheckCircle2,
  },
  error: {
    bg: "bg-destructive/10",
    border: "border-destructive/30",
    text: "text-destructive",
    progress: "bg-destructive",
    icon: AlertCircle,
  },
  warning: {
    bg: "bg-warning/10",
    border: "border-warning/40",
    text: "text-warning",
    progress: "bg-warning",
    icon: AlertTriangle,
  },
  info: {
    bg: "bg-accent",
    border: "border-primary/30",
    text: "text-accent-foreground",
    progress: "bg-primary",
    icon: Info,
  },
};

export function Toaster({ defaultDuration = 4000, position = "top-center" }: ToasterProps) {
  const { toasts, dismiss } = useToast();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const positionClasses = {
    "top-right": "top-4 right-4 items-end",
    "top-left": "top-4 left-4 items-start",
    "bottom-right": "bottom-4 right-4 items-end",
    "bottom-left": "bottom-4 left-4 items-start",
    "top-center": "top-4 left-1/2 -translate-x-1/2 items-center",
    "bottom-center": "bottom-4 left-1/2 -translate-x-1/2 items-center",
  }[position];

  return (
    <div className={`fixed z-50 pointer-events-none flex flex-col gap-2 p-4 w-full max-w-sm ${positionClasses}`}>
      {toasts.map((item) => (
        <ToastElement
          key={item.id}
          toast={item}
          defaultDuration={defaultDuration}
          onDismiss={() => dismiss(item.id)}
        />
      ))}
    </div>
  );
}

function ToastElement({
  toast,
  defaultDuration,
  onDismiss,
}: {
  toast: ToastItem;
  defaultDuration: number;
  onDismiss: () => void;
}) {
  const duration = toast.duration ?? defaultDuration;

  React.useEffect(() => {
    if (duration <= 0) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onDismiss]);

  const variant = toast.variant || "default";
  const defaultStyle = variantStyles[variant] || variantStyles.default;
  const IconComponent = defaultStyle.icon;

  const customInlineStyle: React.CSSProperties = {};
  if (toast.customColor?.bg) customInlineStyle.backgroundColor = toast.customColor.bg;
  if (toast.customColor?.border) customInlineStyle.borderColor = toast.customColor.border;
  if (toast.customColor?.text) customInlineStyle.color = toast.customColor.text;

  const userHasBg = Boolean(toast.customColor?.bg || toast.className?.match(/(?:^|\s)bg-/));
  const userHasBorder = Boolean(toast.customColor?.border || toast.className?.match(/(?:^|\s)border-/));
  const userHasText = Boolean(toast.customColor?.text || toast.className?.match(/(?:^|\s)text-/));

  return (
    <div
      style={customInlineStyle}
      className={`pointer-events-auto relative overflow-hidden flex items-start gap-3 w-full p-4 rounded-xl border shadow-lg transition-all duration-200 backdrop-blur-md ${
        !userHasBg ? defaultStyle.bg : ""
      } ${!userHasBorder ? defaultStyle.border : ""} ${
        !userHasText ? defaultStyle.text : ""
      } ${toast.className || ""}`}
    >
      {IconComponent && (
        <IconComponent
          className="w-5 h-5 mt-0.5 shrink-0"
          style={{ color: toast.customColor?.icon }}
        />
      )}

      <div className="flex-1 text-sm space-y-1">
        {toast.title && <div className="font-semibold leading-tight">{toast.title}</div>}
        {toast.description && (
          <div className="opacity-90 leading-relaxed text-xs">
            {toast.description}
          </div>
        )}
        {toast.action && <div className="pt-1">{toast.action}</div>}
      </div>

      <button
        onClick={onDismiss}
        className="p-1 rounded-md opacity-70 hover:opacity-100 hover:bg-foreground/10 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>

      {duration > 0 && (
        <div
          className={`absolute bottom-0 left-0 right-0 h-1 origin-left ${
            !toast.customColor?.progress ? defaultStyle.progress : ""
          }`}
          style={{
            backgroundColor: toast.customColor?.progress,
            animation: `toast-progress ${duration}ms linear forwards`,
          }}
        />
      )}
    </div>
  );
}