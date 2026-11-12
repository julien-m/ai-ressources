# Code audit procedure

- Read common sources and only the selected language and observed framework deltas. If code touches a data model, resolve its actual database engine separately and read [database procedure](database.md); do not infer PostgreSQL from the programming language.
- Inventory entry points, responsibilities, public contracts, external inputs, secrets/permissions, mutable state, concurrency and persistence boundaries. Trace caller-to-consumer behavior and concrete error/cleanup paths.
- Use current primary tooling/docs for language-specific risks: numeric/platform mappings in Delphi, validation/serialization/async behavior in JS/TS, ownership/errors/unsafe boundaries in Rust, supervision/task/transaction/job ownership in Elixir. A language profile does not prove every associated framework is present.
- Run only inspected project-declared checks in execution modes and an isolated environment. Static review remains possible without dependencies; unavailable compiler/runtime checks never count as passing.
- Tie each defect to a real contract and causal location. Reuse sufficient tests, preserve unrelated edits and avoid demands for abstractions/caches or tests merely mirroring implementation.
- Measure representative paths before claiming optimization gains. Distinguish build, test behavior, runtime performance and external-device/provider evidence.
