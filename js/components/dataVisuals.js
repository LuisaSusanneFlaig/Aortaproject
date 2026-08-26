import { clampPercent } from './renderUtils.js';

const statCategoryMap = {
    A: 'Anatomy', R: 'Patient reference', '!': 'Note', '3D': 'Model', X: 'Context',
    DNA: 'Risk factor', BP: 'Blood pressure', S: 'Symptom', CT: 'Imaging', US: 'Ultrasound',
    M: 'Imaging', F: 'Hemodynamics', I: 'Mechanism', Rx: 'Therapy', OP: 'Surgery',
    EV: 'Therapy', '%': 'Outcome', N: 'Context', H: 'Heart', '*': 'Context', Lab: 'Lab'
};


export function renderChart(chart) {
    if (!chart) return '';
    const type = chart.chartType || chart.type;

    // D3 Charts
    const d3Types = ['barchart', 'piechart', 'map', 'scatterplot', 'areachart', 'linechart', 'heatmap', 'sankey', 'treemap', 'animated-treemap', 'relationship'];
    if (d3Types.includes(type)) {
        return `
            <div class="mini-chart mini-chart-d3" data-chart-type="${type}" data-chart-data='${JSON.stringify(chart.items || [])}' data-chart-options='${JSON.stringify(chart.options || {})}'>
                <div class="mini-chart-head">
                    <strong>${chart.label}</strong>
                </div>
                <div class="d3-container" style="width: 100%; height: 240px; background: rgba(255,255,255,0.02); border-radius: 4px; overflow: hidden;"></div>
                ${chart.caption ? `<p>${chart.caption}</p>` : ''}
            </div>
        `;
    }

    if (type === 'meter') {
        const colorStyle = chart.color ? `background: ${chart.color};` : '';
        const radiusStyle = chart.rounded ? 'border-radius: 999px;' : 'border-radius: 0;';
        return `
            <div class="mini-chart mini-chart-meter">
                <div class="mini-chart-head">
                    <strong>${chart.label}</strong>
                    <span>${chart.value}%</span>
                </div>
                <div class="meter-track" style="${radiusStyle}">
                    <span style="width: ${clampPercent(chart.value)}%; ${colorStyle}${radiusStyle}"></span>
                </div>
                ${chart.caption ? `<p>${chart.caption}</p>` : ''}
            </div>
        `;
    }

    if (type === 'split') {
        const radiusStyle = chart.rounded ? 'border-radius: 999px;' : 'border-radius: 0;';
        return `
            <div class="mini-chart mini-chart-split">
                <div class="mini-chart-head">
                    <strong>${chart.label}</strong>
                    <span>${(chart.items || []).map((item) => item.label).join(' / ')}</span>
                </div>
                <div class="split-track" style="${radiusStyle}">
                    ${(chart.items || []).map((item) => {
                        const itemColor = item.color ? `background: ${item.color};` : '';
                        return `<span style="flex-basis: ${clampPercent(item.value)}%; ${itemColor}${radiusStyle}"></span>`;
                    }).join('')}
                </div>
            </div>
        `;
    }

    const radiusStyle = chart.rounded ? 'border-radius: 999px;' : 'border-radius: 0;';
    return `
        <div class="mini-chart mini-chart-bars${type === 'flow' ? ' mini-chart-flow' : ''}">
            <div class="mini-chart-head">
                <strong>${chart.label}</strong>
                <span>Index</span>
            </div>
            <div class="bar-grid">
                ${(chart.items || []).map((item) => {
                    const itemColor = item.color ? `background: ${item.color};` : '';
                    return `
                        <div class="bar-item">
                            <span class="bar-label">${item.label}</span>
                            <span class="bar-track" style="${radiusStyle}">
                                <span style="width: ${clampPercent(item.value)}%; ${itemColor}${radiusStyle}"></span>
                            </span>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

export function renderAorticStatGraphic(element = {}) {
    const variant = element.variant || 'incidence';
    const title = element.title || '';
    const caption = element.caption || '';

    if (variant === 'clock') {
        const center = 175;
        const radius = 145;
        const slices = Array.from({ length: 48 }, (_, hour) => {
            const start = -90 + (hour / 48) * 360;
            const end = -90 + ((hour + 1) / 48) * 360 - 1.2;
            const phase = hour < 16 ? 'early' : hour < 32 ? 'middle' : 'late';
            const phaseIndex = hour % 16;
            const opacity = 0.72 + (phaseIndex / 15) * 0.28;
            return `<path d="${describeDonutSlice(center, center, 78, radius, start, end)}" class="aortic-clock-slice aortic-clock-${phase}" style="--slice-opacity:${opacity.toFixed(3)}"></path>`;
        }).join('');

        return `
            <div class="aortic-stat-card aortic-stat-clock">
                <div class="aortic-stat-head">
                    ${title ? `<strong>${title}</strong>` : ''}
                    <span>48 h</span>
                </div>
                <svg viewBox="0 0 350 350" role="img" aria-label="48-hour clock diagram showing mortality pressure in untreated Type A dissection">
                    ${slices}
                    <circle cx="${center}" cy="${center}" r="72" class="aortic-clock-center"></circle>
                    ${renderClockTicks(center, radius + 16)}
                    <text x="${center}" y="${center - 9}" text-anchor="middle" class="aortic-clock-value">48 h</text>
                    <text x="${center}" y="${center + 18}" text-anchor="middle" class="aortic-clock-caption">acute window</text>
                </svg>
                <div class="aortic-stat-legend">
                    <span><i class="aortic-swatch clock-early"></i>early hours</span>
                    <span><i class="aortic-swatch clock-middle"></i>middle hours</span>
                    <span><i class="aortic-swatch clock-late"></i>late hours</span>
                </div>
                ${caption ? `<p>${caption}</p>` : ''}
            </div>
        `;
    }

    if (variant === 'split') {
        return `
            <div class="aortic-stat-card aortic-stat-split">
                <svg viewBox="0 0 720 360" role="img" aria-label="Pie chart showing Type A aortic dissection at 60 to 65 percent and Type B at 35 to 40 percent">
                    <path d="M360 180 L360 35 A145 145 0 1 1 257.47 282.53 Z" class="aortic-pie-slice aortic-pie-slice-a"></path>
                    <path d="M360 180 L257.47 282.53 A145 145 0 0 1 360 35 Z" class="aortic-pie-slice aortic-pie-slice-b"></path>
                    <text x="620" y="190" text-anchor="middle" class="aortic-branch-percent aortic-pie-label-a">60-65%</text>
                    <text x="100" y="190" text-anchor="middle" class="aortic-branch-percent aortic-pie-label-b">35-40%</text>
                </svg>
                <div class="aortic-stat-legend">
                    <span><i class="aortic-swatch legend-type-a"></i>Type A</span>
                    <span><i class="aortic-swatch legend-type-b"></i>Type B</span>
                </div>
                ${caption ? `<p>${caption}</p>` : ''}
            </div>
        `;
    }

    const diagnosedCases = [
        [148, 62], [188, 62], [228, 62], [268, 62], [308, 62]
    ].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="8" class="aortic-case-marker aortic-case-marker-routine" aria-hidden="true"></circle>`).join('');
    const hiddenCases = [
        [148, 102], [188, 102], [228, 102], [268, 102], [308, 102], [188, 142], [268, 142]
    ].map(([x, y]) => `<rect x="${x - 8}" y="${y - 8}" width="16" height="16" class="aortic-case-marker aortic-case-marker-hidden" aria-hidden="true"></rect>`).join('');

    return `
            <div class="aortic-stat-card aortic-stat-incidence">
                <div class="aortic-stat-head">
                ${title ? `<strong>${title}</strong>` : ''}
            </div>
            <svg class="aortic-population-square" viewBox="0 0 456 300" role="img" aria-label="A large square representing 100.000 people, containing five diagnosed cases and seven possibly hidden cases">
                <rect x="108" y="12" width="240" height="240" class="aortic-population-frame"></rect>
                <g class="aortic-case-markers">${diagnosedCases}${hiddenCases}</g>
                <text x="228" y="282" text-anchor="middle" class="aortic-population-label">100.000 people</text>
            </svg>
            <div class="aortic-case-key" aria-label="Five diagnosed cases and seven possibly hidden cases">
                <span class="aortic-case-group"><i class="aortic-case-marker aortic-case-marker-routine"></i><b>5 diagnosed cases</b></span>
                <span class="aortic-case-group"><i class="aortic-case-marker aortic-case-marker-hidden"></i><b>+7 possibly hidden</b></span>
            </div>
            ${caption ? `<p>${caption}</p>` : ''}
        </div>
    `;
}

export function renderAneurysmBurden(element = {}) {
    return `
        <figure class="aneurysm-burden" aria-label="Aortic aneurysm burden from 1990 to 2030">
            <div class="aneurysm-burden-heading">
                ${element.title ? `<strong id="aneurysm-burden-title">${element.title}</strong>` : ''}
                <span>1990-2030</span>
            </div>
            <svg viewBox="0 0 920 470" role="img" aria-label="Absolute deaths rise from 88.353 in 1990 to 153.927 in 2021 and a projected 174.611 in 2030. The age-standardized mortality rate falls from 2.54 to 1.86 and a projected 1.70 per 100,000 people.">
                <g class="burden-panel burden-panel-deaths">
                    <text x="48" y="48" class="burden-panel-title">Absolute deaths</text>
                    <text x="48" y="78" class="burden-panel-change">+74%</text>
                    <line x1="48" y1="360" x2="420" y2="360" class="burden-axis"></line>
                    <line x1="48" y1="140" x2="48" y2="360" class="burden-axis"></line>
                    <text x="234" y="428" text-anchor="middle" class="burden-axis-label">Year</text>
                    <text x="30" y="250" text-anchor="middle" class="burden-axis-label burden-axis-label-y" transform="rotate(-90 30 250)">Deaths</text>
                    <line x1="48" y1="286" x2="420" y2="286" class="burden-grid"></line>
                    <line x1="48" y1="212" x2="420" y2="212" class="burden-grid"></line>
                    <path d="M74 305 L318 192" class="burden-line burden-line-solid"></path>
                    <path d="M318 192 L394 154" class="burden-line burden-line-projection"></path>
                    <circle cx="74" cy="305" r="7" class="burden-point"></circle>
                    <circle cx="318" cy="192" r="7" class="burden-point"></circle>
                    <circle cx="394" cy="154" r="7" class="burden-point burden-point-projection"></circle>
                    <text x="74" y="282" text-anchor="middle" class="burden-value">88.353</text>
                    <text x="318" y="169" text-anchor="middle" class="burden-value">153.927</text>
                    <text x="394" y="131" text-anchor="middle" class="burden-value">174.611</text>
                    <text x="74" y="394" text-anchor="middle" class="burden-year">1990</text>
                    <text x="318" y="394" text-anchor="middle" class="burden-year">2021</text>
                    <text x="394" y="394" text-anchor="middle" class="burden-year">2030</text>
                </g>
                <line x1="460" y1="42" x2="460" y2="405" class="burden-divider"></line>
                <g class="burden-panel burden-panel-rate">
                    <text x="500" y="48" class="burden-panel-title">Mortality rate per 100,000</text>
                    <text x="500" y="78" class="burden-panel-change">-27%</text>
                    <line x1="500" y1="360" x2="872" y2="360" class="burden-axis"></line>
                    <line x1="500" y1="140" x2="500" y2="360" class="burden-axis"></line>
                    <text x="686" y="428" text-anchor="middle" class="burden-axis-label">Year</text>
                    <text x="482" y="250" text-anchor="middle" class="burden-axis-label burden-axis-label-y" transform="rotate(-90 482 250)">Rate per 100,000</text>
                    <line x1="500" y1="286" x2="872" y2="286" class="burden-grid"></line>
                    <line x1="500" y1="212" x2="872" y2="212" class="burden-grid"></line>
                    <path d="M526 245 L770 286" class="burden-line burden-line-solid"></path>
                    <path d="M770 286 L846 299" class="burden-line burden-line-projection"></path>
                    <circle cx="526" cy="245" r="7" class="burden-point"></circle>
                    <circle cx="770" cy="286" r="7" class="burden-point"></circle>
                    <circle cx="846" cy="299" r="7" class="burden-point burden-point-projection"></circle>
                    <text x="526" y="222" text-anchor="middle" class="burden-value">2.54</text>
                    <text x="770" y="263" text-anchor="middle" class="burden-value">1.86</text>
                    <text x="846" y="276" text-anchor="middle" class="burden-value">1.70</text>
                    <text x="526" y="394" text-anchor="middle" class="burden-year">1990</text>
                    <text x="770" y="394" text-anchor="middle" class="burden-year">2021</text>
                    <text x="846" y="394" text-anchor="middle" class="burden-year">2030</text>
                </g>
            </svg>
            <div class="aneurysm-burden-legend" aria-label="Legend">
                <span><i class="burden-legend-solid"></i>Observed values</span>
                <span><i class="burden-legend-projection"></i>Projection</span>
            </div>
            ${element.caption ? `<figcaption id="aneurysm-burden-caption">${element.caption}</figcaption>` : ''}
        </figure>
    `;
}

export function renderGrowthVessel(variant) {
    const vesselPath = 'M20 42 C138 42 174 18 240 16 C306 18 342 42 460 42 L460 58 C342 58 306 82 240 84 C174 82 138 58 20 58 Z';
    const hotspots = {
        slow: '<path d="M82 50 H398" class="growth-slow-highlight"></path>',
        edge: '<circle cx="128" cy="50" r="12" class="growth-hotspot"></circle>',
        peak: '<circle cx="240" cy="50" r="12" class="growth-hotspot"></circle>'
    };
    const accessibleLabels = {
        slow: 'Schematic slow growth profile along the aorta',
        edge: 'Schematic edge growth profile along the aorta',
        peak: 'Schematic peak growth profile near the maximum diameter'
    };
    const measurementDots = Array.from({ length: 13 }, (_, index) => {
        const x = 38 + index * 34;
        return `<circle cx="${x}" cy="50" r="3" class="growth-measurement"></circle>`;
    }).join('');

    return `
        <svg viewBox="0 0 480 100" role="img" aria-label="${accessibleLabels[variant]}">
            <path d="${vesselPath}" class="growth-vessel-shape"></path>
            <line x1="240" y1="9" x2="240" y2="91" class="growth-maximum-line"></line>
            ${measurementDots}
            ${hotspots[variant]}
        </svg>
    `;
}

export function renderAneurysmGrowth(element = {}) {
    const profiles = [
        { variant: 'slow', label: 'Slow', detail: 'uniformly low', value: '0 %' },
        { variant: 'edge', label: 'Edge growth', detail: 'strongest growth away from the maximum', value: '23 %' },
        { variant: 'peak', label: 'Peak growth', detail: 'strongest growth near the maximum', value: '43 %' }
    ];

    return `
        <figure class="aneurysm-growth" aria-labelledby="aneurysm-growth-title aneurysm-growth-caption">
            <div class="aneurysm-growth-heading">
                <strong id="aneurysm-growth-title">${element.title || 'Growth profiles'}</strong>
                <span>Surgical threshold in the following year</span>
            </div>
            <div class="growth-profile-list">
                ${profiles.map((profile, index) => `
                    <div class="growth-profile-row" style="--profile-index:${index}">
                        <div class="growth-profile-label">
                            <strong>${profile.label}</strong>
                            <span>${profile.detail}</span>
                        </div>
                        <div class="growth-profile-vessel">
                            ${renderGrowthVessel(profile.variant)}
                        </div>
                        <div class="growth-profile-outcome">
                            <strong>${profile.value}</strong>
                            <span>in the following year</span>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="aneurysm-growth-legend" aria-label="Legend">
                <span><i class="growth-legend-maximum"></i>maximum diameter</span>
                <span><i class="growth-legend-hotspot"></i>strongest growth</span>
                <span><i class="growth-legend-points"></i>measurement points along the aorta</span>
            </div>
            ${element.caption ? `<figcaption id="aneurysm-growth-caption">${element.caption}</figcaption>` : ''}
        </figure>
    `;
}

export function renderAneurysmSexRisk(element = {}) {
    const groups = [
        { label: 'Women', value: 12.8, display: '12.8%' },
        { label: 'Men', value: 4.5, display: '4.5%' }
    ];

    return `
        <figure class="aneurysm-sex-risk" aria-labelledby="aneurysm-sex-title aneurysm-sex-caption">
            <div class="aneurysm-sex-heading">
                <strong id="aneurysm-sex-title">${element.title || 'Rupture risk by sex'}</strong>
                <span>3 years</span>
            </div>
            <div class="sex-risk-scale" aria-hidden="true">
                <span>0 %</span><span>5 %</span><span>10 %</span><span>15 %</span>
            </div>
            <div class="sex-risk-bars">
                ${groups.map((group, index) => `
                    <div class="sex-risk-row" style="--sex-index:${index}">
                        <strong>${group.label}</strong>
                        <div class="sex-risk-track" role="img" aria-label="${group.label}: ${group.display} rupture rate within three years">
                            <span style="--risk-width:${(group.value / 15) * 100}%"></span>
                        </div>
                        <b>${group.display}</b>
                    </div>
                `).join('')}
            </div>
            <p class="sex-risk-comparison"><strong>2.8 times</strong> as high in this observed size class</p>
            ${element.caption ? `<figcaption id="aneurysm-sex-caption">${element.caption}</figcaption>` : ''}
        </figure>
    `;
}

export function renderAneurysmRiskDrivers(element = {}) {
    return `
        <figure class="aneurysm-risk-drivers" aria-labelledby="aneurysm-drivers-title aneurysm-drivers-caption">
            <div class="aneurysm-drivers-heading">
                <strong id="aneurysm-drivers-title">${element.title || 'Attributed risk factors'}</strong>
                <span>1990-2019</span>
            </div>
            <svg viewBox="0 0 820 430" role="img" aria-label="The share of aortic aneurysm deaths attributed to smoking fell from 45.6 percent in 1990 to 34.6 percent in 2019. The share attributed to high systolic blood pressure fell from 38.7 to 34.7 percent.">
                <line x1="154" y1="88" x2="154" y2="342" class="drivers-year-axis"></line>
                <line x1="666" y1="88" x2="666" y2="342" class="drivers-year-axis"></line>
                <text x="410" y="414" text-anchor="middle" class="drivers-axis-label">Year</text>
                <text x="66" y="216" text-anchor="middle" class="drivers-axis-label drivers-axis-label-y" transform="rotate(-90 66 216)">Attributed deaths (%)</text>
                <text x="154" y="382" text-anchor="middle" class="drivers-year">1990</text>
                <text x="666" y="382" text-anchor="middle" class="drivers-year">2019</text>
                <path d="M154 116 L666 267" class="drivers-line drivers-smoking"></path>
                <path d="M154 211 L666 265" class="drivers-line drivers-pressure"></path>
                <circle cx="154" cy="116" r="8" class="drivers-point drivers-smoking-point"></circle>
                <circle cx="666" cy="267" r="8" class="drivers-point drivers-smoking-point"></circle>
                <rect x="146" y="203" width="16" height="16" class="drivers-point drivers-pressure-point"></rect>
                <rect x="658" y="257" width="16" height="16" class="drivers-point drivers-pressure-point"></rect>
                <text x="132" y="108" text-anchor="end" class="drivers-value">45.6%</text>
                <text x="688" y="291" class="drivers-value">34.6%</text>
                <text x="132" y="235" text-anchor="end" class="drivers-value">38.7%</text>
                <text x="688" y="254" class="drivers-value">34.7%</text>
                <text x="180" y="105" class="drivers-label">Smoking</text>
                <text x="180" y="270" class="drivers-label">High systolic blood pressure</text>
            </svg>
            <div class="drivers-mobile-list" aria-hidden="true">
                <div><strong>Smoking</strong><span>45.6%</span><i></i><span>34.6%</span></div>
                <div><strong>High blood pressure</strong><span>38.7%</span><i></i><span>34.7%</span></div>
                <small><span>1990</span><span>2019</span></small>
            </div>
            <div class="aneurysm-drivers-legend" aria-label="Legend">
                <span><i class="drivers-legend-smoking"></i>Smoking</span>
                <span><i class="drivers-legend-pressure"></i>High systolic blood pressure</span>
            </div>
            ${element.caption ? `<figcaption id="aneurysm-drivers-caption">${element.caption}</figcaption>` : ''}
        </figure>
    `;
}

export function renderClockTicks(center, radius) {
    return Array.from({ length: 12 }, (_, index) => {
        const angle = -90 + index * 30;
        const outer = polarToCartesian(center, center, radius, angle);
        const inner = polarToCartesian(center, center, radius - (index % 3 === 0 ? 22 : 13), angle);
        return `<line x1="${inner.x}" y1="${inner.y}" x2="${outer.x}" y2="${outer.y}" class="aortic-clock-tick"></line>`;
    }).join('');
}


export function describeDonutSlice(cx, cy, innerRadius, outerRadius, startAngle, endAngle) {
    const outerStart = polarToCartesian(cx, cy, outerRadius, endAngle);
    const outerEnd = polarToCartesian(cx, cy, outerRadius, startAngle);
    const innerStart = polarToCartesian(cx, cy, innerRadius, startAngle);
    const innerEnd = polarToCartesian(cx, cy, innerRadius, endAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    return [
        'M', outerStart.x, outerStart.y,
        'A', outerRadius, outerRadius, 0, largeArcFlag, 0, outerEnd.x, outerEnd.y,
        'L', innerStart.x, innerStart.y,
        'A', innerRadius, innerRadius, 0, largeArcFlag, 1, innerEnd.x, innerEnd.y,
        'Z'
    ].join(' ');
}

export function polarToCartesian(cx, cy, radius, angleInDegrees) {
    const angleInRadians = (angleInDegrees * Math.PI) / 180;
    return {
        x: Number((cx + radius * Math.cos(angleInRadians)).toFixed(3)),
        y: Number((cy + radius * Math.sin(angleInRadians)).toFixed(3))
    };
}
