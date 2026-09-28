# STATUS

> Living state file. Claude: read this at session start, update it at session end. Newest entries on top.

**Last session:** 2026-09-27 (short check-in on time budget — no technical content covered)
**Current phase:** 1 — Node.js Internals (**restarted from the Event Loop, 0/6 topics coded**)
**Time budget:** ~12h/week (2h/day × 6 days; about 70% hands-on / 30% reading **as a weekly average**, not per day — topic-start days can be reading-heavy, but every reading block is followed by code within 1–2 sessions; 1h/day floor on bad days — rule 10). Changed 2026-09-27 from 3h/day, which never started. 2h is what fits around his full-time job plus tutoring. Treat it as the real ceiling on weekdays, not a floor to push up.
**Ready to apply target:** ~Feb–Mar 2027 at 12h/week (ROADMAP timeline table still shows the 15–18h/week pace — deliberately not re-planned)
**Next up (committed start: 2026-09-28):** `git init` → `00-event-loop-order.js` warm-up (see lab README step 0) → then the pending quiz as a diagnostic → then leak script #1

---

## Next session plan — day one, ~3h

**Step 0 — 5 min, infra.** `git init` + first commit in English (`chore: initial roadmap scaffold`). Still no git repo as of 2026-09-02.

**Step 1 — ~60 min, code first.** Write `labs/phase-1-memory-leak-lab/00-event-loop-order.js`. Predict the order in a comment before running. Run it 10 times. Then wrap it in an `fs.readFile` callback and predict again. Bring Claude the file + output. **No reading before this step.**

**Step 2 — ~45 min, diagnostic.** Answer the 6 pending quiz questions below in chat. Not a gate anymore — it tells us how much of Event Loop / V8 survived the pause. Whatever is missed becomes the reading list for step 3.

**Step 3 — ~45 min, targeted reading.** Only what step 2 exposed. Default: the thread pool section of *"Don't Block the Event Loop"* (gap #1). Then re-explain `await fetch()` end-to-end in ~2 min, in English.

**Step 4 — remaining time.** Start leak script #1 (`01-global-cache`): unbounded module-level `Map`, driven by a loop, logging `process.memoryUsage().heapUsed` every N iterations.

> Rule 9 check: ~45 min of input, ~2h of coding. Right ratio.

### The pending quiz (issued 2026-08-26, now a diagnostic)

1. Which of these go through the libuv thread pool, and which don't — `fetch()` HTTP traffic, `fs.readFile`, `crypto.pbkdf2`, `dns.lookup`, `dns.resolve`, `net.connect`, `zlib.gzip`? One line of *why* for each.
2. Predict the output of `setTimeout(…,0)` / `setImmediate` / `process.nextTick` / `Promise.resolve().then()` / sync `console.log` in one block — then say what changes if the same block runs inside an `fs.readFile` callback. *(Step 1 answers this with code.)*
3. p50 is a flat 40ms; p99 spikes to 900ms a few times an hour; logs are clean. How do you confirm or rule out GC? What do you turn on, what metric, and what *shape* in that metric proves it?
4. A `Map` cache grows forever. What happens inside V8 as it grows — which generation, what the GC does each cycle, and why pauses get *worse* over time rather than staying constant.
5. Why does `process.nextTick` recursion starve the loop while `setImmediate` recursion doesn't? Be precise about *when* each queue drains.
6. Explain `await fetch(...)` in Node end-to-end in under 2 minutes.

---

## Open gaps (re-test until closed)

1. ❗ **Thread pool misconception** *(open since 2026-07-28, unverified)*. Believed network I/O (`fetch`) runs on the libuv thread pool. Reality: sockets use kernel async I/O (epoll / kqueue / IOCP) — no thread waits on them. The thread pool (default 4 threads, `UV_THREADPOOL_SIZE`) serves `fs`, `dns.lookup`, some `crypto` (pbkdf2/scrypt), and `zlib`. Also: a Promise doesn't "run on a thread" — it's just an object with state and callbacks; JS runs only on the main thread.
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

- 2026-09-27: "do you think…" → capitalize the first word of a sentence; "too low" → *"too little"* for amounts of time; "i`ll" → *"I'll"* (capital I, and an apostrophe instead of a backtick); "concilate with work" → *"fit it around work"* / *"balance it with work"* ("concilate" isn't an English word — PT "conciliar" calque).
- 2026-09-02: first three messages in Portuguese — repo rule is English only, including quick questions. Fourth message in English: "make the changes you find necessary(content you mentioned)" → space before the parenthesis: *"necessary (the content you mentioned)"*; "update what is needed(only needed)" → *"update only what's needed."* From the PT drafts: *"since I started"* (past tense after "since"), *"from scratch"* (not "from 0"), *"3–4 hours"* (not "3/4 hours" — reads as three-quarters).
- 2026-08-26: "It's been a while since I don't study" → *"since I last studied"* / *"I haven't studied in a while"* (PT calque — English can't use present tense after "since I"); "let's reset, It's been a while" and "One side question, how long…" → comma splices, use a period or colon; "I can commit to it 2–4 hours a day" → *"I can commit 2–4 hours a day."*
- 2026-07-28: "faster **then**" → *than*; "untill" → *until*; "theh" → *the*; "the fragment of the memory" → *memory fragmentation*; several comma-spliced run-ons → shorter sentences, one idea per sentence, re-read before sending.

---

## Log

- **2026-09-27** — 25 days since the last session, still zero code. Yuri asked whether 2h/day is enough. Answer: yes. At ~12h/week he's ready around Feb–Mar 2027, only ~1 month behind the 3h/day plan and much more sustainable. The budget changed in this file only; there was no roadmap rewrite. Yuri committed to starting the day-one plan on **2026-09-28**. Rule 8 applies, so the step 2 diagnostic doubles as the re-entry quiz. If 2026-09-28 passes without code, raise it directly next session.
- **2026-09-02** — **Roadmap review, content patch to v4.1.** Verdict: plan content is sound; execution is the problem. Changes (no dates moved): Phase 1 theory-only ticks removed per rule 2, Phase 1 restarts from the Event Loop with a coding warm-up (`00-event-loop-order.js`, lab README step 0); new **Cross-cutting threads** section (weekly DSA from Phase 2, security/auth in Phase 4, TS depth in Phase 3, HTTP/networking + graceful shutdown in Phase 1, one ADR per project); API design named in Phase 4; book chapters corrected to 1–6 + 12. Yuri asked to "start from scratch" with 3–4h/day — the same commitment as 2026-08-26, so the plan was patched, not rebuilt. Aug 27 plan still not executed: no git repo, no code. Quiz still unanswered; downgraded from gate to diagnostic so day one starts with code.
- **2026-08-26** — **Reset session.** Repo scanned: docs complete, but **zero code**, no `notes/` write-ups, and no git repo. Re-entry quiz issued (6 questions) but not answered — both 2026-07-28 gaps remain open. Time budget raised to 15–18h/week; ROADMAP re-cut to v4 and pulled forward ~2 months (apply target Feb–Mar 2027 → **mid-Jan 2027**). Rules 9 (consolidation limit) and 10 (sustainable beats heroic) added. Phase 7 moved to start in parallel from Phase 4.
- **2026-07-28** — Resumed after ~2.5 months. Re-entry quiz (6 questions, Event Loop + V8/GC): 4 solid, 2 gaps. Repo scaffold created. Timeline shifted ~3 months.
- **May 2026** — Phase 1 started: Event Loop ✅ and V8/GC ✅ (theory only). Paused due to lack of time; the Memory Leak Lab was never started.
