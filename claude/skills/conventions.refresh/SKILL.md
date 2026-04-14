---
name: conventions.refresh
description: "Check if project conventions need migration or refresh from ai-ressources. Use when conventions may be outdated or after ai-ressources updates."
argument-hint: "[--full]"
---

# /conventions.refresh — Refresh Project Conventions

Check if `.conventions/` is current and reconfigure if needed. Content is always fresh (source files in ai-ressources are read directly). This command focuses on: migrating old format, detecting staleness via ai-ressources date, and reconfiguring when the project stack changes.

## Prerequisites

- Run from the **target project** directory (NOT ai-ressources)
- `~/projects/ai-ressources/` must exist

## Procedure

### Step 1: Detect format

**Case A — Old compiled format detected** (`.conventions/design.md` or `.conventions/conventions.manifest.json` exists):
1. Print: "Old compiled format detected. Migrating to manifest format."
2. Run `/conventions.init` Phases 1–4 (re-detects stack, generates `manifest.yaml` + `index.md`)
3. Delete old compiled files from `.conventions/`: all `*.md` files except `index.md`, and `conventions.manifest.json`
4. Print: "Migration complete. Old compiled files removed."
5. Stop here.

**Case B — No `.conventions/` or no `manifest.yaml`:**
1. Print: "No `.conventions/manifest.yaml` found. Run `/conventions.init` to set up."
2. Stop here.

**Case C — `manifest.yaml` exists:** proceed to Step 2.

### Step 2: Detect staleness via date comparison

```bash
# Read generated date from manifest
MANIFEST_DATE=$(grep "^generated:" .conventions/manifest.yaml | awk '{print $2}')

# Read last ai-ressources update date
AI_RES_PATH=$(grep "^ai_resources_path:" .conventions/manifest.yaml | awk '{print $2}')
LAST_UPDATED=$(cat "$AI_RES_PATH/.last-updated" 2>/dev/null || echo "unknown")

echo "Manifest generated: $MANIFEST_DATE"
echo "ai-ressources last updated: $LAST_UPDATED"
```

**If `.last-updated` does not exist:**
- Warn: "Cannot read `ai-ressources/.last-updated` — run `/conventions.refresh --full` to force refresh."
- Stop here.

**If `LAST_UPDATED` ≤ `MANIFEST_DATE`:** print "Conventions up to date." and stop.

**If `LAST_UPDATED` > `MANIFEST_DATE`:** ai-ressources has changed. Proceed to Step 3.

### Step 3: Rebuild manifest with same domains

Reconstruct the domains JSON from `manifest.yaml` keys:
- `design-*` keys → pass `[]`
- `code` key → pass source filenames (strip `code-conventions/` prefix and `.md` extension)
- other keys → pass source filenames (strip domain dir prefix and `.md` extension)

```bash
# Build domains JSON from manifest and re-run
DOMAINS_JSON=$(bun -e "
  import { parse } from 'yaml';
  import { readFileSync } from 'fs';
  const m = parse(readFileSync('.conventions/manifest.yaml','utf-8'));
  const domains = {};
  for (const [key, dom] of Object.entries(m.domains)) {
    if (key.startsWith('design-')) {
      domains[key] = [];
    } else if (key === 'code') {
      domains[key] = dom.sources.map(s => s.replace('code-conventions/','').replace('.md',''));
    } else {
      domains[key] = dom.sources.map(s => s.split('/').pop().replace('.md',''));
    }
  }
  console.log(JSON.stringify(domains));
")
bun run ~/projects/ai-ressources/scripts/build-conventions.ts "$(pwd)" "$DOMAINS_JSON"
```

### Step 4: Stack tracking (unchanged from previous behavior)

Compare detected stack markers with what was last used. If markers changed, regenerate hook/CI config.

### --full flag

Skip staleness check. Re-run `/conventions.init` Phases 1–4 from scratch. Use when project stack changed significantly or when in doubt.

## What "refresh" does NOT do

- Does NOT recompile content (nothing to compile)
- Does NOT check per-file hashes of source files (date comparison replaces hash comparison)
- Does NOT generate domain `.md` files (manifest architecture produces only `manifest.yaml` + `index.md`)
