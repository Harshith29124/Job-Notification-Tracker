// KodNest Premium - Job Notification Tracker Router

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
 * Render dashboard page
 */
function renderDashboardPage() {
    return `
        <div class="page-container">
            <div class="page-header">
                <h1 class="page-header__title">Dashboard</h1>
                <p class="page-header__subtitle">Your daily job matches</p>
            </div>
            
            <div class="empty-state">
                <h2 class="empty-state__title">No jobs yet</h2>
                <p class="empty-state__description">In the next step, you will load a realistic dataset.</p>
            </div>
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
 * Render saved page
 */
function renderSavedPage() {
    return `
        <div class="page-container">
            <div class="page-header">
                <h1 class="page-header__title">Saved Jobs</h1>
                <p class="page-header__subtitle">Jobs you've bookmarked for later</p>
            </div>
            
            <div class="empty-state">
                <h2 class="empty-state__title">No saved jobs</h2>
                <p class="empty-state__description">Jobs you save will appear here for easy access.</p>
                <a href="#/dashboard" class="btn btn--secondary">Browse Jobs</a>
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
                            <input type="checkbox" id="proof-ui" class="proof-checkbox" disabled>
                            <label for="proof-ui" class="proof-label">UI Implementation Complete</label>
                        </div>
                        <div class="proof-item">
                            <input type="checkbox" id="proof-data" class="proof-checkbox" disabled>
                            <label for="proof-data" class="proof-label">Data Integration Working</label>
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
