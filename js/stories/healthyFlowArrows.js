// Centre lines of the hand-drawn arrows on healthy_aorta_illustration.png, in
// the coordinates of the Figma frame (Group 36). Written by hand from the
// export: Figma merged the branching arrows into one outline, which
// tools/extract-flow-arrows.js cannot split.
//
// 0: one arrow from the heart around the arch and down the descending aorta.
// 1–3: the three arch branches, from the arch up to their heads.
export const healthyFlowArrows = {
    viewBox: '0 0 693 871',
    arrows: [
        { color: '#ffffff', d: 'M206.5 351.2 C206.9 343.8 207.5 333 208.5 325.8 C210 311.7 212.4 294.9 216 284 C225.4 255.6 234.2 245 245 231 C255.8 217 263.5 215.2 280 205 C285.8 201.4 289.8 199 294.9 197.4 C300 195.9 306.4 195.2 317 195 C327.6 194.8 344.2 196.2 360.3 199.6 C376.4 203.1 392.1 208.7 401 217 C420 234.8 436.2 260.2 443 321 C446.1 348.2 439.9 382 432.4 415.4 C424.8 448.7 415.8 481.6 413 507 C405.9 572 402.9 623.7 401.7 659.2 C401.1 677 400.9 690.7 400.9 699.9 C400.9 704.6 401 710 401 714', maxTravel: 4000 },
        { color: '#ffffff', d: 'M245 231 C245.3 220 245.5 202 245 187 C244.3 173.8 244.3 153.6 244.5 136.6 C244.6 128.1 244.7 120.5 244.8 115 C244.9 110 245 106 245 106' },
        { color: '#ffffff', d: 'M280 205 C279.7 198 279.7 188.1 280 177 C280.3 166 284.3 142.4 288.2 121.4 C290.2 110.9 292.1 101 293.6 93.7 C294.3 90 295.6 84 296 82' },
        { color: '#ffffff', d: 'M317 195 C316.5 188 316.3 172 317 162 C317.7 153.6 321.7 136.6 325.5 121.7 C327.4 114.3 329.3 107.3 330.7 102.3 C331.6 99 332.6 95.5 333 94' }
    ]
};
