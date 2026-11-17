import { NextResponse } from "next/server";
import { getInboxPair } from "@/lib/agentmail";

export const runtime = "nodejs";
export async function POST() {
  try {
    const { agent, prospect } = await getInboxPair();
    return NextResponse.json({ agent, prospect });
  } catch (error) {
    console.error("create-inbox:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "AgentMail inbox creation failed." }, { status: 500 });
  }
}
