import { describe, expect, it } from "vitest";
import {
  addDays,
  dateFromInput,
  dateTimeFromInput,
  formatAge,
  startOfJapanDay,
  toDateInputValue,
  toDateTimeInputValue,
} from "../lib/date";

describe("日本時間の日付処理", () => {
  it("深夜をまたいでも日本の日付で開始時刻を返す", () => {
    const now = new Date("2026-08-23T15:30:00.000Z");
    expect(startOfJapanDay(now).toISOString()).toBe(
      "2026-08-23T15:00:00.000Z",
    );
  });

  it("日数を加算して入力用の日付へ戻せる", () => {
    const base = dateFromInput("2026-08-24");
    expect(toDateInputValue(addDays(base, 7))).toBe("2026-08-31");
  });

  it("日時入力を日本時間として解釈する", () => {
    const date = dateTimeFromInput("2026-08-29T10:30");
    expect(toDateTimeInputValue(date)).toBe("2026-08-29T10:30");
  });

  it("0〜3歳向けに年齢を月単位まで表示する", () => {
    const birthDate = new Date("2025-04-12T00:00:00+09:00");
    const now = new Date("2026-08-24T12:00:00+09:00");
    expect(formatAge(birthDate, now)).toBe("1歳4か月");
  });

  it("不正な日付入力を拒否する", () => {
    expect(() => dateFromInput("2026/08/24")).toThrow(
      "日付を正しく入力してください。",
    );
  });
});
