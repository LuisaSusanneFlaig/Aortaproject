// Centre lines of the hand-drawn arrows on alex_aneurysm_illustration.png, in
// the coordinates of the Figma frame (Group 37). Written by hand from the
// export: Figma merged the branching arrows into one outline, which
// tools/extract-flow-arrows.js cannot split.
//
// 0: one arrow from the heart along the arch into the widened section, once
//    around the swirl there and down the descending aorta.
// 1–3: the three arch branches, from the arch up to their heads.
// `tint` colours the arrows red inside the widened section (the red
// rectangle of the Figma frame, see js/components/flowArrowLayer.js).
export const alexFlowArrows = {
    viewBox: '0 0 849 1211.4',
    tint: { color: '#b62413', rects: [[454, 338, 234, 259]] },
    arrows: [
        { color: '#ffffff', maxTravel: 7000, d: 'M310 626 C309.5 609 309 600 308.8 590.3 C308.3 571 308.3 549 310 538 C317 503.9 323 489.4 335 463 C343 457 352.4 446.3 360.6 436.7 C368 428 376 418.6 380 415.1 C390 408.6 401 399 423 391 C444.8 383.1 466.2 384.1 488 383 C498.4 382.7 513 384.8 526 387.3 C538.8 389.9 550.3 393.2 555 395 C565 399 577 410 586.8 421.1 C591.7 426.8 596 432.5 599.2 437.5 C602.4 442.4 604.9 446.6 606.5 449.2 C609.5 459.4 612.5 478 612.5 503.6 C613.8 517.2 608.4 531 600.6 542.1 C592.7 553.2 582.3 561.6 573.4 564 C569.6 564.3 566.1 564.3 563 564 C557.2 563.5 552.5 561.9 548.4 559.2 C544.3 556.5 540.9 552.7 537.8 547.8 C531.6 538 526.7 523.4 520.6 503.6 C514.5 483.7 512.6 462 514.85 445.4 C516 437 518.2 429.8 521.4 424.5 C524.6 419.2 529 415.8 534.2 415.1 C539 414.4 543.4 417.8 547.4 424.5 C551 431.2 554 441.3 556.3 454.4 C560.9 480.5 563 518.3 563 564 C563.1 621.5 560 691.5 555 766 C549.4 848.8 538.4 938.8 528.8 1008.1 C524 1042.7 519.5 1072.2 516.3 1093 C514.7 1103.4 513.3 1111.7 512.4 1117.3 C511.7 1121.7 511.2 1124.5 511 1126' },
        { color: '#ffffff', d: 'M335 463 C335.5 460.4 336.7 455 337.5 450.4 C338.9 442.7 340.8 432.1 342.6 420.6 C344.4 409.2 346 396.9 346.9 385.8 C347.8 374.7 348 364.8 347 358 C344.9 344.4 341.9 322.7 339.4 304.4 C338.2 295.2 337.1 286.8 336.3 280.8 C335.8 276.6 335.2 272.5 335 271' },
        { color: '#ffffff', d: 'M380 415.1 C380 392 380 369 380 346 C380 316.7 380 287.3 380 258' },
        { color: '#ffffff', d: 'M423 391 C422.9 386 422.6 377 422 367.7 C421.4 354.8 420.4 339.3 419 329 C417.6 318.7 416.4 300.9 415.5 285.8 C415 278.2 414.7 271.2 414.4 266.2 C414.2 262 414 258 414 258' }
    ]
};
