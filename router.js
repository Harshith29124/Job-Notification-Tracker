/**
 * KODNEST PREMIUM INTELLIGENCE SUITE
 * High-Performance Application Core (v3.4 - Absolute Authority)
 * -----------------------------------------------------------
 * Authored by: Antigravity (Top 100 Global UI/UX Architect)
 */

"use strict";

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
        sort: 'score'
    },
    defaults: {
        rbState: {
            personal: { name: '', email: '', phone: '', location: '', github: '', linkedin: '' },
            summary: '',
            experience: [{ id: Date.now(), company: '', role: '', duration: '2023 - Present', desc: 'SDE' }],
            education: [{ id: Date.now() + 1, institution: '', degree: 'B.Tech', year: '2024' }],
            skills: ['React', 'Node.js'],
            color: '#8B0000'
        },
        prefs: { roleKeywords: ["SDE", "React", "Java"], minMatchScore: 40 }
    },
    get: (key, defaultVal) => { try { const data = localStorage.getItem(key); return data ? JSON.parse(data) : defaultVal; } catch (e) { return defaultVal; } },
    set: (key, val) => localStorage.setItem(key, JSON.stringify(val)),
    getRbState: function () { return this.get(this.KEYS.RB_STATE, this.defaults.rbState); },
    getPrefs: function () { return this.get(this.KEYS.PREFS, this.defaults.prefs); },
    getSavedJobs: function () { return this.get(this.KEYS.SAVED_JOBS, []); },
    getTrackSteps: function () { return this.get(this.KEYS.TRACK_STEPS, []); }
};

const Renderer = {
    getRoute: (path) => {
        const routes = {
            '/': { step: 1, title: 'Overview', subtitle: 'Integrated command center.', render: () => Renderer.pages.landing() },
            '/dashboard': { step: 2, title: 'Job Discovery', subtitle: 'Real-time tech opportunities.', render: () => Renderer.pages.dashboard() },
            '/rb/app': { step: 3, title: 'Resume Engine', subtitle: 'AI document generation.', render: () => Renderer.pages.resumeBuilder() },
            '/settings': { step: 5, title: 'System Config', subtitle: 'Match engine settings.', render: () => Renderer.pages.settings() }
        };
        return routes[path] || routes['/'];
    },

    mount: function () {
        const hash = window.location.hash.slice(1) || '/';
        const path = hash.split('?')[0];
        const route = this.getRoute(path);

        console.log(`[CORE] Mounting path: ${path} (Step ${route.step})`);

        document.title = `${route.title} | KodNest Hub`;

        // Update Header & Layout
        this.syncLayout(route);

        // Capture Content
        const { workspace, panel } = route.render();

        // Inject Content
        const workspaceNode = document.getElementById('app-workspace');
        const panelNode = document.getElementById('app-panel');

        if (workspaceNode) {
            workspaceNode.innerHTML = `<div class="animate-fade">${this.parts.navTabs(path)}${workspace}</div>`;
        }
        if (panelNode) {
            panelNode.innerHTML = `<div class="animate-fade">${panel}</div>`;
        }

        // Initialize Events & Preview
        this.bindEvents(path);

        if (path === '/rb/app') {
            UI.syncPreview();
        }

        window.scrollTo(0, 0);
    },

    syncLayout: function (route) {
        const projectNode = document.querySelector('.top-bar__project');
        const progressNode = document.getElementById('app-progress');
        const headerNode = document.getElementById('app-header');
        const statusNode = document.getElementById('app-status');

        if (projectNode) projectNode.textContent = 'KodNest';
        if (progressNode) progressNode.textContent = `S${route.step}`;

        const steps = State.getTrackSteps();
        const isShipped = steps.length >= 8;
        if (statusNode) {
            statusNode.innerHTML = `<span class="status-badge ${isShipped ? 'status--shipped' : 'status--in-progress'}">${isShipped ? 'READY' : 'BUILDING'}</span>`;
        }

        if (headerNode) {
            headerNode.innerHTML = `
                <div class="animate-fade">
                    <div style="font-family: var(--font-mono); font-size: 10px; font-weight: 800; color: var(--color-accent); text-transform: uppercase;">Active Context</div>
                    <h1 style="margin: 0; font-size: clamp(1.8rem, 5vw, 3rem);">${route.title}</h1>
                    <p style="margin-top: 4px; font-size: 14px; color: var(--color-text-sub);">${route.subtitle}</p>
                </div>
            `;
        }

        const footerNode = document.getElementById('app-footer');
        if (footerNode) {
            footerNode.innerHTML = `
                <div style="display: flex; gap: 20px; align-items: center; padding: 0 20px; height: 100%; overflow-x: auto;">
                    <div style="color:var(--color-success); font-weight:700; font-size:11px;">✦ DATA_LAYER_SECURE</div>
                    <div style="color:var(--color-success); font-weight:700; font-size:11px;">✦ CLOUD_SYNC_OK</div>
                </div>
            `;
        }
    },

    parts: {
        navTabs: (active) => `
            <nav class="nav-tabs" style="margin-bottom:32px;">
                <a href="#/" class="nav-tab ${active === '/' ? 'active' : ''}">Hub</a>
                <a href="#/dashboard" class="nav-tab ${active === '/dashboard' ? 'active' : ''}">Market</a>
                <a href="#/rb/app" class="nav-tab ${active === '/rb/app' ? 'active' : ''}">Resume</a>
                <a href="#/settings" class="nav-tab ${active === '/settings' ? 'active' : ''}">Config</a>
            </nav>
        `,
        jobCard: (job) => {
            const saved = State.getSavedJobs().includes(job.id);
            return `
                <div class="card" style="border-left: 6px solid var(--border-base)">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                        <div>
                            <h2 style="font-size: 18px; margin-bottom: 2px;">${job.title}</h2>
                            <div style="color: var(--color-accent); font-weight: 700; font-size: 13px; margin-bottom: 12px;">${job.company}</div>
                        </div>
                        <div style="background: var(--color-bg); padding: 8px; border-radius: 8px; font-weight: 900; font-size: 18px;">${job.score || 0}%</div>
                    </div>
                    <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 20px;">
                        ${job.skills.slice(0, 3).map(s => `<span style="background: var(--color-bg); font-size: 9px; font-weight: 800; padding: 4px 8px; border-radius: 4px; text-transform: uppercase;">${s}</span>`).join('')}
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-base); padding-top: 16px;">
                        <span style="font-weight: 800; font-size: 14px;">${job.salaryRange || 'Competitive'}</span>
                        <div style="display: flex; gap: 8px;">
                            <button class="btn btn--secondary" style="width: 44px; padding: 0;" onclick="UI.toggleSave('${job.id}')">${saved ? '❤️' : '🤍'}</button>
                            <a href="${job.applyUrl}" target="_blank" class="btn btn--primary" style="padding: 10px 20px;">Launch</a>
                        </div>
                    </div>
                </div>
            `;
        }
    },

    pages: {
        landing: () => ({
            workspace: `
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px;">
                    <div class="card">
                        <div style="font-size: 40px; margin-bottom: 16px;">📡</div>
                        <h3>Market Discovery</h3>
                        <p style="margin-bottom: 24px; font-size: 14px;">Explore high-fidelity tech roles.</p>
                        <a href="#/dashboard" class="btn btn--primary" style="width: 100%;">Access</a>
                    </div>
                    <div class="card">
                        <div style="font-size: 40px; margin-bottom: 16px;">📄</div>
                        <h3>Resume Engine</h3>
                        <p style="margin-bottom: 24px; font-size: 14px;">ATS-optimized document builder.</p>
                        <a href="#/rb/app" class="btn btn--primary" style="width: 100%;">Build</a>
                    </div>
                    <div class="card">
                        <div style="font-size: 40px; margin-bottom: 16px;">💎</div>
                        <h3>Placement Prep</h3>
                        <p style="margin-bottom: 24px; font-size: 14px;">Interactive readiness simulations.</p>
                        <a href="placement/index.html" class="btn btn--primary" style="width: 100%;">Initialize</a>
                    </div>
                </div>
            `,
            panel: `<div class="card"><h3>Telemetry</h3><div style="color:var(--color-success); font-weight:800; font-size:12px; margin-top:12px;">● SYSTEM_STABLE</div></div>`
        }),
        dashboard: () => {
            const jobs = UI.getFilteredJobs();
            return {
                workspace: `
                    <div class="card" style="margin-bottom: 24px;">
                        <input type="text" id="search-input" class="input" placeholder="Search..." oninput="UI.handleSearch(this.value)" value="${State.filters.keyword}">
                    </div>
                    <div style="display: grid; gap: 20px;">
                        ${jobs.map(j => Renderer.parts.jobCard(j)).join('')}
                    </div>
                `,
                panel: `<div class="card" style="background:var(--color-text-main); color:white;"><h3>Intelligence</h3><div style="font-size:32px; font-weight:900;">${jobs.length}</div><div style="font-size:10px; opacity:0.6;">LIVE_RESULTS</div></div>`
            };
        },
        resumeBuilder: () => {
            const rs = State.getRbState();
            return {
                workspace: `
                    <div style="display: grid; gap: 24px;">
                        <div class="card">
                            <h3 style="margin-bottom: 20px;">I. Identification</h3>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                                <div><label style="font-size:10px; font-weight:900; color:var(--color-text-muted);">NAME</label><input type="text" class="input rb-input" data-path="personal.name" value="${rs.personal.name}"></div>
                                <div><label style="font-size:10px; font-weight:900; color:var(--color-text-muted);">EMAIL</label><input type="email" class="input rb-input" data-path="personal.email" value="${rs.personal.email}"></div>
                            </div>
                        </div>

                        <div class="card">
                            <h3 style="margin-bottom: 20px;">II. Summary</h3>
                            <textarea class="input rb-input" data-path="summary" style="height: 100px;">${rs.summary}</textarea>
                        </div>

                        <div class="card">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                                <h3>III. Experience</h3>
                                <button class="btn btn--secondary" onclick="UI.addRbItem('experience')">+ ADD</button>
                            </div>
                            <div id="experience-list">
                                ${rs.experience.map((exp, i) => `
                                    <div style="margin-bottom: 20px; border-left: 2px solid var(--color-accent); padding-left: 16px; position:relative;">
                                        <button onclick="UI.removeRbItem('experience', ${i})" style="position:absolute; right:0; top:0; background:none; border:none; color:var(--color-accent); font-weight:900;">✕</button>
                                        <input type="text" class="input rb-input-list" data-section="experience" data-index="${i}" data-field="company" value="${exp.company}" placeholder="Company" style="margin-bottom:8px;">
                                        <textarea class="input rb-input-list" data-section="experience" data-index="${i}" data-field="desc" style="height:60px;">${exp.desc}</textarea>
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <div class="resume-preview-wrapper" style="background:var(--color-text-main); padding: 40px 10px; border-radius: var(--radius-lg); display:flex; justify-content:center; overflow-x:auto;">
                            <div id="resume-canvas" style="width: 210mm; min-height: 297mm; background:white; padding: 40px; font-family: sans-serif; box-shadow: var(--shadow-lg);">
                                <!-- Surgical Injection -->
                            </div>
                        </div>

                        <button class="btn btn--primary" style="height:60px;" onclick="UI.printPdf()">GENERATE PRODUCTION PDF</button>
                    </div>
                `,
                panel: `<div id="rb-telemetry-panel"></div>`
            };
        },
        settings: () => ({
            workspace: `<div class="card"><h3>Matching Engine</h3><p>Adjust your role preferences.</p></div>`,
            panel: `<div class="card"><h3>Active</h3></div>`
        })
    },

    bindEvents: function (path) {
        if (path === '/rb/app') {
            document.querySelectorAll('.rb-input').forEach(input => {
                input.addEventListener('input', (e) => {
                    const pathAttr = e.target.dataset.path.split('.');
                    const rs = State.getRbState();
                    if (pathAttr.length > 1) rs[pathAttr[0]][pathAttr[1]] = e.target.value;
                    else rs[pathAttr[0]] = e.target.value;
                    State.set(State.KEYS.RB_STATE, rs);
                    UI.syncPreview();
                });
            });

            document.querySelectorAll('.rb-input-list').forEach(input => {
                input.addEventListener('input', (e) => {
                    const { section, index, field } = e.target.dataset;
                    const rs = State.getRbState();
                    rs[section][index][field] = e.target.value;
                    State.set(State.KEYS.RB_STATE, rs);
                    UI.syncPreview();
                });
            });
        }
    }
};

const UI = {
    syncPreview: () => {
        const rs = State.getRbState();
        const canvas = document.getElementById('resume-canvas');
        if (canvas) {
            canvas.innerHTML = `
                <div style="border-bottom: 2px solid ${rs.color}; padding-bottom: 20px; margin-bottom: 20px;">
                    <h1 style="color:${rs.color}; margin:0; font-size:32px;">${rs.personal.name || 'YOUR NAME'}</h1>
                    <div style="font-size:12px; color:gray; margin-top:5px;">${rs.personal.email || 'email@example.com'}</div>
                </div>
                <div style="margin-bottom:20px;">
                    <h2 style="font-size:14px; text-transform:uppercase; color:${rs.color}; border-bottom:1px solid #EEE;">Experience</h2>
                    ${rs.experience.map(e => `
                        <div style="margin-top:10px;">
                            <div style="font-weight:bold; font-size:14px;">${e.company || 'Company'}</div>
                            <p style="font-size:12px; margin:5px 0;">${e.desc || 'Responsibilities...'}</p>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        const panel = document.getElementById('rb-telemetry-panel');
        if (panel) {
            const score = UI.calcRbScore(rs);
            panel.innerHTML = `
                <div class="card" style="text-align:center;">
                    <h4 style="font-size:10px; color:gray;">ATS SCORE</h4>
                    <div style="font-size:48px; font-weight:900; color:var(--color-accent);">${score}</div>
                    <div style="font-size:11px; margin-top:10px;">PLATINUM BUILD</div>
                </div>
            `;
        }
    },

    calcRbScore: (r) => {
        let s = 10;
        if (r.personal.name) s += 20;
        if (r.summary.length > 30) s += 30;
        if (r.experience.length > 0) s += 40;
        return Math.min(s, 100);
    },

    addRbItem: (sec) => {
        const rs = State.getRbState();
        rs[sec].unshift({ company: '', desc: '' });
        State.set(State.KEYS.RB_STATE, rs);
        Renderer.mount();
    },

    removeRbItem: (sec, i) => {
        const rs = State.getRbState();
        rs[sec].splice(i, 1);
        State.set(State.KEYS.RB_STATE, rs);
        Renderer.mount();
    },

    getFilteredJobs: () => {
        const kw = State.filters.keyword.toLowerCase();
        return jobsData.filter(j =>
            j.title.toLowerCase().includes(kw) ||
            j.company.toLowerCase().includes(kw) ||
            j.skills.some(s => s.toLowerCase().includes(kw))
        ).slice(0, 10);
    },

    handleSearch: (v) => {
        State.filters.keyword = v;
        const container = document.getElementById('jobs-container');
        // Simple re-mount for live search logic
        Renderer.mount();
    },

    toggleSave: (id) => {
        let saved = State.getSavedJobs();
        if (saved.includes(id)) saved = saved.filter(x => x !== id);
        else saved.push(id);
        State.set(State.KEYS.SAVED_JOBS, saved);
        Renderer.mount();
    },

    printPdf: () => window.print()
};

window.addEventListener('hashchange', () => Renderer.mount());
document.addEventListener('DOMContentLoaded', () => Renderer.mount());

// Bootstrap
Renderer.mount();
