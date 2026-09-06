import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "家族の予定をひとつに",
  description:
    "かぞくポッケは、保育園、育児TODO、病院・予防接種、買い物を家族で共有できるアプリです。",
};

const features = [
  {
    mark: "✓",
    eyebrow: "TODO",
    title: "今日やることが、すぐわかる",
    description:
      "期限とカテゴリをつけて、頭の中にある小さな用事も家族の共有リストへ。完了まで迷いません。",
    tone: "green",
  },
  {
    mark: "保",
    eyebrow: "保育園",
    title: "提出物と持ち物を、前日に思い出せる",
    description:
      "行事・提出物・持ち物をまとめて確認。朝の『あれ持った？』を少し減らします。",
    tone: "mint",
  },
  {
    mark: "＋",
    eyebrow: "病院・予防接種",
    title: "大事な予定を、家族の予定にする",
    description:
      "病院名やメモも一緒に残せるので、誰が連れていく日も共有しやすくなります。",
    tone: "orange",
  },
  {
    mark: "□",
    eyebrow: "買い物",
    title: "買うものを、頼みごとにしない",
    description:
      "おむつや保育園用品を家族の買い物リストに。買ったらその場でチェックできます。",
    tone: "yellow",
  },
  {
    mark: "子",
    eyebrow: "子どもメモ",
    title: "サイズ情報を、探さず使える",
    description:
      "服や靴のサイズなど、買い物で必要な情報を子どもごとにひとまとめにします。",
    tone: "peach",
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
    title: "わが家のノートを作る",
    description: "家庭名と呼び名を決めたら、使う準備は完了です。",
  },
  {
    number: "03",
    title: "家族を招待して共有",
    description: "招待リンクを送って、同じ情報を家族みんなで見られます。",
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
                2026年9月5日（土）
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
                  予防接種を予約
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
                  小児科
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
              <p className="mt-1 text-xs font-extrabold">おしりふき、牛乳 ほか2件</p>
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
                0〜3歳の子育て家庭へ
              </p>
              <h1 className="mt-5 max-w-xl text-[2.55rem] font-black leading-[1.18] tracking-[-0.055em] text-[#203b34] sm:text-5xl lg:text-[3.65rem]">
                家族の「次なにする？」を、
                <span className="text-[var(--primary)]">迷わない毎日</span>へ。
              </h1>
              <p className="mt-6 max-w-lg text-base leading-8 text-[var(--muted)] sm:text-lg">
                保育園の提出物、病院の予定、買い物、家事。散らばりがちな育児の情報を、家族みんなの共有ノートにまとめます。
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/login?next=/welcome"
                  className="flex min-h-13 items-center justify-center rounded-2xl bg-[var(--primary)] px-6 text-base font-extrabold text-white shadow-[0_10px_20px_rgba(38,113,95,0.22)] transition-transform hover:-translate-y-0.5"
                >
                  メールだけではじめる
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
              覚えておくことを減らして、<br />
              子どもと向き合う時間を増やす。
            </p>
          </div>
          <div className="flex items-center gap-3 border-[var(--line)] sm:border-l sm:pl-5">
            <span className="text-xl font-black text-[var(--primary)]">01</span>
            <p className="text-xs font-bold leading-5 text-[var(--muted)]">今日と今週に<br />集中できる</p>
          </div>
          <div className="flex items-center gap-3 border-[var(--line)] sm:border-l sm:pl-5">
            <span className="text-xl font-black text-[var(--primary)]">02</span>
            <p className="text-xs font-bold leading-5 text-[var(--muted)]">家族の予定を<br />同じ場所で共有</p>
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
            家族の「抜け」が減る、<br className="sm:hidden" />5つの場所。
          </h2>
          <p className="mt-4 leading-7 text-[var(--muted)]">
            いろいろなアプリやメモを行き来しなくても、子育ての毎日に必要なことがひとつにつながります。
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard key={feature.eyebrow} feature={feature} />
          ))}
        </div>
      </section>

      <section className="bg-[var(--primary)] text-white">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20 lg:px-12">
          <div>
            <p className="text-xs font-extrabold tracking-[0.18em] text-white/60">HOW IT WORKS</p>
            <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight sm:text-4xl">
              3分で、<br />わが家のノートに。
            </h2>
            <p className="mt-5 max-w-sm leading-7 text-white/75">
              使い始めるために必要なのは、メールアドレスだけ。家族の状況に合わせて、あとから少しずつ整えられます。
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
            こんな毎日に、<br />そっと効きます。
          </h2>
          <ul className="mt-7 space-y-4">
            {[
              "連絡帳・カレンダー・チャットを行き来している",
              "『誰かが覚えているはず』の用事が増えてきた",
              "保育園の持ち物や子どものサイズをすぐ確認したい",
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
            まずは、明日の予定を<br className="sm:hidden" />ひとつ書いてみる。
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[var(--muted)]">
            家族の毎日を整える最初の一歩を、メールだけではじめられます。
          </p>
          <Link
            href="/login?next=/welcome"
            className="mt-7 inline-flex min-h-13 items-center rounded-2xl bg-[var(--primary)] px-7 text-base font-extrabold text-white shadow-[0_10px_20px_rgba(38,113,95,0.2)] transition-transform hover:-translate-y-0.5"
          >
            かぞくポッケをはじめる
            <span aria-hidden="true" className="ml-2 text-lg">→</span>
          </Link>
        </div>
      </section>

      <footer className="mx-auto flex max-w-6xl flex-col gap-3 px-5 pb-8 pt-2 text-xs font-bold text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
        <p>© かぞくポッケ</p>
        <div className="flex gap-4">
          <a href="#features" className="transition-colors hover:text-[var(--primary)]">できること</a>
          <Link href="/login" className="transition-colors hover:text-[var(--primary)]">ログイン</Link>
        </div>
      </footer>
    </main>
  );
}
