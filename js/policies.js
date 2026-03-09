/* ============================================================
   HIPAA SRA Tool — Policy Library
   39 HIPAA policy documents with acknowledgment tracking
   ============================================================ */

const PolicyModule = (() => {

  const POLICY_CATEGORIES = [
    { key: 'administrative', label: 'Administrative Safeguards', count: 13 },
    { key: 'physical',       label: 'Physical Safeguards',       count: 4  },
    { key: 'technical',      label: 'Technical Safeguards',      count: 6  },
    { key: 'privacy',        label: 'Privacy Rule',              count: 12, ceOnly: true },
    { key: 'breach',         label: 'Breach Notification',       count: 1  },
    { key: 'organizational', label: 'Organizational Requirements', count: 2  }
  ];

  const POLICIES = [
    { id: 'admin-1',  category: 'administrative', name: 'Administrative Safeguards and Assigned Security Responsibility Policy', description: 'Establishes administrative safeguards and designates the security official responsible for HIPAA compliance.' },
    { id: 'admin-2',  category: 'administrative', name: 'Administrative Requirements and Personnel Designations Policy', description: 'Defines administrative requirements and personnel roles for HIPAA compliance.' },
    { id: 'admin-3',  category: 'administrative', name: 'Sanctions Policy', description: 'Outlines sanctions for workforce members who violate security policies.' },
    { id: 'admin-4',  category: 'administrative', name: 'Workforce Security Policy', description: 'Ensures workforce members have appropriate access to ePHI based on their role.' },
    { id: 'admin-5',  category: 'administrative', name: 'Workforce Training and Security Awareness Policy', description: 'Establishes security awareness training requirements for all workforce members.' },
    { id: 'admin-6',  category: 'administrative', name: 'Termination Procedures Policy', description: 'Procedures for terminating access when workforce members leave or change roles.' },
    { id: 'admin-7',  category: 'administrative', name: 'Security Incident Response and Reporting Policy', description: 'Procedures for identifying, responding to, and reporting security incidents.' },
    { id: 'admin-8',  category: 'administrative', name: 'Ongoing Security Risk Assessment Policy', description: 'Establishes requirements for periodic security risk assessments.' },
    { id: 'admin-9',  category: 'administrative', name: 'Disaster Recovery Policy and Contingency Planning', description: 'Contingency planning for emergencies that damage systems containing ePHI.' },
    { id: 'admin-10', category: 'administrative', name: 'Disaster Recovery Plan', description: 'Detailed disaster recovery procedures and restoration steps.' },
    { id: 'admin-11', category: 'administrative', name: 'Data Backup and Storage Policy', description: 'Requirements for creating and maintaining retrievable copies of ePHI.' },
    { id: 'admin-12', category: 'administrative', name: 'Business Associate Agreement Policy', description: 'Requirements for Business Associate Agreements with all entities handling ePHI.' },
    { id: 'admin-13', category: 'administrative', name: 'Vendor Management Oversight Policy', description: 'Oversight requirements for vendors and business associates.' },

    { id: 'phys-1', category: 'physical', name: 'Facility Access Controls Policy', description: 'Controls limiting physical access to electronic information systems.' },
    { id: 'phys-2', category: 'physical', name: 'Workstation Use Policy', description: 'Proper functions and manner of use for workstations accessing ePHI.' },
    { id: 'phys-3', category: 'physical', name: 'Workstation Security Policy', description: 'Physical safeguards restricting access to workstations with ePHI.' },
    { id: 'phys-4', category: 'physical', name: 'Device and Media Controls', description: 'Controls governing hardware and electronic media containing ePHI.' },

    { id: 'tech-1', category: 'technical', name: 'Password Authentication Management Policy', description: 'Requirements for password management and authentication controls.' },
    { id: 'tech-2', category: 'technical', name: 'Automatic Logoff Policy', description: 'Requirements for automatic logoff after periods of inactivity.' },
    { id: 'tech-3', category: 'technical', name: 'Encryption, Decryption and Transmission Security Policy', description: 'Requirements for encrypting ePHI at rest and in transit.' },
    { id: 'tech-4', category: 'technical', name: 'Audit Controls, System Alerts and Authentication Controls Policy', description: 'Mechanisms to record and examine access to ePHI.' },
    { id: 'tech-5', category: 'technical', name: 'Data Integrity Policy', description: 'Policies protecting ePHI from improper alteration or destruction.' },
    { id: 'tech-6', category: 'technical', name: 'Antivirus, Malware and Automatic System Updates Policy', description: 'Protection from malicious software and system update requirements.' },

    { id: 'priv-1',  category: 'privacy', name: 'Acceptable Use and Restricted Internal Access to PHI Policy', description: 'Acceptable use standards and access restrictions for PHI.' },
    { id: 'priv-2',  category: 'privacy', name: 'Uses and Disclosures of PHI Policy', description: 'Permitted uses and disclosures of protected health information.' },
    { id: 'priv-3',  category: 'privacy', name: 'Minimum Necessary Policy', description: 'Requirements to limit PHI access to the minimum necessary.' },
    { id: 'priv-4',  category: 'privacy', name: 'Individual Access Rights Policy', description: 'Patient rights to access their health information.' },
    { id: 'priv-5',  category: 'privacy', name: 'Amendment of PHI Policy', description: 'Procedures for patients to request amendments to their PHI.' },
    { id: 'priv-6',  category: 'privacy', name: 'Accounting of Disclosures Policy', description: 'Requirements for tracking and reporting disclosures of PHI.' },
    { id: 'priv-7',  category: 'privacy', name: 'Restriction Requests Policy', description: 'Handling patient requests to restrict uses or disclosures of PHI.' },
    { id: 'priv-8',  category: 'privacy', name: 'Confidential Communications Policy', description: 'Requirements for confidential communications with patients.' },
    { id: 'priv-9',  category: 'privacy', name: 'Personal Representatives Policy', description: 'Handling PHI requests from personal representatives.' },
    { id: 'priv-10', category: 'privacy', name: 'Notice of Privacy Practices Policy', description: 'Requirements for the Notice of Privacy Practices.' },
    { id: 'priv-11', category: 'privacy', name: 'De-Identification and Re-Identification Policy', description: 'Standards for de-identifying and re-identifying PHI.' },
    { id: 'priv-12', category: 'privacy', name: 'Mitigation Policy', description: 'Requirements to mitigate harmful effects of improper disclosures.' },

    { id: 'breach-1', category: 'breach', name: 'Breach Notification Policy', description: 'Requirements for notifying individuals and HHS of breaches of unsecured PHI.' },

    { id: 'org-1', category: 'organizational', name: 'Documentation and Records Retention Policy', description: 'Requirements for maintaining and retaining HIPAA documentation for six years.' },
    { id: 'org-2', category: 'organizational', name: 'Complaints, Non-Retaliation, Waiver of Rights and Documentation Policy', description: 'Handling complaints and ensuring non-retaliation for reporting violations.' }
  ];

  function getApplicablePolicies(entityType) {
    if (entityType === 'ba') {
      return POLICIES.filter(p => p.category !== 'privacy');
    }
    return POLICIES;
  }

  function getApplicableCategories(entityType) {
    if (entityType === 'ba') {
      return POLICY_CATEGORIES.filter(c => !c.ceOnly);
    }
    return POLICY_CATEGORIES;
  }

  function esc(val) {
    if (!val) return '';
    return String(val).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function renderPolicyLibrary(state) {
    const el = document.getElementById('policies-content');
    if (!el) return;

    const answered = Object.keys(state.responses || {}).length;
    if (answered === 0) {
      el.innerHTML = '<div class="gaps-empty"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg><p>Complete at least one section of the Security Risk Assessment to unlock the Policy Library.</p></div>';
      return;
    }

    const entityType = (state.metadata || {}).entityType || 'ce';
    const policies = getApplicablePolicies(entityType);
    const categories = getApplicableCategories(entityType);
    const acks = state.policyAcknowledgments || {};

    const ackCount = policies.filter(p => acks[p.id] && acks[p.id].acknowledged).length;
    const totalCount = policies.length;
    const pct = totalCount > 0 ? Math.round((ackCount / totalCount) * 100) : 0;

    let h = '';

    h += '<div class="policy-progress-bar-wrap">';
    h += `<div class="policy-progress-header"><span>${ackCount} of ${totalCount} policies acknowledged</span><span class="policy-pct">${pct}%</span></div>`;
    h += `<div class="policy-progress-track"><div class="policy-progress-fill" style="width:${pct}%"></div></div>`;
    h += '</div>';

    h += '<div class="policy-filter-bar"><input type="text" id="policy-search-input" placeholder="Filter policies\u2026" class="policy-search-input"></div>';

    categories.forEach(cat => {
      const catPolicies = policies.filter(p => p.category === cat.key);
      if (catPolicies.length === 0) return;
      const catAcked = catPolicies.filter(p => acks[p.id] && acks[p.id].acknowledged).length;

      h += `<div class="policy-category-group" data-policy-cat="${cat.key}">`;
      h += `<button class="policy-category-toggle" data-toggle-cat="${cat.key}">`;
      h += `<svg class="policy-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>`;
      h += `<span class="policy-category-label">${cat.label}</span>`;
      h += `<span class="policy-category-count">${catAcked}/${catPolicies.length}</span>`;
      h += '</button>';
      h += `<div class="policy-category-body" id="policy-cat-${cat.key}">`;

      catPolicies.forEach(p => {
        const isAcked = acks[p.id] && acks[p.id].acknowledged;
        const ackDate = (acks[p.id] && acks[p.id].date) || '';
        h += `<div class="policy-card${isAcked ? ' acknowledged' : ''}" data-policy-id="${p.id}">`;
        h += '<div class="policy-card-body">';
        h += `<label class="policy-check-label"><input type="checkbox" class="policy-ack-check" data-policy="${p.id}"${isAcked ? ' checked' : ''}><span class="policy-checkmark"></span></label>`;
        h += `<div class="policy-info"><div class="policy-name">${esc(p.name)}</div><div class="policy-desc">${esc(p.description)}</div>`;
        if (ackDate) h += `<div class="policy-ack-date">Acknowledged ${ackDate}</div>`;
        h += '</div></div></div>';
      });

      h += '</div></div>';
    });

    el.innerHTML = h;

    el.querySelectorAll('.policy-category-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = btn.dataset.toggleCat;
        const body = document.getElementById('policy-cat-' + cat);
        btn.classList.toggle('open');
        body.classList.toggle('open');
      });
    });

    el.querySelectorAll('.policy-ack-check').forEach(cb => {
      cb.addEventListener('change', e => {
        const pid = e.target.dataset.policy;
        if (!state.policyAcknowledgments) state.policyAcknowledgments = {};
        if (e.target.checked) {
          state.policyAcknowledgments[pid] = { acknowledged: true, date: new Date().toISOString().slice(0, 10) };
        } else {
          delete state.policyAcknowledgments[pid];
        }
        if (typeof App !== 'undefined') App.saveState();
        renderPolicyLibrary(state);
      });
    });

    const searchInput = document.getElementById('policy-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        const q = searchInput.value.toLowerCase().trim();
        el.querySelectorAll('.policy-card').forEach(card => {
          const name = card.querySelector('.policy-name').textContent.toLowerCase();
          const desc = card.querySelector('.policy-desc').textContent.toLowerCase();
          card.style.display = (!q || name.includes(q) || desc.includes(q)) ? '' : 'none';
        });
      });
    }

    el.querySelectorAll('.policy-category-toggle').forEach(btn => btn.classList.add('open'));
    el.querySelectorAll('.policy-category-body').forEach(body => body.classList.add('open'));
  }

  function getAcknowledgmentSummary(state) {
    const entityType = (state.metadata || {}).entityType || 'ce';
    const policies = getApplicablePolicies(entityType);
    const categories = getApplicableCategories(entityType);
    const acks = state.policyAcknowledgments || {};
    const total = policies.length;
    const acked = policies.filter(p => acks[p.id] && acks[p.id].acknowledged).length;

    const byCategory = {};
    categories.forEach(cat => {
      const cp = policies.filter(p => p.category === cat.key);
      byCategory[cat.key] = {
        label: cat.label,
        total: cp.length,
        acknowledged: cp.filter(p => acks[p.id] && acks[p.id].acknowledged).length
      };
    });

    return { total, acknowledged: acked, pct: total > 0 ? Math.round((acked / total) * 100) : 0, byCategory };
  }

  return {
    POLICIES,
    POLICY_CATEGORIES,
    renderPolicyLibrary,
    getApplicablePolicies,
    getAcknowledgmentSummary
  };
})();
