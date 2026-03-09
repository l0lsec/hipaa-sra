/* ============================================================
   HIPAA SRA Tool — Export / Import / PDF Report
   Includes policies, training, and remediation data
   ============================================================ */

const ExportModule = (() => {

  function downloadFile(content, filename, mime) {
    const blob = new Blob([content], { type: mime });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 100);
  }

  function timestamp() {
    return new Date().toISOString().slice(0, 10);
  }

  /* ── JSON Export ─────────────────────────────────────── */
  function exportJSON(state) {
    const payload = {
      version: 2,
      exportedAt: new Date().toISOString(),
      metadata: state.metadata || {},
      responses: state.responses || {},
      notes: state.notes || {},
      risk: state.risk || {},
      remediation: state.remediation || {},
      attestation: state.attestation || {},
      policyAcknowledgments: state.policyAcknowledgments || {},
      trainingProgress: state.trainingProgress || {}
    };
    downloadFile(JSON.stringify(payload, null, 2), `hipaa-sra-${timestamp()}.json`, 'application/json');
  }

  /* ── JSON Import ─────────────────────────────────────── */
  function importJSON(file, callback) {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const data = JSON.parse(e.target.result);
        if (!data.responses || typeof data.responses !== 'object') {
          alert('Invalid file: missing responses object.');
          return;
        }
        callback(data);
      } catch (err) {
        alert('Failed to parse JSON file: ' + err.message);
      }
    };
    reader.readAsText(file);
  }

  /* ── CSV Export ──────────────────────────────────────── */
  function exportCSV(state) {
    const activeControls = (typeof App !== 'undefined' && App.getActiveControls) ? App.getActiveControls() : CONTROLS;

    const rows = [['Control ID', 'Category', 'Control Description', 'Response', 'Score', 'Remediation Steps', 'Notes / Evidence']];

    activeControls.forEach(c => {
      const cat = CATEGORIES.find(x => x.key === c.cat);
      const val = state.responses[c.id];
      let label = 'Unanswered';
      let score = '';
      if (val === 2) { label = 'Yes'; score = '2'; }
      else if (val === 1) { label = 'Partial'; score = '1'; }
      else if (val === 0) { label = 'No'; score = '0'; }

      rows.push([
        c.id,
        cat ? cat.label : c.cat,
        csvSafe(c.text),
        label,
        score,
        csvSafe(c.remediation || ''),
        csvSafe(state.notes[c.id] || '')
      ]);
    });

    rows.push([]);
    rows.push(['--- Policy Acknowledgments ---']);
    rows.push(['Policy ID', 'Policy Name', 'Acknowledged', 'Date']);

    if (typeof PolicyModule !== 'undefined') {
      const acks = state.policyAcknowledgments || {};
      PolicyModule.POLICIES.forEach(p => {
        const ack = acks[p.id];
        rows.push([
          p.id,
          csvSafe(p.name),
          ack && ack.acknowledged ? 'Yes' : 'No',
          (ack && ack.date) || ''
        ]);
      });
    }

    rows.push([]);
    rows.push(['--- Training Progress ---']);
    rows.push(['Module ID', 'Module Title', 'Completed', 'Date', 'Completed By']);

    if (typeof TrainingModule !== 'undefined') {
      const progress = state.trainingProgress || {};
      TrainingModule.MODULES.forEach(m => {
        const p = progress[m.id] || {};
        rows.push([
          m.id,
          csvSafe(m.title),
          p.completed ? 'Yes' : 'No',
          p.date || '',
          csvSafe(p.completedBy || '')
        ]);
      });
    }

    const csv = rows.map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    downloadFile(csv, `hipaa-sra-${timestamp()}.csv`, 'text/csv');
  }

  function csvSafe(str) {
    return String(str || '').replace(/\n/g, ' ').replace(/\r/g, '');
  }

  /* ── PDF Report (print-friendly new window) ─────────── */
  function exportPDF(state, activeControls) {
    const controls = activeControls || ((typeof App !== 'undefined' && App.getActiveControls) ? App.getActiveControls() : CONTROLS);
    const meta = state.metadata || {};
    const answered = controls.filter(c => state.responses[c.id] !== undefined).length;
    const total = controls.length;
    const sum = controls.reduce((a, c) => a + (state.responses[c.id] || 0), 0);
    const pct = total > 0 ? Math.round((sum / (total * 2)) * 100) : 0;
    const riskLvl = pct >= 85 ? 'Low' : pct >= 60 ? 'Moderate' : 'Elevated';
    const riskClr = pct >= 85 ? '#059669' : pct >= 60 ? '#d97706' : '#dc2626';

    const gaps = RiskModule.getGapControls(state);
    const risk = state.risk || {};
    const likelihood = Math.min(5, Math.max(1, parseInt(risk.likelihood) || 3));
    const impact = Math.min(5, Math.max(1, parseInt(risk.impact) || 3));
    const riskScore = likelihood * impact;

    let html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>HIPAA SRA Report</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'IBM Plex Sans',system-ui,sans-serif;color:#1a2332;line-height:1.6;padding:40px 48px;max-width:900px;margin:0 auto}
h1,h2,h3{font-family:'DM Serif Display',Georgia,serif;font-weight:400}
h1{font-size:1.6rem;margin-bottom:4px}
h2{font-size:1.2rem;margin:28px 0 12px;padding-bottom:6px;border-bottom:2px solid #dce1e8}
h3{font-size:1rem;margin-bottom:8px}
.header{text-align:center;margin-bottom:36px;padding-bottom:24px;border-bottom:3px solid #0d9488}
.header h1{font-size:2rem;color:#0d9488}
.header p{color:#556479;font-size:.9rem;margin-top:4px}
.meta-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px 24px;margin-bottom:24px}
.meta-item{font-size:.85rem}.meta-item strong{color:#556479;text-transform:uppercase;font-size:.72rem;letter-spacing:.3px;display:block}
.summary-box{display:flex;gap:24px;margin-bottom:32px;padding:20px;background:#f4f6f8;border-radius:8px;border:1px solid #dce1e8}
.summary-stat{text-align:center;flex:1}
.summary-stat .val{font-family:'DM Serif Display',serif;font-size:2rem;color:#0d9488}
.summary-stat .lbl{font-size:.72rem;text-transform:uppercase;color:#556479;letter-spacing:.3px}
.risk-lvl{font-size:.8rem;font-weight:700;padding:3px 10px;border-radius:12px;display:inline-block}
table{width:100%;border-collapse:collapse;font-size:.82rem;margin-bottom:16px}
th{text-align:left;padding:8px 10px;background:#eef1f5;font-weight:600;font-size:.72rem;text-transform:uppercase;letter-spacing:.3px;border-bottom:2px solid #dce1e8}
td{padding:8px 10px;border-bottom:1px solid #e8ecf1;vertical-align:top}
.status-yes{color:#059669;font-weight:600}
.status-partial{color:#d97706;font-weight:600}
.status-no{color:#dc2626;font-weight:600}
.status-unanswered{color:#8494a7}
.section{page-break-inside:avoid;margin-bottom:8px}
.remediation-text{font-size:.78rem;color:#556479;margin-top:4px;padding:6px 10px;background:#fef3c7;border-left:3px solid #d97706;border-radius:4px}
.footer{margin-top:40px;padding-top:16px;border-top:1px solid #dce1e8;font-size:.72rem;color:#8494a7;text-align:center}
@media print{body{padding:20px 24px}h2{font-size:1.05rem}.summary-box{break-inside:avoid}}
</style></head><body>`;

    html += `<div class="header"><h1>HIPAA Security Risk Assessment Report</h1>`;
    html += `<p>Generated ${new Date().toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })}</p></div>`;

    html += '<h2>Executive Summary</h2>';
    html += '<div class="summary-box">';
    html += `<div class="summary-stat"><div class="val">${pct}%</div><div class="lbl">Overall Score</div></div>`;
    html += `<div class="summary-stat"><div class="val" style="color:${riskClr}">${riskLvl}</div><div class="lbl">Risk Level</div></div>`;
    html += `<div class="summary-stat"><div class="val">${answered}/${total}</div><div class="lbl">Controls Answered</div></div>`;
    html += `<div class="summary-stat"><div class="val">${gaps.length}</div><div class="lbl">Gaps Identified</div></div>`;

    if (typeof PolicyModule !== 'undefined') {
      const policySummary = PolicyModule.getAcknowledgmentSummary(state);
      html += `<div class="summary-stat"><div class="val">${policySummary.acknowledged}/${policySummary.total}</div><div class="lbl">Policies Acknowledged</div></div>`;
    }
    if (typeof TrainingModule !== 'undefined') {
      const trainingSummary = TrainingModule.getTrainingSummary(state);
      html += `<div class="summary-stat"><div class="val">${trainingSummary.completed}/${trainingSummary.total}</div><div class="lbl">Training Complete</div></div>`;
    }

    html += '</div>';

    html += '<h2>Organization Details</h2><div class="meta-grid">';
    html += `<div class="meta-item"><strong>Organization</strong>${esc(meta.orgName || 'N/A')}</div>`;
    html += `<div class="meta-item"><strong>Assessment Date</strong>${esc(meta.assessDate || 'N/A')}</div>`;
    html += `<div class="meta-item"><strong>Assessor</strong>${esc(meta.assessorName || 'N/A')}</div>`;
    const etMap = { ce: 'Covered Entity', ba: 'Business Associate', hybrid: 'Hybrid Entity' };
    html += `<div class="meta-item"><strong>Entity Type</strong>${etMap[meta.entityType] || 'N/A'}</div>`;
    html += '</div>';
    if (meta.scopeDesc) {
      html += `<div class="meta-item" style="margin-bottom:24px"><strong>Scope</strong>${esc(meta.scopeDesc)}</div>`;
    }

    CATEGORIES.forEach(cat => {
      const catControls = controls.filter(c => c.cat === cat.key);
      if (catControls.length === 0) return;
      html += `<h2>${cat.label} <span style="font-size:.8rem;color:#8494a7">(${cat.cfr})</span></h2>`;
      html += '<table><thead><tr><th style="width:70px">ID</th><th>Control</th><th style="width:100px">Status</th><th>Notes</th></tr></thead><tbody>';

      catControls.forEach(c => {
        const val = state.responses[c.id];
        let statusHtml, cls;
        if (val === 2) { statusHtml = 'Yes'; cls = 'status-yes'; }
        else if (val === 1) { statusHtml = 'Partial'; cls = 'status-partial'; }
        else if (val === 0) { statusHtml = 'No'; cls = 'status-no'; }
        else { statusHtml = '\u2014'; cls = 'status-unanswered'; }

        html += `<tr class="section"><td><strong>${c.id}</strong></td><td>${esc(c.text)}</td>`;
        html += `<td class="${cls}">${statusHtml}</td>`;
        html += `<td>${esc(state.notes[c.id] || '')}`;
        if ((val === 0 || val === 1) && c.remediation) {
          html += `<div class="remediation-text"><strong>Remediation:</strong> ${esc(c.remediation)}</div>`;
        }
        html += '</td></tr>';
      });
      html += '</tbody></table>';
    });

    if (gaps.length > 0) {
      html += '<h2>Gap Analysis &amp; Remediation</h2>';
      html += '<table><thead><tr><th>Control</th><th>Status</th><th>Remediation</th><th>Owner</th><th>Due Date</th></tr></thead><tbody>';
      gaps.forEach(g => {
        const val = state.responses[g.id];
        const sLabel = val === 1 ? 'Partial' : 'Non-Compliant';
        const sCls = val === 1 ? 'status-partial' : 'status-no';
        const rem = (state.remediation || {})[g.id] || {};
        html += `<tr><td><strong>${g.id}</strong> \u2014 ${esc(truncateText(g.text, 60))}</td>`;
        html += `<td class="${sCls}">${sLabel}</td>`;
        html += `<td style="font-size:.78rem">${esc(g.remediation || '\u2014')}</td>`;
        html += `<td>${esc(rem.owner || '\u2014')}</td><td>${esc(rem.dueDate || '\u2014')}</td></tr>`;
      });
      html += '</tbody></table>';
    }

    html += '<h2>Risk Register</h2><div class="meta-grid">';
    html += `<div class="meta-item"><strong>Likelihood</strong>${likelihood} / 5</div>`;
    html += `<div class="meta-item"><strong>Impact</strong>${impact} / 5</div>`;
    html += `<div class="meta-item"><strong>Risk Score</strong>${riskScore} \u2014 ${RiskModule.riskLabel(riskScore)}</div>`;
    html += '</div>';
    if (risk.threats) html += `<div class="meta-item" style="margin-bottom:12px"><strong>Threats</strong>${esc(risk.threats)}</div>`;
    if (risk.remediation) html += `<div class="meta-item" style="margin-bottom:12px"><strong>Remediation Plan</strong>${esc(risk.remediation)}</div>`;
    if (risk.residual) html += `<div class="meta-item" style="margin-bottom:12px"><strong>Residual Risk</strong>${esc(risk.residual)}</div>`;

    if (typeof PolicyModule !== 'undefined') {
      const policySummary = PolicyModule.getAcknowledgmentSummary(state);
      html += '<h2>Policy Attestation Summary</h2>';
      html += `<p style="font-size:.85rem;color:#556479;margin-bottom:12px">${policySummary.acknowledged} of ${policySummary.total} applicable policies acknowledged (${policySummary.pct}%)</p>`;
      html += '<table><thead><tr><th>Category</th><th>Acknowledged</th><th>Total</th></tr></thead><tbody>';
      Object.keys(policySummary.byCategory).forEach(key => {
        const cat = policySummary.byCategory[key];
        if (cat.total === 0) return;
        html += `<tr><td>${cat.label}</td><td>${cat.acknowledged}</td><td>${cat.total}</td></tr>`;
      });
      html += '</tbody></table>';
    }

    if (typeof TrainingModule !== 'undefined') {
      const trainingSummary = TrainingModule.getTrainingSummary(state);
      html += '<h2>Training Completion Status</h2>';
      html += `<p style="font-size:.85rem;color:#556479;margin-bottom:12px">${trainingSummary.completed} of ${trainingSummary.total} training modules completed (${trainingSummary.pct}%)</p>`;
      html += '<table><thead><tr><th>Module</th><th>Status</th><th>Completed Date</th><th>Completed By</th></tr></thead><tbody>';
      const progress = state.trainingProgress || {};
      TrainingModule.MODULES.forEach(m => {
        const p = progress[m.id] || {};
        html += `<tr><td>${esc(m.title)}</td>`;
        html += `<td class="${p.completed ? 'status-yes' : 'status-unanswered'}">${p.completed ? 'Complete' : 'Incomplete'}</td>`;
        html += `<td>${esc(p.date || '\u2014')}</td>`;
        html += `<td>${esc(p.completedBy || '\u2014')}</td></tr>`;
      });
      html += '</tbody></table>';
    }

    const att = state.attestation || {};
    if (att.execName || att.execTitle) {
      html += '<h2>Management Attestation</h2>';
      html += '<p style="font-size:.85rem;color:#556479;margin-bottom:12px">I hereby attest that the information provided in this HIPAA Security Risk Assessment is accurate and complete to the best of my knowledge. I authorize the execution of the proposed remediation activities and accept any residual risks documented herein.</p>';
      html += '<div class="meta-grid">';
      html += `<div class="meta-item"><strong>Executive</strong>${esc(att.execName || 'N/A')}</div>`;
      html += `<div class="meta-item"><strong>Title</strong>${esc(att.execTitle || 'N/A')}</div>`;
      html += `<div class="meta-item"><strong>Date</strong>${esc(att.attestDate || 'N/A')}</div>`;
      html += '</div>';
    }

    html += '<div class="footer"><p>Generated by HIPAA SRA Tool. This report does not constitute legal advice.</p></div>';
    html += '</body></html>';

    const win = window.open('', '_blank');
    if (win) {
      win.document.write(html);
      win.document.close();
      setTimeout(() => { win.print(); }, 600);
    } else {
      alert('Please allow pop-ups to generate the PDF report.');
    }
  }

  function truncateText(str, max) {
    return str.length > max ? str.substring(0, max) + '\u2026' : str;
  }

  function esc(val) {
    if (!val) return '';
    return String(val).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  return { exportJSON, importJSON, exportCSV, exportPDF };
})();
