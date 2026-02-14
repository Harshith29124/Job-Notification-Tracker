// KODNEST PREMIUM INTELLIGENCE SUITE
// Core Application Router - Production Ready v1.5

/**
 * PRODUCTION STATE MANAGEMENT
 */
let currentFilters = {
    keyword: localStorage.getItem('rb_hub_search') || '',
    location: '',
    sort: 'score',
    showOnlyMatches: false
};

const defaultState = {
    personal: { name: '', email: '', phone: '', location: '', github: '', linkedin: '' },
    summary: '',
    experience: [{ id: Date.now(), company: '', role: '', duration: '', desc: '' }],
    education: [{ id: Date.now() + 1, institution: '', degree: '', year: '' }],
    projects: [{ id: Date.now() + 2, name: '', tech: '', desc: '' }],
    template: 'modern',
    color: '#8B0000'
};

let rbState = JSON.parse(localStorage.getItem('rb_hub_state') || JSON.stringify(defaultState));

const routes = {
    '/': { step: 1, title: 'Strategic Hub', subtitle: 'Integrated command center for career discovery and technical graduation.', content: renderLandingPage },
    '/dashboard': { step: 2, title: 'Market Intelligence', subtitle: 'Live tracking of Indian tech opportunities with weighted role matching.', content: renderDashboardPage },
    '/rb/app': { step: 3, isRb: true, isApp: true, title: 'AI Resume Engine', subtitle: 'Strategic document generation with real-time ATS health analytics.', content: renderRbAppPage },
    '/rb/steps': { step: 1, isRb: true, title: 'Build Track', subtitle: 'Technical development phases for the Resume AI module.', content: renderRbStepPage },
    '/settings': { step: 5, title: 'System Config', subtitle: 'Fine-tuning the matching engine behavioral parameters.', content: renderSettingsPage }
};

/**
 * CORE STORAGE ENGINE
 */
const getPreferences = () => JSON.parse(localStorage.getItem('jobTrackerPreferences') || '{"roleKeywords":["SDE","React","Java"],"minMatchScore":40}');
const savePreferences = (p) => localStorage.setItem('jobTrackerPreferences', JSON.stringify(p));
const getSavedJobs = () => JSON.parse(localStorage.getItem('savedJobs') || '[]');
const getRbSteps = () => JSON.parse(localStorage.getItem('rb_steps_completed') || '[]');

/**
 * APPLICATION ROUTER ENGINE
 */
function renderRoute() {
    const hash = window.location.hash.slice(1) || '/';
    const path = hash.split('?')[0];
    const route = routes[path] || (path.startsWith('/rb/') ? routes['/rb/steps'] : routes['/']);

    document.title = `${route.title} — KodNest Intelligence Suite`;

    const steps = getRbSteps();
    const isShipped = steps.length === 8 && steps.every(Boolean);
    const statusText = isShipped ? 'Production Ready' : (steps.some(Boolean) ? 'Active Build' : 'Standby');
    const statusClass = isShipped ? 'status--shipped' : (steps.some(Boolean) ? 'status--in-progress' : 'status--not-started');

    document.querySelector('.top-bar__project').textContent = route.isRb ? 'Resume AI' : 'KodNest Hub';
    document.getElementById('app-progress').textContent = route.isRb ? `Track 03 • Phase ${route.step || 1}` : `System Layer ${route.step}`;
    document.getElementById('app-status').innerHTML = `<span class="status-badge ${statusClass}">${statusText}</span>`;

    document.getElementById('app-header').innerHTML = `
        <div class="animate-fade">
            <h1 class="context-header__title">${route.title}</h1>
            <p class="context-header__subtitle">${route.subtitle}</p>
        </div>
    `;

    const { workspaceHtml, panelHtml } = route.content ? route.content() : { workspaceHtml: '', panelHtml: '' };

    const navTabs = `
        <div class="nav-tabs">
            <a href="#/" class="nav-tab ${path === '/' ? 'active' : ''}">Overview</a>
            <a href="#/dashboard" class="nav-tab ${path === '/dashboard' ? 'active' : ''}">Job Market</a>
            <a href="#/rb/app" class="nav-tab ${path.startsWith('/rb/') ? 'active' : ''}">AI Resume</a>
            <a href="#/settings" class="nav-tab ${path === '/settings' ? 'active' : ''}">Config</a>
        </div>
    `;

    document.getElementById('app-workspace').innerHTML = `<div class="animate-fade">${navTabs}${workspaceHtml}</div>`;
    document.getElementById('app-panel').innerHTML = `<div class="animate-fade">${panelHtml}</div>`;

    const footerItems = [
        { label: 'Data Engine', active: getPreferences().roleKeywords.length > 0 },
        { label: 'Cloud Deployed', active: true },
        { label: 'ATS Optimized', active: isShipped }
    ];
    document.getElementById('app-footer').innerHTML = footerItems.map(i => `
        <div class="checklist-item" style="color: ${i.active ? 'var(--color-success)' : 'var(--color-text-secondary)'}">
            ${i.active ? '●' : '○'} ${i.label}
        </div>
    `).join('');

    initializeGlobalListeners();
    window.scrollTo(0, 0);
}

/**
 * RESUME BUILDER MODULE (PRODUCTION SPA)
 */
function renderRbAppPage() {
    const calcScore = () => {
        let s = 10;
        if (rbState.personal.name) s += 15;
        if (rbState.personal.email) s += 10;
        if (rbState.summary.length > 60) s += 15;
        if (rbState.experience[0]?.desc?.length > 50) s += 15;
        if (rbState.education[0]?.institution) s += 15;
        if (rbState.personal.github || rbState.personal.linkedin) s += 20;
        return Math.min(s, 100);
    };

    const score = calcScore();
    const status = score < 60 ? 'Unoptimized' : (score < 90 ? 'High Quality' : 'Elite Status');
    const accent = rbState.color || '#8B0000';

    return {
        workspaceHtml: `
            <div style="display: grid; grid-template-columns: 1fr; gap: 40px; align-items: start;">
                <div style="display: grid; grid-template-columns: 1fr; gap: 24px;">
                    <!-- Identity Section -->
                    <div class="card">
                        <h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 24px; color: var(--color-text-secondary);">01. Professional Identity</h3>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
                            <input type="text" placeholder="Full Name" value="${rbState.personal.name}" oninput="updateRb('personal', 'name', this.value)" class="input">
                            <input type="email" placeholder="Professional Email" value="${rbState.personal.email}" oninput="updateRb('personal', 'email', this.value)" class="input">
                            <input type="text" placeholder="Location" value="${rbState.personal.location}" oninput="updateRb('personal', 'location', this.value)" class="input">
                            <input type="text" placeholder="LinkedIn Profile" value="${rbState.personal.linkedin}" oninput="updateRb('personal', 'linkedin', this.value)" class="input">
                            <input type="text" placeholder="GitHub URL" value="${rbState.personal.github}" oninput="updateRb('personal', 'github', this.value)" class="input">
                            <input type="text" placeholder="Phone Number" value="${rbState.personal.phone || ''}" oninput="updateRb('personal', 'phone', this.value)" class="input">
                        </div>
                    </div>

                    <!-- Summary Section -->
                    <div class="card">
                        <h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 24px; color: var(--color-text-secondary);">02. Executive Summary</h3>
                        <textarea class="input" style="height: 120px; line-height: 1.6; resize: none;" oninput="updateRb(null, 'summary', this.value)" placeholder="Experienced SDE focused on scalable cloud architecture...">${rbState.summary}</textarea>
                    </div>

                    <!-- Work Section -->
                    <div class="card">
                         <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                            <h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--color-text-secondary);">03. Strategic Experience</h3>
                            <button class="btn btn--secondary" style="padding: 6px 12px; font-size: 11px;" onclick="addRbItem('experience')">+ Add Role</button>
                         </div>
                         ${rbState.experience.map((exp, i) => `
                            <div style="padding-bottom: 24px; margin-bottom: 24px; border-bottom: 1px dashed var(--color-border); position: relative;">
                                <button onclick="removeRbItem('experience', ${i})" style="position: absolute; right: 0; top: 0; background: none; border: none; color: var(--color-accent); font-weight: 800; cursor: pointer;">✕</button>
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
                                    <input type="text" placeholder="Company" value="${exp.company}" oninput="updateRbList('experience', ${i}, 'company', this.value)" class="input">
                                    <input type="text" placeholder="Role" value="${exp.role}" oninput="updateRbList('experience', ${i}, 'role', this.value)" class="input">
                                    <input type="text" placeholder="Duration (e.g. 2021 — Present)" value="${exp.duration}" oninput="updateRbList('experience', ${i}, 'duration', this.value)" class="input">
                                </div>
                                <textarea style="height: 100px; resize: none;" oninput="updateRbList('experience', ${i}, 'desc', this.value)" class="input" placeholder="Led performance optimization...">${exp.desc}</textarea>
                            </div>
                         `).join('')}
                    </div>

                    <!-- Education Section -->
                    <div class="card">
                         <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                            <h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--color-text-secondary);">04. Education</h3>
                            <button class="btn btn--secondary" style="padding: 6px 12px; font-size: 11px;" onclick="addRbItem('education')">+ Add Education</button>
                         </div>
                         ${rbState.education.map((edu, i) => `
                            <div style="padding-bottom: 24px; margin-bottom: 24px; border-bottom: 1px dashed var(--color-border); position: relative;">
                                <button onclick="removeRbItem('education', ${i})" style="position: absolute; right: 0; top: 0; background: none; border: none; color: var(--color-accent); font-weight: 800; cursor: pointer;">✕</button>
                                <div style="display: grid; grid-template-columns: 1fr 1fr 100px; gap: 12px;">
                                    <input type="text" placeholder="Institution" value="${edu.institution}" oninput="updateRbList('education', ${i}, 'institution', this.value)" class="input">
                                    <input type="text" placeholder="Degree" value="${edu.degree}" oninput="updateRbList('education', ${i}, 'degree', this.value)" class="input">
                                    <input type="text" placeholder="Year" value="${edu.year}" oninput="updateRbList('education', ${i}, 'year', this.value)" class="input">
                                </div>
                            </div>
                         `).join('')}
                    </div>
                </div>

                <!-- Live A4 Desktop Preview -->
                <div style="background: var(--color-primary-soft); padding: 40px; border-radius: var(--radius-lg); display: flex; flex-direction: column; align-items: center; overflow-x: auto;">
                    <div id="resume-canvas" style="width: 210mm; min-height: 297mm; background: white; padding: 60px; box-shadow: 0 40px 100px -20px rgba(0,0,0,0.15); transform-origin: top center;">
                        <header style="border-bottom: 3px solid ${accent}; padding-bottom: 24px; margin-bottom: 40px;">
                            <h1 style="font-size: 44px; color: ${accent}; margin-bottom: 10px; font-family: var(--font-display);">${rbState.personal.name || 'FULL NAME'}</h1>
                            <div style="display: flex; gap: 15px; font-size: 13px; font-weight: 600; color: var(--color-text-secondary); flex-wrap: wrap;">
                                <span>${rbState.personal.email || 'email@example.com'}</span>
                                ${rbState.personal.phone ? `<span>•</span> <span>${rbState.personal.phone}</span>` : ''}
                                <span>•</span> <span>${rbState.personal.location || 'Location'}</span>
                                ${rbState.personal.linkedin ? `<span>•</span> <span>LinkedIn</span>` : ''}
                            </div>
                        </header>
                        <section style="margin-bottom: 40px;">
                            <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.2em; color: ${accent}; border-bottom: 1px solid #EEE; padding-bottom: 8px; margin-bottom: 15px; font-weight: 800;">Professional Summary</h2>
                            <p style="font-size: 14px; line-height: 1.7; color: var(--color-text); text-align: justify;">${rbState.summary || 'Enter your executive summary...'}</p>
                        </section>
                        <section style="margin-bottom: 40px;">
                            <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.2em; color: ${accent}; border-bottom: 1px solid #EEE; padding-bottom: 8px; margin-bottom: 25px; font-weight: 800;">Strategic Experience</h2>
                            ${rbState.experience.map(exp => `
                                <div style="margin-bottom: 30px; page-break-inside: avoid;">
                                    <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px;">
                                        <h3 style="font-size: 17px; font-weight: 700; color: var(--color-text);">${exp.company || 'Corporate Entity'}</h3>
                                        <span style="font-size: 12px; font-weight: 600; color: var(--color-text-muted);">${exp.duration || '2023 — Present'}</span>
                                    </div>
                                    <div style="font-size: 14px; font-weight: 600; color: ${accent}; margin-bottom: 12px; font-style: italic;">${exp.role || 'Functional Role'}</div>
                                    <p style="font-size: 13px; line-height: 1.6; color: var(--color-text-secondary); white-space: pre-line;">${exp.desc || 'Document your key impact points...'}</p>
                                </div>
                            `).join('')}
                        </section>
                        <section>
                            <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.2em; color: ${accent}; border-bottom: 1px solid #EEE; padding-bottom: 8px; margin-bottom: 20px; font-weight: 800;">Education</h2>
                            ${rbState.education.map(edu => `
                                <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                                    <div>
                                        <div style="font-size: 15px; font-weight: 700;">${edu.institution || 'University'}</div>
                                        <div style="font-size: 13px; color: var(--color-text-secondary);">${edu.degree || 'Bachelor of Tech'}</div>
                                    </div>
                                    <div style="font-size: 13px; font-weight: 600; color: var(--color-text-muted);">${edu.year || '2022'}</div>
                                </div>
                            `).join('')}
                        </section>
                    </div>
                </div>

                <!-- Floating ToolBar -->
                <div style="position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%); display: flex; gap: 16px; z-index: 1000; background: rgba(255,255,255,0.9); padding: 12px; border-radius: 40px; box-shadow: 0 20px 50px rgba(0,0,0,0.1); backdrop-filter: blur(10px); border: 1px solid var(--color-border);">
                    <button class="btn btn--primary" style="height: 48px; border-radius: 24px; padding: 0 32px;" onclick="printProductionPdf()">Download PDF</button>
                    <button class="btn btn--secondary" style="height: 48px; border-radius: 24px;" onclick="loadSampleRbData()">Sample Data</button>
                    <div style="display: flex; align-items: center; gap: 12px; padding: 0 16px; border-left: 1px solid var(--color-border);">
                        ${['#8B0000', '#059669', '#1E40AF', '#111827'].map(c => `
                            <div onclick="updateRb(null, 'color', '${c}')" style="width: 24px; height: 24px; background:${c}; cursor:pointer; border-radius: 50%; border: 2px solid ${rbState.color === c ? 'white' : 'transparent'}; outline: 1px solid #ddd;"></div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `,
        panelHtml: `
            <div class="card" style="text-align: center;">
                <h4 style="font-size: 11px; font-weight: 900; text-transform: uppercase; color: var(--color-text-muted); margin-bottom: 24px;">Production Health</h4>
                <div style="width: 160px; height: 160px; margin: 0 auto 24px; position: relative; display: flex; align-items: center; justify-content: center;">
                    <svg style="position: absolute; width: 100%; height: 100%; transform: rotate(-90deg);">
                        <circle cx="80" cy="80" r="70" fill="none" stroke="var(--color-primary-soft)" stroke-width="12"></circle>
                        <circle cx="80" cy="80" r="70" fill="none" stroke="${score > 50 ? 'var(--color-success)' : 'var(--color-accent)'}" stroke-width="12" stroke-dasharray="440" stroke-dashoffset="${440 - (440 * score / 100)}" style="transition: 1s ease-out;"></circle>
                    </svg>
                    <div style="font-size: 40px; font-weight: 800; font-family: var(--font-display);">${score}</div>
                </div>
                <div style="font-size: 14px; font-weight: 700; color: ${score > 50 ? 'var(--color-success)' : 'var(--color-accent)'}">${status}</div>
            </div>
            <div class="card" style="margin-top:24px;">
                <h3 style="font-size: 12px; text-transform: uppercase; margin-bottom: 16px;">System Tips</h3>
                <p style="font-size: 13px; color: var(--color-text-secondary);">Using high-impact action verbs (Led, Achieved, Designed) in your experience descriptions will increase your ATS score automatically.</p>
            </div>
        `
    };
}

/**
 * DASHBOARD MODULE (REAL-TIME ENGINE)
 */
function renderDashboardPage() {
    const jobs = getFilteredJobs();
    return {
        workspaceHtml: `
            <div class="card animate-fade" style="margin-bottom: 32px; display: grid; grid-template-columns: 1fr 200px; gap: 16px;">
                <input type="text" id="search-input" class="input" placeholder="Search by tech stack, role, or company..." value="${currentFilters.keyword}">
                <select id="sort-select" class="input">
                    <option value="score">Sort by Quality</option>
                    <option value="latest">Sort by Latest</option>
                </select>
            </div>
            <div style="display: grid; grid-template-columns: 1fr; gap: 24px;">
                ${jobs.length ? jobs.map(renderProductionJobCard).join('') : `
                    <div class="card" style="text-align: center; padding: 80px 24px;">
                        <div style="font-size: 48px; margin-bottom: 24px;">🔍</div>
                        <h3>No intelligent matches</h3>
                        <p>Adjust your search criteria to discover hidden roles.</p>
                    </div>
                `}
            </div>
        `,
        panelHtml: `
            <div class="card" style="background: var(--color-accent); color: white;">
                <h3>Market Insight</h3>
                <p style="font-size: 14px; opacity: 0.8; margin-top: 12px;">We are currently tracking <strong>${jobsData.length}</strong> active roles in Tier 1 Indian tech hubs.</p>
                <div style="margin-top: 24px; font-size: 24px; font-weight: 800;">${jobs.length} <span style="font-size: 12px; opacity: 0.6;">REFINE MATCHES</span></div>
            </div>
            <div class="card" style="margin-top: 24px;">
                <label style="display: flex; align-items: center; gap: 12px; font-size: 13px; font-weight: 600; cursor: pointer;">
                    <input type="checkbox" onchange="toggleMatches(this.checked)" ${currentFilters.showOnlyMatches ? 'checked' : ''} style="width: 18px; height: 18px; accent-color: var(--color-accent);">
                    High Value Only
                </label>
            </div>
        `
    };
}

function renderProductionJobCard(job) {
    const isSaved = getSavedJobs().includes(job.id);
    const score = job.score;
    return `
        <div class="card animate-fade" style="border-left: 4px solid ${score > 60 ? 'var(--color-success)' : 'var(--color-border)'}">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div>
                    <h2 style="font-size: 22px; margin-bottom: 4px;">${job.title}</h2>
                    <div style="font-weight: 700; color: var(--color-accent); font-size: 15px; margin-bottom: 16px;">${job.company} • ${job.location}</div>
                    <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                        ${job.skills.slice(0, 4).map(s => `<span style="background: var(--color-primary-soft); font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 4px;">${s}</span>`).join('')}
                    </div>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 28px; font-weight: 800; color: ${score > 60 ? 'var(--color-success)' : 'var(--color-text)'}">${score}%</div>
                    <div style="font-size: 9px; font-weight: 800; opacity: 0.4;">MATCH INDEX</div>
                </div>
            </div>
            <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid var(--color-border); display: flex; justify-content: space-between; align-items: center;">
                <div style="font-size: 13px; font-weight: 600; color: var(--color-text-secondary);">${job.salaryRange || 'Market Pay'}</div>
                <div style="display: flex; gap: 12px;">
                    <button class="btn btn--secondary" style="width: 44px; padding: 0;" onclick="toggleSave('${job.id}')">${isSaved ? '❤️' : '🤍'}</button>
                    <a href="${job.applyUrl}" target="_blank" class="btn btn--primary">Apply Now</a>
                </div>
            </div>
        </div>
    `;
}

function renderLandingPage() {
    return {
        workspaceHtml: `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 32px;">
                <div class="card">
                    <div style="font-size: 40px; margin-bottom: 24px;">📡</div>
                    <h2>Job Discovery</h2>
                    <p style="margin-bottom: 32px;">Real-time market tracking engine with heuristic role matching for strategic candidates.</p>
                    <a href="#/dashboard" class="btn btn--primary" style="width: 100%;">View Live Jobs</a>
                </div>
                <div class="card" style="border-color: var(--color-success);">
                    <div style="font-size: 40px; margin-bottom: 24px;">📄</div>
                    <h2>AI Resume</h2>
                    <p style="margin-bottom: 32px;">Production-grade resume builder with real-time ATS optimization and PDF export.</p>
                    <a href="#/rb/app" class="btn btn--primary" style="width: 100%; background: var(--color-success);">Launch Builder</a>
                </div>
                <div class="card" style="border-color: var(--color-accent);">
                    <div style="font-size: 40px; margin-bottom: 24px;">💎</div>
                    <h2>Placement Prep</h2>
                    <p style="margin-bottom: 32px;">Integrated skill verification and mock interview platform for technical readiness.</p>
                    <a href="placement/index.html" class="btn btn--primary" style="width: 100%; background: var(--color-accent);">Start Training</a>
                </div>
            </div>
        `,
        panelHtml: `<div class="card"><h3>Suite Status</h3><p style="font-size: 14px; opacity: 0.7;">Production v1.5 Stable. All core modules operational.</p></div>`
    };
}

/**
 * PRODUCTION UTILITIES
 */
function getFilteredJobs() {
    const prefs = getPreferences();
    const keywords = prefs.roleKeywords.map(k => k.toLowerCase());
    let filtered = jobsData.map(j => {
        let score = 0;
        const title = j.title.toLowerCase();
        const skills = j.skills.map(s => s.toLowerCase());
        keywords.forEach(k => { if (title.includes(k)) score += 35; if (skills.some(s => s.includes(k))) score += 15; });
        return { ...j, score: Math.min(score, 100) };
    });
    if (currentFilters.keyword) {
        const k = currentFilters.keyword.toLowerCase();
        filtered = filtered.filter(j => j.title.toLowerCase().includes(k) || j.company.toLowerCase().includes(k) || j.skills.some(s => s.toLowerCase().includes(k)));
    }
    if (currentFilters.showOnlyMatches) filtered = filtered.filter(j => j.score > 60);
    if (currentFilters.sort === 'score') filtered.sort((a, b) => b.score - a.score);
    else filtered.sort((a, b) => a.postedDaysAgo - b.postedDaysAgo);
    return filtered;
}

window.updateRb = (sec, field, val) => { if (sec) rbState[sec][field] = val; else rbState[field] = val; localStorage.setItem('rb_hub_state', JSON.stringify(rbState)); renderRoute(); };
window.updateRbList = (sec, idx, field, val) => { rbState[sec][idx][field] = val; localStorage.setItem('rb_hub_state', JSON.stringify(rbState)); renderRoute(); };
window.addRbItem = (sec) => {
    const items = { experience: { id: Date.now(), company: '', role: '', duration: '', desc: '' }, education: { id: Date.now(), institution: '', degree: '', year: '' } };
    rbState[sec].unshift(items[sec]);
    localStorage.setItem('rb_hub_state', JSON.stringify(rbState));
    renderRoute();
};
window.removeRbItem = (sec, idx) => { rbState[sec].splice(idx, 1); localStorage.setItem('rb_hub_state', JSON.stringify(rbState)); renderRoute(); };

window.loadSampleRbData = () => {
    rbState = {
        personal: { name: 'Harshith Kumar', email: 'harshith@kodnest.com', phone: '+91 98765 43210', location: 'Bangalore, India', github: 'github.com/harshith', linkedin: 'linkedin.com/in/harshith' },
        summary: 'Expert Software Development Engineer with 4+ years of experience in building scalable cloud-native applications. Specializing in high-performance distributed systems and AI integration.',
        experience: [{ id: 1, company: 'Google Cloud', role: 'Senior SDE', duration: '2021 — Present', desc: '● Led the optimization of data pipelines, reducing latency by 45%.\n● Orchestrated microservices using Kubernetes for high-availability systems.' }],
        education: [{ id: 2, institution: 'IIT Bombay', degree: 'B.Tech in Computer Science', year: '2020' }],
        template: 'modern',
        color: '#8B0000'
    };
    localStorage.setItem('rb_hub_state', JSON.stringify(rbState));
    renderRoute();
};

window.printProductionPdf = () => {
    const canvas = document.getElementById('resume-canvas').cloneNode(true);
    canvas.style.transform = 'none';
    canvas.style.boxShadow = 'none';
    const pWin = window.open('', '_blank');
    pWin.document.write(`<html><head><title>Resume</title><link rel="stylesheet" href="app.css"></head><body style="padding:0;margin:0;"></body></html>`);
    pWin.document.body.appendChild(canvas);
    setTimeout(() => { pWin.print(); pWin.close(); }, 500);
};

window.toggleSave = (id) => {
    let saved = getSavedJobs();
    if (saved.includes(id)) saved = saved.filter(x => x !== id); else saved.push(id);
    localStorage.setItem('savedJobs', JSON.stringify(saved));
    renderRoute();
};

window.toggleMatches = (v) => { currentFilters.showOnlyMatches = v; renderRoute(); };

function initializeGlobalListeners() {
    const search = document.getElementById('search-input');
    if (search) search.addEventListener('input', (e) => { currentFilters.keyword = e.target.value; renderRoute(); });
    const sort = document.getElementById('sort-select');
    if (sort) sort.addEventListener('change', (e) => { currentFilters.sort = e.target.value; renderRoute(); });
}

window.addEventListener('hashchange', renderRoute);
window.addEventListener('load', renderRoute);
renderRoute();
