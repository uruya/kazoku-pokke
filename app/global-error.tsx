"use client";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  retry: () => void;
};

export default function GlobalError({ error, retry }: GlobalErrorProps) {
  return (
    <html lang="ja">
      <body
        style={{
          margin: 0,
          background: "#f2eee7",
          color: "#24312d",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans JP", sans-serif',
        }}
      >
        <title>エラー | かぞくポッケ</title>
        <main
          role="alert"
          style={{
            minHeight: "100dvh",
            display: "grid",
            placeItems: "center",
            padding: 16,
          }}
        >
          <section
            style={{
              width: "100%",
              maxWidth: 420,
              boxSizing: "border-box",
              border: "1px solid #e4e1da",
              borderRadius: 16,
              background: "#ffffff",
              padding: 24,
              textAlign: "center",
              boxShadow: "0 5px 18px rgba(43, 58, 53, 0.08)",
            }}
          >
            <div
              aria-hidden="true"
              style={{
                width: 48,
                height: 48,
                margin: "0 auto",
                display: "grid",
                placeItems: "center",
                borderRadius: "50%",
                background: "#fff1cc",
                fontSize: 24,
                fontWeight: 800,
              }}
            >
              !
            </div>
            <h1 style={{ margin: "16px 0 0", fontSize: 22 }}>
              アプリを読み込めませんでした
            </h1>
            <p
              style={{
                margin: "8px 0 0",
                color: "#68736f",
                fontSize: 14,
                lineHeight: 1.7,
              }}
            >
              一時的な問題の可能性があります。もう一度試すか、TODO画面へ移動してください。
            </p>
            <div
              style={{
                display: "grid",
                gap: 12,
                marginTop: 20,
              }}
            >
              <button
                type="button"
                onClick={retry}
                style={{
                  minHeight: 48,
                  border: 0,
                  borderRadius: 12,
                  background: "#26715f",
                  color: "#ffffff",
                  font: "inherit",
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                もう一度試す
              </button>
              <a
                href="/todos"
                style={{
                  minHeight: 48,
                  display: "grid",
                  placeItems: "center",
                  borderRadius: 12,
                  background: "#dcece6",
                  color: "#26715f",
                  fontWeight: 800,
                  textDecoration: "none",
                }}
              >
                TODOを開く
              </a>
            </div>
            {error.digest ? (
              <p
                style={{
                  margin: "20px 0 0",
                  color: "#68736f",
                  fontSize: 12,
                  overflowWrap: "anywhere",
                }}
              >
                エラー番号：{error.digest}
              </p>
            ) : null}
          </section>
        </main>
      </body>
    </html>
  );
}
