/**
 * My initial prediction was that the heapUsed would icrease over time linearly, and that the process would die when it ran out of memory.
 * I thought that it would consume all the free OS memory and then crash.
 * But on my machine, V8 has a default limity of 4GB. (run v8.getHeapStatistics().heap_size_limit to check)
 * Buffer version: died when the OS/malloc ran out (rss ~9.5 GB), heapUsed tiny.
 * Heap version: dies at V8's heap limit, long before the OS runs out.
 * Observations:
 * The Buffer object (a small wrapper) lives in the V8 heap; its bytes live outside,
 * allocated by Node. The GC doesn't count or scan those bytes, but frees them
 * when the wrapper is collected. In my first run the Map kept every wrapper alive.
 */
const globalCache = new Map();
let iterationCount = 0;
const mb = (n) => (n / 1024 / 1024).toFixed(1);

function loop() {
    iterationCount++;
    if (iterationCount % 1000 === 0) console.log(`iter ${iterationCount} | heapUsed: ${mb(process.memoryUsage().heapUsed)} MB`);

    const uniqueKey = `key-${iterationCount}`;
    globalCache.set(uniqueKey, {
        data: new Array(10000).fill('some data'),
    });

    setImmediate(loop);
}

setImmediate(loop);