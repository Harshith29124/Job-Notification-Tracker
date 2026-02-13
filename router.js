// KodNest Premium - Job Notification Tracker Router

// Global state
let currentFilters = {
    keyword: '',
    location: '',
    mode: '',
    experience: '',
    source: '',
    sort: 'latest',
    showOnlyMatches: false
};

let currentJobModal = null;

// Preferences Schema: jobTrackerPreferences
// {
//   roleKeywords: string[],
//   preferredLocations: string[],
//   preferredMode: string[],
//   experienceLevel: string,
//   skills: string[],
//   minMatchScore: number
// }

// Initialize preferences
const defaultPrefs = {
    roleKeywords: [],
    preferredLocations: [],
    preferredMode: [],
    experienceLevel: '',
    skills: [],
    minMatchScore: 40
};

// Route definitions
const routes = {
    '/': {
        title: 'Job Notification Tracker',
        render: () => renderLandingPage()
    },
    '/dashboard': {
        title: 'Dashboard',
        render: () => renderDashboardPage()
    },
    '/saved': {
        title: 'Saved',
        render: () => renderSavedPage()
    },
    '/digest': {
        title: 'Digest',
        render: () => renderDigestPage()
    },
    '/settings': {
        title: 'Settings',
        render: () => renderSettingsPage()
    },
    '/proof': {
        title: 'Proof',
        render: () => renderProofPage()
    }
};

/**
 * Get saved preferences from localStorage
 */
function getPreferences() {
    const prefs = localStorage.getItem('jobTrackerPreferences');
    return prefs ? JSON.parse(prefs) : defaultPrefs;
}

/**
 * Save preferences to localStorage
 */
function savePreferences(prefs) {
    localStorage.setItem('jobTrackerPreferences', JSON.stringify(prefs));
}

/**
 * Check if preferences are set
 */
function arePreferencesSet() {
    const prefs = getPreferences();
    return prefs.roleKeywords.length > 0 || prefs.preferredLocations.length > 0 || prefs.skills.length > 0;
}

/**
 * Calculate match score for a job based on the exact rules
 */
function calculateMatchScore(job) {
    const prefs = getPreferences();
    let score = 0;

    const titleLower = job.title.toLowerCase();
    const descLower = job.description.toLowerCase();

    // 1. Role Keywords (+25 Title, +15 Description)
    if (prefs.roleKeywords.length > 0) {
        let keywordInTitle = false;
        let keywordInDesc = false;

        prefs.roleKeywords.forEach(kw => {
            const kwLower = kw.toLowerCase().trim();
            if (kwLower && titleLower.includes(kwLower)) keywordInTitle = true;
            if (kwLower && descLower.includes(kwLower)) keywordInDesc = true;
        });

        if (keywordInTitle) score += 25;
        if (keywordInDesc) score += 15;
    }

    // 2. Preferred Locations (+15)
    if (prefs.preferredLocations.length > 0) {
        const matchesLocation = prefs.preferredLocations.some(loc =>
            loc.toLowerCase().trim() === job.location.toLowerCase().trim()
        );
        if (matchesLocation) score += 15;
    }

    // 3. Preferred Mode (+10)
    if (prefs.preferredMode.length > 0) {
        const matchesMode = prefs.preferredMode.some(mode =>
            mode.toLowerCase().trim() === job.mode.toLowerCase().trim()
        );
        if (matchesMode) score += 10;
    }

    // 4. Experience Level (+10)
    if (prefs.experienceLevel) {
        if (prefs.experienceLevel.toLowerCase() === job.experience.toLowerCase()) {
            score += 10;
        }
    }

    // 5. Skills overlap (+15)
    if (prefs.skills.length > 0 && job.skills && job.skills.length > 0) {
        const hasOverlap = prefs.skills.some(skill =>
            job.skills.some(jobSkill => jobSkill.toLowerCase().trim() === skill.toLowerCase().trim())
        );
        if (hasOverlap) score += 15;
    }

    // 6. Recency (+5)
    if (job.postedDaysAgo <= 2) {
        score += 5;
    }

    // 7. Source LinkedIn (+5)
    if (job.source.toLowerCase() === 'linkedin') {
        score += 5;
    }

    return Math.min(score, 100);
}

/**
 * Parse salary for sorting
 */
function parseSalary(salaryStr) {
    if (!salaryStr) return 0;

    // Extract numbers from strings like "10–18 LPA" or "₹25k–₹40k/month"
    const numbers = salaryStr.match(/\d+(\.\d+)?/g);
    if (!numbers) return 0;

    const avg = numbers.reduce((a, b) => parseFloat(a) + parseFloat(b), 0) / numbers.length;

    // Handle units
    if (salaryStr.toLowerCase().includes('lpa')) {
        return avg * 100000;
    } else if (salaryStr.toLowerCase().includes('k/month') || salaryStr.toLowerCase().includes('k-')) {
        return avg * 1000 * 12;
    }

    return avg;
}

/**
 * Get filtered and sorted jobs
 */
function getFilteredJobs() {
    let filtered = jobsData.map(job => ({
        ...job,
        matchScore: calculateMatchScore(job)
    }));

    const prefs = getPreferences();

    // Apply "Show only matches" toggle
    if (currentFilters.showOnlyMatches) {
        filtered = filtered.filter(job => job.matchScore >= prefs.minMatchScore);
    }

    // Apply keyword filter (search title, company, skills)
    if (currentFilters.keyword) {
        const keyword = currentFilters.keyword.toLowerCase();
        filtered = filtered.filter(job =>
            job.title.toLowerCase().includes(keyword) ||
            job.company.toLowerCase().includes(keyword) ||
            job.skills.some(skill => skill.toLowerCase().includes(keyword))
        );
    }

    // Apply dimension filters (AND logic)
    if (currentFilters.location) {
        filtered = filtered.filter(job => job.location.toLowerCase() === currentFilters.location.toLowerCase());
    }

    if (currentFilters.mode) {
        filtered = filtered.filter(job => job.mode.toLowerCase() === currentFilters.mode.toLowerCase());
    }

    if (currentFilters.experience) {
        filtered = filtered.filter(job => job.experience.toLowerCase() === currentFilters.experience.toLowerCase());
    }

    if (currentFilters.source) {
        filtered = filtered.filter(job => job.source.toLowerCase() === currentFilters.source.toLowerCase());
    }

    // Apply sorting
    if (currentFilters.sort === 'latest') {
        filtered.sort((a, b) => a.postedDaysAgo - b.postedDaysAgo);
    } else if (currentFilters.sort === 'oldest') {
        filtered.sort((a, b) => b.postedDaysAgo - a.postedDaysAgo);
    } else if (currentFilters.sort === 'score') {
        filtered.sort((a, b) => b.matchScore - a.matchScore);
    } else if (currentFilters.sort === 'salary') {
        filtered.sort((a, b) => parseSalary(b.salaryRange) - parseSalary(a.salaryRange));
    }

    return filtered;
}

/**
 * Format posted time
 */
function formatPostedTime(daysAgo) {
    if (daysAgo === 0) return 'Today';
    if (daysAgo === 1) return '1 day ago';
    return `${daysAgo} days ago`;
}

/**
 * Check if job is saved
 */
function isJobSaved(jobId) {
    const saved = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    return saved.includes(jobId);
}

/**
 * Toggle job saved status
 */
function toggleSaveJob(jobId) {
    let saved = JSON.parse(localStorage.getItem('savedJobs') || '[]');

    if (saved.includes(jobId)) {
        saved = saved.filter(id => id !== jobId);
    } else {
        saved.push(jobId);
    }

    localStorage.setItem('savedJobs', JSON.stringify(saved));
    renderRoute();
}

/**
 * Get score badge class
 */
function getScoreBadgeClass(score) {
    if (score >= 80) return 'job-score--high';
    if (score >= 60) return 'job-score--mid';
    if (score >= 40) return 'job-score--neutral';
    return 'job-score--low';
}

/**
 * Render job card
 */
function renderJobCard(job) {
    const isSaved = isJobSaved(job.id);
    const saveIcon = isSaved ? '❤️' : '🤍';
    const scoreClass = getScoreBadgeClass(job.matchScore);
    const prefsSet = arePreferencesSet();

    return `
        <div class="job-card">
            <div class="job-card__header">
                <div class="job-card__title-section">
                    <h3 class="job-card__title">
                        ${job.title}
                        ${prefsSet ? `<span class="job-score ${scoreClass}">${job.matchScore}% Match</span>` : ''}
                    </h3>
                    <p class="job-card__company">${job.company}</p>
                </div>
                <span class="job-source job-source--${job.source.toLowerCase()}">${job.source}</span>
            </div>
            
            <div class="job-card__meta">
                <span class="job-meta__item">📍 ${job.location}</span>
                <span class="job-meta__item">💼 ${job.mode}</span>
                <span class="job-meta__item">⏱️ ${job.experience}</span>
            </div>
            
            <div class="job-card__salary">${job.salaryRange}</div>
            
            <div class="job-card__footer">
                <span class="job-card__posted">${formatPostedTime(job.postedDaysAgo)}</span>
                <div class="job-card__actions">
                    <button class="btn btn--small btn--secondary" onclick="openJobModal('${job.id}')">View</button>
                    <button class="btn btn--small ${isSaved ? 'btn--saved' : 'btn--secondary'}" onclick="toggleSaveJob('${job.id}')">
                        ${saveIcon}
                    </button>
                    <button class="btn btn--small btn--primary" onclick="window.open('${job.applyUrl}', '_blank')">Apply</button>
                </div>
            </div>
        </div>
    `;
}

/**
 * Render filter bar
 */
function renderFilterBar() {
    const locations = [...new Set(jobsData.map(j => j.location))].sort();
    const modes = [...new Set(jobsData.map(j => j.mode))].sort();
    const experiences = [...new Set(jobsData.map(j => j.experience))].sort();
    const sources = [...new Set(jobsData.map(j => j.source))].sort();

    return `
        <div class="filter-bar">
            <div class="filter-bar__search">
                <input 
                    type="text" 
                    id="filter-keyword" 
                    class="filter-input" 
                    placeholder="Search title, company, skills..."
                    value="${currentFilters.keyword}"
                >
            </div>
            
            <div class="filter-bar__filters">
                <select id="filter-location" class="filter-select">
                    <option value="">All Locations</option>
                    ${locations.map(loc => `<option value="${loc}" ${currentFilters.location === loc ? 'selected' : ''}>${loc}</option>`).join('')}
                </select>
                
                <select id="filter-mode" class="filter-select">
                    <option value="">All Modes</option>
                    ${modes.map(mode => `<option value="${mode}" ${currentFilters.mode === mode ? 'selected' : ''}>${mode}</option>`).join('')}
                </select>
                
                <select id="filter-experience" class="filter-select">
                    <option value="">All Experience</option>
                    ${experiences.map(exp => `<option value="${exp}" ${currentFilters.experience === exp ? 'selected' : ''}>${exp}</option>`).join('')}
                </select>
                
                <select id="filter-source" class="filter-select">
                    <option value="">All Sources</option>
                    ${sources.map(src => `<option value="${src}" ${currentFilters.source === src ? 'selected' : ''}>${src}</option>`).join('')}
                </select>
                
                <select id="filter-sort" class="filter-select">
                    <option value="latest" ${currentFilters.sort === 'latest' ? 'selected' : ''}>Latest</option>
                    <option value="score" ${currentFilters.sort === 'score' ? 'selected' : ''}>Match Score</option>
                    <option value="salary" ${currentFilters.sort === 'salary' ? 'selected' : ''}>Salary</option>
                    <option value="oldest" ${currentFilters.sort === 'oldest' ? 'selected' : ''}>Oldest</option>
                </select>
                
                <button class="btn btn--secondary btn--small" onclick="clearFilters()">Clear</button>
            </div>
        </div>
    `;
}

/**
 * Render landing page
 */
function renderLandingPage() {
    return `
        <div class="landing-page">
            <div class="hero">
                <h1 class="hero__title">Stop Missing The Right Jobs.</h1>
                <p class="hero__subtitle">Precision-matched job discovery delivered daily at 9AM.</p>
                <a href="#/settings" class="btn btn--primary btn--large">Start Tracking</a>
            </div>
        </div>
    `;
}

/**
 * Render dashboard page
 */
function renderDashboardPage() {
    const jobs = getFilteredJobs();
    const prefsSet = arePreferencesSet();

    return `
        <div class="page-container page-container--wide">
            <div class="page-header">
                <h1 class="page-header__title">Dashboard</h1>
                <p class="page-header__subtitle">${jobs.length} jobs matching your current filters</p>
            </div>
            
            ${!prefsSet ? `
                <div class="pref-banner">
                    <p class="pref-banner__text">Set your preferences to activate intelligent matching.</p>
                    <a href="#/settings" class="btn btn--primary btn--small">Configure Settings</a>
                </div>
            ` : ''}

            ${renderFilterBar()}

            <div class="dashboard-actions">
                <label class="toggle-container">
                    <span class="toggle-label">Show only jobs above my threshold</span>
                    <input type="checkbox" id="match-toggle" class="visually-hidden" ${currentFilters.showOnlyMatches ? 'checked' : ''}>
                    <span class="toggle-switch"></span>
                </label>
            </div>
            
            <div class="jobs-grid">
                ${jobs.length > 0
            ? jobs.map(job => renderJobCard(job)).join('')
            : `
                        <div class="empty-state">
                            <h2 class="empty-state__title">No roles match your criteria</h2>
                            <p class="empty-state__description">No roles match your criteria. Adjust filters or lower threshold.</p>
                            <button class="btn btn--secondary" onclick="clearFilters()">Clear All Filters</button>
                        </div>
                    `
        }
            </div>
        </div>
    `;
}

/**
 * Render settings page
 */
function renderSettingsPage() {
    const prefs = getPreferences();

    // Unique values for multi-select
    const locations = [...new Set(jobsData.map(j => j.location))].sort();
    const modes = ['Remote', 'Hybrid', 'Onsite'];
    const experienceLevels = [...new Set(jobsData.map(j => j.experience))].sort();

    return `
        <div class="page-container">
            <div class="page-header">
                <h1 class="page-header__title">Settings</h1>
                <p class="page-header__subtitle">Configure your job matching preferences</p>
            </div>
            
            <form class="settings-form" id="prefs-form">
                <div class="form-section">
                    <h2 class="form-section__title">Intelligent Matching</h2>
                    
                    <div class="form-group">
                        <label class="form-label">Role Keywords</label>
                        <input type="text" id="pref-keywords" class="form-input" placeholder="SDE, Frontend, React..." value="${prefs.roleKeywords.join(', ')}">
                        <span class="form-hint">Comma-separated key phrases found in job titles (+25) or descriptions (+15)</span>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Skills</label>
                        <input type="text" id="pref-skills" class="form-input" placeholder="JavaScript, AWS, Figma..." value="${prefs.skills.join(', ')}">
                        <span class="form-hint">Comma-separated skills to match against job requirements (+15)</span>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Preferred Locations</label>
                        <select id="pref-locations" class="form-select form-multi-select" multiple>
                            ${locations.map(loc => `<option value="${loc}" ${prefs.preferredLocations.includes(loc) ? 'selected' : ''}>${loc}</option>`).join('')}
                        </select>
                        <span class="form-hint">Hold Ctrl/Cmd to select multiple (+15)</span>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Preferred Work Mode</label>
                        <div class="form-check-group">
                            ${modes.map(mode => `
                                <label class="form-check">
                                    <input type="checkbox" name="pref-mode" value="${mode}" ${prefs.preferredMode.includes(mode) ? 'checked' : ''}>
                                    <span>${mode}</span>
                                </label>
                            `).join('')}
                        </div>
                        <span class="form-hint">Match any selected mode (+10)</span>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Experience Level</label>
                        <select id="pref-experience" class="form-select">
                            <option value="">Select Level</option>
                            ${experienceLevels.map(exp => `<option value="${exp}" ${prefs.experienceLevel === exp ? 'selected' : ''}>${exp}</option>`).join('')}
                        </select>
                        <span class="form-hint">Exact match on experience required (+10)</span>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Minimum Match Score Threshold: <span id="threshold-val">${prefs.minMatchScore}%</span></label>
                        <input type="range" id="pref-threshold" class="form-range" min="0" max="100" value="${prefs.minMatchScore}">
                        <div class="form-range-labels">
                            <span>Show Everything</span>
                            <span>High Quality Only</span>
                        </div>
                    </div>
                    
                    <div class="form-actions">
                        <button type="submit" class="btn btn--primary">Save Preferences</button>
                        <button type="button" class="btn btn--secondary" onclick="resetPreferences()">Reset to Default</button>
                    </div>
                </div>
            </form>
        </div>
    `;
}

/**
 * Reset preferences
 */
function resetPreferences() {
    if (confirm("Reset preferences to default?")) {
        savePreferences(defaultPrefs);
        renderRoute();
    }
}
window.resetPreferences = resetPreferences;

/**
 * Handle settings form submission
 */
function handlePrefsSubmit(e) {
    e.preventDefault();

    const keywordsVal = document.getElementById('pref-keywords').value;
    const skillsVal = document.getElementById('pref-skills').value;
    const locationsSelect = document.getElementById('pref-locations');
    const modeCheckboxes = document.querySelectorAll('input[name="pref-mode"]:checked');
    const thresholdVal = document.getElementById('pref-threshold').value;

    const newPrefs = {
        roleKeywords: keywordsVal ? keywordsVal.split(',').map(s => s.trim()).filter(s => s) : [],
        skills: skillsVal ? skillsVal.split(',').map(s => s.trim()).filter(s => s) : [],
        preferredLocations: Array.from(locationsSelect.selectedOptions).map(opt => opt.value),
        preferredMode: Array.from(modeCheckboxes).map(cb => cb.value),
        experienceLevel: document.getElementById('pref-experience').value,
        minMatchScore: parseInt(thresholdVal)
    };

    savePreferences(newPrefs);
    alert("Preferences saved successfully!");
    navigateTo('/dashboard');
}

/**
 * Render saved page
 */
function renderSavedPage() {
    const savedIds = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    const savedJobs = jobsData.filter(job => savedIds.includes(job.id)).map(job => ({
        ...job,
        matchScore: calculateMatchScore(job)
    }));

    return `
        <div class="page-container page-container--wide">
            <div class="page-header">
                <h1 class="page-header__title">Saved Jobs</h1>
                <p class="page-header__subtitle">${savedJobs.length} bookmarked roles</p>
            </div>
            
            ${savedJobs.length > 0
            ? `<div class="jobs-grid">${savedJobs.map(job => renderJobCard(job)).join('')}</div>`
            : `
                    <div class="empty-state">
                        <h2 class="empty-state__title">No saved jobs</h2>
                        <p class="empty-state__description">Jobs you bookmark will appear here for easy access.</p>
                        <a href="#/dashboard" class="btn btn--secondary">Browse Jobs</a>
                    </div>
                `
        }
        </div>
    `;
}

/**
 * Render remaining pages
 */
function renderDigestPage() {
    return `
        <div class="page-container">
            <div class="page-header">
                <h1 class="page-header__title">Daily Digest</h1>
                <p class="page-header__subtitle">Precision summary of roles matching your profile</p>
            </div>
            <div class="empty-state">
                <h2 class="empty-state__title">Digest logic coming soon</h2>
                <p class="empty-state__description">In the next phase, we'll implement the 9AM summary generator.</p>
                <a href="#/settings" class="btn btn--secondary">Refine Profile</a>
            </div>
        </div>
    `;
}

function renderProofPage() {
    return `
        <div class="page-container">
            <div class="page-header">
                <h1 class="page-header__title">Proof</h1>
                <p class="page-header__subtitle">Verification of intelligent matching engine</p>
            </div>
            <div class="proof-container">
                <div class="proof-section">
                    <h2 class="proof-section__title">Feature Checklist</h2>
                    <div class="proof-checklist">
                        <div class="proof-item"><input type="checkbox" checked disabled><span class="proof-label">Match Scoring Engine (+25 Title, +15 Desc, etc.)</span></div>
                        <div class="proof-item"><input type="checkbox" checked disabled><span class="proof-label">Persistent Preferences (localStorage)</span></div>
                        <div class="proof-item"><input type="checkbox" checked disabled><span class="proof-label">Show Only Matches Toggle</span></div>
                        <div class="proof-item"><input type="checkbox" checked disabled><span class="proof-label">Advanced Sorting (Match Score, Salary)</span></div>
                        <div class="proof-item"><input type="checkbox" checked disabled><span class="proof-label">Preference Not Set Banner</span></div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Filter handling
 */
function clearFilters() {
    currentFilters = { keyword: '', location: '', mode: '', experience: '', source: '', sort: 'latest', showOnlyMatches: false };
    renderRoute();
}
window.clearFilters = clearFilters;

/**
 * Event Listeners Initialization
 */
function initializeEventListeners() {
    const currentRoute = getCurrentRoute();

    if (currentRoute === '/dashboard') {
        const keywordInput = document.getElementById('filter-keyword');
        const locSelect = document.getElementById('filter-location');
        const modeSelect = document.getElementById('filter-mode');
        const expSelect = document.getElementById('filter-experience');
        const srcSelect = document.getElementById('filter-source');
        const sortSelect = document.getElementById('filter-sort');
        const matchToggle = document.getElementById('match-toggle');

        if (keywordInput) keywordInput.addEventListener('input', e => { currentFilters.keyword = e.target.value; renderDashboardContent(); });
        if (locSelect) locSelect.addEventListener('change', e => { currentFilters.location = e.target.value; renderDashboardContent(); });
        if (modeSelect) modeSelect.addEventListener('change', e => { currentFilters.mode = e.target.value; renderDashboardContent(); });
        if (expSelect) expSelect.addEventListener('change', e => { currentFilters.experience = e.target.value; renderDashboardContent(); });
        if (srcSelect) srcSelect.addEventListener('change', e => { currentFilters.source = e.target.value; renderDashboardContent(); });
        if (sortSelect) sortSelect.addEventListener('change', e => { currentFilters.sort = e.target.value; renderDashboardContent(); });
        if (matchToggle) matchToggle.addEventListener('change', e => { currentFilters.showOnlyMatches = e.target.checked; renderDashboardContent(); });
    }

    if (currentRoute === '/settings') {
        const form = document.getElementById('prefs-form');
        if (form) form.addEventListener('submit', handlePrefsSubmit);

        const slider = document.getElementById('pref-threshold');
        if (slider) slider.addEventListener('input', e => {
            document.getElementById('threshold-val').textContent = e.target.value + '%';
        });
    }
}

/**
 * Render dashboard content without full page reload for performance
 */
function renderDashboardContent() {
    const jobs = getFilteredJobs();
    const grid = document.querySelector('.jobs-grid');
    const subtitle = document.querySelector('.page-header__subtitle');

    if (subtitle) subtitle.textContent = `${jobs.length} jobs matching your current filters`;

    if (grid) {
        if (jobs.length > 0) {
            grid.innerHTML = jobs.map(job => renderJobCard(job)).join('');
        } else {
            grid.innerHTML = `
                <div class="empty-state">
                    <h2 class="empty-state__title">No roles match your criteria</h2>
                    <p class="empty-state__description">Try adjusting your filters or lower your match threshold in Settings.</p>
                    <button class="btn btn--secondary" onclick="clearFilters()">Clear All Filters</button>
                </div>
            `;
        }
    }
}

/**
 * Core Router Logic
 */
function getCurrentRoute() { return window.location.hash.slice(1) || '/'; }
function navigateTo(path) { window.location.hash = path; }

function updateActiveNav() {
    const route = getCurrentRoute();
    document.querySelectorAll('.top-nav__link, .top-nav__mobile-link').forEach(link => {
        link.classList.toggle('active', link.getAttribute('data-route') === route || (route === '/dashboard' && link.getAttribute('data-route') === '/'));
    });
}

function renderRoute() {
    const routePath = getCurrentRoute();
    const route = routes[routePath] || routes['/'];
    document.title = `${route.title} - KodNest Premium`;

    const content = document.getElementById('app-content');
    if (content) content.innerHTML = route.render();

    updateActiveNav();
    initializeEventListeners();
    window.scrollTo(0, 0);
}

// Global modal helpers
function openJobModal(jobId) {
    const job = jobsData.find(j => j.id === jobId);
    if (!job) return;
    const score = calculateMatchScore(job);
    const scoreClass = getScoreBadgeClass(score);
    const prefsSet = arePreferencesSet();

    const modal = document.createElement('div');
    modal.className = 'job-modal';
    modal.innerHTML = `
        <div class="job-modal__overlay" onclick="closeJobModal()"></div>
        <div class="job-modal__content">
            <button class="job-modal__close" onclick="closeJobModal()">&times;</button>
            <div class="job-modal__header">
                <h2 class="job-modal__title">
                    ${job.title}
                    ${prefsSet ? `<span class="job-score ${scoreClass}">${score}% Match</span>` : ''}
                </h2>
                <p class="job-modal__company">${job.company}</p>
            </div>
            <div class="job-modal__meta">
                <span>📍 ${job.location}</span>
                <span>💼 ${job.mode}</span>
                <span>⏱️ ${job.experience}</span>
                <span>💰 ${job.salaryRange}</span>
            </div>
            <div class="job-modal__section">
                <h3 class="job-modal__section-title">Description</h3>
                <p class="job-modal__description">${job.description}</p>
            </div>
            <div class="job-modal__section">
                <h3 class="job-modal__section-title">Required Skills</h3>
                <div class="job-skills">${job.skills.map(s => `<span class="job-skill">${s}</span>`).join('')}</div>
            </div>
            <div class="job-modal__actions">
                <button class="btn btn--primary" onclick="window.open('${job.applyUrl}', '_blank')">Apply Now</button>
                <button class="btn btn--secondary" onclick="closeJobModal()">Close</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    currentJobModal = modal;
    document.body.style.overflow = 'hidden';
}
window.openJobModal = openJobModal;

function closeJobModal() {
    if (currentJobModal) {
        document.body.removeChild(currentJobModal);
        currentJobModal = null;
        document.body.style.overflow = '';
    }
}
window.closeJobModal = closeJobModal;

// Mobile menu
function toggleMobileMenu() {
    document.querySelector('.top-nav__toggle').classList.toggle('active');
    document.querySelector('.top-nav__mobile').classList.toggle('active');
}
window.addEventListener('DOMContentLoaded', () => {
    window.addEventListener('hashchange', renderRoute);
    const toggle = document.querySelector('.top-nav__toggle');
    if (toggle) toggle.addEventListener('click', toggleMobileMenu);
    renderRoute();
});

// App init
document.addEventListener('click', e => {
    const link = e.target.closest('a[data-route]');
    if (link) { e.preventDefault(); navigateTo(link.getAttribute('data-route')); }
});
