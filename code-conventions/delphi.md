---
extends: [general]
---
# Delphi Rules (Delta)

> These rules complement [`general.md`](general.md). Documentation rules 23-30 from [`general.md`](general.md) apply; only Delphi-specific doc formats are listed here.
## Project choice and initialization

- Record Windows VCL UI, cross-platform FireMonkey UI, console/business service or library before creation, including the actual deployment targets. Use RAD Studio's **File > New** / **Other** project wizards for the selected Delphi project type rather than hand-building the `.dpr`/`.dproj` skeleton.
- Choose **VCL Forms Application** for Windows VCL, **Multi-Device Application** for FireMonkey, or the relevant **Console Application**, service or library template from the installed Delphi edition. Review generated units, platform targets, ownership and project/build options before adding business code.
- This is an IDE creation workflow, not a universal Delphi initialization command. `dcc32`/`dcc64` and MSBuild compile/build existing source/projects; they do not replace the project wizard. Preserve existing legacy projects rather than regenerating them, and verify template availability against the installed edition/version.
- Read [RAD Studio project creators](https://docwiki.embarcadero.com/RADStudio/Athens/en/New_%28File_Menu%29), [FireMonkey creation](https://docwiki.embarcadero.com/RADStudio/Alexandria/en/Creating_a_FireMonkey_Application) and [MSBuild's role](https://docwiki.embarcadero.com/RADStudio/Sydney/en/MSBuild).

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
Use `const` for unmodified parameters, especially strings/structured values, to enable compiler optimizations: `procedure Process(const Value: string);`. Passing by value/reference depends on compiler/type; `const` on an object reference does not make its contents immutable.
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
- State whether each exposed resource is owned, borrowed or shared, including the required lifetime. Review failure during construction, early return and cancellation: release only acquired/owned resources, never free a borrowed or interface-counted object as though it were locally owned. Test a real failure/cleanup path when it is a distinct risk; documentation alone is not proof of cleanup.

## Interfaces and polymorphism
- Prefer narrow `IInterface`-based capability contracts for replaceable services/adapters; inject them through constructors or parameters and implement them in separate classes. Keep concrete class construction and provider selection at composition boundaries.
- Use virtual/abstract methods when an existing class hierarchy or framework requires subtype dispatch; prefer interface composition for independent capabilities rather than deepening inheritance for code reuse. Use generics for type relationships, not provider-name switches.
- Make lifetime policy explicit: `TInterfacedObject` provides reference counting. Do not manually `Free` an object managed by live counted interface references; avoid mixing counted references and owning object references. Framework-owned non-counted implementations require their own documented lifetime contract.
- Read [Embarcadero reference counting](https://docwiki.embarcadero.com/RADStudio/Florence/en/Using_Reference_Counting) and [TInterfacedObject](https://docwiki.embarcadero.com/Libraries/Alexandria/en/System.TInterfacedObject); apply the shared policy in [architecture conventions](architecture.md#34-interface-based-modularity-and-polymorphism).

## Design
### 18. Prefer immutable data
`function CreateUpdatedConfig(const Config: TConfig): TConfig;` over `procedure UpdateConfig(var Config: TConfig);`
### 19. Async when possible
Prefer asynchronous flows over blocking operations when the framework supports it.
### 20. Predictable code
Clarity over cleverness. Code must be understandable by another developer in seconds.

## Pre-commit Validation
Before committing, compile with warnings treated as errors. The Delphi compiler is the primary static analysis tool — a clean compilation with zero hints/warnings is mandatory.

## Delphi-Specific Documentation
General doc rules (23-30) from [`general.md`](general.md) apply. Additionally:

- **Unit headers**: use XMLDoc `/// <summary>` at the top of each unit
- **Public types**: all enums, records, classes, interfaces must use `/// <summary>` comments
- **Record/class fields**: each field must have its own `/// <summary>` doc describing the data it represents
- **Public methods**: structured block comment with purpose, `@param`, `@return`, and main processing steps
### Inline Comment Triggers
All 15 triggers from [`general.md`](general.md) §25 apply. Use `//` for inline comments. Additionally for Delphi:
- **`{$IFDEF}`** conditional compilation blocks — explain what each condition covers and why
- **`FreeAndNil` outside `finally`** — explain why the standard `try/finally` pattern is not used
- **`as` type casts** — explain why the cast is safe at this point
- **`Pointer` / `PByte` arithmetic** — explain the memory layout being accessed

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


## Typed Algorithms, Constants and Early Results
- Keep public inputs/results, records, collections and internal states explicitly modeled; prefer enums/sets and typed generics to Variant, untyped parameters, pointer casts or stringly typed state. Isolate unavoidable foreign/untyped data at checked boundaries.
- Use scoped const values for stable protocol codes and algorithm sentinels; keep product data/configuration outside implementation literals. Document the not-found contract (named sentinel, nil, or Try-style Boolean/out result as appropriate); never assume zero is an invalid index or identifier.
- Prefer Exit(Value) when the first valid search result is final, followed by the miss result only after the loop. Every normal path must define the return value; do not rely on an uninitialized Result. Preserve try/finally and managed-resource cleanup. Exit(Value) requires Delphi 2009 or later; respect the actual project's compiler.
- Example function-body fragment: LIndex and the returned index are Integer, Values is a typed array, Wanted matches its element type, and NotFoundIndex is the declared API sentinel:

```pascal
for LIndex := 0 to High(Values) do
  if Values[LIndex] = Wanted then
    Exit(LIndex); // First match satisfies this lookup; stop scanning.
Result := NotFoundIndex;
```

- Prefer case over a long equality chain on one enum/ordinal discriminant; keep range/compound conditions or strategy interfaces where they express the real contract. Do not claim case is always faster.
- In hot paths, avoid repeated temporary objects, string concatenation, conversions and collection copies; choose capacity/data structures from actual inputs. Keep object/interface ownership and exception cleanup correct. Const parameters and named literals do not guarantee zero copies/allocations on every target.
- Record target platform/compiler and optimization settings before claiming an early return or removed assignment is faster. The compiler may optimize equivalent source forms; distinguish a clearer implementation from measured speed/memory gains.
- Read [Exit and finally behavior](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Exit), [parameter semantics](https://docwiki.embarcadero.com/RADStudio/Florence/en/Parameters_%28Delphi%29) and [compiler optimizations](https://docwiki.embarcadero.com/RADStudio/Athens/en/Optimization_%28Delphi%29) for the actual toolchain; apply [shared algorithm rules](general.md#33-time-memory-and-control-flow).
