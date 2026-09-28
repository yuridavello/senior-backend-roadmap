# Lab: Memory Leak Lab (Phase 1)

**Goal:** cause, diagnose, and fix three classic Node.js memory leaks — and watch the GC struggle while you do it.

**Rule:** Yuri writes all the code. Claude reviews, hints, and quizzes — no solution code. (Claude may scaffold package.json/tsconfig/npm scripts if asked.)

## Step 0 — warm-up: `00-event-loop-order.js` (day one, ~1h)

Not a leak — the event loop restart. One block with sync `console.log`, `setTimeout(…, 0)`, `setImmediate`, `process.nextTick`, `Promise.resolve().then()`.

- [ ] Write the predicted output order **before running**, with one line of *why* per entry (in English, in a comment at the top of the file)
- [ ] Run it. Does it match? Run it 10 times — does the `setTimeout(0)` / `setImmediate` order ever flip? Why?
- [ ] Wrap the same block in an `fs.readFile` callback. Predict again, run again, explain what changed
- [ ] Bring Claude the file and the output

## The three leaks (one script each)

1. `01-global-cache` — a module-level `Map` used as a cache with no eviction, fed by a loop simulating requests
2. `02-event-listeners` — listeners accumulating on a long-lived `EventEmitter` (e.g. a new handler registered per "request", never removed)
3. `03-closures` — closures retaining references to large objects (e.g. a big buffer captured by a callback that's kept around)

## For each script

- [ ] Drive load (loop or fake requests) and log `process.memoryUsage().heapUsed` every N iterations
- [ ] Confirm the leak: heap **baseline** climbs across GC cycles (sawtooth that trends up)
- [ ] Run with `--inspect`, take 2–3 heap snapshots in Chrome DevTools, and find the **retainer chain**
- [ ] Run with `--trace-gc` and watch pause duration/frequency grow as the heap grows ← *this closes STATUS gap #2 hands-on*
- [ ] Fix the leak (eviction/LRU, `removeListener`/`once`, releasing references)
- [ ] Document before/after in `NOTES.md` with real numbers (heap MB over time, GC pause ms)

## Bonus

- Instrument with `clinic.js` (doctor / heapprofiler) and compare the before/after graphs
- Answer in `NOTES.md`, in English: *"How would each of these leaks show up in production metrics before the OOM kill?"* (think: p99, heap trend, GC pause metrics, event loop delay)

## Definition of done

- 3 leaks reproduced, diagnosed via snapshot retainers, fixed, documented with numbers
- You can explain each retainer chain out loud, in English, in under 2 minutes
