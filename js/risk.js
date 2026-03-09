/* ============================================================
   HIPAA SRA Tool — Risk Register, Heat Map & Gap Analysis
   ============================================================ */

const RiskModule = (() => {

  const HEAT_COLORS = [
    ['green','green','yellow','yellow','orange'],
    ['green','yellow','yellow','orange','orange'],
    ['yellow','yellow','orange','orange','red'],
    ['yellow','orange','orange','red','red'],
    ['orange','orange','red','red','darkred'],
  ];

  const IMPACT_LABELS  = ['Negligible','Minor','Moderate','Major','Catastrophic'];
  const LIKELIHOOD_LABELS = ['Rare','Unlikely','Possible','Likely','Almost Certain'];

  function calcRiskScore(l, i) { return l * i; }

  function riskLabel(score) {
    if (score <= 4) return 'Low';
    if (score <= 12) return 'Medium';
    if (score <= 19) return 'High';
    return 'Critical';
  }

  function riskPriorityClass(score) {
    if (score <= 4) return 'priority-low';
    if (score <= 12) return 'priority-medium';
    return 'priority-high';
  }

  function getActiveControlsList() {
    if (typeof App !== 'undefined' && App.getActiveControls) {
      return App.getActiveControls();
    }
    return CONTROLS;
  }

  function getGapControls(state) {
    return getActiveControlsList().filter(c => {
      const r = state.responses[c.id];
      return r === 0 || r === 1;
    }).sort((a, b) => (state.responses[a.id] ?? 99) - (state.responses[b.id] ?? 99));
  }

  function truncate(str, max) {
    return str.length > max ? str.substring(0, max) + '\u2026' : str;
  }

  function buildHeatMapHTML(likelihood, impact) {
    let h = '<div class="heat-map-grid">';
    h += '<div class="heat-map-cell heat-label"></div>';
    for (let i = 1; i <= 5; i++) {
      h += `<div class="heat-map-cell heat-label">${i}<br><span style="font-size:.6rem">${IMPACT_LABELS[i-1]}</span></div>`;
    }
    for (let l = 5; l >= 1; l--) {
      h += `<div class="heat-map-cell heat-label heat-label-y">${l} \u2014 ${LIKELIHOOD_LABELS[l-1]}</div>`;
      for (let i = 1; i <= 5; i++) {
        const color = HEAT_COLORS[l-1][i-1];
        const sc = l * i;
        const active = (l === likelihood && i === impact) ? ' active-risk' : '';
        h += `<div class="heat-map-cell heat-${color}${active}" title="L${l} x I${i} = ${sc}">${sc}</div>`;
      }
    }
    h += '</div>';
    h += '<p style="text-align:center;font-size:.75rem;color:var(--clr-text-muted);margin-top:8px;">Likelihood (rows) \u00d7 Impact (columns) \u2014 current position highlighted</p>';
    return h;
  }

  function renderRiskRegister(state) {
    const el = document.getElementById('risk-content');
    if (!el) return;

    const risk = state.risk || {};
    const likelihood = Math.min(5, Math.max(1, parseInt(risk.likelihood) || 3));
    const impact     = Math.min(5, Math.max(1, parseInt(risk.impact) || 3));
    const score      = calcRiskScore(likelihood, impact);

    let h = '';

    h += '<div class="risk-section"><h2>Risk Heat Map</h2>';
    h += '<div class="card">' + buildHeatMapHTML(likelihood, impact) + '</div></div>';

    h += '<div class="risk-section"><h2>Threats &amp; Vulnerabilities</h2><div class="card"><div class="form-group full-width">';
    h += '<label for="risk-threats">Key Threats &amp; Vulnerabilities</label>';
    h += `<textarea id="risk-threats" rows="4" placeholder="Describe the primary threats and vulnerabilities identified during this assessment (e.g., ransomware targeting unpatched systems, phishing attacks on untrained staff, misconfigured cloud storage, lost/stolen mobile devices)." data-risk-field="threats">${esc(risk.threats)}</textarea>`;
    h += '</div></div></div>';

    h += '<div class="risk-section"><h2>Risk Scoring</h2><div class="card"><div class="form-grid">';
    h += '<div class="form-group"><label for="risk-likelihood">Likelihood (1\u20135)</label>';
    h += `<input type="number" id="risk-likelihood" min="1" max="5" value="${likelihood}" data-risk-field="likelihood">`;
    h += '<span style="font-size:.75rem;color:var(--clr-text-muted)">1 = Rare, 5 = Almost Certain</span></div>';
    h += '<div class="form-group"><label for="risk-impact">Impact (1\u20135)</label>';
    h += `<input type="number" id="risk-impact" min="1" max="5" value="${impact}" data-risk-field="impact">`;
    h += '<span style="font-size:.75rem;color:var(--clr-text-muted)">1 = Negligible, 5 = Catastrophic</span></div>';
    h += '<div class="form-group"><label>Calculated Risk Score</label>';
    h += `<div style="font-family:var(--font-display);font-size:2rem;color:var(--clr-primary)">${score} <span class="${riskPriorityClass(score)}" style="font-size:.875rem">${riskLabel(score)}</span></div></div>`;
    h += '</div></div></div>';

    h += '<div class="risk-section"><h2>Remediation Plan</h2><div class="card"><div class="form-group full-width">';
    h += '<label for="risk-remediation">Planned Remediation Actions</label>';
    h += `<textarea id="risk-remediation" rows="4" placeholder="Document specific actions, responsible owners, and target completion dates (e.g., Deploy MFA on all cloud accounts \u2014 IT Director \u2014 by Q2 2026)." data-risk-field="remediation">${esc(risk.remediation)}</textarea>`;
    h += '</div></div></div>';

    const gaps = getGapControls(state);
    if (gaps.length > 0) {
      h += '<div class="risk-section"><h2>Auto-Generated Remediation Items</h2>';
      h += '<p style="font-size:.85rem;color:var(--clr-text-secondary);margin-bottom:16px;">Controls not fully met are listed below. Assign owners and due dates to track remediation.</p>';
      h += '<div class="card" style="overflow-x:auto"><table class="remediation-table"><thead><tr>';
      h += '<th>Control</th><th>Status</th><th>Priority</th><th>Owner</th><th>Due Date</th></tr></thead><tbody>';

      gaps.forEach(g => {
        const rem = (state.remediation || {})[g.id] || {};
        const val = state.responses[g.id];
        const statusLabel = val === 1 ? 'Partial' : 'Non-Compliant';
        const statusClass = val === 1 ? 'partial' : 'no';
        const pScore = val === 0 ? score : Math.max(1, Math.floor(score * 0.6));
        h += '<tr>';
        h += `<td><strong>${g.id}</strong><br><span style="font-size:.8rem;color:var(--clr-text-secondary)">${truncate(g.text, 80)}</span></td>`;
        h += `<td><span class="gap-status ${statusClass}">${statusLabel}</span></td>`;
        h += `<td><span class="${riskPriorityClass(pScore)}">${riskLabel(pScore)}</span></td>`;
        h += `<td><input type="text" placeholder="Assignee" value="${esc(rem.owner)}" data-rem-id="${g.id}" data-rem-field="owner"></td>`;
        h += `<td><input type="date" value="${esc(rem.dueDate)}" data-rem-id="${g.id}" data-rem-field="dueDate"></td>`;
        h += '</tr>';
      });
      h += '</tbody></table></div></div>';
    }

    h += '<div class="risk-section"><h2>Residual Risk Acceptance</h2><div class="card"><div class="form-group full-width">';
    h += '<label for="risk-residual">Residual Risk Statement</label>';
    h += `<textarea id="risk-residual" rows="3" placeholder="Describe any residual risks that cannot be fully mitigated and who has formally accepted them." data-risk-field="residual">${esc(risk.residual)}</textarea>`;
    h += '</div></div></div>';

    el.innerHTML = h;

    el.querySelectorAll('[data-risk-field]').forEach(inp => {
      inp.addEventListener('input', e => {
        const f = e.target.dataset.riskField;
        if (!state.risk) state.risk = {};
        let v = e.target.value;
        if (f === 'likelihood' || f === 'impact') v = Math.min(5, Math.max(1, parseInt(v) || 1));
        state.risk[f] = v;
        if (f === 'likelihood' || f === 'impact') renderRiskRegister(state);
        if (typeof App !== 'undefined') App.saveState();
      });
    });

    el.querySelectorAll('[data-rem-id]').forEach(inp => {
      inp.addEventListener('input', e => {
        const id = e.target.dataset.remId;
        const f  = e.target.dataset.remField;
        if (!state.remediation) state.remediation = {};
        if (!state.remediation[id]) state.remediation[id] = {};
        state.remediation[id][f] = e.target.value;
        if (typeof App !== 'undefined') App.saveState();
      });
    });
  }

  function renderGapAnalysis(state) {
    const el = document.getElementById('gaps-content');
    if (!el) return;

    const gaps = getGapControls(state);
    if (gaps.length === 0) {
      el.innerHTML = '<div class="gaps-empty"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg><p>No gaps found. All answered controls are fully compliant, or no controls have been answered yet.</p></div>';
      return;
    }

    const grouped = {};
    CATEGORIES.forEach(c => { grouped[c.key] = []; });
    gaps.forEach(g => { if (grouped[g.cat]) grouped[g.cat].push(g); });

    let h = '';
    CATEGORIES.forEach(cat => {
      const items = grouped[cat.key];
      if (!items.length) return;
      h += `<div class="gap-category"><h3>${cat.label} <span style="font-size:.8rem;color:var(--clr-text-muted)">(${items.length} gap${items.length > 1 ? 's' : ''})</span></h3>`;
      items.forEach(g => {
        const val = state.responses[g.id];
        const sLabel = val === 1 ? 'Partial' : 'Non-Compliant';
        const sCls   = val === 1 ? 'partial' : 'no';
        h += `<div class="gap-item"><span class="gap-status ${sCls}">${sLabel}</span><div class="gap-detail">`;
        h += `<div class="control-id">${g.id} \u2014 ${g.ref}</div>`;
        h += `<div class="control-text">${g.text}</div>`;
        if (g.remediation) {
          h += `<div style="margin-top:8px;padding:10px 14px;background:var(--clr-accent-light);border-left:3px solid var(--clr-accent);border-radius:var(--radius-sm);font-size:.82rem;color:var(--clr-text-secondary);line-height:1.5"><strong style="color:var(--clr-accent)">Remediation:</strong> ${esc(g.remediation)}</div>`;
        }
        if (state.notes[g.id]) h += `<div style="margin-top:6px;font-size:.82rem;color:var(--clr-text-muted)"><strong>Notes:</strong> ${esc(state.notes[g.id])}</div>`;
        h += '</div></div>';
      });
      h += '</div>';
    });
    el.innerHTML = h;
  }

  function esc(val) {
    if (!val) return '';
    return String(val).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  return { renderRiskRegister, renderGapAnalysis, getGapControls, calcRiskScore, riskLabel, riskPriorityClass };
})();
