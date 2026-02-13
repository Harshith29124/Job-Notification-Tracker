// KodNest Premium - Job Notification Tracker Router

// Global state
let currentFilters = {
    keyword: '',
    location: '',
    mode: '',
    experience: '',
    source: '',
    sort: 'latest'
};

let currentJobModal = null;

// Route definitions
const routes = {
    '/': {
        title: 'Job Notification Tracker',
        render: () => renderLandingPage()
    },
    '/dashboard': {
        title: 'Dashboard',
        render: () => renderDashboardPage()
    },
    '/saved': {
        title: 'Saved',
        render: () => renderSavedPage()
    },
    '/digest': {
        title: 'Digest',
        render: () => renderDigestPage()
    },
    '/settings': {
        title: 'Settings',
        render: () => renderSettingsPage()
    },
    '/proof': {
        title: 'Proof',
        render: () => renderProofPage()
    }
};

/**
 * Render landing page
 */
function renderLandingPage() {
    return `
        <div class="landing-page">
            <div class="hero">
                <h1 class="hero__title">Stop Missing The Right Jobs.</h1>
                <p class="hero__subtitle">Precision-matched job discovery delivered daily at 9AM.</p>
                <a href="#/settings" class="btn btn--primary btn--large">Start Tracking</a>
            </div>
        </div>
    `;
}

/**
 * Get filtered and sorted jobs
 */
function getFilteredJobs() {
    let filtered = [...jobsData];

    // Apply keyword filter
    if (currentFilters.keyword) {
        const keyword = currentFilters.keyword.toLowerCase();
        filtered = filtered.filter(job =>
            job.title.toLowerCase().includes(keyword) ||
            job.company.toLowerCase().includes(keyword) ||
            job.skills.some(skill => skill.toLowerCase().includes(keyword))
        );
    }

    // Apply location filter
    if (currentFilters.location) {
        filtered = filtered.filter(job =>
            job.location.toLowerCase() === currentFilters.location.toLowerCase()
        );
    }

    // Apply mode filter
    if (currentFilters.mode) {
        filtered = filtered.filter(job =>
            job.mode.toLowerCase() === currentFilters.mode.toLowerCase()
        );
    }

    // Apply experience filter
    if (currentFilters.experience) {
        filtered = filtered.filter(job =>
            job.experience.toLowerCase() === currentFilters.experience.toLowerCase()
        );
    }

    // Apply source filter
    if (currentFilters.source) {
        filtered = filtered.filter(job =>
            job.source.toLowerCase() === currentFilters.source.toLowerCase()
        );
    }

    // Apply sorting
    if (currentFilters.sort === 'latest') {
        filtered.sort((a, b) => a.postedDaysAgo - b.postedDaysAgo);
    } else if (currentFilters.sort === 'oldest') {
        filtered.sort((a, b) => b.postedDaysAgo - a.postedDaysAgo);
    }

    return filtered;
}

/**
 * Format posted time
 */
function formatPostedTime(daysAgo) {
    if (daysAgo === 0) return 'Today';
    if (daysAgo === 1) return '1 day ago';
    return `${daysAgo} days ago`;
}

/**
 * Check if job is saved
 */
function isJobSaved(jobId) {
    const saved = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    return saved.includes(jobId);
}

/**
 * Toggle job saved status
 */
function toggleSaveJob(jobId) {
    let saved = JSON.parse(localStorage.getItem('savedJobs') || '[]');

    if (saved.includes(jobId)) {
        saved = saved.filter(id => id !== jobId);
    } else {
        saved.push(jobId);
    }

    localStorage.setItem('savedJobs', JSON.stringify(saved));

    // Re-render current page
    renderRoute();
}

/**
 * Open job modal
 */
function openJobModal(jobId) {
    const job = jobsData.find(j => j.id === jobId);
    if (!job) return;

    const modal = document.createElement('div');
    modal.className = 'job-modal';
    modal.innerHTML = `
        <div class="job-modal__overlay" onclick="closeJobModal()"></div>
        <div class="job-modal__content">
            <button class="job-modal__close" onclick="closeJobModal()" aria-label="Close modal">&times;</button>
            
            <div class="job-modal__header">
                <h2 class="job-modal__title">${job.title}</h2>
                <p class="job-modal__company">${job.company}</p>
            </div>
            
            <div class="job-modal__meta">
                <span class="job-meta__item">📍 ${job.location}</span>
                <span class="job-meta__item">💼 ${job.mode}</span>
                <span class="job-meta__item">⏱️ ${job.experience}</span>
                <span class="job-meta__item">💰 ${job.salaryRange}</span>
            </div>
            
            <div class="job-modal__section">
                <h3 class="job-modal__section-title">Description</h3>
                <p class="job-modal__description">${job.description}</p>
            </div>
            
            <div class="job-modal__section">
                <h3 class="job-modal__section-title">Required Skills</h3>
                <div class="job-skills">
                    ${job.skills.map(skill => `<span class="job-skill">${skill}</span>`).join('')}
                </div>
            </div>
            
            <div class="job-modal__actions">
                <button class="btn btn--primary" onclick="window.open('${job.applyUrl}', '_blank')">Apply Now</button>
                <button class="btn btn--secondary" onclick="closeJobModal()">Close</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    currentJobModal = modal;
    document.body.style.overflow = 'hidden';
}

/**
 * Close job modal
 */
function closeJobModal() {
    if (currentJobModal) {
        document.body.removeChild(currentJobModal);
        currentJobModal = null;
        document.body.style.overflow = '';
    }
}

// Make functions global
window.toggleSaveJob = toggleSaveJob;
window.openJobModal = openJobModal;
window.closeJobModal = closeJobModal;

/**
 * Render job card
 */
function renderJobCard(job) {
    const isSaved = isJobSaved(job.id);
    const saveIcon = isSaved ? '❤️' : '🤍';
    const saveText = isSaved ? 'Saved' : 'Save';

    return `
        <div class="job-card">
            <div class="job-card__header">
                <div class="job-card__title-section">
                    <h3 class="job-card__title">${job.title}</h3>
                    <p class="job-card__company">${job.company}</p>
                </div>
                <span class="job-source job-source--${job.source.toLowerCase()}">${job.source}</span>
            </div>
            
            <div class="job-card__meta">
                <span class="job-meta__item">📍 ${job.location}</span>
                <span class="job-meta__item">💼 ${job.mode}</span>
                <span class="job-meta__item">⏱️ ${job.experience}</span>
            </div>
            
            <div class="job-card__salary">${job.salaryRange}</div>
            
            <div class="job-card__footer">
                <span class="job-card__posted">${formatPostedTime(job.postedDaysAgo)}</span>
                <div class="job-card__actions">
                    <button class="btn btn--small btn--secondary" onclick="openJobModal('${job.id}')">View</button>
                    <button class="btn btn--small ${isSaved ? 'btn--saved' : 'btn--secondary'}" onclick="toggleSaveJob('${job.id}')">
                        ${saveIcon} ${saveText}
                    </button>
                    <button class="btn btn--small btn--primary" onclick="window.open('${job.applyUrl}', '_blank')">Apply</button>
                </div>
            </div>
        </div>
    `;
}

/**
 * Render filter bar
 */
function renderFilterBar() {
    // Get unique values for dropdowns
    const locations = [...new Set(jobsData.map(j => j.location))].sort();
    const modes = [...new Set(jobsData.map(j => j.mode))].sort();
    const experiences = [...new Set(jobsData.map(j => j.experience))].sort();
    const sources = [...new Set(jobsData.map(j => j.source))].sort();

    return `
        <div class="filter-bar">
            <div class="filter-bar__search">
                <input 
                    type="text" 
                    id="filter-keyword" 
                    class="filter-input" 
                    placeholder="Search by title, company, or skills..."
                    value="${currentFilters.keyword}"
                >
            </div>
            
            <div class="filter-bar__filters">
                <select id="filter-location" class="filter-select">
                    <option value="">All Locations</option>
                    ${locations.map(loc => `
                        <option value="${loc}" ${currentFilters.location === loc ? 'selected' : ''}>${loc}</option>
                    `).join('')}
                </select>
                
                <select id="filter-mode" class="filter-select">
                    <option value="">All Modes</option>
                    ${modes.map(mode => `
                        <option value="${mode}" ${currentFilters.mode === mode ? 'selected' : ''}>${mode}</option>
                    `).join('')}
                </select>
                
                <select id="filter-experience" class="filter-select">
                    <option value="">All Experience</option>
                    ${experiences.map(exp => `
                        <option value="${exp}" ${currentFilters.experience === exp ? 'selected' : ''}>${exp}</option>
                    `).join('')}
                </select>
                
                <select id="filter-source" class="filter-select">
                    <option value="">All Sources</option>
                    ${sources.map(src => `
                        <option value="${src}" ${currentFilters.source === src ? 'selected' : ''}>${src}</option>
                    `).join('')}
                </select>
                
                <select id="filter-sort" class="filter-select">
                    <option value="latest" ${currentFilters.sort === 'latest' ? 'selected' : ''}>Latest First</option>
                    <option value="oldest" ${currentFilters.sort === 'oldest' ? 'selected' : ''}>Oldest First</option>
                </select>
                
                <button class="btn btn--secondary btn--small" onclick="clearFilters()">Clear</button>
            </div>
        </div>
    `;
}

/**
 * Clear all filters
 */
function clearFilters() {
    currentFilters = {
        keyword: '',
        location: '',
        mode: '',
        experience: '',
        source: '',
        sort: 'latest'
    };
    renderRoute();
}

window.clearFilters = clearFilters;

/**
 * Initialize filter listeners
 */
function initializeFilters() {
    const keywordInput = document.getElementById('filter-keyword');
    const locationSelect = document.getElementById('filter-location');
    const modeSelect = document.getElementById('filter-mode');
    const experienceSelect = document.getElementById('filter-experience');
    const sourceSelect = document.getElementById('filter-source');
    const sortSelect = document.getElementById('filter-sort');

    if (keywordInput) {
        keywordInput.addEventListener('input', (e) => {
            currentFilters.keyword = e.target.value;
            renderRoute();
        });
    }

    if (locationSelect) {
        locationSelect.addEventListener('change', (e) => {
            currentFilters.location = e.target.value;
            renderRoute();
        });
    }

    if (modeSelect) {
        modeSelect.addEventListener('change', (e) => {
            currentFilters.mode = e.target.value;
            renderRoute();
        });
    }

    if (experienceSelect) {
        experienceSelect.addEventListener('change', (e) => {
            currentFilters.experience = e.target.value;
            renderRoute();
        });
    }

    if (sourceSelect) {
        sourceSelect.addEventListener('change', (e) => {
            currentFilters.source = e.target.value;
            renderRoute();
        });
    }

    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentFilters.sort = e.target.value;
            renderRoute();
        });
    }
}

/**
 * Render dashboard page
 */
function renderDashboardPage() {
    const jobs = getFilteredJobs();

    return `
        <div class="page-container page-container--wide">
            <div class="page-header">
                <h1 class="page-header__title">Dashboard</h1>
                <p class="page-header__subtitle">${jobs.length} job${jobs.length !== 1 ? 's' : ''} available</p>
            </div>
            
            ${renderFilterBar()}
            
            <div class="jobs-grid">
                ${jobs.length > 0
            ? jobs.map(job => renderJobCard(job)).join('')
            : `
                        <div class="empty-state">
                            <h2 class="empty-state__title">No jobs found</h2>
                            <p class="empty-state__description">Try adjusting your filters to see more results.</p>
                            <button class="btn btn--secondary" onclick="clearFilters()">Clear Filters</button>
                        </div>
                    `
        }
            </div>
        </div>
    `;
}

/**
 * Render saved page
 */
function renderSavedPage() {
    const savedIds = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    const savedJobs = jobsData.filter(job => savedIds.includes(job.id));

    return `
        <div class="page-container page-container--wide">
            <div class="page-header">
                <h1 class="page-header__title">Saved Jobs</h1>
                <p class="page-header__subtitle">${savedJobs.length} job${savedJobs.length !== 1 ? 's' : ''} saved</p>
            </div>
            
            ${savedJobs.length > 0
            ? `<div class="jobs-grid">${savedJobs.map(job => renderJobCard(job)).join('')}</div>`
            : `
                    <div class="empty-state">
                        <h2 class="empty-state__title">No saved jobs</h2>
                        <p class="empty-state__description">Jobs you save will appear here for easy access.</p>
                        <a href="#/dashboard" class="btn btn--secondary">Browse Jobs</a>
                    </div>
                `
        }
        </div>
    `;
}

/**
 * Render settings page
 */
function renderSettingsPage() {
    return `
        <div class="page-container">
            <div class="page-header">
                <h1 class="page-header__title">Settings</h1>
                <p class="page-header__subtitle">Configure your job preferences</p>
            </div>
            
            <div class="settings-form">
                <div class="form-section">
                    <h2 class="form-section__title">Job Preferences</h2>
                    
                    <div class="form-group">
                        <label class="form-label" for="role-keywords">Role Keywords</label>
                        <input 
                            type="text" 
                            id="role-keywords" 
                            class="form-input" 
                            placeholder="e.g. Software Engineer, Frontend Developer, React"
                        >
                        <span class="form-hint">Enter keywords separated by commas</span>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label" for="locations">Preferred Locations</label>
                        <input 
                            type="text" 
                            id="locations" 
                            class="form-input" 
                            placeholder="e.g. Bangalore, Remote, San Francisco"
                        >
                        <span class="form-hint">Enter locations separated by commas</span>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label" for="work-mode">Work Mode</label>
                        <select id="work-mode" class="form-select">
                            <option value="">Select work mode</option>
                            <option value="remote">Remote</option>
                            <option value="hybrid">Hybrid</option>
                            <option value="onsite">Onsite</option>
                            <option value="any">Any</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label" for="experience-level">Experience Level</label>
                        <select id="experience-level" class="form-select">
                            <option value="">Select experience level</option>
                            <option value="entry">Entry Level (0-2 years)</option>
                            <option value="mid">Mid Level (2-5 years)</option>
                            <option value="senior">Senior Level (5-10 years)</option>
                            <option value="lead">Lead/Principal (10+ years)</option>
                        </select>
                    </div>
                    
                    <div class="form-actions">
                        <button class="btn btn--primary" disabled>Save Preferences</button>
                        <button class="btn btn--secondary" disabled>Reset</button>
                    </div>
                    
                    <p class="form-note">Preference saving will be implemented in the next step.</p>
                </div>
            </div>
        </div>
    `;
}

/**
 * Render digest page
 */
function renderDigestPage() {
    return `
        <div class="page-container">
            <div class="page-header">
                <h1 class="page-header__title">Daily Digest</h1>
                <p class="page-header__subtitle">Your personalized job summary delivered at 9AM</p>
            </div>
            
            <div class="empty-state">
                <h2 class="empty-state__title">No digest available</h2>
                <p class="empty-state__description">Your daily digest will be generated based on your preferences and recent job matches.</p>
                <a href="#/settings" class="btn btn--secondary">Configure Preferences</a>
            </div>
        </div>
    `;
}

/**
 * Render proof page
 */
function renderProofPage() {
    return `
        <div class="page-container">
            <div class="page-header">
                <h1 class="page-header__title">Proof</h1>
                <p class="page-header__subtitle">Artifact collection and validation</p>
            </div>
            
            <div class="proof-container">
                <div class="proof-section">
                    <h2 class="proof-section__title">Build Artifacts</h2>
                    <p class="proof-section__description">This section will collect screenshots, logs, and validation artifacts as features are implemented.</p>
                    
                    <div class="proof-checklist">
                        <div class="proof-item">
                            <input type="checkbox" id="proof-ui" class="proof-checkbox" checked disabled>
                            <label for="proof-ui" class="proof-label">UI Implementation Complete</label>
                        </div>
                        <div class="proof-item">
                            <input type="checkbox" id="proof-data" class="proof-checkbox" checked disabled>
                            <label for="proof-data" class="proof-label">Data Integration Working (60 jobs loaded)</label>
                        </div>
                        <div class="proof-item">
                            <input type="checkbox" id="proof-matching" class="proof-checkbox" disabled>
                            <label for="proof-matching" class="proof-label">Job Matching Logic Verified</label>
                        </div>
                        <div class="proof-item">
                            <input type="checkbox" id="proof-digest" class="proof-checkbox" disabled>
                            <label for="proof-digest" class="proof-label">Digest Generation Tested</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Get current route from URL hash
 */
function getCurrentRoute() {
    const hash = window.location.hash.slice(1) || '/';
    return hash;
}

/**
 * Navigate to a route
 */
function navigateTo(path) {
    window.location.hash = path;
}

/**
 * Update active navigation links
 */
function updateActiveLinks() {
    const currentRoute = getCurrentRoute();

    // Update desktop navigation links
    const desktopLinks = document.querySelectorAll('.top-nav__link');
    desktopLinks.forEach(link => {
        const linkRoute = link.getAttribute('data-route');
        if (linkRoute === currentRoute || (currentRoute === '/dashboard' && linkRoute === '/')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Update mobile navigation links
    const mobileLinks = document.querySelectorAll('.top-nav__mobile-link');
    mobileLinks.forEach(link => {
        const linkRoute = link.getAttribute('data-route');
        if (linkRoute === currentRoute || (currentRoute === '/dashboard' && linkRoute === '/')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/**
 * Render the current route
 */
function renderRoute() {
    const currentRoute = getCurrentRoute();
    const route = routes[currentRoute] || routes['/'];

    // Update page title
    document.title = `${route.title} - KodNest Premium`;

    // Render content
    const contentElement = document.getElementById('app-content');
    if (contentElement) {
        contentElement.innerHTML = route.render();
    }

    // Update active navigation links
    updateActiveLinks();

    // Close mobile menu if open
    closeMobileMenu();

    // Initialize filters if on dashboard
    if (currentRoute === '/dashboard') {
        initializeFilters();
    }
}

/**
 * Initialize mobile menu toggle
 */
function initializeMobileMenu() {
    const toggleButton = document.querySelector('.top-nav__toggle');
    const mobileMenu = document.querySelector('.top-nav__mobile');

    if (toggleButton && mobileMenu) {
        toggleButton.addEventListener('click', () => {
            toggleButton.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });

        // Close menu when clicking a link
        const mobileLinks = document.querySelectorAll('.top-nav__mobile-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                closeMobileMenu();
            });
        });
    }
}

/**
 * Close mobile menu
 */
function closeMobileMenu() {
    const toggleButton = document.querySelector('.top-nav__toggle');
    const mobileMenu = document.querySelector('.top-nav__mobile');

    if (toggleButton && mobileMenu) {
        toggleButton.classList.remove('active');
        mobileMenu.classList.remove('active');
    }
}

/**
 * Initialize router
 */
function initializeRouter() {
    // Handle hash changes
    window.addEventListener('hashchange', renderRoute);

    // Handle initial load
    window.addEventListener('DOMContentLoaded', () => {
        initializeMobileMenu();
        renderRoute();
    });

    // Handle navigation link clicks
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[data-route]');
        if (link) {
            e.preventDefault();
            const route = link.getAttribute('data-route');
            navigateTo(route);
        }
    });
}

// Initialize the router
initializeRouter();
