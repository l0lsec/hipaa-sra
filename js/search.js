/* ============================================================
   HIPAA SRA Tool — Search
   Debounced search across controls, policies, training
   ============================================================ */

const SearchModule = (() => {

  let debounceTimer = null;

  function buildIndex() {
    const items = [];

    CONTROLS.forEach(c => {
      const cat = CATEGORIES.find(x => x.key === c.cat);
      items.push({
        type: 'control',
        id: c.id,
        tab: c.cat,
        title: c.id + ' — ' + (c.text.length > 80 ? c.text.substring(0, 80) + '\u2026' : c.text),
        searchText: [c.id, c.text, c.ref, c.guidance, c.remediation].join(' ').toLowerCase(),
        category: cat ? cat.label : c.cat
      });
    });

    if (typeof PolicyModule !== 'undefined') {
      PolicyModule.POLICIES.forEach(p => {
        items.push({
          type: 'policy',
          id: p.id,
          tab: 'policies',
          title: p.name,
          searchText: [p.name, p.description, p.category].join(' ').toLowerCase(),
          category: 'Policy Library'
        });
      });
    }

    if (typeof TrainingModule !== 'undefined') {
      TrainingModule.MODULES.forEach(m => {
        const topicText = m.topics.map(t => t.heading + ' ' + t.content).join(' ');
        items.push({
          type: 'training',
          id: m.id,
          tab: 'training',
          title: m.title,
          searchText: [m.title, topicText].join(' ').toLowerCase(),
          category: 'Training'
        });
      });
    }

    return items;
  }

  function esc(val) {
    if (!val) return '';
    return String(val).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function initSearch(switchTabFn) {
    const input = document.getElementById('sidebar-search');
    const results = document.getElementById('search-results');
    if (!input || !results) return;

    const index = buildIndex();

    input.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const q = input.value.toLowerCase().trim();
        if (!q || q.length < 2) {
          results.classList.remove('open');
          results.innerHTML = '';
          return;
        }

        const matches = index.filter(item => item.searchText.includes(q)).slice(0, 15);

        if (matches.length === 0) {
          results.innerHTML = '<div class="search-no-results">No results found</div>';
          results.classList.add('open');
          return;
        }

        const grouped = {};
        matches.forEach(m => {
          if (!grouped[m.type]) grouped[m.type] = [];
          grouped[m.type].push(m);
        });

        const typeLabels = { control: 'Controls', policy: 'Policies', training: 'Training' };
        let h = '';
        Object.keys(grouped).forEach(type => {
          h += `<div class="search-group-label">${typeLabels[type] || type}</div>`;
          grouped[type].forEach(item => {
            h += `<button class="search-result-item" data-search-tab="${item.tab}" data-search-id="${item.id}" data-search-type="${item.type}">`;
            h += `<span class="search-result-title">${esc(item.title)}</span>`;
            h += `<span class="search-result-cat">${esc(item.category)}</span>`;
            h += '</button>';
          });
        });

        results.innerHTML = h;
        results.classList.add('open');

        results.querySelectorAll('.search-result-item').forEach(btn => {
          btn.addEventListener('click', () => {
            const tab = btn.dataset.searchTab;
            const id = btn.dataset.searchId;
            if (switchTabFn) switchTabFn(tab);

            results.classList.remove('open');
            input.value = '';

            setTimeout(() => {
              const target = document.querySelector(`[data-control="${id}"], [data-policy-id="${id}"], [data-toggle-mod="${id}"]`);
              if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                target.classList.add('search-highlight');
                setTimeout(() => target.classList.remove('search-highlight'), 2000);
              }
            }, 200);
          });
        });
      }, 300);
    });

    input.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        results.classList.remove('open');
        input.value = '';
        input.blur();
      }
    });

    document.addEventListener('click', e => {
      if (!e.target.closest('.sidebar-search-wrap')) {
        results.classList.remove('open');
      }
    });
  }

  return { initSearch };
})();
