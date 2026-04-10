# European Bilateral Trust Dataset — Interactive Website

A modern, interactive website for exploring the Eichengreen & Saka (2026) bilateral trust dataset across 30 European countries.

## 📊 Features

- **Trust Heatmap**: Interactive 30×30 matrix visualization with hover tooltips
- **Country Explorer**: Select any country to see bilateral trust patterns
- **Multiple Measures**: Switch between raw trust percentages, average scores, and bias-adjusted metrics
- **Paper Integration**: Direct access to research context and citation information
- **Dataset Download**: One-click download of the complete Excel dataset

## 🚀 Quick Start

### View the Website

Simply open `index.html` in any modern web browser:

```bash
open index.html
```

Or drag `index.html` into your browser window.

The site is completely static (no server required) and works offline once loaded.

### Deploy to the Web

You can host this website on any static hosting service:

- **GitHub Pages** (free): Push to a repo's `docs/` folder or `gh-pages` branch
- **Netlify** (free): Drag-and-drop the entire `website/` folder
- **Vercel** (free): Import the repo
- **Any web host**: Upload all files via FTP/SFTP

## 📁 File Structure

```
website/
├── index.html              Single-page app (all HTML structure)
├── style.css               Dark/bold modern theme (>600 lines)
├── app.js                  All interactivity (D3 heatmap + Chart.js charts)
├── data/
│   ├── trust.js            Dataset (900 country pairs as JavaScript const)
│   └── Eichengreen&Saka_BilateralTrust_Database.xlsx
│                           Original Excel file for download link
└── README.md               This file
```

## 🎨 Design

- **Theme**: Modern/bold with dark background (#0d1117) and vibrant gold/blue accents
- **Color scheme**: Purple (low trust) → gold (high trust)
- **Typography**: Inter font (Google Fonts), responsive across all devices
- **Visualizations**: D3.js (heatmap) + Chart.js (bar charts)

## 🔧 Technical Details

### No Build Step Required

This site uses **no build tools or npm dependencies**. All libraries are loaded via CDN:

- **D3.js v7**: `https://d3js.org/d3.v7.min.js` (heatmap)
- **Chart.js v4**: `https://cdn.jsdelivr.net/npm/chart.js` (bar charts)
- **Google Fonts**: Inter font family

### Data Format

The dataset is embedded as a JavaScript constant (`TRUST_DATA`) in `data/trust.js`:

```javascript
const TRUST_DATA = [
  {
    o_country: "Austria",
    d_country: "Belgium",
    o_code: "AT",
    d_code: "BE",
    trust_rspdi: 0.315,        // % expressing "lot of trust" (0–1)
    trust_rspdi2: 3.197,       // average trust score (1–4)
    trustbias_rspdi: -0.011,   // residualized % (after FE regression)
    trustbias_rspdi2: 0.015    // residualized average score
  },
  ...
];
```

### Key Functions (app.js)

| Function | Purpose |
|----------|---------|
| `createHeatmap()` | Renders 30×30 D3 grid with color scale and tooltips |
| `createCountryExplorer()` | Renders two bar charts for selected country |
| `updateVisualizations()` | Syncs all charts when user changes trust variable |
| `copyCitation()` | Copies citation text to clipboard |

## 📖 How to Use

### Heatmap Section
1. Select a trust measure from the dropdown (e.g., "% Expressing Lot of Trust")
2. Hover over any cell to see the exact bilateral trust score
3. Rows = origin country (where respondents are), columns = destination (whom they trust)

### Country Explorer
1. Select a country from the dropdown
2. Left chart shows how residents of that country trust others (ranked)
3. Right chart shows how residents of other countries trust this country (ranked)
4. Switch trust measures to see different perspectives

## 📊 Citation

When using this dataset, please cite:

> Eichengreen, B. & Saka, O. (2025). Cultural Stereotypes of Multinational Banks. *Journal of the European Economic Association*, forthcoming.

The citation copy button on the website provides both plain text and ready-to-paste formats.

## 📧 Contact

For questions or feedback:

- **Email**: o.saka@citystgeorges.ac.uk
- **Website**: [orkunsaka.com](http://www.orkunsaka.com)
- **Data Source**: [https://www.orkunsaka.com](https://www.orkunsaka.com)

## 📄 License & Attribution

This data was collected with support from:
- The Clausen Center at UC Berkeley
- BA/Leverhulme Small Research Grant (SRG21\211248)

All rights reserved by the authors. Please cite appropriately when using the data.

## 🔄 Updates

The latest version of this database and website is available at [orkunsaka.com](http://www.orkunsaka.com).

For bug reports or feature requests, contact the authors directly.
