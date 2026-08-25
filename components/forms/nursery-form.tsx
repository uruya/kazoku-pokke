import type { NurseryItem } from "@prisma/client";
import { NURSERY_TYPES } from "@/lib/constants";
import { startOfJapanDay, toDateInputValue } from "@/lib/date";
import { labelClass, inputClass, textareaClass } from "./form-shell";
import { SubmitButton } from "@/components/ui/action-buttons";

type NurseryFormProps = {
  action: (formData: FormData) => Promise<void>;
  item?: NurseryItem;
  submitLabel?: string;
};

export function NurseryForm({
  action,
  item,
  submitLabel = "追加する",
}: NurseryFormProps) {
  return (
    <form action={action} className="grid gap-4">
      <label className={labelClass}>
        タイトル <span className="text-[#b14f43]">*</span>
        <input
          className={inputClass}
          name="title"
          required
          maxLength={120}
          defaultValue={item?.title}
          placeholder="例：着替え袋を持参"
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={labelClass}>
          種類 <span className="text-[#b14f43]">*</span>
          <select
            className={inputClass}
            name="type"
            required
            defaultValue={item?.type ?? "BELONGING"}
          >
            {NURSERY_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </label>
        <label className={labelClass}>
          日付・期限 <span className="text-[#b14f43]">*</span>
          <input
            className={inputClass}
            name="date"
            type="date"
            required
            defaultValue={toDateInputValue(item?.date ?? startOfJapanDay())}
          />
        </label>
      </div>
      <label className={labelClass}>
        メモ
        <textarea
          className={textareaClass}
          name="note"
          maxLength={500}
          defaultValue={item?.note ?? ""}
          placeholder="持ち物や注意点"
        />
      </label>
      <SubmitButton label={submitLabel} />
    </form>
  );
}
