<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Core Engineering Rules (Extracted from .agents/skills)

- **UI / Anti-Slop (`design-taste-frontend`)**:
  - Figma/x.ai design bar: One section per screen, equal edges, grounded real data (never hallucinate fake metrics/facts), no arbitrary purple/violet tint.
  - Tactile micro-interactions (hover step, press on click, subtle transitions); never use tacky random shaking or excessive blinking.
- **Strict Types (`narrow-react-prop-types`)**:
  - Component props and TypeScript types must strictly mirror actual live call-sites; do not widen types or add loose optional `?:` / `any`.
- **Execution Discipline (`unlazy`)**:
  - Never leave half-finished code, mock leftovers, or unverified placeholders.
  - Verify every change with `eslint` / `tsc` before reporting completion.
- **Visuals & Clarity (`show-me` & `rpi`)**:
  - Prefer concise component trees, Mermaid diagrams, or structured diffs when explaining architecture and logic.
  - For complex multi-step features, research & plan before execution.

