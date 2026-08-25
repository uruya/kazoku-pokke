import type { MedicalSchedule } from "@prisma/client";
import { addDays, startOfJapanDay, toDateTimeInputValue } from "@/lib/date";
import { labelClass, inputClass, textareaClass } from "./form-shell";
import { SubmitButton } from "@/components/ui/action-buttons";

type MedicalFormProps = {
  action: (formData: FormData) => Promise<void>;
  item?: MedicalSchedule;
  submitLabel?: string;
};

export function MedicalForm({
  action,
  item,
  submitLabel = "追加する",
}: MedicalFormProps) {
  const defaultDate = addDays(startOfJapanDay(), 1);
  defaultDate.setUTCHours(defaultDate.getUTCHours() + 10);

  return (
    <form action={action} className="grid gap-4">
      <label className={labelClass}>
        予定名 <span className="text-[#b14f43]">*</span>
        <input
          className={inputClass}
          name="title"
          required
          maxLength={120}
          defaultValue={item?.title}
          placeholder="例：予防接種"
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={labelClass}>
          日時 <span className="text-[#b14f43]">*</span>
          <input
            className={inputClass}
            name="date"
            type="datetime-local"
            required
            defaultValue={toDateTimeInputValue(item?.date ?? defaultDate)}
          />
        </label>
        <label className={labelClass}>
          病院名
          <input
            className={inputClass}
            name="hospitalName"
            maxLength={120}
            defaultValue={item?.hospitalName ?? ""}
            placeholder="例：さくらこどもクリニック"
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
          placeholder="持ち物や確認事項"
        />
      </label>
      <SubmitButton label={submitLabel} />
    </form>
  );
}
