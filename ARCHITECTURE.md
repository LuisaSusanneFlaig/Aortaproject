# Project Structure

## Canonical source layout

- `js/modules/` contains the real implementation.
- `js/*.js` are thin compatibility entrypoints that re-export from `js/modules/`.
- `js/modules/core/` contains reusable low-level infrastructure.
- `js/modules/effects/` contains 3D motion and particle systems.
- `js/modules/ui/` contains UI managers and editor panels.
- `css/` contains global styling, with `editor-ui.css` owning the editor shell and inspector.

## Naming conventions

- Use `PascalCase` for classes and class-file pairings, for example `SceneManager.js`.
- Use `camelCase` for utility modules and data modules, for example `storyContent.js`.
- Keep one canonical implementation per feature.
- Keep root-level files as wrappers only when an external entrypoint depends on them.

## Recommended next steps

- Move duplicated legacy files out of the active tree or delete them after a final import audit.
- Split `scrollytelling.js` into smaller coordinator modules for scroll, 3D, and editor wiring.
- Add a single barrel export per domain if the codebase grows further.
