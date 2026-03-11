# HIPAA Security Risk Assessment Tool

A comprehensive, client-side HIPAA Security Risk Assessment platform covering 33 controls across 5 safeguard categories, a 39-policy library, workforce training modules, risk register, gap analysis, and a multi-dimensional compliance dashboard.

All data stays in your browser. Nothing is sent to any server.

**Live demo:** [l0lsec.github.io/hipaa-sra](https://l0lsec.github.io/hipaa-sra/)

## Quick Start

Open `index.html` in any modern browser. No build step, no dependencies, no server required.

```
open index.html
```

Or serve locally:

```
python3 -m http.server 8000
```

## Features

### Security Risk Assessment

- **33 HIPAA controls** across 5 safeguard categories with CFR references and expert guidance
- **Yes / Partial / No scoring** per control with optional notes and evidence fields
- **Remediation steps** on every control with collapsible detail sections
- **Control filtering** by status (all, unanswered, compliant, partial, non-compliant)
- **Organization type awareness** — filters controls and policies for Covered Entities, Business Associates, or Hybrid Entities

### Policy Library

- **39 HIPAA policy templates** organized by category (Administrative, Physical, Technical, Privacy, Breach, Organizational)
- **Acknowledgment tracking** per policy with timestamps
- **Category accordion** layout with search/filter
- **Progress bar** showing overall policy adoption rate
- **Gated access** — unlocks after starting the SRA

### Workforce Training

- **5 training modules** covering Security Rule Overview, Administrative Safeguards, Physical Safeguards, Technical Safeguards, and Breach Notification
- **Expandable content** with key learning points per topic
- **Completion tracking** with date and assessor attribution

### Risk Management

- **Risk Register** with 5x5 likelihood-vs-impact heat map
- **Gap Analysis** showing non-compliant controls grouped by category with inline remediation text
- **Auto-generated remediation tracker** from gaps with assignee and due date fields
- **Residual risk acceptance** documentation

### Compliance Dashboard

- **5-dimension progress model** — SRA Completion, Compliance Score, Policy Adoption, Training Status, Remediation Progress
- **Composite Compliance Readiness score** (weighted average across all dimensions)
- **SVG ring visualizations** for each dimension

### Attestation

- **Executive sign-off** with name, title, and date
- **Policy attestation summary** with per-category progress bars
- **Assessment history** with trend chart comparing scores over time

### Export & Import

- **PDF Report** with executive summary, control-by-control results, gap analysis, remediation plan, policy attestation, and training status
- **JSON export/import** for backup and restore (backward compatible)
- **CSV export** with controls, policies, and training data

### General

- **Dark / Light mode** toggle (press `T`)
- **Global search** across controls, policies, and training (press `/`)
- **Animated onboarding** on first visit
- **Confetti celebration** when you hit Low Risk (85%+)
- **Responsive** layout with mobile sidebar
- **Print-friendly** styles
- **Auto-save** to localStorage

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `/` | Focus search |
| `T` | Toggle dark/light theme |

## Scoring

- **Per control:** Yes = 2, Partial = 1, No = 0
- **Overall score:** (sum of responses) / (total controls x 2) x 100
- **Risk levels:** >= 85% Low, 60-84% Moderate, < 60% Elevated
- **Risk register:** Likelihood (1-5) x Impact (1-5) = Risk Score (1-25)
- **Compliance Readiness:** Weighted composite — SRA (20%), Compliance Score (30%), Policy Adoption (20%), Training (15%), Remediation (15%)

## Safeguard Categories

| Category | Controls | CFR Reference |
|----------|----------|---------------|
| Administrative Safeguards | 11 | 45 CFR 164.308 |
| Physical Safeguards | 6 | 45 CFR 164.310 |
| Technical Safeguards | 8 | 45 CFR 164.312 |
| Organizational Requirements | 3 | 45 CFR 164.314 |
| Policies & Documentation | 5 | 45 CFR 164.316 |

## Tech Stack

- Vanilla HTML, CSS, JavaScript (no frameworks, no build tools)
- Google Fonts (DM Serif Display, IBM Plex Sans)
- CSS custom properties for theming
- localStorage for persistence

## File Structure

```
hipaa-sra/
  index.html          App shell, layout, all tab panels
  css/styles.css      Styles, themes, animations, print, responsive
  js/controls.js      33 HIPAA controls with guidance and remediation
  js/app.js           State management, rendering, tabs, scoring, org-type filtering
  js/policies.js      39-policy library with acknowledgment tracking
  js/training.js      5 training modules with completion tracking
  js/search.js        Global search across controls, policies, training
  js/progress.js      Multi-dimensional compliance dashboard
  js/risk.js          Risk register, heat map, gap analysis
  js/export.js        JSON/CSV/PDF export and JSON import
```

## Privacy

This tool runs entirely in your browser. No data is transmitted to any server. No cookies, no analytics, no tracking. Use the export features to save your work locally.

## Disclaimer

This tool is for informational and compliance-support purposes only. It does not constitute legal advice. Consult qualified counsel or a compliance professional to validate findings.
