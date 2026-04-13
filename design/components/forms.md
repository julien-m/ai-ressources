# Forms

Field anatomy, validation, keyboard behavior, and cross-platform form patterns.

---

## Field Anatomy & Heights

| Platform | Default height | Label position | Notes |
|----------|---------------|----------------|-------|
| iOS | 36pt (field) | Above or floating | UITextField / SwiftUI TextField |
| Android | 56dp (filled) / 56dp (outlined) | Floating label (M3 default) | Material 3 text fields |
| Web | 40–48px | Above (most common) | Custom, framework-dependent |
### Field Structure
```
[Label]
┌──────────────────────────────────────────┐
│ [Leading icon]  [Value]  [Trailing icon] │
└──────────────────────────────────────────┘
[Helper text / Error message]
```
- Leading icon: optional (search, email, etc.)
- Trailing icon: clear button, password toggle, validation indicator
- Helper text and error message share the same slot — never show both simultaneously

## Labels

| Platform | Convention | Notes |
|----------|-----------|-------|
| iOS | Label above field or inline placeholder | Floating labels uncommon in native iOS |
| Android | Floating label (M3 default) | Animates from placeholder to above on focus |
| Web | Label above field (most accessible) | Floating labels acceptable if `<label>` is always visible |
- **Placeholder is not a label** — it disappears on input and fails accessibility
- Always use a visible `<label>` (web) or accessibility label (native)
- Required fields: append "(required)" to label or mark optional fields instead — pick one pattern

## Validation & Error States

| Strategy | When to validate | Best for |
|----------|-----------------|----------|
| On submit | After form submission | Simple forms, few fields |
| On blur | When field loses focus | Most forms (recommended default) |
| On change | While typing (debounced) | Search, username availability |
| Hybrid | On blur first, then on change after first error | Complex forms (best UX) |
- **Never validate on focus** — showing errors before the user types is hostile
- Debounce on-change validation: **300–500ms** minimum
- Server-side validation always required — client-side is for UX only

| Error pattern | Example | Notes |
|---------------|---------|-------|
| **Inline error** | "Email address is required" | Below the field, red text + icon |
| **Field highlight** | Red border on invalid field | Combine with inline message |
| **Summary** | Error banner at form top | For server errors or multi-field issues |

| Bad message | Good message |
|-------------|-------------|
| "Invalid input" | "Email must include @ and a domain (e.g., name@example.com)" |
| "Error" | "Password must be at least 8 characters" |
| "Required" | "First name is required" |
| "Format error" | "Phone number must be 10 digits" |
- Error text color: `error` token from [../tokens/colors.md](../tokens/colors.md)
- Include an error icon alongside text — don't rely on color alone (accessibility)
- Clear error when the user starts correcting the field

## Keyboard Behavior

| Behavior | iOS | Android | Web |
|----------|-----|---------|-----|
| **Content push** | Scroll view adjusts automatically | `windowSoftInputMode="adjustResize"` | CSS: scroll field into view on focus |
| **Return key** | `.next` / `.done` / `.search` / `.go` | `imeOptions` (next/done/search/go) | `enterkeyhint` attribute |
| **Keyboard type** | `.emailAddress`, `.numberPad`, `.URL` | `inputType` (email, number, phone, uri) | `inputmode` (email, numeric, tel, url) |
| **Dismiss** | Tap outside (varies), scroll, toolbar done | Back button/gesture | Focus next field or blur |
- **Always set the correct keyboard type** — `email` for email, `tel` for phone, `numeric` for amounts
- **Always set the return key action** — "Next" to advance, "Done" to submit
- Test with hardware keyboard (Bluetooth) — tab order must be logical

## Multi-Step Forms

- Show progress: steps indicator, progress bar, or "Step 2 of 4"
- Preserve state: don't lose data on back navigation
- Validate per step — don't let the user advance with invalid data
- Final step: summary/review before submission
- Allow editing previous steps without losing subsequent data

## Autofill & Autocomplete

| Field | iOS `textContentType` | Android `autofillHints` | Web `autocomplete` |
|-------|-----------------------|------------------------|--------------------|
| Name | `.name` | `AUTOFILL_HINT_PERSON_NAME` | `name` |
| Email | `.emailAddress` | `AUTOFILL_HINT_EMAIL_ADDRESS` | `email` |
| Phone | `.telephoneNumber` | `AUTOFILL_HINT_PHONE` | `tel` |
| Password | `.password` | `AUTOFILL_HINT_PASSWORD` | `current-password` |
| New password | `.newPassword` | `AUTOFILL_HINT_NEW_PASSWORD` | `new-password` |
| OTP | `.oneTimeCode` | `AUTOFILL_HINT_SMS_OTP` | `one-time-code` |
| Address | `.streetAddressLine1` | `AUTOFILL_HINT_POSTAL_ADDRESS` | `street-address` |
| Card number | `.creditCardNumber` | `AUTOFILL_HINT_CREDIT_CARD_NUMBER` | `cc-number` |
- **Always set autocomplete/autofill hints** — saves users significant time
- Password managers depend on correct `autocomplete` values
- OTP autofill from SMS requires correct content type on all platforms

## Checklist

- [ ] Every field has a visible label (not just placeholder)
- [ ] Required vs optional fields are clearly indicated
- [ ] Keyboard type matches input (email, phone, number, URL)
- [ ] Return key advances to next field or submits
- [ ] Validation errors are specific, inline, and include an icon
- [ ] Errors clear when the user corrects the input
- [ ] Autofill hints are set for all standard fields
- [ ] Form works with keyboard navigation (tab order is logical)
- [ ] Submit button is disabled during submission (prevent double-submit)
- [ ] Form state persists on back navigation in multi-step flows
- [ ] See [../quality/ui-rules.md](../quality/ui-rules.md) for additional form rules
