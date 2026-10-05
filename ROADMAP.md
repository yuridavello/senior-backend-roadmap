# Backend Evolution Roadmap — Yuri Davello (v4.1)

> **Core principle: learn by doing.** Every phase = concept + hands-on project. No reading 500-page books without coding.
> Based on real research of remote backend Node.js openings at US/EU companies.
> v3 changes (2026-07-28): translated to English (rule 4), timeline shifted ~3 months after a pause, rule 8 added, Phase 1 progress + `--trace-gc` step added to the Memory Leak Lab.
> v4 changes (2026-08-26): **reset after a 1-month pause.** Time budget raised from 5–10h/week to a target of **15–18h/week** (3h/day, 5–6 days). Timeline re-cut and pulled forward ~2 months. Rule 9 added (consolidation limit). Phase 7 now starts in parallel from Phase 4.
> v4.1 changes (2026-09-02): **content patch, no re-plan.** Dates unchanged. Phase 1 theory-only ticks removed (rule 2 — not coded, doesn't count); Phase 1 restarts from the Event Loop, hands-on. Added the **Cross-cutting threads** section (security/auth, weekly DSA, TypeScript depth, HTTP + graceful shutdown, ADRs), API design named in Phase 4, book chapters corrected. **This is the last planning change until Phase 1 is coded.**

## Context

- 4+ years as a backend dev (Node.js/TS)
- Goal: remote roles at international companies (US/EU), general backend
- Available time: **15–18h/week target** (3h/day × 5–6 days). Yuri offered 2–4h/day; 3h is the sustainable middle — see rule 9.
- Effort remaining: **~200–230 hours** of real work (Phases 1–7), of which ~155–170h is Phases 1–6, plus **~25–30h** of cross-cutting threads spread across phases (see section below)

## Timeline (reset 2026-08-26, restart 2026-08-27)

| Phase | Effort | Window | Status |
| --- | --- | --- | --- |
| 0. Habit: Everything in English | ongoing | started | 🔄 In progress |
| 1. Node.js Internals | ~25–30h | **Aug 27 – Sep 10, 2026** | 🔄 Restarted 2026-09-02 from the Event Loop, hands-on (1/6 topics coded) |
| 2. Databases | ~25–30h | Sep 11 – Sep 24, 2026 | ⬜ Pending |
| 3. Testing & Code Quality | ~20h | Sep 25 – Oct 5, 2026 | ⬜ Pending |
| 4. Architecture in Practice | ~25–30h | Oct 6 – Oct 19, 2026 | ⬜ Pending |
| 5. Async & Messaging | ~30h | Oct 20 – Nov 2, 2026 | ⬜ Pending |
| 6. AWS in Practice | ~30h | Nov 3 – Nov 16, 2026 | ⬜ Pending |
| 7. System Design + Observability | ~40–60h | **starts in parallel Oct 6**; main block Nov 17 – Dec 21, 2026 | ⬜ Pending |
| Interview Prep Checkpoint | ~20h | Dec 22, 2026 – Jan 15, 2027 | ⬜ Pending |

**Ready to apply: ~mid-January 2027** (assuming 15–18h/week holds).

### Scenarios

| Pace | Weekly | Ready to apply | Verdict |
| --- | --- | --- | --- |
| Aggressive — 4h/day × 6d | ~24h | ~Nov–Dec 2026 | Possible on paper. Bounded by consolidation, not hours (rule 9). High re-pause risk. |
| **Realistic — 3h/day × 5–6d** | **~15–18h** | **~mid-Jan 2027** | **The bet.** ~40% calendar buffer for life, slippage, and spaced practice. |
| Conservative — 2h/day × 5d | ~10h | ~Mar 2027 | Roughly the old v3 plan. |

> Calendar time is **not** hours ÷ rate. Three things refuse to compress: retention of new concepts, Phase 7's spaced system-design + spoken-English practice, and real-world latency (AWS experiments, load tests, real data on the monitor project).


---

## Parallel Habit: Everything in English (day 1, ongoing)

> **Why:** for candidates from Brazil, the filtering order is: (1) written English in PRs/Slack/design docs, (2) timezone, (3) technical skill. Already fluent — now build technical vocabulary in a work context.

### What to do

- [ ] Commits, PRs, code reviews: all in English, starting today
- [ ] Study notes: in English (use `notes/TEMPLATE.md`)
- [ ] READMEs of practice projects: in English
- [ ] After learning a new concept, write a short paragraph explaining it in English
- [ ] Consume content in English (docs, videos, books); PT-BR only as a complement

### Resource

📖 "On Writing Well" — William Zinsser (not about programming — about writing clearly; it changes your async communication game)

---

## Phase 1: Node.js Under the Hood (3–4 weeks) — IN PROGRESS

> **Why first:** every technical interview for backend Node tests this. You use Node every day but probably can't explain *why* things work.

### Topics

- [x] **Event Loop in depth** — microtasks vs macrotasks, `process.nextTick` vs `setImmediate` vs `setTimeout(0)`, starvation, why a 1-billion-iteration `for` freezes the whole server; what `await fetch()` does end-to-end (kernel async I/O vs the libuv thread pool) *(ticked 2026-10-05: `00`/`01` coded and run, `notes/event-loop.md` written, quiz Q1/Q4/Q5 passed)*
- [ ] **V8 and the Garbage Collector** — heap vs stack, generational GC (young gen / old gen / large object space), how V8 decides what to collect, when GC pauses your app (stop-the-world); how GC shows up in production (p99 spikes, `--trace-gc`, heap trend) *(theory quizzed 2026-07-28; tick removed — same reason)*
- [ ] **Memory Leaks** — closures retaining references, unremoved event listeners, unconsumed buffers/streams, unbounded global caches, diagnosing with `--inspect` and Chrome DevTools
- [ ] **Streams and Backpressure** — why `fs.readFile` on a 2GB file kills your process and `createReadStream` doesn't; readable/writable/transform/duplex; `pipeline()`; when to use them
- [ ] **Cluster and Worker Threads** — child_process, cluster module, worker_threads, when to use each, why Node is single-threaded but not single-process; **graceful shutdown** (SIGTERM → stop accepting, drain in-flight requests, close the DB pool, exit) *(added 2026-09-02)*
- [ ] **Error Handling in Node** — unhandledRejection, uncaughtException, error-first callbacks, why `try/catch` doesn't catch errors in callbacks; when to crash vs recover

### Resources

| Type | Resource | Notes |
| --- | --- | --- |
| 📄 Docs | Node.js official guides | "The Node.js Event Loop", "Don't Block the Event Loop", "Backpressuring in Streams" |
| 📖 Book | "Node.js Design Patterns" — Casciaro & Mammino (3rd ed) | Chapters 1–6 (6 = streams) and 12 (scalability: cluster, workers) |
| 🎥 Video | Erick Wendel — YouTube | Node internals, PT-BR, very good |
| 🎥 Video | "What the heck is the event loop anyway?" — Philip Roberts | Classic talk, 26 min |
| 🛠 Tool | clinic.js (clinicjs.org) | Automated profiling; spots event loop delays and memory issues |

### Hands-on project: "Memory Leak Lab" → `labs/phase-1-memory-leak-lab/`

**Warm-up (day one, ~1h):** `00-event-loop-order.js` — one block with sync `console.log`, `setTimeout(0)`, `setImmediate`, `process.nextTick`, `Promise.resolve().then()`. Predict the order *before* running, in English, with the reason. Then run the same block inside an `fs.readFile` callback and explain what changed. *(added 2026-09-02)*

Create 3 scripts that deliberately cause memory leaks:

1. Unbounded global cache (a `Map` that only grows)
2. Event listeners accumulating on an EventEmitter
3. Closures retaining large objects

For each one:

- [ ] Use `process.memoryUsage()` to confirm the leak
- [ ] Use `--inspect` + Chrome DevTools to take heap snapshots
- [ ] Identify the retainer in the snapshot
- [ ] Run with `--trace-gc` and watch pause duration/frequency grow with the heap *(added 2026-07-28 — closes the GC observability gap)*
- [ ] Fix the leak
- [ ] Document before/after with real numbers

**Bonus:** instrument with `clinic.js` and compare the graphs.

### How to know you've learned it

- [ ] Can explain in 2 min what happens when you `await fetch()` in Node *(pending — thread pool slip on 2026-07-28 quiz)*
- [ ] Can identify a memory leak by reading a heap snapshot
- [ ] Know when to use streams vs loading everything into memory
- [ ] Know the difference between `process.nextTick`, `setImmediate`, and `Promise.resolve().then()` *(quizzed 2026-07-28; re-earn with `00-event-loop-order.js`)*
- [ ] Can implement graceful shutdown and explain what breaks without it

---

## Phase 2: Databases Beyond CRUD (3–4 weeks)

> **Why:** PostgreSQL is the default database for backend roles. Connection pools, indexes, transactions, and isolation levels show up in every system design interview.

### Topics

- [ ] **Connection Pooling** — what it is, why it exists, configuring it (`pg` pool in Node), min/max connections, idle timeout, what happens when the pool is exhausted, why a pool of 5 can beat 50
- [ ] **Indexes in depth** — B-tree internals, when to create one, when NOT to (write amplification), `EXPLAIN ANALYZE`, covering indexes, composite indexes (order matters), partial indexes, GIN/GiST for JSON/full-text
- [ ] **Transactions and Isolation Levels** — ACID, READ COMMITTED vs REPEATABLE READ vs SERIALIZABLE, dirty reads, phantom reads, non-repeatable reads, deadlocks, advisory locks
- [ ] **Query Optimization** — the N+1 problem, JOINs vs subqueries, cursor vs offset pagination, CTEs, window functions
- [ ] **Zero-downtime migrations** — expand-contract pattern, why `ALTER TABLE ADD COLUMN NOT NULL DEFAULT` can lock the table, zero-downtime strategies

### Resources

| Type | Resource | Notes |
| --- | --- | --- |
| 🌐 Site | "Use The Index, Luke" (use-the-index-luke.com) | The best visual guide to SQL indexes |
| 🎥 Video | Hussein Nasser — YouTube | "Database Engineering" playlist |
| 📖 Book | DDIA — Martin Kleppmann | Chapters 2, 3, 7 (storage engines, indexes, transactions) |
| 📄 Docs | PostgreSQL official docs | "Performance Tips" and "Indexes" |
| 🛠 Tool | pgbench | Query benchmarking, ships with PostgreSQL |

### Hands-on project: "Query Optimization Challenge" (on the monitor project)

1. Run the database locally with real data (or generate test data — at least 100k rows)
2. List the system's 5 most-executed queries
3. Run `EXPLAIN ANALYZE` on each and save the output
4. Identify unnecessary sequential scans, missing indexes, N+1 patterns
5. Add strategic indexes and/or rewrite queries
6. Compare execution plans before/after with numbers (e.g. "450ms → 12ms")
7. Document everything in English

**Bonus:** configure the `pg` connection pool and show what happens with pool.max = 2 under load vs pool.max = 20.

### How to know you've learned it

- [ ] Can read an `EXPLAIN ANALYZE` and point at the bottleneck
- [ ] Can explain why a 5-connection pool can beat a 50-connection pool
- [ ] Know when to use a transaction and which isolation level to pick
- [ ] Know what N+1 is and how to fix it

---

## Phase 3: Testing & Code Quality (2–3 weeks)

> **Why:** international companies **reject candidates who don't write tests**. Not optional. A take-home without tests is an instant no.

### Topics

- [ ] **The test pyramid** — unit (fast, isolated, many), integration (layers together, some), E2E (whole system, few); why that proportion
- [ ] **Unit testing** — what to test, what NOT to test (test behavior, not implementation), AAA pattern (Arrange-Act-Assert)
- [ ] **Mocks, stubs, spies** — when to use each, why excessive mocking is a code smell, test doubles
- [ ] **Integration testing** — testing against a real database (testcontainers or Docker), testing HTTP endpoints
- [ ] **Testability as design** — Dependency Injection, why testable code is well-architected code, why globals and singletons hurt tests
- [ ] **Test coverage** — what it means, why 100% is a trap, what to cover first (business logic > utils > controllers)

### Resources

| Type | Resource | Notes |
| --- | --- | --- |
| 📖 Book | "Unit Testing Principles, Practices, and Patterns" — Vladimir Khorikov | The best on the subject, language-agnostic |
| 🔗 Repo | "javascript-testing-best-practices" (goldbergyoni) | Checklists and practical examples |
| 📄 Docs | Vitest or Jest | Pick one and master it |
| 🎥 Video | Kent C. Dodds — "Testing JavaScript" | Principles that carry to backend |
| 🛠 Tool | Testcontainers (testcontainers-node) | Spins up a real DB in Docker for integration tests |

### Hands-on project: "Test Suite From Scratch" (on the monitor project)

1. Pick a module with business logic (e.g. fiscal document validation, workflow engine rules)
2. Write unit tests for pure business rules (no infra dependencies)
3. Write integration tests for HTTP endpoints (real DB in Docker via testcontainers)
4. Set up a coverage report and find what's missing in business logic
5. Refactor untestable code (extract dependencies, use DI)
6. Wire the tests into CI/CD

### How to know you've learned it

- [ ] Can write a test before the code (basic TDD) without suffering
- [ ] Know the difference between mock, stub, and spy — and when to use each
- [ ] Can test an endpoint against a real DB using testcontainers
- [ ] When something isn't testable, your instinct is "this code needs refactoring", not "I need more mocks"

---

## Phase 4: Software Architecture in Practice (3–4 weeks)

> **Why:** you already make architectural decisions. Now name and structure what you do intuitively. Interviews ask you to design a system with clear separation of responsibilities.

### Topics

- [ ] **Layered separation** — why split domain/application/infrastructure; the dependency rule (dependencies point inward)
- [ ] **Ports & Adapters (Hexagonal), simplified** — the domain imports no framework; interfaces (ports) define what the domain needs, implementations (adapters) connect to the real world
- [ ] **SOLID in practice** — focus on **S** (Single Responsibility), **D** (Dependency Inversion), **O** (Open-Closed); L and I are bonuses
- [ ] **Repository Pattern and Service Layer** — organizing data access and application logic
- [ ] **Error handling as architecture** — typed error classes (DomainError, ApplicationError, InfrastructureError), how errors propagate across layers, error boundaries
- [ ] **DDD — essentials only** — Bounded Contexts, Value Objects, Domain Events. **Skip** Aggregates, strategic DDD, event sourcing — until needed
- [ ] **Design patterns that matter** — Strategy, Factory, Observer, Middleware/Chain of Responsibility
- [ ] **API design** — REST semantics and status codes, error contracts, pagination, versioning, idempotency keys, rate limiting (concept; built in Phase 7) *(added 2026-09-02 — was scattered across phases)*
- [ ] **Security & auth essentials** — see Cross-cutting threads; done inside this phase *(added 2026-09-02)*

### Resources

| Type | Resource | Notes |
| --- | --- | --- |
| 📖 Book | "Clean Architecture" — Uncle Bob | Chapters 13–22 only (skip the philosophy) |
| 📖 Book | "Domain-Driven Design Distilled" — Vaughn Vernon | 150 pages, the short practical version |
| 🎥 Video | Rodrigo Branas — YouTube | Clean Arch and DDD in Node, PT-BR, hands-on |
| 🔗 Repo | vendure-ecommerce/vendure | Real example of good TS architecture |
| 🔗 Repo | nestjs/nest | See how they organize modules, providers, guards |

### Hands-on project: "Hexagonal Refactoring" (a monitor module)

1. Pick a coupled module (a handler that runs SQL, validates rules, and calls an external API all in one file)
2. Extract business logic into a domain layer (zero framework imports)
3. Create interfaces (ports) for the database and external APIs
4. Implement concrete adapters (PostgreSQL adapter, SAP API adapter)
5. Create typed error classes (DomainError, NotFoundError, ValidationError)
6. Test the domain in isolation (no DB, no HTTP, no framework mocks)
7. Compare testability before vs after

### How to know you've learned it

- [ ] Can draw a new system's layered architecture on a whiteboard
- [ ] Can explain why the domain must not import Express/Fastify/SAP CAP
- [ ] Can test business rules without spinning up a DB or server
- [ ] Know when a pattern applies and when it's overengineering

---

## Phase 5: Async, Messaging & Resilience (3–4 weeks)

> **Why:** real systems aren't pure request-response. Every company at scale uses queues/messaging. System design interviews expect you to know when to go async.

### Topics

- [ ] **Sync vs async** — when to call HTTP directly vs when to queue; trade-offs of each
- [ ] **Messaging basics** — broker, producer, consumer; queue (point-to-point) vs topic (pub/sub)
- [ ] **RabbitMQ** — exchange types (direct, fanout, topic), acks, dead letter queues (DLQ), retry strategies, prefetch
- [ ] **AWS SQS** — standard vs FIFO, visibility timeout, DLQ, long polling
- [ ] **Redis as queue and cache** — pub/sub, Bull/BullMQ for job queues, caching patterns (cache-aside, write-through)
- [ ] **Kafka — concept, not expertise** — partitions, consumer groups, offsets, retention, Kafka vs RabbitMQ/SQS
- [ ] **Resilience patterns** — Circuit Breaker, retry with exponential backoff + jitter, timeout, bulkhead
- [ ] **Orchestration vs choreography** — Saga pattern, when to use each

### Resources

| Type | Resource | Notes |
| --- | --- | --- |
| 📖 Book | DDIA — Kleppmann | Chapters 4, 8, 9, 11 |
| 🎥 Video | Hussein Nasser — YouTube | RabbitMQ and messaging pattern playlists |
| 🎓 Course | Confluent "Apache Kafka 101" | Free, for the concept |
| 📄 Docs | AWS SQS developer guide | Free, practical |
| 📄 Docs | BullMQ | The most-used job queue in the Node ecosystem |

### Hands-on project: "Order Processing Pipeline"

Mini-system with 2 services:

1. **Service A (API):** receives an order via REST, validates, publishes an `OrderCreated` event to a queue
2. **Service B (Worker):** consumes events, processes (fake PDF, "sends email"), acknowledges
3. RabbitMQ in Docker (docker-compose)
4. Implement:
    - [ ] Retry with exponential backoff (1s, 2s, 4s, 8s)
    - [ ] Dead Letter Queue for messages that failed 3x
    - [ ] Circuit breaker in the worker (external service down)
    - [ ] Idempotency (processing the same message twice must not duplicate the result)
5. Kill the worker mid-processing and observe what happens to the message
6. Document everything in English with diagrams (Excalidraw or Mermaid)

### How to know you've learned it

- [ ] Can explain when to use a queue vs a synchronous HTTP call, and why
- [ ] Know what happens if the consumer dies mid-processing
- [ ] Know the difference between at-least-once and exactly-once delivery
- [ ] Can whiteboard an event-driven system in an interview

---

## Phase 6: AWS in Practice (3–4 weeks)

> **Why:** almost every US/EU company uses AWS. "I know Docker but never used cloud" is a red flag for remote roles.

### Topics

- [ ] **Fundamentals** — Regions, AZs, VPC (basics), IAM (users, roles, policies), Security Groups
- [ ] **Compute** — EC2 (basics), ECS/Fargate (running containers), Lambda (serverless) — when to use each
- [ ] **Storage** — S3 (blobs, presigned URLs, lifecycle policies), RDS (managed PostgreSQL, backups, replicas)
- [ ] **Messaging on AWS** — SQS (standard vs FIFO), SNS (pub/sub), EventBridge (event bus)
- [ ] **Networking & load balancing** — ALB, Route 53, CloudFront — concepts
- [ ] **Monitoring** — CloudWatch (logs, metrics, alarms), X-Ray (basic tracing)
- [ ] **Infrastructure as Code** — basics of CDK or Terraform (know it exists and how it works)
- [ ] **Deploy** — how to deploy a Node.js service on AWS (ECS + Fargate is the common path)

### Resources

| Type | Resource | Notes |
| --- | --- | --- |
| 🎓 Course | AWS Skill Builder (free) | "AWS Cloud Practitioner Essentials" |
| 🛠 Hands-on | AWS Free Tier | 12 months of free resources |
| 🎥 Video | freeCodeCamp — "AWS Certified Cloud Practitioner" | Not to certify — to understand |
| 📄 Docs | AWS Well-Architected Framework | "Operational Excellence" and "Reliability" pillars |

### Hands-on project: "Real AWS Deploy"

Take the Phase 5 project (Order Processing) and deploy it on AWS:

1. Containerize both services with Docker (multi-stage build)
2. Database on RDS (PostgreSQL)
3. Swap RabbitMQ for SQS (with Phase 4 ports & adapters, it's just an adapter swap)
4. Deploy the services on ECS Fargate
5. Put an ALB in front
6. CloudWatch for logs and basic metrics
7. Create an alarm: "if the DLQ has more than 5 messages, alert"
8. Document the architecture with a diagram

> **Estimated cost:** < $5/month on free tier. Tear everything down when done.

### How to know you've learned it

- [ ] Can deploy a Node.js service on AWS without a tutorial open
- [ ] Know the difference between EC2, ECS, and Lambda — and when to use each
- [ ] Can explain in an interview how you'd deploy system X on AWS
- [ ] Can read CloudWatch logs and set up basic alarms

---

## Phase 7: System Design + Observability (ongoing, 4+ weeks)

> **Why:** the interview that rejects the most candidates for senior international roles. It's not about knowing everything — it's about **reasoning through trade-offs out loud**.

### Topics — System Design

- [ ] **Answer framework** — Requirements → Estimation → High-Level Design → Deep Dive → Bottlenecks → Monitoring
- [ ] **Building blocks** — Load Balancer, CDN, Cache (Redis), Message Queue, DB (SQL vs NoSQL), Blob Storage (S3), API Gateway
- [ ] **Classic problems** — URL shortener, rate limiter, notification system, chat system, news feed, file storage system
- [ ] **Fundamental trade-offs** — CAP theorem, consistency vs availability, latency vs throughput, SQL vs NoSQL, monolith vs microservices

### Topics — Observability

- [ ] **The 3 pillars** — structured logs (JSON), metrics (counters, gauges, histograms), traces (distributed tracing)
- [ ] **OpenTelemetry** — automatic and manual instrumentation in Node.js, exporters
- [ ] **SLIs, SLOs, SLAs** — what to measure, how to set thresholds, what to alert vs just log
- [ ] **Debugging in production** — investigating a memory leak, a slow endpoint, a CPU spike, cascading failures
- [ ] **Practical stack** — Grafana + Prometheus + Loki (all free, runs locally)

### Resources

| Type | Resource | Notes |
| --- | --- | --- |
| 📖 Book | "System Design Interview Vol. 1" — Alex Xu | The industry standard |
| 📖 Book | "System Design Interview Vol. 2" — Alex Xu | More advanced problems |
| 🌐 Site | ByteByteGo | Alex Xu's newsletter + videos |
| 📖 Book | "Observability Engineering" — Charity Majors | The bible of the topic |
| 📝 Blog | charity.wtf | Practical observability posts |

### Project A: "System Design Weekly" (1 per week)

1. Pick a classic problem (URL shortener, rate limiter, etc.)
2. Write functional and non-functional requirements
3. Estimate (DAU, storage, bandwidth, QPS)
4. Draw the architecture in Excalidraw
5. Identify bottlenecks and propose solutions
6. **Record yourself explaining it in English** (10–15 min, even if for no one)
7. Review: "where would I add monitoring? which metrics? which alarms?"

### Project B: "Observability Stack" (on the monitor project)

1. Add OpenTelemetry with automatic instrumentation (HTTP, DB)
2. Add manual traces at critical points (workflow engine, SAP integration)
3. Export metrics: request duration, error rate, queue depth
4. Run Grafana + Prometheus locally via Docker Compose
5. Build a dashboard with your service's metrics
6. Simulate a problem (slow endpoint, memory leak) and find it via traces + metrics

### How to know you've learned it

- [ ] Can do a 30-min system design in English without freezing
- [ ] Can justify every decision with a trade-off
- [ ] Can instrument a Node service with OpenTelemetry
- [ ] Know the difference between a log, a metric, and a trace — and when to use each

---

## Cross-cutting threads (added 2026-09-02)

> Fundamentals that don't belong to one phase. Small, continuous, and non-negotiable for "senior with solid fundamentals." ~25–30h total, absorbed into the phase windows above — the dates don't move.

| Thread | When | Effort | What "done" looks like |
| --- | --- | --- | --- |
| **DSA, continuous** | 1–2 problems/week from Phase 2 onward; ramp to daily in the prep checkpoint | ~1h/week | Hash maps, two pointers, sliding window, BFS/DFS, heaps, Big-O. Easy/Medium only. Solve in TS, out loud, in English. |
| **Security & auth** | inside Phase 4 | ~10h | Sessions vs JWT (and when JWT is the wrong answer), OAuth2/OIDC flows, password hashing (bcrypt/argon2), OWASP Top 10, input validation at the boundary, secrets management. Applied to the Phase 5 API. |
| **TypeScript depth** | inside Phase 3 | ~5h | `strict` on, `unknown` vs `any`, narrowing, discriminated unions, generics with constraints, `satisfies`, typing errors. Take-home reviewers judge this directly. |
| **HTTP & networking** | inside Phase 1 (Event Loop / Cluster topics) | ~4h | TCP + TLS handshake, DNS, keep-alive, HTTP/1.1 vs HTTP/2, what happens between `fetch()` and the response. Graceful shutdown lives in the Cluster topic. |
| **ADRs** | one per phase project, Phase 2 onward | ~30 min each | A one-page Architecture Decision Record in English: context, options, decision, consequences. Stored next to the project. This is the writing skill remote companies filter on. |

---

## Rules of the Game

1. **Don't skip phases.** Messaging without understanding databases becomes cargo cult. AWS without understanding what you're deploying becomes clickops.
2. **The hands-on project is mandatory.** If you read it but didn't code it, it doesn't count.
3. **Use your real project (the monitor) whenever possible.** Learning in your work context is 3x more efficient.
4. **Everything in English.** Commits, PRs, notes, READMEs, diagrams.
5. **Document what you learn.** Short posts on GitHub/personal blog. Locks in knowledge and feeds your profile.
6. **One thing at a time.** Ignore Kafka while you're in the Node internals phase. Anxiety = burnout.
7. **Record yourself explaining.** System design, concepts, decisions. In English. It simulates the real interview.
8. **Paused for more than 2 weeks? Re-entry quiz first.** Before any new content, take a self-quiz on the last completed topics. Prevents the illusion of progress. *(added 2026-07-28)*
9. **Respect the consolidation limit.** A study day is capped at ~90 min of *new concepts*; the rest is hands-on coding on what you already read. More input per day does not buy more retention — it buys the illusion of it. On a 3h day: ~1h read/watch, ~2h code. *(added 2026-08-26)*
10. **Sustainable beats heroic.** Three hours every weekday beats four hours for ten days followed by a two-month pause. The pause is the enemy — it has cost ~4 months across two occurrences already. If a week is going badly, drop to 1h/day rather than to zero. *(added 2026-08-26)*

---

## What NOT to learn now

| Topic | Why not |
| --- | --- |
| Advanced Kubernetes | Docker + ECS Fargate is enough. Deep K8s is for DevOps/SRE |
| GraphQL | Well-built REST takes you far. Learn it if a role asks |
| Microservices by default | Most good companies run well-built monoliths |
| Multiple languages | Node/TS is perfect for remote roles |
| Cloud certifications | Help the CV but don't replace knowing how to build |
| Frontend | Knowing the basics of how a frontend consumes your API is enough |
| Blockchain/Web3 | Irrelevant unless the company is in that niche |
| Event Sourcing/CQRS | Understand the concept (5 min), don't implement. 99% of systems don't need it |

---

## Interview Prep Checkpoint

When Phase 6 is done:

- [ ] **Coding interview** — solve problems in Node/TS with good practices, error handling, tests
- [ ] **System design** — draw architectures with clear trade-offs in 30 min, in English
- [ ] **Behavioral** — explain technical decisions you made (monitor re-architecture, design choices)
- [ ] **Take-home** — deliver a small project with good architecture, tests, README, deploy instructions
- [ ] **Live coding / pair programming** — code and explain at the same time, in English

### 2–4 weeks before applying

- [ ] LeetCode/HackerRank: ramp the continuous DSA thread to daily — Easy and Medium only (backend roles don't need Hard)
- [ ] Mock interviews: Pramp or interviewing.io (free) to simulate system design in English
- [ ] Prepare 3 work "stories" in STAR format (Situation, Task, Action, Result), in English
