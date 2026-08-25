const JAPAN_TIME_ZONE = "Asia/Tokyo";

export function startOfJapanDay(now = new Date()): Date {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: JAPAN_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);

  return new Date(`${parts}T00:00:00+09:00`);
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

export function dateFromInput(value: string): Date {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error("日付を正しく入力してください。");
  }

  const date = new Date(`${value}T00:00:00+09:00`);
  if (Number.isNaN(date.getTime())) {
    throw new Error("日付を正しく入力してください。");
  }
  return date;
}

export function dateTimeFromInput(value: string): Date {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) {
    throw new Error("日時を正しく入力してください。");
  }

  const date = new Date(`${value}:00+09:00`);
  if (Number.isNaN(date.getTime())) {
    throw new Error("日時を正しく入力してください。");
  }
  return date;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("ja-JP", {
    timeZone: JAPAN_TIME_ZONE,
    month: "numeric",
    day: "numeric",
    weekday: "short",
  }).format(date);
}

export function formatLongDate(date: Date): string {
  return new Intl.DateTimeFormat("ja-JP", {
    timeZone: JAPAN_TIME_ZONE,
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(date);
}

export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat("ja-JP", {
    timeZone: JAPAN_TIME_ZONE,
    month: "numeric",
    day: "numeric",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function toDateInputValue(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: JAPAN_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function toDateTimeInputValue(date: Date): string {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: JAPAN_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
  const parts = Object.fromEntries(
    formatter
      .formatToParts(date)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
}

export function isSameDay(a: Date, b: Date): boolean {
  return toDateInputValue(a) === toDateInputValue(b);
}

export function formatAge(birthDate: Date, now = new Date()): string {
  const [birthYear, birthMonth, birthDay] = toDateInputValue(birthDate)
    .split("-")
    .map(Number);
  const [year, month, day] = toDateInputValue(now).split("-").map(Number);
  let totalMonths = (year - birthYear) * 12 + month - birthMonth;
  if (day < birthDay) {
    totalMonths -= 1;
  }
  totalMonths = Math.max(0, totalMonths);
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  return years === 0 ? `${months}か月` : `${years}歳${months}か月`;
}
