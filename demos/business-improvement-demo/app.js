// app.js
// Static JSON produced by your Power Automate flow
const DATA_URL = './projects.json';

// Current filter state
let currentThemeFilter = 'all';
let currentStatusFilter = 'all';
let currentOriginatorFilter = 'all';
let currentSearchText = '';

// ---------- Helpers ----------

function escapeHtml(text) {
  if (text === null || text === undefined) return '';

  // First decode HTML entities
  const decoded = decodeHtmlEntities(text);

  // Escape HTML to prevent XSS
  const div = document.createElement('div');
  div.textContent = decoded;
  let escaped = div.innerHTML;

  // Convert markdown images ![alt](url) to HTML images (must be before link conversion)
  escaped = escaped.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="content-image" loading="lazy" onclick="openLightbox(\'$2\', \'$1\')">');

  // Convert markdown links [text](url) to HTML links
  escaped = escaped.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  // Convert newlines to <br>
  escaped = escaped.replace(/\n/g, '<br>');

  return escaped;
}


function getStatusClass(status) {
  const s = (status || '').toLowerCase();

  if (s.includes('complete')) return { cls: 'complete', label: 'Complete' };
  if (s.includes('beta')) return { cls: 'beta-testing', label: 'Beta Testing' };
  if (s.includes('not')) return { cls: 'not-started', label: 'Not Started' };
  return { cls: 'in-progress', label: 'In Progress' };
}

function getThemeKey(theme) {
  return (theme || 'Other')
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getOriginatorKey(originator) {
  return (originator || 'Unknown')
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}


// Impact display logic with flexible highlighting
function renderImpact(impactRaw) {
  const impact = (impactRaw || '').trim();

  // Empty impact
  if (!impact) {
    return `<p class="section-text awaiting-badge">Impact measurement in progress</p>`;
  }

  const lower = impact.toLowerCase();
  const lines = impact.split('\n');
  const firstLine = lines[0].trim();

  // Check for explicit highlight marker (!! at the start)
  const hasExplicitMarker = firstLine.startsWith('!!');
  const cleanFirstLine = hasExplicitMarker ? firstLine.substring(2).trim() : firstLine;

  // Smart pattern matching for measurable impacts:
  // - Contains numbers (digits)
  // - Contains percentages (%)
  // - Contains quantifiable words with numbers (hours, minutes, projects, students, etc.)
  const isMeasurable = cleanFirstLine.match(/\d+/) && (
    cleanFirstLine.match(/\d+\s*%/) || // percentage
    cleanFirstLine.match(/\d+.*(?:hour|minute|day|week|month|year|project|student|colleague|staff|user|course|module|report|process|task|improvement|reduction|increase|saving)/i) ||
    cleanFirstLine.match(/^\d+/) || // starts with number
    cleanFirstLine.match(/(?:saved|reduced|increased|improved|completed|documented|automated|processed).*\d+/i) // action words with numbers
  );

  // Highlight in red box if explicitly marked OR if it matches measurable pattern
  const shouldHighlight = hasExplicitMarker || isMeasurable;

  if (shouldHighlight && !lower.includes('awaiting') && !lower.includes('to be quantified')) {
    const description = lines.slice(1).join(' ').trim() || '';
    return `
      <div class="impact-highlight">
        <span class="impact-number">${escapeHtml(cleanFirstLine)}</span>
        ${description ? `<span class="impact-description">${escapeHtml(description)}</span>` : ''}
      </div>`;
  }

  // Check if there are multiple lines
  const allLines = impact.split('\n').map(line => line.trim()).filter(line => line);

  if (allLines.length > 1) {
    // Multi-line impacts get bullet points
    return `<ul class="impact-list">${allLines.map(line => `<li>${escapeHtml(line)}</li>`).join('')}</ul>`;
  } else {
    // Single line impacts get badge treatment
    return `<p class="section-text awaiting-badge">${escapeHtml(impact)}</p>`;
  }
}


function decodeHtmlEntities(str) {
  if (str === null || str === undefined) return '';
  const txt = document.createElement('textarea');
  txt.innerHTML = String(str);
  return txt.value;
}


// ---------- Rendering ----------
function generateCaseCard(project) {
  const statusInfo = getStatusClass(project.status);
  const themeKey = getThemeKey(project.theme);
  const originatorKey = getOriginatorKey(project.originator);

  const challenge = (project.challenge || '').trim();
  const solution = (project.solution || '').trim();
  const notes = (project.developmentNotes || '').trim();
  const visuals = (project.visuals || '').trim();

  // Create searchable text (plain text only, lowercase, for efficient searching)
  const searchableText = [
    project.name || '',
    project.theme || '',
    project.originator || '',
    project.challenge || '',
    project.solution || '',
    project.impact || '',
    project.developmentNotes || ''
  ].join(' ').toLowerCase();

  // Escape for HTML attribute (but don't convert markdown to HTML)
  const searchableAttr = searchableText.replace(/"/g, '&quot;').replace(/'/g, '&#39;');

  return `
    <article class="case-card status-${statusInfo.cls}" data-theme="${themeKey}" data-status="${statusInfo.cls}" data-originator="${originatorKey}" data-searchable="${searchableAttr}">
      <div class="case-header" role="button" aria-label="Expand project">
        <div class="case-header-left">
          <div class="case-meta">
            <span class="case-area theme-${themeKey}">${escapeHtml(project.theme || '')}</span>
            <span class="case-originator originator-${originatorKey}">${escapeHtml(project.originator || '')}</span>
            <span class="case-status ${statusInfo.cls}">
              <span class="status-indicator"></span> ${statusInfo.label}
            </span>
          </div>
          <h2 class="case-title">${escapeHtml(project.name || '')}</h2>
        </div>
        <button class="case-toggle" aria-label="Expand project">
          <svg viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6"/></svg>
        </button>
      </div>

      <div class="case-content">
        <div class="case-body">

          <div class="case-section">
            <div class="section-label label-challenge">The Challenge</div>
            <p class="section-text">${challenge ? escapeHtml(challenge) : '<em>Not added yet</em>'}</p>
          </div>

          <div class="case-section">
            <div class="section-label label-solution">The Solution</div>
            <p class="section-text">${solution ? escapeHtml(solution) : '<em>Not added yet</em>'}</p>
          </div>

          <div class="case-section">
            <div class="section-label label-impact">The Impact</div>
            ${renderImpact(project.impact)}
          </div>

          <div class="case-section">
            <div class="section-label label-notes">Development notes</div>
            <p class="section-text">${notes ? escapeHtml(notes) : '<em>No notes yet</em>'}</p>
          </div>

          ${visuals ? `
          <div class="case-section">
            <div class="section-label label-visuals">Visuals</div>
            <div class="section-text">${escapeHtml(visuals)}</div>
          </div>
          ` : ''}

        </div>
      </div>
    </article>
  `;
}

// ---------- Filters ----------
function applyFilters() {
  document.querySelectorAll('.case-card').forEach(card => {
    const theme = card.dataset.theme;
    const status = card.dataset.status;
    const originator = card.dataset.originator;

    const matchesTheme = currentThemeFilter === 'all' || theme === currentThemeFilter;
    const matchesStatus = currentStatusFilter === 'all' || status === currentStatusFilter;
    const matchesOriginator = currentOriginatorFilter === 'all' || originator === currentOriginatorFilter;

    // Search matching - search across name, challenge, solution, impact, notes
    let matchesSearch = true;
    if (currentSearchText) {
      const searchLower = currentSearchText.toLowerCase();
      const searchableText = card.dataset.searchable || '';
      matchesSearch = searchableText.includes(searchLower);
    }

    if (matchesTheme && matchesStatus && matchesOriginator && matchesSearch) {
      card.classList.remove('hidden');
    } else {
      card.classList.add('hidden');
    }
  });

  // Update count of visible cards
  updateVisibleCount();
}

function updateVisibleCount() {
  const visibleCount = document.querySelectorAll('.case-card:not(.hidden)').length;
  const totalCount = document.querySelectorAll('.case-card').length;

  // Show search results count if searching
  const searchInput = document.getElementById('search-input');
  if (currentSearchText && searchInput) {
    searchInput.setAttribute('placeholder', `${visibleCount} of ${totalCount} projects`);
  } else if (searchInput) {
    searchInput.setAttribute('placeholder', 'Search by keyword...');
  }
}

function setupFilters() {
  document.querySelectorAll('#theme-filter button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#theme-filter button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentThemeFilter = btn.dataset.filter;
      applyFilters();
    });
  });

  document.querySelectorAll('#status-filter button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#status-filter button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentStatusFilter = btn.dataset.status;
      applyFilters();
    });
  });

  document.querySelectorAll('#originator-filter button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#originator-filter button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentOriginatorFilter = btn.dataset.originator;
      applyFilters();
    });
  });

  // Search input
  const searchInput = document.getElementById('search-input');
  const searchClear = document.getElementById('search-clear');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearchText = e.target.value.trim();
      searchClear.style.display = currentSearchText ? 'block' : 'none';
      applyFilters();
    });
  }

  if (searchClear) {
    searchClear.addEventListener('click', () => {
      searchInput.value = '';
      currentSearchText = '';
      searchClear.style.display = 'none';
      applyFilters();
    });
  }
}

function setupCardToggles() {
  document.querySelectorAll('.case-header').forEach(header => {
    header.addEventListener('click', (e) => {
      // Let clicking the toggle button also work, but avoid double toggling
      if (e.target.closest('.case-toggle') || e.currentTarget === header) {
        const card = header.closest('.case-card');
        card.classList.toggle('expanded');
      }
    });
  });
}

// ---------- Main ----------
async function loadData() {
  try {
    const response = await fetch(DATA_URL, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Failed to fetch data (${response.status})`);

    
    const payload = await response.json();

    const projects =
    Array.isArray(payload?.projects) ? payload.projects :
    Array.isArray(payload?.projects?.body) ? payload.projects.body :
    Array.isArray(payload?.body) ? payload.body :
    [];

    if (!projects.length) {
    console.warn('No projects found. JSON keys available:', Object.keys(payload || {}), payload);
    }

    // Optional: show lastUpdated
    if (payload.lastUpdated) {
      const el = document.getElementById('last-updated');
      if (el) el.textContent = `Last updated: ${payload.lastUpdated}`;
    }

    // Stats
    const total = projects.length;
    const completeCount = projects.filter(p => getStatusClass(p.status).cls === 'complete').length;
    const betaCount = projects.filter(p => getStatusClass(p.status).cls === 'beta-testing').length;
    const inProgressCount = projects.filter(p => getStatusClass(p.status).cls === 'in-progress').length;
    const notStartedCount = projects.filter(p => getStatusClass(p.status).cls === 'not-started').length;

    const themeCounts = {};
    projects.forEach(p => {
      const key = getThemeKey(p.theme);
      themeCounts[key] = (themeCounts[key] || 0) + 1;
    });

    const originatorCounts = {};
    projects.forEach(p => {
      const key = getOriginatorKey(p.originator);
      originatorCounts[key] = (originatorCounts[key] || 0) + 1;
    });

    // Update stats DOM
    document.getElementById('stat-total').textContent = total;
    document.getElementById('stat-complete').textContent = completeCount;
    document.getElementById('stat-beta').textContent = betaCount;
    document.getElementById('stat-progress').textContent = inProgressCount;
    document.getElementById('stat-not-started').textContent = notStartedCount;
    document.getElementById('stat-themes').textContent = Object.keys(themeCounts).length;
    document.getElementById('count-all').textContent = total;
    document.getElementById('count-all-originators').textContent = total;

    // Build Theme filter buttons (sorted by count desc)
    const themeFilter = document.getElementById('theme-filter');

    // Remove any old theme buttons except the first "All projects"
    themeFilter.querySelectorAll('li').forEach((li, idx) => {
      if (idx > 0) li.remove();
    });

    const sortedThemes = Object.entries(themeCounts).sort((a, b) => b[1] - a[1]);
    sortedThemes.forEach(([key, count]) => {
      const display = (projects.find(p => getThemeKey(p.theme) === key)?.theme) || key;
      const li = document.createElement('li');
      li.innerHTML = `<button data-filter="${key}">${escapeHtml(display)} <span class="filter-count">${count}</span></button>`;
      themeFilter.appendChild(li);
    });

    // Build Originator filter buttons (sorted by count desc)
    const originatorFilter = document.getElementById('originator-filter');

    // Remove any old originator buttons except the first "All originators"
    originatorFilter.querySelectorAll('li').forEach((li, idx) => {
      if (idx > 0) li.remove();
    });

    const sortedOriginators = Object.entries(originatorCounts).sort((a, b) => b[1] - a[1]);
    sortedOriginators.forEach(([key, count]) => {
      const display = (projects.find(p => getOriginatorKey(p.originator) === key)?.originator) || key;
      const li = document.createElement('li');
      li.innerHTML = `<button data-originator="${key}">${escapeHtml(display)} <span class="filter-count">${count}</span></button>`;
      originatorFilter.appendChild(li);
    });

    // Render cards
    const casesList = document.getElementById('cases-list');
    casesList.innerHTML = projects.map(p => generateCaseCard(p)).join('');

    // Wire up interactions
    setupFilters();
    setupCardToggles();

    // Expand first card
    const firstCard = document.querySelector('.case-card');
    if (firstCard) firstCard.classList.add('expanded');

    // Animate cards in
    document.querySelectorAll('.case-card').forEach((card, index) => {
      setTimeout(() => card.classList.add('loaded'), index * 30);
    });

  } catch (error) {
    console.error('Error loading data:', error);
    document.getElementById('cases-list').innerHTML = `
      <div class="error-message">
        <p>Unable to load projects. Please try refreshing the page.</p>
        <p style="font-size: 0.85rem; margin-top: 1rem; color: var(--grey-mid);">Error: ${escapeHtml(error.message)}</p>
      </div>
    `;
  }
}

// ---------- Lightbox ----------
function openLightbox(src, alt) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');

  lightboxImg.src = src;
  lightboxCaption.textContent = alt;
  lightbox.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  lightbox.style.display = 'none';
  document.body.style.overflow = 'auto';
}

document.addEventListener('DOMContentLoaded', loadData);