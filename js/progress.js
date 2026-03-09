/* ============================================================
   HIPAA SRA Tool — Multi-Dimensional Progress Calculator
   Computes 5-dimension compliance readiness
   ============================================================ */

const ProgressModule = (() => {

  function computeAllDimensions(state, activeControls) {
    const controls = activeControls || CONTROLS;
    const totalControls = controls.length;
    const answeredCount = controls.filter(c => state.responses[c.id] !== undefined).length;
    const sraCompletion = totalControls > 0 ? Math.round((answeredCount / totalControls) * 100) : 0;

    const sum = controls.reduce((a, c) => a + (state.responses[c.id] || 0), 0);
    const complianceScore = totalControls > 0 ? Math.round((sum / (totalControls * 2)) * 100) : 0;

    let policyAdoption = 0;
    if (typeof PolicyModule !== 'undefined') {
      const summary = PolicyModule.getAcknowledgmentSummary(state);
      policyAdoption = summary.pct;
    }

    let trainingStatus = 0;
    if (typeof TrainingModule !== 'undefined') {
      const summary = TrainingModule.getTrainingSummary(state);
      trainingStatus = summary.pct;
    }

    const gaps = controls.filter(c => state.responses[c.id] === 0 || state.responses[c.id] === 1);
    const remediatedGaps = gaps.filter(c => {
      const rem = (state.remediation || {})[c.id];
      return rem && rem.owner && rem.dueDate;
    });
    const remediationProgress = gaps.length > 0 ? Math.round((remediatedGaps.length / gaps.length) * 100) : 100;

    const composite = Math.round(
      (sraCompletion * 0.20) +
      (complianceScore * 0.30) +
      (policyAdoption * 0.20) +
      (trainingStatus * 0.15) +
      (remediationProgress * 0.15)
    );

    return {
      sraCompletion,
      complianceScore,
      policyAdoption,
      trainingStatus,
      remediationProgress,
      composite,
      answeredCount,
      totalControls,
      gapCount: gaps.length,
      remediatedCount: remediatedGaps.length
    };
  }

  function renderDashboard(state, activeControls) {
    const el = document.getElementById('progress-dashboard');
    if (!el) return;

    const d = computeAllDimensions(state, activeControls);

    const dimensions = [
      { label: 'SRA Completion', value: d.sraCompletion, detail: `${d.answeredCount}/${d.totalControls} controls answered`, color: 'var(--clr-primary)' },
      { label: 'Compliance Score', value: d.complianceScore, detail: d.complianceScore >= 85 ? 'Low Risk' : d.complianceScore >= 60 ? 'Moderate Risk' : 'Elevated Risk', color: d.complianceScore >= 85 ? 'var(--clr-success)' : d.complianceScore >= 60 ? 'var(--clr-warning)' : 'var(--clr-danger)' },
      { label: 'Policy Adoption', value: d.policyAdoption, detail: 'Policies acknowledged', color: 'var(--clr-accent)' },
      { label: 'Training Status', value: d.trainingStatus, detail: 'Modules completed', color: '#6366f1' },
      { label: 'Remediation', value: d.remediationProgress, detail: `${d.remediatedCount}/${d.gapCount} gaps assigned`, color: '#ec4899' }
    ];

    let h = '<div class="progress-composite">';
    h += '<div class="progress-composite-ring-wrap">';
    h += buildRingSVG(d.composite, 'var(--clr-primary)', 54, 7);
    h += `<div class="progress-composite-label"><span class="progress-composite-value">${d.composite}</span><span class="progress-composite-unit">%</span></div>`;
    h += '</div>';
    h += '<div class="progress-composite-text"><strong>Compliance Readiness</strong><span>Weighted composite across all dimensions</span></div>';
    h += '</div>';

    h += '<div class="progress-dimensions">';
    dimensions.forEach(dim => {
      h += '<div class="progress-dimension">';
      h += '<div class="progress-dim-ring-wrap">';
      h += buildRingSVG(dim.value, dim.color, 32, 5);
      h += `<div class="progress-dim-ring-label">${dim.value}</div>`;
      h += '</div>';
      h += '<div class="progress-dim-info">';
      h += `<div class="progress-dim-name">${dim.label}</div>`;
      h += `<div class="progress-dim-detail">${dim.detail}</div>`;
      h += '</div></div>';
    });
    h += '</div>';

    el.innerHTML = h;
  }

  function buildRingSVG(pct, color, r, strokeW) {
    const c = 2 * Math.PI * r;
    const offset = c - (pct / 100) * c;
    const size = (r + strokeW) * 2;
    return `<svg viewBox="0 0 ${size} ${size}" class="progress-ring-svg">` +
      `<circle cx="${r + strokeW}" cy="${r + strokeW}" r="${r}" fill="none" stroke="var(--clr-surface-alt)" stroke-width="${strokeW}"/>` +
      `<circle cx="${r + strokeW}" cy="${r + strokeW}" r="${r}" fill="none" stroke="${color}" stroke-width="${strokeW}" ` +
      `stroke-dasharray="${c}" stroke-dashoffset="${offset}" stroke-linecap="round" transform="rotate(-90 ${r + strokeW} ${r + strokeW})"/>` +
      '</svg>';
  }

  function getCompositeScore(state, activeControls) {
    return computeAllDimensions(state, activeControls).composite;
  }

  return { renderDashboard, getCompositeScore, computeAllDimensions };
})();
