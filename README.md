# Agent Inbox Demo

Agent Inbox Demo is a minimal Next.js app that demonstrates a sales follow-up agent using real email infrastructure. A prospect inbox sends a message to an agent inbox through AgentMail; a local keyword-based responder chooses a natural reply, and the agent replies in the same email thread. No LLM, database, cron job, or paid API is involved.

## Setup

1. Clone this repository and enter the project folder:
   ```bash
   git clone https://github.com/ChideraEmmanuelCE/agent-inbox-demo.git
   cd agent-inbox-demo
   ```
2. Install dependencies: `npm install`
3. Create an AgentMail account and copy an API key.
4. Create `.env.local` in the project root:
   ```bash
   AGENTMAIL_API_KEY=am_your_api_key_here
   ```
5. Run `npm run dev` and open http://localhost:3000.

## Deploy to Vercel

Import the public GitHub repository into Vercel, add `AGENTMAIL_API_KEY` under **Project → Settings → Environment Variables**, then deploy.

## What this demonstrates

- Two reusable AgentMail inboxes, created with stable idempotency keys.
- Real outbound email from the prospect inbox to the agent inbox.
- Rule-based replies for pricing, demos, follow-ups, unsubscribe requests, and general questions.
- Email thread retrieval rendered in a chat-style interface.

## Next steps

- Replace short polling with AgentMail webhooks for inbound messages.
- Add n8n integration for CRM updates and follow-up workflows.
- Add multi-agent routing for sales, support, and billing conversations.

## Notes

This is a public demo, not a production mail gateway. Anyone who can access a deployed instance may be able to trigger messages using the configured inboxes. Add rate limiting and access controls before using it with real prospects. Keep `AGENTMAIL_API_KEY` server-side and never commit `.env.local`.
