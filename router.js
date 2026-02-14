/**
 * KODNEST INTELLIGENCE SUITE — v5.0
 * Fully Responsive Application Core
 * Mobile-first. Cross-platform. Production-grade.
 */

"use strict";

/* ─── Utilities ──────────────────────────── */
const h = (s) => { if (!s) return ''; const d = document.createElement('div'); d.textContent = String(s); return d.innerHTML; };
const $ = (id) => document.getElementById(id);
const q = (sel) => document.querySelector(sel);

/* ─── State ──────────────────────────────── */
const State = {
    KEYS: { RB: 'kn5_rb', PREFS: 'kn5_prefs', SAVED: 'kn5_saved', SEARCH: 'kn5_search' },
    _g(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
    _s(k, v) { localStorage.setItem(k, JSON.stringify(v)); },

    rb() { return this._g(this.KEYS.RB, JSON.parse(JSON.stringify(this._defaults.rb))); },
    prefs() { return this._g(this.KEYS.PREFS, { ...this._defaults.prefs }); },
    saved() { return this._g(this.KEYS.SAVED, []); },

    saveRb(v) { this._s(this.KEYS.RB, v); },
    savePrefs(v) { this._s(this.KEYS.PREFS, v); },
    saveSaved(v) { this._s(this.KEYS.SAVED, v); },

    filters: { keyword: '', sort: 'score' },

    _defaults: {
        rb: {
            personal: { name: '', email: '', phone: '', location: '', github: '', linkedin: '' },
            summary: '',
            experience: [{ company: '', role: '', duration: '', desc: '' }],
            education: [{ institution: '', degree: 'B.Tech', year: '2024' }],
            skills: ['JavaScript', 'React'],
            color: '#8B0000'
        },
        prefs: { roleKeywords: ['SDE', 'React', 'Java', 'Frontend', 'Backend'] }
    },

    init() { this.filters.keyword = localStorage.getItem(this.KEYS.SEARCH) || ''; }
};

/* ─── Router ─────────────────────────────── */
const App = {
    _path: '/',
    _routes: {
        '/': { step: 1, title: 'Command Center', sub: 'Your integrated hub for career intelligence.' },
        '/dashboard': { step: 2, title: 'Job Discovery', sub: 'Real-time Indian tech opportunities with heuristic matching.' },
        '/rb': { step: 3, title: 'Resume Engine', sub: 'ATS-optimized resume builder with live scoring.' },
        '/settings': { step: 4, title: 'System Config', sub: 'Fine-tune the heuristic matching engine.' }
    },

    mount() {
        const hash = window.location.hash.slice(1) || '/';
        this._path = hash.split('?')[0];
        const r = this._routes[this._path] || this._routes['/'];
        document.title = `${r.title} | KodNest`;

        // Chrome
        const step = $('app-step');
        if (step) step.textContent = `Step ${r.step} / 4`;
        const badge = $('app-badge');
        if (badge) badge.innerHTML = `<span class="top-bar__badge badge--active">Active</span>`;
        const hdr = $('app-header');
        if (hdr) hdr.innerHTML = `
            <div class="fade-in">
                <div class="page-header__label">Module ${r.step}</div>
                <h1 class="page-header__title">${h(r.title)}</h1>
                <p class="page-header__subtitle">${h(r.sub)}</p>
            </div>`;
        const ft = $('app-footer');
        if (ft) ft.innerHTML = `
            <span class="footer__item">✦ Secure</span>
            <span class="footer__item">✦ Synced</span>
            <span class="footer__item">✦ v5.0</span>`;

        // Content
        const { workspace, panel } = this._page();
        const ws = $('app-workspace');
        const pn = $('app-panel');
        if (ws) ws.innerHTML = `<div class="fade-in">${this._nav()}${workspace}</div>`;
        if (pn) pn.innerHTML = `<div class="fade-in">${panel}</div>`;

        this._bind();
    },

    _nav() {
        const p = this._path;
        const link = (href, label) => `<a href="#${href}" class="nav__link ${p === href ? 'active' : ''}">${label}</a>`;
        return `<nav class="nav">${link('/', 'Hub')}${link('/dashboard', 'Market')}${link('/rb', 'Resume')}${link('/settings', 'Config')}</nav>`;
    },

    _page() {
        switch (this._path) {
            case '/dashboard': return Pages.dashboard();
            case '/rb': return Pages.resume();
            case '/settings': return Pages.settings();
            default: return Pages.landing();
        }
    },

    _bind() {
        const p = this._path;

        if (p === '/dashboard') {
            const si = $('search-input');
            if (si) {
                si.addEventListener('input', e => {
                    State.filters.keyword = e.target.value;
                    localStorage.setItem(State.KEYS.SEARCH, e.target.value);
                    UI.refreshJobs();
                });
                // Restore focus after mount
                requestAnimationFrame(() => si.focus());
            }
            const ss = $('sort-select');
            if (ss) ss.addEventListener('change', e => { State.filters.sort = e.target.value; UI.refreshJobs(); });
            UI.refreshJobs();
        }

        if (p === '/rb') {
            document.querySelectorAll('.rb-input').forEach(inp => {
                inp.addEventListener('input', e => {
                    const keys = e.target.dataset.path.split('.');
                    const rs = State.rb();
                    if (keys.length === 2) rs[keys[0]][keys[1]] = e.target.value;
                    else rs[keys[0]] = e.target.value;
                    State.saveRb(rs);
                    UI.syncPreview();
                });
            });
            document.querySelectorAll('.rb-list').forEach(inp => {
                inp.addEventListener('input', e => {
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

        if (p === '/settings') {
            const btn = $('save-settings');
            if (btn) btn.addEventListener('click', UI.saveSettings);
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

/* ─── Pages ──────────────────────────────── */
const Pages = {
    landing() {
        const modules = [
            { icon: '📡', title: 'Market Discovery', desc: `${jobsData.length} curated Indian tech roles with heuristic matching.`, href: '#/dashboard', cta: 'Explore Jobs' },
            { icon: '📄', title: 'Resume Engine', desc: 'Build ATS-optimized resumes with live scoring and PDF export.', href: '#/rb', cta: 'Build Resume' },
            { icon: '💎', title: 'Placement Prep', desc: 'Interactive readiness simulations and skill assessments.', href: 'placement/index.html', cta: 'Start Prep' }
        ];
        return {
            workspace: `
                <div class="grid-3">
                    ${modules.map(m => `
                        <div class="card card--interactive">
                            <div style="font-size:36px;margin-bottom:var(--space-4);">${m.icon}</div>
                            <h3 style="margin-bottom:var(--space-2);">${h(m.title)}</h3>
                            <p style="font-size:var(--text-sm);color:var(--color-text-secondary);line-height:1.6;margin-bottom:var(--space-6);">${h(m.desc)}</p>
                            <a href="${m.href}" class="btn btn--primary btn--full">${m.cta}</a>
                        </div>`).join('')}
                </div>`,
            panel: `
                <div class="card">
                    <div class="section-label">System Status</div>
                    <div style="display:grid;gap:var(--space-3);font-family:var(--font-mono);font-size:var(--text-xs);">
                        <div style="color:var(--color-success);">● ${jobsData.length} jobs indexed</div>
                        <div style="color:var(--color-success);">● Resume engine ready</div>
                        <div style="color:var(--color-success);">● Placement module linked</div>
                        <div style="color:var(--color-success);">● All systems operational</div>
                    </div>
                </div>`
        };
    },

    dashboard() {
        return {
            workspace: `
                <div class="card" style="margin-bottom:var(--space-5);">
                    <div style="display:flex;gap:var(--space-3);flex-wrap:wrap;">
                        <input type="text" id="search-input" class="input" style="flex:1;min-width:0;" placeholder="Search by role, company, or skill..." value="${h(State.filters.keyword)}">
                        <select id="sort-select" class="input" style="width:auto;flex:0 0 auto;">
                            <option value="score" ${State.filters.sort === 'score' ? 'selected' : ''}>Best Match</option>
                            <option value="latest" ${State.filters.sort === 'latest' ? 'selected' : ''}>Newest</option>
                        </select>
                    </div>
                </div>
                <div id="jobs-list" style="display:grid;gap:var(--space-4);"></div>`,
            panel: `
                <div class="card" style="background:var(--color-text);color:white;">
                    <div class="section-label" style="color:rgba(255,255,255,0.5);">Live Intelligence</div>
                    <div id="jobs-count" style="font-size:var(--text-3xl);font-family:var(--font-serif);font-weight:600;margin:var(--space-2) 0;">0</div>
                    <div style="font-size:var(--text-xs);color:rgba(255,255,255,0.5);">RESULTS AVAILABLE</div>
                </div>
                <div class="card" id="saved-panel">
                    <div class="section-label">Saved Jobs</div>
                    <div id="saved-count" style="font-family:var(--font-serif);font-size:var(--text-xl);font-weight:600;">0</div>
                </div>`
        };
    },

    resume() {
        const rs = State.rb();
        const field = (label, path, type, val, placeholder = '') =>
            `<div>
                <label class="section-label" style="margin-bottom:var(--space-1);">${label}</label>
                <input type="${type}" class="input rb-input" data-path="${path}" value="${h(val)}" placeholder="${placeholder}">
            </div>`;

        return {
            workspace: `
                <div style="display:grid;gap:var(--space-5);">
                    <!-- I. Identification -->
                    <div class="card">
                        <div class="card__title" style="margin-bottom:var(--space-5);">Identification</div>
                        <div class="grid-2">
                            ${field('Full Name', 'personal.name', 'text', rs.personal.name, 'Harshith Kumar')}
                            ${field('Email', 'personal.email', 'email', rs.personal.email, 'hello@example.com')}
                            ${field('Phone', 'personal.phone', 'tel', rs.personal.phone, '+91 98765 43210')}
                            ${field('Location', 'personal.location', 'text', rs.personal.location, 'Bangalore, India')}
                            ${field('GitHub', 'personal.github', 'text', rs.personal.github, 'github.com/username')}
                            ${field('LinkedIn', 'personal.linkedin', 'text', rs.personal.linkedin, 'linkedin.com/in/username')}
                        </div>
                    </div>

                    <!-- II. Summary -->
                    <div class="card">
                        <div class="card__title" style="margin-bottom:var(--space-5);">Professional Summary</div>
                        <textarea class="input rb-input" data-path="summary" rows="4" placeholder="Results-driven software engineer with expertise in...">${h(rs.summary)}</textarea>
                    </div>

                    <!-- III. Experience -->
                    <div class="card">
                        <div class="flex-between" style="margin-bottom:var(--space-5);">
                            <div class="card__title" style="margin-bottom:0;">Experience</div>
                            <button class="btn btn--secondary" onclick="UI.addItem('experience')">+ Add</button>
                        </div>
                        <div id="exp-list">
                            ${rs.experience.map((exp, i) => `
                                <div class="entry entry--experience">
                                    <button class="entry__remove" onclick="UI.removeItem('experience',${i})" title="Remove">✕</button>
                                    <div class="grid-2" style="margin-bottom:var(--space-3);">
                                        <input type="text" class="input rb-list" data-section="experience" data-index="${i}" data-field="company" placeholder="Company" value="${h(exp.company)}">
                                        <input type="text" class="input rb-list" data-section="experience" data-index="${i}" data-field="role" placeholder="Role / Title" value="${h(exp.role)}">
                                    </div>
                                    <input type="text" class="input rb-list" data-section="experience" data-index="${i}" data-field="duration" placeholder="Duration (e.g. Jan 2023 – Present)" value="${h(exp.duration)}" style="margin-bottom:var(--space-3);">
                                    <textarea class="input rb-list" data-section="experience" data-index="${i}" data-field="desc" rows="3" placeholder="• Led development of...\n• Improved performance by...">${h(exp.desc)}</textarea>
                                </div>`).join('')}
                        </div>
                    </div>

                    <!-- IV. Education -->
                    <div class="card">
                        <div class="flex-between" style="margin-bottom:var(--space-5);">
                            <div class="card__title" style="margin-bottom:0;">Education</div>
                            <button class="btn btn--secondary" onclick="UI.addItem('education')">+ Add</button>
                        </div>
                        <div id="edu-list">
                            ${rs.education.map((edu, i) => `
                                <div class="entry entry--education">
                                    <button class="entry__remove" onclick="UI.removeItem('education',${i})" title="Remove">✕</button>
                                    <div class="grid-2" style="gap:var(--space-3);">
                                        <input type="text" class="input rb-list" data-section="education" data-index="${i}" data-field="institution" placeholder="University / College" value="${h(edu.institution)}">
                                        <div style="display:flex;gap:var(--space-3);">
                                            <input type="text" class="input rb-list" data-section="education" data-index="${i}" data-field="degree" placeholder="Degree" value="${h(edu.degree)}" style="flex:1;">
                                            <input type="text" class="input rb-list" data-section="education" data-index="${i}" data-field="year" placeholder="Year" value="${h(edu.year)}" style="width:80px;">
                                        </div>
                                    </div>
                                </div>`).join('')}
                        </div>
                    </div>

                    <!-- V. Skills -->
                    <div class="card">
                        <div class="card__title" style="margin-bottom:var(--space-5);">Skills</div>
                        <div id="skills-tags" class="flex-wrap" style="margin-bottom:var(--space-4);">
                            ${rs.skills.map((s, i) => `
                                <span class="tag tag--accent">
                                    ${h(s)}
                                    <span class="tag__remove" onclick="UI.removeSkill(${i})" title="Remove">×</span>
                                </span>`).join('')}
                        </div>
                        <div style="display:flex;gap:var(--space-2);">
                            <input type="text" id="new-skill" class="input" style="flex:1;" placeholder="Add skill..." onkeydown="if(event.key==='Enter'){UI.addSkill();event.preventDefault();}">
                            <button class="btn btn--primary" onclick="UI.addSkill()">Add</button>
                        </div>
                    </div>

                    <!-- Live Preview -->
                    <div class="resume-wrapper">
                        <div class="resume-canvas" id="resume-canvas"></div>
                    </div>

                    <!-- Download -->
                    <div class="sticky-action">
                        <button class="btn btn--primary btn--full" style="height:52px;font-size:var(--text-base);border-radius:var(--radius-lg);" onclick="UI.printPdf()">↓ Download PDF</button>
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
                    <div class="card__title" style="margin-bottom:var(--space-3);">Matching Engine</div>
                    <p style="font-size:var(--text-sm);color:var(--color-text-secondary);line-height:1.8;margin-bottom:var(--space-6);max-width:var(--max-text);">
                        Define keywords to personalise job scoring. Jobs containing these keywords in titles or skill requirements will receive higher match scores.
                    </p>
                    <label class="section-label">Role Keywords (comma-separated)</label>
                    <textarea id="pref-keywords" class="input" rows="4" placeholder="SDE, React, Java, Frontend">${h(pr.roleKeywords.join(', '))}</textarea>
                    <button id="save-settings" class="btn btn--primary btn--full" style="margin-top:var(--space-5);">Save Configuration</button>
                </div>
                <div class="card" style="margin-top:var(--space-5);">
                    <div class="card__title" style="margin-bottom:var(--space-3);">About</div>
                    <p style="font-size:var(--text-sm);color:var(--color-text-secondary);line-height:1.8;max-width:var(--max-text);">
                        KodNest Intelligence Suite v5.0. Built for Indian tech professionals. Includes heuristic job matching, ATS-optimized resume generation, and placement readiness tools.
                    </p>
                </div>`,
            panel: `
                <div class="card">
                    <div class="section-label">Active Keywords</div>
                    <div class="flex-wrap" style="margin-top:var(--space-3);">
                        ${pr.roleKeywords.map(k => `<span class="tag tag--accent">${h(k)}</span>`).join('')}
                    </div>
                </div>`
        };
    }
};

/* ─── UI Actions ─────────────────────────── */
const UI = {
    /* Job Discovery */
    getFilteredJobs() {
        const pr = State.prefs();
        const kw = pr.roleKeywords.map(k => k.toLowerCase());
        let results = jobsData.map(j => {
            let score = 10;
            kw.forEach(k => {
                if (j.title.toLowerCase().includes(k)) score += 25;
                if (j.skills.some(s => s.toLowerCase().includes(k))) score += 15;
                if (j.description && j.description.toLowerCase().includes(k)) score += 5;
            });
            return { ...j, score: Math.min(score, 100) };
        });
        const query = State.filters.keyword.toLowerCase();
        if (query) {
            results = results.filter(j =>
                j.title.toLowerCase().includes(query) ||
                j.company.toLowerCase().includes(query) ||
                j.skills.some(s => s.toLowerCase().includes(query))
            );
        }
        results.sort((a, b) => State.filters.sort === 'score' ? b.score - a.score : a.postedDaysAgo - b.postedDaysAgo);
        return results;
    },

    refreshJobs() {
        const jobs = this.getFilteredJobs();
        const list = $('jobs-list');
        if (list) {
            if (jobs.length === 0) {
                list.innerHTML = `<div class="card"><div class="empty"><div class="empty__title">No matches</div><div class="empty__desc">Try adjusting your search or update keywords in Config.</div></div></div>`;
            } else {
                list.innerHTML = jobs.map(j => this._jobCard(j)).join('');
            }
        }
        const ct = $('jobs-count');
        if (ct) ct.textContent = jobs.length;
        const sc = $('saved-count');
        if (sc) sc.textContent = State.saved().length;
    },

    _jobCard(job) {
        const saved = State.saved().includes(job.id);
        const high = job.score > 55;
        return `
            <div class="job-card ${high ? 'job-card--high' : ''}">
                <div class="job-card__header">
                    <div>
                        <div class="job-card__title">${h(job.title)}</div>
                        <div class="job-card__company">${h(job.company)}</div>
                        <div class="job-card__meta">${h(job.location)} · ${h(job.experience)} yrs · ${h(job.mode)} · ${job.postedDaysAgo === 0 ? 'Today' : job.postedDaysAgo + 'd ago'}</div>
                    </div>
                    <div class="job-card__score">
                        <div class="job-card__score-value">${job.score}%</div>
                        <div class="job-card__score-label">Match</div>
                    </div>
                </div>
                <div class="job-card__skills">
                    ${job.skills.slice(0, 5).map(s => `<span class="tag">${h(s)}</span>`).join('')}
                </div>
                <div class="job-card__footer">
                    <span class="job-card__salary">${h(job.salaryRange) || 'Competitive'}</span>
                    <div class="job-card__actions">
                        <button class="btn btn--icon btn--secondary" onclick="UI.toggleSave('${job.id}')" title="${saved ? 'Unsave' : 'Save'}">${saved ? '❤️' : '🤍'}</button>
                        <a href="${h(job.applyUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn--primary">Apply →</a>
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

    /* Resume Builder */
    addItem(section) {
        const rs = State.rb();
        if (section === 'experience') rs.experience.unshift({ company: '', role: '', duration: '', desc: '' });
        else rs.education.unshift({ institution: '', degree: '', year: '' });
        State.saveRb(rs);
        App.mount();
    },

    removeItem(section, i) {
        const rs = State.rb();
        if (rs[section].length <= 1) return;
        rs[section].splice(i, 1);
        State.saveRb(rs);
        App.mount();
    },

    addSkill() {
        const inp = $('new-skill');
        if (!inp) return;
        const v = inp.value.trim();
        if (!v) return;
        const rs = State.rb();
        if (!rs.skills.includes(v)) { rs.skills.push(v); State.saveRb(rs); App.mount(); }
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

        const canvas = $('resume-canvas');
        if (canvas) {
            const contactParts = [
                rs.personal.email && `✉ ${h(rs.personal.email)}`,
                rs.personal.phone && `☎ ${h(rs.personal.phone)}`,
                rs.personal.location && `📍 ${h(rs.personal.location)}`,
                rs.personal.github && `⌂ ${h(rs.personal.github)}`,
                rs.personal.linkedin && `in/ ${h(rs.personal.linkedin)}`
            ].filter(Boolean);

            canvas.innerHTML = `
                <!-- Header -->
                <div style="border-bottom:3px solid ${c};padding-bottom:16px;margin-bottom:24px;">
                    <h1 style="color:${c};font-size:28px;margin:0;letter-spacing:0.5px;">${h(rs.personal.name) || 'YOUR NAME'}</h1>
                    ${contactParts.length ? `<div style="display:flex;flex-wrap:wrap;gap:12px;font-size:11px;color:#666;margin-top:8px;">${contactParts.map(p => `<span>${p}</span>`).join('')}</div>` : ''}
                </div>

                ${rs.summary ? `
                <!-- Summary -->
                <div style="margin-bottom:20px;">
                    <h2 style="color:${c};">Summary</h2>
                    <p style="font-size:12px;line-height:1.7;color:#333;">${h(rs.summary)}</p>
                </div>` : ''}

                <!-- Experience -->
                <div style="margin-bottom:20px;">
                    <h2 style="color:${c};">Experience</h2>
                    ${rs.experience.map(exp => `
                        <div style="margin-bottom:14px;">
                            <div style="display:flex;justify-content:space-between;align-items:baseline;">
                                <span style="font-weight:700;font-size:13px;">${h(exp.company) || 'Company'}</span>
                                <span style="font-size:11px;color:#999;">${h(exp.duration)}</span>
                            </div>
                            <div style="font-style:italic;font-size:11px;color:${c};margin:2px 0 6px;">${h(exp.role) || 'Role'}</div>
                            <p style="font-size:11px;line-height:1.7;color:#555;white-space:pre-line;">${h(exp.desc)}</p>
                        </div>`).join('')}
                </div>

                <!-- Education -->
                <div style="margin-bottom:20px;">
                    <h2 style="color:${c};">Education</h2>
                    ${rs.education.map(edu => `
                        <div style="margin-bottom:10px;">
                            <div style="font-weight:700;font-size:13px;">${h(edu.institution) || 'Institution'}</div>
                            <div style="font-size:11px;color:#555;">${h(edu.degree)} · ${h(edu.year)}</div>
                        </div>`).join('')}
                </div>

                ${rs.skills.length ? `
                <!-- Skills -->
                <div>
                    <h2 style="color:${c};">Skills</h2>
                    <p style="font-size:12px;color:#333;line-height:1.8;">${rs.skills.map(s => h(s)).join(' · ')}</p>
                </div>` : ''}
            `;
        }

        // Telemetry Panel
        const panel = $('rb-telemetry');
        if (panel) {
            const label = score < 35 ? 'Needs Work' : score < 60 ? 'Good Start' : score < 85 ? 'Strong' : 'Excellent';
            const color = score < 35 ? 'var(--color-warning)' : score < 60 ? 'var(--color-accent)' : 'var(--color-success)';
            panel.innerHTML = `
                <div class="card">
                    <div class="ats-panel">
                        <div class="section-label">ATS Score</div>
                        <div class="ats-score" style="color:${color};">${score}</div>
                        <div class="ats-label" style="color:${color};">${label}</div>
                        <div class="ats-checklist">
                            <div class="ats-checklist__title">Completeness</div>
                            ${this._chk(rs.personal.name, 'Full name')}
                            ${this._chk(rs.personal.email, 'Email address')}
                            ${this._chk(rs.personal.phone, 'Phone number')}
                            ${this._chk(rs.summary.length > 50, 'Summary (50+ chars)')}
                            ${this._chk(rs.skills.length >= 5, 'Skills (5+)')}
                            ${this._chk(rs.experience[0]?.company, 'Company name')}
                            ${this._chk(rs.experience[0]?.desc?.length > 80, 'Detailed experience')}
                            ${this._chk(rs.education[0]?.institution, 'Education')}
                        </div>
                    </div>
                </div>`;
        }
    },

    _chk(ok, label) {
        return `<div class="ats-check ${ok ? 'ats-check--done' : 'ats-check--todo'}">${ok ? '✓' : '○'} ${label}</div>`;
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

    /* Settings */
    saveSettings() {
        const v = $('pref-keywords');
        if (!v) return;
        const kw = v.value.split(',').map(x => x.trim()).filter(Boolean);
        if (kw.length === 0) return;
        State.savePrefs({ roleKeywords: kw });
        // Visual feedback
        const btn = $('save-settings');
        if (btn) { btn.textContent = '✓ Saved'; btn.disabled = true; setTimeout(() => { btn.textContent = 'Save Configuration'; btn.disabled = false; }, 1500); }
    },

    /* Print */
    printPdf() { window.print(); }
};

/* ─── Boot ───────────────────────────────── */
State.init();
window.addEventListener('hashchange', () => App.mount());
document.addEventListener('DOMContentLoaded', () => App.mount());
