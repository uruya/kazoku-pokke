import type { Todo } from "@prisma/client";
import { TODO_CATEGORIES } from "@/lib/constants";
import { startOfJapanDay, toDateInputValue } from "@/lib/date";
import { labelClass, inputClass, textareaClass } from "./form-shell";
import { SubmitButton } from "@/components/ui/action-buttons";

type TodoFormProps = {
  action: (formData: FormData) => Promise<void>;
  item?: Todo;
  submitLabel?: string;
};

export function TodoForm({
  action,
  item,
  submitLabel = "追加する",
}: TodoFormProps) {
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
          placeholder="例：連絡帳を書く"
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={labelClass}>
          カテゴリ <span className="text-[#b14f43]">*</span>
          <select
            className={inputClass}
            name="category"
            required
            defaultValue={item?.category ?? "NURSERY"}
          >
            {TODO_CATEGORIES.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </label>
        <label className={labelClass}>
          期限
          <input
            className={inputClass}
            name="dueDate"
            type="date"
            defaultValue={
              item?.dueDate
                ? toDateInputValue(item.dueDate)
                : toDateInputValue(startOfJapanDay())
            }
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
          placeholder="補足があれば入力"
        />
      </label>
      <SubmitButton label={submitLabel} />
    </form>
  );
}
