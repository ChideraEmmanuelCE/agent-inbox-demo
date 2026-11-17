import { NextResponse } from "next/server";
import { mail } from "@/lib/agentmail";
import { respond } from "@/lib/responder";

export const runtime = "nodejs";
export async function POST(req: Request) {
  try {
    const { agentInbox, threadId, messageId } = await req.json();
    if (![agentInbox, threadId, messageId].every((v: unknown) => typeof v === "string" && v)) return NextResponse.json({ error: "Missing thread details." }, { status: 400 });
    let thread: any;
    for (let attempt = 0; attempt < 5; attempt++) {
      thread = await mail.inboxes.threads.get(agentInbox, threadId);
      if (thread.messages?.some((m: any) => m.messageId === messageId)) break;
      await new Promise(resolve => setTimeout(resolve, 650));
    }
    const incoming = thread?.messages?.find((m: any) => m.messageId === messageId);
    if (!incoming) return NextResponse.json({ error: "The prospect email has not arrived yet. Please try again." }, { status: 504 });
    const replyText = respond(incoming.extractedText || incoming.text || "");
    await mail.inboxes.messages.reply(agentInbox, messageId, replyText);
    const updated = await mail.inboxes.threads.get(agentInbox, threadId);
    const messages = (updated.messages || []).map((m: any) => ({
      messageId: m.messageId, from: m.from, text: m.text,
      extractedText: m.extractedText, timestamp: m.timestamp
    }));
    return NextResponse.json({ messages });
  } catch (error) {
    console.error("reply:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "AgentMail could not generate the reply." }, { status: 500 });
  }
}
