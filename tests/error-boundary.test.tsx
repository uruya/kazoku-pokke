import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import ErrorPage from "../app/error";
import GlobalError from "../app/global-error";

describe("エラー復旧画面", () => {
  const error = Object.assign(new Error("database unavailable"), {
    digest: "2380457148",
  });

  it("通常画面のエラーで再試行と別画面への導線を表示する", () => {
    const markup = renderToStaticMarkup(
      <ErrorPage error={error} retry={vi.fn()} />,
    );

    expect(markup).toContain("画面を読み込めませんでした");
    expect(markup).toContain("もう一度試す");
    expect(markup).toContain('href="/todos"');
    expect(markup).toContain("2380457148");
    expect(markup).not.toContain("database unavailable");
  });

  it("ルートレイアウトのエラーでも単独で復旧画面を表示する", () => {
    const markup = renderToStaticMarkup(
      <GlobalError error={error} retry={vi.fn()} />,
    );

    expect(markup).toContain("<html");
    expect(markup).toContain("アプリを読み込めませんでした");
    expect(markup).toContain("もう一度試す");
    expect(markup).toContain('href="/todos"');
    expect(markup).toContain("2380457148");
    expect(markup).not.toContain("database unavailable");
  });
});
