export type FamilyChangeKind = "TODO" | "保育園" | "病院";
export type FamilyChangeAction = "added" | "updated" | "deleted";

export function hasImportantChanges(
  before: Record<string, unknown>,
  after: Record<string, unknown>,
  fields: string[],
) {
  return fields.some((field) => {
    const previous = before[field];
    const next = after[field];
    return (previous instanceof Date ? previous.getTime() : previous) !==
      (next instanceof Date ? next.getTime() : next);
  });
}

export function buildFamilyChangeNotification(
  kind: FamilyChangeKind,
  action: FamilyChangeAction,
) {
  const verb = { added: "追加", updated: "変更", deleted: "削除" }[action];
  const url = { TODO: "/todos", 保育園: "/nursery", 病院: "/medical" }[kind];
  return {
    title: "かぞくポッケ｜家族からの共有",
    body: `家族が${kind}の予定を${verb}しました。アプリで確認してください。`,
    url,
  };
}
