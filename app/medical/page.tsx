import type { Metadata } from "next";
import {
  createMedicalSchedule,
  deleteMedicalSchedule,
  toggleMedicalSchedule,
  updateMedicalSchedule,
} from "@/app/actions/medical";
import { MedicalForm } from "@/components/forms/medical-form";
import { FormPanel } from "@/components/forms/form-shell";
import { PageHeader } from "@/components/page-header";
import {
  DeleteButton,
  ToggleButton,
} from "@/components/ui/action-buttons";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDateTime } from "@/lib/date";
import { prisma } from "@/lib/prisma";
import { requireHousehold } from "@/lib/session";

export const metadata: Metadata = { title: "病院・予防接種" };
export const dynamic = "force-dynamic";

export default async function MedicalPage() {
  const { householdId } = await requireHousehold();
  const schedules = await prisma.medicalSchedule.findMany({
    where: { householdId },
    orderBy: [{ isCompleted: "asc" }, { date: "asc" }],
  });

  return (
    <main>
      <PageHeader
        title="病院・予防接種"
        description="受診や予防接種の予定と、当日の持ち物を記録します。"
        backHref="/more"
      />
      <div className="mx-auto grid max-w-5xl gap-4 px-4 py-5 md:px-10">
        <FormPanel title="病院の予定を追加">
          <MedicalForm action={createMedicalSchedule} />
        </FormPanel>
        <section aria-labelledby="medical-list-title">
          <h2 id="medical-list-title" className="mb-3 text-lg font-extrabold">
            予定一覧
          </h2>
          {schedules.length === 0 ? (
            <EmptyState message="病院の予定はまだありません" />
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {schedules.map((schedule) => (
                <article
                  key={schedule.id}
                  className={`rounded-2xl border border-[var(--line)] bg-white p-4 ${
                    schedule.isCompleted ? "opacity-60" : ""
                  }`}
                >
                  <div className="flex gap-3">
                    <ToggleButton
                      action={toggleMedicalSchedule.bind(null, schedule.id)}
                      completed={schedule.isCompleted}
                      label={
                        schedule.isCompleted
                          ? `${schedule.title}を未完了に戻す`
                          : `${schedule.title}を完了にする`
                      }
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-extrabold text-[#9a4f34]">
                        {formatDateTime(schedule.date)}
                      </p>
                      <h3
                        className={`mt-0.5 font-extrabold ${
                          schedule.isCompleted ? "line-through" : ""
                        }`}
                      >
                        {schedule.title}
                      </h3>
                      {schedule.hospitalName ? (
                        <p className="mt-1 text-sm font-bold text-[var(--primary)]">
                          {schedule.hospitalName}
                        </p>
                      ) : null}
                      {schedule.note ? (
                        <p className="mt-2 whitespace-pre-wrap text-sm text-[var(--muted)]">
                          {schedule.note}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <div className="mt-2 flex items-start gap-2 border-t border-[var(--line)] pt-2">
                    <details className="min-w-0 flex-1">
                      <summary className="flex min-h-11 cursor-pointer items-center text-sm font-bold text-[var(--primary)]">
                        編集する
                      </summary>
                      <div className="mt-2 rounded-xl bg-[var(--surface)] p-3">
                        <MedicalForm
                          action={updateMedicalSchedule.bind(null, schedule.id)}
                          item={schedule}
                          submitLabel="変更を保存"
                        />
                      </div>
                    </details>
                    <DeleteButton
                      action={deleteMedicalSchedule.bind(null, schedule.id)}
                    />
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
