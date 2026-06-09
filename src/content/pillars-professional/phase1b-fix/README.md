# BCG FOR-PROFESSIONALS PAGE FIX
## Phase 1b — quick fix to add the missing 3 pillars to the technical topics index

## The issue

The `/for-professionals` page on the live site only shows 8 technical topics because the page code has a hardcoded list with only 8 pillars in it. The 3 missing are:

- Health & Safety Risk Assessment
- Fire Extinguishers
- Workplace Safety Training

The pillar MDX files exist (uploaded in Phase 1) and the `/[slug]/professional` URLs work directly for all 11. The for-professionals index just needs the missing 3 added to its list.

## The fix

Updated `for-professionals/page.tsx` with all 11 pillars in the list. Summary descriptions for each have been refreshed to reflect current-edition content.

## Where this file goes

Replaces the existing file at:

```
starter-repo/src/app/for-professionals/page.tsx
```

## Upload

Either method:

**Drag-and-drop:**
1. Navigate to `starter-repo/src/app/for-professionals/` on GitHub
2. Click Add file → Upload files
3. Drag `for-professionals/page.tsx` from this package
4. Commit message: `Add missing 3 pillars to technical topics index (H&S RA, Fire Extinguishers, Workplace Safety Training)`
5. Commit changes

**Paste-replace:**
1. Navigate to `starter-repo/src/app/for-professionals/page.tsx` on GitHub
2. Pencil icon, Ctrl+A to select all, Delete
3. Open the local file in a plain text editor
4. Ctrl+A, Ctrl+C
5. Paste into GitHub editor
6. Commit message as above
7. Commit changes

## After deploy

Refresh the `/for-professionals` page on the live site. You should see 11 cards instead of 8, laid out in a 2-column grid (so ~5-6 rows depending on viewport).

The 11 topics in order:
1. Health & Safety Risk Assessment
2. Fire Risk Assessment
3. PAT Testing
4. Legionella Risk Assessment
5. Fire Alarm Systems
6. Emergency Lighting
7. Electrical (EICR)
8. Gas Safety
9. Asbestos Management
10. Fire Extinguishers
11. Workplace Safety Training

Each card is clickable through to the corresponding `/[slug]/professional` page.

## Risk

Very low. This is a content/list change in a single page component. No new routes, no new dependencies, no API changes. If the existing for-professionals page renders, this version renders.
