/* ============================================================
   HIPAA SRA Tool — Main Application
   State management, rendering, tabs, filtering, onboarding,
   history, theme toggle, keyboard shortcuts, confetti,
   org-type filtering, remediation UI, attestation summary
   ============================================================ */

const App = (() => {
  const STORAGE_KEY = 'hipaa_sra_state';
  const HISTORY_KEY = 'hipaa_sra_history';
  const ONBOARD_KEY = 'hipaa_sra_onboarded';
  const THEME_KEY   = 'hipaa_sra_theme';
  const CIRCUMFERENCE = 2 * Math.PI * 42;

  let state = createBlankState();
  let activeTab = 'org';
  let activeFilters = {};
  let confettiTriggered = false;

  function createBlankState() {
    return {
      metadata: {},
      responses: {},
      notes: {},
      risk: {},
      remediation: {},
      attestation: {},
      policyAcknowledgments: {},
      trainingProgress: {}
    };
  }

  /* ── Persistence ────────────────────────────────────── */
  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        state = {
          metadata:              parsed.metadata              || {},
          responses:             parsed.responses             || {},
          notes:                 parsed.notes                 || {},
          risk:                  parsed.risk                  || {},
          remediation:           parsed.remediation           || {},
          attestation:           parsed.attestation           || {},
          policyAcknowledgments: parsed.policyAcknowledgments || {},
          trainingProgress:      parsed.trainingProgress      || {}
        };
      }
    } catch {}
  }

  function getHistory() {
    try {
      return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    } catch { return []; }
  }

  function saveHistory(hist) {
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(hist)); } catch {}
  }

  /* ── Org-Type Filtering ─────────────────────────────── */
  function getActiveControls() {
    const et = state.metadata.entityType;
    if (et === 'ba') {
      return CONTROLS.filter(c => c.applicableTo !== 'ce_only');
    }
    return CONTROLS;
  }

  function getActiveCategories() {
    const active = getActiveControls();
    const activeCats = new Set(active.map(c => c.cat));
    return CATEGORIES.filter(c => activeCats.has(c.key));
  }

  /* ── Scoring ────────────────────────────────────────── */
  function computeScore() {
    const controls = getActiveControls();
    const answered = controls.filter(c => state.responses[c.id] !== undefined).length;
    const sum = controls.reduce((a, c) => a + (state.responses[c.id] || 0), 0);
    const total = controls.length;
    const pct = total > 0 ? Math.round((sum / (total * 2)) * 100) : 0;
    let level = 'Not Started';
    let levelClass = '';
    if (answered > 0) {
      if (pct >= 85) { level = 'Low Risk'; levelClass = 'low'; }
      else if (pct >= 60) { level = 'Moderate'; levelClass = 'moderate'; }
      else { level = 'Elevated'; levelClass = 'elevated'; }
    }
    return { answered, total, sum, pct, level, levelClass };
  }

  function updateScoreboard() {
    const s = computeScore();

    document.getElementById('sidebar-score').textContent = s.pct;
    document.getElementById('sidebar-answered').textContent = s.answered;
    document.getElementById('sidebar-total').textContent = s.total;

    const badge = document.getElementById('sidebar-risk-level');
    badge.textContent = s.level;
    badge.className = 'risk-badge' + (s.levelClass ? ' ' + s.levelClass : '');

    const ring = document.querySelector('.score-ring-fill');
    if (ring) {
      const offset = CIRCUMFERENCE - (s.pct / 100) * CIRCUMFERENCE;
      ring.style.strokeDashoffset = offset;

      if (s.levelClass === 'elevated') ring.style.stroke = 'var(--clr-danger)';
      else if (s.levelClass === 'moderate') ring.style.stroke = 'var(--clr-warning)';
      else ring.style.stroke = 'var(--clr-primary)';
    }

    updateCategoryBadges();
    updateProgressDashboard();

    if (s.pct >= 85 && s.answered >= s.total && !confettiTriggered) {
      confettiTriggered = true;
      launchConfetti();
    }
  }

  function updateCategoryBadges() {
    const active = getActiveControls();
    CATEGORIES.forEach(cat => {
      const controls = active.filter(c => c.cat === cat.key);
      const answered = controls.filter(c => state.responses[c.id] !== undefined).length;
      const el = document.getElementById('badge-' + cat.key);
      if (el) el.textContent = `${answered}/${controls.length}`;
    });
  }

  function updateProgressDashboard() {
    if (typeof ProgressModule !== 'undefined') {
      ProgressModule.renderDashboard(state, getActiveControls());
    }
  }

  /* ── Control Rendering (with remediation) ───────────── */
  function renderControls(catKey) {
    const container = document.getElementById('controls-' + catKey);
    if (!container) return;

    const filter = activeFilters[catKey] || 'all';
    const active = getActiveControls();
    let controls = active.filter(c => c.cat === catKey);

    if (filter !== 'all') {
      controls = controls.filter(c => {
        const r = state.responses[c.id];
        if (filter === 'unanswered') return r === undefined;
        if (filter === 'yes') return r === 2;
        if (filter === 'partial') return r === 1;
        if (filter === 'no') return r === 0;
        return true;
      });
    }

    if (controls.length === 0) {
      container.innerHTML = '<div class="gaps-empty"><p>No controls match this filter.</p></div>';
      return;
    }

    container.innerHTML = controls.map(c => {
      const resp = state.responses[c.id];
      let cardClass = 'control-card';
      if (resp === 2) cardClass += ' answered-yes';
      else if (resp === 1) cardClass += ' answered-partial';
      else if (resp === 0) cardClass += ' answered-no';

      let answerPrint = '';
      if (resp === 2) answerPrint = '<span class="control-answer-print" style="background:#d1fae5;color:#059669">Yes</span>';
      else if (resp === 1) answerPrint = '<span class="control-answer-print" style="background:#fef3c7;color:#d97706">Partial</span>';
      else if (resp === 0) answerPrint = '<span class="control-answer-print" style="background:#fee2e2;color:#dc2626">No</span>';

      let remediationHtml = '';
      if (c.remediation) {
        remediationHtml = `<button class="remediation-toggle" data-remediation="${c.id}">` +
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>' +
          'Remediation steps</button>' +
          `<div class="remediation-content" id="remediation-${c.id}">${c.remediation}</div>`;
      }

      return `<div class="${cardClass}" data-control="${c.id}">
        <div class="control-header">
          <div>
            <div class="control-id">${c.id}</div>
            <div class="control-text">${c.text}</div>
            <div class="control-ref">${c.ref}</div>
            ${answerPrint}
          </div>
          <div class="response-btns">
            <button class="resp-btn${resp === 2 ? ' sel-yes' : ''}" data-id="${c.id}" data-val="2">Yes</button>
            <button class="resp-btn${resp === 1 ? ' sel-partial' : ''}" data-id="${c.id}" data-val="1">Partial</button>
            <button class="resp-btn${resp === 0 ? ' sel-no' : ''}" data-id="${c.id}" data-val="0">No</button>
          </div>
        </div>
        <button class="guidance-toggle" data-guidance="${c.id}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
          How to comply
        </button>
        <div class="guidance-content" id="guidance-${c.id}">${c.guidance}</div>
        ${remediationHtml}
        <div class="control-notes">
          <textarea placeholder="Notes / evidence\u2026" data-note="${c.id}">${escHtml(state.notes[c.id])}</textarea>
        </div>
      </div>`;
    }).join('');

    bindControlEvents(container);
  }

  function bindControlEvents(container) {
    container.querySelectorAll('.resp-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        const id  = e.target.dataset.id;
        const val = parseInt(e.target.dataset.val);
        if (state.responses[id] === val) {
          delete state.responses[id];
        } else {
          state.responses[id] = val;
        }
        saveState();
        renderControls(CONTROLS.find(c => c.id === id).cat);
        updateScoreboard();
      });
    });

    container.querySelectorAll('.guidance-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.guidance;
        const content = document.getElementById('guidance-' + id);
        btn.classList.toggle('open');
        content.classList.toggle('open');
      });
    });

    container.querySelectorAll('.remediation-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.remediation;
        const content = document.getElementById('remediation-' + id);
        btn.classList.toggle('open');
        content.classList.toggle('open');
      });
    });

    container.querySelectorAll('[data-note]').forEach(ta => {
      ta.addEventListener('input', e => {
        const id = e.target.dataset.note;
        state.notes[id] = e.target.value;
        saveState();
      });
    });
  }

  /* ── Tabs ───────────────────────────────────────────── */
  function switchTab(tabKey) {
    activeTab = tabKey;
    document.querySelectorAll('.nav-item').forEach(n => {
      const isActive = n.dataset.tab === tabKey;
      n.classList.toggle('active', isActive);
      n.setAttribute('aria-selected', isActive);
    });
    document.querySelectorAll('.tab-panel').forEach(p => {
      p.classList.toggle('active', p.id === 'panel-' + tabKey);
    });

    if (['admin','physical','technical','organizational','docs'].includes(tabKey)) {
      renderControls(tabKey);
    } else if (tabKey === 'risk') {
      RiskModule.renderRiskRegister(state);
    } else if (tabKey === 'gaps') {
      RiskModule.renderGapAnalysis(state);
    } else if (tabKey === 'policies') {
      PolicyModule.renderPolicyLibrary(state);
    } else if (tabKey === 'training') {
      TrainingModule.renderTraining(state);
    } else if (tabKey === 'attest') {
      renderAttestationSummary();
    } else if (tabKey === 'history') {
      renderHistory();
    } else if (tabKey === 'org') {
      updateProgressDashboard();
    }

    closeMobileSidebar();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ── Filters ────────────────────────────────────────── */
  function initFilters() {
    document.querySelectorAll('.filter-bar').forEach(bar => {
      const catKey = bar.id.replace('filter-', '');
      bar.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          bar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          activeFilters[catKey] = btn.dataset.filter;
          renderControls(catKey);
        });
      });
    });
  }

  /* ── Organization & Attestation Fields ──────────────── */
  function bindMetadataFields() {
    document.querySelectorAll('[data-field]').forEach(el => {
      const field = el.dataset.field;
      const isAttest = ['execName','execTitle','attestDate'].includes(field);
      const bucket = isAttest ? 'attestation' : 'metadata';

      if (state[bucket][field] !== undefined) {
        el.value = state[bucket][field];
      }

      el.addEventListener('input', () => {
        state[bucket][field] = el.value;
        saveState();

        if (field === 'entityType') {
          onEntityTypeChange();
        }
      });
    });
  }

  function onEntityTypeChange() {
    updateScoreboard();
    const catTabs = ['admin','physical','technical','organizational','docs'];
    catTabs.forEach(cat => {
      if (activeTab === cat) renderControls(cat);
    });
  }

  /* ── Attestation Summary ────────────────────────────── */
  function renderAttestationSummary() {
    const el = document.getElementById('attestation-policy-summary');
    if (!el) return;

    if (typeof PolicyModule === 'undefined') {
      el.innerHTML = '';
      return;
    }

    const summary = PolicyModule.getAcknowledgmentSummary(state);
    let h = '<div class="attest-policy-section">';
    h += '<h3>Policy Attestation Summary</h3>';
    h += `<p style="font-size:.85rem;color:var(--clr-text-secondary);margin-bottom:16px">${summary.acknowledged} of ${summary.total} applicable policies acknowledged (${summary.pct}%)</p>`;

    Object.keys(summary.byCategory).forEach(key => {
      const cat = summary.byCategory[key];
      if (cat.total === 0) return;
      const pct = Math.round((cat.acknowledged / cat.total) * 100);
      h += '<div class="attest-category-bar">';
      h += `<span class="attest-category-label">${cat.label}</span>`;
      h += `<div class="attest-bar-track"><div class="attest-bar-fill" style="width:${pct}%"></div></div>`;
      h += `<span class="attest-bar-count">${cat.acknowledged}/${cat.total}</span>`;
      h += '</div>';
    });

    h += '</div>';
    el.innerHTML = h;
  }

  /* ── Theme ──────────────────────────────────────────── */
  function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) document.documentElement.setAttribute('data-theme', saved);

    const toggle = (theme) => {
      const next = theme || (document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem(THEME_KEY, next);
    };

    document.getElementById('theme-toggle').addEventListener('click', () => toggle());
    const mobileToggle = document.getElementById('mobile-theme-toggle');
    if (mobileToggle) mobileToggle.addEventListener('click', () => toggle());
  }

  /* ── Mobile Sidebar ─────────────────────────────────── */
  function initMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const menuBtn = document.getElementById('mobile-menu-btn');

    menuBtn.addEventListener('click', () => {
      sidebar.classList.add('open');
      overlay.classList.add('open');
    });

    overlay.addEventListener('click', closeMobileSidebar);
  }

  function closeMobileSidebar() {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebar-overlay').classList.remove('open');
  }

  /* ── Onboarding ─────────────────────────────────────── */
  function initOnboarding() {
    const overlay = document.getElementById('onboarding');
    if (localStorage.getItem(ONBOARD_KEY)) {
      overlay.classList.add('hidden');
      return;
    }

    let step = 0;
    const steps = overlay.querySelectorAll('.onboarding-step');
    const dots  = overlay.querySelectorAll('.dot');
    const nextBtn = document.getElementById('onboarding-next');
    const skipBtn = document.getElementById('onboarding-skip');

    function goToStep(idx) {
      step = idx;
      steps.forEach((s, i) => s.classList.toggle('active', i === idx));
      dots.forEach((d, i) => d.classList.toggle('active', i === idx));
      nextBtn.textContent = idx === steps.length - 1 ? 'Get Started' : 'Next';
    }

    nextBtn.addEventListener('click', () => {
      if (step < steps.length - 1) {
        goToStep(step + 1);
      } else {
        closeOnboarding();
      }
    });

    skipBtn.addEventListener('click', closeOnboarding);

    dots.forEach(d => {
      d.addEventListener('click', () => goToStep(parseInt(d.dataset.dot)));
    });

    function closeOnboarding() {
      overlay.classList.add('hidden');
      localStorage.setItem(ONBOARD_KEY, '1');
    }
  }

  /* ── History ────────────────────────────────────────── */
  function renderHistory() {
    const el = document.getElementById('history-content');
    if (!el) return;

    const history = getHistory();
    let h = '';

    h += '<div class="history-actions">';
    h += '<button class="btn btn-primary btn-sm" id="history-save-btn">Save Current Assessment</button>';
    if (history.length > 0) h += '<button class="btn btn-outline btn-sm" id="history-clear-btn">Clear All History</button>';
    h += '</div>';

    if (history.length === 0) {
      h += '<div class="history-empty"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg><p>No saved assessments yet. Complete an assessment and click "Save Current Assessment" to start tracking your history.</p></div>';
      el.innerHTML = h;
      bindHistoryEvents(el);
      return;
    }

    if (history.length >= 2) {
      h += '<div class="history-chart-wrap"><h3>Score Trend</h3>';
      h += buildTrendChart(history);
      h += '</div>';
    }

    h += '<div class="history-list">';
    history.slice().reverse().forEach((entry, idx) => {
      const realIdx = history.length - 1 - idx;
      h += `<div class="history-item">
        <div class="history-item-score">${entry.score}%</div>
        <div class="history-item-meta">
          <strong>${escHtml(entry.orgName || 'Assessment')}</strong>
          <span>${entry.date || 'No date'} \u2022 ${entry.answered}/${entry.total} controls \u2022 ${entry.riskLevel}</span>
        </div>
        <div class="history-item-actions">
          <button class="btn btn-outline btn-sm" data-history-load="${realIdx}">Load</button>
          <button class="btn btn-ghost btn-sm" data-history-delete="${realIdx}">\u2715</button>
        </div>
      </div>`;
    });
    h += '</div>';

    el.innerHTML = h;
    bindHistoryEvents(el);
  }

  function buildTrendChart(history) {
    const w = 600, barH = 160, pad = 40;
    const n = history.length;
    const barW = Math.min(60, Math.floor((w - pad * 2) / n) - 8);
    const gap = Math.floor((w - pad * 2 - barW * n) / Math.max(n - 1, 1));

    let svg = `<svg class="trend-chart" viewBox="0 0 ${w} ${barH + 40}" preserveAspectRatio="xMidYMid meet">`;
    svg += `<line x1="${pad}" y1="${barH}" x2="${w - pad}" y2="${barH}" stroke="var(--clr-border)" stroke-width="1"/>`;

    history.forEach((entry, i) => {
      const x = pad + i * (barW + gap);
      const h = (entry.score / 100) * (barH - 20);
      const y = barH - h;
      const clr = entry.score >= 85 ? 'var(--clr-success)' : entry.score >= 60 ? 'var(--clr-warning)' : 'var(--clr-danger)';

      svg += `<rect x="${x}" y="${y}" width="${barW}" height="${h}" rx="4" fill="${clr}" opacity="0.85"/>`;
      svg += `<text x="${x + barW / 2}" y="${y - 6}" text-anchor="middle" font-size="11" font-weight="600" fill="var(--clr-text)">${entry.score}%</text>`;
      const label = entry.date ? entry.date.slice(5) : `#${i + 1}`;
      svg += `<text x="${x + barW / 2}" y="${barH + 16}" text-anchor="middle" font-size="10" fill="var(--clr-text-muted)">${label}</text>`;
    });

    svg += '</svg>';
    return svg;
  }

  function bindHistoryEvents(el) {
    const saveBtn = el.querySelector('#history-save-btn');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        const s = computeScore();
        const history = getHistory();
        history.push({
          date: state.metadata.assessDate || new Date().toISOString().slice(0, 10),
          orgName: state.metadata.orgName || '',
          score: s.pct,
          answered: s.answered,
          total: s.total,
          riskLevel: s.level,
          snapshot: JSON.parse(JSON.stringify(state))
        });
        saveHistory(history);
        renderHistory();
      });
    }

    const clearBtn = el.querySelector('#history-clear-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (confirm('Delete all saved assessment history? This cannot be undone.')) {
          saveHistory([]);
          renderHistory();
        }
      });
    }

    el.querySelectorAll('[data-history-load]').forEach(btn => {
      btn.addEventListener('click', e => {
        const idx = parseInt(e.target.dataset.historyLoad);
        const history = getHistory();
        if (history[idx] && history[idx].snapshot) {
          if (confirm('Load this saved assessment? Your current work will be replaced (save it first if needed).')) {
            const snap = history[idx].snapshot;
            state.metadata              = snap.metadata              || {};
            state.responses             = snap.responses             || {};
            state.notes                 = snap.notes                 || {};
            state.risk                  = snap.risk                  || {};
            state.remediation           = snap.remediation           || {};
            state.attestation           = snap.attestation           || {};
            state.policyAcknowledgments = snap.policyAcknowledgments || {};
            state.trainingProgress      = snap.trainingProgress      || {};
            saveState();
            hydrate();
            switchTab('org');
          }
        }
      });
    });

    el.querySelectorAll('[data-history-delete]').forEach(btn => {
      btn.addEventListener('click', e => {
        const idx = parseInt(e.target.dataset.historyDelete);
        const history = getHistory();
        history.splice(idx, 1);
        saveHistory(history);
        renderHistory();
      });
    });
  }

  /* ── Confetti ───────────────────────────────────────── */
  function launchConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#0d9488','#d97706','#059669','#dc2626','#6366f1','#f59e0b','#14b8a6'];
    const pieces = [];
    for (let i = 0; i < 150; i++) {
      pieces.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        w: Math.random() * 8 + 4,
        h: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 3 + 2,
        rot: Math.random() * 360,
        rotV: (Math.random() - 0.5) * 10,
        opacity: 1
      });
    }

    let frame = 0;
    const maxFrames = 180;

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const fade = frame > maxFrames * 0.7 ? 1 - (frame - maxFrames * 0.7) / (maxFrames * 0.3) : 1;

      pieces.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05;
        p.rot += p.rotV;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, fade * p.opacity);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });

      frame++;
      if (frame < maxFrames) {
        requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    requestAnimationFrame(draw);
  }

  /* ── Keyboard Shortcuts ─────────────────────────────── */
  function initKeyboard() {
    document.addEventListener('keydown', e => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;

      if (e.key === 't' || e.key === 'T') {
        document.getElementById('theme-toggle').click();
        return;
      }

      if (e.key === '/') {
        e.preventDefault();
        const searchInput = document.getElementById('sidebar-search');
        if (searchInput) searchInput.focus();
        return;
      }
    });
  }

  /* ── Export / Import Wiring ─────────────────────────── */
  function initExport() {
    document.getElementById('btn-export-json').addEventListener('click', () => ExportModule.exportJSON(state));
    document.getElementById('btn-export-csv').addEventListener('click', () => ExportModule.exportCSV(state));
    document.getElementById('btn-export-pdf').addEventListener('click', () => ExportModule.exportPDF(state, getActiveControls()));

    document.getElementById('import-file').addEventListener('change', e => {
      const file = e.target.files[0];
      if (!file) return;
      ExportModule.importJSON(file, data => {
        state.metadata              = data.metadata              || {};
        state.responses             = data.responses             || {};
        state.notes                 = data.notes                 || {};
        state.risk                  = data.risk                  || {};
        state.remediation           = data.remediation           || {};
        state.attestation           = data.attestation           || {};
        state.policyAcknowledgments = data.policyAcknowledgments || {};
        state.trainingProgress      = data.trainingProgress      || {};
        saveState();
        hydrate();
        switchTab('org');
      });
      e.target.value = '';
    });
  }

  /* ── Hydrate UI from State ──────────────────────────── */
  function hydrate() {
    bindMetadataFields();
    updateScoreboard();
    confettiTriggered = false;
    const s = computeScore();
    if (s.pct >= 85 && s.answered >= s.total) confettiTriggered = true;
  }

  /* ── Utility ────────────────────────────────────────── */
  function escHtml(val) {
    if (!val) return '';
    return String(val).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* ── Init ───────────────────────────────────────────── */
  function init() {
    loadState();
    initTheme();
    initOnboarding();
    initMobileSidebar();
    initFilters();
    initKeyboard();
    initExport();
    hydrate();

    document.querySelectorAll('.nav-item[data-tab]').forEach(btn => {
      btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    if (typeof SearchModule !== 'undefined') {
      SearchModule.initSearch(switchTab);
    }

    renderControls('admin');
  }

  document.addEventListener('DOMContentLoaded', init);

  return { saveState, computeScore, getActiveControls, switchTab, state: () => state };
})();
