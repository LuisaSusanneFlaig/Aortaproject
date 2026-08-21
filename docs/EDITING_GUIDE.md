# Editing guide

This is the starting point for human programmers and small-context coding models.

## Commands

```powershell
npm run dev
npm run validate
npm run check
```

`dev` serves `http://127.0.0.1:8765` without browser caching. `validate` checks story structure, navigation, element types, accessibility fields, percentages, and assets. `check` also checks JavaScript syntax and CSS braces.

## Change content

- Dissection: `js/stories/dissection/story.js`
- Aneurysm: `js/stories/aneurysm/story.js`

Change only `text`, `title`, `caption`, or `reference` when no layout change is intended.

## Add a section

```js
{
    id: 'stable-unique-id',
    title: 'Visible section title',
    scrollMode: 'flow',
    elements: [
        { type: 'text', text: 'Section copy.' }
    ]
}
```

Allowed scroll modes: `flow`, `sticky`, `sequence`, and `comparison`.

## Add a chapter opener

Openers are generated from navigation entries:

```js
nav: [{ href: '#stable-unique-id', label: 'Chapter label' }]
```

Do not add chapter HTML manually. Change its design in `css/tokens.css` or `css/components/chapter-opener.css`.

## Common elements

```js
{ type: 'heading', text: 'Subheading' }
{ type: 'text', text: 'Paragraph copy.' }
{ type: 'pullQuote', text: 'Highlighted quotation.' }
{ type: 'reference', text: 'Source and DOI.' }
{
    type: 'image',
    src: 'assets/story_images/example.png',
    alt: 'Concrete image description',
    caption: 'Optional caption.',
    aspect: '4 / 3'
}
```

Basic HTML is in `js/components/basicElements.js`. Data visualizations are in `js/components/dataVisuals.js`; clinical paths and treatment components are in `js/components/clinicalElements.js`.

## Add an element type

1. Register it in `js/stories/storySchema.js`.
2. Add a focused renderer in `js/components/`.
3. Dispatch it from `js/modules/storyRenderer.js`.
4. Add CSS under `css/components/`.
5. Add validation for required fields.
6. Run `npm run check`.

## Adjust design

Use `css/tokens.css` first. Add reusable values there instead of repeating numbers. For one component, edit its file in `css/components/`. Avoid adding unrelated rules to legacy `css/scrollytelling.css`.

## Medical checklist

- State whether evidence concerns thoracic, abdominal, or all aortic disease.
- Do not turn population findings into a fictional patient's prediction.
- Include a guideline, paper, dataset, or DOI in a `reference` element.
- Distinguish patient imaging from simulations, in-vitro models, and illustrations.

## Prompt template

```text
Read AGENTS.md and docs/EDITING_GUIDE.md.
Change only <named story/component>.
Preserve section IDs and existing behavior.
Do not edit unrelated files.
Run npm run check and report the result.
```
