import Link from "next/link";
import { AlertCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export type StatusBannerVariant = "error" | "warning";

interface StatusBannerProps {
  variant: StatusBannerVariant;
  // Rendered verbatim — server messages already contain computed details
  // (remaining minutes, attempts remaining) that must not be rewritten.
  message: string;
  action?: { label: string; href: string };
  className?: string;
}

// Two variants only, by design (see DESIGN_SPEC §3.4) — not a generic toast
// system. error = wrong credentials/validation. warning = locked/suspended/
// rate-limited states that need to visually read as "wait", not "you typo'd".
export function StatusBanner({ variant, message, action, className }: StatusBannerProps) {
  const Icon = variant === "warning" ? Clock : AlertCircle;
  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-2 rounded-xl border px-3 py-2.5 text-sm",
        variant === "warning"
          ? "bg-amber-50 border-amber-200 text-amber-800"
          : "bg-destructive/5 border-destructive/20 text-destructive",
        className
      )}
    >
      <Icon
        size={16}
        className={cn("shrink-0 mt-0.5", variant === "warning" ? "text-amber-600" : "text-destructive")}
      />
      <div className="flex-1 min-w-0">
        <p>{message}</p>
        {action && (
          <Link href={action.href} className="inline-block mt-1 text-xs font-semibold underline underline-offset-2">
            {action.label}
          </Link>
        )}
      </div>
    </div>
  );
}
