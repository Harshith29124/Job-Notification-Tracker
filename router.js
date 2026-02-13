// KodNest Premium - Job Notification Tracker Router

/**
 * Global Configuration & State
 */
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

const defaultPrefs = {
    roleKeywords: [],
    preferredLocations: [],
    preferredMode: [],
    experienceLevel: '',
    skills: [],
    minMatchScore: 40
};

const routes = {
    '/': { title: 'Job Notification Tracker', render: () => renderLandingPage() },
    '/dashboard': { title: 'Dashboard', render: () => renderDashboardPage() },
    '/saved': { title: 'Saved', render: () => renderSavedPage() },
    '/digest': { title: 'Digest', render: () => renderDigestPage() },
    '/settings': { title: 'Settings', render: () => renderSettingsPage() },
    '/jt/07-test': { title: 'Testing Checklist', render: () => renderTestingPage() },
    '/jt/08-ship': { title: 'Ship Application', render: () => renderShipPage() },
    '/jt/proof': { title: 'Proof & Submission', render: () => renderProofPage() }
};

/**
 * Storage Helpers
 */
function getPreferences() {
    const prefs = localStorage.getItem('jobTrackerPreferences');
    return prefs ? JSON.parse(prefs) : defaultPrefs;
}

function savePreferences(prefs) {
    localStorage.setItem('jobTrackerPreferences', JSON.stringify(prefs));
}

function arePreferencesSet() {
    const prefs = getPreferences();
    return prefs.roleKeywords.length > 0 || prefs.preferredLocations.length > 0 || prefs.skills.length > 0;
}

function getJobStatus(jobId) {
    const statuses = JSON.parse(localStorage.getItem('jobTrackerStatus') || '{}');
    return statuses[jobId] || 'Not Applied';
}

function setJobStatus(jobId, status) {
    const statuses = JSON.parse(localStorage.getItem('jobTrackerStatus') || '{}');
    statuses[jobId] = status;
    localStorage.setItem('jobTrackerStatus', JSON.stringify(statuses));
    const job = jobsData.find(j => j.id === jobId);
    if (job) { showToast(`Status updated: ${status}`); saveUpdateHistory(job, status); }
    renderRoute();
}
window.setJobStatus = setJobStatus;

function saveUpdateHistory(job, status) {
    if (status === 'Not Applied') return;
    const history = JSON.parse(localStorage.getItem('jobUpdateHistory') || '[]');
    history.unshift({ jobId: job.id, title: job.title, company: job.company, status: status, date: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) });
    localStorage.setItem('jobUpdateHistory', JSON.stringify(history.slice(0, 5)));
}

function showToast(message) {
    let container = document.querySelector('.toast-container');
    if (!container) { container = document.createElement('div'); container.className = 'toast-container'; document.body.appendChild(container); }
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => { if (container && container.contains(toast)) container.removeChild(toast); }, 3000);
}

function getTestsPassed() { return JSON.parse(localStorage.getItem('jobTrackerTests') || '[]'); }

function setTestStatus(id, checked) {
    let passed = getTestsPassed();
    if (checked) { if (!passed.includes(id)) passed.push(id); } else { passed = passed.filter(t => t !== id); }
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

function getSubmissionLinks() { return JSON.parse(localStorage.getItem('jobTrackerLinks') || '{"lovable":"","github":"","live":""}'); }

function saveSubmissionLink(id, value) {
    const links = getSubmissionLinks();
    links[id] = value;
    localStorage.setItem('jobTrackerLinks', JSON.stringify(links));
    renderRoute();
}
window.saveSubmissionLink = saveSubmissionLink;

/**
 * Matching Logic
 */
function calculateMatchScore(job) {
    const prefs = getPreferences();
    let score = 0;
    const titleLower = job.title.toLowerCase();
    const descLower = job.description.toLowerCase();
    if (prefs.roleKeywords.length > 0) {
        let inTitle = false, inDesc = false;
        prefs.roleKeywords.forEach(kw => {
            const low = kw.toLowerCase().trim();
            if (low && titleLower.includes(low)) inTitle = true;
            if (low && descLower.includes(low)) inDesc = true;
        });
        if (inTitle) score += 25;
        if (inDesc) score += 15;
    }
    if (prefs.preferredLocations.length > 0) { if (prefs.preferredLocations.some(l => l.toLowerCase() === job.location.toLowerCase())) score += 15; }
    if (prefs.preferredMode.length > 0) { if (prefs.preferredMode.some(m => m.toLowerCase() === job.mode.toLowerCase())) score += 10; }
    if (prefs.experienceLevel && prefs.experienceLevel.toLowerCase() === job.experience.toLowerCase()) score += 10;
    if (prefs.skills.length > 0 && job.skills) { if (prefs.skills.some(s => job.skills.some(js => js.toLowerCase() === s.toLowerCase().trim()))) score += 15; }
    if (job.postedDaysAgo <= 2) score += 5;
    if (job.source.toLowerCase() === 'linkedin') score += 5;
    return Math.min(score, 100);
}

function getFilteredJobs() {
    let filtered = jobsData.map(j => ({ ...j, matchScore: calculateMatchScore(j), status: getJobStatus(j.id) }));
    const prefs = getPreferences();
    if (currentFilters.showOnlyMatches) filtered = filtered.filter(j => j.matchScore >= prefs.minMatchScore);
    if (currentFilters.status) filtered = filtered.filter(j => j.status === currentFilters.status);
    if (currentFilters.keyword) {
        const kw = currentFilters.keyword.toLowerCase();
        filtered = filtered.filter(j => j.title.toLowerCase().includes(kw) || j.company.toLowerCase().includes(kw) || j.skills.some(s => s.toLowerCase().includes(kw)));
    }
    if (currentFilters.location) filtered = filtered.filter(j => j.location.toLowerCase() === currentFilters.location.toLowerCase());
    if (currentFilters.mode) filtered = filtered.filter(j => j.mode.toLowerCase() === currentFilters.mode.toLowerCase());
    if (currentFilters.experience) filtered = filtered.filter(j => j.experience.toLowerCase() === currentFilters.experience.toLowerCase());
    if (currentFilters.source) filtered = filtered.filter(j => j.source.toLowerCase() === currentFilters.source.toLowerCase());

    if (currentFilters.sort === 'latest') filtered.sort((a, b) => a.postedDaysAgo - b.postedDaysAgo);
    else if (currentFilters.sort === 'score') filtered.sort((a, b) => b.matchScore - a.matchScore);
    else if (currentFilters.sort === 'salary') filtered.sort((a, b) => parseSalary(b.salaryRange) - parseSalary(a.salaryRange));
    return filtered;
}

function parseSalary(s) {
    if (!s) return 0;
    const nums = s.match(/\d+(\.\d+)?/g);
    if (!nums) return 0;
    const avg = nums.reduce((a, b) => parseFloat(a) + parseFloat(b), 0) / nums.length;
    if (s.toLowerCase().includes('lpa')) return avg * 100000;
    if (s.toLowerCase().includes('k/month')) return avg * 1000 * 12;
    return avg;
}

/**
 * Component Rendering
 */
function renderJobCard(job) {
    const isSaved = JSON.parse(localStorage.getItem('savedJobs') || '[]').includes(job.id);
    const scoreClass = job.matchScore >= 80 ? 'job-score--high' : (job.matchScore >= 60 ? 'job-score--mid' : 'job-score--neutral');
    const statusClass = `status-badge--${job.status.toLowerCase().replace(' ', '-')}`;
    return `
        <div class="job-card">
            <div class="job-card__header">
                <div>
                    <h3 class="job-card__title">${job.title} <span class="status-badge ${statusClass}">${job.status}</span></h3>
                    <p class="job-card__company">${job.company} ${arePreferencesSet() ? `<span class="job-score ${scoreClass}">${job.matchScore}% Match</span>` : ''}</p>
                </div>
                <span class="job-source job-source--${job.source.toLowerCase()}">${job.source}</span>
            </div>
            <div class="job-card__meta"><span>📍 ${job.location}</span><span>💼 ${job.mode}</span><span>⏱️ ${job.experience}</span></div>
            <div class="status-selector">
                ${['Not Applied', 'Applied', 'Rejected', 'Selected'].map(s => `<button class="status-btn ${job.status === s ? 'active' : ''}" onclick="setJobStatus('${job.id}', '${s}')">${s}</button>`).join('')}
            </div>
            <div class="job-card__footer">
                <span>Posted ${job.postedDaysAgo === 0 ? 'Today' : (job.postedDaysAgo === 1 ? '1 day ago' : job.postedDaysAgo + ' days ago')}</span>
                <div class="job-card__actions">
                    <button class="btn btn--small btn--secondary" onclick="openJobModal('${job.id}')">View</button>
                    <button class="btn btn--small ${isSaved ? 'btn--saved' : 'btn--secondary'}" onclick="toggleSaveJob('${job.id}')">${isSaved ? '❤️' : '🤍'}</button>
                    <button class="btn btn--small btn--primary" onclick="window.open('${job.applyUrl}', '_blank')">Apply</button>
                </div>
            </div>
        </div>
    `;
}

function renderFilterBar() {
    const locs = [...new Set(jobsData.map(j => j.location))].sort();
    const stats = ['Not Applied', 'Applied', 'Rejected', 'Selected'];
    return `
        <div class="filter-bar">
            <input type="text" id="filter-keyword" class="filter-input" placeholder="Search..." value="${currentFilters.keyword}">
            <div class="filter-bar__filters">
                <select id="filter-location" class="filter-select"><option value="">All Locations</option>${locs.map(l => `<option value="${l}" ${currentFilters.location === l ? 'selected' : ''}>${l}</option>`).join('')}</select>
                <select id="filter-status" class="filter-select"><option value="">All Statuses</option>${stats.map(s => `<option value="${s}" ${currentFilters.status === s ? 'selected' : ''}>${s}</option>`).join('')}</select>
                <select id="filter-sort" class="filter-select"><option value="latest" ${currentFilters.sort === 'latest' ? 'selected' : ''}>Latest</option><option value="score" ${currentFilters.sort === 'score' ? 'selected' : ''}>Match Score</option></select>
            </div>
        </div>
    `;
}

/**
 * Route Renderers
 */
function renderLandingPage() {
    return `<div class="landing-page"><div class="hero"><h1>Precision Job Tracker</h1><p>Intelligent matching for premium careers.</p><a href="#/dashboard" class="btn btn--primary btn--large">Get Started</a></div></div>`;
}

function renderDashboardPage() {
    const jobs = getFilteredJobs();
    return `
        <div class="page-container page-container--wide">
            <div class="page-header"><h1>Dashboard</h1><p>${jobs.length} matches found</p></div>
            ${renderFilterBar()}
            <div class="dashboard-actions">
                <label class="toggle-container"><span>Show only jobs above threshold</span><input type="checkbox" id="match-toggle" ${currentFilters.showOnlyMatches ? 'checked' : ''}><span class="toggle-switch"></span></label>
            </div>
            <div class="jobs-grid">${jobs.map(j => renderJobCard(j)).join('')}</div>
        </div>
    `;
}

function renderSavedPage() {
    const savedIds = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    const savedJobs = jobsData.filter(j => savedIds.includes(j.id)).map(j => ({ ...j, matchScore: calculateMatchScore(j), status: getJobStatus(j.id) }));
    return `
        <div class="page-container page-container--wide">
            <div class="page-header"><h1>Saved Jobs</h1><p>${savedJobs.length} roles bookmarked</p></div>
            <div class="jobs-grid">${savedJobs.length ? savedJobs.map(j => renderJobCard(j)).join('') : '<div class="empty-state">No saved jobs.</div>'}</div>
        </div>
    `;
}

function renderDigestPage() {
    if (!arePreferencesSet()) return `<div class="page-container"><h1>Digest</h1><div class="empty-state">Set preferences first.</div></div>`;
    const today = new Date().toISOString().split('T')[0];
    const digest = JSON.parse(localStorage.getItem(`jobTrackerDigest_${today}`) || 'null');
    const history = JSON.parse(localStorage.getItem('jobUpdateHistory') || '[]');
    return `
        <div class="page-container page-container--wide">
            <div class="page-header"><h1>Daily Digest</h1></div>
            ${!digest ? `
                <div class="empty-state"><button class="btn btn--primary" onclick="generateTodayDigest()">Generate Digest</button></div>
            ` : `
                <div class="newsletter">
                    <div class="newsletter__header"><h2>Top 10 Matches</h2></div>
                    <div class="newsletter__content">${digest.map(j => `<div class="newsletter__item"><div><strong>${j.title}</strong><br>${j.company} • ${j.matchScore}% Match</div><button class="btn btn--small btn--primary" onclick="window.open('${j.applyUrl}', '_blank')">Apply</button></div>`).join('')}</div>
                </div>
            `}
            ${history.length ? `<div class="updates-section"><h3>Recent Status Updates</h3><ul class="update-list">${history.map(h => `<li class="update-item">${h.title} @ ${h.company} -> ${h.status} (${h.date})</li>`).join('')}</ul></div>` : ''}
        </div>
    `;
}

function generateTodayDigest() {
    const jobs = jobsData.map(j => ({ ...j, matchScore: calculateMatchScore(j) }));
    const digest = jobs.sort((a, b) => (b.matchScore - a.matchScore) || (a.postedDaysAgo - b.postedDaysAgo)).slice(0, 10);
    localStorage.setItem(`jobTrackerDigest_${new Date().toISOString().split('T')[0]}`, JSON.stringify(digest));
    renderRoute();
}
window.generateTodayDigest = generateTodayDigest;

function renderSettingsPage() {
    const p = getPreferences();
    return `
        <div class="page-container">
            <div class="page-header"><h1>Settings</h1></div>
            <form class="settings-form" id="prefs-form">
                <div class="form-group"><label>Keywords</label><input type="text" id="pref-keywords" class="form-input" value="${p.roleKeywords.join(', ')}"></div>
                <div class="form-group"><label>Threshold: <span id="threshold-val">${p.minMatchScore}%</span></label><input type="range" id="pref-threshold" min="0" max="100" value="${p.minMatchScore}"></div>
                <button type="submit" class="btn btn--primary">Save</button>
            </form>
        </div>
    `;
}

function handlePrefsSubmit(e) {
    e.preventDefault();
    const keywords = document.getElementById('pref-keywords').value;
    savePreferences({ ...getPreferences(), roleKeywords: keywords.split(',').map(s => s.trim()).filter(s => s), minMatchScore: parseInt(document.getElementById('pref-threshold').value) });
    alert("Saved!");
    navigateTo('/dashboard');
}

function toggleSaveJob(id) {
    let saved = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    if (saved.includes(id)) saved = saved.filter(i => i !== id); else saved.push(id);
    localStorage.setItem('savedJobs', JSON.stringify(saved));
    renderRoute();
}
window.toggleSaveJob = toggleSaveJob;

function renderTestingPage() {
    const passed = getTestsPassed();
    return `
        <div class="page-container">
            <div class="page-header"><h1>Quality Review</h1></div>
            <div class="test-container">
                <div class="test-progress"><div class="test-progress__score">Passed: ${passed.length}/10</div></div>
                <div class="test-checklist">${testItems.map(i => `<div class="test-item"><input type="checkbox" onchange="setTestStatus('${i.id}', this.checked)" ${passed.includes(i.id) ? 'checked' : ''}><div><strong>${i.label}</strong><br><small>${i.hint}</small></div></div>`).join('')}</div>
            </div>
        </div>
    `;
}

function renderShipPage() {
    if (getTestsPassed().length < 10) return `<div class="page-container"><div class="ship-lock"><h1>Locked</h1><p>Pass all 10 tests first.</p><a href="#/jt/07-test" class="btn btn--primary">Testing</a></div></div>`;
    return `<div class="page-container"><div class="page-header"><h1>Ship Ready</h1></div><div class="empty-state">🚀<h2>Ready to Ship</h2><a href="#/jt/proof" class="btn btn--primary">Go to Proof</a></div></div>`;
}

function renderProofPage() {
    const tests = getTestsPassed().length;
    const links = getSubmissionLinks();
    const isShipped = tests === 10 && links.lovable && links.github && links.live;
    const status = isShipped ? 'shipped' : (tests > 0 ? 'in-progress' : 'not-started');
    const steps = ["Environment Setup", "Data Integration", "Filter Logic", "Matching Engine", "Preferences System", "Daily Digest", "Status Tracker", "Quality Review"];

    return `
        <div class="page-container proof-page">
            <div class="page-header"><h1>Proof & Submission</h1><span class="submission-status-badge status-badge--${status}">${status.replace('-', ' ')}</span></div>
            <div class="proof-summary-card">
                <h3>Step completion Summary</h3>
                <div class="step-summary">${steps.map((st, i) => `<div class="step-indicator ${i < 7 || tests === 10 ? 'step-indicator--completed' : 'step-indicator--pending'}">Step ${i + 1}: ${st}</div>`).join('')}</div>
                <h3>Artifact Collection</h3>
                <div class="form-group"><label>Lovable Project Link</label><input type="url" class="form-input" onchange="saveSubmissionLink('lovable', this.value)" value="${links.lovable}"></div>
                <div class="form-group"><label>GitHub Repository Link</label><input type="url" class="form-input" onchange="saveSubmissionLink('github', this.value)" value="${links.github}"></div>
                <div class="form-group"><label>Live Deployment URL</label><input type="url" class="form-input" onchange="saveSubmissionLink('live', this.value)" value="${links.live}"></div>
                <div style="margin-top: 24px;"><button class="btn btn--primary" onclick="copyFinalSubmission()">Copy Submission</button></div>
                ${isShipped ? `<div class="ship-confirmation">Project 1 Shipped Successfully.</div>` : ''}
            </div>
        </div>
    `;
}

function copyFinalSubmission() {
    const links = getSubmissionLinks();
    const text = `Job Notification Tracker — Final Submission\n\nGitHub Repository: ${links.github}\nLive Deployment: ${links.live}\n\nFeatures: Match scoring, Daily digest, Status tracking, Test checklist.`;
    navigator.clipboard.writeText(text).then(() => showToast("Copied!"));
}
window.copyFinalSubmission = copyFinalSubmission;

/**
 * Modal Logic
 */
function openJobModal(id) {
    const j = jobsData.find(job => job.id === id);
    if (!j) return;
    const score = calculateMatchScore(j);
    const modal = document.createElement('div');
    modal.className = 'job-modal';
    modal.innerHTML = `<div class="job-modal__overlay" onclick="closeJobModal()"></div><div class="job-modal__content"><h2>${j.title} ${arePreferencesSet() ? `(${score}%)` : ''}</h2><p>${j.company}</p><p>${j.description}</p><button class="btn btn--primary" onclick="window.open('${j.applyUrl}', '_blank')">Apply</button></div>`;
    document.body.appendChild(modal);
    currentJobModal = modal;
    document.body.style.overflow = 'hidden';
}
window.openJobModal = openJobModal;

function closeJobModal() {
    if (currentJobModal) { document.body.removeChild(currentJobModal); currentJobModal = null; document.body.style.overflow = ''; }
}
window.closeJobModal = closeJobModal;

/**
 * Routing Engine
 */
function navigateTo(path) { window.location.hash = path; }
function renderRoute() {
    const path = window.location.hash.slice(1) || '/';
    const route = routes[path] || routes['/'];
    document.title = route.title;
    const content = document.getElementById('app-content');
    if (content) content.innerHTML = route.render();
    initializeListeners();
}

function initializeListeners() {
    const path = window.location.hash.slice(1) || '/';
    if (path === '/dashboard') {
        ['filter-keyword', 'filter-location', 'filter-status', 'filter-sort'].forEach(id => document.getElementById(id)?.addEventListener('change', e => { currentFilters[id.split('-')[1]] = e.target.value; renderDashboardContent(); }));
        document.getElementById('filter-keyword')?.addEventListener('input', e => { currentFilters.keyword = e.target.value; renderDashboardContent(); });
        document.getElementById('match-toggle')?.addEventListener('change', e => { currentFilters.showOnlyMatches = e.target.checked; renderDashboardContent(); });
    }
    if (path === '/settings') document.getElementById('prefs-form')?.addEventListener('submit', handlePrefsSubmit);
}

function renderDashboardContent() {
    const jobs = getFilteredJobs();
    const grid = document.querySelector('.jobs-grid');
    if (grid) grid.innerHTML = jobs.map(j => renderJobCard(j)).join('');
}

window.addEventListener('hashchange', renderRoute);
window.addEventListener('DOMContentLoaded', renderRoute);
