# GC observability — 2026-10-05

**In my own words (3–6 sentences, English):**

There are two types of GC in Node. Scavenger and Mark-Compact. Scavenger acts on the small young generation, using a from-space and a to-space to free and compact memory. If the piece survives two Scavenges, then it goes to the old generation, which is almost the whole V8 memory heap. Mark-Compact is slower because it has to act on more objects and the old space grows as objects get promoted.

Scavenger marks the reachable objects, copies them to to-space and frees the from-space. Objects born in the nursery then go to the intermediate space and then old space.

The Mark-Compact also marks all the reachable objects, writes the addresses of free memory in a free list (sweep), and if needed, compaction moves the live objects to other pages within the same space, to remove gaps.

The GC stops the main thread for some of its work. This is called "stop the world". So while GC is running, it blocks the event loop, so new requests have to wait. That increases p99.

To check if there's a memory leak in the application, we can look at a few signals. First, `heapUsed` (`nodejs_heap_size_used_bytes` in prom-client, the standard Prometheus library for Node), if it keeps climbing even after GCs, memory is not being freed. If it looks like a sawtooth, it might be ok, because GC is freeing enough memory. To be sure, we can use three production metrics: `perf_hooks` exports some interesting metrics, `monitorEventLoopDelay` (`nodejs_eventloop_lag_seconds`) is one of them. If the delay is spiking, the thread is being blocked, and if the delay matches `nodejs_gc_duration_seconds`, it is GC. If the event loop is smooth but p99 is spiking, then there's something else. `PerformanceObserver` (`nodejs_gc_duration_seconds`) to measure GC pauses, so if a major GC takes more than 100 ms and lines up with the p99 spikes, it is the GC. If the sum of durations divided by total time is above 5-10%, GC is consuming the process. If scavenge is running too much, that means the allocation rate is high, not a leak.

If we diagnose and identify it's a leak, then we can use some tools, such as `v8.writeHeapSnapshot()`, twice, with a minute between them, and compare them in Chrome DevTools. What increased between the two is the leak (`--heapsnapshot-near-heap-limit=1` generates the snapshot near the crash). `--heap-prof` or the inspector shows which functions are allocating more.

**One gotcha / common misconception:**

`process.memoryUsage().heapUsed` shows only the memory used by the V8 heap, but if the leak is coming from `Buffer`, `ArrayBuffer`, what is stored in the heap is only the wrapper that contains the pointers to those objects, so we should monitor the whole `process.memoryUsage()`, tracking `external` and `arrayBuffers`.

**Interview one-liner (how I'd answer in 20 seconds):**

If p99 spikes, we can confirm it's GC using a few steps. First, using `PerformanceObserver` (`nodejs_gc_duration_seconds`), if the `entry.duration` matches the timestamp of the p99 spikes, it is most likely GC. Second, monitoring the `process.memoryUsage().heapUsed` in parallel with the spike, if the `heapUsed` graph fits the sawtooth pattern, and the spike happens at the exact same moment that the memory drops, it is GC.

**Where I used it (code / lab / link):**

- `labs/phase-1-memory-leak-lab/02-global-cache.js`

Two lines from the `--trace-gc` run:

```
[17176:000001F803FE2000]     6676 ms: Scavenge 3720.9 (4125.7) -> 3716.1 (4181.2) MB, pooled: 0 MB, 26.92/ 0.00 ms  (average mu = 0.596, current mu = 0.350) task; 
iter 49000 | heapUsed: 3752.8 MB
[17176:000001F803FE2000]     7225 ms: Mark-Compact 3771.7 (4181.2) -> 3766.1 (4236.5) MB, pooled: 0 MB, 533.41 / 0.00 ms  (average mu = 0.511, current mu = 0.331) task; scavenge might not succeed
```

---
*Claude: review this note for technical accuracy AND English writing. List corrections at the end.*
