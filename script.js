document.addEventListener('DOMContentLoaded', () => {
    
    /**
     * 1. MOBILE MENU TOGGLE
     * Handles the transition between hamburger and close icons.
     */
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            const isActive = navLinks.classList.toggle('mobile-active');
            navLinks.classList.toggle('hidden-mobile', !isActive);
            
            // Toggle icon and Accessibility state
            menuToggle.textContent = isActive ? '✕' : '☰';
            menuToggle.setAttribute('aria-expanded', isActive);
        });
    }

    /**
     * 2. ACTIVE STATE HIGHLIGHTING
     * Automatically underlines the link of the page the user is currently on.
     */
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-link').forEach(link => {
        const linkPath = link.getAttribute('href').replace('..', '').replace('.', '');
        if (currentPath === linkPath || (linkPath !== '/' && currentPath.includes(linkPath))) {
            link.classList.add('active');
        }
    });

    /**
     * 3. SMOOTH SCROLLING
     * Fallback for anchor links to ensure consistent behavior across browsers.
     */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return; // Skip empty anchors

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    /**
     * 4. INTERSECTION OBSERVER (FADE-IN REVEAL)
     * Detects when elements enter the viewport and triggers the animation.
     */
    const observerOptions = { threshold: 0.15 };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Optimized selector: catches all main card and content types
    const revealElements = document.querySelectorAll('.card, .hero-content, .featured-partner, .list-item, .product-card, .stack-item');
    
    revealElements.forEach(el => {
        el.classList.add('reveal-hidden'); // Initialize state
        revealObserver.observe(el);
    });
});
