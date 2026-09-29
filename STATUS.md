# STATUS

> Living state file. Claude: read this at session start, update it at session end. Newest entries on top.

**Last session:** 2026-09-29 (~2h) — leftovers closed, quiz Q1 done (5/7), `notes/event-loop.md` written and reviewed.
**Current phase:** 1 — Node.js Internals (Event Loop: lab coded + note written; **tick pending** only on quiz Q4 (nextTick starvation) + Q5 (`await fetch` end-to-end), which are part of the topic's definition in ROADMAP)
**Time budget:** ~12h/week (2h/day × 6 days; about 70% hands-on / 30% reading **as a weekly average**, not per day — topic-start days can be reading-heavy, but every reading block is followed by code within 1–2 sessions; 1h/day floor on bad days — rule 10). Changed 2026-09-27 from 3h/day, which never started. 2h is what fits around his full-time job plus tutoring. Treat it as the real ceiling on weekdays, not a floor to push up.
**Ready to apply target:** ~Feb–Mar 2027 at 12h/week (ROADMAP timeline table still shows the 15–18h/week pace — deliberately not re-planned)
**Next up:** quiz Q2 (GC / p99) → Q3 → Q4 → Q5 → tick Event Loop if Q4+Q5 pass → leak script #1

---

## Next session plan — ~2h

**Step 1 — ~40 min, rest of the diagnostic quiz**, one question per message (in chat, from memory, "I don't know" is valid). Q1 done 2026-09-29. Remaining, in order:
- **Q2** (asked 3× on 2026-09-29, never answered — start here): p50 flat 40ms, p99 spikes to 900ms a few times an hour, logs clean. How do you confirm/rule out GC — what do you turn on, what metric, what *shape*?
- **Q3:** A `Map` cache grows forever: which generation, what GC does each cycle, why pauses get *worse* over time.
- **Q4:** Why does `nextTick` recursion starve the loop and `setImmediate` recursion doesn't — precisely when each queue drains.
- **Q5:** `await fetch(...)` end-to-end in under 2 minutes (~250 words, English). Should now include: DNS via `dns.lookup` on the thread pool, socket I/O via kernel async, callback/promise resolution back on the main thread.

If Q4 + Q5 pass → tick **Event Loop in depth** in ROADMAP (lab coded ✅, note ✅).

**Step 2 — remaining time.** Targeted reading only on what Q2/Q3 exposed (V8/GC), then start leak script #1 (`02-global-cache` — `00`/`01` names are taken): unbounded module-level `Map`, driven by a loop, logging `process.memoryUsage().heapUsed` every N iterations.

### Results — 2026-09-29

- **Leftovers closed.** `00` comment explains the split run (countdown starts when `setTimeout()` is *called*; loop reads the clock once per iteration; ms boundary). Needed one nudge ("read" → "called"). `01`: confirmed `ENOENT` — old path resolved to `labs\ROADMAP.md` (cwd-relative); `throw` in the callback crashed the process uncaught, as he predicted.
- **Q1 (thread pool):** 5/7 correct + 1 "don't know" (`dns.resolve` → c-ares, sockets, not the pool) + `net.connect` right but unsure. Rule stated was "APIs not exposed by the kernel" — incomplete; added the second reason (CPU-bound: crypto, zlib) after prompting. Taught: `fetch()` DNS step uses `dns.lookup` → thread pool. **Gap #1 largely closed** — re-check once in Q5.
- **`notes/event-loop.md`** (first note in the repo): written by Yuri (~30 min), reviewed, 5 technical fixes applied by him (callback runs on main thread / fs op on pool, nextTick has its own queue, CPU-bound reason, `dns.lookup` specifically, "blocking I/O" in the one-liner). Claude did the `.txt` → `.md` conversion and formatting only; wording is his. English fixes applied by him.
- Asked Claude to "refine the words" in the note → declined once (English practice), he applied the fixes himself without pushback.

**Pacing note for Claude:** keep each reply to **one or two asks**, not five. 2026-09-28 ended early because feedback stacked up (code review + English notes + quiz in the same message) — Yuri called it "too much" and "tough". Lead with what went well; batch English notes short.

### Results — 2026-09-28 (warm-up)

- `00` (main script), 10 runs: timers-first 7, immediate-first 2, **split `marry → getaway → ring` 1**. Prediction v1 omitted the `getaway` line (v1 was overwritten, not kept); the nondeterminism reason was backwards in v1, fixed in v2 (mentions the 1ms clamp). His explanation of the split run: mechanism right, *why* timer 2 wasn't ready → "I don't know" (explained, see step 1).
- `01` (inside `fs.readFile` callback), 10 runs: **10/10 match his prediction**, correct reasoning (poll → check → next-iteration timers). Fixed the missing `fs` import and path using ESM `import.meta.dirname`; added `if (err) throw err`.
- Prediction Q: "`throw` inside the readFile callback — does a surrounding try/catch catch it?" → **Pass**: no, try block already exited; becomes `uncaughtException`. **But** said "fs.readFile delegates the reading to the OS" — wrong, fs runs on the libuv thread pool (gap #1 still open).
- Minor: gave "to avoid CPU infinite loops" as the reason for the 1ms clamp — unsourced; removed.

---

## Open gaps (re-test until closed)

1. 🟡 **Thread pool misconception** *(open since 2026-07-28; resurfaced 2026-09-28; **mostly closed 2026-09-29** — Q1 5/7, note corrected. Re-check inside Q5 `await fetch`)*. Believed network I/O (`fetch`) runs on the libuv thread pool. Reality: sockets use kernel async I/O (epoll / kqueue / IOCP) — no thread waits on them. The thread pool (default 4 threads, `UV_THREADPOOL_SIZE`) serves `fs`, `dns.lookup`, some `crypto` (pbkdf2/scrypt), and `zlib`. Also: a Promise doesn't "run on a thread" — it's just an object with state and callbacks; JS runs only on the main thread.
2. ❗ **Production observability of GC** *(open since 2026-07-28, unverified)*. Didn't know percentiles (p50/p95/p99) or how to confirm GC-caused latency. GC signature: **stable p50, intermittent p99 spikes**. Tooling: `--trace-gc`; heap baseline trend (sawtooth = normal, climbing baseline = leak); `perf_hooks` PerformanceObserver with `'gc'` entries; `monitorEventLoopDelay`; prom-client's `nodejs_gc_duration_seconds`. → Close this hands-on in the Memory Leak Lab.

### Verified solid (2026-07-28, due for re-test)

- Event loop ordering incl. timer clamping; `setTimeout(0)` vs `setImmediate` nondeterminism in the main script; setImmediate-first inside I/O callbacks
- `process.nextTick` recursion starves the loop; `setImmediate` recursion doesn't
- CPU-bound mitigation: chunking with setImmediate, worker_threads, external queue + workers
- Generational GC: nursery, promotion after surviving two collections, Scavenge semi-space copy, Mark-Sweep-Compact and why compaction exists
- Precision notes: nextTick queue ≠ microtask queue (nextTick drains fully first); since Node 11 microtasks drain after **each individual** timer/immediate callback, not only between phases

---

## Risk to watch: the pause pattern — and its cousin, the re-plan

Two pauses so far — **May → Jul 2026 (~2.5 months)** and **Jul 28 → Aug 26 (~1 month)**. Combined cost: roughly 4 months of calendar time for 2 theory topics. This is the single biggest threat to the January 2027 target, and it is a bigger threat than any technical gap on the list.

New observation (2026-09-02): **four sessions, four planning/reset documents, zero lines of code.** The Aug 27 day-one plan did not happen. Re-planning feels like progress and isn't. Claude: if Yuri asks for another roadmap rewrite before Phase 1 has code in it, decline and point here.

Countermeasure (rule 10): if a week goes badly, drop to **1h/day, not zero**. The floor matters more than the ceiling.

---

## English writing notes (running list)

- 2026-09-29: lowercase sentence starts in almost every message ("done, can you check?" → *"Done. Can you check?"*); "30 **minutos**" (PT slip); "not **exposured**" → *exposed*; "until they're **resolve**" → *resolved*; "**the** libuv" → *libuv* (proper nouns take no article — he asked why, explained: "the" only when the name modifies a noun, e.g. "the V8 engine"); requests as bare imperatives → phrase as questions. Backtick-apostrophe: none this session. 
- 2026-09-28: **backtick instead of apostrophe** ("I\`ll", "I\`ve", "didn\`t") in every message and in code strings — keyboard habit (US-Intl dead key: `'` then Space). "there **was** 2 **crash**" → *"there were two crashes"*; "transformed in a uncaughtException" → *"becomes an uncaughtException"* (PT "transformado em"); all-caps "I DON'T KNOW" reads as shouting; bare imperatives ("add the comments in the file") read as curt on Slack. **Pending in file comments:** `00` — "which the first one" → *"which is the first one"*, "if the loop pass" → *"passes"*, "executed(" → *"executed ("*, "nextTick has priority 1 and are drained" → *"its queue is drained"*, comma splice on line 20 (*"…setTimeouts. The reason is…"*); `01` — "the call-back guarantee" → *"the callback guarantees"*.
- 2026-09-27: "do you think…" → capitalize the first word of a sentence; "too low" → *"too little"* for amounts of time; "i`ll" → *"I'll"* (capital I, and an apostrophe instead of a backtick); "concilate with work" → *"fit it around work"* / *"balance it with work"* ("concilate" isn't an English word — PT "conciliar" calque).
- 2026-09-02: first three messages in Portuguese — repo rule is English only, including quick questions. Fourth message in English: "make the changes you find necessary(content you mentioned)" → space before the parenthesis: *"necessary (the content you mentioned)"*; "update what is needed(only needed)" → *"update only what's needed."* From the PT drafts: *"since I started"* (past tense after "since"), *"from scratch"* (not "from 0"), *"3–4 hours"* (not "3/4 hours" — reads as three-quarters).
- 2026-08-26: "It's been a while since I don't study" → *"since I last studied"* / *"I haven't studied in a while"* (PT calque — English can't use present tense after "since I"); "let's reset, It's been a while" and "One side question, how long…" → comma splices, use a period or colon; "I can commit to it 2–4 hours a day" → *"I can commit 2–4 hours a day."*
- 2026-07-28: "faster **then**" → *than*; "untill" → *until*; "theh" → *the*; "the fragment of the memory" → *memory fragmentation*; several comma-spliced run-ons → shorter sentences, one idea per sentence, re-read before sending.

---

## Log

- **2026-09-29** — Second session in a row (**no pause**). ~2h, ended on time by Yuri to go to work — a clean stop, not an overwhelm stop. Closed both leftovers, quiz Q1 (5/7), wrote the first `notes/` entry (event loop) and applied review fixes himself. One-ask-per-reply pacing worked: no friction. Q2 (GC) asked but deferred to next session.
- **2026-09-28** — **The streak of planning-only sessions is broken: first code in the repo.** Git repo initialized. `00-event-loop-order.js` + `01-event-loop-order.js` written, predicted, run 10× each, outputs analyzed. The data surfaced a third ordering (timer / immediate / timer) that he partially explained. Error-handling detour on `01` (silent `err`, cwd-relative path, throw in async callback) went well. Session ended early by Yuri ("too much for today… you're being tough") after review feedback + English notes + a 5-question quiz stacked in one reply. Leftovers are small (see Next session plan step 1). Nothing ticked in ROADMAP — Event Loop topic needs the `00` comment finished + a `notes/` write-up.
- **2026-09-27** — 25 days since the last session, still zero code. Yuri asked whether 2h/day is enough. Answer: yes. At ~12h/week he's ready around Feb–Mar 2027, only ~1 month behind the 3h/day plan and much more sustainable. The budget changed in this file only; there was no roadmap rewrite. Yuri committed to starting the day-one plan on **2026-09-28**. Rule 8 applies, so the step 2 diagnostic doubles as the re-entry quiz. If 2026-09-28 passes without code, raise it directly next session.
- **2026-09-02** — **Roadmap review, content patch to v4.1.** Verdict: plan content is sound; execution is the problem. Changes (no dates moved): Phase 1 theory-only ticks removed per rule 2, Phase 1 restarts from the Event Loop with a coding warm-up (`00-event-loop-order.js`, lab README step 0); new **Cross-cutting threads** section (weekly DSA from Phase 2, security/auth in Phase 4, TS depth in Phase 3, HTTP/networking + graceful shutdown in Phase 1, one ADR per project); API design named in Phase 4; book chapters corrected to 1–6 + 12. Yuri asked to "start from scratch" with 3–4h/day — the same commitment as 2026-08-26, so the plan was patched, not rebuilt. Aug 27 plan still not executed: no git repo, no code. Quiz still unanswered; downgraded from gate to diagnostic so day one starts with code.
- **2026-08-26** — **Reset session.** Repo scanned: docs complete, but **zero code**, no `notes/` write-ups, and no git repo. Re-entry quiz issued (6 questions) but not answered — both 2026-07-28 gaps remain open. Time budget raised to 15–18h/week; ROADMAP re-cut to v4 and pulled forward ~2 months (apply target Feb–Mar 2027 → **mid-Jan 2027**). Rules 9 (consolidation limit) and 10 (sustainable beats heroic) added. Phase 7 moved to start in parallel from Phase 4.
- **2026-07-28** — Resumed after ~2.5 months. Re-entry quiz (6 questions, Event Loop + V8/GC): 4 solid, 2 gaps. Repo scaffold created. Timeline shifted ~3 months.
- **May 2026** — Phase 1 started: Event Loop ✅ and V8/GC ✅ (theory only). Paused due to lack of time; the Memory Leak Lab was never started.
