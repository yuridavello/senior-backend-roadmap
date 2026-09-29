/**
 * My predicted output is:
1 - I love my girlfriend Maria! (console logs are synchronous and executed in order by the call stack)
2 - I`ll write her a love letter! (same thing)
3 - I`ll propose to her! (process.nextTick has priority 1 and are drained between callbacks)

Now the nondeterministic pairs:
setImmediates run in the check phase, right after poll
setTimeouts run in the timer phase, which the first one, but if the loop pass through timer before the timeout call-back is ready to be
executed(timeout(fn , 0) is not really immediate, node clamps it to at least 1ms), then the setImmediate runs first

4 - I`ll marry her one day!
5 - I`ll buy her a ring!
6 - I`ll ask her parents for permission!
7 - I`ll take her on a date! (Promises priority 2, microtask queue, drained by node but after process.nextTick)
8 - I`ll take her on a romantic getaway (if timeout was ready before setImmediate)
9 - I`ll plan a surprise proposal!

Observations: 
In one run out of 10, the setImmediate was executed between the two setTimeouts, 
the reason is that the second setTimeout was not ready to be executed after the first one, so the loop passed through the check phase,
executed the setImmediate, and then went back to the timer phase to execute the second setTimeout.

In the first run, the order was slightly different, 2 lines changed.
Let's understand the mechanism first: the countdown starts as soon as the function is called by the JS engine, but the loop checks the clock every iteration,
not at every moment.
so what might have happened is that the first timeout was read by the callstack, the countdown started and before the second timeout was ready,
the loop iterated, passing through the check phase and executing the setImmediate call-back before the second timeout. The second call runs a moment later,
and sometimes that moment crosses 1ms boundary.
 */

console.log('I love my girlfriend Maria!');

setTimeout(() => console.log('I`ll marry her one day!'), 0);

process.nextTick(() => console.log('I`ll propose to her!'));

setImmediate(() => console.log('I`ll take her on a romantic getaway!'));

setTimeout(() => {
    console.log('I`ll buy her a ring!');

    Promise.resolve().then(() => console.log('I`ll take her on a date!'));

    setImmediate(() => console.log('I`ll plan a surprise proposal!'));

    process.nextTick(() => console.log('I`ll ask her parents for permission!'));
}, 0);

console.log('I`ll write her a love letter!');