# Compiled Index for ai-res-librarian

## Problem

The ai-res-librarian agent spends ~5-8s on routing (reading root index.yaml → domain index.yaml → identifying target files) before it can start reading and synthesizing content. This multi-hop routing is the main remaining bottleneck after quick-ref and parallel reads optimizations.

## Solution

Generate a flat compiled index from all domain `index.yaml` files. Inject it into the agent's prompt so routing requires 0 file reads.

## Components

### 1. `scripts/build-index.ts`

Bun script that:
- Reads `index.yaml` (root) to enumerate domains
- Reads each `<domain>/index.yaml` to enumerate files and metadata
- Extracts: relative path, description, use_when tags (if present)
- Outputs `compiled-index.txt` in pipe-delimited format
- Validates that referenced files exist on disk (warns on missing)
- Prints summary: domain count, file count, output size

### 2. `compiled-index.txt`

Flat file at project root. Format:

```
# ai-ressources compiled index
# Format: path | description [| use_when tags]
# [QUICK-REF] = read first for common questions in this domain
# Generated: <ISO timestamp>

## <domain>
[QUICK-REF] path/quick-ref.md | description
path/file.md | description | tag1, tag2, tag3
```

Estimated size: ~128 entries, ~3-4K tokens.

### 3. Skill update (`claude/skills/ai-res/SKILL.md`)

New procedure step: read `compiled-index.txt` and include its content in the agent spawn prompt.

### 4. Agent update (`.claude/agents/ai-res-librarian.md`)

- New primary routing path: use the compiled index provided in prompt context
- Existing index.yaml routing becomes fallback (when compiled index not provided)
- Parallel reads instruction reinforced

### 5. Rule update (`.claude/rules/update-index-on-file-change.md`)

Add reminder to regenerate `compiled-index.txt` after any `index.yaml` modification.

## Performance

| Metric | Before | After (expected) |
|--------|--------|-------------------|
| Routing reads | 2-3 sequential | 0 (in prompt) |
| Total reads | 4-9 | 1-5 (target files only) |
| Time (sonnet) | 13-24s | 8-13s |
| Time (haiku) | 8-13s | 5-8s |

## Constraints

- `compiled-index.txt` is generated, not hand-maintained
- Domain `index.yaml` files remain source of truth
- Script must work with current index.yaml schema (no schema changes)
- Fallback routing preserved for backwards compatibility
