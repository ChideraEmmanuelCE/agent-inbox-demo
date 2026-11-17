import { NextResponse } from "next/server";
import { mail } from "@/lib/agentmail";

export const runtime = "nodejs";
export async function POST(req: Request) {
  try {
    const { prospectInbox, agentInbox, subject, text } = await req.json();
    if (![prospectInbox, agentInbox, subject, text].every((v: unknown) => typeof v === "string" && v.trim())) return NextResponse.json({ error: "Missing message details." }, { status: 400 });
    if (text.length > 4000) return NextResponse.json({ error: "Keep demo messages under 4,000 characters." }, { status: 400 });
    const sent = await mail.inboxes.messages.send(prospectInbox, { to: [agentInbox], subject, text });
    return NextResponse.json({ messageId: sent.messageId, threadId: sent.threadId });
  } catch (error) {
    console.error("send:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "AgentMail could not send the prospect message." }, { status: 500 });
  }
}
