# Code audit procedure

- Read common sources and only the selected language and observed framework deltas. If code touches a data model, resolve its actual database engine separately and read [database procedure](database.md); do not infer PostgreSQL from the programming language.
- Inventory entry points, responsibilities, public contracts, external inputs, secrets/permissions, mutable state, concurrency and persistence boundaries. Trace caller-to-consumer behavior and concrete error/cleanup paths.
- Use current primary tooling/docs for language-specific risks: numeric/platform mappings in Delphi, validation/serialization/async behavior in JS/TS, ownership/errors/unsafe boundaries in Rust, supervision/task/transaction/job ownership in Elixir. A language profile does not prove every associated framework is present.
- Run only inspected project-declared checks in execution modes and an isolated environment. Static review remains possible without dependencies; unavailable compiler/runtime checks never count as passing.
- Tie each defect to a real contract and causal location. Reuse sufficient tests, preserve unrelated edits and avoid demands for abstractions/caches or tests merely mirroring implementation.
- Measure representative paths before claiming optimization gains. Distinguish build, test behavior, runtime performance and external-device/provider evidence.


## Required code-preference evidence
- Resolve the common files and selected language delta before reviewing. In the existing report, cite actual code for each applicable criterion below; name missing documentation/contracts precisely. Group identical evidence, justify non-applicability and preserve the skill's VERIFIED/STATIC_ONLY/NOT_VERIFIED distinctions.

| Criterion | Inspect and report |
|---|---|
| Comments and documentation | Module responsibility, public API purpose/inputs/results/errors/ownership, mandatory inline-comment triggers and synchronized explanations; use Delphi XMLDoc/field/method conventions. Do not demand commentary on every obvious assignment. |
| Decoupling and abstraction | Domain/module responsibility, narrow capability contracts, caller/implementation separation, composition/configuration selection and substitutable semantics; identify concrete dependencies leaking through callers. Apply architecture §34 without speculative layers. |
| Typed data and variants | Public/domain/collection/error types, checked external inputs, closed enums or tagged variants and explicit wire/storage mappings; distinguish sound inference from untyped values. |
| Constants and prepared values | Named stable semantic values owned by their module, validated runtime configuration, translation resources and reuse outside hot loops; no unsupported memory-saving claim or global coupling. |
| Algorithm and control flow | Data structure and repeated-scan cost, first-match early return and miss-path result, exhaustive case/match for one closed discriminant, bounded inputs, preserved priority/cleanup and no undefined returns. |
| Memory and speed | Copies/allocations/string rebuilding/retained objects, ownership and lifetime, target compiler/runtime and actual measurement for any performance claim; static improvement suggestions remain explicitly unmeasured. |

- For Delphi, inspect interface reference counting versus object ownership, const parameter semantics, typed generics/enums, Exit(Value) support and finally cleanup. Report a missing compiler as an unavailable compilation check, not a passing build; do not test Delphi performance with a different compiler and call it equivalent evidence.
