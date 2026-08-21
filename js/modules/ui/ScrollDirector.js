export class ScrollDirector {
    constructor(root) {
        this.root = root;
        this.sections = [];
    }

    init() {
        if (!this.root) return;

        this.sections = Array.from(this.root.querySelectorAll('.step'));
        if (!this.sections.length) return;

        document.body.classList.add('story-ready', 'scroll-directed');

        this.sections.forEach((section) => {
            section.classList.add('is-revealed');
            section.style.setProperty('--scroll-progress', '1');
            section.style.setProperty('--chapter-progress', '1');
            this.updateItems(section);
            this.updateMode(section);
        });
    }

    updateItems(section) {
        const items = Array.from(section.querySelectorAll('[data-scroll-item]'));
        if (!items.length) return;

        items.forEach((item) => {
            item.style.setProperty('--item-progress', '1');
        });
    }

    updateMode(section) {
        const mode = section.dataset.scrollMode || 'flow';
        if (mode === 'comparison') {
            section.style.setProperty('--comparison-progress', '1');
        }
        if (mode === 'sticky') {
            section.style.setProperty('--sticky-progress', '1');
        }
    }

    destroy() {
        this.sections = [];
    }
}
