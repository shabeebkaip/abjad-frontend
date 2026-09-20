// Shared inline field-validation message. Used under a single input for a
// specific field's error — for form-level states (locked, suspended, rate
// limited) use `StatusBanner` instead (components/ui/status-banner.tsx).
export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-destructive mt-1">{message}</p>;
}
