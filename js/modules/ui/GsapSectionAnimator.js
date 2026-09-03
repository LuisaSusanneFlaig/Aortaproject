export class GsapSectionAnimator {
    constructor(root) {
        this.root = root;
        this.animations = [];
        this.media = null;
    }

    init() {
        if (!this.root) return;

        const { gsap, ScrollTrigger } = window;
        const sections = this.root.querySelectorAll('.step');
        const openers = this.root.querySelectorAll('.chapter-opener');
        if (!gsap || !ScrollTrigger || (!sections.length && !openers.length)) return;

        gsap.registerPlugin(ScrollTrigger);

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            sections.forEach((section) => {
                gsap.set(section.querySelector('.text-box'), { clearProps: 'all' });
            });
            openers.forEach((opener) => gsap.set(opener.querySelectorAll('*'), { clearProps: 'all' }));
            return;
        }

        const getNavbarHeight = () => document.querySelector('.navbar')?.offsetHeight || 0;
        const getTravel = () => Math.max(1, window.innerHeight - getNavbarHeight());

        this.media = gsap.matchMedia();
        this.media.add({
            roomy: '(min-width: 821px) and (min-height: 761px)',
            compact: '(max-width: 820px), (max-height: 760px)'
        }, ({ conditions }) => {
            const localAnimations = [];

            this.addSymptomButtonShine(gsap, localAnimations);
            this.addDiagnosticButtonShine(gsap, localAnimations);

            openers.forEach((opener) => {
                const inner = opener.querySelector('.chapter-opener-inner');
                const icon = opener.querySelector('.chapter-opener-icon');
                const eyebrow = opener.querySelector('.chapter-opener-eyebrow');
                const title = opener.querySelector('.chapter-opener-title');
                const rule = opener.querySelector('.chapter-opener-rule');
                if (!inner) return;

                const openerTimeline = gsap.timeline({
                    scrollTrigger: {
                        trigger: opener,
                        start: 'top 82%',
                        toggleActions: 'play none none reverse',
                        onToggle: ({ isActive }) => {
                            opener.classList.toggle('is-chapter-active', isActive);
                        }
                    }
                });

                openerTimeline.fromTo(inner, {
                    autoAlpha: 0,
                    y: 24
                }, {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.55,
                    ease: 'power2.out'
                });

                if (icon) {
                    openerTimeline.fromTo(icon, {
                        scale: 0.7,
                        rotation: -8
                    }, {
                        scale: 1,
                        rotation: 0,
                        duration: 0.55,
                        ease: 'back.out(1.7)'
                    }, 0);
                }

                if (eyebrow) {
                    openerTimeline.fromTo(eyebrow, {
                        autoAlpha: 0,
                        y: 10
                    }, {
                        autoAlpha: 1,
                        y: 0,
                        duration: 0.4,
                        ease: 'power2.out'
                    }, 0.08);
                }

                if (title) {
                    openerTimeline.fromTo(title, {
                        autoAlpha: 0,
                        y: 24
                    }, {
                        autoAlpha: 1,
                        y: 0,
                        duration: 0.55,
                        ease: 'power2.out'
                    }, 0.12);
                }

                if (rule) {
                    openerTimeline.fromTo(rule, {
                        scaleX: 0,
                        transformOrigin: 'left center'
                    }, {
                        scaleX: 1,
                        duration: 0.55,
                        ease: 'power2.out'
                    }, 0.22);
                }

                localAnimations.push(openerTimeline);
                this.animations.push(openerTimeline);
            });

            sections.forEach((section, index) => {
                const content = section.querySelector('.text-box');
                if (!content) return;

                this.addInlineModelRotation(section, gsap, localAnimations);

                if (content.classList.contains('story-split-shell')) {
                    const copy = content.querySelector('.story-copy-column');
                    const activeTrigger = ScrollTrigger.create({
                        trigger: section,
                        start: 'top 62%',
                        end: 'bottom 38%',
                        onToggle: ({ isActive }) => {
                            section.classList.toggle('is-gsap-active', isActive);
                        }
                    });
                    localAnimations.push(activeTrigger);
                    this.animations.push(activeTrigger);

                    if (copy) {
                        const copyReveal = gsap.fromTo(copy, {
                            autoAlpha: 0.3,
                            y: 44
                        }, {
                            autoAlpha: 1,
                            y: 0,
                            ease: 'none',
                            scrollTrigger: {
                                trigger: section,
                                start: 'top 86%',
                                end: 'top 46%',
                                scrub: true
                            }
                        });
                        localAnimations.push(copyReveal);
                        this.animations.push(copyReveal);
                    }
                    return;
                }

                const isFirstSection = index === 0;
                const compact = conditions.compact;
                const timeline = gsap.timeline({
                    scrollTrigger: {
                        trigger: section,
                        start: () => {
                            if (compact) {
                                return isFirstSection
                                    ? `top top+=${getNavbarHeight()}`
                                    : 'top 90%';
                            }
                            return isFirstSection
                                ? `top top+=${getNavbarHeight()}`
                                : 'top bottom';
                        },
                        end: () => compact
                            ? `bottom top+=${getNavbarHeight()}`
                            : `+=${getTravel() * (isFirstSection ? 1 : 2)}`,
                        pin: !compact,
                        pinSpacing: !compact,
                        anticipatePin: compact ? 0 : 1,
                        scrub: true,
                        invalidateOnRefresh: true,
                        onToggle: ({ isActive }) => {
                            section.classList.toggle('is-gsap-active', isActive);
                        },
                        onUpdate: ({ progress }) => {
                            section.dataset.gsapProgress = progress.toFixed(4);
                        }
                    }
                });

                if (isFirstSection) {
                    if (compact) {
                        timeline
                            .set(content, {
                                autoAlpha: 1,
                                y: 0,
                                scale: 1,
                                filter: 'blur(0px)'
                            })
                            .to({}, { duration: 0.68 })
                            .to(content, {
                                autoAlpha: 0,
                                y: () => Math.min(64, getTravel() * 0.09) * -1,
                                scale: 0.97,
                                filter: 'blur(8px)',
                                duration: 0.32,
                                ease: 'none'
                            });
                    } else {
                        timeline
                            .to(content, {
                                autoAlpha: 1,
                                y: 0,
                                scale: 1,
                                filter: 'blur(0px)',
                                duration: 0.58,
                                ease: 'none'
                            })
                            .to(content, {
                                autoAlpha: 0,
                                y: () => getTravel() * -1,
                                scale: 0.92,
                                filter: 'blur(12px)',
                                duration: 0.42,
                                ease: 'none'
                            });
                    }
                } else {
                    if (compact) {
                        const travel = () => Math.min(64, getTravel() * 0.09);
                        timeline
                            .fromTo(content, {
                                autoAlpha: 0,
                                y: () => travel(),
                                scale: 0.97,
                                filter: 'blur(8px)',
                                transformOrigin: '50% 50%'
                            }, {
                                autoAlpha: 1,
                                y: 0,
                                scale: 1,
                                filter: 'blur(0px)',
                                duration: 0.24,
                                ease: 'none'
                            })
                            .to({}, { duration: 0.52 })
                            .to(content, {
                                autoAlpha: 0,
                                y: () => travel() * -1,
                                scale: 0.97,
                                filter: 'blur(8px)',
                                duration: 0.24,
                                ease: 'none'
                            });
                    } else {
                        timeline
                            .fromTo(content, {
                                autoAlpha: 0,
                                y: 0,
                                scale: 0.9,
                                filter: 'blur(14px)',
                                transformOrigin: '50% 50%'
                            }, {
                                autoAlpha: 1,
                                y: () => getTravel() * -1,
                                scale: 1,
                                filter: 'blur(0px)',
                                duration: 0.32,
                                ease: 'none'
                            })
                            .to({}, { duration: 0.36 })
                            .to(content, {
                                autoAlpha: 0,
                                y: () => getTravel() * -2,
                                scale: 0.92,
                                filter: 'blur(12px)',
                                duration: 0.32,
                                ease: 'none'
                            });
                    }
                }

                localAnimations.push(timeline);
                this.animations.push(timeline);
            });

            return () => {
                localAnimations.forEach((animation) => {
                    const index = this.animations.indexOf(animation);
                    if (index >= 0) this.animations.splice(index, 1);
                    animation.scrollTrigger?.kill();
                    animation.kill();
                });
                sections.forEach((section) => {
                    section.classList.remove('is-gsap-active');
                    delete section.dataset.gsapProgress;
                    const modelContainer = section.querySelector('[data-inline-model]');
                    if (modelContainer) delete modelContainer.dataset.scrollRotationBound;
                });
                openers.forEach((opener) => opener.classList.remove('is-chapter-active'));
            };
        });

        requestAnimationFrame(() => ScrollTrigger.refresh());
    }

    addSymptomButtonShine(gsap, localAnimations) {
        const buttons = this.root.querySelectorAll('.symptom-info-trigger');
        buttons.forEach((button, index) => {
            const shineElement = button.querySelector('.symptom-button-shine');
            if (!shineElement) return;

            const shine = gsap.timeline({
                delay: 0.8 + index * 0.12
            });
            shine.set(shineElement, { xPercent: -160, autoAlpha: 0 });
            shine.to(shineElement, {
                xPercent: 160,
                autoAlpha: 0.35,
                duration: 1.4,
                ease: 'power2.inOut'
            });
            shine.to(shineElement, {
                autoAlpha: 0,
                duration: 0.3,
                ease: 'power1.out'
            });

            localAnimations.push(shine);
            this.animations.push(shine);
        });
    }

    addDiagnosticButtonShine(gsap, localAnimations) {
        const targets = this.root.querySelectorAll(
            '.alex-diagnosis-infographic-section .diagnostic-shine-target'
        );
        targets.forEach((target, index) => {
            const shineElement = target.querySelector('.diagnostic-button-shine');
            if (!shineElement) return;

            const shine = gsap.timeline({
                delay: 1.05 + index * 0.45,
                repeat: -1,
                repeatDelay: 1.4
            });
            shine.set(shineElement, { xPercent: -160, autoAlpha: 0 });
            shine.to(shineElement, {
                xPercent: 160,
                autoAlpha: 0.75,
                duration: 1.4,
                ease: 'power2.inOut'
            });
            shine.to(shineElement, {
                autoAlpha: 0,
                duration: 0.3,
                ease: 'power1.out'
            });

            localAnimations.push(shine);
            this.animations.push(shine);
        });
    }

    addInlineModelRotation(section, gsap, localAnimations) {
        if (!section.classList.contains('alex-aorta-model-section')
            && !section.classList.contains('alex-flow-section')
            && !section.classList.contains('miriam-aorta-model-section')
            && !section.classList.contains('miriam-flow-section')) return;
        const modelContainer = section.querySelector('[data-inline-model]');
        if (!modelContainer || modelContainer.dataset.scrollRotationBound === 'true') return;

        const setupRotation = () => {
            const viewer = modelContainer.inlineModelViewer;
            if (!viewer?.model || modelContainer.dataset.scrollRotationBound === 'true') return;

            modelContainer.dataset.scrollRotationBound = 'true';
            // Rotate a centered parent around the world Y axis so the model's
            // fitted X/Z orientation and position remain unchanged. Resolve
            // the target on every update because flow buttons replace the
            // model and create a new rotation pivot.
            const getRotationTarget = () => viewer.rotationPivot || viewer.model;
            const baseRotation = getRotationTarget().rotation.y;
            const rotationState = { value: 0 };
            const rotationDirection = section.classList.contains('miriam-aorta-model-section')
                || section.classList.contains('miriam-flow-section') ? -1 : 1;
            const rotationTween = gsap.to(rotationState, {
                value: Math.PI * 2 * rotationDirection,
                ease: 'none',
                scrollTrigger: {
                    trigger: section,
                    start: 'top 80%',
                    end: 'bottom 20%',
                    scrub: true,
                    onUpdate: () => {
                        const rotationTarget = getRotationTarget();
                        if (rotationTarget) rotationTarget.rotation.y = baseRotation + rotationState.value;
                    }
                },
                onUpdate: () => {
                    const rotationTarget = getRotationTarget();
                    if (rotationTarget) rotationTarget.rotation.y = baseRotation + rotationState.value;
                }
            });

            localAnimations.push(rotationTween);
            this.animations.push(rotationTween);
        };

        if (modelContainer.inlineModelViewer?.model) {
            setupRotation();
        } else {
            modelContainer.addEventListener('inline-model-ready', setupRotation, { once: true });
        }
    }

    destroy() {
        this.media?.revert();
        this.media = null;
        this.animations.forEach((animation) => {
            animation.scrollTrigger?.kill();
            animation.kill();
        });
        this.animations = [];
    }
}
