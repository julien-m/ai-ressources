# Delphi Rules (Delta)

> These rules complement [`general.md`](general.md). Documentation rules 23-30 from [`general.md`](general.md) apply; only Delphi-specific doc formats are listed here.

## Memory Management

### 1. Return objects via Result
Allocate directly in `Result`, protect with `try/except`, free on error, then `raise`.

```pascal
function CreateUserList: TStringList;
begin
  Result := TStringList.Create;
  try
    Result.Add('User1');
    Result.Add('User2');
  except
    Result.Free;
    raise;
  end;
end;
```

### 2. Protect post-Create code
Any code after `Create` that can raise must be wrapped in `try/except` (free `Result` + `raise`).

### 3. try/finally for local objects
Objects created for internal use must always be freed with `try/finally`.

```pascal
LObj := TStringList.Create;
try
  LObj.Add('test');
finally
  LObj.Free;
end;
```

### 4. Use `raise;` not `raise E`
Always bare `raise;` to preserve the original stack trace.

### 5. Don't test Assigned before Free
`Free` already checks for nil. Just call `Obj.Free;`.

### 6. FreeAndNil only for persistent fields
Use `FreeAndNil(FCache)` only for fields that may be accessed later. Local vars: just `.Free`.

### 7. Free owned resources in destructor
All owned objects must be released in the destructor. Call `inherited` last.

### 8. Always call inherited in destructors
Skipping `inherited` in `Destroy` breaks the destruction chain.

## Parameters & Objects

### 9. Prefer const parameters
Use `const` for unmodified parameters — avoids unnecessary copies: `procedure Process(const Value: string);`

### 10. Avoid unnecessary temporaries
Don't create objects when the operation can be done directly.

### 11. Never leak objects in loops
Objects created inside loops must always be freed (`try/finally` in loop body).

## Naming

### 12. Descriptive variable names
Variables must express their purpose: `LUserList` not `L`.

### 13. Scope prefixes
- `L` prefix for local variables: `LUserList: TStringList`
- `F` prefix for fields: `FUserList: TStringList`

## Error Handling

### 14. Never swallow exceptions
No empty `except end;` blocks. Always log then re-raise.

### 15. Small single-responsibility functions
Functions should perform one clear task.

## Ownership

### 16. Don't mix ownership
Returned objects must clearly transfer ownership or be documented as shared. Never return internal fields directly.

### 17. Document ownership
`// Caller owns the returned object` on every ownership-transferring function.

## Design

### 18. Prefer immutable data
`function CreateUpdatedConfig(const Config: TConfig): TConfig;` over `procedure UpdateConfig(var Config: TConfig);`

### 19. Async when possible
Prefer asynchronous flows over blocking operations when the framework supports it.

### 20. Predictable code
Clarity over cleverness. Code must be understandable by another developer in seconds.

## Delphi-Specific Documentation

General doc rules (23-30) from [`general.md`](general.md) apply. Additionally:

- **Unit headers**: use XMLDoc `/// <summary>` at the top of each unit
- **Public types**: all enums, records, classes, interfaces must use `/// <summary>` comments
- **Record/class fields**: each field must have its own `/// <summary>` doc describing the data it represents
- **Public methods**: structured block comment with purpose, `@param`, `@return`, and main processing steps

```pascal
/// <summary>
/// Handles the PDF signing workflow including form filling,
/// stamping, and cryptographic signature.
/// </summary>
unit Signer;

/// <summary>
/// Information about a signed document.
/// </summary>
TrDocInfo = record
  /// <summary>Unique document identifier.</summary>
  id: string;
  /// <summary>File name of the signed document.</summary>
  Filename: string;
end;
```
