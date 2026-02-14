/**
 * KODNEST PREMIUM INTELLIGENCE SUITE
 * High-Performance Application Core (v3.1 - Mobile First)
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
        const steps = State.getTrackSteps();
        const isShipped = steps.length >= 8 && steps.every(Boolean);

        document.querySelector('.top-bar__project').textContent = 'KodNest';
        document.getElementById('app-progress').textContent = `S${route.step}`;

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
                            <h3>${['Market Tracking', 'AI Resume', 'Prep Hub'][idx]}</h3>
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
                    <div style="display: grid; gap: 24px;">
                        ${jobs.length ? jobs.map(j => Renderer.parts.jobCard(j)).join('') : `<div class="card" style="text-align:center;"><h3>No Matches Found.</h3></div>`}
                    </div>
                `,
                panel: `<div class="card" style="background:var(--color-text-main); color:white;"><h3>Intelligence</h3><div style="font-size:40px; font-weight:900;">${jobs.length}</div><div style="font-size:10px; opacity:0.6;">LIVE_RESULTS</div></div>`
            };
        },
        resumeBuilder: () => {
            const rs = State.getRbState();
            const score = UI.calcRbScore(rs);
            return {
                workspace: `
                    <div style="display: grid; gap: 32px;">
                        <div class="card">
                            <h3 style="margin-bottom: 24px;">1. Personal Details</h3>
                            <div style="display: grid; gap: 16px;">
                                <input type="text" class="input" placeholder="Name" value="${rs.personal.name}" oninput="UI.updateRb('personal','name',this.value)">
                                <input type="email" class="input" placeholder="Email" value="${rs.personal.email}" oninput="UI.updateRb('personal','email',this.value)">
                                <input type="text" class="input" placeholder="GitHub" value="${rs.personal.github}" oninput="UI.updateRb('personal','github',this.value)">
                            </div>
                        </div>
                        <div class="card">
                             <h3 style="margin-bottom: 24px;">2. Career History</h3>
                             ${rs.experience.map((exp, i) => `
                                <div style="margin-bottom: 24px; border-left: 3px solid var(--border-base); padding-left: 16px; position:relative;">
                                    <button onclick="UI.removeRbItem('experience', ${i})" style="position:absolute; right:0; top:0; background:none; border:none; cursor:pointer;">✕</button>
                                    <input type="text" class="input" placeholder="Company" value="${exp.company}" oninput="UI.updateRbList('experience', ${i}, 'company', this.value)" style="margin-bottom:8px;">
                                    <textarea class="input" placeholder="Role/Impact" oninput="UI.updateRbList('experience', ${i}, 'desc', this.value)" style="height:100px;">${exp.desc}</textarea>
                                </div>
                             `).join('')}
                             <button class="btn btn--secondary" onclick="UI.addRbItem('experience')" style="width:100%;">+ Add Log</button>
                        </div>
                        <div style="background:var(--color-text-main); padding: 40px 20px; border-radius: var(--radius-lg); overflow-x: auto; display:flex; justify-content:center;">
                            <div id="resume-canvas" style="width: 210mm; min-height: 297mm; background:white; padding: 40px; box-shadow: var(--shadow-lg);">
                                <h1 style="color:${rs.color}; font-size:32px;">${rs.personal.name || 'IDENTITY'}</h1>
                                <p style="font-size:12px; margin-bottom:32px;">${rs.personal.email || 'professional@hub.com'}</p>
                                <hr style="border:none; border-top:2px solid ${rs.color}; margin-bottom:32px;">
                                ${rs.experience.map(exp => `<div style="margin-bottom:24px;"><h3>${exp.company || 'ORGANIZATION'}</h3><p style="font-size:13px; line-height:1.6;">${exp.desc || 'Experience details...'}</p></div>`).join('')}
                            </div>
                        </div>
                        <div style="position:sticky; bottom:20px; z-index:100; display:flex; gap:12px;">
                            <button class="btn btn--primary" style="flex:1; height:60px; border-radius:30px; box-shadow:var(--shadow-lg);" onclick="UI.printPdf()">Synthesize PDF</button>
                        </div>
                    </div>
                `,
                panel: `<div class="card" style="text-align:center;"><h3>ATS Score</h3><div style="font-size:60px; font-weight:900; color:${score > 60 ? 'var(--color-success)' : 'var(--color-accent)'}">${score}</div></div>`
            };
        },
        settings: () => {
            const pr = State.getPrefs();
            return {
                workspace: `
                    <div class="card">
                        <h3>Configuration</h3>
                        <div style="margin-top:24px;">
                            <label style="display:block; font-size:12px; font-weight:900; margin-bottom:8px;">KEYWORDS</label>
                            <input type="text" id="pref-keywords" class="input" value="${pr.roleKeywords.join(', ')}">
                        </div>
                        <button class="btn btn--primary" style="margin-top:32px; width:100%;" onclick="UI.saveSettings()">Synchronize</button>
                    </div>
                `,
                panel: `<div class="card"><h3>Engine v3.1</h3><p style="font-size:12px;">Logic: Weighted Title (35) + Tech Density (15)</p></div>`
            };
        }
    },

    bindEvents: function () {
        const s = document.getElementById('search-input');
        if (s) s.addEventListener('input', (e) => UI.handleSearch(e.target.value));
        const so = document.getElementById('sort-select');
        if (so) so.addEventListener('change', (e) => UI.handleSort(e.target.value));
    }
};

const UI = {
    handleSearch: (v) => { State.filters.keyword = v; localStorage.setItem(State.KEYS.SEARCH, v); Renderer.mount(); },
    handleSort: (v) => { State.filters.sort = v; Renderer.mount(); },
    toggleSave: (id) => { let s = State.getSavedJobs(); if (s.includes(id)) s = s.filter(x => x !== id); else s.push(id); State.set(State.KEYS.SAVED_JOBS, s); Renderer.mount(); },
    updateRb: (s, f, v) => { const r = State.getRbState(); if (s) r[s][f] = v; else r[f] = v; State.set(State.KEYS.RB_STATE, r); Renderer.mount(); },
    updateRbList: (s, i, f, v) => { const r = State.getRbState(); r[s][i][f] = v; State.set(State.KEYS.RB_STATE, r); Renderer.mount(); },
    addRbItem: (s) => { const r = State.getRbState(); r[s].unshift({ id: Date.now(), company: '', role: '', desc: '' }); State.set(State.KEYS.RB_STATE, r); Renderer.mount(); },
    removeRbItem: (s, i) => { const r = State.getRbState(); r[s].splice(i, 1); State.set(State.KEYS.RB_STATE, r); Renderer.mount(); },
    calcRbScore: (r) => { let s = 20; if (r.personal.name) s += 20; if (r.experience[0]?.desc?.length > 50) s += 30; if (r.personal.email) s += 30; return Math.min(s, 100); },
    getFilteredJobs: () => {
        const pr = State.getPrefs();
        const kw = pr.roleKeywords.map(k => k.toLowerCase());
        let res = jobsData.map(j => {
            let sc = 10;
            const t = j.title.toLowerCase();
            const sk = j.skills.map(s => s.toLowerCase());
            kw.forEach(k => { if (t.includes(k)) sc += 35; if (sk.some(s => s.includes(k))) sc += 15; });
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
