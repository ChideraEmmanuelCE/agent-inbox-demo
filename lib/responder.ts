const replies: Record<string, string[]> = {
  pricing: [
    "Absolutely — pricing depends on the scope and the workflows you want to automate. If you share the main process and approximate volume, I can put together a clear estimate. Would that be useful?",
    "Good question. We usually start by understanding the outcome you need, then price the work around that scope. Are you looking to automate one process or several?",
    "We can work with a defined project budget or phase the rollout. What are you hoping to improve first? I can recommend a sensible starting point."
  ],
  demo: [
    "Happy to arrange a walkthrough. I can show you the workflow from trigger to outcome and leave time for your questions. What day this week tends to work for you?",
    "Definitely. A short demo is the easiest way to make this concrete. Is there a particular process you'd like us to use as the example?",
    "Let's do that. We can tailor the demo to your team's workflow rather than showing a generic presentation. Would a 20-minute call suit you?"
  ],
  followup: [
    "Thanks for getting back to me. Just checking whether this is still a priority on your side. If the timing has changed, that's completely fine — I can follow up when it makes sense.",
    "I wanted to keep the conversation moving without adding pressure. Is this something you'd like to explore now, or would a later check-in be better?",
    "Appreciate the update. I can send a concise summary of the proposed next steps so you have something easy to review internally."
  ],
  unsubscribe: [
    "Understood. I've marked this conversation as opted out, and we won't send further sales follow-ups. Thanks for letting us know.",
    "Of course — I'll stop the follow-ups. Thank you for your time, and all the best."
  ],
  general: [
    "Thanks for sharing that. To make sure I point you in the right direction, could you tell me a little more about the process your team would like to improve?",
    "That makes sense. We can start small, validate the result, and expand only if it delivers value. What would a successful outcome look like for your team?",
    "Thanks for the context. The next useful step would be to understand your current workflow and where the delays or repetitive work happen. Happy to explore that with you."
  ]
};

export function respond(message: string) {
  const text = message.toLowerCase();
  const category = text.includes("unsubscribe") || text.includes("stop emailing") ? "unsubscribe"
    : /price|pricing|cost|budget|quote|how much/.test(text) ? "pricing"
    : /demo|walkthrough|show me|see it/.test(text) ? "demo"
    : /follow.?up|checking in|check in|still interested|update/.test(text) ? "followup" : "general";
  const choices = replies[category];
  return choices[Math.floor(Math.random() * choices.length)];
}
