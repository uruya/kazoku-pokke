import type { ShoppingItem } from "@prisma/client";
import { SHOPPING_CATEGORIES } from "@/lib/constants";
import { labelClass, inputClass, textareaClass } from "./form-shell";
import { SubmitButton } from "@/components/ui/action-buttons";

type ShoppingFormProps = {
  action: (formData: FormData) => Promise<void>;
  item?: ShoppingItem;
  submitLabel?: string;
};

export function ShoppingForm({
  action,
  item,
  submitLabel = "追加する",
}: ShoppingFormProps) {
  return (
    <form action={action} className="grid gap-4">
      <label className={labelClass}>
        商品名 <span className="text-[#b14f43]">*</span>
        <input
          className={inputClass}
          name="name"
          required
          maxLength={120}
          defaultValue={item?.name}
          placeholder="例：おむつ"
        />
      </label>
      <label className={labelClass}>
        カテゴリ <span className="text-[#b14f43]">*</span>
        <select
          className={inputClass}
          name="category"
          required
          defaultValue={item?.category ?? "DAILY"}
        >
          {SHOPPING_CATEGORIES.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </label>
      <label className={labelClass}>
        メモ
        <textarea
          className={textareaClass}
          name="note"
          maxLength={500}
          defaultValue={item?.note ?? ""}
          placeholder="サイズや数量など"
        />
      </label>
      <SubmitButton label={submitLabel} />
    </form>
  );
}
