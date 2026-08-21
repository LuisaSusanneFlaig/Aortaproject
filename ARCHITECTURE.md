# Architecture

## Data flow

```text
js/stories/*/story.js
        |
        v
js/modules/storyContent.js
        |
        v
js/modules/storyRenderer.js ---> js/components/*
        |
        v
chapter openers and .step sections
        |
        +--> GsapSectionAnimator
        +--> InlineModelViewer
        +--> ScrollytellingApp / Three.js
```

## Ownership

- `js/stories/`: declarative content, navigation, configuration, and assets.
- `js/components/`: focused HTML renderers for reusable story elements.
- `js/modules/storyRenderer.js`: page assembly and element dispatch only.
- `js/modules/scrollytelling.js`: application orchestration, scroll state, and 3D coordination.
- `js/modules/ui/`: interactive behavior acting on rendered markup.
- `css/tokens.css`: stable design controls.
- `css/components/`: isolated component styles.
- `tools/`: development server and deterministic validation.

## Compatibility boundaries

`storyVersions`, HTML entry-point names, section IDs, and `.step` indexing are compatibility boundaries. Preserve them unless a coordinated migration is intentional.
