document.addEventListener('DOMContentLoaded', () => {
    
    /**
     * 1. MOBILE MENU TOGGLE
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
     */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return; 

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    /**
     * 4. INTERSECTION OBSERVER (FADE-IN REVEAL)
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

    const revealElements = document.querySelectorAll('.card, .hero-content, .featured-partner, .list-item, .product-card, .stack-item');
    
    revealElements.forEach(el => {
        el.classList.add('reveal-hidden'); 
        revealObserver.observe(el);
    });
});
