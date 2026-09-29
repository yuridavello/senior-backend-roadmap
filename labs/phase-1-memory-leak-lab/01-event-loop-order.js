/**
 * In a fs.readFile call-back, the call-back guarantee the code is being executed in the poll phase
That ensures setImmediate now is executed before timers, because check phase is right after poll.
So the output order is:
1 - I love my girlfriend Maria!
2 - I`ll write her a love letter!
3 - I`ll propose to her!
4 - I`ll take her on a romantic getaway!
5 - I`ll marry her one day!
6 - I`ll buy her a ring!
7 - I`ll ask her parents for permission!
8 - I`ll take her on a date!
9 - I`ll plan a surprise proposal!
 */
import fs from 'fs';
import path from 'path';

const filePath = path.join(import.meta.dirname, '..', '..', 'ROADMAP.md');

fs.readFile(filePath, (err, data) => {
if (err) throw err;

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
});