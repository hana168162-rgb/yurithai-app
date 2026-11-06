import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Payload = {
  topic?: string;
  topicLabel?: string;
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  body?: string;
  website?: string; // honeypot
};

const ALLOWED_TOPICS = new Set([
  "drama-edit",
  "streaming",
  "sponsor",
  "other",
]);

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export async function POST(req: NextRequest) {
  let data: Payload;
  try {
    data = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // honeypot: bot は空フィールドに値を入れがち
  if (data.website && data.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const topic = (data.topic || "").trim();
  const name = (data.name || "").trim();
  const email = (data.email || "").trim();
  const phone = (data.phone || "").trim();
  const company = (data.company || "").trim();
  const body = (data.body || "").trim();
  const topicLabel = (data.topicLabel || topic).trim();

  // ---- バリデーション ----
  if (!ALLOWED_TOPICS.has(topic)) {
    return NextResponse.json({ error: "カテゴリが不正です" }, { status: 400 });
  }
  if (!name || name.length > 100) {
    return NextResponse.json({ error: "氏名を入力してください" }, { status: 400 });
  }
  if (!email || !isEmail(email) || email.length > 200) {
    return NextResponse.json(
      { error: "有効なメールアドレスを入力してください" },
      { status: 400 },
    );
  }
  if (!body || body.length > 5000) {
    return NextResponse.json(
      { error: "お問い合わせ内容を入力してください（5000文字以内）" },
      { status: 400 },
    );
  }
  if (topic === "sponsor") {
    if (!phone) {
      return NextResponse.json(
        { error: "スポンサー案件では電話番号が必須です" },
        { status: 400 },
      );
    }
    if (!company) {
      return NextResponse.json(
        { error: "スポンサー案件では会社名が必須です" },
        { status: 400 },
      );
    }
  }
  if (phone.length > 50 || company.length > 200) {
    return NextResponse.json({ error: "入力値が長すぎます" }, { status: 400 });
  }

  // ---- 転送先決定 ----
  // 優先度: Resend（推奨、yurithai@fumomeru.com へ直接配信） > Formspree > Web3Forms > Webhook
  const resendKey = process.env.RESEND_API_KEY;
  const formspree = process.env.FORMSPREE_ENDPOINT;
  const web3FormsKey = process.env.WEB3FORMS_ACCESS_KEY;
  const webhook = process.env.CONTACT_WEBHOOK_URL;

  // 受信先メール（固定）
  const recipient = "yurithai@fumomeru.com";

  const summary = {
    topic,
    topicLabel,
    name,
    email,
    phone,
    company,
    body,
    submittedAt: new Date().toISOString(),
    source: "yurithai.jp / contact",
  };

  try {
    if (resendKey) {
      // Resend 経由で yurithai@fumomeru.com に直接配信
      // from アドレスは Resend の検証済みドメインか、未検証なら "onboarding@resend.dev" が使える
      const fromAddr = process.env.CONTACT_FROM_EMAIL || "YuriThai <onboarding@resend.dev>";
      const textLines = [
        `【お問い合わせ内容】${topicLabel}`,
        `【氏名】${name}`,
        `【メールアドレス】${email}`,
      ];
      if (phone) textLines.push(`【電話番号】${phone}`);
      if (company) textLines.push(`【会社名】${company}`);
      textLines.push("", "【本文】", body, "", "----", `受付日時: ${summary.submittedAt}`, "yurithai.jp お問い合わせフォームより");
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromAddr,
          to: [recipient],
          reply_to: email,
          subject: `[YuriThai] ${topicLabel} - ${name}`,
          text: textLines.join("\n"),
        }),
      });
      if (!r.ok) {
        const t = await r.text();
        console.error("[contact] Resend error:", r.status, t);
        return NextResponse.json(
          { error: "送信先サーバーがエラーを返しました" },
          { status: 502 },
        );
      }
    } else if (formspree) {
      const r = await fetch(formspree, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          _subject: `[YuriThai] ${topicLabel} - ${name}`,
          ...summary,
        }),
      });
      if (!r.ok) {
        const t = await r.text();
        console.error("[contact] Formspree error:", r.status, t);
        return NextResponse.json(
          { error: "送信先サーバーがエラーを返しました" },
          { status: 502 },
        );
      }
    } else if (web3FormsKey) {
      const r = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: web3FormsKey,
          subject: `[YuriThai] ${topicLabel} - ${name}`,
          from_name: name,
          replyto: email,
          ...summary,
        }),
      });
      if (!r.ok) {
        const t = await r.text();
        console.error("[contact] Web3Forms error:", r.status, t);
        return NextResponse.json(
          { error: "送信先サーバーがエラーを返しました" },
          { status: 502 },
        );
      }
    } else if (webhook) {
      const r = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(summary),
      });
      if (!r.ok) {
        console.error("[contact] Webhook error:", r.status, await r.text());
        return NextResponse.json(
          { error: "送信先サーバーがエラーを返しました" },
          { status: 502 },
        );
      }
    } else {
      // 環境変数が一つも設定されていない場合：ログだけ吐いて受け取り扱い
      // 本番では必ず FORMSPREE_ENDPOINT などを設定してください
      console.warn(
        "[contact] No transport configured. Submission was logged to server only.",
        summary,
      );
      if (process.env.NODE_ENV === "production") {
        return NextResponse.json(
          {
            error:
              "現在お問い合わせ窓口の設定中です。少々お待ちください。",
          },
          { status: 503 },
        );
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[contact] Unexpected error:", e);
    return NextResponse.json(
      { error: "予期しないエラーが発生しました" },
      { status: 500 },
    );
  }
}
