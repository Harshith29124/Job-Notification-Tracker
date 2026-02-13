// KodNest Premium Build System - Application Logic

document.addEventListener('DOMContentLoaded', () => {
    initializeCopyButtons();
    initializeCheckboxes();
    initializeStatusBadges();
});

/**
 * Initialize copy-to-clipboard functionality for prompt boxes
 */
function initializeCopyButtons() {
    const copyButtons = document.querySelectorAll('.prompt-box__copy');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const promptBox = button.closest('.prompt-box');
            const codeElement = promptBox.querySelector('.prompt-box__code');
            const textToCopy = codeElement.textContent;
            
            try {
                await navigator.clipboard.writeText(textToCopy);
                
                // Visual feedback
                const originalText = button.textContent;
                button.textContent = 'Copied';
                button.style.backgroundColor = 'var(--color-background)';
                button.style.borderColor = 'var(--color-success)';
                button.style.color = 'var(--color-success)';
                
                setTimeout(() => {
                    button.textContent = originalText;
                    button.style.backgroundColor = '';
                    button.style.borderColor = '';
                    button.style.color = '';
                }, 1500);
            } catch (err) {
                console.error('Failed to copy text:', err);
                button.textContent = 'Failed';
                setTimeout(() => {
                    button.textContent = 'Copy';
                }, 1500);
            }
        });
    });
}

/**
 * Initialize checkbox state persistence
 */
function initializeCheckboxes() {
    const checkboxes = document.querySelectorAll('.checkbox-item__input');
    
    // Load saved states
    checkboxes.forEach((checkbox, index) => {
        const savedState = localStorage.getItem(`proof-checkbox-${index}`);
        if (savedState === 'true') {
            checkbox.checked = true;
        }
        
        // Save state on change
        checkbox.addEventListener('change', () => {
            localStorage.setItem(`proof-checkbox-${index}`, checkbox.checked);
            updateProgressIndicator();
        });
    });
    
    updateProgressIndicator();
}

/**
 * Update progress indicator based on completed checkboxes
 */
function updateProgressIndicator() {
    const checkboxes = document.querySelectorAll('.checkbox-item__input');
    const totalCheckboxes = checkboxes.length;
    const checkedCheckboxes = Array.from(checkboxes).filter(cb => cb.checked).length;
    
    // Update status badge if all checkboxes are checked
    if (checkedCheckboxes === totalCheckboxes && totalCheckboxes > 0) {
        updateStatusBadge('shipped');
    } else if (checkedCheckboxes > 0) {
        updateStatusBadge('in-progress');
    } else {
        updateStatusBadge('not-started');
    }
}

/**
 * Update status badge display
 */
function updateStatusBadge(status) {
    const statusBadge = document.querySelector('.top-bar__status .status-badge');
    if (!statusBadge) return;
    
    // Remove all status classes
    statusBadge.classList.remove(
        'status-badge--not-started',
        'status-badge--in-progress',
        'status-badge--shipped'
    );
    
    // Add new status class and update text
    switch (status) {
        case 'not-started':
            statusBadge.classList.add('status-badge--not-started');
            statusBadge.textContent = 'Not Started';
            break;
        case 'in-progress':
            statusBadge.classList.add('status-badge--in-progress');
            statusBadge.textContent = 'In Progress';
            break;
        case 'shipped':
            statusBadge.classList.add('status-badge--shipped');
            statusBadge.textContent = 'Shipped';
            break;
    }
}

/**
 * Initialize status badge interactions
 */
function initializeStatusBadges() {
    // This function can be extended to handle status badge clicks or updates
    // Currently, status is managed by checkbox completion
}

/**
 * Utility function to show temporary notifications
 */
function showNotification(message, type = 'success') {
    // This can be extended to show toast notifications
    console.log(`[${type.toUpperCase()}] ${message}`);
}

/**
 * Export utility functions for external use
 */
window.KodNestPremium = {
    updateStatusBadge,
    showNotification
};
