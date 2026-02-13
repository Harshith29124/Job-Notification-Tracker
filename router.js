// KodNest Premium - Job Notification Tracker Router

// Global state
let currentFilters = {
    keyword: '',
    location: '',
    mode: '',
    experience: '',
    source: '',
    sort: 'latest',
    showOnlyMatches: false,
    status: ''
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

// Test Checklist Definition
const testItems = [
    { id: 't1', label: 'Preferences persist after refresh', hint: 'Change settings, refresh, and confirm they remain.' },
    { id: 't2', label: 'Match score calculates correctly', hint: 'Verify weightings (+25 Title, +15 Desc, etc.) are applied.' },
    { id: 't3', label: '"Show only matches" toggle works', hint: 'Enable toggle on dashboard and check if low scores disappear.' },
    { id: 't4', label: 'Save job persists after refresh', hint: 'Save a job, refresh, and find it still saved in Dashboard and Saved pages.' },
    { id: 't5', label: 'Apply opens in new tab', hint: 'Click Apply on any card and confirm a new window opens.' },
    { id: 't6', label: 'Status update persists after refresh', hint: 'Change a job to "Applied", refresh, and confirm it stays blue.' },
    { id: 't7', label: 'Status filter works correctly', hint: 'Select "Applied" in the filter dropdown and verify only those show.' },
    { id: 't8', label: 'Digest generates top 10 by score', hint: 'Generate digest and confirm the highest % matches are at the top.' },
    { id: 't9', label: 'Digest persists for the day', hint: 'Generate digest, refresh, and confirm it doesn\'t ask to regenerate.' },
    { id: 't10', label: 'No console errors on main pages', hint: 'Check the browser console (F12) for any red error text.' }
];

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
    },
    '/jt/07-test': {
        title: 'Testing Checklist',
        render: () => renderTestingPage()
    },
    '/jt/08-ship': {
        title: 'Ship Application',
        render: () => renderShipPage()
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
 * Job Status Management
 */
function getJobStatus(jobId) {
    const statuses = JSON.parse(localStorage.getItem('jobTrackerStatus') || '{}');
    return statuses[jobId] || 'Not Applied';
}

function setJobStatus(jobId, status) {
    const statuses = JSON.parse(localStorage.getItem('jobTrackerStatus') || '{}');
    statuses[jobId] = status;
    localStorage.setItem('jobTrackerStatus', JSON.stringify(statuses));

    const job = jobsData.find(j => j.id === jobId);
    if (job) {
        showToast(`Status updated: ${status}`);
        saveUpdateHistory(job, status);
    }

    renderRoute();
}
window.setJobStatus = setJobStatus;

function saveUpdateHistory(job, status) {
    if (status === 'Not Applied') return;

    const history = JSON.parse(localStorage.getItem('jobUpdateHistory') || '[]');
    history.unshift({
        jobId: job.id,
        title: job.title,
        company: job.company,
        status: status,
        date: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    });

    localStorage.setItem('jobUpdateHistory', JSON.stringify(history.slice(0, 5)));
}

/**
 * Show toast notification
 */
function showToast(message) {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
        if (container && container.contains(toast)) container.removeChild(toast);
    }, 3000);
}

/**
 * Test Management Logic
 */
function getTestsPassed() {
    return JSON.parse(localStorage.getItem('jobTrackerTests') || '[]');
}

function setTestStatus(id, checked) {
    let passed = getTestsPassed();
    if (checked) {
        if (!passed.includes(id)) passed.push(id);
    } else {
        passed = passed.filter(t => t !== id);
    }
    localStorage.setItem('jobTrackerTests', JSON.stringify(passed));
    renderRoute();
}
window.setTestStatus = setTestStatus;

function resetTestStatus() {
    if (confirm("Reset all test progress?")) {
        localStorage.removeItem('jobTrackerTests');
        renderRoute();
    }
}
window.resetTestStatus = resetTestStatus;

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
    const numbers = salaryStr.match(/\d+(\.\d+)?/g);
    if (!numbers) return 0;
    const avg = numbers.reduce((a, b) => parseFloat(a) + parseFloat(b), 0) / numbers.length;
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
        matchScore: calculateMatchScore(job),
        status: getJobStatus(job.id)
    }));

    const prefs = getPreferences();

    if (currentFilters.showOnlyMatches) {
        filtered = filtered.filter(job => job.matchScore >= prefs.minMatchScore);
    }

    if (currentFilters.status) {
        filtered = filtered.filter(job => job.status === currentFilters.status);
    }

    if (currentFilters.keyword) {
        const keyword = currentFilters.keyword.toLowerCase();
        filtered = filtered.filter(job =>
            job.title.toLowerCase().includes(keyword) ||
            job.company.toLowerCase().includes(keyword) ||
            job.skills.some(skill => skill.toLowerCase().includes(keyword))
        );
    }

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
    const status = getJobStatus(job.id);
    const statusClass = `status-badge--${status.toLowerCase().replace(' ', '-')}`;

    return `
        <div class="job-card">
            <div class="job-card__header">
                <div class="job-card__title-section">
                    <h3 class="job-card__title">
                        ${job.title}
                        <span class="status-badge ${statusClass}">${status}</span>
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
            
            <div class="status-selector">
                <button class="status-btn ${status === 'Not Applied' ? 'active' : ''}" onclick="setJobStatus('${job.id}', 'Not Applied')">Not Applied</button>
                <button class="status-btn ${status === 'Applied' ? 'active' : ''}" onclick="setJobStatus('${job.id}', 'Applied')">Applied</button>
                <button class="status-btn ${status === 'Rejected' ? 'active' : ''}" onclick="setJobStatus('${job.id}', 'Rejected')">Rejected</button>
                <button class="status-btn ${status === 'Selected' ? 'active' : ''}" onclick="setJobStatus('${job.id}', 'Selected')">Selected</button>
            </div>
            
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
    const statuses = ['Not Applied', 'Applied', 'Rejected', 'Selected'];

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

                <select id="filter-status" class="filter-select">
                    <option value="">All Statuses</option>
                    ${statuses.map(st => `<option value="${st}" ${currentFilters.status === st ? 'selected' : ''}>${st}</option>`).join('')}
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
                            <p class="empty-state__description">Adjust filters or lower threshold.</p>
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
        matchScore: calculateMatchScore(job),
        status: getJobStatus(job.id)
    }));
    return `
        <div class="page-container page-container--wide">
            <div class="page-header">
                <h1 class="page-header__title">Saved Jobs</h1>
                <p class="page-header__subtitle">${savedJobs.length} bookmarked roles</p>
            </div>
            ${savedJobs.length > 0
            ? `<div class="jobs-grid">${savedJobs.map(job => renderJobCard(job)).join('')}</div>`
            : `<div class="empty-state"><h2 class="empty-state__title">No saved jobs</h2><p class="empty-state__description">Bookmark jobs to see them here.</p><a href="#/dashboard" class="btn btn--secondary">Browse Jobs</a></div>`
        }
        </div>
    `;
}

/**
 * Render digest page
 */
function renderDigestPage() {
    const prefsSet = arePreferencesSet();
    if (!prefsSet) {
        return `<div class="page-container"><div class="page-header"><h1 class="page-header__title">Daily Digest</h1></div><div class="empty-state"><h2 class="empty-state__title">Preferences Required</h2><a href="#/settings" class="btn btn--primary">Configure Settings</a></div></div>`;
    }
    const today = new Date().toISOString().split('T')[0];
    const digestKey = `jobTrackerDigest_${today}`;
    const storedDigest = localStorage.getItem(digestKey);
    const digestJobs = storedDigest ? JSON.parse(storedDigest) : null;
    const history = JSON.parse(localStorage.getItem('jobUpdateHistory') || '[]');

    return `
        <div class="page-container page-container--wide">
            <div class="page-header"><h1 class="page-header__title">Daily Digest</h1></div>
            <div class="digest-container">
                ${!digestJobs ? `
                    <div class="empty-state"><h2>Today's Digest Ready</h2><button class="btn btn--primary" onclick="generateTodayDigest()">Generate Digest</button></div>
                ` : `
                    <div class="digest-actions-top"><button class="btn btn--secondary btn--small" onclick="copyDigestToClipboard()">Copy</button><button class="btn btn--secondary btn--small" onclick="createEmailDraft()">Email</button></div>
                    <div class="newsletter">
                        <div class="newsletter__header"><h2 class="newsletter__title">Top 10 Jobs For You</h2></div>
                        <div class="newsletter__content">${digestJobs.map(job => `<div class="newsletter__item"><div><h3 class="newsletter__job-title">${job.title}</h3><p>${job.company} • ${job.location} • ${job.matchScore}% Match</p></div><button class="btn btn--small btn--primary" onclick="window.open('${job.applyUrl}', '_blank')">Apply</button></div>`).join('')}</div>
                    </div>
                `}
                ${history.length > 0 ? `
                    <div class="updates-section"><h2>Recent Status Updates</h2><ul class="update-list">${history.map(u => `<li class="update-item"><div><strong>${u.title} @ ${u.company}</strong><br>${u.status} on ${u.date}</div></li>`).join('')}</ul></div>
                ` : ''}
            </div>
        </div>
    `;
}

function getScoreColor(score) { return score >= 80 ? '#1E8E3E' : (score >= 60 ? '#F9AB00' : '#5F6368'); }

function generateTodayDigest() {
    const jobs = jobsData.map(job => ({ ...job, matchScore: calculateMatchScore(job) }));
    const digestJobs = jobs.sort((a, b) => (b.matchScore - a.matchScore) || (a.postedDaysAgo - b.postedDaysAgo)).slice(0, 10);
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(`jobTrackerDigest_${today}`, JSON.stringify(digestJobs));
    renderRoute();
}
window.generateTodayDigest = generateTodayDigest;

function copyDigestToClipboard() {
    const today = new Date().toISOString().split('T')[0];
    const digestJobs = JSON.parse(localStorage.getItem(`jobTrackerDigest_${today}`) || '[]');
    let text = "Top 10 Jobs:\n" + digestJobs.map((j, i) => `${i + 1}. ${j.title} @ ${j.company} (${j.matchScore}%)`).join('\n');
    navigator.clipboard.writeText(text).then(() => alert("Copied!"));
}
window.copyDigestToClipboard = copyDigestToClipboard;

function createEmailDraft() {
    const today = new Date().toISOString().split('T')[0];
    const digestJobs = JSON.parse(localStorage.getItem(`jobTrackerDigest_${today}`) || '[]');
    const body = "Top Jobs:\n" + digestJobs.map(j => `- ${j.title} @ ${j.company}`).join('\n');
    window.location.href = `mailto:?subject=Job Digest&body=${encodeURIComponent(body)}`;
}
window.createEmailDraft = createEmailDraft;

/**
 * Testing & Ship Routes
 */
function renderTestingPage() {
    const passed = getTestsPassed();
    const score = passed.length;

    return `
        <div class="page-container">
            <div class="page-header">
                <h1 class="page-header__title">Internal Quality Review</h1>
                <p class="page-header__subtitle">Verification checklist for the matching engine and status tracker.</p>
            </div>
            
            <div class="test-container">
                <div class="test-progress">
                    <div class="test-progress__score">Tests Passed: ${score} / 10</div>
                    ${score < 10
            ? `<div class="test-progress__warning">Resolve all issues before shipping.</div>`
            : `<div class="test-progress__success">Quality standards met. Ready for deployment.</div>`
        }
                </div>

                <div class="test-checklist">
                    ${testItems.map(item => `
                        <div class="test-item">
                            <input type="checkbox" id="${item.id}" class="test-item__checkbox" ${passed.includes(item.id) ? 'checked' : ''} onchange="setTestStatus('${item.id}', this.checked)">
                            <div class="test-item__info">
                                <label for="${item.id}" class="test-item__label">${item.label}</label>
                                <span class="test-item__tooltip">${item.hint}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div class="form-actions" style="margin-top: 32px; justify-content: center;">
                    <button class="btn btn--secondary" onclick="resetTestStatus()">Reset Test Status</button>
                    <a href="#/jt/08-ship" class="btn btn--primary">Proceed to Ship</a>
                </div>
            </div>
        </div>
    `;
}

function renderShipPage() {
    const passedCount = getTestsPassed().length;

    if (passedCount < 10) {
        return `
            <div class="page-container">
                <div class="ship-lock">
                    <div class="ship-lock__icon">🔒</div>
                    <h1 class="ship-lock__title">Ship Route Locked</h1>
                    <p class="ship-lock__text">You must pass all 10 quality checks before this route becomes accessible. Please complete the testing checklist.</p>
                    <a href="#/jt/07-test" class="btn btn--primary">Back to Testing</a>
                </div>
            </div>
        `;
    }

    return `
        <div class="page-container">
            <div class="page-header">
                <h1 class="page-header__title">Ship Application</h1>
                <p class="page-header__subtitle">Deployment and handover verification.</p>
            </div>
            <div class="empty-state">
                <div style="font-size: 48px; margin-bottom: 24px;">🚀</div>
                <h2 class="empty-state__title">Application Ready for Ship</h2>
                <p class="empty-state__description">All 10 internal quality checks have passed. You are cleared for final deployment.</p>
                <button class="btn btn--primary" onclick="alert('Deployment sequence complete!')">Launch Application</button>
            </div>
        </div>
    `;
}

function renderProofPage() {
    return `<div class="page-container"><div class="page-header"><h1 class="page-header__title">Proof</h1></div><div class="proof-checklist">Check internal routes /jt/07-test and /jt/08-ship for verification.</div></div>`;
}

/**
 * Filtering and UI Helpers
 */
function clearFilters() {
    currentFilters = { keyword: '', location: '', mode: '', experience: '', source: '', sort: 'latest', showOnlyMatches: false, status: '' };
    renderRoute();
}
window.clearFilters = clearFilters;

function initializeEventListeners() {
    const currentRoute = getCurrentRoute();
    if (currentRoute === '/dashboard') {
        const ids = ['filter-keyword', 'filter-location', 'filter-mode', 'filter-experience', 'filter-source', 'filter-status', 'filter-sort'];
        ids.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.addEventListener(id === 'filter-keyword' ? 'input' : 'change', e => {
                const key = id.replace('filter-', '');
                currentFilters[key] = e.target.value;
                renderDashboardContent();
            });
        });
        const matchToggle = document.getElementById('match-toggle');
        if (matchToggle) matchToggle.addEventListener('change', e => {
            currentFilters.showOnlyMatches = e.target.checked;
            renderDashboardContent();
        });
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

function renderDashboardContent() {
    const jobs = getFilteredJobs();
    const grid = document.querySelector('.jobs-grid');
    const subtitle = document.querySelector('.page-header__subtitle');
    if (subtitle) subtitle.textContent = `${jobs.length} jobs matching your filters`;
    if (grid) grid.innerHTML = jobs.length > 0 ? jobs.map(j => renderJobCard(j)).join('') : `<div class="empty-state"><h2>No matches</h2><button class="btn btn--secondary" onclick="clearFilters()">Clear</button></div>`;
}

function getCurrentRoute() { return window.location.hash.slice(1) || '/'; }
function navigateTo(path) { window.location.hash = path; }

function updateActiveNav() {
    const route = getCurrentRoute();
    document.querySelectorAll('.top-nav__link, .top-nav__mobile-link').forEach(link => {
        link.classList.toggle('active', link.getAttribute('data-route') === route);
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

function openJobModal(jobId) {
    const job = jobsData.find(j => j.id === jobId);
    if (!job) return;
    const score = calculateMatchScore(job);
    const scoreClass = getScoreBadgeClass(score);
    const modal = document.createElement('div');
    modal.className = 'job-modal';
    modal.innerHTML = `<div class="job-modal__overlay" onclick="closeJobModal()"></div><div class="job-modal__content"><button class="job-modal__close" onclick="closeJobModal()">&times;</button><div class="job-modal__header"><h2>${job.title} <span class="job-score ${scoreClass}">${score}%</span></h2><p>${job.company}</p></div><div class="job-modal__meta"><span>📍 ${job.location}</span><span>💼 ${job.mode}</span><span>💰 ${job.salaryRange}</span></div><div class="job-modal__section"><h3>Description</h3><p>${job.description}</p></div><div class="job-modal__actions"><button class="btn btn--primary" onclick="window.open('${job.applyUrl}', '_blank')">Apply</button></div></div>`;
    document.body.appendChild(modal);
    currentJobModal = modal;
    document.body.style.overflow = 'hidden';
}
window.openJobModal = openJobModal;

function closeJobModal() {
    if (currentJobModal) { document.body.removeChild(currentJobModal); currentJobModal = null; document.body.style.overflow = ''; }
}
window.closeJobModal = closeJobModal;

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

document.addEventListener('click', e => {
    const link = e.target.closest('a[data-route]');
    if (link) { e.preventDefault(); navigateTo(link.getAttribute('data-route')); }
});
