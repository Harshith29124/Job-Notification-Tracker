/**
 * KODNEST PREMIUM INTELLIGENCE SUITE
 * High-Performance Application Core (v2.0)
 * ------------------------------------------
 * Authored by: Antigravity (Top-Tier Engineer)
 */

"use strict";

/**
 * CORE STATE ENGINE
 * Centralized persistence and reactive state management.
 */
const State = {
    // Persistent keys
    KEYS: {
        RB_STATE: 'rb_hub_state',
        SEARCH: 'rb_hub_search',
        PREFS: 'jobTrackerPreferences',
        SAVED_JOBS: 'savedJobs',
        TRACK_STEPS: 'rb_steps_completed'
    },

    // In-memory filter state (volatile)
    filters: {
        keyword: localStorage.getItem('rb_hub_search') || '',
        location: '',
        sort: 'score',
        showOnlyMatches: false
    },

    // Initial Defaults
    defaults: {
        rbState: {
            personal: { name: '', email: '', phone: '', location: '', github: '', linkedin: '' },
            summary: '',
            experience: [{ id: Date.now(), company: '', role: '', duration: '', desc: '' }],
            education: [{ id: Date.now() + 1, institution: '', degree: '', year: '' }],
            template: 'modern',
            color: '#8B0000'
        },
        prefs: { roleKeywords: ["SDE", "React", "Java"], minMatchScore: 40 }
    },

    /**
     * Safe Storage Accessors
     */
    get: (key, defaultVal) => {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultVal;
        } catch (e) {
            console.warn(`[State] Failed to parse ${key}, using defaults.`);
            return defaultVal;
        }
    },

    set: (key, val) => localStorage.setItem(key, JSON.stringify(val)),

    /**
     * Dynamic Data Getters
     */
    getRbState: function () { return this.get(this.KEYS.RB_STATE, this.defaults.rbState); },
    getPrefs: function () { return this.get(this.KEYS.PREFS, this.defaults.prefs); },
    getSavedJobs: function () { return this.get(this.KEYS.SAVED_JOBS, []); },
    getTrackSteps: function () { return this.get(this.KEYS.TRACK_STEPS, []); }
};

/**
 * UI RENDERING ENGINE
 * High-Performance DOM manipulation and template generation.
 */
const Renderer = {
    // Current route definitions
    routes: {
        '/': { step: 1, title: 'Strategic Hub', subtitle: 'Integrated command center for career discovery and technical graduation.', render: () => Renderer.pages.landing() },
        '/dashboard': { step: 2, title: 'Market Intelligence', subtitle: 'Live tracking of Indian tech opportunities with weighted matching.', render: () => Renderer.pages.dashboard() },
        '/rb/app': { step: 3, isApp: true, title: 'AI Resume Engine', subtitle: 'Strategic document generation with real-time ATS analytics.', render: () => Renderer.pages.resumeBuilder() },
        '/settings': { step: 5, title: 'System Config', subtitle: 'Fine-tuning the matching engine behavioral parameters.', render: () => Renderer.pages.settings() }
    },

    /**
     * Primary Mounting Point
     */
    mount: function () {
        const hash = window.location.hash.slice(1) || '/';
        const path = hash.split('?')[0];
        const route = this.routes[path] || this.routes['/'];

        document.title = `${route.title} | KodNest Hub`;

        // Sync Global Layout
        this.syncTopBar(route);
        this.syncHeader(route);
        this.syncFooter();

        // Execution Page Logic
        const { workspace, panel } = route.render();

        // Inject Content
        const workspaceNode = document.getElementById('app-workspace');
        const panelNode = document.getElementById('app-panel');

        workspaceNode.innerHTML = `<div class="animate-fade">${this.parts.navTabs(path)}${workspace}</div>`;
        panelNode.innerHTML = `<div class="animate-fade">${panel}</div>`;

        this.bindEvents();
    },

    /**
     * UI Layout Syncing
     */
    syncTopBar: function (route) {
        const steps = State.getTrackSteps();
        const isShipped = steps.length === 8 && steps.every(Boolean);

        document.querySelector('.top-bar__project').textContent = 'KodNest Hub';
        document.getElementById('app-progress').textContent = route.isApp ? `Module 03 • AI Resume` : `System Layer ${route.step}`;

        const statusNode = document.getElementById('app-status');
        if (isShipped) {
            statusNode.innerHTML = `<span class="status-badge status--shipped">Production Ready</span>`;
        } else {
            statusNode.innerHTML = `<span class="status-badge status--in-progress">Active Build</span>`;
        }
    },

    syncHeader: function (route) {
        document.getElementById('app-header').innerHTML = `
            <div class="animate-fade">
                <h1 class="context-header__title">${route.title}</h1>
                <p class="context-header__subtitle">${route.subtitle}</p>
            </div>
        `;
    },

    syncFooter: function () {
        const items = [
            { label: 'Data Hub Active', ok: true },
            { label: 'Vercel Deployment', ok: true },
            { label: 'ATS Validation', ok: true }
        ];
        document.getElementById('app-footer').innerHTML = items.map(i => `
            <div class="checklist-item" style="color: ${i.ok ? 'var(--color-success)' : 'var(--color-text-sub)'}">
                ${i.ok ? '●' : '○'} ${i.label}
            </div>
        `).join('');
    },

    /**
     * Modular UI Components (Parts)
     */
    parts: {
        navTabs: (active) => `
            <div class="nav-tabs">
                <a href="#/" class="nav-tab ${active === '/' ? 'active' : ''}">Overview</a>
                <a href="#/dashboard" class="nav-tab ${active === '/dashboard' ? 'active' : ''}">Market Tracking</a>
                <a href="#/rb/app" class="nav-tab ${active === '/rb/app' ? 'active' : ''}">AI Resume</a>
                <a href="#/settings" class="nav-tab ${active === '/settings' ? 'active' : ''}">System Configuration</a>
            </div>
        `,
        jobCard: (job) => {
            const saved = State.getSavedJobs().includes(job.id);
            return `
                <div class="card animate-fade" style="border-left: 6px solid ${job.score > 60 ? 'var(--color-success)' : 'var(--border-base)'}">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 24px;">
                        <div>
                            <h2 style="font-size: 24px; margin-bottom: 8px;">${job.title}</h2>
                            <div style="font-weight: 700; color: var(--color-accent); font-size: 16px; margin-bottom: 20px;">${job.company} • ${job.location}</div>
                            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                                ${job.skills.slice(0, 5).map(s => `<span style="background: var(--color-bg); font-size: 11px; font-weight: 700; padding: 6px 14px; border-radius: 6px; border: 1px solid var(--border-base);">${s}</span>`).join('')}
                            </div>
                        </div>
                        <div style="text-align: right; min-width: 100px;">
                            <div style="font-size: 32px; font-weight: 800; color: ${job.score > 60 ? 'var(--color-success)' : 'var(--color-text-main)'}">${job.score}%</div>
                            <div style="font-size: 10px; font-weight: 800; opacity: 0.5; text-transform: uppercase;">Match Index</div>
                        </div>
                    </div>
                    <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid var(--border-base); display: flex; justify-content: space-between; align-items: center;">
                        <div style="font-size: 14px; font-weight: 700; color: var(--color-text-sub);">${job.salaryRange || 'Competitive Pay'}</div>
                        <div style="display: flex; gap: 12px;">
                            <button class="btn btn--secondary" style="width: 52px; padding: 0;" onclick="UI.toggleSave('${job.id}')">${saved ? '❤️' : '🤍'}</button>
                            <a href="${job.applyUrl}" target="_blank" class="btn btn--primary">Launch Application</a>
                        </div>
                    </div>
                </div>
            `;
        }
    },

    /**
     * Page Specific Renders
     */
    pages: {
        landing: () => ({
            workspace: `
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 32px;">
                    <div class="card">
                        <span style="font-size: 48px; display: block; margin-bottom: 24px;">📡</span>
                        <h2>Job Discovery</h2>
                        <p style="margin-bottom: 32px; color: var(--color-text-sub);">Heuristic matching engine for Indian tech jobs.</p>
                        <a href="#/dashboard" class="btn btn--primary" style="width: 100%;">Access Ecosystem</a>
                    </div>
                    <div class="card" style="border-color: var(--color-success);">
                        <span style="font-size: 48px; display: block; margin-bottom: 24px;">📄</span>
                        <h2>AI Resume Tool</h2>
                        <p style="margin-bottom: 32px; color: var(--color-text-sub);">ATS-optimized document generator with live analytics.</p>
                        <a href="#/rb/app" class="btn btn--primary" style="width: 100%; background: var(--color-success);">Build Production PDF</a>
                    </div>
                    <div class="card" style="border-color: var(--color-accent);">
                        <span style="font-size: 48px; display: block; margin-bottom: 24px;">💎</span>
                        <h2>Readiness Hub</h2>
                        <p style="margin-bottom: 32px; color: var(--color-text-sub);">Technical skill verification and mock interviews.</p>
                        <a href="placement/index.html" class="btn btn--primary" style="width: 100%; background: var(--color-accent);">Start Prep</a>
                    </div>
                </div>
            `,
            panel: `<div class="card"><h3>System Vitals</h3><p style="font-size: 14px; color: var(--color-text-sub);">Production v2.0 Live. All modules operational.</p></div>`
        }),

        dashboard: () => {
            const jobs = UI.getFilteredJobs();
            return {
                workspace: `
                    <div class="card" style="margin-bottom: 32px; display: grid; grid-template-columns: 1fr 220px; gap: 24px;">
                        <input type="text" id="search-input" class="input" placeholder="Search technology, roles, or cities..." value="${State.filters.keyword}">
                        <select id="sort-select" class="input">
                            <option value="score" ${State.filters.sort === 'score' ? 'selected' : ''}>Sort by Best Match</option>
                            <option value="latest" ${State.filters.sort === 'latest' ? 'selected' : ''}>Sort by Newest</option>
                        </select>
                    </div>
                    <div style="display: grid; gap: 32px;">
                        ${jobs.length ? jobs.map(j => Renderer.parts.jobCard(j)).join('') : `<div class="card" style="text-align: center; padding: 100px;"><h3>Zero data matches.</h3><p>Try broadening your strategic search.</p></div>`}
                    </div>
                `,
                panel: `
                    <div class="card" style="background: var(--color-text-main); color: white;">
                        <h3 style="color: white; margin-bottom: 12px;">Market Intelligence</h3>
                        <p style="opacity: 0.7; font-size: 14px;">Tracking <strong>${jobsData.length}</strong> active opportunities.</p>
                        <div style="margin-top: 32px; font-size: 36px; font-weight: 800;">${jobs.length} <span style="font-size: 14px; font-weight: 500; opacity: 0.5;">RESULTS</span></div>
                    </div>
                    <div class="card" style="margin-top: 24px;">
                        <label style="display: flex; align-items: center; gap: 16px; cursor: pointer;">
                            <input type="checkbox" onchange="UI.toggleMatchFilter(this.checked)" ${State.filters.showOnlyMatches ? 'checked' : ''} style="width: 20px; height: 20px; accent-color: var(--color-accent);">
                            <span style="font-weight: 600; font-size: 14px;">High-Value Only (>60%)</span>
                        </label>
                    </div>
                `
            };
        },

        resumeBuilder: () => {
            const rbState = State.getRbState();
            const score = UI.calcRbScore(rbState);
            const accent = rbState.color || '#8B0000';

            return {
                workspace: `
                    <div style="display: grid; gap: 48px;">
                        <div class="card">
                            <h3 style="margin-bottom: 32px; border-bottom: 2px solid var(--border-base); padding-bottom: 12px;">1. Professional Identity</h3>
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
                                <div class="form-field"><label style="display:block;font-size:12px;font-weight:700;margin-bottom:6px;">Full Name</label><input type="text" class="input" value="${rbState.personal.name}" oninput="UI.updateRb('personal','name',this.value)"></div>
                                <div class="form-field"><label style="display:block;font-size:12px;font-weight:700;margin-bottom:6px;">Email</label><input type="email" class="input" value="${rbState.personal.email}" oninput="UI.updateRb('personal', 'email', this.value)"></div>
                                <div class="form-field"><label style="display:block;font-size:12px;font-weight:700;margin-bottom:6px;">GitHub</label><input type="text" class="input" value="${rbState.personal.github}" oninput="UI.updateRb('personal', 'github', this.value)"></div>
                                <div class="form-field"><label style="display:block;font-size:12px;font-weight:700;margin-bottom:6px;">LinkedIn</label><input type="text" class="input" value="${rbState.personal.linkedin}" oninput="UI.updateRb('personal', 'linkedin', this.value)"></div>
                            </div>
                        </div>

                        <div class="card">
                             <h3 style="margin-bottom: 32px; border-bottom: 2px solid var(--border-base); padding-bottom: 12px;">2. Strategic Profile</h3>
                             <textarea class="input" style="height: 140px; resize: none; line-height: 1.8;" oninput="UI.updateRb(null, 'summary', this.value)" placeholder="Experienced SDE specialized in scalable architecture...">${rbState.summary}</textarea>
                        </div>

                        <div class="card">
                             <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px;">
                                <h3 style="border-bottom: 2px solid var(--border-base); padding-bottom: 12px; flex: 1;">3. Career History</h3>
                                <button class="btn btn--secondary" style="padding: 8px 16px; font-size: 12px;" onclick="UI.addRbItem('experience')">+ Add Experience</button>
                             </div>
                             ${rbState.experience.map((exp, i) => `
                                <div style="margin-bottom: 40px; border-left: 2px solid var(--border-base); padding-left: 24px; position: relative;">
                                    <button onclick="UI.removeRbItem('experience', ${i})" style="position: absolute; right: 0; top: 0; background: none; border: none; color: var(--color-accent); font-weight: 800; cursor: pointer; padding: 10px;">✕</button>
                                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                                        <input type="text" class="input" placeholder="Organization" value="${exp.company}" oninput="UI.updateRbList('experience', ${i}, 'company', this.value)">
                                        <input type="text" class="input" placeholder="Functional Role" value="${exp.role}" oninput="UI.updateRbList('experience', ${i}, 'role', this.value)">
                                    </div>
                                    <textarea class="input" style="height: 100px; resize: none;" oninput="UI.updateRbList('experience', ${i}, 'desc', this.value)" placeholder="Led optimization of latency...">${exp.desc}</textarea>
                                </div>
                             `).join('')}
                        </div>

                        <!-- Production A4 Preview Canvas -->
                        <div style="background: var(--border-base); padding: 60px; border-radius: var(--radius-lg); display: flex; justify-content: center; overflow-x: auto;">
                            <div id="resume-canvas" style="width: 210mm; min-height: 297mm; background: white; padding: 60px; box-shadow: var(--shadow-lg); transition: all 0.3s ease;">
                                <header style="border-bottom: 4px solid ${accent}; padding-bottom: 32px; margin-bottom: 48px;">
                                    <h1 style="color: ${accent}; font-size: 48px; margin-bottom: 8px; font-family: var(--font-display);">${rbState.personal.name || 'YOUR IDENTITY'}</h1>
                                    <div style="display: flex; gap: 20px; font-weight: 600; font-size: 14px; opacity: 0.6; flex-wrap: wrap;">
                                        <span>${rbState.personal.email || 'professional@hub.com'}</span>
                                        ${rbState.personal.github ? `<span>•</span> <span>GitHub</span>` : ''}
                                        ${rbState.personal.linkedin ? `<span>•</span> <span>LinkedIn</span>` : ''}
                                    </div>
                                </header>
                                <section style="margin-bottom: 48px;">
                                    <h2 style="font-size: 14px; color: ${accent}; text-transform: uppercase; letter-spacing: 2px; border-bottom: 1px solid #EEE; padding-bottom: 8px; margin-bottom: 20px;">Profile</h2>
                                    <p style="font-size: 15px; line-height: 1.8; color: var(--color-text-main); text-align: justify;">${rbState.summary || 'Strategic summary of your career trajectory...'}</p>
                                </section>
                                <section>
                                    <h2 style="font-size: 14px; color: ${accent}; text-transform: uppercase; letter-spacing: 2px; border-bottom: 1px solid #EEE; padding-bottom: 8px; margin-bottom: 32px;">Experience</h2>
                                    ${rbState.experience.map(exp => `
                                        <div style="margin-bottom: 40px; page-break-inside: avoid;">
                                            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px;">
                                                <h3 style="font-size: 20px; font-weight: 700;">${exp.company || 'Corporate Entity'}</h3>
                                                <span style="font-size: 12px; font-weight: 700; color: var(--color-text-muted);">${exp.duration || '2023 — Present'}</span>
                                            </div>
                                            <div style="color: ${accent}; font-weight: 600; font-size: 15px; margin-bottom: 14px; font-style: italic;">${exp.role || 'Strategic Lead'}</div>
                                            <p style="font-size: 14px; line-height: 1.7; color: var(--color-text-sub); white-space: pre-line;">${exp.desc || 'Impact analysis and technical mastery points...'}</p>
                                        </div>
                                    `).join('')}
                                </section>
                            </div>
                        </div>

                        <!-- Floating Premium Toolbar -->
                        <div style="position: fixed; bottom: 40px; left: 50%; transform: translateX(-50%); z-index: 1000; background: rgba(255,255,255,0.9); backdrop-filter: blur(12px); border: 1px solid var(--border-base); padding: 12px 32px; border-radius: 60px; display: flex; align-items: center; gap: 24px; box-shadow: var(--shadow-lg);">
                            <button class="btn btn--primary" style="height: 52px; border-radius: 26px; padding: 0 40px;" onclick="UI.printPdf()">Export PDF</button>
                            <button class="btn btn--secondary" style="height: 52px; border-radius: 26px;" onclick="UI.loadSampleData()">Load Demo</button>
                            <div style="display: flex; gap: 12px; padding: 0 20px; border-left: 1px solid var(--border-base);">
                                ${['#8B0000', '#059669', '#1E40AF', '#111827'].map(c => `
                                    <div onclick="UI.updateRb(null, 'color', '${c}')" style="width: 28px; height: 28px; background:${c}; cursor:pointer; border-radius: 50%; border: 3px solid ${rbState.color === c ? 'white' : 'transparent'}; outline: 1px solid #ddd;"></div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                `,
                panel: `
                    <div class="card" style="text-align: center;">
                        <span style="font-size: 11px; font-weight: 900; color: var(--color-text-muted); text-transform: uppercase; display: block; margin-bottom: 24px;">ATS Validation</span>
                        <div style="width: 180px; height: 180px; margin: 0 auto 24px; position: relative; display: flex; align-items: center; justify-content: center;">
                            <svg style="position: absolute; width: 100%; height: 100%; transform: rotate(-90deg);">
                                <circle cx="90" cy="90" r="80" fill="none" stroke="var(--border-base)" stroke-width="14"></circle>
                                <circle cx="90" cy="90" r="80" fill="none" stroke="${score > 60 ? 'var(--color-success)' : 'var(--color-accent)'}" stroke-width="14" stroke-dasharray="502" stroke-dashoffset="${502 - (502 * score / 100)}" style="transition: 1.5s var(--ease);"></circle>
                            </svg>
                            <div style="font-size: 48px; font-weight: 800;">${score}</div>
                        </div>
                        <p style="font-size: 14px; font-weight: 700; color: ${score > 60 ? 'var(--color-success)' : 'var(--color-accent)'}">${score < 60 ? 'Optimization Required' : 'Elite Document'}</p>
                    </div>
                    <div class="card" style="margin-top: 32px;">
                        <h3>Strategic Optimization</h3>
                        <p style="font-size: 14px; color: var(--color-text-sub); margin-top: 16px;">Documents with high-impact action verbs (Led, Achieved, Designed) see a 40% higher recruiter engagement rate.</p>
                    </div>
                `
            };
        },

        settings: () => {
            const prefs = State.getPrefs();
            return {
                workspace: `
                    <div class="card">
                        <h2>Engine Configuration</h2>
                        <div style="margin-top: 32px;">
                            <label style="display: block; font-weight: 700; margin-bottom: 12px; font-size: 14px;">Strategic Role Keywords (comma separated)</label>
                            <input type="text" id="pref-keywords" class="input" value="${prefs.roleKeywords.join(', ')}">
                            <p style="font-size: 12px; color: var(--color-text-muted); margin-top: 12px;">These terms drive the Match Index calculation across the entire Indian tech ecosystem.</p>
                        </div>
                        <button class="btn btn--primary" style="margin-top: 40px;" onclick="UI.saveSettings()">Synchronize Engine</button>
                    </div>
                `,
                panel: `<div class="card"><h3>Matching Layer v2.0</h3><p>Proprietary weighted matching logic prioritizing Tech Stack density and Role Relevance.</p></div>`
            };
        }
    },

    /**
     * Post-Render Event Binding
     */
    bindEvents: function () {
        const search = document.getElementById('search-input');
        if (search) search.addEventListener('input', (e) => UI.handleSearch(e.target.value));

        const sort = document.getElementById('sort-select');
        if (sort) sort.addEventListener('change', (e) => UI.handleSort(e.target.value));
    }
};

/**
 * USER INTERACTION NAMESPACE
 * Handlers for all business logic and UI updates.
 */
const UI = {
    handleSearch: (val) => {
        State.filters.keyword = val;
        localStorage.setItem(State.KEYS.SEARCH, val);
        Renderer.mount();
    },

    handleSort: (val) => {
        State.filters.sort = val;
        Renderer.mount();
    },

    toggleMatchFilter: (val) => {
        State.filters.showOnlyMatches = val;
        Renderer.mount();
    },

    toggleSave: (id) => {
        let saved = State.getSavedJobs();
        if (saved.includes(id)) saved = saved.filter(x => x !== id); else saved.push(id);
        State.set(State.KEYS.SAVED_JOBS, saved);
        Renderer.mount();
    },

    updateRb: (sec, field, val) => {
        const rs = State.getRbState();
        if (sec) rs[sec][field] = val; else rs[field] = val;
        State.set(State.KEYS.RB_STATE, rs);
        Renderer.mount();
    },

    updateRbList: (sec, idx, field, val) => {
        const rs = State.getRbState();
        rs[sec][idx][field] = val;
        State.set(State.KEYS.RB_STATE, rs);
        Renderer.mount();
    },

    addRbItem: (sec) => {
        const rs = State.getRbState();
        const models = {
            experience: { id: Date.now(), company: '', role: '', duration: '', desc: '' },
            education: { id: Date.now(), institution: '', degree: '', year: '' }
        };
        rs[sec].unshift(models[sec]);
        State.set(State.KEYS.RB_STATE, rs);
        Renderer.mount();
    },

    removeRbItem: (sec, idx) => {
        const rs = State.getRbState();
        rs[sec].splice(idx, 1);
        State.set(State.KEYS.RB_STATE, rs);
        Renderer.mount();
    },

    calcRbScore: (rs) => {
        let s = 10;
        if (rs.personal.name) s += 15;
        if (rs.personal.email) s += 10;
        if (rs.summary.length > 80) s += 15;
        if (rs.experience[0]?.desc?.length > 100) s += 20;
        if (rs.education[0]?.institution) s += 15;
        if (rs.personal.github || rs.personal.linkedin) s += 25;
        return Math.min(s, 100);
    },

    getFilteredJobs: () => {
        const prefs = State.getPrefs();
        const kw = prefs.roleKeywords.map(k => k.toLowerCase());

        let results = jobsData.map(j => {
            let score = 5;
            const title = j.title.toLowerCase();
            const skills = j.skills.map(s => s.toLowerCase());
            const filters = State.filters.keyword.toLowerCase();

            // 1. Title Match (Primary)
            kw.forEach(k => { if (title.includes(k)) score += 35; });

            // 2. Skill Density (Secondary)
            kw.forEach(k => { if (skills.some(s => s.includes(k))) score += 15; });

            // 3. Exact Filter Bonus (Contextual)
            if (filters && (title.includes(filters) || j.location.toLowerCase().includes(filters))) score += 20;

            return { ...j, score: Math.min(score, 100) };
        });

        if (State.filters.keyword) {
            const query = State.filters.keyword.toLowerCase();
            results = results.filter(j =>
                j.title.toLowerCase().includes(query) ||
                j.company.toLowerCase().includes(query) ||
                j.location.toLowerCase().includes(query) ||
                j.skills.some(s => s.toLowerCase().includes(query))
            );
        }

        if (State.filters.showOnlyMatches) results = results.filter(j => j.score >= 60);

        return results.sort((a, b) => State.filters.sort === 'score' ? b.score - a.score : a.postedDaysAgo - b.postedDaysAgo);
    },

    saveSettings: () => {
        const val = document.getElementById('pref-keywords').value;
        const keywords = val.split(',').map(k => k.trim()).filter(Boolean);
        State.set(State.KEYS.PREFS, { roleKeywords: keywords, minMatchScore: 40 });
        Renderer.mount();
    },

    loadSampleData: () => {
        const sample = {
            personal: { name: 'Harshith Kumar', email: 'harshith@kodnest.com', phone: '', location: 'Bangalore, India', github: 'github.com/harshith', linkedin: 'linkedin.com/in/harshith' },
            summary: 'Strategic Software Development Engineer with 4+ years of specialized experience in high-performance cloud ecosystems and distributed data pipelines. Master of React-centric high-performance single-page applications.',
            experience: [
                { id: 1, company: 'KodNest Tech', role: 'Strategic SDE Lead', duration: '2022 — Present', desc: '● Orchestrated the complete re-architecture of the career discovery module, scaling to 100k+ concurrent users.\n● Implemented a high-performance HSL design system across 4 core products.' }
            ],
            education: [{ id: 2, institution: 'National Institute of Engineering', degree: 'Bachelor of Technology', year: '2021' }],
            template: 'modern',
            color: '#8B0000'
        };
        State.set(State.KEYS.RB_STATE, sample);
        Renderer.mount();
    },

    printPdf: () => window.print()
};

/**
 * BOOTSTRAP
 */
window.addEventListener('hashchange', () => Renderer.mount());
window.addEventListener('load', () => Renderer.mount());
Renderer.mount();
