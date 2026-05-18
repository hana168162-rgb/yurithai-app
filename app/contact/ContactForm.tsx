"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

type Topic = "drama-edit" | "streaming" | "sponsor" | "other";

const TOPIC_OPTIONS: { value: Topic; label: string }[] = [
  { value: "drama-edit", label: "作品情報の追加・訂正" },
  { value: "streaming", label: "配信情報の更新" },
  { value: "sponsor", label: "スポンサー・タイアップ" },
  { value: "other", label: "その他" },
];

const TOPIC_LABEL: Record<Topic, string> = Object.fromEntries(
  TOPIC_OPTIONS.map((o) => [o.value, o.label]),
) as Record<Topic, string>;

function topicFromQuery(q: string | null): Topic {
  if (q === "sponsor") return "sponsor";
  if (q === "streaming") return "streaming";
  if (q === "drama-edit") return "drama-edit";
  if (q === "other") return "other";
  return "drama-edit";
}

export function ContactForm() {
  const params = useSearchParams();
  const initialTopic = topicFromQuery(params.get("topic"));

  const [topic, setTopic] = useState<Topic>(initialTopic);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [body, setBody] = useState("");
  const [agreed, setAgreed] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<
    { type: "idle" } | { type: "ok" } | { type: "error"; message: string }
  >({ type: "idle" });

  // ハニーポット（ボット対策）
  const [website, setWebsite] = useState("");

  const isSponsor = topic === "sponsor";
  const phoneRequired = isSponsor;
  const companyRequired = isSponsor;

  const canSubmit = useMemo(() => {
    if (!name.trim() || !email.trim() || !body.trim()) return false;
    if (phoneRequired && !phone.trim()) return false;
    if (companyRequired && !company.trim()) return false;
    if (!agreed) return false;
    return true;
  }, [name, email, body, phone, phoneRequired, company, companyRequired, agreed]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    setStatus({ type: "idle" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          topicLabel: TOPIC_LABEL[topic],
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          company: company.trim(),
          body: body.trim(),
          website, // ハニーポット
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || `送信に失敗しました (${res.status})`);
      }
      setStatus({ type: "ok" });
      // フォームをリセット
      setName("");
      setEmail("");
      setPhone("");
      setCompany("");
      setBody("");
      setAgreed(false);
      // 上部へスクロール
      if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setStatus({
        type: "error",
        message: err instanceof Error ? err.message : "送信に失敗しました",
      });
    } finally {
      setSubmitting(false);
    }
  }

  // 完了表示
  useEffect(() => {
    if (status.type === "ok") {
      // 完了画面は別ページ /contact/thanks に遷移する選択肢もある
    }
  }, [status]);

  if (status.type === "ok") {
    return (
      <div className="bg-yuri-surface border border-yuri-edge rounded-md p-6 text-sm leading-relaxed">
        <div className="text-yuri-rose text-base font-medium mb-2">
          ✦ お問い合わせを受け付けました
        </div>
        <p className="text-yuri-ink/85">
          内容を確認のうえ、3〜5営業日以内にご記入のメールアドレス宛にご返信いたします。
          このたびはお問い合わせいただき、ありがとうございました。
        </p>
        <a
          href="/"
          className="inline-block mt-4 text-yuri-rose hover:opacity-80 text-sm"
        >
          トップへ戻る →
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* カテゴリ */}
      <div>
        <label className="block text-sm font-medium text-yuri-ink mb-2">
          お問い合わせ内容 <span className="text-yuri-rose">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {TOPIC_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-md border text-sm cursor-pointer transition-colors ${
                topic === opt.value
                  ? "border-yuri-rose bg-yuri-rose/10 text-yuri-ink"
                  : "border-yuri-edge bg-yuri-surface hover:border-yuri-rose/50"
              }`}
            >
              <input
                type="radio"
                name="topic"
                value={opt.value}
                checked={topic === opt.value}
                onChange={() => setTopic(opt.value)}
                className="accent-yuri-rose"
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 氏名 */}
      <Field
        label="氏名"
        required
        input={
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            className={inputCls}
            placeholder="例：山田 花子"
          />
        }
      />

      {/* メールアドレス */}
      <Field
        label="メールアドレス"
        required
        input={
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className={inputCls}
            placeholder="you@example.com"
          />
        }
      />

      {/* 電話番号 */}
      <Field
        label="電話番号"
        required={phoneRequired}
        note={phoneRequired ? "スポンサー・タイアップのご相談では必須です。" : "任意（スポンサー・タイアップ時は必須）"}
        input={
          <input
            type="tel"
            required={phoneRequired}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
            className={inputCls}
            placeholder="例：090-1234-5678"
          />
        }
      />

      {/* 会社名（スポンサー時のみ表示） */}
      {isSponsor && (
        <Field
          label="会社名・団体名"
          required
          input={
            <input
              type="text"
              required
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              autoComplete="organization"
              className={inputCls}
              placeholder="例：株式会社●●"
            />
          }
        />
      )}

      {/* 本文 */}
      <Field
        label="お問い合わせ内容"
        required
        input={
          <textarea
            required
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={7}
            className={inputCls + " resize-y min-h-[140px]"}
            placeholder={
              isSponsor
                ? "貴社の事業概要、想定するタイアップの形式、ご予算感、希望時期などをご記入ください。"
                : "作品名や該当箇所、参考URLなどを添えていただけると確認がスムーズです。"
            }
          />
        }
      />

      {/* ハニーポット */}
      <div className="hidden" aria-hidden>
        <label>
          ウェブサイト（記入不要）
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </label>
      </div>

      {/* 同意 */}
      <label className="flex items-start gap-2 text-sm text-yuri-ink/90 leading-relaxed cursor-pointer">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-1 accent-yuri-rose"
        />
        <span>
          記載内容に誹謗中傷・名誉毀損・差別的な表現が含まれないことを確認しました。
        </span>
      </label>

      {/* エラー */}
      {status.type === "error" && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {status.message}
        </div>
      )}

      {/* 送信ボタン */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={!canSubmit || submitting}
          className="inline-flex items-center justify-center gap-2 bg-yuri-navy text-yuri-cream px-6 py-3 rounded-full text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
        >
          {submitting ? "送信中…" : "送信する →"}
        </button>
        <p className="text-xs text-yuri-muted mt-2">
          送信前にもう一度内容をご確認ください。
        </p>
      </div>
    </form>
  );
}

const inputCls =
  "w-full rounded-md border border-yuri-edge bg-yuri-surface px-3 py-2.5 text-sm text-yuri-ink placeholder:text-yuri-muted/70 focus:outline-none focus:border-yuri-rose focus:ring-1 focus:ring-yuri-rose";

function Field({
  label,
  required,
  note,
  input,
}: {
  label: string;
  required?: boolean;
  note?: string;
  input: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-yuri-ink mb-1.5">
        {label} {required && <span className="text-yuri-rose">*</span>}
      </label>
      {input}
      {note && <p className="text-xs text-yuri-muted mt-1">{note}</p>}
    </div>
  );
}
