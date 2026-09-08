import type { Metadata } from "next";
import {
  createTodo,
  deleteTodo,
  toggleTodo,
  updateTodo,
} from "@/app/actions/todos";
import { TodoForm } from "@/components/forms/todo-form";
import { FormPanel } from "@/components/forms/form-shell";
import { PageHeader } from "@/components/page-header";
import {
  DeleteButton,
  ToggleButton,
} from "@/components/ui/action-buttons";
import { EmptyState } from "@/components/ui/empty-state";
import {
  TODO_CATEGORIES,
  optionLabel,
} from "@/lib/constants";
import { formatDate } from "@/lib/date";
import { prisma } from "@/lib/prisma";
import { requireHousehold } from "@/lib/session";

export const metadata: Metadata = { title: "TODO" };
export const dynamic = "force-dynamic";

export default async function TodosPage() {
  const { householdId, household } = await requireHousehold();
  const todos = await prisma.todo.findMany({
    where: { householdId },
    orderBy: [{ isCompleted: "asc" }, { dueDate: "asc" }, { createdAt: "desc" }],
  });

  const openCount = todos.filter((todo) => !todo.isCompleted).length;

  return (
    <main>
      <PageHeader
        title="TODO"
        description={`${household.name}・未完了 ${openCount}件。家族で共有したい用事をまとめます。`}
      />
      <div className="mx-auto grid max-w-5xl gap-4 px-4 py-5 md:px-10">
        <FormPanel title="新しいTODOを追加">
          <TodoForm action={createTodo} />
        </FormPanel>

        <section aria-labelledby="todo-list-title">
          <h2 id="todo-list-title" className="mb-3 text-lg font-extrabold">
            TODO一覧
          </h2>
          {todos.length === 0 ? (
            <EmptyState message="TODOはまだありません" />
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {todos.map((todo) => (
                <article
                  key={todo.id}
                  className={`rounded-2xl border border-[var(--line)] bg-white p-4 ${
                    todo.isCompleted ? "opacity-60" : ""
                  }`}
                >
                  <div className="flex gap-3">
                    <ToggleButton
                      action={toggleTodo.bind(null, todo.id)}
                      completed={todo.isCompleted}
                      label={
                        todo.isCompleted
                          ? `${todo.title}を未完了に戻す`
                          : `${todo.title}を完了にする`
                      }
                    />
                    <div className="min-w-0 flex-1">
                      <h3
                        className={`font-extrabold leading-6 ${
                          todo.isCompleted ? "line-through" : ""
                        }`}
                      >
                        {todo.title}
                      </h3>
                      <div className="mt-1 flex flex-wrap gap-1.5 text-xs font-bold">
                        <span className="rounded-full bg-[var(--primary-soft)] px-2 py-1 text-[var(--primary)]">
                          {optionLabel(TODO_CATEGORIES, todo.category)}
                        </span>
                        {todo.dueDate ? (
                          <span className="rounded-full bg-[var(--accent-soft)] px-2 py-1 text-[#9a4f34]">
                            {formatDate(todo.dueDate)}
                          </span>
                        ) : null}
                      </div>
                      {todo.note ? (
                        <p className="mt-2 whitespace-pre-wrap text-sm text-[var(--muted)]">
                          {todo.note}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <div className="mt-2 flex items-start gap-2 justify-end border-t border-[var(--line)] pt-2">
                    <details className="group min-w-0 flex-1">
                      <summary className="flex min-h-11 cursor-pointer items-center text-sm font-bold text-[var(--primary)]">
                        編集する
                      </summary>
                      <div className="mt-2 rounded-xl bg-[var(--surface)] p-3">
                        <TodoForm
                          action={updateTodo.bind(null, todo.id)}
                          item={todo}
                          submitLabel="変更を保存"
                        />
                      </div>
                    </details>
                    <DeleteButton action={deleteTodo.bind(null, todo.id)} />
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
