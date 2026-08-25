import type { Child } from "@prisma/client";
import { toDateInputValue } from "@/lib/date";
import { labelClass, inputClass, textareaClass } from "./form-shell";
import { SubmitButton } from "@/components/ui/action-buttons";

type ChildFormProps = {
  action: (formData: FormData) => Promise<void>;
  item?: Child;
  submitLabel?: string;
};

export function ChildForm({
  action,
  item,
  submitLabel = "追加する",
}: ChildFormProps) {
  return (
    <form action={action} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={labelClass}>
          名前・ニックネーム <span className="text-[#b14f43]">*</span>
          <input
            className={inputClass}
            name="nickname"
            required
            maxLength={60}
            defaultValue={item?.nickname}
            placeholder="例：はる"
          />
        </label>
        <label className={labelClass}>
          生年月日 <span className="text-[#b14f43]">*</span>
          <input
            className={inputClass}
            name="birthDate"
            type="date"
            required
            defaultValue={
              item?.birthDate ? toDateInputValue(item.birthDate) : undefined
            }
          />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={labelClass}>
          服サイズ
          <input
            className={inputClass}
            name="clothingSize"
            maxLength={30}
            defaultValue={item?.clothingSize ?? ""}
            placeholder="例：90"
          />
        </label>
        <label className={labelClass}>
          靴サイズ
          <input
            className={inputClass}
            name="shoeSize"
            maxLength={30}
            defaultValue={item?.shoeSize ?? ""}
            placeholder="例：13.5 cm"
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
          placeholder="必要最小限のメモだけを保存"
        />
      </label>
      <SubmitButton label={submitLabel} />
    </form>
  );
}
