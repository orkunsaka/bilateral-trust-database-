// ========================================
// APPLICATION STATE
// ========================================

let state = {
  trustVariable: 'trust_rspdi',
  selectedCountry: 'Austria',
  heatmapChart: null,
  worldTopojson: null,
  europeFeatures: null,
  allFeatures: null
};

// ========================================
// CONSTANTS
// ========================================

const ISO_A2_TO_NUMERIC = {
  AT:'040', BE:'056', BG:'100', CY:'196', CZ:'203',
  DE:'276', DK:'208', EE:'233', ES:'724', FI:'246',
  FR:'250', GB:'826', GR:'300', HU:'348', IE:'372',
  IS:'352', IT:'380', LI:'438', LT:'440', LU:'442',
  LV:'428', MT:'470', NL:'528', NO:'578', PL:'616',
  PT:'620', RO:'642', SE:'752', SI:'705', SK:'703'
};

const NUMERIC_TO_A2 = Object.fromEntries(
  Object.entries(ISO_A2_TO_NUMERIC).map(([a, n]) => [n, a])
);

// ========================================
// UTILITY FUNCTIONS
// ========================================

function formatTrustValue(value) {
  if (value === null || value === undefined) return 'N/A';
  if (state.trustVariable === 'trust_rspdi') {
    return (value * 100).toFixed(1) + '%';
  } else if (state.trustVariable === 'trust_rspdi2') {
    return value.toFixed(2) + '/4.0';
  } else {
    return value.toFixed(4);
  }
}

function getCountries() {
  const countries = new Set();
  TRUST_DATA.forEach(row => countries.add(row.o_country));
  return Array.from(countries).sort();
}

function getTrustBetween(originCountry, destCountry, variable) {
  const row = TRUST_DATA.find(
    r => r.o_country === originCountry && r.d_country === destCountry
  );
  return row ? row[variable] : null;
}

// ========================================
// COPY CITATION
// ========================================

function copyCitation() {
  const text = 'Eichengreen, B. & Saka, O. (2026). Cultural Stereotypes of Multinational Banks. Journal of the European Economic Association, Vol. 24, Issue 2, p. 567–609.';
  navigator.clipboard.writeText(text).then(() => {
    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = 'Copied!';
    setTimeout(() => {
      btn.textContent = originalText;
    }, 2000);
  });
}

// ========================================
// GEO DATA LOADING
// ========================================

async function loadGeoData() {
  if (state.worldTopojson) return;  // Already cached

  try {
    const topo = await d3.json(
      'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'
    );

    // Convert all countries to GeoJSON
    const allFeatures = topojson.feature(topo, topo.objects.countries).features;

    // Filter to dataset countries (30 countries)
    const datasetNumerics = new Set(Object.values(ISO_A2_TO_NUMERIC));
    const europeFeatures = allFeatures.filter(f => datasetNumerics.has(f.id));

    // Cache in state
    state.worldTopojson = topo;
    state.allFeatures = allFeatures;
    state.europeFeatures = europeFeatures;
  } catch (error) {
    console.error('Failed to load geo data:', error);
  }
}

// ========================================
// COLOR SCALE BUILDER
// ========================================

function buildColorScale(variable) {
  // All scales use dark purple (low) → bright gold (high) with better contrast
  const [min, max] = d3.extent(TRUST_DATA, d => d[variable]);
  return d3.scaleLinear()
    .domain([min, max])
    .range(['#4a2a6a', '#ffd700'])
    .clamp(true);
}

// ========================================
// CHOROPLETH MAP RENDERER
// ========================================

function renderChoroplethMap(containerId, trustLookup, selectedCode, colorScale) {
  // Clear container
  d3.select(`#${containerId}`).html('');

  const svgWidth = 500;
  const svgHeight = 500;
  const margin = 15;

  // Create SVG
  const svg = d3.select(`#${containerId}`)
    .append('svg')
    .attr('viewBox', `0 0 ${svgWidth} ${svgHeight}`)
    .attr('preserveAspectRatio', 'xMidYMid meet');

  // Create projection for Europe (zoomed out for better overview, including Cyprus and Iceland)
  const projection = d3.geoMercator()
    .center([8, 52])
    .scale(420)
    .translate([svgWidth / 2, svgHeight / 2]);

  const pathGenerator = d3.geoPath().projection(projection);

  // Create/reuse tooltip
  let tooltip = d3.select('.tooltip');
  if (tooltip.empty()) {
    tooltip = d3.select('body')
      .append('div')
      .attr('class', 'tooltip');
  }

  // Draw background (all world countries in light gray)
  svg.append('g')
    .attr('class', 'world-background')
    .selectAll('path')
    .data(state.allFeatures)
    .enter()
    .append('path')
    .attr('d', pathGenerator)
    .attr('fill', '#c0c5cc')
    .attr('stroke', 'none')
    .attr('opacity', 0.7);

  // Draw dataset countries
  svg.append('g')
    .attr('class', 'countries')
    .selectAll('path')
    .data(state.europeFeatures)
    .enter()
    .append('path')
    .attr('class', d => {
      const code = NUMERIC_TO_A2[d.id];
      const classes = ['map-country'];
      if (!trustLookup.has(code)) {
        classes.push('map-country-nodata');
      }
      return classes.join(' ');
    })
    .attr('d', pathGenerator)
    .attr('fill', d => {
      const code = NUMERIC_TO_A2[d.id];
      const value = trustLookup.get(code);
      return value !== undefined ? colorScale(value) : '#3a3f4b';
    })
    .on('mouseover', function(event, d) {
      const code = NUMERIC_TO_A2[d.id];
      const value = trustLookup.get(code);
      const countryName = d.properties?.name || code;

      tooltip.transition().duration(200).style('opacity', .95);
      tooltip.html(
        `<strong>${countryName}</strong><br/>` +
        (value !== undefined ? formatTrustValue(value) : 'No data')
      )
      .style('left', (event.pageX + 10) + 'px')
      .style('top', (event.pageY - 28) + 'px');
    })
    .on('mouseout', function() {
      tooltip.transition().duration(200).style('opacity', 0);
    });

  // Add color gradient legend
  const legendWidth = 150;
  const legendHeight = 10;
  const legendX = 30;
  const legendY = svgHeight - 40;

  const defs = svg.append('defs');

  const gradientId = `gradient-${containerId}`;
  const gradient = defs.append('linearGradient')
    .attr('id', gradientId)
    .attr('x1', '0%')
    .attr('x2', '100%')
    .attr('y1', '0%')
    .attr('y2', '0%');

  // Add color stops
  const range = colorScale.range();
  gradient.append('stop')
    .attr('offset', '0%')
    .attr('stop-color', range[0]);

  if (range.length === 3) {
    gradient.append('stop')
      .attr('offset', '50%')
      .attr('stop-color', range[1]);
  }

  gradient.append('stop')
    .attr('offset', '100%')
    .attr('stop-color', range[range.length - 1]);

  // Draw legend rect
  svg.append('rect')
    .attr('x', legendX)
    .attr('y', legendY)
    .attr('width', legendWidth)
    .attr('height', legendHeight)
    .attr('fill', `url(#${gradientId})`)
    .attr('stroke', '#8b949e')
    .attr('stroke-width', 0.5);

  // Legend labels
  svg.append('text')
    .attr('x', legendX)
    .attr('y', legendY - 8)
    .attr('fill', '#8b949e')
    .attr('font-size', '10px')
    .text('Low');

  svg.append('text')
    .attr('x', legendX + legendWidth)
    .attr('y', legendY - 8)
    .attr('fill', '#8b949e')
    .attr('font-size', '10px')
    .attr('text-anchor', 'end')
    .text('High');
}

// ========================================
// D3 HEATMAP
// ========================================

function createHeatmap() {
  const variable = state.trustVariable;
  const countries = getCountries();

  // Get data matrix
  const dataMatrix = countries.map(origin =>
    countries.map(dest => ({
      origin,
      dest,
      value: getTrustBetween(origin, dest, variable)
    }))
  );

  // Dimensions
  const margin = { top: 100, right: 20, bottom: 150, left: 120 };
  const cellSize = 18;
  const width = countries.length * cellSize + margin.left + margin.right;
  const height = countries.length * cellSize + margin.top + margin.bottom;

  // Clear previous chart
  d3.select('#heatmap-container').html('');

  // Create SVG
  const svg = d3.select('#heatmap-container')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // Color scale — dark purple (low) → bright gold (high) for better contrast
  const minValue = Math.min(...TRUST_DATA.map(d => d[variable]));
  const maxValue = Math.max(...TRUST_DATA.map(d => d[variable]));
  const colorScale = d3.scaleLinear()
    .domain([minValue, maxValue])
    .range(['#4a2a6a', '#ffd700']);

  // Tooltip
  const tooltip = d3.select('body')
    .append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);

  // Draw cells
  g.selectAll('.row')
    .data(dataMatrix)
    .enter()
    .append('g')
    .attr('class', 'row')
    .attr('transform', (d, i) => `translate(0,${i * cellSize})`)
    .selectAll('.cell')
    .data(d => d)
    .enter()
    .append('rect')
    .attr('class', 'cell')
    .attr('x', (d, i) => i * cellSize)
    .attr('y', 0)
    .attr('width', cellSize)
    .attr('height', cellSize)
    .attr('fill', d => colorScale(d.value))
    .on('mouseover', function(event, d) {
      d3.select(this)
        .attr('stroke-width', 2)
        .attr('stroke', '#58a6ff');

      tooltip.transition().duration(200).style('opacity', .95);
      tooltip.html(
        `<strong>${d.origin} → ${d.dest}</strong><br/>` +
        `${formatTrustValue(d.value)}`
      )
      .style('left', (event.pageX + 10) + 'px')
      .style('top', (event.pageY - 28) + 'px');
    })
    .on('mouseout', function() {
      d3.select(this)
        .attr('stroke-width', 1)
        .attr('stroke', '#1f2937');
      tooltip.transition().duration(200).style('opacity', 0);
    });

  // Y axis (origin countries)
  g.append('g')
    .selectAll('text')
    .data(countries)
    .enter()
    .append('text')
    .attr('class', 'axis-label')
    .attr('x', -8)
    .attr('y', (d, i) => i * cellSize + cellSize / 2)
    .attr('dy', '0.32em')
    .attr('text-anchor', 'end')
    .text(d => d)
    .attr('font-size', 11);

  // X axis (destination countries) - positioned below the grid
  const bottomY = countries.length * cellSize + 40;
  g.append('g')
    .selectAll('text')
    .data(countries)
    .enter()
    .append('text')
    .attr('class', 'axis-label')
    .attr('x', (d, i) => i * cellSize + cellSize / 2)
    .attr('y', bottomY)
    .attr('text-anchor', 'middle')
    .attr('transform', (d, i) => {
      const x = i * cellSize + cellSize / 2;
      return `rotate(-90 ${x} ${bottomY})`;
    })
    .text(d => d)
    .attr('font-size', 11);

  // Legend
  const legendY = -margin.top + 10;
  svg.append('text')
    .attr('x', margin.left)
    .attr('y', legendY)
    .attr('fill', '#a0aec0')
    .attr('font-size', 12)
    .text('Low trust ← | → High trust');
}

// ========================================
// COUNTRY EXPLORER
// ========================================

async function createCountryExplorer() {
  await loadGeoData();

  const country = state.selectedCountry;
  const variable = state.trustVariable;
  const colorScale = buildColorScale(variable);

  // Find selected country's code
  const selectedRow = TRUST_DATA.find(r => r.o_country === country);
  const selectedCode = selectedRow ? selectedRow.o_code : null;

  // Build trust lookups (Map of alpha-2 → value)
  const outgoingLookup = new Map(
    TRUST_DATA
      .filter(r => r.o_country === country)
      .map(r => [r.d_code, r[variable]])
  );

  const incomingLookup = new Map(
    TRUST_DATA
      .filter(r => r.d_country === country)
      .map(r => [r.o_code, r[variable]])
  );

  // Update titles
  document.getElementById('outgoing-title').textContent = `How ${country} trusts others`;
  document.getElementById('incoming-title').textContent = `How others trust ${country}`;

  // Render maps
  renderChoroplethMap('outgoing-map', outgoingLookup, selectedCode, colorScale);
  renderChoroplethMap('incoming-map', incomingLookup, selectedCode, colorScale);
}

// ========================================
// POPULATE COUNTRY DROPDOWN
// ========================================

function populateCountrySelect() {
  const select = document.getElementById('country-select');
  const countries = getCountries();

  countries.forEach(country => {
    const option = document.createElement('option');
    option.value = country;
    option.textContent = country;
    if (country === state.selectedCountry) {
      option.selected = true;
    }
    select.appendChild(option);
  });
}

// ========================================
// UPDATE VISUALIZATIONS
// ========================================

function updateVisualizations() {
  state.trustVariable = document.getElementById('trust-var-select').value;
  state.selectedCountry = document.getElementById('country-select').value;

  // Sync both selectors
  document.getElementById('trust-var-select-explorer').value = state.trustVariable;

  createHeatmap();
  createCountryExplorer();
}

function updateVisualizationsFromExplorer() {
  state.trustVariable = document.getElementById('trust-var-select-explorer').value;
  state.selectedCountry = document.getElementById('country-select').value;

  // Sync both selectors
  document.getElementById('trust-var-select').value = state.trustVariable;

  createHeatmap();
  createCountryExplorer();
}

function updateCountryExplorer() {
  state.selectedCountry = document.getElementById('country-select').value;
  createCountryExplorer();
}

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', function() {
  // Populate dropdowns
  populateCountrySelect();

  // Sync trust variable selectors
  document.getElementById('trust-var-select-explorer').value = state.trustVariable;

  // Pre-load geo data
  loadGeoData();

  // Create initial visualizations
  createHeatmap();
  createCountryExplorer();

  // Smooth scrolling for CTA buttons
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});
