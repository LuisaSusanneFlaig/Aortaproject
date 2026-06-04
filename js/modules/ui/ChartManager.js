/**
 * ChartManager handles Chart.js and D3.js visualizations.
 */
export class ChartManager {
    constructor() {
        this.charts = {};
    }

    init() {
        // Watch for dimension changes (responsive)
        this.resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                const container = entry.target.closest('.mini-chart-d3');
                if (container) this.renderSingleD3Chart(container);
            }
        });

        // Chart.js is handled via createCharts if canvas exists
        this.createCharts();
        
        // D3.js logic
        this.renderD3Charts();
        
        // Watch for DOM changes (new elements)
        const observer = new MutationObserver(() => this.renderD3Charts());
        const story = document.getElementById('story');
        if (story) observer.observe(story, { childList: true, subtree: true });
    }

    createCharts() {
        this.createLocationChart();
        this.createGenderChart();
    }

    createLocationChart() {
        const canvas = document.getElementById('location-chart');
        if (!canvas || typeof Chart === 'undefined') return;
        this.charts.location = new Chart(canvas.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: ['Bauch (80%)', 'Brust (20%)'],
                datasets: [{ data: [80, 20], backgroundColor: ['#ff4444', '#555'], borderColor: 'rgba(0,0,0,0)' }]
            },
            options: { responsive: true, plugins: { title: { display: true, text: 'Lokalisation (AAA vs TAA)', color: '#fff' }, legend: { labels: { color: '#fff' } } } }
        });
    }

    createGenderChart() {
        const canvas = document.getElementById('gender-chart');
        if (!canvas || typeof Chart === 'undefined') return;
        this.charts.gender = new Chart(canvas.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: ['Männer (80%)', 'Frauen (20%)'],
                datasets: [{ data: [80, 20], backgroundColor: ['#00d4ff', '#ff4444'], borderColor: 'rgba(0,0,0,0)' }]
            },
            options: { responsive: true, plugins: { title: { display: true, text: 'Geschlechterverteilung', color: '#fff' }, legend: { labels: { color: '#fff' } } } }
        });
    }

    renderD3Charts() {
        if (typeof d3 === 'undefined') return;
        document.querySelectorAll('.mini-chart-d3').forEach(container => {
            const target = container.querySelector('.d3-container');
            if (target) this.resizeObserver.observe(target);
        });
    }

    renderSingleD3Chart(container) {
        const type = container.dataset.chartType;
        const data = JSON.parse(container.dataset.chartData || '[]');
        const options = JSON.parse(container.dataset.chartOptions || '{}');
        const target = container.querySelector('.d3-container');
        
        if (!target || target.clientWidth === 0) return;
        target.innerHTML = ''; // Clear previous
        
        try {
            switch (type) {
                case 'barchart': this.renderD3BarChart(target, data, options); break;
                case 'piechart': this.renderD3PieChart(target, data, options); break;
                case 'treemap': this.renderD3Treemap(target, data, options); break;
                case 'animated-treemap': this.renderD3AnimatedTreemap(target, data, options); break;
            }
        } catch (e) {
            console.error("[D3] Error rendering chart:", e);
        }
    }

    renderD3BarChart(target, data, options) {
        const width = target.clientWidth;
        const height = target.clientHeight;
        const margin = { top: 20, right: 20, bottom: 30, left: 40 };

        const svg = d3.select(target).append('svg')
            .attr('width', width)
            .attr('height', height);

        const x = d3.scaleBand()
            .domain(data.map(d => d.label))
            .range([margin.left, width - margin.right])
            .padding(0.2);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.value)]).nice()
            .range([height - margin.bottom, margin.top]);

        svg.append('g')
            .attr('fill', options.color || '#ff4444')
            .selectAll('rect')
            .data(data)
            .join('rect')
            .attr('x', d => x(d.label))
            .attr('y', d => y(d.value))
            .attr('height', d => y(0) - y(d.value))
            .attr('width', x.bandwidth())
            .attr('rx', 4);

        svg.append('g')
            .attr('transform', `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x).tickSizeOuter(0))
            .attr('color', 'rgba(255,255,255,0.5)');

        svg.append('g')
            .attr('transform', `translate(${margin.left},0)`)
            .call(d3.axisLeft(y).ticks(5))
            .attr('color', 'rgba(255,255,255,0.5)');
    }

    renderD3PieChart(target, data, options) {
        const width = target.clientWidth;
        const height = target.clientHeight;
        const radius = Math.min(width, height) / 2 - 10;

        const svg = d3.select(target).append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${width / 2},${height / 2})`);

        const color = d3.scaleOrdinal()
            .domain(data.map(d => d.label))
            .range(d3.schemeTableau10);

        const pie = d3.pie().value(d => d.value);
        const arc = d3.arc().innerRadius(radius * 0.4).outerRadius(radius);

        svg.selectAll('path')
            .data(pie(data))
            .join('path')
            .attr('d', arc)
            .attr('fill', d => color(d.data.label))
            .attr('stroke', 'rgba(0,0,0,0.2)')
            .style('stroke-width', '2px');
    }

    renderD3Treemap(target, data, options) {
        const width = target.clientWidth;
        const height = target.clientHeight;

        const root = d3.hierarchy({ children: data })
            .sum(d => d.value)
            .sort((a, b) => b.value - a.value);

        d3.treemap().size([width, height]).padding(2)(root);

        const svg = d3.select(target).append('svg')
            .attr('width', width)
            .attr('height', height);

        const leaf = svg.selectAll('g')
            .data(root.leaves())
            .join('g')
            .attr('transform', d => `translate(${d.x0},${d.y0})`);

        leaf.append('rect')
            .attr('width', d => d.x1 - d.x0)
            .attr('height', d => d.y1 - d.y0)
            .attr('fill', (d, i) => d3.interpolateReds(0.3 + (i / data.length) * 0.5))
            .attr('stroke', 'rgba(255,255,255,0.1)');

        leaf.append('text')
            .attr('x', 5)
            .attr('y', 15)
            .text(d => d.data.label)
            .attr('font-size', '10px')
            .attr('fill', 'white');
    }

    renderD3AnimatedTreemap(target, data, options) {
        // Simplifizierte Version der Animation
        const width = target.clientWidth;
        const height = target.clientHeight;
        
        const generateData = () => ({
            children: Array.from({ length: 6 }, (_, i) => ({
                label: `Cat ${i + 1}`,
                value: Math.random() * 100 + 20
            }))
        });

        const svg = d3.select(target).append('svg')
            .attr('width', width)
            .attr('height', height);

        const update = () => {
            const root = d3.hierarchy(generateData())
                .sum(d => d.value)
                .sort((a, b) => b.value - a.value);

            d3.treemap().size([width, height]).padding(2)(root);

            const nodes = svg.selectAll('g')
                .data(root.leaves(), d => d.data.label);

            const enter = nodes.enter().append('g')
                .attr('transform', d => `translate(${d.x0},${d.y0})`);

            enter.append('rect')
                .attr('width', d => d.x1 - d.x0)
                .attr('height', d => d.y1 - d.y0)
                .attr('fill', (d, i) => d3.interpolateBlues(0.3 + (i / 6) * 0.5))
                .attr('opacity', 0)
                .transition().duration(1000).attr('opacity', 1);

            nodes.transition().duration(1000)
                .attr('transform', d => `translate(${d.x0},${d.y0})`)
                .select('rect')
                .attr('width', d => d.x1 - d.x0)
                .attr('height', d => d.y1 - d.y0);
        };

        update();
        setInterval(update, 3000);
    }
}
