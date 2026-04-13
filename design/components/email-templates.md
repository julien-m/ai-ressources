# Email Templates

Email template patterns for SaaS: responsive layout, dark mode, component library, client rendering quirks.

**Read** [`colors.md`](../tokens/colors.md) for dark mode tokens.
**Read** [`typography.md`](../tokens/typography.md) for font stacks.
**Read** [`email-sequences.md`](../../copywriting/email-sequences.md) for email content patterns.

---

## 1. Layout Foundations

Email rendering relies on the **Word HTML engine** in Outlook desktop, which ignores modern CSS layout. Table-based layout remains the only cross-client solution.

| Feature | Apple Mail | Gmail | Outlook 2019+ | Yahoo |
|---------|-----------|-------|----------------|-------|
| `display: flex` | Yes | No | No | Partial |
| `display: grid` | Yes | No | No | No |
| `<table>` layout | Yes | Yes | Yes | Yes |

### Width constraints
| Context | Width | Technique |
|---------|-------|-----------|
| Desktop | 600px max | `<table width="600">` + `max-width: 600px` |
| Mobile | 100% fluid | `width: 100% !important` via media query |
| Sidebar preview | ~320px | Same as mobile rules |

### Hybrid coding
Combine `<table>` for Outlook with `<div>` for modern clients using conditional comments:

```html
<!--[if mso]>
<table role="presentation" width="600" cellpadding="0" cellspacing="0">
<tr><td>
<![endif]-->
<div style="max-width: 600px; margin: 0 auto;">
  <!-- content -->
</div>
<!--[if mso]>
</td></tr>
</table>
<![endif]-->
```

Modern clients ignore the conditional comments and use the `<div>`. Outlook ignores the `<div>` and uses the `<table>`.

### Tooling
| Tool | Approach | Output |
|------|----------|--------|
| MJML | Custom markup | Production-ready tables |
| React Email | React components | Modern DX, good defaults |
| Maizzle | Tailwind CSS | Utility-first, PostCSS pipeline |
| Plain HTML tables | Manual | Full control, no dependencies |

---

## 2. Responsive Patterns

Email responsive design is **inverted** from web: write mobile-first inline styles, then use `@media` queries to override for desktop. Many clients strip `<style>` blocks, so inline styles must be the mobile-friendly baseline.

### Column stacking
Desktop: side-by-side columns via `<table>` cells or `display: inline-block` divs.
Mobile: stack to single column via `display: block !important; width: 100% !important`.

```
Desktop (600px)         Mobile (<480px)
┌────────┬────────┐    ┌──────────────────┐
│ Col 1  │ Col 2  │ →  │     Col 1        │
└────────┴────────┘    ├──────────────────┤
                       │     Col 2        │
                       └──────────────────┘
```

### Fluid images
Always set `max-width: 100%; height: auto; display: block;` in CSS. Set `width` attribute on `<img>` for Outlook, which ignores CSS `max-width`.

### Font sizing
| Element | Desktop | Mobile minimum |
|---------|---------|----------------|
| Body text | 14-16px | 14px |
| Headings | 24-32px | 22px |
| Preheader / small | 12px | 12px |
| CTA button text | 16-18px | 16px |

Below 14px, mobile clients may auto-resize text, breaking layout.

### CTA buttons
| Property | Desktop | Mobile |
|----------|---------|--------|
| Min height | 44px | 44px |
| Width | Auto (padded) | 100% (`display: block`) |
| Padding | 12px 24px | 14px 24px |
| Font size | 16px | 16px |

44px minimum height satisfies touch target guidelines (Apple HIG, Material Design).

---

## 3. Dark Mode

### Client behaviors
| Behavior | Clients | What happens |
|----------|---------|--------------|
| Auto-invert | Apple Mail, Outlook.com | Swaps light/dark automatically |
| Partial | Gmail (web + app) | Inverts some elements unpredictably |
| None | Outlook 2019+ desktop, Yahoo, Thunderbird | Renders as authored |

### CSS support
Use `<meta name="color-scheme" content="light dark">` and `@media (prefers-color-scheme: dark)` to override colors. Supported in Apple Mail, Outlook.com, Hey. Not in Gmail or Outlook desktop.

### Images in dark mode
| Image type | Problem | Solution |
|------------|---------|----------|
| Transparent PNG (logo) | Background turns dark, logo disappears | Add light border or background color on `<img>` |
| Dark logo on transparent | Invisible on dark background | Provide light variant, swap via `@media` |
| SVG with `currentColor` | Adapts automatically | Preferred if client supports SVG (not Outlook) |
| Decorative images | May look harsh on dark | Use images with built-in padding/margins |

Provide two logo variants (light + dark). Swap via `@media (prefers-color-scheme: dark)` using `display: none / block`. Fallback for clients that strip `<style>`: dark-on-transparent logo with inline light background.

---

## 4. Components

| Component | Specs | Notes |
|-----------|-------|-------|
| Header | Logo max 200px wide, always include `alt` text, 3-4 nav links (plain text, hide on mobile if needed), height 60-80px | — |
| Hero | Full-width image or gradient bg (VML for Outlook), headline 24-32px bold one line, short copy, single high-contrast CTA, always provide image `alt` text | — |
| Content block | Icon 48-64px (left-aligned desktop, stacked mobile) + title + description 2-3 lines max, 14-16px body | — |
| Footer | Unsubscribe link **must be functional** (required CAN-SPAM, GDPR, one-click preferred), physical address (CAN-SPAM), social icons 24-32px **link to profiles**, font 12px muted color | — |
| Divider | `<hr>` inside `<table role="presentation">` cell with vertical padding | Always `role="presentation"` on layout tables for accessibility |

### CTA Button (bulletproof)
Outlook ignores `border-radius` and `padding` on `<a>` tags. Use VML (`<v:roundrect>`) inside `<!--[if mso]>` conditional for Outlook, and a styled `<a>` with `background-color`, `border-radius`, `line-height`, and `display: inline-block` for other clients.

---

## 5. Client Quirks

| Client | CSS Support | Dark Mode | Images | Notes |
|--------|-----------|-----------|--------|-------|
| Apple Mail | Excellent | Auto-invert | Auto-load | Best rendering. Supports `@media`, flexbox, animations. |
| Gmail (web) | Strips `<style>`, inlines only | Partial | Auto-load | Inline CSS only. Class selectors stripped. |
| Gmail (app) | Strips `<style>` | Partial | Auto-load | Same limitations as web. |
| Outlook 2019+ | Word rendering engine | None | Blocked by default | Use VML for buttons and background images. |
| Outlook.com | Good | Auto-invert | Auto-load | Different engine from desktop Outlook. |
| Yahoo | Good | None | Auto-load | Supports `@media` queries. |
| Thunderbird | Good | Via extension | Auto-load | Standards-compliant. Small market share. |

### Key implications
- **Gmail**: all styles must be inlined. No `<style>` block, no `@media`, no hover states.
- **Outlook desktop**: test every email. VML required for rounded corners, background images, and bulletproof buttons.
- **Images blocked**: Outlook desktop blocks images by default. Always provide descriptive `alt` text and styled `alt` fallbacks (font, color, size on `<img>`).

---

## 6. Transactional vs Marketing

| Aspect | Transactional | Marketing |
|--------|--------------|-----------|
| Purpose | Action confirmation, account events | Promotion, nurture, engagement |
| Design | Plain, minimal, single-focus | Branded, multi-section, visual |
| CTA count | 1 | 1 primary + 1-2 secondary max |
| Unsubscribe | Not legally required (but recommended) | Required (CAN-SPAM, GDPR) |
| Timing | Immediate, event-triggered | Scheduled, respect send frequency |
| Deliverability | High (expected by recipient) | Variable (reputation-dependent) |
| Examples | Password reset, receipt, shipping | Newsletter, product launch, re-engagement |

### Shared base template
Both types share a base layout (header, content area, footer) for brand consistency. Transactional strips to essentials: logo, content, footer. Marketing extends with hero, multiple content blocks, and social links.

### Frequency guidelines
| Email type | Cadence |
|------------|---------|
| Transactional | As needed (event-driven) |
| Onboarding sequence | 1 per day for 3-5 days, then taper |
| Newsletter | Weekly or bi-weekly |
| Product updates | Monthly max |
| Re-engagement | After 30-60 days of inactivity |

---

## 7. Testing

### Tools
| Tool | Type | Strength |
|------|------|----------|
| Litmus | Cloud | 90+ client previews, analytics, spam testing |
| Email on Acid | Cloud | Client previews, accessibility checks |
| Mailtrap | Staging | Safe inbox for dev/staging, API testing |
| Manual testing | Local | Send test emails to real accounts |

### Pre-send checklist
| Check | Method |
|-------|--------|
| All links functional | Click-through in preview |
| Images have `alt` text | HTML review |
| Unsubscribe link works | Click-through test |
| Plain-text fallback exists | Send to client that strips HTML |
| Preview text is set | Check in inbox list view |
| Subject line < 50 chars | Character count |
| Renders in Outlook desktop | Litmus / Email on Acid / manual |
| Renders in Gmail (web) | Send to test Gmail account |
| Dark mode checked | Apple Mail dark mode toggle |
| CTA contrast >= 4.5:1 | Accessibility tool |
| Physical address in footer | Visual check |

Test against the Client Quirks table (section 5) as the minimum coverage matrix. Priority: Gmail (largest share), Apple Mail, Outlook desktop, then others.

RTL language support is out of scope for this reference.

---

## 8. Anti-patterns

| Anti-pattern | Problem | Fix |
|-------------|---------|-----|
| Image-only emails | Fails when images blocked (Outlook default), invisible to screen readers, kills deliverability | Use live text for all content. Images supplement, never replace |
| Tiny text (<14px mobile) | Triggers auto-resize in iOS Mail, breaking layout | Minimum 14px body, 22px headings on mobile |
| Too many CTAs | Multiple competing calls-to-action dilute click-through rate | 1 email = 1 primary CTA. Secondary actions as text links only, visually subordinate |
| No plain-text fallback | HTML-only emails penalized by some clients and spam filters | Always generate a plain-text version. Most ESPs do this automatically; verify it exists and is readable |
| Broken preview text | Empty preview causes clients to pull first body text ("View in browser", logo alt text) | Set explicit preview text via hidden `<span>` (see below) |
| Missing `role="presentation"` | Layout tables announced as data tables by screen readers | Add `role="presentation"` to every layout `<table>`. Only omit for actual data tables |

### Preview text technique

```html
<span style="display:none;max-height:0;overflow:hidden;">
  Your preview text here.
  &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;<!-- repeat to fill preview -->
</span>
```

The `&zwnj;` (zero-width non-joiner) and `&nbsp;` padding prevents the client from pulling additional body text into the preview.
