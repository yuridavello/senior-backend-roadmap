# Memory Leak Lab — Notes

> Before/after for each leak, with real numbers. Written in my own words.

---

## Leak #1 — Unbounded global cache (`02-global-cache.js`)

### 1. The leak

<!-- What does the script do? Why can't the GC free the arrays? -->
The script is a global cache that stores an Array in a Map on each iteration.
The GC can't free the arrays because they're alive, reachable from a GC root, which is the globalCache, a module-level variable that lives as long as the process does.

### 2. Diagnosis

**`--trace-gc`:**

<!-- What the GC lines showed: Scavenge vs Mark-Compact, pause times, how it died. -->
Since the objects kept getting promoted, Scavenges freed nothing. Mark-Compact started to run one right after the other with longer pauses (435 → 813 → 1,023 ms).
It died when the process reached the heap limit (~4 GB): FATAL ERROR: Reached heap limit.


**Heap snapshot comparison:**

<!-- Top constructor, number of new objects, size delta. -->
I took two snapshots 20 seconds apart.
The top constructor was Array. It showed 36 new instances and a size delta of +2.8 MB.

**Retainer chain:**

<!-- One line per link, plus one sentence on why that link keeps the next one alive. -->

1. elements in Array -> the Array holds the store through its elements property
2. data in {data} -> the entry object holds the Array through its data property
3. 257 in internal array -> the hash table's internal array holds the entry object through slot 257
4. table in Map -> the Map holds the hash table
5. globalCache -> module-level variable, so it's a GC root that lives as long as the process does; it holds the map


### 3. Fix

<!-- What you changed and why. Why isn't TTL alone enough? -->
I added two eviction policies. First, a TTL with a cleanup function to clean old entries.
But that wasn't enough: TTL limits age, not count. To fix that, I added a max size limit to the cache.

### 4. After

<!-- Numbers after the fix: size delta, cache size, heap. -->
After the fix, the size delta went to 0 KB and the cache size stayed at 25 entries.

---

## Leak #2 — Event listeners (`03-event-listeners.js`)

### 1. The leak


### 2. Diagnosis


### 3. Fix


### 4. After


---

## Leak #3 — Closures (`04-closures.js`)

### 1. The leak


### 2. Diagnosis


### 3. Fix


### 4. After


---

## Bonus — How would each leak show up in production before the OOM kill?

<!-- Think: p99, heap trend, GC pause metrics, event loop delay. -->

