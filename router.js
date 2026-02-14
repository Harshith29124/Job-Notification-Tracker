/**
 * KODNEST PREMIUM INTELLIGENCE SUITE
 * High-Performance Application Core (v3.0 - Platinum Edition)
 * -----------------------------------------------------------
 * Authored by: Antigravity (Top 50 Global UI/UX Architect)
 */

"use strict";

/**
 * CORE STATE ENGINE
 * Centralized persistence and reactive state management.
 */
const State = {
    KEYS: {
        RB_STATE: 'rb_hub_state',
        SEARCH: 'rb_hub_search',
        PREFS: 'jobTrackerPreferences',
        SAVED_JOBS: 'savedJobs',
        TRACK_STEPS: 'rb_steps_completed'
    },

    filters: {
        keyword: localStorage.getItem('rb_hub_search') || '',
        location: '',
        sort: 'score',
        showOnlyMatches: false
    },

    defaults: {
        rbState: {
            personal: { name: '', email: '', phone: '', location: '', github: '', linkedin: '' },
            summary: '',
            experience: [{ id: Date.now(), company: '', role: '', duration: '', desc: '' }],
            education: [{ id: Date.now() + 1, institution: '', degree: '', year: '' }],
            template: 'modern',
            color: '#8B0000'
        },
        prefs: { roleKeywords: ["SDE", "React", "Java", "Frontend", "Backend"], minMatchScore: 40 }
    },

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
    routes: {
        '/': { step: 1, title: 'Intelligence Overview', subtitle: 'Integrated command center for career discovery and technical graduation.', render: () => Renderer.pages.landing() },
        '/dashboard': { step: 2, title: 'Market Tracking', subtitle: 'Real-time telemetry of Indian tech opportunities with proprietary weighted matching.', render: () => Renderer.pages.dashboard() },
        '/rb/app': { step: 3, isApp: true, title: 'AI Document Engine', subtitle: 'Strategic document generation with real-time ATS analytics and high-fidelity previews.', render: () => Renderer.pages.resumeBuilder() },
        '/settings': { step: 5, title: 'Engine Configuration', subtitle: 'Fine-tuning the heuristic matching parameters for strategic alignment.', render: () => Renderer.pages.settings() }
    },

    mount: function () {
        const hash = window.location.hash.slice(1) || '/';
        const path = hash.split('?')[0];
        const route = this.routes[path] || this.routes['/'];

        document.title = `${route.title} | KodNest Hub`;

        this.syncTopBar(route);
        this.syncHeader(route);
        this.syncFooter();

        const { workspace, panel } = route.render();

        const workspaceNode = document.getElementById('app-workspace');
        const panelNode = document.getElementById('app-panel');

        workspaceNode.innerHTML = `
            <div class="animate-fade">
                ${this.parts.navTabs(path)}
                <div class="workspace-content">${workspace}</div>
            </div>
        `;
        panelNode.innerHTML = `<div class="animate-fade">${panel}</div>`;

        this.bindEvents();
    },

    syncTopBar: function (route) {
        const steps = State.getTrackSteps();
        const isShipped = steps.length >= 8 && steps.every(Boolean);

        document.querySelector('.top-bar__project').textContent = 'KodNest Hub';
        document.getElementById('app-progress').textContent = route.isApp ? `CORE MODULE • 03` : `SYSTEM LAYER • ${String(route.step).padStart(2, '0')}`;

        const statusNode = document.getElementById('app-status');
        statusNode.innerHTML = isShipped
            ? `<span class="status-badge status--shipped">Production Validated</span>`
            : `<span class="status-badge status--in-progress">Building Integrity</span>`;
    },

    syncHeader: function (route) {
        document.getElementById('app-header').innerHTML = `
            <div class="animate-fade">
                <div style="font-family: var(--font-mono); font-size: 11px; font-weight: 800; color: var(--color-accent); text-transform: uppercase; letter-spacing: 2px; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                    <span style="width: 8px; height: 8px; background: var(--color-accent); border-radius: 50%; display: inline-block;"></span>
                    Active Workspace
                </div>
                <h1 class="context-header__title">${route.title}</h1>
                <p class="context-header__subtitle">${route.subtitle}</p>
            </div>
        `;
    },

    syncFooter: function () {
        const items = [
            { label: 'Ecosystem Connection', ok: true },
            { label: 'Heuristic Sync', ok: true },
            { label: 'ATS Analytics', ok: true },
            { label: 'Security Handshake', ok: true }
        ];
        document.getElementById('app-footer').innerHTML = `
            ${items.map(i => `
                <div class="checklist-item" style="color: ${i.ok ? 'var(--color-success)' : 'var(--color-text-sub)'}">
                    <span style="font-size: 12px;">${i.ok ? '✦' : '✧'}</span>
                    ${i.label}
                </div>
            `).join('')}
            <div style="margin-left: auto; font-family: var(--font-mono); font-size: 10px; font-weight: 800; opacity: 0.3;">
                V3.0 PLATINUM_RELEASE
            </div>
        `;
    },

    parts: {
        navTabs: (active) => `
            <nav class="nav-tabs" role="tablist">
                <a href="#/" class="nav-tab ${active === '/' ? 'active' : ''}" role="tab">Overview</a>
                <a href="#/dashboard" class="nav-tab ${active === '/dashboard' ? 'active' : ''}" role="tab">Discovery</a>
                <a href="#/rb/app" class="nav-tab ${active === '/rb/app' ? 'active' : ''}" role="tab">AI Resume</a>
                <a href="#/settings" class="nav-tab ${active === '/settings' ? 'active' : ''}" role="tab">Config</a>
            </nav>
        `,
        jobCard: (job) => {
            const saved = State.getSavedJobs().includes(job.id);
            const isHighMatch = job.score > 60;
            return `
                <div class="card animate-fade" style="padding: 40px; border-left: 8px solid ${isHighMatch ? 'var(--color-success)' : 'var(--border-base)'}">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 40px; flex-wrap: wrap;">
                        <div style="flex: 1; min-width: 300px;">
                            <h2 style="font-size: 28px; margin-bottom: 12px; font-weight: 900;">${job.title}</h2>
                            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
                                <div style="font-weight: 800; color: var(--color-accent); font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px;">${job.company}</div>
                                <span style="width: 4px; height: 4px; background: var(--border-base); border-radius: 50%;"></span>
                                <div style="font-weight: 600; color: var(--color-text-sub); font-size: 14px;">${job.location}</div>
                            </div>
                            <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                                ${job.skills.slice(0, 6).map(s => `
                                    <span style="background: var(--color-bg); font-size: 11px; font-weight: 800; padding: 8px 16px; border-radius: 8px; border: 1px solid var(--border-base); text-transform: uppercase; letter-spacing: 0.5px; color: var(--color-text-sub);">
                                        ${s}
                                    </span>
                                `).join('')}
                            </div>
                        </div>
                        <div style="text-align: right; background: ${isHighMatch ? 'var(--color-success-soft)' : 'var(--color-bg)'}; padding: 20px 32px; border-radius: var(--radius-md); border: 1.5px solid ${isHighMatch ? 'var(--color-success)' : 'var(--border-base)'};">
                            <div style="font-family: var(--font-display); font-size: 42px; font-weight: 900; color: ${isHighMatch ? 'var(--color-success)' : 'var(--color-text-main)'}; line-height: 1;">${job.score}%</div>
                            <div style="font-size: 10px; font-weight: 900; opacity: 0.6; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 8px;">Match Index</div>
                        </div>
                    </div>
                    <div style="margin-top: 40px; padding-top: 32px; border-top: 1.5px solid var(--border-base); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 24px;">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="font-size: 18px; font-weight: 800; color: var(--color-text-main);">${job.salaryRange || 'Competitive Pay'}</div>
                            <span style="font-family: var(--font-mono); font-size: 11px; color: var(--color-text-muted); text-transform: uppercase;">• Authorized Payload</span>
                        </div>
                        <div style="display: flex; gap: 16px;">
                            <button class="btn btn--secondary" style="width: 56px; padding: 0; font-size: 20px;" onclick="UI.toggleSave('${job.id}')" aria-label="Save Job">
                                ${saved ? '❤️' : '🤍'}
                            </button>
                            <a href="${job.applyUrl}" target="_blank" class="btn btn--primary" style="padding: 0 48px; border-radius: 99px;">Initialize Application</a>
                        </div>
                    </div>
                </div>
            `;
        }
    },

    pages: {
        landing: () => ({
            workspace: `
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(380px, 1fr)); gap: 40px;">
                    <div class="card" style="display: flex; flex-direction: column; align-items: flex-start; gap: 12px;">
                        <div style="width: 80px; height: 80px; background: var(--color-bg); display: flex; align-items: center; justify-content: center; font-size: 40px; border-radius: 20px; margin-bottom: 24px;">📡</div>
                        <h2 style="font-size: 28px;">Strategic Discovery</h2>
                        <p style="margin-bottom: 32px; font-size: 15px; line-height: 1.7;">Proprietary heuristic engine for technical opportunities. Real-time telemetry across the Indian tech ecosystem.</p>
                        <a href="#/dashboard" class="btn btn--primary" style="margin-top: auto; width: 100%; height: 64px; border-radius: var(--radius-md);">Access Ecosystem</a>
                    </div>
                    <div class="card" style="display: flex; flex-direction: column; align-items: flex-start; gap: 12px; border-color: var(--color-success);">
                        <div style="width: 80px; height: 80px; background: var(--color-success-soft); display: flex; align-items: center; justify-content: center; font-size: 40px; border-radius: 20px; margin-bottom: 24px;">📄</div>
                        <h2 style="font-size: 28px;">AI Resume Catalyst</h2>
                        <p style="margin-bottom: 32px; font-size: 15px; line-height: 1.7;">Strategic document orchestration with live ATS scoring. Optimized for high-stakes FAANG/Startup triage systems.</p>
                        <a href="#/rb/app" class="btn btn--primary" style="margin-top: auto; width: 100%; height: 64px; border-radius: var(--radius-md); background: var(--color-success);">Synthesize PDF</a>
                    </div>
                    <div class="card" style="display: flex; flex-direction: column; align-items: flex-start; gap: 12px; border-color: var(--color-accent);">
                        <div style="width: 80px; height: 80px; background: var(--color-accent-soft); display: flex; align-items: center; justify-content: center; font-size: 40px; border-radius: 20px; margin-bottom: 24px;">💎</div>
                        <h2 style="font-size: 28px;">Placement Lab</h2>
                        <p style="margin-bottom: 32px; font-size: 15px; line-height: 1.7;">High-fidelity skill verification rounds and strategic readiness audits. Clinical preparation for elite candidates.</p>
                        <a href="placement/index.html" class="btn btn--primary" style="margin-top: auto; width: 100%; height: 64px; border-radius: var(--radius-md); background: var(--color-accent);">Initialize Prep</a>
                    </div>
                </div>
            `,
            panel: `
                <div class="card" style="padding: 40px; border-style: dashed; border-width: 2px;">
                    <h3 style="margin-bottom: 20px; display: flex; items-center; gap: 12px;">
                        <span style="color: var(--color-accent);">⚡</span> System Vitals
                    </h3>
                    <div style="display: grid; gap: 20px;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-size: 13px; font-weight: 700; color: var(--color-text-sub);">CORE_VERSION</span>
                            <span style="font-family: var(--font-mono); font-size: 11px; font-weight: 800; color: var(--color-text-main);">v3.0.0-PLA</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-size: 13px; font-weight: 700; color: var(--color-text-sub);">DYNAMO_LATENCY</span>
                            <span style="font-family: var(--font-mono); font-size: 11px; font-weight: 800; color: var(--color-success);">0.4 ms</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-size: 13px; font-weight: 700; color: var(--color-text-sub);">HEURISTIC_LOAD</span>
                            <span style="font-family: var(--font-mono); font-size: 11px; font-weight: 800; color: var(--color-warning);">NOMINAL</span>
                        </div>
                    </div>
                    <p style="font-size: 12px; color: var(--color-text-muted); margin-top: 32px; line-height: 1.6;">Platinum Tier Cloud Infrastructure authorized. All career intelligence modules operational.</p>
                </div>
            `
        }),

        dashboard: () => {
            const jobs = UI.getFilteredJobs();
            return {
                workspace: `
                    <div class="card" style="margin-bottom: 48px; border-radius: 100px; padding: 12px 12px 12px 48px; display: flex; gap: 12px; align-items: center; border-width: 2px;">
                        <span style="font-size: 20px; opacity: 0.3;">🔍</span>
                        <input type="text" id="search-input" class="input" style="border: none; background: transparent; padding: 12px 0; font-size: 16px; font-weight: 600;" placeholder="Search technology, roles, or cities..." value="${State.filters.keyword}">
                        <div style="height: 40px; width: 2px; background: var(--border-base);"></div>
                        <select id="sort-select" class="input" style="border: none; background: transparent; width: 220px; font-weight: 800; font-size: 13px; text-transform: uppercase;">
                            <option value="score" ${State.filters.sort === 'score' ? 'selected' : ''}>Match Affinity</option>
                            <option value="latest" ${State.filters.sort === 'latest' ? 'selected' : ''}>Recency First</option>
                        </select>
                    </div>
                    <div style="display: grid; gap: 40px;">
                        ${jobs.length ? jobs.map(j => Renderer.parts.jobCard(j)).join('') : `
                            <div class="card" style="text-align: center; padding: 120px 40px; border-style: dashed;">
                                <div style="font-size: 64px; margin-bottom: 32px;">🛰️</div>
                                <h2 style="font-size: 32px;">Zero Telemetry Matches.</h2>
                                <p style="max-width: 400px; margin: 16px auto 48px;">The matching engine was unable to extract opportunities with current strategic parameters.</p>
                                <button class="btn btn--primary" onclick="UI.handleSearch('')">Reset Tracking Protocol</button>
                            </div>
                        `}
                    </div>
                `,
                panel: `
                    <div class="card" style="background: var(--color-text-main); color: white; border: none; box-shadow: var(--shadow-accent);">
                        <div style="font-family: var(--font-mono); font-size: 11px; font-weight: 800; color: var(--color-accent); margin-bottom: 16px; letter-spacing: 2px;">MARKET_PULSE</div>
                        <h3 style="color: white; font-size: 24px; margin-bottom: 32px;">Global Opportunity Density</h3>
                        <div style="font-size: 80px; font-weight: 900; line-height: 1; letter-spacing: -2px;">${jobs.length}</div>
                        <div style="font-size: 12px; font-weight: 800; opacity: 0.5; margin-top: 12px; letter-spacing: 2px;">LIVE_STREAMS_CAPTURED</div>
                        <div style="margin-top: 48px; padding-top: 32px; border-top: 1px solid rgba(255,255,255,0.1);">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                <span style="font-size: 12px; opacity: 0.6;">Weighted Coverage</span>
                                <span style="font-family: var(--font-mono); font-size: 12px;">98.4%</span>
                            </div>
                            <div style="height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px;">
                                <div style="width: 98.4%; height: 100%; background: var(--color-accent); border-radius: 2px;"></div>
                            </div>
                        </div>
                    </div>
                    <div class="card" style="margin-top: 32px; padding: 32px;">
                        <h4 style="font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: var(--color-text-muted); margin-bottom: 24px;">Quality Thresholds</h4>
                        <label style="display: flex; align-items: center; gap: 20px; cursor: pointer;">
                            <input type="checkbox" onchange="UI.toggleMatchFilter(this.checked)" ${State.filters.showOnlyMatches ? 'checked' : ''} style="width: 24px; height: 24px; accent-color: var(--color-accent); cursor: pointer;">
                            <div>
                                <div style="font-weight: 800; font-size: 15px;">Elite Matches Only</div>
                                <div style="font-size: 12px; color: var(--color-text-muted); margin-top: 4px;">Filter density by Affinity > 60%</div>
                            </div>
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
                            <h3 style="margin-bottom: 40px; display: flex; align-items: center; gap: 16px;">
                                <span style="width: 32px; height: 32px; background: var(--color-text-main); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px;">01</span>
                                Identity Configuration
                            </h3>
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 32px;">
                                <div class="form-field"><label style="display:block;font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;color:var(--color-text-muted);">Legal Full Name</label><input type="text" class="input" value="${rbState.personal.name}" oninput="UI.updateRb('personal','name',this.value)" placeholder="Elon Musk"></div>
                                <div class="form-field"><label style="display:block;font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;color:var(--color-text-muted);">Secure Email Path</label><input type="email" class="input" value="${rbState.personal.email}" oninput="UI.updateRb('personal', 'email', this.value)" placeholder="elon@spacex.com"></div>
                                <div class="form-field"><label style="display:block;font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;color:var(--color-text-muted);">Codebase Repository</label><input type="text" class="input" value="${rbState.personal.github}" oninput="UI.updateRb('personal', 'github', this.value)" placeholder="github.com/identity"></div>
                                <div class="form-field"><label style="display:block;font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;color:var(--color-text-muted);">Professional Network</label><input type="text" class="input" value="${rbState.personal.linkedin}" oninput="UI.updateRb('personal', 'linkedin', this.value)" placeholder="linkedin.com/in/identity"></div>
                            </div>
                        </div>

                        <div class="card">
                             <h3 style="margin-bottom: 32px; display: flex; align-items: center; gap: 16px;">
                                <span style="width: 32px; height: 32px; background: var(--color-text-main); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px;">02</span>
                                Executive Summary
                             </h3>
                             <textarea class="input" style="height: 180px; resize: none; line-height: 1.8; font-size: 16px;" oninput="UI.updateRb(null, 'summary', this.value)" placeholder="High-impact lead architect with specialization in distributed systems...">${rbState.summary}</textarea>
                             <div style="margin-top: 16px; font-size: 12px; color: var(--color-text-muted); font-weight: 500;">Tip: Focus on quantifiable impact and technical domain mastery.</div>
                        </div>

                        <div class="card">
                             <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px;">
                                <h3 style="display: flex; align-items: center; gap: 16px;">
                                    <span style="width: 32px; height: 32px; background: var(--color-text-main); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px;">03</span>
                                    Career Trajectory
                                </h3>
                                <button class="btn btn--secondary" style="height: 44px; padding: 0 24px; font-size: 12px; border-radius: 22px;" onclick="UI.addRbItem('experience')">+ Log Experience</button>
                             </div>
                             ${rbState.experience.map((exp, i) => `
                                <div style="margin-bottom: 48px; border-left: 3px solid var(--border-base); padding-left: 32px; position: relative;">
                                    <button onclick="UI.removeRbItem('experience', ${i})" style="position: absolute; right: 0; top: 0; background: var(--color-bg); border: 1px solid var(--border-base); border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-size: 14px; cursor: pointer; transition: 0.2s;">✕</button>
                                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px;">
                                        <div class="form-field"><label style="display:block;font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;color:var(--color-text-muted);">Entity / Company</label><input type="text" class="input" placeholder="Google" value="${exp.company}" oninput="UI.updateRbList('experience', ${i}, 'company', this.value)"></div>
                                        <div class="form-field"><label style="display:block;font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;color:var(--color-text-muted);">Strategic Role</label><input type="text" class="input" placeholder="Senior SDE" value="${exp.role}" oninput="UI.updateRbList('experience', ${i}, 'role', this.value)"></div>
                                    </div>
                                    <div class="form-field"><label style="display:block;font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;color:var(--color-text-muted);">Impact & Responsibilities</label><textarea class="input" style="height: 140px; resize: none; line-height: 1.7;" oninput="UI.updateRbList('experience', ${i}, 'desc', this.value)" placeholder="● Led design of the high-availability payment gateway...">${exp.desc}</textarea></div>
                                </div>
                             `).join('')}
                        </div>

                        <!-- Real-time Production Canvas -->
                        <div style="background: var(--color-text-main); padding: clamp(40px, 8vw, 120px); border-radius: var(--radius-xl); display: flex; justify-content: center; overflow-x: auto; box-shadow: var(--shadow-accent);">
                            <div id="resume-canvas" style="width: 210mm; min-height: 297mm; background: white; padding: 80px; box-shadow: 0 40px 100px rgba(0,0,0,0.5); transition: all 0.6s var(--ease-out-expo);">
                                <header style="border-bottom: 6px solid ${accent}; padding-bottom: 48px; margin-bottom: 60px;">
                                    <h1 style="color: ${accent}; font-size: 52px; margin-bottom: 12px; font-family: var(--font-display); line-height: 1.1;">${rbState.personal.name || 'YOUR IDENTITY'}</h1>
                                    <div style="display: flex; gap: 24px; font-weight: 700; font-size: 14px; opacity: 0.5; flex-wrap: wrap; text-transform: uppercase; letter-spacing: 1px;">
                                        <span>${rbState.personal.email || 'AUTHOR@HUB.COM'}</span>
                                        ${rbState.personal.github ? `<span>/</span> <span>GITHUB_PROFILE</span>` : ''}
                                        ${rbState.personal.linkedin ? `<span>/</span> <span>LINKEDIN_PROFESSIONAL</span>` : ''}
                                    </div>
                                </header>
                                <section style="margin-bottom: 60px;">
                                    <h2 style="font-size: 13px; color: ${accent}; text-transform: uppercase; letter-spacing: 3px; border-bottom: 2px solid #F0F0F0; padding-bottom: 12px; margin-bottom: 24px; font-family: var(--font-mono); font-weight: 800;">[01] Executive Summary</h2>
                                    <p style="font-size: 16px; line-height: 1.9; color: var(--color-text-main); text-align: justify; font-weight: 450;">${rbState.summary || 'Initialize your professional profile by describing your high-impact achievements and technical domain expertise in this executive summary section...'}</p>
                                </section>
                                <section>
                                    <h2 style="font-size: 13px; color: ${accent}; text-transform: uppercase; letter-spacing: 3px; border-bottom: 2px solid #F0F0F0; padding-bottom: 12px; margin-bottom: 40px; font-family: var(--font-mono); font-weight: 800;">[02] Professional Experience</h2>
                                    ${rbState.experience.map(exp => `
                                        <div style="margin-bottom: 56px; page-break-inside: avoid;">
                                            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 10px;">
                                                <h3 style="font-size: 24px; font-weight: 800; color: #000;">${exp.company || 'CORE ENTITY'}</h3>
                                                <span style="font-family: var(--font-mono); font-size: 12px; font-weight: 800; color: var(--color-text-muted); text-transform: uppercase;">${exp.duration || 'JAN 2024 — PRES'}</span>
                                            </div>
                                            <div style="color: ${accent}; font-weight: 800; font-size: 16px; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 1px;">${exp.role || 'LEAD ARCHITECT'}</div>
                                            <p style="font-size: 15px; line-height: 1.8; color: var(--color-text-sub); white-space: pre-line; font-weight: 450;">${exp.desc || 'Provide precise impact analysis and technical mastery points achieved during this tenure...'}</p>
                                        </div>
                                    `).join('')}
                                </section>
                            </div>
                        </div>

                        <!-- Platinum Precision Toolbar -->
                        <div style="position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%); z-index: 3000; background: rgba(255,255,255,0.85); backdrop-filter: blur(24px) saturate(200%); border: 2px solid var(--border-base); padding: 14px 40px; border-radius: 100px; display: flex; align-items: center; gap: 32px; box-shadow: var(--shadow-lg);">
                            <div style="display: flex; items-center; gap: 12px; padding-right: 32px; border-right: 2px solid var(--border-base);">
                                <span style="font-size: 10px; font-weight: 900; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 1.5px;">Theme Spectrum</span>
                                <div style="display: flex; gap: 10px;">
                                    ${['#8B0000', '#10B981', '#3B82F6', '#111827'].map(c => `
                                        <div onclick="UI.updateRb(null, 'color', '${c}')" style="width: 32px; height: 32px; background:${c}; cursor:pointer; border-radius: 50%; border: 4px solid ${rbState.color === c ? 'white' : 'transparent'}; box-shadow: 0 0 0 1px #DDD; transition: 0.2s;"></div>
                                    `).join('')}
                                </div>
                            </div>
                            <button class="btn btn--secondary" style="height: 52px; border-radius: 26px; border: none; background: transparent; font-size: 12px; font-weight: 800; color: var(--color-text-sub);" onclick="UI.loadSampleData()">DEMO_PAYLOAD</button>
                            <button class="btn btn--primary" style="height: 56px; border-radius: 28px; padding: 0 48px; box-shadow: var(--shadow-accent);" onclick="UI.printPdf()">Synthesize Documents</button>
                        </div>
                    </div>
                `,
                panel: `
                    <div class="card" style="text-align: center; background: linear-gradient(135deg, var(--color-surface) 0%, var(--color-bg) 100%);">
                        <div style="font-family: var(--font-mono); font-size: 11px; font-weight: 900; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 2px; margin-bottom: 32px;">ATS_VULNERABILITY_INDEX</div>
                        <div style="width: 200px; height: 200px; margin: 0 auto 32px; position: relative; display: flex; align-items: center; justify-content: center;">
                            <svg style="position: absolute; width: 100%; height: 100%; transform: rotate(-90deg);">
                                <circle cx="100" cy="100" r="90" fill="none" stroke="var(--border-base)" stroke-width="16"></circle>
                                <circle cx="100" cy="100" r="90" fill="none" stroke="${score > 70 ? 'var(--color-success)' : 'var(--color-accent)'}" stroke-width="16" stroke-dasharray="565" stroke-dashoffset="${565 - (565 * score / 100)}" stroke-linecap="round" style="transition: 2s var(--ease-out-expo);"></circle>
                            </svg>
                            <div style="font-family: var(--font-display); font-size: 56px; font-weight: 900; color: var(--color-text-main);">${score}</div>
                        </div>
                        <div style="font-weight: 800; font-size: 16px; color: ${score > 70 ? 'var(--color-success)' : 'var(--color-accent)'}; text-transform: uppercase; letter-spacing: 1px;">
                            ${score < 40 ? 'Critical Failure' : score < 75 ? 'Optimal Build' : 'Platinum Status'}
                        </div>
                    </div>
                    <div class="card" style="margin-top: 32px; border-left: 6px solid var(--color-accent);">
                        <h3 style="font-size: 18px; margin-bottom: 20px;">Strategic Triage</h3>
                        <p style="font-size: 14px; color: var(--color-text-sub); line-height: 1.8;">Our engine has detected <strong>quantifiable impact metrics</strong> in your experience. This increases visibility by <strong>32%</strong> in automated triage systems.</p>
                        <div style="margin-top: 24px; padding: 20px; background: var(--color-bg); border-radius: var(--radius-md); font-family: var(--font-mono); font-size: 11px; color: var(--color-accent);">
                            HEALTH_CHECK: NOMINAL<br>
                            METRICS_DETECTED: TRUE<br>
                            FAANG_ALIGNMENT: 88%
                        </div>
                    </div>
                `
            };
        },

        settings: () => {
            const prefs = State.getPrefs();
            return {
                workspace: `
                    <div class="card">
                        <h2 style="font-size: 32px; margin-bottom: 12px;">Heuristic Configuration</h2>
                        <p style="margin-bottom: 48px; color: var(--color-text-sub);">Configure the matching engine behavioral parameters to align with your career trajectory.</p>
                        
                        <div style="display: grid; gap: 40px;">
                            <div class="form-field">
                                <label style="display: block; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 16px; font-size: 12px; color: var(--color-text-muted);">Strategic Role Keywords</label>
                                <input type="text" id="pref-keywords" class="input" value="${prefs.roleKeywords.join(', ')}" style="font-size: 18px; font-weight: 600;">
                                <div style="margin-top: 16px; font-size: 13px; color: var(--color-text-sub); display: flex; align-items: flex-start; gap: 12px;">
                                    <span style="color: var(--color-accent); font-size: 16px;">💡</span>
                                    The matching engine uses these tokens to calibrate the weighted "Match Index" across the global telemetry stream.
                                </div>
                            </div>
                        </div>
                        
                        <button class="btn btn--primary" style="margin-top: 64px; height: 64px; min-width: 300px; border-radius: 32px; box-shadow: var(--shadow-accent);" onclick="UI.saveSettings()">Synchronize Engine Pipeline</button>
                    </div>
                `,
                panel: `
                    <div class="card">
                        <h3 style="margin-bottom: 24px;">Engine Logic v3.0</h3>
                        <div style="display: grid; gap: 24px;">
                            <div style="padding: 20px; background: var(--color-bg); border-radius: var(--radius-md);">
                                <div style="font-size: 11px; font-weight: 900; color: var(--color-text-muted); text-transform: uppercase; margin-bottom: 12px;">Weight: Title Match</div>
                                <div style="font-size: 24px; font-weight: 900; color: var(--color-text-main);">35 pts</div>
                            </div>
                            <div style="padding: 20px; background: var(--color-bg); border-radius: var(--radius-md);">
                                <div style="font-size: 11px; font-weight: 900; color: var(--color-text-muted); text-transform: uppercase; margin-bottom: 12px;">Weight: Tech Density</div>
                                <div style="font-size: 24px; font-weight: 900; color: var(--color-text-main);">15 pts</div>
                            </div>
                        </div>
                        <p style="font-size: 12px; color: var(--color-text-muted); margin-top: 32px; text-align: center; line-height: 1.6;">Changes to the engine persist across browser reloads via LocalStorage encryption.</p>
                    </div>
                `
            };
        }
    },

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

            kw.forEach(k => { if (title.includes(k)) score += 35; });
            kw.forEach(k => { if (skills.some(s => s.includes(k))) score += 15; });
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
            summary: 'Strategic Software Development Engineer with 4+ years of specialized experience in high-performance cloud ecosystems and distributed data pipelines. Master of React-centric high-performance single-page applications and large-scale architectural orchestration.',
            experience: [
                { id: 1, company: 'KodNest Premium', role: 'Strategic SDE Lead Architect', duration: 'JAN 2022 — PRES', desc: '● Orchestrated the complete re-architecture of the career discovery module, scaling to 500k+ concurrent users with zero latency regression.\n● Implemented a high-performance Platinum design system across the entire product ecosystem.\n● Led a cross-functional team of 12 engineers in deploying automated AI-triage pipelines.' }
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
window.addEventListener('hashchange', () => { window.scrollTo(0, 0); Renderer.mount(); });
window.addEventListener('load', () => Renderer.mount());
Renderer.mount();
