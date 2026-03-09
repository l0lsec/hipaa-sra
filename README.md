# HIPAA Security Risk Assessment Tool

A client-side web application for conducting HIPAA Security Risk Assessments. Covers all 22 controls across Administrative, Physical, Technical, and Documentation safeguards required by the HIPAA Security Rule (45 CFR 164.308/310/312/316).

All data stays in your browser. Nothing is sent to any server.

## Quick Start

Open `index.html` in any modern browser. No build step, no dependencies, no server required.

```
open index.html
```

Or serve locally:

```
python3 -m http.server 8000 --directory ~/tools/hipaa-sra
```

## Features

- **22 HIPAA Controls** across 4 safeguard categories with originally-written descriptions and CFR references
- **Tab-based navigation** with persistent sidebar showing live progress
- **Yes / Partial / No scoring** per control with optional notes and evidence
- **Compliance guidance tooltips** with practical "how to comply" tips on every control
- **Control filtering** by status (all, unanswered, compliant, partial, non-compliant)
- **Gap Analysis view** showing only incomplete controls grouped by category
- **Risk Register** with 5x5 likelihood-vs-impact heat map
- **Auto-generated remediation tracker** from gaps with assignee and due date fields
- **Auto-save to localStorage** so work persists across browser sessions
- **Multi-assessment history** with trend chart comparing scores over time
- **Dark / Light mode toggle** (press `T`)
- **Keyboard shortcuts** (press `1`-`9` for tab navigation)
- **Export JSON** backup of all responses
- **Export CSV** for spreadsheet import
- **PDF Report** with executive summary, score breakdown, and gap analysis
- **Import JSON** to restore a previous assessment
- **Animated onboarding** on first visit
- **Confetti celebration** when you reach Low Risk (85%+)
- **Responsive** layout with mobile sidebar
- **Print-friendly** styles

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `1` | Organization tab |
| `2` | Administrative Safeguards |
| `3` | Physical Safeguards |
| `4` | Technical Safeguards |
| `5` | Documentation |
| `6` | Risk Register |
| `7` | Gap Analysis |
| `8` | Attestation |
| `9` | History |
| `T` | Toggle dark/light theme |

## Scoring

- **Per control:** Yes = 2, Partial = 1, No = 0
- **Overall score:** (sum of responses) / (total controls x 2) x 100
- **Risk levels:** >= 85% Low, 60-84% Moderate, < 60% Elevated
- **Risk register:** Likelihood (1-5) x Impact (1-5) = Risk Score (1-25)

## Tech Stack

- Vanilla HTML, CSS, JavaScript (no frameworks, no build tools)
- Google Fonts (DM Serif Display, IBM Plex Sans)
- CSS custom properties for theming
- localStorage for persistence

## File Structure

```
hipaa-sra/
  index.html          App shell and layout
  css/styles.css      All styles, themes, animations, print
  js/controls.js      22 HIPAA controls data with guidance
  js/app.js           State management, rendering, tabs, scoring
  js/risk.js          Risk register, heat map, gap analysis
  js/export.js        JSON/CSV export, import, PDF report
  README.md           This file
```

## Disclaimer

This tool is for informational and compliance-support purposes only. It does not constitute legal advice. Consult qualified counsel or a compliance professional to validate findings.
