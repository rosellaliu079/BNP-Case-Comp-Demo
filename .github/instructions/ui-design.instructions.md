---
name: UI Design and Accessibility
description: "Use for React component and stylesheet changes in the BNP case-competition CRM prototype. Covers professional visual design, responsive behavior, accessibility, and preserving existing UI behavior and demo facts."
applyTo: ["src/**/*.tsx", "src/**/*.css"]
---
# UI Design and Accessibility

- Design for a professional financial-workflow audience: clear hierarchy, restrained detail, compact scannable layouts, and consistent spacing. Preserve the existing product's visual language unless a redesign is requested.
- Make screens feel intentionally designed for their workflow, not like generic templates. Prefer useful visual hierarchy over decorative effects or explanatory feature copy.
- Preserve supplied client, financial, regulatory, and other factual content. UI work must not invent, modify, or remove facts.
- Keep layouts usable at narrow widths. Allow long content to wrap, constrain fixed-width regions, and prevent text, controls, and panels from overlapping or forcing page-wide overflow.
- Use semantic HTML and native controls where possible. Maintain keyboard operation, visible focus, meaningful labels for icon-only buttons, and adequate target sizes.
- Use the project's existing Tailwind and `lucide-react` conventions. Avoid adding dependencies or introducing a competing design system for routine changes.
- Keep presentation changes separate from state and callback behavior. When behavior must change, follow the existing component and data-flow patterns and preserve unrelated interactions.
- Check the relevant view at desktop and mobile widths when practical, then run `npm run lint` and `npm run build` for meaningful UI changes.