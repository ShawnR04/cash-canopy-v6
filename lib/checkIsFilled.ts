export function isFilled(value: unknown, type: string): boolean {
  // 1. Guard against null or undefined
  if (value === null || value === undefined) {
    return false;
  }

  // 2. Safely convert to string (handles numbers, dates, or non-string values)
  const stringValue = String(value);
  const trimmed = stringValue.trim();

  // Handling date input
  if (type === "date") {
    return trimmed !== "" && !isNaN(Date.parse(trimmed));
  }

  // Handling number input
  if (type === "number") {
    if (trimmed === "") return false;
    return !isNaN(Number(trimmed));
  }

  return trimmed !== "";
}