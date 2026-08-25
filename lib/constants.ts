export const TODO_CATEGORIES = [
  { value: "NURSERY", label: "保育園" },
  { value: "MEDICAL", label: "病院" },
  { value: "SHOPPING", label: "買い物" },
  { value: "HOUSEWORK", label: "家事" },
  { value: "OTHER", label: "その他" },
] as const;

export const NURSERY_TYPES = [
  { value: "EVENT", label: "行事" },
  { value: "SUBMISSION", label: "提出物" },
  { value: "BELONGING", label: "持ち物" },
] as const;

export const SHOPPING_CATEGORIES = [
  { value: "DIAPER", label: "おむつ" },
  { value: "FOOD", label: "食品" },
  { value: "CLOTHING", label: "衣類" },
  { value: "NURSERY", label: "保育園用品" },
  { value: "DAILY", label: "日用品" },
  { value: "OTHER", label: "その他" },
] as const;

type Option = Readonly<{ value: string; label: string }>;

export function optionLabel(
  options: readonly Option[],
  value: string,
): string {
  return options.find((option) => option.value === value)?.label ?? "その他";
}

export function isOptionValue(
  options: readonly Option[],
  value: string,
): boolean {
  return options.some((option) => option.value === value);
}
