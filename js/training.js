/* ============================================================
   HIPAA SRA Tool — Training Module
   5 training modules with content, completion tracking
   ============================================================ */

const TrainingModule = (() => {

  const MODULES = [
    {
      id: 'mod-1',
      title: 'HIPAA Security Rule Overview',
      duration: '30 min',
      topics: [
        { heading: 'What is HIPAA?', content: 'The Health Insurance Portability and Accountability Act (HIPAA) of 1996 establishes national standards for protecting sensitive patient health information. The Security Rule specifically addresses electronic protected health information (ePHI).' },
        { heading: 'Who Must Comply?', content: 'Covered Entities (health plans, healthcare clearinghouses, healthcare providers who transmit electronically) and their Business Associates must comply. This extends to subcontractors who handle ePHI.' },
        { heading: 'The Three Safeguard Categories', content: 'The Security Rule organizes requirements into Administrative Safeguards (management actions and policies), Physical Safeguards (physical measures to protect systems), and Technical Safeguards (technology and related policies).' },
        { heading: 'Required vs. Addressable', content: 'Implementation specifications are either "required" (must be implemented) or "addressable" (must assess whether reasonable and appropriate; if not, document why and implement an equivalent alternative).' },
        { heading: 'Penalties for Non-Compliance', content: 'Violations can result in civil penalties ranging from $100 to $50,000 per violation (up to $1.5 million per year for identical provisions). Criminal penalties can include fines up to $250,000 and imprisonment up to 10 years.' }
      ]
    },
    {
      id: 'mod-2',
      title: 'Administrative Safeguards Training',
      duration: '45 min',
      topics: [
        { heading: 'Risk Analysis and Management', content: 'Organizations must conduct an accurate and thorough assessment of potential risks and vulnerabilities to ePHI. Risk management involves implementing security measures to reduce identified risks to a reasonable level.' },
        { heading: 'Workforce Security', content: 'Implement procedures for authorization and supervision of workforce members who work with ePHI. Establish clearance procedures and termination processes to ensure access is revoked when employment ends.' },
        { heading: 'Information Access Management', content: 'Implement policies for authorizing access to ePHI consistent with the minimum necessary standard. Isolate healthcare clearinghouse functions and implement access authorization and establishment/modification policies.' },
        { heading: 'Security Awareness Training', content: 'Implement a security awareness and training program for all workforce members. Include security reminders, protection from malicious software, login monitoring, and password management.' },
        { heading: 'Contingency Planning', content: 'Establish policies for responding to emergencies that damage systems containing ePHI. Include data backup, disaster recovery, and emergency mode operation plans. Test and revise procedures regularly.' },
        { heading: 'Business Associate Management', content: 'Obtain satisfactory assurances from Business Associates that they will safeguard ePHI. Implement written contracts or arrangements meeting HIPAA requirements.' }
      ]
    },
    {
      id: 'mod-3',
      title: 'Physical Safeguards Training',
      duration: '30 min',
      topics: [
        { heading: 'Facility Access Controls', content: 'Implement policies to limit physical access to electronic information systems and facilities where they are housed, while ensuring authorized access is allowed. Include contingency operations, facility security plans, access control, and maintenance records.' },
        { heading: 'Workstation Use and Security', content: 'Implement policies specifying proper functions, physical attributes of surroundings, and manner of use for workstations. Implement physical safeguards restricting access to authorized users only.' },
        { heading: 'Device and Media Controls', content: 'Implement policies governing receipt, removal, disposal, and re-use of electronic media and hardware. Include proper disposal methods, media re-use procedures, accountability records, and data backup/storage protocols.' },
        { heading: 'Physical Security Best Practices', content: 'Position monitors away from public view. Use privacy screens in shared spaces. Lock workstations when unattended. Secure portable devices. Implement clean desk policies. Use cable locks for laptops in shared areas.' }
      ]
    },
    {
      id: 'mod-4',
      title: 'Technical Safeguards Training',
      duration: '45 min',
      topics: [
        { heading: 'Access Controls', content: 'Implement technical policies to allow access only to authorized persons. Include unique user identification, emergency access procedures, automatic logoff, and encryption/decryption of ePHI.' },
        { heading: 'Audit Controls', content: 'Implement hardware, software, and procedural mechanisms to record and examine activity in systems containing ePHI. Configure logging, retain logs for 6+ years, and review regularly.' },
        { heading: 'Integrity Controls', content: 'Implement policies to protect ePHI from improper alteration or destruction. Use mechanisms to authenticate ePHI and verify it has not been improperly modified.' },
        { heading: 'Transmission Security', content: 'Implement security measures to guard against unauthorized access to ePHI transmitted over electronic networks. Use encryption (TLS 1.2+) and integrity controls for all transmissions.' },
        { heading: 'Authentication', content: 'Implement procedures to verify that persons or entities seeking access to ePHI are who they claim to be. Use multi-factor authentication for remote access and privileged accounts.' },
        { heading: 'Encryption Best Practices', content: 'Use AES-256 for data at rest. Use TLS 1.2 or higher for data in transit. Manage encryption keys securely. Regularly audit encryption status across all systems.' }
      ]
    },
    {
      id: 'mod-5',
      title: 'Breach Notification and Incident Response',
      duration: '30 min',
      topics: [
        { heading: 'What Constitutes a Breach?', content: 'A breach is the acquisition, access, use, or disclosure of PHI in a manner not permitted by the Privacy Rule which compromises its security or privacy. There is a presumption that any impermissible use or disclosure is a breach unless a risk assessment demonstrates low probability of compromise.' },
        { heading: 'The Four-Factor Risk Assessment', content: 'When an incident occurs, assess: (1) the nature and extent of PHI involved, (2) the unauthorized person who used or received the PHI, (3) whether PHI was actually acquired or viewed, and (4) the extent to which the risk has been mitigated.' },
        { heading: 'Notification Requirements', content: 'Individual notice must be provided without unreasonable delay, no later than 60 days after discovery. If 500+ individuals affected, notify HHS and prominent media. If fewer than 500, log and report to HHS annually.' },
        { heading: 'Incident Response Steps', content: 'Follow the six phases: (1) Preparation, (2) Identification, (3) Containment, (4) Eradication, (5) Recovery, (6) Lessons Learned. Document all actions taken and preserve forensic evidence.' },
        { heading: 'Reporting Procedures', content: 'Report suspected incidents immediately to your Security Official. Do not attempt to investigate on your own. Preserve all evidence including emails, logs, and screenshots. Document what you observed and when.' }
      ]
    }
  ];

  function esc(val) {
    if (!val) return '';
    return String(val).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function renderTraining(state) {
    const el = document.getElementById('training-content');
    if (!el) return;

    const progress = state.trainingProgress || {};
    const completed = MODULES.filter(m => progress[m.id] && progress[m.id].completed).length;
    const total = MODULES.length;
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

    let h = '';

    h += '<div class="training-progress-wrap">';
    h += `<div class="policy-progress-header"><span>${completed} of ${total} modules completed</span><span class="policy-pct">${pct}%</span></div>`;
    h += `<div class="policy-progress-track"><div class="policy-progress-fill" style="width:${pct}%"></div></div>`;
    h += '</div>';

    MODULES.forEach(mod => {
      const p = progress[mod.id] || {};
      const isDone = p.completed;

      h += `<div class="training-module-card${isDone ? ' completed' : ''}">`;
      h += '<div class="training-module-header">';
      h += `<button class="training-module-toggle" data-toggle-mod="${mod.id}">`;
      h += `<svg class="policy-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>`;
      h += `<div class="training-module-title-wrap">`;
      h += `<span class="training-module-title">${esc(mod.title)}</span>`;
      h += `<span class="training-module-meta">${mod.duration}${isDone ? ' \u2022 Completed ' + (p.date || '') : ''}</span>`;
      h += '</div></button>';
      h += `<label class="training-complete-label"><input type="checkbox" class="training-complete-check" data-mod="${mod.id}"${isDone ? ' checked' : ''}><span class="training-checktext">${isDone ? 'Completed' : 'Mark Complete'}</span></label>`;
      h += '</div>';

      h += `<div class="training-module-body" id="training-mod-${mod.id}">`;
      mod.topics.forEach(t => {
        h += '<div class="training-topic">';
        h += `<h4>${esc(t.heading)}</h4>`;
        h += `<p>${esc(t.content)}</p>`;
        h += '</div>';
      });
      h += '</div></div>';
    });

    el.innerHTML = h;

    el.querySelectorAll('.training-module-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const modId = btn.dataset.toggleMod;
        const body = document.getElementById('training-mod-' + modId);
        btn.classList.toggle('open');
        body.classList.toggle('open');
      });
    });

    el.querySelectorAll('.training-complete-check').forEach(cb => {
      cb.addEventListener('change', e => {
        const modId = e.target.dataset.mod;
        if (!state.trainingProgress) state.trainingProgress = {};
        if (e.target.checked) {
          state.trainingProgress[modId] = {
            completed: true,
            date: new Date().toISOString().slice(0, 10),
            completedBy: (state.metadata || {}).assessorName || ''
          };
        } else {
          delete state.trainingProgress[modId];
        }
        if (typeof App !== 'undefined') App.saveState();
        renderTraining(state);
      });
    });
  }

  function getTrainingSummary(state) {
    const progress = state.trainingProgress || {};
    const total = MODULES.length;
    const completed = MODULES.filter(m => progress[m.id] && progress[m.id].completed).length;
    return { total, completed, pct: total > 0 ? Math.round((completed / total) * 100) : 0 };
  }

  return { MODULES, renderTraining, getTrainingSummary };
})();
