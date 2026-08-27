# Full Project UI/UX Audit, Consistency & Redesign

Use the **UI/UX Pro Max skill** to perform a complete professional UI/UX audit and improvement of this entire project.

This is NOT a request to redesign one page.

You must inspect and improve the **entire application**, including every route, page, component, layout, modal, form, card, table, navigation element, responsive state, loading state, empty state, error state, and reusable UI component.

## 1. FIRST: AUDIT THE ENTIRE PROJECT

Before changing anything:

* Scan the complete project structure.
* Identify the framework, UI library, styling system, component architecture, routing system, and existing design patterns.
* Find every application route/page.
* Find every shared component.
* Find layouts, navigation, headers, footers, sidebars, dialogs, forms, tables, cards, buttons, inputs, badges, tabs, dropdowns, tooltips, etc.
* Identify duplicated UI patterns.
* Identify inconsistent styles.
* Identify pages that use different spacing, typography, colors, borders, shadows, radii, or component behavior.
* Identify obsolete, unnecessary, or conflicting CSS.
* Identify hardcoded colors and spacing values that should become design tokens.
* Check desktop, tablet, and mobile layouts.
* Check dark/light mode if the project supports it.
* Check accessibility issues.
* Check visual hierarchy.
* Check interaction states.

Do NOT immediately start randomly editing files.

First build a mental model of the application's current UI architecture.

---

# 2. ESTABLISH A SINGLE DESIGN SYSTEM

Create or improve a consistent design system based on the existing product's purpose and branding.

Do NOT blindly replace the existing visual identity.

Preserve the project's core brand identity unless the current design is objectively poor.

Define consistent:

### Colors

Audit every color currently used.

Look for:

* random hex values
* unnecessary colors
* poor contrast
* colors that are too saturated
* colors that don't belong to the brand
* inconsistent background colors
* inconsistent text colors
* inconsistent border colors
* inconsistent success/warning/error colors
* buttons using different shades for the same action
* cards using unrelated backgrounds

Create a coherent semantic color system such as:

* primary
* primary hover
* primary active
* secondary
* background
* surface
* elevated surface
* text primary
* text secondary
* text muted
* border
* divider
* success
* warning
* error
* info

Do not introduce colors just for decoration.

Every color must have a purpose.

### Typography

Audit:

* font family
* font weights
* font sizes
* line heights
* letter spacing
* heading hierarchy
* body text
* captions
* labels
* button typography

Create a clear typography hierarchy.

Avoid excessive font sizes and unnecessary font-weight variations.

### Spacing

Establish a consistent spacing scale.

Fix random:

* margins
* padding
* gaps
* section spacing
* card spacing
* form spacing

Use the project's existing spacing system where possible.

### Border Radius

Standardize:

* cards
* buttons
* inputs
* modals
* dropdowns
* badges
* images

Avoid having every component use a different radius.

### Shadows

Remove excessive or ugly shadows.

Use subtle elevation only where it improves hierarchy.

### Borders

Standardize border thickness and colors.

Avoid unnecessary borders.

---

# 3. AUDIT EVERY PAGE INDIVIDUALLY

Go through EVERY route one by one.

For each page, evaluate:

## Visual hierarchy

Ask:

* Is the most important information immediately obvious?
* Is the page visually balanced?
* Are headings clear?
* Is there too much empty space?
* Is the page overcrowded?
* Are sections logically grouped?
* Does the eye naturally move through the page?

## Layout

Check:

* container width
* alignment
* grid structure
* spacing
* columns
* responsive behavior
* vertical rhythm
* section ordering
* card placement

Fix awkward layouts rather than simply adding decoration.

## Components

Check every:

* button
* input
* select
* checkbox
* radio
* card
* table
* badge
* alert
* modal
* dropdown
* navigation item
* tab
* pagination
* tooltip

Make them visually consistent.

## Content density

Identify areas that are:

* too dense
* too sparse
* difficult to scan
* visually noisy

Improve information hierarchy without removing useful functionality.

---

# 4. FIX BAD UI PATTERNS

Actively look for common problems such as:

* inconsistent button sizes
* buttons with inconsistent radius
* random colors
* poor contrast
* excessive rounded corners
* excessive glassmorphism
* excessive gradients
* excessive shadows
* huge headings
* tiny text
* weak hierarchy
* inconsistent cards
* inconsistent spacing
* misaligned elements
* awkward empty space
* crowded dashboards
* unnecessary decorative elements
* generic AI-looking UI
* inconsistent icon sizes
* icons that don't align with text
* poor table layouts
* poorly designed forms
* unclear primary actions
* too many primary-colored elements
* excessive use of accent colors
* inconsistent hover states
* missing focus states
* missing disabled states
* missing loading states
* missing empty states
* missing error states
* mobile overflow
* horizontal scrolling where it shouldn't exist
* content touching screen edges
* navigation that becomes unusable on smaller screens

Fix these wherever they occur.

---

# 5. MAKE THE UI FEEL INTENTIONAL

The goal is:

**Professional product UI — not "AI generated website" UI.**

Avoid blindly adding:

* gradients
* glowing effects
* glass cards
* huge rounded containers
* random blobs
* excessive animations
* unnecessary 3D effects
* decorative backgrounds
* excessive icons

Use visual effects only when they support the product.

Prioritize:

* hierarchy
* spacing
* alignment
* typography
* contrast
* usability
* consistency
* clarity

---

# 6. RESPONSIVE DESIGN AUDIT

Check every page at:

* 320px
* 375px
* 390px
* 430px
* 768px
* 1024px
* 1280px
* 1440px+

Fix:

* overflow
* broken grids
* oversized components
* navigation problems
* text wrapping
* buttons becoming unusable
* tables overflowing
* cards becoming too narrow
* excessive whitespace
* mobile spacing
* sidebar behavior
* modal sizing
* form layouts

Do not treat mobile as an afterthought.

---

# 7. INTERACTION STATES

Every interactive component should have appropriate states.

Audit and fix:

* default
* hover
* active
* focus
* disabled
* loading
* success
* error

Make transitions subtle and consistent.

Do not add animations everywhere.

Use motion only where it improves feedback or navigation.

---

# 8. ACCESSIBILITY

Audit:

* color contrast
* keyboard navigation
* focus visibility
* button labels
* form labels
* semantic HTML
* aria attributes where appropriate
* clickable element sizes
* heading hierarchy
* screen-reader considerations

Do not sacrifice accessibility for aesthetics.

---

# 9. ICONS

Audit the icon system.

Use one coherent icon family wherever possible.

Fix:

* inconsistent icon styles
* inconsistent icon sizes
* incorrect icon choices
* icons that are too large
* icons that don't align vertically
* decorative icons being mistaken for interactive controls

Do not mix random icon libraries unless there is a strong reason.

---

# 10. FORMS

Perform a dedicated form UX audit.

Fix:

* unclear labels
* bad spacing
* inconsistent input heights
* poor error messages
* confusing validation
* weak focus states
* bad placeholder usage
* buttons positioned poorly
* excessive fields shown at once
* poor mobile layouts

Forms should feel simple and predictable.

---

# 11. TABLES & DATA-DENSE UI

Where tables exist:

* improve readability
* align numerical data correctly
* improve column spacing
* improve row height
* improve headers
* improve hover states
* improve pagination
* improve mobile behavior
* prevent unnecessary visual noise

For mobile, use an appropriate responsive strategy rather than allowing ugly horizontal overflow.

---

# 12. DASHBOARDS

For dashboard pages specifically:

Prioritize:

1. Important information first
2. Clear page title
3. Primary actions
4. Summary metrics
5. Important trends/data
6. Secondary information
7. Detailed information

Do not make every card visually equal.

Create clear visual hierarchy.

---

# 13. NAVIGATION

Audit the complete navigation system.

Check:

* active states
* hierarchy
* spacing
* icons
* labels
* grouping
* sidebar behavior
* mobile navigation
* breadcrumbs
* header
* profile/account controls

The user should always understand:

**Where am I?**
**Where can I go?**
**What can I do here?**

---

# 14. COMPONENT REFACTORING

If multiple pages implement visually similar components differently:

DO NOT patch them individually.

Create or improve reusable components.

For example:

* Button
* Input
* Select
* Card
* Badge
* Modal
* Table
* PageHeader
* EmptyState
* LoadingState
* ErrorState
* Section
* Tabs
* Dropdown
* Tooltip

Then migrate pages to those components where appropriate.

The goal is a maintainable visual system, not just prettier individual pages.

---

# 15. DO NOT BREAK FUNCTIONALITY

This is extremely important.

While improving UI:

* Do NOT remove existing features.
* Do NOT remove business logic.
* Do NOT break API calls.
* Do NOT change database behavior.
* Do NOT break authentication.
* Do NOT change routes unnecessarily.
* Do NOT remove working functionality just because the UI is ugly.
* Do NOT replace working functionality with mock data.
* Do NOT hardcode dynamic data.
* Do NOT introduce unnecessary dependencies.

Preserve existing functionality unless a change is explicitly required for UX.

---

# 16. CODE QUALITY

While making UI improvements:

* remove obsolete styling
* remove duplicate CSS
* remove unused UI components
* consolidate repeated styles
* use existing design tokens
* keep components maintainable
* avoid huge components where practical
* avoid unnecessary inline styles
* follow the project's existing architecture
* don't rewrite the entire application unnecessarily

Make the smallest architectural changes necessary to achieve a significantly better UI.

---

# 17. PAGE-BY-PAGE EXECUTION ORDER

Work systematically.

Use this process:

### Phase 1 — Discovery

Inspect the entire application.

Identify:

* all routes
* all components
* all layouts
* all styling
* current design system
* major inconsistencies

### Phase 2 — Design System

Establish:

* colors
* typography
* spacing
* radius
* borders
* shadows
* component dimensions
* interaction states

### Phase 3 — Shared Components

Fix the reusable components first.

### Phase 4 — Global Layout

Fix:

* navigation
* sidebar
* header
* footer
* global container
* page spacing
* responsive framework

### Phase 5 — Pages

Then process EVERY page individually.

Do not stop after improving the homepage/dashboard.

### Phase 6 — Responsive Pass

Re-check every page on mobile, tablet and desktop.

### Phase 7 — Consistency Pass

Search the entire codebase again for:

* inconsistent colors
* inconsistent spacing
* duplicate components
* random border radii
* random shadows
* inconsistent typography
* one-off UI patterns

Fix remaining inconsistencies.

### Phase 8 — Final QA

Verify:

* build succeeds
* no TypeScript errors
* no console errors caused by your changes
* routes still work
* interactions still work
* responsive layouts work
* no broken imports
* no missing assets
* no accidental feature removal

---

# 18. IMPORTANT DESIGN RULE

Do not redesign based purely on personal taste.

Every significant visual change should improve at least one of:

* usability
* hierarchy
* readability
* consistency
* accessibility
* responsiveness
* conversion
* perceived product quality

If an existing design is already good, leave it alone.

**Do not change things simply to make them different.**

---

# 19. VISUAL QUALITY BAR

The final application should feel like a deliberately designed production product.

It should NOT feel like:

* a template
* a generic SaaS starter
* an AI-generated UI
* a collection of unrelated pages
* a collection of random Tailwind components

Every page should feel like it belongs to the same product.

The user should be able to navigate from one page to another without feeling like the design system suddenly changed.

---

# 20. EXECUTION RULE

Do not ask me for approval after every small change.

Proceed autonomously.

Inspect → diagnose → fix → verify → continue.

If you encounter a design decision that is ambiguous, choose the option that provides the strongest combination of:

**clarity + usability + consistency + visual quality + accessibility.**

Do not stop after finding a few issues.

The task is complete only after you have performed a full pass through the **entire project and every page**.

At the end, provide a concise summary containing:

1. Pages audited
2. Major UI problems found
3. Major improvements made
4. Design-system changes
5. Components refactored
6. Responsive fixes
7. Accessibility fixes
8. Any remaining issues that require manual review

Now begin with the complete project audit.
