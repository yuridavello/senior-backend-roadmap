# Event Loop — 2026-09-29

**In my own words (3–6 sentences, English):**

Node is a JavaScript runtime environment that runs the V8 JavaScript engine outside of the browser. But JavaScript is a single-thread language, so the mechanism that allows node to be fast and handle multiple tasks is the event loop (the engine is a C-based library called LIBUV), allowing async non-blocking I/O event-oriented operations. Node works as a 'glue' between the V8 engine (runs the JS code) and the event loop. The event loop initializes as soon as the process is up, but iterates when the call stack is empty.

It has 6 phases:

1. **timers** → runs timeouts and intervals callbacks
2. **pending callbacks** → callbacks for some system operations, such as TCP errors, pushed to the next loop iteration
3. **IDLE** → internal operations
4. **poll** → retrieves new I/O events, run their callbacks, waits for more events
5. **check** → runs setImmediate callbacks
6. **close callbacks** → run cleanup tasks like closing a socket connection

The event loop can 'sleep' and wait for new I/O events in the poll phase.

Promises and `process.nextTick()` are drained between callbacks. Promises are queued in the microtask queue, `process.nextTick()` has its own VIP queue. Node drains them, `process.nextTick()` has priority 1 and Promises priority 2. We have to be careful when using `process.nextTick()`, since they're executed between callbacks with the higher priority, if used with lack of knowledge it can starve the event loop, preventing it from iterating.

Libuv has a thread pool to run operations that don't have non-blocking async APIs provided by the kernel and heavy CPU-bound work. Obviously to prevent the event loop from blocking. So fsReadFile reading operation,  dns.lookup, crypto and zlib explicitly use the pool of threads. On the other hand, there are some operations that are delegated to the kernel, such as network operations and some other operations that the kernel can handle asynchronously. They communicate through kernel's event notification system (epoll on linux, kqueue on macOS and IOCP on Windows).

**One gotcha / common misconception:**

`setTimeout(fn, 0)` vs `setImmediate` is nondeterministic in the main script and deterministic inside I/O callbacks.

**Interview one-liner (how I'd answer in 20 seconds):**

Node is an environment that allows JS code to run outside of the browser. Even though JS is a single-threaded language, Node is extremely fast thanks to its event loop, a C-based library called libuv. The loop handles tasks such as timers, network callbacks and mainly I/O operations, queuing the callbacks when they're ready to be executed. It has a thread pool to run blocking I/O operations and heavy CPU-bound work. Network operations are delegated to the kernel.

**Where I used it (code / lab / link):**

- `labs/phase-1-memory-leak-lab/00-event-loop-order.js`
- `labs/phase-1-memory-leak-lab/01-event-loop-order.js`

---
*Claude: review this note for technical accuracy AND English writing. List corrections at the end.*
