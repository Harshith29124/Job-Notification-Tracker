// KodNest Premium - Build System Router

/**
 * Global Configuration & State
 */
let currentFilters = {
    keyword: '',
    location: '',
    mode: '',
    experience: '',
    source: '',
    sort: 'score', // Default to Match Score
    showOnlyMatches: false,
    status: ''
};

// Global State for Resume Builder (Vanilla SPA version)
let rbState = JSON.parse(localStorage.getItem('rb_spa_state') || JSON.stringify({
    personal: { name: '', email: '', phone: '', location: '', github: '', linkedin: '' },
    summary: '',
    experience: [{ id: Date.now(), company: '', role: '', duration: '', desc: '' }],
    education: [{ id: Date.now() + 1, school: '', degree: '', year: '' }],
    skills: '',
    template: 'modern',
    color: '#8B0000'
}));

const routes = {
    '/': { step: 1, title: 'Strategic Portfolio', subtitle: 'Integrated command center for career discovery and technical readiness.', content: renderLandingPage },
    '/dashboard': { step: 2, title: 'Discovery Dashboard', subtitle: 'Live market analysis and intelligent role matching.', content: renderDashboardPage },
    '/rb/app': { step: 3, isRb: true, isApp: true, title: 'AI Resume Engine', subtitle: 'Strategic document generation with real-time ATS optimization.', content: renderRbAppPage },
    '/rb/01-problem': { step: 1, isRb: true, title: 'Problem Discovery', subtitle: 'Defining the real-world friction in modern recruitment.', artifact: 'Problem Statement Matrix' },
    '/rb/proof': { step: 9, isRb: true, title: 'Project Graduation', subtitle: 'Performance verification and artifact archival.', content: renderRbProofPage },
    // Simplified other routes for the SPA
    '/saved': { step: 3, title: 'Strategic Bookmarks', subtitle: 'Curated roles for focused application.', content: renderSavedPage },
    '/settings': { step: 5, title: 'Logic Configuration', subtitle: 'Fine-tuning the weighted matching parameters.', content: renderSettingsPage },
    '/jt/proof': { step: 8, title: 'Submission Proof', subtitle: 'Final evidence collection.', content: renderProofPage }
};

/**
 * Storage Helpers
 */
const getPreferences = () => JSON.parse(localStorage.getItem('jobTrackerPreferences') || '{"roleKeywords":[],"minMatchScore":40}');
const savePreferences = (p) => localStorage.setItem('jobTrackerPreferences', JSON.stringify(p));
const getTestsPassed = () => JSON.parse(localStorage.getItem('jobTrackerTests') || '[]');
const getSubmissionLinks = () => JSON.parse(localStorage.getItem('jobTrackerLinks') || '{"lovable":"","github":"","live":""}');
const getJobStatus = (id) => JSON.parse(localStorage.getItem('jobTrackerStatus') || '{}')[id] || 'Not Applied';
const getSavedJobs = () => JSON.parse(localStorage.getItem('savedJobs') || '[]');

/**
 * Rendering Core
 */
function renderRoute() {
    const path = window.location.hash.slice(1) || '/';
    // Match dynamic RB step routes like /rb/02-market
    let matchedPath = path;
    if (path.startsWith('/rb/0') && path !== '/rb/app') matchedPath = '/rb/01-problem';

    const route = routes[path] || (path.startsWith('/rb/0') ? { ...routes['/rb/01-problem'], step: parseInt(path.split('-')[0].slice(-1)) } : routes['/']);

    document.title = `${route.title} - KodNest Hub`;

    const rbSteps = JSON.parse(localStorage.getItem('rb_steps_completed') || '[]');
    const isRbShipped = rbSteps.length === 8 && rbSteps.every(Boolean);

    // Global Top Bar
    document.querySelector('.top-bar__project').textContent = route.isRb ? 'AI Resume Builder' : 'Intelligence Suite';
    document.getElementById('app-progress').textContent = route.isRb ? `Project 3 — Phase ${route.step}` : `System Layer ${route.step}`;

    const statusText = isRbShipped ? 'Shipped' : (rbSteps.some(Boolean) ? 'Active' : 'Standby');
    const statusClass = isRbShipped ? 'status--shipped' : (rbSteps.some(Boolean) ? 'status--in-progress' : 'status--not-started');
    document.getElementById('app-status').innerHTML = `<span class="status-badge ${statusClass}">${statusText}</span>`;

    // Header
    document.getElementById('app-header').innerHTML = `<h1 class="context-header__title">${route.title}</h1><p class="context-header__subtitle">${route.subtitle}</p>`;

    // Content Execution
    const { workspaceHtml, panelHtml } = route.content ? route.content() : (route.isRb ? renderRbStepPage(route) : { workspaceHtml: '', panelHtml: '' });
    document.getElementById('app-workspace').innerHTML = workspaceHtml;
    document.getElementById('app-panel').innerHTML = panelHtml;

    // Global Nav (Tabs)
    const navItems = `
        <a href="#/" class="nav-tab ${path === '/' ? 'active' : ''}">Overview</a>
        <a href="#/dashboard" class="nav-tab ${path === '/dashboard' ? 'active' : ''}">Jobs</a>
        <a href="#/rb/app" class="nav-tab ${path.startsWith('/rb/') ? 'active' : ''}">Resume</a>
        <a href="#/settings" class="nav-tab ${path === '/settings' ? 'active' : ''}">Config</a>
    `;
    const navStyle = `<style>
        .nav-tabs { display: flex; gap: 32px; border-bottom: 1px solid var(--color-border); margin-bottom: 32px; padding-bottom: 8px; }
        .nav-tab { text-decoration: none; color: var(--color-text-secondary); font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; transition: 0.2s; }
        .nav-tab:hover, .nav-tab.active { color: var(--color-accent); border-bottom: 2px solid var(--color-accent); padding-bottom: 8px; margin-bottom: -10px; }
    </style>`;
    document.getElementById('app-workspace').insertAdjacentHTML('afterbegin', `${navStyle}<div class="nav-tabs">${navItems}</div>`);

    // Footer Indicators
    const footerItems = [
        { label: 'Data Engine', checked: getPreferences().roleKeywords.length > 0 },
        { label: 'Placement Tool', checked: true },
        { label: 'Resume AI', checked: isRbShipped }
    ];
    document.getElementById('app-footer').innerHTML = footerItems.map(i => `<div class="checklist-item">${i.checked ? '☑' : '□'} ${i.label}</div>`).join('');

    initializeListeners();
}

/**
 * DASHBOARD PAGE (Job Discovery Engine)
 */
function renderDashboardPage() {
    const jobs = getFilteredJobs();
    return {
        workspaceHtml: `
            <div style="margin-bottom: 32px; display: grid; grid-template-columns: 1fr 200px 150px; gap: 16px;">
                <input type="text" id="search-keyword" class="input" placeholder="Search Role or Tech (e.g. React, Manager)..." value="${currentFilters.keyword}">
                <select id="filter-location" class="input">
                    <option value="">All Locations</option>
                    ${[...new Set(jobsData.map(j => j.location))].sort().map(l => `<option value="${l}" ${currentFilters.location === l ? 'selected' : ''}>${l}</option>`).join('')}
                </select>
                <select id="sort-jobs" class="input">
                    <option value="score" ${currentFilters.sort === 'score' ? 'selected' : ''}>Best Match</option>
                    <option value="latest" ${currentFilters.sort === 'latest' ? 'selected' : ''}>Newest</option>
                </select>
            </div>
            <div class="jobs-grid" style="display: grid; grid-template-columns: 1fr; gap: 24px;">
                ${jobs.length ? jobs.map(renderJobCard).join('') : '<div class="card" style="text-align:center; padding: 64px; color: var(--color-text-secondary);">No intelligent matches found for your current criteria.</div>'}
            </div>
        `,
        panelHtml: `
            <div class="card" style="background: var(--color-accent); color: white;">
                <h3 style="color: white; margin-bottom: 12px;">Market Summary</h3>
                <p style="color: rgba(255,255,255,0.7); font-size: 14px; margin-bottom: 24px;">Live tracking of ${jobsData.length} roles across top Indian tech hubs.</p>
                <div style="font-size: 11px; font-weight: 700; text-transform: uppercase;">Filtered Results: <span style="font-size: 18px;">${jobs.length}</span></div>
            </div>
            <div class="card">
                <h3 style="font-size: 16px; margin-bottom: 16px;">Filters</h3>
                <label style="font-size: 12px; font-weight: 700; display: flex; align-items: center; gap: 12px; cursor: pointer;">
                    <input type="checkbox" onchange="window.toggleHighValue(this.checked)" ${currentFilters.showOnlyMatches ? 'checked' : ''} style="width: 18px; height: 18px; accent-color: var(--color-accent);"> High Value (Match > 60%)
                </label>
            </div>
        `
    };
}

function renderJobCard(job) {
    const isSaved = getSavedJobs().includes(job.id);
    const score = calculateMatchScore(job);
    return `
        <div class="card" style="margin-bottom: 0; position: relative; overflow: hidden;">
            <div style="position: absolute; top:0; right:0; width: 4px; height: 100%; background: ${score > 60 ? 'var(--color-success)' : 'var(--color-border)'}"></div>
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div>
                    <h3 style="margin-bottom: 4px;">${job.title}</h3>
                    <p style="font-size: 14px; font-weight: 700; color: var(--color-accent);">${job.company} • ${job.location}</p>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 10px; font-weight: 900; color: var(--color-text-secondary);">${job.source}</div>
                    <div style="font-size: 18px; font-weight: 900; color: ${score > 50 ? 'var(--color-success)' : 'var(--color-text)'}">${score}%</div>
                    <div style="font-size: 8px; font-weight: 700; text-transform: uppercase;">Match Index</div>
                </div>
            </div>
            <div style="margin-top: 24px; display: flex; flex-wrap: wrap; gap: 8px;">
                ${job.skills.slice(0, 4).map(s => `<span style="font-size: 10px; font-weight: 700; background: var(--color-bg); padding: 4px 10px; border: 1px solid var(--color-border);">${s}</span>`).join('')}
            </div>
            <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid var(--color-border); display: flex; justify-content: space-between; align-items: center;">
                <p style="font-size: 13px; font-weight: 600;">${job.salaryRange || 'Competitive Pay'}</p>
                <div style="display: flex; gap: 12px;">
                    <button class="btn btn--secondary" style="width: 44px; padding: 0;" onclick="window.toggleSaveJob('${job.id}')">${isSaved ? '❤️' : '🤍'}</button>
                    <a href="${job.applyUrl}" target="_blank" class="btn btn--primary" style="padding: 10px 24px;">View Role</a>
                </div>
            </div>
        </div>
    `;
}

/**
 * RESUME BUILDER Page (SPA App Injection)
 */
function renderRbAppPage() {
    const calculateScore = () => {
        let s = 20; // Base points
        if (rbState.personal.name) s += 15;
        if (rbState.personal.email) s += 10;
        if (rbState.summary.length > 50) s += 15;
        if (rbState.experience[0].desc) s += 15;
        if (rbState.skills.split(',').length > 3) s += 15;
        if (rbState.personal.github) s += 10;
        return Math.min(s, 100);
    };

    const score = calculateScore();
    const scoreColor = score < 50 ? '#F44336' : (score < 85 ? '#FF9800' : '#2D5016');

    return {
        workspaceHtml: `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px; height: calc(100vh - 350px); overflow: hidden;">
                <!-- Left: Form Creator -->
                <div style="overflow-y: auto; padding-right: 16px; border-right: 1px solid var(--color-border);">
                    <div class="card" style="padding: 24px; margin-bottom: 24px;">
                        <h4 style="font-size: 11px; font-weight: 900; text-transform: uppercase; margin-bottom: 16px;">Contact Identity</h4>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                            <input type="text" placeholder="Full Name" value="${rbState.personal.name}" oninput="window.updateRb('personal', 'name', this.value)" class="input" style="padding: 12px; font-size: 13px;">
                            <input type="email" placeholder="Email Address" value="${rbState.personal.email}" oninput="window.updateRb('personal', 'email', this.value)" class="input" style="padding: 12px; font-size: 13px;">
                            <input type="text" placeholder="Location" value="${rbState.personal.location}" oninput="window.updateRb('personal', 'location', this.value)" class="input" style="padding: 12px; font-size: 13px;">
                            <input type="text" placeholder="LinkedIn URL" value="${rbState.personal.linkedin}" oninput="window.updateRb('personal', 'linkedin', this.value)" class="input" style="padding: 12px; font-size: 13px;">
                        </div>
                    </div>

                    <div class="card" style="padding: 24px; margin-bottom: 24px;">
                         <h4 style="font-size: 11px; font-weight: 900; text-transform: uppercase; margin-bottom: 16px;">Professional Summary</h4>
                         <textarea class="input" placeholder="Expert SDE with 3 years..." style="height: 100px; resize: none; font-size: 13px;" oninput="window.updateRb(null, 'summary', this.value)">${rbState.summary}</textarea>
                    </div>

                    <div class="card" style="padding: 24px; margin-bottom: 24px;">
                         <h4 style="font-size: 11px; font-weight: 900; text-transform: uppercase; margin-bottom: 16px;">Experience Details</h4>
                         ${rbState.experience.map((exp, idx) => `
                            <div style="margin-bottom: 16px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                                <input type="text" placeholder="Company" value="${exp.company}" oninput="window.updateRbList('experience', ${idx}, 'company', this.value)" class="input" style="padding: 8px; font-size: 12px;">
                                <input type="text" placeholder="Role" value="${exp.role}" oninput="window.updateRbList('experience', ${idx}, 'role', this.value)" class="input" style="padding: 8px; font-size: 12px;">
                                <textarea placeholder="Achievements..." style="grid-column: span 2; height: 80px; resize: none;" oninput="window.updateRbList('experience', ${idx}, 'desc', this.value)" class="input">${exp.desc}</textarea>
                            </div>
                         `).join('')}
                    </div>
                </div>

                <!-- Right: Live A4 Preview -->
                <div style="background: #E5E7EB; border: 1px solid var(--color-border); padding: 40px; display: flex; justify-content: center; overflow-y: auto;">
                    <div id="resume-canvas" style="width: 210mm; height: 297mm; background: white; padding: 40px; transform: scale(0.65); transform-origin: top center; box-shadow: 0 10px 40px rgba(0,0,0,0.1);">
                        <header style="border-bottom: 2px solid ${rbState.color}; padding-bottom: 20px; margin-bottom: 30px;">
                            <h1 style="font-family: var(--font-display); font-size: 36px; margin-bottom: 10px; color: ${rbState.color}">${rbState.personal.name || 'YOUR IDENTITY'}</h1>
                            <div style="font-size: 12px; color: #555; display: flex; gap: 15px;">
                                <span>${rbState.personal.email || 'email@example.com'}</span>
                                <span>${rbState.personal.location || 'City, India'}</span>
                                <span>${rbState.personal.linkedin || 'linkedin.com/in/user'}</span>
                            </div>
                        </header>
                        <section style="margin-bottom: 30px;">
                            <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; color: ${rbState.color}; border-bottom: 1px solid #EEE; padding-bottom: 5px; margin-bottom: 10px;">Executive Summary</h2>
                            <p style="font-size: 13px; color: #444; line-height: 1.6;">${rbState.summary || 'Provide a professional summary of your career trajectory and technical core competencies...'}</p>
                        </section>
                        <section>
                            <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; color: ${rbState.color}; border-bottom: 1px solid #EEE; padding-bottom: 5px; margin-bottom: 15px;">Strategic Experience</h2>
                            ${rbState.experience.map(exp => `
                                <div style="margin-bottom: 20px;">
                                    <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 14px;"><span>${exp.company || 'Corporate Name'}</span><span>${exp.duration || '2023 - Present'}</span></div>
                                    <div style="font-style: italic; color: #666; font-size: 12px; margin-bottom: 8px;">${exp.role || 'Professional Role'}</div>
                                    <p style="font-size: 12px; color: #555; white-space: pre-line;">${exp.desc || 'Describe cross-functional impact and key technical achievements...'}</p>
                                </div>
                            `).join('')}
                        </section>
                    </div>
                </div>
            </div>
            <div style="margin-top: 32px; display: flex; justify-content: space-between; align-items: center;">
                <button class="btn btn--secondary" onclick="window.printResume()">Print Document</button>
                <div style="display: flex; align-items: center; gap: 16px;">
                    <div style="font-size: 11px; font-weight: 900; text-transform: uppercase;">Color Theme:</div>
                    <div style="display: flex; gap: 8px;">
                        ${['#8B0000', '#2D5016', '#111827', '#1E40AF'].map(c => `
                            <div onclick="window.updateRb(null, 'color', '${c}')" style="width: 24px; height: 24px; border-radius: 50%; background: ${c}; cursor: pointer; border: 2px solid ${rbState.color === c ? 'white' : 'transparent'}; outline: 1px solid #CCC;"></div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `,
        panelHtml: `
            <div class="card" style="text-align: center;">
                <h4 style="font-size: 10px; font-weight: 900; text-transform: uppercase; color: var(--color-text-secondary); margin-bottom: 16px;">ATS Readiness Profile</h4>
                <div style="width: 120px; height: 120px; border: 10px solid #EEE; border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; position: relative;">
                    <span style="font-size: 28px; font-weight: 900; color: ${scoreColor}">${score}</span>
                    <svg style="position: absolute; top: -10px; left: -10px; width: 120px; height: 120px; transform: rotate(-90deg);">
                        <circle cx="60" cy="60" r="55" fill="none" stroke="${scoreColor}" stroke-width="10" stroke-dasharray="345" stroke-dashoffset="${345 - (345 * score / 100)}" style="transition: 1s ease-out;"></circle>
                    </svg>
                </div>
                <div style="font-size: 12px; font-weight: 700; color: ${scoreColor}; text-transform: uppercase;">${score < 80 ? 'Optimization Required' : 'Elite Status'}</div>
            </div>
            <div class="card">
                <h4 style="font-size: 11px; font-weight: 900; text-transform: uppercase; margin-bottom: 12px;">Improvements</h4>
                <ul style="font-size: 12px; color: var(--color-text-secondary); list-style: none; padding: 0;">
                    ${score < 100 ? `
                        ${!rbState.personal.name ? '<li>• Add professional identity (+15)</li>' : ''}
                        ${rbState.summary.length < 50 ? '<li>• Detailed executive summary (+15)</li>' : ''}
                        ${!rbState.personal.github ? '<li>• Link GitHub repository (+10)</li>' : ''}
                    ` : '<li>Document fully optimized for ATS.</li>'}
                </ul>
            </div>
        `
    };
}

/**
 * LANDING PAGE Content
 */
function renderLandingPage() {
    const rbSteps = JSON.parse(localStorage.getItem('rb_steps_completed') || '[]');
    const isRbShipped = rbSteps.length === 8 && rbSteps.every(Boolean);

    return {
        workspaceHtml: `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 40px; padding-top: 8px;">
                <!-- Job Tracker Card -->
                <div class="card" style="display: flex; flex-direction: column; justify-content: space-between;">
                    <div>
                        <div style="width: 48px; height: 48px; background: #FFF; border: 1px solid var(--color-border); border-radius: 4px; display: flex; align-items: center; justify-content: center; margin-bottom: 24px;">
                             <span style="font-size: 20px;">📡</span>
                        </div>
                        <h2 style="margin-bottom: 16px;">Discovery Engine</h2>
                        <p style="margin-bottom: 32px;">Intelligent role matching system with real-time Indian tech market tracking. Weighted heuristics for career discovery.</p>
                    </div>
                    <div style="display: flex; gap: 16px;">
                        <a href="#/dashboard" class="btn btn--primary" style="flex: 1;">Explore Market</a>
                    </div>
                </div>

                <!-- Readiness Card -->
                <div class="card" style="display: flex; flex-direction: column; justify-content: space-between; border-color: var(--color-accent);">
                    <div>
                        <div style="width: 48px; height: 48px; background: #FFF; border: 1px solid var(--color-accent); border-radius: 4px; display: flex; align-items: center; justify-content: center; margin-bottom: 24px;">
                             <span style="font-size: 20px; color: var(--color-accent);">💎</span>
                        </div>
                        <h2 style="margin-bottom: 16px;">Placement Prep</h2>
                        <p style="margin-bottom: 32px;">Automated interview architect and skill verification platform. Master the technical screening process through intelligence.</p>
                    </div>
                    <div style="display: flex; gap: 16px;">
                        <a href="placement/index.html" class="btn btn--primary" style="flex: 1;">Launch Platform</a>
                    </div>
                </div>

                <!-- Resume Builder Card -->
                <div class="card" style="display: flex; flex-direction: column; justify-content: space-between; border-color: #2D5016;">
                    <div>
                        <div style="width: 48px; height: 48px; background: #ECFDF5; border: 1px solid #D1FAE5; border-radius: 4px; display: flex; align-items: center; justify-content: center; margin-bottom: 24px;">
                             <span style="font-size: 20px;">📄</span>
                        </div>
                        <h2 style="margin-bottom: 16px;">AI Resume Engine</h2>
                        <p style="margin-bottom: 32px;">Production-grade resume generation tool with live ATS scoring. Strategically built within the Intelligence Suite framework.</p>
                    </div>
                    <div style="display: flex; gap: 16px;">
                        <a href="#/rb/app" class="btn btn--primary" style="flex: 1; background: #2D5016;">
                            ${isRbShipped ? 'Launch AI Builder' : 'Enter Build Track'}
                        </a>
                        <div class="status-badge" style="background: #F3F4F6; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-weight: 900;">V1.1 LIVE</div>
                    </div>
                </div>
            </div>
        `,
        panelHtml: `
            <div class="card" style="background: var(--color-text); color: white;">
                <h3 style="color: white; margin-bottom: 12px; font-family: var(--font-display);">Suite Performance</h3>
                <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 24px;">
                    <div style="display: flex; justify-content: space-between; font-size: 11px; font-weight: 700; text-transform: uppercase;"><span>Network Integrity</span><span style="color: #10B981;">100%</span></div>
                    <div style="width: 100%; height: 2px; background: #334155;"><div style="width: 100%; height: 100%; background: #10B981;"></div></div>
                </div>
            </div>
        `
    };
}

/**
 * GLOBAL ENGINE CORE
 */
function calculateMatchScore(job) {
    const p = getPreferences();
    if (!p.roleKeywords.length) return 0;
    let score = 0;
    const tl = job.title.toLowerCase();
    const sk = job.skills.map(s => s.toLowerCase());

    // Keyword match (Title)
    p.roleKeywords.forEach(kw => { if (tl.includes(kw.toLowerCase())) score += 30; });

    // Keyword match (Skills)
    p.roleKeywords.forEach(kw => { if (sk.some(s => s.includes(kw.toLowerCase()))) score += 15; });

    return Math.min(score, 100);
}

function getFilteredJobs() {
    let f = jobsData.map(j => ({ ...j, matchScore: calculateMatchScore(j), status: getJobStatus(j.id) }));

    // Keywords Search (General)
    if (currentFilters.keyword) {
        const k = currentFilters.keyword.toLowerCase();
        f = f.filter(j => j.title.toLowerCase().includes(k) || j.company.toLowerCase().includes(k) || j.skills.some(s => s.toLowerCase().includes(k)));
    }

    // Location
    if (currentFilters.location) f = f.filter(j => j.location === currentFilters.location);

    // High Value Only
    if (currentFilters.showOnlyMatches) f = f.filter(j => j.matchScore >= 60);

    // Sorting
    if (currentFilters.sort === 'score') f.sort((a, b) => b.matchScore - a.matchScore);
    else if (currentFilters.sort === 'latest') f.sort((a, b) => a.postedDaysAgo - b.postedDaysAgo);

    return f;
}

/**
 * RB SPA ACTIONS
 */
window.updateRb = (section, field, val) => {
    if (section) rbState[section][field] = val;
    else rbState[field] = val;
    localStorage.setItem('rb_spa_state', JSON.stringify(rbState));
    renderRoute();
};

window.updateRbList = (section, index, field, val) => {
    rbState[section][index][field] = val;
    localStorage.setItem('rb_spa_state', JSON.stringify(rbState));
    renderRoute();
};

window.printResume = () => {
    // Hidden printing hack to only print the canvas
    const canvas = document.getElementById('resume-canvas').cloneNode(true);
    canvas.style.transform = 'none';
    canvas.style.boxShadow = 'none';
    const pWindow = window.open('', '_blank');
    pWindow.document.write(`<html><head><title>Resume</title><link rel="stylesheet" href="app.css"></head><body style="margin:0;"></body></html>`);
    pWindow.document.body.appendChild(canvas);
    setTimeout(() => { pWindow.print(); pWindow.close(); }, 500);
};

/**
 * INTERACTIVITY ENGINE
 */
function initializeListeners() {
    // Dashboard Listeners
    const search = document.getElementById('search-keyword');
    if (search) search.addEventListener('input', (e) => { currentFilters.keyword = e.target.value; renderRoute(); });

    const loc = document.getElementById('filter-location');
    if (loc) loc.addEventListener('change', (e) => { currentFilters.location = e.target.value; renderRoute(); });

    const sort = document.getElementById('sort-jobs');
    if (sort) sort.addEventListener('change', (e) => { currentFilters.sort = e.target.value; renderRoute(); });
}

window.toggleHighValue = (v) => { currentFilters.showOnlyMatches = v; renderRoute(); };
window.toggleSaveJob = (id) => {
    let s = getSavedJobs();
    if (s.includes(id)) s = s.filter(x => x !== id); else s.push(id);
    localStorage.setItem('savedJobs', JSON.stringify(s));
    renderRoute();
};

/**
 * Placeholders for proof/saved
 */
function renderRbStepPage(r) { return { workspaceHtml: `<div class="card"><h3>Step ${r.step}: ${r.title}</h3><p style="margin-bottom:32px;">Development protocol in progress...</p><a href="#/rb/app" class="btn btn--primary" style="background:#2D5016">Skip to Live Tool</a></div>`, panelHtml: `<div class="card"><h3>Protocol</h3></div>` }; }
function renderRbProofPage() { return { workspaceHtml: `<div class="card"><h3>Verification Hub</h3><p>Ensure all 8 build artifacts are logged.</p></div>`, panelHtml: `<div class="card"><h3>Production</h3></div>` }; }
function renderSavedPage() { return { workspaceHtml: `<div class="card"><h3>Strategic Bookmarks</h3><div class="jobs-grid" style="display: grid; grid-template-columns: 1fr; gap: 16px;">${getFilteredJobs().filter(j => getSavedJobs().includes(j.id)).map(renderJobCard).join('')}</div></div>`, panelHtml: `<div class="card"><h3>Archive</h3></div>` }; }
function renderSettingsPage() { return { workspaceHtml: `<div class="card"><h3>System Configuration</h3><p>Adjust the Intelligence Suite behavioral logic.</p></div>`, panelHtml: `<div class="card"><h3>Controls</h3></div>` }; }
function renderProofPage() { return renderRbProofPage(); }

function showToast(msg) {
    const t = document.createElement('div');
    t.style = "position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%); background: var(--color-text); color: #FFF; padding: 12px 24px; border: 1px solid var(--color-border); border-radius: 4px; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; z-index: 1000;";
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => { if (t.parentElement) document.body.removeChild(t); }, 2000);
}

// Initial Events
window.addEventListener('hashchange', renderRoute);
window.addEventListener('load', renderRoute);
renderRoute();
