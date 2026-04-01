# Design: CLI Stdin Input Convention

**Date:** 2026-04-01
**Scope:** Add stdin input convention to `code-conventions/cli.md`
**Status:** Draft

## Problem

The CLI conventions mandate Commander.js, stdout/stderr separation, `--json` output, and isTTY checks for Ink — but say nothing about stdin as an input source. Any command accepting free-form text (prompts, messages, content bodies) should also accept piped stdin. This is a Unix fundamental that `cc-hub` already implements but the conventions don't formalize.

## Design

### New section: "Stdin Input"

Placed after "Command Registration" (§2), before "Module Structure" (§3). Input handling is a core command design concern that flows naturally from how arguments are registered.

### Rules

1. **Any command accepting variable-length text input MUST also accept stdin** when the positional argument is omitted
2. **Priority order:** positional argument > stdin (when `!process.stdin.isTTY`) > error with usage hint
3. **isTTY guard is mandatory** — never read stdin without checking `!process.stdin.isTTY` first, or the command will hang waiting for input in a terminal
4. **stdin is consumed as UTF-8 text** — binary input is out of scope for this convention
5. **Scope:** applies to arguments where a user might reasonably pipe content from a file (prompts, messages, bodies, payloads). Does NOT apply to short structured args (IDs, paths, enum values)

### Code pattern

A `resolveInput()` helper in `services/` (services own all I/O per existing module structure):

```ts
// services/input.ts — resolve text input from arg or stdin
export async function resolveInput(arg: string | undefined): Promise<string> {
  if (arg !== undefined) return arg.trim();

  if (!process.stdin.isTTY) {
    const chunks: Buffer[] = [];
    for await (const chunk of process.stdin) chunks.push(chunk);
    const input = Buffer.concat(chunks).toString("utf-8").trim();
    if (!input) throw new Error("Stdin was empty. Provide input via argument or non-empty pipe.");
    return input;
  }

  throw new Error("No input provided. Pass text as argument or pipe via stdin.");
}
```

Commander.js registration with optional positional:

```ts
program
  .command("ask [text]")  // square brackets = optional
  .description("Ask a question")
  .action(async (text: string | undefined) => {
    const input = await resolveInput(text);
    // ...
  });
```

Usage examples:

```bash
my-cli ask "direct question"           # positional arg
echo "question" | my-cli ask           # piped stdin
cat prompt.txt | my-cli ask            # file via stdin
my-cli ask                             # error: no input
```

### Anti-pattern addition

Add to existing Anti-Patterns table:

| Anti-pattern | Correct approach |
|---|---|
| Required positional for text input, no stdin | Optional `[arg]` + `resolveInput()` from stdin |

### Inline Comment Trigger addition

Add to existing CLI-specific triggers:

- **stdin read without `isTTY` guard** — explain why hanging is possible and what the fallback is

## Files Changed

1. `code-conventions/cli.md` — new "Stdin Input" section, anti-pattern row, inline comment trigger
2. `code-conventions/index.yaml` — update `questions_answered` and `use_when` for cli.md entry

## Edge Cases

- **Both arg AND stdin provided:** arg wins (explicit over implicit)
- **Empty string arg (`my-cli ask ""`):** `arg !== undefined` catches this — returns `""` trimmed, command can validate if needed
- **Empty stdin (pipe from empty file):** `resolveInput` throws — empty pipe is always a user error
- **Very large stdin:** no size limit in the convention; commands dealing with LLM prompts should set their own limits at the service layer
- **Explicit `--stdin` flag:** unnecessary when using the isTTY detection pattern — the convention does not require it
