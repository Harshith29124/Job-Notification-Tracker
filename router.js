/**
 * KODNEST PREMIUM INTELLIGENCE SUITE
 * High-Performance Application Core (v3.3 - Surgical Precision)
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
            experience: [{ id: Date.now(), company: '', role: '', duration: '2023 - Present', desc: 'Led development of...' }],
            education: [{ id: Date.now() + 1, institution: '', degree: 'B.Tech', year: '2024' }],
            skills: ['React', 'Node.js', 'System Design'],
            color: '#8B0000'
        },
        prefs: { roleKeywords: ["SDE", "React", "Java", "Frontend", "Backend"], minMatchScore: 40 }
    },
    get: (key, defaultVal) => { try { const data = localStorage.getItem(key); return data ? JSON.parse(data) : defaultVal; } catch (e) { return defaultVal; } },
    set: (key, val) => localStorage.setItem(key, JSON.stringify(val)),
    getRbState: function () { return this.get(this.KEYS.RB_STATE, this.defaults.rbState); },
    getPrefs: function () { return this.get(this.KEYS.PREFS, this.defaults.prefs); },
    getSavedJobs: function () { return this.get(this.KEYS.SAVED_JOBS, []); },
    getTrackSteps: function () { return this.get(this.KEYS.TRACK_STEPS, []); }
};

const Renderer = {
    routes: {
        '/': { step: 1, title: 'Overview', subtitle: 'Integrated command center for Discovery and Prep.', render: () => Renderer.pages.landing() },
        '/dashboard': { step: 2, title: 'Job Discovery', subtitle: 'Real-time telemetry of Indian tech opportunities.', render: () => Renderer.pages.dashboard() },
        '/rb/app': { step: 3, isApp: true, title: 'Resume Engine', subtitle: 'AI document generation with live ATS analytics.', render: () => Renderer.pages.resumeBuilder() },
        '/settings': { step: 5, title: 'System Config', subtitle: 'Fine-tune the heuristic matching engine.', render: () => Renderer.pages.settings() }
    },

    mount: function () {
        const hash = window.location.hash.slice(1) || '/';
        const path = hash.split('?')[0];
        const route = this.routes[path] || this.routes['/'];
        document.title = `${route.title} | KodNest Hub`;

        this.syncLayout(route);

        const { workspace, panel } = route.render();
        const workspaceNode = document.getElementById('app-workspace');
        const panelNode = document.getElementById('app-panel');

        workspaceNode.innerHTML = `<div class="animate-fade">${this.parts.navTabs(path)}${workspace}</div>`;
        panelNode.innerHTML = `<div class="animate-fade">${panel}</div>`;

        this.bindEvents();
        window.scrollTo(0, 0);
    },

    syncLayout: function (route) {
        document.querySelector('.top-bar__project').textContent = 'KodNest';
        document.getElementById('app-progress').textContent = `S${route.step}`;

        const steps = State.getTrackSteps();
        const isShipped = steps.length >= 8 && steps.every(Boolean);
        const statusNode = document.getElementById('app-status');
        statusNode.innerHTML = `<span class="status-badge ${isShipped ? 'status--shipped' : 'status--in-progress'}">${isShipped ? 'READY' : 'BUILDING'}</span>`;

        document.getElementById('app-header').innerHTML = `
            <div class="animate-fade">
                <div style="font-family: var(--font-mono); font-size: 10px; font-weight: 800; color: var(--color-accent); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Active Context</div>
                <h1 class="context-header__title" style="margin: 0;">${route.title}</h1>
                <p class="context-header__subtitle" style="margin-top: 8px; font-size: 14px;">${route.subtitle}</p>
            </div>
        `;

        const items = [{ label: 'Data', ok: true }, { label: 'Cloud', ok: true }, { label: 'Secure', ok: true }];
        document.getElementById('app-footer').innerHTML = `
            <div style="display: flex; gap: 20px; align-items: center; padding: 0 20px; height: 100%; overflow-x: auto; white-space: nowrap;">
                ${items.map(i => `<div class="checklist-item" style="color:var(--color-success); font-weight:700;">✦ ${i.label}</div>`).join('')}
            </div>
        `;
    },

    parts: {
        navTabs: (active) => `
            <nav class="nav-tabs">
                <a href="#/" class="nav-tab ${active === '/' ? 'active' : ''}">Hub</a>
                <a href="#/dashboard" class="nav-tab ${active === '/dashboard' ? 'active' : ''}">Market</a>
                <a href="#/rb/app" class="nav-tab ${active === '/rb/app' ? 'active' : ''}">Resume</a>
                <a href="#/settings" class="nav-tab ${active === '/settings' ? 'active' : ''}">Config</a>
            </nav>
        `,
        jobCard: (job) => {
            const saved = State.getSavedJobs().includes(job.id);
            const isHigh = job.score > 60;
            return `
                <div class="card" style="border-left: 6px solid ${isHigh ? 'var(--color-success)' : 'var(--border-base)'}">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 16px;">
                        <div style="flex: 1;">
                            <h2 style="font-size: 20px; margin-bottom: 4px; font-weight: 900;">${job.title}</h2>
                            <div style="font-weight: 700; color: var(--color-accent); font-size: 14px; margin-bottom: 16px;">${job.company} • ${job.location}</div>
                        </div>
                        <div style="text-align: right; background: ${isHigh ? 'var(--color-success-soft)' : 'var(--color-bg)'}; padding: 10px 14px; border-radius: 8px; border: 1px solid var(--border-base);">
                            <div style="font-size: 24px; font-weight: 900; color: ${isHigh ? 'var(--color-success)' : 'var(--color-text-main)'}; line-height: 1;">${job.score}%</div>
                            <div style="font-size: 8px; font-weight: 900; opacity: 0.5; margin-top: 4px; text-transform: uppercase;">Match</div>
                        </div>
                    </div>
                    <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 24px;">
                        ${job.skills.slice(0, 4).map(s => `<span style="background: var(--color-bg); font-size: 10px; font-weight: 700; padding: 4px 10px; border-radius: 4px; border: 1px solid var(--border-base); text-transform: uppercase;">${s}</span>`).join('')}
                    </div>
                    <div style="padding-top: 20px; border-top: 1px solid var(--border-base); display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap;">
                        <div style="font-size: 16px; font-weight: 800;">${job.salaryRange || 'Competitive'}</div>
                        <div style="display: flex; gap: 8px; flex: 1; justify-content: flex-end;">
                            <button class="btn btn--secondary" style="width: 44px; padding: 0;" onclick="UI.toggleSave('${job.id}')">${saved ? '❤️' : '🤍'}</button>
                            <a href="${job.applyUrl}" target="_blank" class="btn btn--primary" style="flex: 1; max-width: 140px;">Launch</a>
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
                    ${['📡', '📄', '💎'].map((icon, idx) => `
                        <div class="card">
                            <div style="font-size: 40px; margin-bottom: 16px;">${icon}</div>
                            <h3>${['Market Discovery', 'AI Resume', 'Prep Hub'][idx]}</h3>
                            <p style="margin-bottom: 24px; font-size: 14px;">${['Heuristic job matching for technical roles.', 'ATS-optimized document generation.', 'Clinical readiness and skill audits.'][idx]}</p>
                            <a href="${['#/dashboard', '#/rb/app', 'placement/index.html'][idx]}" class="btn btn--primary" style="width: 100%;">${['Access', 'Build', 'Initialize'][idx]}</a>
                        </div>
                    `).join('')}
                </div>
            `,
            panel: `<div class="card"><h3>Vitals</h3><div style="font-family:var(--font-mono); font-size:12px; margin-top:12px;"><div style="color:var(--color-success)">● CLOUD_SYNC_OK</div><div style="color:var(--color-success)">● LATENCY_0.4ms</div></div></div>`
        }),
        dashboard: () => {
            const jobs = UI.getFilteredJobs();
            return {
                workspace: `
                    <div class="card" style="margin-bottom: 24px; display: flex; flex-direction: column; gap: 16px;">
                        <input type="text" id="search-input" class="input" placeholder="Search keywords..." value="${State.filters.keyword}">
                        <select id="sort-select" class="input" style="font-weight: 800;">
                            <option value="score" ${State.filters.sort === 'score' ? 'selected' : ''}>BEST MATCH</option>
                            <option value="latest" ${State.filters.sort === 'latest' ? 'selected' : ''}>NEWEST</option>
                        </select>
                    </div>
                    <div id="jobs-container" style="display: grid; gap: 24px;">
                        ${jobs.length ? jobs.map(j => Renderer.parts.jobCard(j)).join('') : `<div class="card" style="text-align:center;"><h3>No Matches Found.</h3></div>`}
                    </div>
                `,
                panel: `<div class="card" style="background:var(--color-text-main); color:white;"><h3>Intelligence</h3><div style="font-size:40px; font-weight:900;">${jobs.length}</div><div style="font-size:10px; opacity:0.6;">LIVE_RESULTS</div></div>`
            };
        },
        resumeBuilder: () => {
            const rs = State.getRbState();
            return {
                workspace: `
                    <div style="display: grid; gap: 32px;">
                        <div class="card">
                            <h3 style="margin-bottom: 24px; border-bottom: 1px solid var(--border-base); padding-bottom: 12px;">1. Personal Payload</h3>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                                <div class="field"><label style="font-size:10px; font-weight:900; text-transform:uppercase; color:var(--color-text-muted);">Name</label><input type="text" class="input rb-input" data-path="personal.name" value="${rs.personal.name}"></div>
                                <div class="field"><label style="font-size:10px; font-weight:900; text-transform:uppercase; color:var(--color-text-muted);">Email</label><input type="email" class="input rb-input" data-path="personal.email" value="${rs.personal.email}"></div>
                                <div class="field"><label style="font-size:10px; font-weight:900; text-transform:uppercase; color:var(--color-text-muted);">Github</label><input type="text" class="input rb-input" data-path="personal.github" value="${rs.personal.github}"></div>
                                <div class="field"><label style="font-size:10px; font-weight:900; text-transform:uppercase; color:var(--color-text-muted);">LinkedIn</label><input type="text" class="input rb-input" data-path="personal.linkedin" value="${rs.personal.linkedin}"></div>
                            </div>
                        </div>

                        <div class="card">
                            <h3 style="margin-bottom: 24px; border-bottom: 1px solid var(--border-base); padding-bottom: 12px;">2. Executive Summary</h3>
                            <textarea class="input rb-input" data-path="summary" style="height: 120px;" placeholder="Strategic SDE with expertise in...">${rs.summary || ''}</textarea>
                        </div>

                        <div class="card">
                             <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; border-bottom: 1px solid var(--border-base); padding-bottom: 12px;">
                                <h3>3. Career Experience</h3>
                                <button class="btn btn--secondary" style="padding: 8px 16px; font-size: 10px;" onclick="UI.addRbItem('experience')">+ ADD</button>
                             </div>
                             <div id="experience-list">
                                ${rs.experience.map((exp, i) => `
                                    <div style="margin-bottom: 24px; border-left: 2px solid var(--color-accent); padding-left: 16px; position:relative;">
                                        <button onclick="UI.removeRbItem('experience', ${i})" style="position:absolute; right:0; top:0; background:none; border:none; color:var(--color-accent); font-weight:900; cursor:pointer;">✕</button>
                                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 8px;">
                                            <input type="text" class="input rb-input-list" data-section="experience" data-index="${i}" data-field="company" placeholder="Company" value="${exp.company}">
                                            <input type="text" class="input rb-input-list" data-section="experience" data-index="${i}" data-field="role" placeholder="Role" value="${exp.role}">
                                        </div>
                                        <textarea class="input rb-input-list" data-section="experience" data-index="${i}" data-field="desc" placeholder="Achievements..." style="height:80px;">${exp.desc}</textarea>
                                    </div>
                                `).join('')}
                             </div>
                        </div>

                        <div class="card">
                            <h3 style="margin-bottom: 24px; border-bottom: 1px solid var(--border-base); padding-bottom: 12px;">5. Skill Matrix</h3>
                            <div id="skills-matrix-container" style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px;">
                                ${rs.skills.map((s, idx) => `
                                    <div style="background:var(--color-bg); padding: 8px 12px; border-radius: 6px; border: 1px solid var(--border-base); display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 700;">
                                        ${s}
                                        <span onclick="UI.removeSkill(${idx})" style="color:var(--color-accent); cursor:pointer;">✕</span>
                                    </div>
                                `).join('')}
                            </div>
                            <div style="display: flex; gap: 8px;">
                                <input type="text" id="new-skill-input" class="input" style="flex:1;" placeholder="Add skill (e.g. AWS)..." onkeypress="if(event.key==='Enter') UI.addSkill()">
                                <button class="btn btn--primary" style="padding: 0 20px;" onclick="UI.addSkill()">ADD</button>
                            </div>
                        </div>

                        <div class="resume-preview-wrapper" style="background:var(--color-text-main); padding: 60px 20px; border-radius: var(--radius-lg); overflow-x: auto; display:flex; justify-content:center;">
                            <div id="resume-canvas" style="width: 210mm; min-height: 297mm; background:white; padding: 60px; box-shadow: var(--shadow-lg); font-family: 'Inter', sans-serif;">
                                <!-- Preview rendered surgically -->
                            </div>
                        </div>

                        <div style="position:sticky; bottom:20px; z-index:100; display:flex; gap:12px;">
                            <button class="btn btn--primary" style="flex:1; height:60px; border-radius:12px; font-size:14px; box-shadow:var(--shadow-lg);" onclick="UI.printPdf()">DOWNLOAD STRATEGIC PDF</button>
                        </div>
                    </div>
                `,
                panel: `<div id="rb-telemetry-panel"></div>`
            };
        }
    },

    bindEvents: function () {
        const hash = window.location.hash.slice(1) || '/';
        const path = hash.split('?')[0];

        if (path === '/dashboard') {
            const s = document.getElementById('search-input');
            if (s) s.focus(); // Keep focus on search if just re-mounted
        }

        if (path === '/rb/app') {
            // Surgical inputs for Resume Builder
            document.querySelectorAll('.rb-input').forEach(input => {
                input.addEventListener('input', (e) => {
                    const path = e.target.dataset.path.split('.');
                    const rs = State.getRbState();
                    if (path.length > 1) rs[path[0]][path[1]] = e.target.value;
                    else rs[path[0]] = e.target.value;
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

            UI.syncPreview();
        }
    }
};

const UI = {
    handleSearch: (v) => {
        State.filters.keyword = v;
        localStorage.setItem(State.KEYS.SEARCH, v);
        const jobs = UI.getFilteredJobs();
        const container = document.getElementById('jobs-container');
        if (container) {
            container.innerHTML = jobs.length ? jobs.map(j => Renderer.parts.jobCard(j)).join('') : `<div class="card" style="text-align:center;"><h3>No Matches Found.</h3></div>`;
        }
    },
    handleSort: (v) => { State.filters.sort = v; Renderer.mount(); },
    toggleSave: (id) => { let s = State.getSavedJobs(); if (s.includes(id)) s = s.filter(x => x !== id); else s.push(id); State.set(State.KEYS.SAVED_JOBS, s); Renderer.mount(); },
    addRbItem: (s) => {
        const r = State.getRbState();
        const item = s === 'experience' ? { id: Date.now(), company: '', role: '', duration: '2024', desc: '' } : { id: Date.now(), institution: '', degree: '', year: '2024' };
        r[s].unshift(item);
        State.set(State.KEYS.RB_STATE, r);
        Renderer.mount();
    },
    removeRbItem: (s, i) => { const r = State.getRbState(); r[s].splice(i, 1); State.set(State.KEYS.RB_STATE, r); Renderer.mount(); },
    addSkill: () => {
        const inp = document.getElementById('new-skill-input');
        const v = inp.value.trim();
        if (!v) return;
        const r = State.getRbState();
        r.skills.push(v);
        State.set(State.KEYS.RB_STATE, r);
        Renderer.mount();
    },
    removeSkill: (i) => { const r = State.getRbState(); r.skills.splice(i, 1); State.set(State.KEYS.RB_STATE, r); Renderer.mount(); },

    syncPreview: () => {
        const rs = State.getRbState();
        const score = UI.calcRbScore(rs);
        const canvas = document.getElementById('resume-canvas');
        if (canvas) {
            canvas.innerHTML = `
                <header style="border-bottom: 4px solid ${rs.color}; padding-bottom: 24px; margin-bottom: 32px; display: flex; justify-content: space-between; align-items: flex-end;">
                    <div>
                        <h1 style="color:${rs.color}; font-size:40px; margin:0; text-transform: uppercase;">${rs.personal.name || 'YOUR NAME'}</h1>
                        <div style="display:flex; gap:16px; font-size:12px; font-weight:700; color:var(--color-text-sub); margin-top:8px;">
                            <span>${rs.personal.email || 'MAIL@HUB.COM'}</span>
                            <span>${rs.personal.github ? '• GITHUB' : ''}</span>
                            <span>${rs.personal.linkedin ? '• LINKEDIN' : ''}</span>
                        </div>
                    </div>
                </header>
                <section style="margin-bottom: 32px;">
                    <h2 style="font-size:14px; color:${rs.color}; text-transform:uppercase; border-bottom:1px solid #EEE; padding-bottom:4px; margin-bottom:12px;">Summary</h2>
                    <p style="font-size:13px; line-height:1.6; color:var(--color-text-main); text-align: justify;">${rs.summary || 'Describe your professional achievements...'}</p>
                </section>
                <section style="margin-bottom: 32px;">
                    <h2 style="font-size:14px; color:${rs.color}; text-transform:uppercase; border-bottom:1px solid #EEE; padding-bottom:4px; margin-bottom:12px;">Skill Matrix</h2>
                    <p style="font-size:13px; font-weight:700; color:var(--color-text-main);">${rs.skills.join(' • ')}</p>
                </section>
                <section style="margin-bottom: 32px;">
                    <h2 style="font-size:14px; color:${rs.color}; text-transform:uppercase; border-bottom:1px solid #EEE; padding-bottom:4px; margin-bottom:12px;">Experience</h2>
                    ${rs.experience.map(exp => `
                        <div style="margin-bottom: 20px;">
                            <div style="display:flex; justify-content:space-between; font-weight:800; font-size:14px;"><strong>${exp.company || 'COMPANY'}</strong> <span>${exp.duration || '2024'}</span></div>
                            <div style="font-style:italic; font-size:12px; color:${rs.color}; margin-bottom:6px;">${exp.role || 'SDE ROLE'}</div>
                            <p style="font-size:12px; line-height:1.6; color:var(--color-text-sub); white-space:pre-line;">${exp.desc || 'Responsibilities and impact...'}</p>
                        </div>
                    `).join('')}
                </section>
            `;
        }

        const panel = document.getElementById('rb-telemetry-panel');
        if (panel) {
            panel.innerHTML = `
                <div class="card" style="text-align:center; padding:40px 20px;">
                    <div style="font-size:10px; font-weight:900; text-transform:uppercase; color:var(--color-text-muted); margin-bottom:12px;">ATS Telemetry</div>
                    <div style="font-size:60px; font-weight:900; color:${score > 70 ? 'var(--color-success)' : 'var(--color-accent)'}; line-height:1;">${score}</div>
                    <div style="font-size:12px; font-weight:800; margin-top:12px;">${score < 50 ? 'Low Alignment' : score < 80 ? 'Optimal Build' : 'Platinum Status'}</div>
                    <div style="margin-top:40px; text-align:left; border-top:1px solid var(--border-base); padding-top:24px;">
                        <h4 style="font-size:11px; font-weight:900; text-transform:uppercase; margin-bottom:16px;">Vitals Checklist</h4>
                        <div style="display:grid; gap:12px;">
                            <div style="font-size:12px; color:${rs.summary.length > 50 ? 'var(--color-success)' : 'var(--color-text-muted)'}">${rs.summary.length > 50 ? '✦' : '✧'} Executive Summary</div>
                            <div style="font-size:12px; color:${rs.skills.length >= 5 ? 'var(--color-success)' : 'var(--color-text-muted)'}">${rs.skills.length >= 5 ? '✦' : '✧'} Skill Matrix (5+)</div>
                            <div style="font-size:12px; color:${rs.experience[0]?.desc?.length > 100 ? 'var(--color-success)' : 'var(--color-text-muted)'}">${rs.experience[0]?.desc?.length > 100 ? '✦' : '✧'} Quantifiable Impact</div>
                        </div>
                    </div>
                </div>
            `;
        }
    },

    calcRbScore: (r) => {
        let s = 20;
        if (r.personal.name) s += 10;
        if (r.personal.email) s += 5;
        if (r.summary.length > 80) s += 15;
        if (r.skills.length >= 5) s += 15;
        if (r.experience[0]?.desc?.length > 150) s += 25;
        return Math.min(s, 100);
    },

    getFilteredJobs: () => {
        const pr = State.getPrefs();
        const kw = pr.roleKeywords.map(k => k.toLowerCase());
        let res = jobsData.map(j => {
            let sc = 10;
            kw.forEach(k => {
                if (j.title.toLowerCase().includes(k)) sc += 35;
                if (j.skills.some(s => s.toLowerCase().includes(k))) sc += 15;
            });
            return { ...j, score: Math.min(sc, 100) };
        });
        if (State.filters.keyword) {
            const q = State.filters.keyword.toLowerCase();
            res = res.filter(j => j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q));
        }
        return res.sort((a, b) => State.filters.sort === 'score' ? b.score - a.score : a.postedDaysAgo - b.postedDaysAgo);
    },
    saveSettings: () => {
        const v = document.getElementById('pref-keywords').value;
        const k = v.split(',').map(x => x.trim()).filter(Boolean);
        State.set(State.KEYS.PREFS, { roleKeywords: k, minMatchScore: 40 });
        Renderer.mount();
    },
    printPdf: () => window.print()
};

window.addEventListener('hashchange', () => Renderer.mount());
document.addEventListener('DOMContentLoaded', () => Renderer.mount());
Renderer.mount();
