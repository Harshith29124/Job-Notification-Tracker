// KodNest Premium - Job Notification Tracker Router

// Route definitions
const routes = {
    '/': {
        title: 'Dashboard',
        render: () => renderPlaceholder('Dashboard')
    },
    '/dashboard': {
        title: 'Dashboard',
        render: () => renderPlaceholder('Dashboard')
    },
    '/saved': {
        title: 'Saved',
        render: () => renderPlaceholder('Saved')
    },
    '/digest': {
        title: 'Digest',
        render: () => renderPlaceholder('Digest')
    },
    '/settings': {
        title: 'Settings',
        render: () => renderPlaceholder('Settings')
    },
    '/proof': {
        title: 'Proof',
        render: () => renderPlaceholder('Proof')
    }
};

/**
 * Render placeholder page for a route
 */
function renderPlaceholder(pageName) {
    return `
        <div class="placeholder-page">
            <h1 class="placeholder-page__title">${pageName}</h1>
            <p class="placeholder-page__subtitle">This section will be built in the next step.</p>
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
