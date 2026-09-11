document.addEventListener('DOMContentLoaded', () => {
    /**
     * 0. NORMALIZE LEGACY VIDEO VAULT LINKS
     * Keep older static markup working while making /training/videos canonical.
     */
    document.querySelectorAll('a[href]').forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;

        if (
            href.includes('academy/videos.html') ||
            href === '/academy/videos' ||
            href === '/academy/videos.html'
        ) {
            link.setAttribute('href', '/training/videos');
        }
    });

    /**
     * 1. SHARED DROPDOWN STYLES
     */
    if (!document.getElementById('global-nav-dropdown-styles')) {
        const navStyles = document.createElement('style');
        navStyles.id = 'global-nav-dropdown-styles';
        navStyles.textContent = `
            .nav-dropdown { position: relative; display: flex; align-items: center; }
            .nav-dropdown-trigger { display: flex; align-items: center; gap: .2rem; }
            .nav-dropdown-toggle { background: none; border: 0; color: var(--text-muted); cursor: pointer; font-size: .85rem; line-height: 1; padding: .25rem; }
            .nav-dropdown:hover .nav-dropdown-toggle,
            .nav-dropdown.open .nav-dropdown-toggle { color: var(--accent); transform: rotate(180deg); }
            .nav-dropdown-menu {
                position: absolute;
                top: 100%;
                left: 0;
                min-width: 280px;
                display: grid;
                gap: .2rem;
                padding: .65rem;
                background: rgba(10, 10, 10, .98);
                border: 1px solid var(--border);
                border-radius: var(--radius);
                box-shadow: var(--shadow-lg);
                opacity: 0;
                visibility: hidden;
                transform: translateY(-8px);
                transition: var(--transition);
                z-index: 1200;
            }
            .nav-dropdown:hover .nav-dropdown-menu,
            .nav-dropdown.open .nav-dropdown-menu,
            .nav-dropdown:focus-within .nav-dropdown-menu {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }
            .nav-sub-link {
                display: block;
                padding: .7rem .85rem;
                border-radius: 6px;
                color: var(--text-muted);
                font-size: .78rem;
                font-weight: 700;
                line-height: 1.25;
                text-transform: uppercase;
                letter-spacing: .35px;
                white-space: nowrap;
            }
            .nav-sub-link:hover,
            .nav-sub-link.active {
                background: rgba(255, 215, 0, .08);
                color: var(--accent);
            }
            @media (max-width: 768px) {
                .nav-links.mobile-active { overflow-y: auto; justify-content: flex-start; gap: 1.45rem; }
                .nav-links.mobile-active .nav-dropdown { width: min(92vw, 420px); display: block; }
                .nav-links.mobile-active .nav-dropdown-trigger { justify-content: center; }
                .nav-links.mobile-active .nav-dropdown-toggle { font-size: 1.15rem; }
                .nav-links.mobile-active .nav-dropdown-menu {
                    position: static;
                    min-width: 0;
                    width: 100%;
                    margin-top: .8rem;
                    opacity: 1;
                    visibility: visible;
                    transform: none;
                    box-shadow: none;
                    background: #0b0b0b;
                    border-color: #242424;
                    display: grid;
                }
                .nav-links.mobile-active .nav-sub-link {
                    font-size: .9rem;
                    padding: .8rem 1rem;
                    white-space: normal;
                }
            }
        `;
        document.head.appendChild(navStyles);
    }

    const navLinks = document.querySelector('.nav-links');

    const createDropdown = ({ parentLink, ariaLabel, items }) => {
        if (!navLinks || !parentLink) return null;

        const dropdown = document.createElement('div');
        dropdown.className = 'nav-dropdown';

        const trigger = document.createElement('div');
        trigger.className = 'nav-dropdown-trigger';

        parentLink.classList.add('nav-dropdown-link');
        parentLink.setAttribute('aria-haspopup', 'true');
        parentLink.setAttribute('aria-expanded', 'false');

        const chevron = document.createElement('button');
        chevron.type = 'button';
        chevron.className = 'nav-dropdown-toggle';
        chevron.setAttribute('aria-label', ariaLabel);
        chevron.setAttribute('aria-expanded', 'false');
        chevron.textContent = '▾';

        const menu = document.createElement('div');
        menu.className = 'nav-dropdown-menu';
        menu.setAttribute('role', 'menu');
        menu.innerHTML = items.map(item =>
            `<a href="${item.href}" class="nav-sub-link" role="menuitem">${item.label}</a>`
        ).join('');

        parentLink.parentNode.insertBefore(dropdown, parentLink);
        trigger.appendChild(parentLink);
        trigger.appendChild(chevron);
        dropdown.appendChild(trigger);
        dropdown.appendChild(menu);

        const setDropdownOpen = (open) => {
            dropdown.classList.toggle('open', open);
            parentLink.setAttribute('aria-expanded', String(open));
            chevron.setAttribute('aria-expanded', String(open));
        };

        chevron.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            setDropdownOpen(!dropdown.classList.contains('open'));
        });

        dropdown.addEventListener('focusin', () => setDropdownOpen(true));
        dropdown.addEventListener('focusout', (event) => {
            if (!dropdown.contains(event.relatedTarget)) setDropdownOpen(false);
        });

        document.addEventListener('click', (event) => {
            if (!dropdown.contains(event.target)) setDropdownOpen(false);
        });

        return dropdown;
    };

    if (navLinks) {
        const directLinks = Array.from(navLinks.querySelectorAll(':scope > .nav-link'));
        const partnerLink = directLinks.find(link => link.textContent.trim().toLowerCase() === 'partners');
        const academyLink = directLinks.find(link => link.textContent.trim().toLowerCase() === 'academy');
        const videoVaultLink = directLinks.find(link => link.textContent.trim().toLowerCase() === 'video vault');

        // Video Vault is now an Academy child, never a top-level header item.
        if (videoVaultLink) videoVaultLink.remove();

        if (partnerLink) {
            createDropdown({
                parentLink: partnerLink,
                ariaLabel: 'Show partner pages',
                items: [
                    { href: '/join/', label: 'Partner Program' },
                    { href: '/partners/second-opinion/', label: 'Second-Opinion Desk' },
                    { href: '/partners/equipment/', label: 'Equipment Financing' },
                    { href: '/partners/sub-brokers/', label: 'Sub-Broker Program' },
                    { href: '/partners/advisors/', label: 'CPA & Advisor Desk' },
                    { href: '/partners/dealers/', label: 'Dealer Financing' },
                    { href: '/partners/real-estate/', label: 'Real Estate Bridge Desk' }
                ]
            });
        }

        if (academyLink) {
            createDropdown({
                parentLink: academyLink,
                ariaLabel: 'Show Academy pages',
                items: [
                    { href: '/training/', label: 'Academy Overview' },
                    { href: '/training/videos', label: 'Video Vault' }
                ]
            });
        }
    }

    /**
     * 2. MOBILE MENU TOGGLE
     */
    const menuToggle = document.getElementById('menuToggle');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            const isActive = navLinks.classList.toggle('mobile-active');
            navLinks.classList.toggle('hidden-mobile', !isActive);

            menuToggle.textContent = isActive ? '✕' : '☰';
            menuToggle.setAttribute('aria-expanded', isActive);
        });
    }

    /**
     * 3. ACTIVE STATE HIGHLIGHTING
     */
    const currentPath = window.location.pathname;
    const normalizedPath = currentPath.endsWith('/index.html')
        ? currentPath.replace(/index\.html$/, '')
        : currentPath;

    document.querySelectorAll('.nav-link, .nav-sub-link').forEach(link => {
        const rawHref = link.getAttribute('href');
        if (!rawHref) return;

        const cleanHref = rawHref.replace(/^(\.\.\/|\.\/)/, '');
        const normalizedHref = cleanHref.startsWith('/') ? cleanHref : '/' + cleanHref;

        if (
            cleanHref &&
            (normalizedPath === normalizedHref ||
             normalizedPath.startsWith(normalizedHref.endsWith('/') ? normalizedHref : normalizedHref + '/') ||
             currentPath.endsWith(cleanHref) ||
             currentPath.includes('/' + cleanHref))
        ) {
            link.classList.add('active');
        }
    });

    if (normalizedPath.startsWith('/partners/')) {
        Array.from(document.querySelectorAll('.nav-dropdown-link')).find(link =>
            link.textContent.trim().toLowerCase() === 'partners'
        )?.classList.add('active');
    }

    if (normalizedPath.startsWith('/training/')) {
        Array.from(document.querySelectorAll('.nav-dropdown-link')).find(link =>
            link.textContent.trim().toLowerCase() === 'academy'
        )?.classList.add('active');
    }

    /**
     * 4. SMOOTH SCROLLING
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
     * 5. INTERSECTION OBSERVER (FADE-IN REVEAL)
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
