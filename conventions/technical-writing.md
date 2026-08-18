# Technical writing conventions

These rules govern developer-facing prose: README files, API references, tutorials, setup guides, runbooks, CLI help, changelogs, technical specifications, agent rules, skills, and code samples. They do not replace code, product, legal, or design conventions.

## Scope and authority

- Follow the target project's terminology, audience, locale, and document-specific requirements first.
- Preserve the requested language; do not impose American English on non-English documents.
- Prioritize technical correctness and reader success over house style.
- **Read** [`authority.md`](authority.md) to resolve conflicts; the most specific applicable convention wins.
- **Read** [`../code-conventions/general.md`](../code-conventions/general.md) for code-comment and public-symbol coverage rules; this file governs the prose quality of that documentation.
- **Read** [`../design/quality/accessibility.md`](../design/quality/accessibility.md) for exhaustive accessibility requirements; this file keeps only documentation-specific essentials.

## Core style

- Lead with the outcome, decision, or purpose; omit preambles that merely announce the section.
- Address the reader directly when giving instructions. Use active voice and name the actor when ambiguity is possible.
- Put the condition, goal, or location before the action so readers can skip instructions that do not apply.
- Use one precise term per concept. Define unfamiliar acronyms and domain terms on first use.
- Prefer plain, literal language. Avoid unexplained jargon, idioms, metaphors, cultural references, and ableist or unnecessarily gendered terms.
- Do not call a task _easy_, _simple_, _obvious_, _quick_, or _just_ do something; state the action and required knowledge instead.
- Prefer positive instructions that say what to do. State prohibitions only when the unsafe or invalid alternative matters.
- Use unambiguous dates (`YYYY-MM-DD` in technical data) and include timezone or locale when interpretation can differ.
- Never claim that a command, sample, link, test, or behavior was verified without evidence.

## Structure and scanability

- Use sentence case, unique descriptive headings, and a complete hierarchy without skipped levels.
- Put the distinguishing information in the first sentence of a paragraph or section.
- Keep paragraphs focused on one idea; split walls of text with headings or lists.
- Use numbered lists only when order matters, bullets for unordered items, and tables for repeated-field comparisons.
- Keep list items grammatically parallel and introduce tables or complex examples with their purpose.
- Avoid duplicate overview, summary, and conclusion sections unless each serves a distinct need in a long document.
- Do not use screenshots for text, code, or terminal output when selectable text can convey the same information.

## Procedures and instructions

- State the intended outcome and all prerequisites before the steps.
- For each step, state necessary context and its goal first, then phrase the action as an imperative; keep one primary reader decision or action per step and place its result or justification afterward.
- Prefix optional steps with `Optional:`. Never make required steps appear optional.
- Document one recommended path by default. Separate alternatives only when their trade-offs materially differ.
- For a command step, use this order: action, command, placeholder definitions, necessary explanation, expected output, result.
- Introduce commands by purpose (`Deploy the worker:`), not with “Run the following command.”
- Include observable success criteria and recovery guidance when a failure would leave state ambiguous.
- Warn before destructive, irreversible, privileged, billable, or externally visible actions.
- Link to an existing procedure instead of copying it; duplicated procedures drift.

## Code, commands, and placeholders

- Format filenames, paths, commands, identifiers, literals, status codes, console output, and user-entered values as code.
- Use fenced blocks with the correct language identifier. Separate commands from their output.
- Follow the target language's formatter and project line-length rules; do not impose a universal width.
- Make samples minimal but complete for their stated purpose. Declare prerequisites, dependencies, and required surrounding context.
- Mark omitted code with a valid comment explaining the omission; never use an ellipsis inside copyable or executable code.
- Use conspicuous placeholders that cannot be mistaken for real values, then define them in first-appearance order.
- Use realistic, domain-specific sample data and label it as sample data when readers might mistake it for production data.
- Never include real secrets, tokens, credentials, personal data, or unsafe production commands.
- Validate or execute samples when possible. If not verified, state the limitation instead of implying correctness.

## API reference documentation

- Let project and language conventions decide which symbols are public; do not force documentation onto trivial internals.
- Start a symbol description with a short present-tense purpose or action that adds information beyond its name and signature.
- Explain parameter semantics, accepted ranges, null or empty behavior, and interactions; do not repeat types already present in the signature.
- For boolean parameters, describe both states. For defaults, state the behavior and the default value explicitly.
- Describe the returned information, not the act of returning it. Document absence, partial results, and ownership when relevant.
- Document prerequisites, permissions, side effects, cleanup responsibilities, failures, and thrown or returned errors.
- For deprecations, name the replacement, migration action, and version or removal timeline when known.
- Link code entities to their authoritative reference when the format supports stable links.
- Do not restate implementation details that the code already expresses; explain contract, intent, constraints, and consequences.

## Links and references

- Write descriptive link text that identifies the destination when read out of context; never use “click here,” “read more,” or a bare path when a link is possible.
- Introduce file references with an action such as **Read**, **Open**, or **See**, followed by the link.
- Prefer stable relative links for repository files and canonical URLs for external sources.
- Explain unexpected link behavior such as downloads, new applications, or navigation away from an unfinished task.
- Verify local targets and external URLs before publishing; do not retain references known to be stale.

## Accessibility and global audiences

- Use semantic headings, lists, tables, links, and HTML elements; do not encode structure with visual formatting alone.
- Provide meaningful alt text for informative images and empty alt text for decorative images. Explain complex visual information in nearby text or data.
- Avoid directional references such as “above,” “below,” or “on the right” when a stable name or sequence reference is available.
- Ensure instructions do not require a mouse-only path when an accessible equivalent exists.
- Use concise sentences, parallel structures, and literal language that translate reliably.
- Use inclusive examples and names without culturally specific assumptions unless the domain requires them.
- Preserve established code identifiers when changing them would break accuracy; explain legacy terminology once, then use the preferred term in prose.

## AI-generated documentation gates

Before publishing AI-generated technical content, verify:

- [ ] The audience, task, language, prerequisites, and expected outcome are explicit.
- [ ] Terminology is consistent with the project and more specific conventions.
- [ ] Procedures are ordered, minimal, executable, and include observable results.
- [ ] Commands, code, placeholders, outputs, and sample data are accurate and clearly distinguished.
- [ ] Public API contracts cover defaults, failures, side effects, ownership, and deprecations where relevant.
- [ ] Links resolve, link text is descriptive, and visual content has equivalent text.
- [ ] Assertions about current behavior, compatibility, pricing, or versions have a source or fresh verification.
- [ ] No filler, duplicated explanation, fabricated evidence, secret, or personal data remains.

## Source and adaptation

- **Read** the [Google developer documentation style guide](https://developers.google.com/style/) for the source editorial guidance.
- **Read** the [Creative Commons Attribution 4.0 license](https://creativecommons.org/licenses/by/4.0/) governing the adapted prose. Google licenses code samples separately under Apache 2.0; this convention copies no Google code sample.
- Adaptation: condensed into language-neutral rules, removed Google product-specific and English-only house style, reconciled with this repository's authority, code-comment, accessibility, and AI-generation conventions.
- Last reviewed against the source: 2026-08-18.
