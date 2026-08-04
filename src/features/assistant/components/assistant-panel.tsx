"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { CornerDownLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { linkifyPaths } from "../lib/linkify";

/**
 * The site assistant.
 *
 * Answers stream in as plain text. Three things here are deliberate:
 *
 *  - The heading, lede, suggested questions and the route to a human are all
 *    server-rendered. With JavaScript off, the panel is still a readable
 *    section that ends in a link to /contact rather than a dead input box.
 *
 *  - Streaming text is NOT announced character by character. Piping a live
 *    region a token at a time makes a screen reader stutter continuously and
 *    is worse than useless; the finished answer is announced once, through a
 *    visually hidden status region.
 *
 *  - The disclaimer sits under the input where the answer appears, not buried
 *    in a footer. It is generated text about a real purchase decision and the
 *    visitor should be told that where they read it.
 */
const SUGGESTIONS = [
  "Which kits suit a Class 3–5 classroom?",
  "How does a Game Corner get set up?",
  "How does this align with NEP 2020?",
];

interface Turn {
  role: "user" | "assistant";
  content: string;
}

/**
 * How much history to send back.
 *
 * The route caps a conversation at 12 turns and 24,000 characters. Letting
 * the transcript grow until the server refuses it would turn a long, working
 * conversation into a wall — the visitor's next question fails for a reason
 * they cannot see and did nothing to cause. Trimming here keeps the request
 * inside those limits by construction; the server checks stay as the actual
 * guarantee, because a client-side limit is not one.
 *
 * The full transcript stays on screen. Only what is SENT is trimmed, so the
 * model keeps recent context and the visitor keeps the whole thread.
 */
const MAX_SENT_TURNS = 10;

export function AssistantPanel({
  pageLabels,
}: {
  pageLabels: Record<string, string>;
}) {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [streaming, setStreaming] = useState("");
  const [busy, setBusy] = useState(false);
  const [announce, setAnnounce] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);

  /**
   * Follow the answer down only while the visitor is already at the bottom.
   *
   * Scrolling to the bottom on every chunk fought anyone who scrolled up to
   * re-read something — the next token dragged them straight back down — and
   * slammed the container to the end the moment an answer finished. Reading
   * an answer while it is still being written is a completely normal thing to
   * do and the panel should not punish it.
   *
   * The 48px tolerance is what makes this feel right rather than literal:
   * "close enough to the bottom that they are clearly still following along"
   * is the actual intent, and an exact comparison fails on sub-pixel heights
   * at some zoom levels anyway.
   */
  const isPinnedToBottom = () => {
    const el = logRef.current;
    if (el === null) return true;
    return el.scrollHeight - el.scrollTop - el.clientHeight < 48;
  };

  const scrollToBottom = () => {
    const el = logRef.current;
    if (el === null) return;
    /* rAF so the measurement happens after React has painted the new chunk;
       scrolling to a height that does not exist yet lands short. */
    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
  };

  async function ask(question: string) {
    const trimmed = question.trim();
    if (trimmed === "" || busy) return;

    const next: Turn[] = [...turns, { role: "user", content: trimmed }];
    setTurns(next);
    setStreaming("");
    setBusy(true);
    setAnnounce("");
    if (inputRef.current) inputRef.current.value = "";
    /* Unconditional, unlike the streaming case: they just pressed Ask, so
       showing them what they asked is the point. */
    scrollToBottom();

    let answer = "";
    try {
      /* Trim from the front, then drop a leading assistant turn if the slice
         starts on one — the exchange has to begin and end with the user. */
      let sent = next.slice(-MAX_SENT_TURNS);
      if (sent[0]?.role === "assistant") sent = sent.slice(1);

      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: sent }),
      });

      if (!response.ok || response.body === null) {
        const { error } = await response.json().catch(() => ({ error: null }));
        answer =
          error ??
          "Sorry — the assistant is unavailable right now. Please book a demo and we'll answer properly.";
        setStreaming(answer);
      } else {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          /* Whether to follow the text down is decided BEFORE React paints
             the new chunk — once the content has grown, "are we at the
             bottom" is already false and the answer is always no. */
          const pinned = isPinnedToBottom();
          answer += decoder.decode(value, { stream: true });
          setStreaming(answer);
          if (pinned) scrollToBottom();
        }
      }
    } catch {
      answer =
        "Sorry — that didn't get through. Please check your connection, or call us on +91 97798 73333.";
      setStreaming(answer);
    }

    setTurns([...next, { role: "assistant", content: answer }]);
    setStreaming("");
    setBusy(false);
    /* Announced once, complete, rather than token by token. */
    setAnnounce(answer);
  }

  const hasConversation = turns.length > 0 || streaming !== "";

  return (
    /* min-w-0 on both columns is load-bearing. A grid item defaults to
       min-width:auto, so it refuses to shrink below its content's min-content
       width — which pushed this panel 44px past a 320px viewport and made the
       whole PAGE scroll sideways. */
    <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-14">
      <div className="flex min-w-0 flex-col gap-6">
        <p className="bg-on-band-dark/10 text-on-band-dark/80 inline-flex w-fit items-center gap-2 rounded-full px-3.5 py-1.5 text-[0.6875rem] font-bold tracking-[0.12em] uppercase">
          <Sparkles size={13} aria-hidden="true" />
          AI assistant
        </p>

        <h2 id="assistant-heading" className="text-h2 text-on-band-dark">
          Ask anything about{" "}
          <em className="accent-phrase text-accent">Khel Shiksha.</em>
        </h2>

        <p className="measure text-body text-on-band-dark/80">
          Kits, pillars, teacher training, NEP alignment or how a rollout works
          in your school — get an answer right away.
        </p>

        <ul className="flex flex-col gap-2.5">
          {SUGGESTIONS.map((suggestion) => (
            <li key={suggestion}>
              <button
                type="button"
                onClick={() => ask(suggestion)}
                disabled={busy}
                className="border-on-band-dark/20 bg-on-band-dark/[0.06] text-body-sm text-on-band-dark/90 hover:border-on-band-dark/40 hover:bg-on-band-dark/10 w-full rounded-[var(--radius-md)] border px-4 py-3 text-left transition-colors disabled:opacity-50"
              >
                {suggestion}
              </button>
            </li>
          ))}
        </ul>

        <p className="text-body-sm text-on-band-dark/70">
          Would rather talk to a person?{" "}
          <Link
            href="/contact?type=school-demo"
            className="text-accent font-semibold underline underline-offset-4"
          >
            Book a demo
          </Link>
          .
        </p>
      </div>

      <div className="border-on-band-dark/15 bg-on-band-dark/[0.06] flex min-w-0 flex-col gap-3 rounded-[var(--radius-xl)] border p-4 sm:p-5">
        <div
          ref={logRef}
          /* tabIndex=0 and a label because this is a scrollable region: once
             the conversation overflows, a keyboard-only visitor has no way to
             reach the text above the fold without a focusable container. Axe
             flags it as `scrollable-region-focusable`, and the flag was right
             — this was already true before the scrollbar was hidden, it just
             never fired because the standing suite never fills the chat.
             role=log so assistive tech treats it as an appending transcript.

             scrollbar-none hides the painted bar only; wheel, trackpad, touch
             and arrow keys all still scroll it. */
          tabIndex={0}
          role="log"
          aria-label="Conversation with the assistant"
          className="flex min-h-[15rem] scrollbar-none flex-col gap-4 overflow-y-auto sm:max-h-[26rem] sm:min-h-[19rem]"
        >
          {!hasConversation ? (
            <p className="bg-on-band-dark/10 text-body-sm text-on-band-dark/85 rounded-[var(--radius-md)] px-4 py-3">
              Namaste! Ask me about the kits, teacher training, or how a rollout
              works in your school.
            </p>
          ) : null}

          {turns.map((turn, i) => (
            <div
              key={i}
              className={
                turn.role === "user"
                  ? "bg-accent text-body-sm text-on-accent ml-auto max-w-[85%] rounded-[var(--radius-md)] px-4 py-2.5 font-medium"
                  : "bg-on-band-dark/10 text-body-sm text-on-band-dark/90 max-w-[92%] rounded-[var(--radius-md)] px-4 py-3 whitespace-pre-wrap"
              }
            >
              {turn.role === "assistant"
                ? linkifyPaths(turn.content, pageLabels)
                : turn.content}
            </div>
          ))}

          {streaming !== "" ? (
            <div className="bg-on-band-dark/10 text-body-sm text-on-band-dark/90 max-w-[92%] rounded-[var(--radius-md)] px-4 py-3 whitespace-pre-wrap">
              {/* Not linkified while streaming: a path can arrive split
                  across chunks, so it would flicker between plain text and a
                  link as the halves land. Linked once the answer settles. */}
              {streaming}
            </div>
          ) : null}

          {busy && streaming === "" ? (
            <p className="text-body-sm text-on-band-dark/60">Thinking…</p>
          ) : null}
        </div>

        {/* Announced once, when the answer is complete. */}
        <p className="sr-only" role="status" aria-live="polite">
          {announce}
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            ask(inputRef.current?.value ?? "");
          }}
          className="flex flex-col gap-2"
        >
          <label htmlFor="assistant-input" className="sr-only">
            Your question about Khel Shiksha
          </label>
          <div className="flex gap-2">
            <input
              ref={inputRef}
              id="assistant-input"
              name="question"
              type="text"
              maxLength={600}
              autoComplete="off"
              placeholder="Type your question…"
              disabled={busy}
              className="border-on-band-dark/25 bg-band-dark text-body text-on-band-dark placeholder:text-on-band-dark/50 h-12 min-w-0 flex-1 rounded-[var(--radius-md)] border px-4 disabled:opacity-60"
            />
            <Button
              type="submit"
              disabled={busy}
              className="bg-on-band-dark text-band-dark hover:bg-accent hover:text-on-accent"
            >
              <CornerDownLeft size={16} aria-hidden="true" />
              Ask
            </Button>
          </div>
          <p className="text-on-band-dark/55 text-[0.75rem]">
            AI-generated. Confirm details with the team before you commit to a
            programme.
          </p>
        </form>
      </div>
    </div>
  );
}
