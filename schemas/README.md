# Schemas

JSON Schemas (expressed as YAML) for validating the knowledge base index files.

## Files

| Schema | Validates |
|--------|-----------|
| `root-index.schema.yaml` | Root `index.yaml` — top-level domain manifest |
| `domain-index.schema.yaml` | Per-domain `index.yaml` files (both flat and sectioned formats) |

## Formats

### Root index (`index.yaml`)

```yaml
domains:
  <domain-name>:
    description: "..."   # required
    status: complete     # required: complete | active | partial | placeholder
    file_count: 10       # required: integer >= 0
    subdirectories:      # optional: list of subdirectory names
      - components
```

### Domain index — flat format (e.g. `architecture/index.yaml`)

```yaml
files:
  - file: my-file.md         # required
    description: "..."       # required
    status: complete         # optional
```

### Domain index — sectioned format (e.g. `design/index.yaml`)

```yaml
sections:
  <section-name>:
    description: "..."       # required
    files:                   # required, min 1
      - file: sub/path.md    # required
        description: "..."   # required
        status: complete     # optional
```

## Validation

```bash
pip install check-jsonschema

# Root index
check-jsonschema --schemafile schemas/root-index.schema.yaml index.yaml

# Domain indexes
check-jsonschema --schemafile schemas/domain-index.schema.yaml architecture/index.yaml
```
