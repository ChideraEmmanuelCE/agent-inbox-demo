import { AgentMailClient } from "agentmail";

const key = process.env.AGENTMAIL_API_KEY;
if (!key) throw new Error("Missing AGENTMAIL_API_KEY. Add it to .env.local.");
export const mail = new AgentMailClient({ apiKey: key });

export async function getInboxPair() {
  const [agent, prospect] = await Promise.all([
    mail.inboxes.create({ clientId: "agent-inbox-demo-agent-v1", displayName: "Demo Sales Agent" }),
    mail.inboxes.create({ clientId: "agent-inbox-demo-prospect-v1", displayName: "Demo Prospect" })
  ]);
  return { agent: agent.inboxId, prospect: prospect.inboxId };
}
