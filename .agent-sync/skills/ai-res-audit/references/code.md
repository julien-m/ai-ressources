# Code audit procedure

- Resolve sources per observed language and framework. For a data-model boundary, identify the actual engine and read [the database procedure](database.md).
- Inventory entry points, responsibilities, contracts, external inputs, mutable state, concurrency and persistence boundaries. Trace actual control flow, errors, cleanup and consumers.
- Turn relevant sections of every resolved source into checks. Apply shared implementation, modular architecture, logging and testing rules alongside the language/framework conventions. Cite the convention section and code, config or test that supports the result. Use current primary tooling or documentation when language or runtime behavior matters.
- Inspect responsibility ownership, dependency direction, substitution, configuration, and enforcement in code and CI. For a shared workflow with concrete drivers, trace what the shared implementation owns, what each driver does, and whether callers can bypass invariants. Apply the current architecture and test sections for that pattern and the language's own conventions.
- Trace typing, validation, error and resource contracts across real entry points. Inspect failure, cancellation, and cleanup evidence. Reuse sufficient project tests and group findings with the same cause.
- Run inspected project checks only in authorized execution modes and isolation. Distinguish static inspection, build, tests, measurements and external-device/provider evidence. Keep unmeasured optimization proposals separate from verified gains.
