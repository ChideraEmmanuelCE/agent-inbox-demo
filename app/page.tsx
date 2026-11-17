"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type Message = { messageId: string; from: string; text?: string; extractedText?: string; timestamp: string };
type Session = { agent: string; prospect: string; threadId: string; subject: string };

export default function Home() {
  const [session, setSession] = useState<Session | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const bottom = useRef<HTMLDivElement>(null);

  useEffect(() => { bottom.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  async function start() {
    setBusy(true); setError("");
    try {
      const res = await fetch("/api/create-inbox", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not create inboxes.");
      const subject = `Sales follow-up demo ${crypto.randomUUID().slice(0, 8)}`;
      setSession({ ...data, subject, threadId: "" });
      setMessages([]);
    } catch (e) { setError(e instanceof Error ? e.message : "Something went wrong."); }
    finally { setBusy(false); }
  }

  async function send(e: FormEvent) {
    e.preventDefault();
    if (!session || !draft.trim() || busy) return;
    setBusy(true); setError("");
    const text = draft.trim(); setDraft("");
    try {
      const sent = await fetch("/api/send", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prospectInbox: session.prospect, agentInbox: session.agent, subject: session.subject, text }) });
      const sentData = await sent.json();
      if (!sent.ok) throw new Error(sentData.error || "Message could not be sent.");
      setMessages(old => [...old, { messageId: sentData.messageId, from: session.prospect, text, timestamp: new Date().toISOString() }]);
      const reply = await fetch("/api/reply", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ agentInbox: session.agent, threadId: sentData.threadId, messageId: sentData.messageId }) });
      const replyData = await reply.json();
      if (!reply.ok) throw new Error(replyData.error || "The agent reply could not be retrieved.");
      setMessages(replyData.messages);
      setSession(s => s ? { ...s, threadId: sentData.threadId } : s);
    } catch (e) { setError(e instanceof Error ? e.message : "Something went wrong."); setDraft(text); }
    finally { setBusy(false); }
  }

  async function copy() {
    if (!session) return;
    await navigator.clipboard.writeText(session.agent);
    setCopied(true); setTimeout(() => setCopied(false), 1600);
  }

  return <main className="min-h-screen flex flex-col">
    <header className="border-b border-white/10 px-5 py-5">
      <div className="mx-auto max-w-4xl flex items-center justify-between">
        <div className="font-semibold tracking-tight">Agent Inbox Demo <span className="text-emerald-400">— powered by AgentMail</span></div>
        <span className="text-xs text-slate-500 hidden sm:block">REAL EMAIL · RULE-BASED AGENT</span>
      </div>
    </header>
    <section className="mx-auto w-full max-w-4xl flex-1 px-5 py-14">
      {!session ? <div className="mx-auto max-w-xl text-center py-16">
        <div className="mx-auto mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-emerald-400/10 text-emerald-400 text-2xl">✉</div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[.24em] text-emerald-400">Email automation, live</p>
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">A sales follow-up agent, powered by a real inbox.</h1>
        <p className="mx-auto mt-5 max-w-md text-slate-400 leading-7">Start a conversation, send a prospect message, and watch a local rule-based agent respond through AgentMail.</p>
        <button onClick={start} disabled={busy} className="mt-9 rounded-xl bg-emerald-500 px-6 py-3.5 font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-50">{busy ? "Preparing inboxes…" : "Start Demo Conversation"}</button>
        {error && <p className="mt-5 text-sm text-rose-400">{error}</p>}
        <p className="mt-6 text-xs text-slate-600">Uses two reusable AgentMail inboxes. No database or paid AI service.</p>
      </div> : <div>
        <div className="mb-7 rounded-2xl border border-white/10 bg-white/[.03] p-4 sm:flex sm:items-center sm:justify-between">
          <div><p className="text-xs uppercase tracking-wider text-slate-500">Agent inbox</p><p className="mt-1 font-medium text-emerald-300 break-all">{session.agent}</p></div>
          <button onClick={copy} className="mt-3 rounded-lg border border-white/10 px-3 py-2 text-sm hover:bg-white/5 sm:mt-0">{copied ? "Copied" : "Copy address"}</button>
        </div>
        <div className="mb-4 flex items-center justify-between"><div><h1 className="text-xl font-semibold">Sales conversation</h1><p className="mt-1 text-xs text-slate-500">Prospect and agent messages are sent as real email.</p></div><button onClick={start} disabled={busy} className="text-sm text-slate-400 hover:text-white">New session ↗</button></div>
        <div className="min-h-[340px] rounded-2xl border border-white/10 bg-[#0d131b] p-4 sm:p-6">
          {messages.length === 0 ? <div className="grid min-h-[300px] place-items-center text-center text-sm text-slate-500">Your conversation will appear here.<br/>Try asking about pricing or booking a demo.</div> : <div className="space-y-5">
            {messages.map((m, i) => {
              const prospect = m.from.toLowerCase() === session.prospect.toLowerCase();
              return <div key={m.messageId || i} className={`flex ${prospect ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[88%] rounded-2xl px-4 py-3 ${prospect ? "bg-emerald-500 text-slate-950 rounded-br-sm" : "bg-[#1b2633] text-slate-100 rounded-bl-sm"}`}>
                  <p className={`mb-1 text-[11px] font-semibold ${prospect ? "text-emerald-950/70" : "text-emerald-300"}`}>{prospect ? "PROSPECT" : "SALES AGENT"}</p>
                  <p className="whitespace-pre-wrap text-sm leading-6">{m.extractedText || m.text || "(No text body)"}</p>
                  <p className={`mt-2 text-[10px] ${prospect ? "text-emerald-950/60" : "text-slate-500"}`}>{new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                </div>
              </div>;
            })}
            {busy && <p className="text-xs text-slate-500">Agent is preparing a reply…</p>}
          </div>}
          <div ref={bottom}/>
        </div>
        <form onSubmit={send} className="mt-4 flex flex-col gap-3 sm:flex-row">
          <textarea value={draft} onChange={e => setDraft(e.target.value)} placeholder="Write a message as the prospect…" rows={2} className="min-h-14 flex-1 resize-y rounded-xl border border-white/10 bg-[#111923] px-4 py-3 text-sm outline-none focus:border-emerald-500" />
          <button disabled={busy || !draft.trim()} className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-40">{busy ? "Sending…" : "Send as Prospect"}</button>
        </form>
        {error && <p className="mt-3 text-sm text-rose-400">{error}</p>}
      </div>}
    </section>
    <footer className="border-t border-white/10 px-5 py-6 text-center text-xs text-slate-500">Built by Chidera Emmanuel · n8n / AI automation / web dev · <a className="text-slate-300 hover:text-emerald-400" href="https://github.com/ChideraEmmanuelCE" target="_blank" rel="noreferrer">GitHub</a> · <a className="text-slate-300 hover:text-emerald-400" href="https://www.linkedin.com/" target="_blank" rel="noreferrer">LinkedIn</a></footer>
  </main>;
}
