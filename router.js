/**
 * KODNEST INTELLIGENCE SUITE — Application Core v4.0
 * Production-grade SPA with hash routing, localStorage persistence,
 * surgical DOM updates, XSS-safe rendering, and ATS-scored resume engine.
 */

"use strict";

/* ─────────────────────────────────────────────
   UTILITIES
   ───────────────────────────────────────────── */
const esc = (str) => {
    if (!str) return '';
    const d = document.createElement('div');
    d.textContent = String(str);
    return d.innerHTML;
};

/* ─────────────────────────────────────────────
   STATE MANAGEMENT
   ───────────────────────────────────────────── */
const State = {
    KEYS: {
        RB: 'kn_rb_state',
        PREFS: 'kn_prefs',
        SAVED: 'kn_saved_jobs',
        SEARCH: 'kn_search'
    },
    filters: { keyword: '', sort: 'score' },

    defaults: {
        rb: {
            personal: { name: '', email: '', phone: '', location: '', github: '', linkedin: '' },
            summary: '',
            experience: [{ company: '', role: '', duration: '2024', desc: '' }],
            education: [{ institution: '', degree: 'B.Tech', year: '2024' }],
            skills: ['JavaScript', 'React'],
            color: '#8B0000'
        },
        prefs: { roleKeywords: ['SDE', 'React', 'Java', 'Frontend', 'Backend'], minScore: 40 }
    },

    _get(key, fallback) {
        try { const d = localStorage.getItem(key); return d ? JSON.parse(d) : fallback; }
        catch { return fallback; }
    },
    _set(key, val) { localStorage.setItem(key, JSON.stringify(val)); },

    rb() { return this._get(this.KEYS.RB, JSON.parse(JSON.stringify(this.defaults.rb))); },
    prefs() { return this._get(this.KEYS.PREFS, { ...this.defaults.prefs }); },
    saved() { return this._get(this.KEYS.SAVED, []); },

    saveRb(v) { this._set(this.KEYS.RB, v); },
    savePrefs(v) { this._set(this.KEYS.PREFS, v); },
    saveSaved(v) { this._set(this.KEYS.SAVED, v); },

    init() {
        this.filters.keyword = localStorage.getItem(this.KEYS.SEARCH) || '';
    }
};

/* ─────────────────────────────────────────────
   ROUTER + RENDERER
   ───────────────────────────────────────────── */
const App = {
    _path: '/',

    routes: {
        '/': { step: 1, title: 'Command Center', sub: 'Integrated hub for career intelligence.' },
        '/dashboard': { step: 2, title: 'Job Discovery', sub: 'Real-time Indian tech opportunities with scoring.' },
        '/rb': { step: 3, title: 'Resume Engine', sub: 'ATS-optimized document builder with live preview.' },
        '/settings': { step: 4, title: 'System Config', sub: 'Fine-tune the heuristic matching engine.' }
    },

    /* ── Boot ─────────────────────────────── */
    mount() {
        const hash = window.location.hash.slice(1) || '/';
        this._path = hash.split('?')[0];
        const route = this.routes[this._path] || this.routes['/'];
        document.title = `${route.title} | KodNest Hub`;

        this._chrome(route);
        const { workspace, panel } = this._page();

        const ws = document.getElementById('app-workspace');
        const pn = document.getElementById('app-panel');
        if (ws) ws.innerHTML = `<div class="animate-fade">${this._nav()}${workspace}</div>`;
        if (pn) pn.innerHTML = `<div class="animate-fade">${panel}</div>`;

        this._bind();
    },

    /* ── Application Chrome ───────────────── */
    _chrome(r) {
        const el = (id) => document.getElementById(id);
        const q = (s) => document.querySelector(s);

        const proj = q('.top-bar__project');
        if (proj) proj.textContent = 'KodNest';

        const prog = el('app-progress');
        if (prog) prog.textContent = `S${r.step}`;

        const status = el('app-status');
        if (status) status.innerHTML = `<span class="status-badge status--in-progress">LIVE</span>`;

        const hdr = el('app-header');
        if (hdr) hdr.innerHTML = `
            <div class="animate-fade">
                <div style="font-family:var(--font-mono);font-size:10px;font-weight:800;color:var(--color-accent);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">Active Module</div>
                <h1 class="context-header__title" style="margin:0;">${esc(r.title)}</h1>
                <p class="context-header__subtitle" style="margin-top:8px;font-size:14px;">${esc(r.sub)}</p>
            </div>`;

        const ft = el('app-footer');
        if (ft) ft.innerHTML = `
            <div style="display:flex;gap:20px;align-items:center;padding:0 20px;height:100%;overflow-x:auto;white-space:nowrap;">
                <div style="color:var(--color-success);font-weight:700;font-size:11px;">✦ DATA_SECURE</div>
                <div style="color:var(--color-success);font-weight:700;font-size:11px;">✦ CLOUD_SYNC</div>
                <div style="color:var(--color-success);font-weight:700;font-size:11px;">✦ v4.0</div>
            </div>`;
    },

    /* ── Navigation ────────────────────────── */
    _nav() {
        const p = this._path;
        const t = (href, label) => `<a href="#${href}" class="nav-tab ${p === href ? 'active' : ''}">${label}</a>`;
        return `<nav class="nav-tabs">${t('/', 'Hub')}${t('/dashboard', 'Market')}${t('/rb', 'Resume')}${t('/settings', 'Config')}</nav>`;
    },

    /* ── Page Router ──────────────────────── */
    _page() {
        switch (this._path) {
            case '/dashboard': return Pages.dashboard();
            case '/rb': return Pages.resume();
            case '/settings': return Pages.settings();
            default: return Pages.landing();
        }
    },

    /* ── Event Binding ─────────────────────── */
    _bind() {
        const p = this._path;

        // Dashboard: surgical search (no re-mount)
        if (p === '/dashboard') {
            const si = document.getElementById('search-input');
            if (si) {
                si.addEventListener('input', (e) => {
                    State.filters.keyword = e.target.value;
                    localStorage.setItem(State.KEYS.SEARCH, e.target.value);
                    UI.refreshJobs();
                });
                si.focus();
            }
            const ss = document.getElementById('sort-select');
            if (ss) ss.addEventListener('change', (e) => { State.filters.sort = e.target.value; UI.refreshJobs(); });
        }

        // Resume: input listeners
        if (p === '/rb') {
            document.querySelectorAll('.rb-input').forEach(inp => {
                inp.addEventListener('input', (e) => {
                    const keys = e.target.dataset.path.split('.');
                    const rs = State.rb();
                    if (keys.length === 2) rs[keys[0]][keys[1]] = e.target.value;
                    else rs[keys[0]] = e.target.value;
                    State.saveRb(rs);
                    UI.syncPreview();
                });
            });
            document.querySelectorAll('.rb-list').forEach(inp => {
                inp.addEventListener('input', (e) => {
                    const { section, index, field } = e.target.dataset;
                    const rs = State.rb();
                    if (rs[section] && rs[section][index]) {
                        rs[section][index][field] = e.target.value;
                        State.saveRb(rs);
                        UI.syncPreview();
                    }
                });
            });
            UI.syncPreview();
        }

        // Settings: save handler
        if (p === '/settings') {
            const btn = document.getElementById('save-settings');
            if (btn) btn.addEventListener('click', UI.saveSettings);
        }

        window.scrollTo(0, 0);
    }
};

/* ─────────────────────────────────────────────
   PAGES
   ───────────────────────────────────────────── */
const Pages = {
    landing() {
        const cards = [
            { icon: '📡', title: 'Market Discovery', desc: 'Heuristic job matching for 60+ Indian tech roles.', href: '#/dashboard', cta: 'Access' },
            { icon: '📄', title: 'Resume Engine', desc: 'ATS-optimized document builder with live scoring.', href: '#/rb', cta: 'Build' },
            { icon: '💎', title: 'Placement Prep', desc: 'Interactive readiness assessment and skill audits.', href: 'placement/index.html', cta: 'Initialize' }
        ];
        return {
            workspace: `
                <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px;">
                    ${cards.map(c => `
                        <div class="card">
                            <div style="font-size:40px;margin-bottom:16px;">${c.icon}</div>
                            <h3>${esc(c.title)}</h3>
                            <p style="margin:12px 0 24px;font-size:14px;color:var(--color-text-sub);">${esc(c.desc)}</p>
                            <a href="${c.href}" class="btn btn--primary" style="width:100%;">${c.cta}</a>
                        </div>`).join('')}
                </div>`,
            panel: `
                <div class="card">
                    <h3 style="margin-bottom:16px;">System Vitals</h3>
                    <div style="font-family:var(--font-mono);font-size:12px;display:grid;gap:8px;">
                        <div style="color:var(--color-success);">● ${jobsData.length} jobs indexed</div>
                        <div style="color:var(--color-success);">● Resume engine ready</div>
                        <div style="color:var(--color-success);">● Placement prep linked</div>
                    </div>
                </div>`
        };
    },

    dashboard() {
        return {
            workspace: `
                <div class="card" style="margin-bottom:24px;">
                    <div style="display:flex;gap:12px;flex-wrap:wrap;">
                        <input type="text" id="search-input" class="input" style="flex:1;min-width:200px;" placeholder="Search by role, company or skill..." value="${esc(State.filters.keyword)}">
                        <select id="sort-select" class="input" style="width:auto;min-width:150px;font-weight:800;">
                            <option value="score" ${State.filters.sort === 'score' ? 'selected' : ''}>BEST MATCH</option>
                            <option value="latest" ${State.filters.sort === 'latest' ? 'selected' : ''}>NEWEST</option>
                        </select>
                    </div>
                </div>
                <div id="jobs-container" style="display:grid;gap:20px;"></div>`,
            panel: `<div id="jobs-panel" class="card" style="background:var(--color-text-main);color:white;"><h3>Intelligence</h3><div style="font-size:40px;font-weight:900;" id="jobs-count">0</div><div style="font-size:10px;opacity:0.6;">LIVE_RESULTS</div></div>`
        };
    },

    resume() {
        const rs = State.rb();
        const field = (label, path, type = 'text', val = '') =>
            `<div><label style="font-size:10px;font-weight:900;text-transform:uppercase;color:var(--color-text-muted);display:block;margin-bottom:4px;">${label}</label><input type="${type}" class="input rb-input" data-path="${path}" value="${esc(val)}"></div>`;

        return {
            workspace: `
                <div style="display:grid;gap:24px;">
                    <!-- Personal -->
                    <div class="card">
                        <h3 style="margin-bottom:20px;border-bottom:1px solid var(--border-base);padding-bottom:12px;">I. Identification</h3>
                        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
                            ${field('Full Name', 'personal.name', 'text', rs.personal.name)}
                            ${field('Email', 'personal.email', 'email', rs.personal.email)}
                            ${field('Phone', 'personal.phone', 'tel', rs.personal.phone)}
                            ${field('Location', 'personal.location', 'text', rs.personal.location)}
                            ${field('GitHub', 'personal.github', 'text', rs.personal.github)}
                            ${field('LinkedIn', 'personal.linkedin', 'text', rs.personal.linkedin)}
                        </div>
                    </div>

                    <!-- Summary -->
                    <div class="card">
                        <h3 style="margin-bottom:20px;border-bottom:1px solid var(--border-base);padding-bottom:12px;">II. Professional Summary</h3>
                        <textarea class="input rb-input" data-path="summary" style="height:120px;" placeholder="Strategic SDE with expertise in...">${esc(rs.summary)}</textarea>
                    </div>

                    <!-- Experience -->
                    <div class="card">
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;border-bottom:1px solid var(--border-base);padding-bottom:12px;">
                            <h3>III. Experience</h3>
                            <button class="btn btn--secondary" style="padding:8px 16px;font-size:10px;" onclick="UI.addItem('experience')">+ ADD</button>
                        </div>
                        <div id="experience-list">
                            ${rs.experience.map((exp, i) => `
                                <div style="margin-bottom:20px;border-left:3px solid var(--color-accent);padding-left:16px;position:relative;">
                                    <button onclick="UI.removeItem('experience',${i})" style="position:absolute;right:0;top:0;background:none;border:none;color:var(--color-accent);font-weight:900;cursor:pointer;font-size:16px;" title="Remove">✕</button>
                                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:8px;">
                                        <input type="text" class="input rb-list" data-section="experience" data-index="${i}" data-field="company" placeholder="Company" value="${esc(exp.company)}">
                                        <input type="text" class="input rb-list" data-section="experience" data-index="${i}" data-field="role" placeholder="Role / Title" value="${esc(exp.role)}">
                                    </div>
                                    <input type="text" class="input rb-list" data-section="experience" data-index="${i}" data-field="duration" placeholder="Duration (e.g. 2022 - Present)" value="${esc(exp.duration)}" style="margin-bottom:8px;">
                                    <textarea class="input rb-list" data-section="experience" data-index="${i}" data-field="desc" placeholder="Key achievements and responsibilities..." style="height:80px;">${esc(exp.desc)}</textarea>
                                </div>`).join('')}
                        </div>
                    </div>

                    <!-- Education -->
                    <div class="card">
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;border-bottom:1px solid var(--border-base);padding-bottom:12px;">
                            <h3>IV. Education</h3>
                            <button class="btn btn--secondary" style="padding:8px 16px;font-size:10px;" onclick="UI.addItem('education')">+ ADD</button>
                        </div>
                        <div id="education-list">
                            ${rs.education.map((edu, i) => `
                                <div style="margin-bottom:16px;border-left:3px solid var(--color-success);padding-left:16px;position:relative;">
                                    <button onclick="UI.removeItem('education',${i})" style="position:absolute;right:0;top:0;background:none;border:none;color:var(--color-accent);font-weight:900;cursor:pointer;font-size:16px;" title="Remove">✕</button>
                                    <div style="display:grid;grid-template-columns:1fr 1fr 100px;gap:12px;">
                                        <input type="text" class="input rb-list" data-section="education" data-index="${i}" data-field="institution" placeholder="University / College" value="${esc(edu.institution)}">
                                        <input type="text" class="input rb-list" data-section="education" data-index="${i}" data-field="degree" placeholder="Degree" value="${esc(edu.degree)}">
                                        <input type="text" class="input rb-list" data-section="education" data-index="${i}" data-field="year" placeholder="Year" value="${esc(edu.year)}">
                                    </div>
                                </div>`).join('')}
                        </div>
                    </div>

                    <!-- Skills -->
                    <div class="card">
                        <h3 style="margin-bottom:20px;border-bottom:1px solid var(--border-base);padding-bottom:12px;">V. Skill Matrix</h3>
                        <div id="skills-container" style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px;">
                            ${rs.skills.map((s, i) => `
                                <div style="background:var(--color-bg);padding:8px 14px;border-radius:8px;border:1px solid var(--border-base);display:flex;align-items:center;gap:8px;font-size:12px;font-weight:700;">
                                    ${esc(s)}
                                    <span onclick="UI.removeSkill(${i})" style="color:var(--color-accent);cursor:pointer;font-size:14px;" title="Remove">✕</span>
                                </div>`).join('')}
                        </div>
                        <div style="display:flex;gap:8px;">
                            <input type="text" id="new-skill" class="input" style="flex:1;" placeholder="Add skill (e.g. AWS, Docker)..." onkeydown="if(event.key==='Enter'){UI.addSkill();event.preventDefault();}">
                            <button class="btn btn--primary" style="padding:0 24px;" onclick="UI.addSkill()">ADD</button>
                        </div>
                    </div>

                    <!-- Live Preview -->
                    <div class="resume-preview-wrapper" style="background:var(--color-text-main);padding:48px 16px;border-radius:var(--radius-lg);display:flex;justify-content:center;overflow-x:auto;">
                        <div id="resume-canvas" style="width:210mm;min-height:297mm;background:white;padding:50px;font-family:'Inter',sans-serif;box-shadow:var(--shadow-lg);">
                        </div>
                    </div>

                    <!-- Actions -->
                    <div style="position:sticky;bottom:20px;z-index:100;display:flex;gap:12px;">
                        <button class="btn btn--primary" style="flex:1;height:60px;border-radius:12px;font-size:14px;box-shadow:var(--shadow-lg);" onclick="UI.printPdf()">⬇ DOWNLOAD PDF</button>
                    </div>
                </div>`,
            panel: `<div id="rb-telemetry"></div>`
        };
    },

    settings() {
        const pr = State.prefs();
        return {
            workspace: `
                <div class="card">
                    <h3 style="margin-bottom:20px;border-bottom:1px solid var(--border-base);padding-bottom:12px;">Matching Engine Configuration</h3>
                    <p style="font-size:14px;color:var(--color-text-sub);margin-bottom:24px;">Define keywords to personalise job scoring. Jobs containing these keywords in titles or skills will receive higher match scores.</p>
                    <label style="font-size:10px;font-weight:900;text-transform:uppercase;color:var(--color-text-muted);display:block;margin-bottom:6px;">Role Keywords (comma-separated)</label>
                    <textarea id="pref-keywords" class="input" style="height:100px;" placeholder="SDE, React, Java, Frontend, Backend">${esc(pr.roleKeywords.join(', '))}</textarea>
                    <button id="save-settings" class="btn btn--primary" style="margin-top:16px;width:100%;">SAVE CONFIGURATION</button>
                </div>`,
            panel: `
                <div class="card">
                    <h3 style="margin-bottom:12px;">Active Keywords</h3>
                    <div style="display:flex;flex-wrap:wrap;gap:8px;">
                        ${pr.roleKeywords.map(k => `<span style="background:var(--color-accent-soft);color:var(--color-accent);padding:6px 12px;border-radius:8px;font-size:11px;font-weight:700;">${esc(k)}</span>`).join('')}
                    </div>
                </div>`
        };
    }
};

/* ─────────────────────────────────────────────
   UI ACTIONS
   ───────────────────────────────────────────── */
const UI = {
    /* ── Job Discovery ─────────────────────── */
    getFilteredJobs() {
        const pr = State.prefs();
        const kw = pr.roleKeywords.map(k => k.toLowerCase());
        let results = jobsData.map(j => {
            let score = 10;
            kw.forEach(k => {
                if (j.title.toLowerCase().includes(k)) score += 30;
                if (j.skills.some(s => s.toLowerCase().includes(k))) score += 15;
                if (j.description && j.description.toLowerCase().includes(k)) score += 5;
            });
            return { ...j, score: Math.min(score, 100) };
        });
        const q = State.filters.keyword.toLowerCase();
        if (q) {
            results = results.filter(j =>
                j.title.toLowerCase().includes(q) ||
                j.company.toLowerCase().includes(q) ||
                j.skills.some(s => s.toLowerCase().includes(q))
            );
        }
        results.sort((a, b) => State.filters.sort === 'score' ? b.score - a.score : a.postedDaysAgo - b.postedDaysAgo);
        return results;
    },

    refreshJobs() {
        const jobs = this.getFilteredJobs();
        const c = document.getElementById('jobs-container');
        if (c) {
            if (jobs.length === 0) {
                c.innerHTML = `<div class="card" style="text-align:center;padding:60px 20px;"><h3 style="margin-bottom:8px;">No matches found</h3><p style="font-size:14px;color:var(--color-text-sub);">Try adjusting your search or keywords in Settings.</p></div>`;
            } else {
                c.innerHTML = jobs.map(j => this._jobCard(j)).join('');
            }
        }
        const ct = document.getElementById('jobs-count');
        if (ct) ct.textContent = jobs.length;
    },

    _jobCard(job) {
        const saved = State.saved().includes(job.id);
        const high = job.score > 60;
        return `
            <div class="card" style="border-left:6px solid ${high ? 'var(--color-success)' : 'var(--border-base)'};">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;">
                    <div style="flex:1;min-width:0;">
                        <h2 style="font-size:18px;margin-bottom:4px;font-weight:900;">${esc(job.title)}</h2>
                        <div style="color:var(--color-accent);font-weight:700;font-size:13px;margin-bottom:4px;">${esc(job.company)} · ${esc(job.location)}</div>
                        <div style="font-size:11px;color:var(--color-text-muted);">${esc(job.experience)} · ${esc(job.mode)} · ${job.postedDaysAgo === 0 ? 'Today' : job.postedDaysAgo + 'd ago'}</div>
                    </div>
                    <div style="text-align:right;background:${high ? 'var(--color-success-soft)' : 'var(--color-bg)'};padding:10px 14px;border-radius:10px;border:1px solid var(--border-base);flex-shrink:0;">
                        <div style="font-size:22px;font-weight:900;color:${high ? 'var(--color-success)' : 'var(--color-text-main)'};line-height:1;">${job.score}%</div>
                        <div style="font-size:8px;font-weight:900;opacity:0.5;margin-top:2px;text-transform:uppercase;">Match</div>
                    </div>
                </div>
                <div style="display:flex;gap:6px;flex-wrap:wrap;margin:16px 0;">
                    ${job.skills.slice(0, 5).map(s => `<span style="background:var(--color-bg);font-size:10px;font-weight:700;padding:4px 10px;border-radius:6px;border:1px solid var(--border-base);text-transform:uppercase;">${esc(s)}</span>`).join('')}
                </div>
                <div style="padding-top:16px;border-top:1px solid var(--border-base);display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;">
                    <span style="font-size:15px;font-weight:800;">${esc(job.salaryRange) || 'Competitive'}</span>
                    <div style="display:flex;gap:8px;">
                        <button class="btn btn--secondary" style="width:44px;padding:0;" onclick="UI.toggleSave('${job.id}')" title="${saved ? 'Unsave' : 'Save'}">${saved ? '❤️' : '🤍'}</button>
                        <a href="${esc(job.applyUrl)}" target="_blank" rel="noopener" class="btn btn--primary" style="padding:10px 20px;">Apply →</a>
                    </div>
                </div>
            </div>`;
    },

    toggleSave(id) {
        let s = State.saved();
        if (s.includes(id)) s = s.filter(x => x !== id);
        else s.push(id);
        State.saveSaved(s);
        this.refreshJobs();
    },

    /* ── Resume Builder ────────────────────── */
    addItem(section) {
        const rs = State.rb();
        if (section === 'experience') rs.experience.unshift({ company: '', role: '', duration: '2024', desc: '' });
        else rs.education.unshift({ institution: '', degree: '', year: '2024' });
        State.saveRb(rs);
        App.mount();
    },

    removeItem(section, i) {
        const rs = State.rb();
        if (rs[section].length <= 1) return; // keep at least one
        rs[section].splice(i, 1);
        State.saveRb(rs);
        App.mount();
    },

    addSkill() {
        const inp = document.getElementById('new-skill');
        if (!inp) return;
        const v = inp.value.trim();
        if (!v) return;
        const rs = State.rb();
        if (!rs.skills.includes(v)) {
            rs.skills.push(v);
            State.saveRb(rs);
            App.mount();
        }
        inp.value = '';
    },

    removeSkill(i) {
        const rs = State.rb();
        rs.skills.splice(i, 1);
        State.saveRb(rs);
        App.mount();
    },

    syncPreview() {
        const rs = State.rb();
        const score = this._atsScore(rs);
        const c = rs.color;

        const canvas = document.getElementById('resume-canvas');
        if (canvas) {
            canvas.innerHTML = `
                <header style="border-bottom:4px solid ${c};padding-bottom:20px;margin-bottom:28px;">
                    <h1 style="color:${c};font-size:36px;margin:0;text-transform:uppercase;letter-spacing:1px;">${esc(rs.personal.name) || 'YOUR NAME'}</h1>
                    <div style="display:flex;flex-wrap:wrap;gap:12px;font-size:11px;font-weight:600;color:#666;margin-top:8px;">
                        ${rs.personal.email ? `<span>✉ ${esc(rs.personal.email)}</span>` : ''}
                        ${rs.personal.phone ? `<span>☎ ${esc(rs.personal.phone)}</span>` : ''}
                        ${rs.personal.location ? `<span>📍 ${esc(rs.personal.location)}</span>` : ''}
                        ${rs.personal.github ? `<span>⌂ ${esc(rs.personal.github)}</span>` : ''}
                        ${rs.personal.linkedin ? `<span>in/ ${esc(rs.personal.linkedin)}</span>` : ''}
                    </div>
                </header>
                ${rs.summary ? `
                <section style="margin-bottom:24px;">
                    <h2 style="font-size:13px;color:${c};text-transform:uppercase;border-bottom:1px solid #DDD;padding-bottom:4px;margin-bottom:10px;letter-spacing:1px;">Summary</h2>
                    <p style="font-size:12px;line-height:1.7;color:#333;text-align:justify;">${esc(rs.summary)}</p>
                </section>` : ''}
                <section style="margin-bottom:24px;">
                    <h2 style="font-size:13px;color:${c};text-transform:uppercase;border-bottom:1px solid #DDD;padding-bottom:4px;margin-bottom:10px;letter-spacing:1px;">Experience</h2>
                    ${rs.experience.map(exp => `
                        <div style="margin-bottom:16px;">
                            <div style="display:flex;justify-content:space-between;font-weight:700;font-size:13px;"><span>${esc(exp.company) || 'Company'}</span><span style="color:#999;font-weight:400;">${esc(exp.duration)}</span></div>
                            <div style="font-style:italic;font-size:11px;color:${c};margin:2px 0 6px;">${esc(exp.role) || 'Role'}</div>
                            <p style="font-size:11px;line-height:1.6;color:#555;white-space:pre-line;">${esc(exp.desc) || 'Responsibilities...'}</p>
                        </div>`).join('')}
                </section>
                <section style="margin-bottom:24px;">
                    <h2 style="font-size:13px;color:${c};text-transform:uppercase;border-bottom:1px solid #DDD;padding-bottom:4px;margin-bottom:10px;letter-spacing:1px;">Education</h2>
                    ${rs.education.map(edu => `
                        <div style="margin-bottom:12px;">
                            <div style="font-weight:700;font-size:13px;">${esc(edu.institution) || 'Institution'}</div>
                            <div style="font-size:11px;color:#555;">${esc(edu.degree)} · ${esc(edu.year)}</div>
                        </div>`).join('')}
                </section>
                ${rs.skills.length > 0 ? `
                <section>
                    <h2 style="font-size:13px;color:${c};text-transform:uppercase;border-bottom:1px solid #DDD;padding-bottom:4px;margin-bottom:10px;letter-spacing:1px;">Skills</h2>
                    <p style="font-size:12px;font-weight:600;color:#333;">${rs.skills.map(s => esc(s)).join(' · ')}</p>
                </section>` : ''}
            `;
        }

        const panel = document.getElementById('rb-telemetry');
        if (panel) {
            const label = score < 40 ? 'Needs Work' : score < 70 ? 'Good Start' : score < 90 ? 'Strong' : 'Platinum';
            const labelColor = score < 40 ? 'var(--color-warning)' : score < 70 ? 'var(--color-accent)' : 'var(--color-success)';
            panel.innerHTML = `
                <div class="card" style="text-align:center;padding:40px 20px;">
                    <div style="font-size:10px;font-weight:900;text-transform:uppercase;color:var(--color-text-muted);margin-bottom:12px;">ATS Score</div>
                    <div style="font-size:56px;font-weight:900;color:${labelColor};line-height:1;">${score}</div>
                    <div style="font-size:12px;font-weight:800;margin-top:8px;color:${labelColor};">${label}</div>
                    <div style="margin-top:32px;text-align:left;border-top:1px solid var(--border-base);padding-top:20px;">
                        <h4 style="font-size:11px;font-weight:900;text-transform:uppercase;margin-bottom:14px;">Checklist</h4>
                        <div style="display:grid;gap:10px;font-size:12px;">
                            ${this._check(rs.personal.name, 'Full name')}
                            ${this._check(rs.personal.email, 'Email address')}
                            ${this._check(rs.personal.phone, 'Phone number')}
                            ${this._check(rs.summary.length > 50, 'Summary (50+ chars)')}
                            ${this._check(rs.skills.length >= 5, 'Skills (5+)')}
                            ${this._check(rs.experience[0]?.company, 'Company name')}
                            ${this._check(rs.experience[0]?.desc?.length > 80, 'Detailed experience')}
                            ${this._check(rs.education[0]?.institution, 'Education')}
                        </div>
                    </div>
                </div>`;
        }
    },

    _check(cond, label) {
        return `<div style="color:${cond ? 'var(--color-success)' : 'var(--color-text-muted)'};">${cond ? '✦' : '✧'} ${label}</div>`;
    },

    _atsScore(r) {
        let s = 0;
        if (r.personal.name) s += 10;
        if (r.personal.email) s += 8;
        if (r.personal.phone) s += 5;
        if (r.personal.github || r.personal.linkedin) s += 7;
        if (r.summary.length > 50) s += 15;
        if (r.summary.length > 120) s += 5;
        if (r.skills.length >= 3) s += 8;
        if (r.skills.length >= 5) s += 7;
        if (r.experience.length > 0 && r.experience[0].company) s += 10;
        if (r.experience[0]?.desc?.length > 80) s += 10;
        if (r.experience[0]?.desc?.length > 200) s += 5;
        if (r.education.length > 0 && r.education[0].institution) s += 10;
        return Math.min(s, 100);
    },

    /* ── Settings ──────────────────────────── */
    saveSettings() {
        const v = document.getElementById('pref-keywords');
        if (!v) return;
        const keywords = v.value.split(',').map(x => x.trim()).filter(Boolean);
        if (keywords.length === 0) return;
        State.savePrefs({ roleKeywords: keywords, minScore: 40 });
        App.mount();
    },

    /* ── Print ─────────────────────────────── */
    printPdf() { window.print(); }
};

/* ─────────────────────────────────────────────
   BOOT
   ───────────────────────────────────────────── */
State.init();
window.addEventListener('hashchange', () => App.mount());
document.addEventListener('DOMContentLoaded', () => {
    App.mount();
    // Surgical job population on dashboard
    if (App._path === '/dashboard') UI.refreshJobs();
});
