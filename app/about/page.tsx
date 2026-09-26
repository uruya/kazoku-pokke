import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "明日の保育園の準備を、家族で共有",
  description:
    "保育園の持ち物・提出物・期限を家族で共有。準備できたらチェックして、ひとりで覚えて毎回伝える手間を減らします。",
};

const features = [
  {
    mark: "保",
    eyebrow: "持ち物・提出物",
    title: "次に必要なものを、ひとつのリストに",
    description:
      "着替えの補充、布団カバー、提出する書類。保育園の持ち物や提出物を、日付・期限と一緒に残せます。",
    tone: "mint",
  },
  {
    mark: "✓",
    eyebrow: "家族で共有",
    title: "準備できたら、チェックで伝わる",
    description:
      "招待した家族が同じリストを確認できます。準備が終わった項目を完了にすれば、何が残っているかもわかります。",
    tone: "green",
  },
  {
    mark: "日",
    eyebrow: "前日の通知",
    title: "朝を迎える前に、思い出せる",
    description:
      "通知を設定すると、予定や期限の前日にお知らせ。メール通知から始められ、対応端末ではスマホ通知も使えます。",
    tone: "orange",
  },
] as const;

const steps = [
  {
    number: "01",
    title: "メールだけで登録",
    description: "パスワードは不要。届いた確認コードですぐに始められます。",
  },
  {
    number: "02",
    title: "持ち物を1件登録",
    description: "家庭を作ったら、次に必要な持ち物や提出物を1件登録してみましょう。",
  },
  {
    number: "03",
    title: "使いたくなったら家族も招待",
    description: "まずはひとりで使えます。招待リンクを送れば、家族も同じリストを確認できます。",
  },
] as const;

function FeatureCard({
  feature,
}: {
  feature: (typeof features)[number];
}) {
  const toneClasses = {
    green: "bg-[var(--primary-soft)] text-[var(--primary)]",
    mint: "bg-[#e8f2de] text-[#64833e]",
    orange: "bg-[var(--accent-soft)] text-[#bd6242]",
    yellow: "bg-[var(--warning-soft)] text-[#997027]",
    peach: "bg-[#f7e6d8] text-[#a96a43]",
  } as const;

  return (
    <article className="flex h-full flex-col rounded-[1.65rem] border border-[var(--line)] bg-white p-5 shadow-[0_12px_30px_rgba(43,58,53,0.05)] transition-transform duration-200 hover:-translate-y-1">
      <span
        aria-hidden="true"
        className={`flex h-12 w-12 items-center justify-center rounded-2xl text-lg font-black ${toneClasses[feature.tone]}`}
      >
        {feature.mark}
      </span>
      <p className="mt-5 text-xs font-extrabold tracking-[0.14em] text-[var(--muted)]">
        {feature.eyebrow}
      </p>
      <h3 className="mt-2 text-lg font-extrabold leading-7 tracking-tight">
        {feature.title}
      </h3>
      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
        {feature.description}
      </p>
    </article>
  );
}

function DashboardPreview() {
  return (
    <div className="relative mx-auto w-full max-w-[31rem] lg:mr-0">
      <div
        aria-hidden="true"
        className="absolute -left-8 top-16 h-24 w-24 rounded-full bg-[var(--accent)]/25 blur-2xl"
      />
      <div
        aria-hidden="true"
        className="absolute -right-6 bottom-8 h-32 w-32 rounded-full bg-[var(--primary)]/20 blur-3xl"
      />
      <div className="relative rotate-1 rounded-[2rem] border border-white/80 bg-[#f4f6f0] p-3 shadow-[0_24px_60px_rgba(36,70,60,0.18)] sm:p-4">
        <div className="rounded-[1.5rem] border border-[var(--line)] bg-[var(--surface)] p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold text-[var(--muted)]">
                画面イメージ・登録例
              </p>
              <h2 className="mt-1 text-xl font-extrabold tracking-tight">
                わが家
              </h2>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary-soft)] text-lg font-black text-[var(--primary)]">
              家
            </span>
          </div>

          <div className="mt-4 rounded-2xl bg-[var(--primary)] p-4 text-white">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-white/70">今日やること</p>
                <p className="mt-1 text-2xl font-extrabold">あと 3件</p>
              </div>
              <span className="rounded-xl bg-white px-3 py-2 text-xs font-extrabold text-[var(--primary)]">
                一覧を見る
              </span>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-[var(--line)] bg-white p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-extrabold">今日のTODO</p>
                <span className="rounded-full bg-[var(--accent-soft)] px-2 py-1 text-[10px] font-bold text-[#a64f31]">
                  3件
                </span>
              </div>
              <div className="mt-3 space-y-2.5">
                <p className="flex items-center gap-2 text-xs font-bold">
                  <span className="h-4 w-4 rounded-full border-2 border-[var(--primary)]" />
                  連絡帳を書く
                </p>
                <p className="flex items-center gap-2 text-xs font-bold">
                  <span className="h-4 w-4 rounded-full border-2 border-[var(--primary)]" />
                  オムツを補充
                </p>
                <p className="flex items-center gap-2 text-xs font-bold">
                  <span className="h-4 w-4 rounded-full border-2 border-[var(--primary)]" />
                  提出書類を確認
                </p>
              </div>
            </div>
            <div className="rounded-2xl border border-[var(--line)] bg-white p-3">
              <p className="text-xs font-extrabold">今週の予定</p>
              <div className="mt-3 space-y-2.5 text-xs">
                <p className="flex items-center gap-2 font-bold">
                  <span className="w-9 font-extrabold text-[var(--primary)]">9/7</span>
                  身体測定
                </p>
                <p className="flex items-center gap-2 font-bold">
                  <span className="w-9 font-extrabold text-[#87601c]">9/9</span>
                  提出物の締切
                </p>
                <p className="flex items-center gap-2 font-bold">
                  <span className="w-9 font-extrabold text-[var(--primary)]">9/11</span>
                  布団カバー
                </p>
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between rounded-2xl border border-[var(--line)] bg-white p-3">
            <div>
              <p className="text-[10px] font-bold text-[var(--muted)]">買うもの</p>
              <p className="mt-1 text-xs font-extrabold">おむつ、おしりふき、着替え</p>
            </div>
            <span className="text-lg text-[var(--accent)]">□</span>
          </div>
        </div>
      </div>
      <div className="relative -mt-6 ml-6 flex w-fit items-center gap-2 rounded-full border border-white bg-white px-3 py-2 text-xs font-extrabold text-[var(--primary)] shadow-lg sm:ml-10">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--primary-soft)] text-[10px]">
          ✓
        </span>
        家族みんなで同じ画面を見る
      </div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <main className="overflow-hidden bg-[#fcfaf5]">
      <section className="relative">
        <div
          aria-hidden="true"
          className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[var(--primary-soft)]/70 blur-3xl"
        />
        <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-5 sm:px-8 sm:pb-24 lg:px-12">
          <header className="flex items-center justify-between">
            <Link href="/about" className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--primary)] text-lg font-black text-white shadow-sm">
                家
              </span>
              <span className="font-extrabold tracking-tight">かぞくポッケ</span>
            </Link>
            <Link
              href="/login"
              className="flex min-h-11 items-center rounded-full border border-[var(--line)] bg-white/80 px-4 text-sm font-extrabold text-[var(--primary)] backdrop-blur transition-colors hover:bg-white"
            >
              ログイン
            </Link>
          </header>

          <div className="mt-14 grid items-center gap-14 lg:mt-20 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-[var(--accent-soft)] px-3 py-1.5 text-xs font-extrabold text-[#a64f31]">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                保育園の準備を、ひとりで覚えている方へ
              </p>
              <h1 className="mt-5 max-w-xl text-[2.55rem] font-black leading-[1.18] tracking-[-0.055em] text-[#203b34] sm:text-5xl lg:text-[3.2rem]">
                明日の保育園、<br />何を持っていく？<br />
                <span className="text-[var(--primary)]">家族で共有。</span>
              </h1>
              <p className="mt-6 max-w-lg text-base leading-8 text-[var(--muted)] sm:text-lg">
                持ち物・提出物・期限をまとめて、準備できたらチェック。ひとりで覚えて、家族に毎回伝える手間を減らします。
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/login?next=/welcome"
                  className="flex min-h-13 items-center justify-center rounded-2xl bg-[var(--primary)] px-6 text-base font-extrabold text-white shadow-[0_10px_20px_rgba(38,113,95,0.22)] transition-transform hover:-translate-y-0.5"
                >
                  無料で保育園の準備をはじめる
                  <span aria-hidden="true" className="ml-2 text-lg">→</span>
                </Link>
                <a
                  href="#features"
                  className="flex min-h-13 items-center justify-center rounded-2xl px-5 text-sm font-extrabold text-[var(--primary)] transition-colors hover:bg-[var(--primary-soft)]"
                >
                  できることを見る
                </a>
              </div>
              <p className="mt-4 text-xs font-bold text-[var(--muted)]">
                パスワード不要 ・ 家族招待に対応 ・ まずは無料で使えます
              </p>
            </div>
            <DashboardPreview />
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--line)] bg-white/75">
        <div className="mx-auto grid max-w-6xl gap-5 px-5 py-6 sm:grid-cols-3 sm:px-8 lg:grid-cols-[1.3fr_1fr_1fr_1fr] lg:px-12">
          <div className="flex items-center gap-3 sm:col-span-3 lg:col-span-1">
            <span className="text-2xl text-[var(--accent)]">“</span>
            <p className="text-sm font-extrabold leading-6">
              「あれ、持った？」を減らして、<br />
              朝の準備を家族で。
            </p>
          </div>
          <div className="flex items-center gap-3 border-[var(--line)] sm:border-l sm:pl-5">
            <span className="text-xl font-black text-[var(--primary)]">01</span>
            <p className="text-xs font-bold leading-5 text-[var(--muted)]">持ち物と期限を<br />まとめて確認</p>
          </div>
          <div className="flex items-center gap-3 border-[var(--line)] sm:border-l sm:pl-5">
            <span className="text-xl font-black text-[var(--primary)]">02</span>
            <p className="text-xs font-bold leading-5 text-[var(--muted)]">準備の完了を<br />家族で共有</p>
          </div>
          <div className="flex items-center gap-3 border-[var(--line)] sm:border-l sm:pl-5">
            <span className="text-xl font-black text-[var(--primary)]">03</span>
            <p className="text-xs font-bold leading-5 text-[var(--muted)]">住所や写真を<br />保存しない設計</p>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="max-w-2xl">
          <p className="text-xs font-extrabold tracking-[0.18em] text-[var(--primary)]">FEATURES</p>
          <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight sm:text-4xl">
            明日の準備を、<br className="sm:hidden" />家族で進める。
          </h2>
          <p className="mt-4 leading-7 text-[var(--muted)]">
            持ち物を登録して、準備したらチェック。次に必要なものを、家族がそれぞれ確認できます。
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard key={feature.eyebrow} feature={feature} />
          ))}
        </div>
        <p className="mt-6 text-sm leading-7 text-[var(--muted)]">
          保育園の準備から始めて、必要になったら買い物リストや病院の予定、子どもの服・靴のサイズも共有できます。
        </p>
      </section>

      <section className="bg-[var(--primary)] text-white">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20 lg:px-12">
          <div>
            <p className="text-xs font-extrabold tracking-[0.18em] text-white/60">HOW IT WORKS</p>
            <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight sm:text-4xl">
              まずは、<br />持ち物をひとつ。
            </h2>
            <p className="mt-5 max-w-sm leading-7 text-white/75">
              メールで登録して家庭を作ったら、次の登園日に必要なものを1件追加。家族の招待は、あとからでも大丈夫です。
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {steps.map((step) => (
              <article key={step.number} className="rounded-[1.5rem] bg-white/10 p-5 ring-1 ring-white/15">
                <p className="text-3xl font-black text-[var(--accent)]">{step.number}</p>
                <h3 className="mt-7 font-extrabold">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/70">{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[1fr_0.95fr] lg:items-center lg:gap-20 lg:px-12">
        <div>
          <p className="text-xs font-extrabold tracking-[0.18em] text-[var(--primary)]">FOR YOUR FAMILY</p>
          <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight sm:text-4xl">
            こんな準備に、<br />心当たりはありませんか。
          </h2>
          <ul className="mt-7 space-y-4">
            {[
              "保育園の持ち物を覚えて、家族に毎回伝えている",
              "提出物の締切を、当日の朝に思い出す",
              "着替えやおむつの補充が済んだか、すぐ確認したい",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm font-bold leading-6">
                <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--primary-soft)] text-xs font-black text-[var(--primary)]">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-[2rem] bg-[#f3eadf] p-5 sm:p-7">
          <div className="rounded-[1.5rem] bg-white p-5 shadow-[0_16px_34px_rgba(106,75,47,0.1)] sm:p-7">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-xl text-[#bd6242]">◎</span>
            <h3 className="mt-5 text-xl font-extrabold tracking-tight">大切な情報だけを、<br />家族の手元に。</h3>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              かぞくポッケは、子育てに必要な最小限の情報を扱います。住所・写真・詳細な医療情報は保存しません。
            </p>
            <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold text-[var(--primary)]">
              <span className="rounded-full bg-[var(--primary-soft)] px-3 py-1.5">家庭ごとに分離</span>
              <span className="rounded-full bg-[var(--primary-soft)] px-3 py-1.5">招待した家族だけ</span>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 pb-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[2.25rem] bg-[#e9f1e5] px-6 py-12 text-center sm:px-10 sm:py-16">
          <p className="text-xs font-extrabold tracking-[0.18em] text-[var(--primary)]">START SMALL</p>
          <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight sm:text-4xl">
            まずは、次の登園日の持ち物を<br className="sm:hidden" />ひとつ書いてみる。
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[var(--muted)]">
            着替えの補充でも、提出する書類でも。ひとつ登録して、次の準備に使ってみてください。
          </p>
          <Link
            href="/login?next=/welcome"
            className="mt-7 inline-flex min-h-13 items-center rounded-2xl bg-[var(--primary)] px-7 text-base font-extrabold text-white shadow-[0_10px_20px_rgba(38,113,95,0.2)] transition-transform hover:-translate-y-0.5"
          >
            無料で持ち物を登録する
            <span aria-hidden="true" className="ml-2 text-lg">→</span>
          </Link>
        </div>
      </section>

      <footer className="mx-auto flex max-w-6xl flex-col gap-3 px-5 pb-8 pt-2 text-xs font-bold text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
        <p>© かぞくポッケ</p>
        <div className="flex flex-wrap gap-4">
          <a href="#features" className="transition-colors hover:text-[var(--primary)]">できること</a>
          <Link href="/terms" className="transition-colors hover:text-[var(--primary)]">利用規約</Link>
          <Link href="/install" className="transition-colors hover:text-[var(--primary)]">ホーム画面に追加</Link>
          <Link href="/privacy" className="transition-colors hover:text-[var(--primary)]">プライバシー</Link>
          <Link href="/contact" className="transition-colors hover:text-[var(--primary)]">お問い合わせ</Link>
          <Link href="/login" className="transition-colors hover:text-[var(--primary)]">ログイン</Link>
        </div>
      </footer>
    </main>
  );
}
