document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.querySelector('.nav-links');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.innerText = navLinks.classList.contains('active') ? '✕' : '☰';
        });
    }
    const currentPath = window.location.pathname;
    const allLinks = document.querySelectorAll('.nav-link');
    allLinks.forEach(link => {
        if (currentPath.includes(link.getAttribute('href').replace('..', ''))) {
            link.style.color = 'var(--accent)';
            link.style.borderBottom = '2px solid var(--accent)';
        }
    });
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Simple Intersection Observer for Fade-in effects
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply animation classes
    const animatedElements = document.querySelectorAll('.card, .hero-content, .featured-partner, .list-item');

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
});
