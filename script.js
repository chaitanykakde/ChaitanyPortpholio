(function () {
    const GALLERIES = {
        'expense-tracker': [
            'images/expense_tracker/login.jpeg',
            'images/expense_tracker/register.jpeg',
            'images/expense_tracker/home.jpeg',
            'images/expense_tracker/add_transaction.jpeg',
            'images/expense_tracker/transactions.jpeg',
            'images/expense_tracker/breakdown.jpeg',
            'images/expense_tracker/logout.jpeg'
        ],
        agewell: [
            'images/agewell/1.jpeg',
            'images/agewell/2.jpeg',
            'images/agewell/3.jpeg',
            'images/agewell/4.jpeg',
            'images/agewell/5.jpeg',
            'images/agewell/6.jpeg',
            'images/agewell/7.jpeg'
        ],
        carbonview: [
            'images/carbonview/1.jpeg',
            'images/carbonview/2.jpeg',
            'images/carbonview/3.jpeg',
            'images/carbonview/4.jpeg',
            'images/carbonview/5.jpeg',
            'images/carbonview/6.jpeg',
            'images/carbonview/7.jpeg',
            'images/carbonview/8.jpeg',
            'images/carbonview/9.jpeg'
        ],
        policebharti: [
            'images/policebharti/1.jpeg',
            'images/policebharti/2.jpeg',
            'images/policebharti/3.jpeg',
            'images/policebharti/4.jpeg',
            'images/policebharti/5.jpeg'
        ]
    };

    const html = document.documentElement;
    const themeToggle = document.getElementById('theme-toggle');
    const menuToggle = document.getElementById('menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const galleryModal = document.getElementById('gallery-modal');
    const galleryTrack = document.getElementById('gallery-track');
    const galleryTitle = document.getElementById('gallery-title');
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImage = document.getElementById('lightbox-image');
    const yearEl = document.getElementById('year');

    let lastFocus = null;
    let activeDialog = null;

    function currentTheme() {
        return html.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    }

    function updateThemeButton() {
        const dark = currentTheme() === 'dark';
        themeToggle.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    }

    function setTheme(theme) {
        html.setAttribute('data-theme', theme);
        try {
            localStorage.setItem('theme', theme);
        } catch (e) { /* ignore */ }
        updateThemeButton();
    }

    function focusables(root) {
        return [...root.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])')]
            .filter(function (el) {
                return el.getAttribute('aria-hidden') !== 'true';
            });
    }

    function trapTab(event, root) {
        if (event.key !== 'Tab') return;
        const items = focusables(root);
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    }

    function openMobileNav() {
        mobileNav.hidden = false;
        menuToggle.setAttribute('aria-expanded', 'true');
        menuToggle.setAttribute('aria-label', 'Close menu');
        document.body.classList.add('nav-open');
        const first = mobileNav.querySelector('a');
        if (first) first.focus();
    }

    function closeMobileNav() {
        if (mobileNav.hidden) return;
        mobileNav.hidden = true;
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Open menu');
        document.body.classList.remove('nav-open');
        menuToggle.focus();
    }

    function openDialog(dialog) {
        lastFocus = document.activeElement;
        activeDialog = dialog;
        dialog.hidden = false;
        document.body.classList.add('modal-open');
        const closeBtn = dialog.querySelector('[data-close-gallery], [data-close-lightbox]');
        if (closeBtn) closeBtn.focus();
    }

    function closeDialog(dialog) {
        if (!dialog || dialog.hidden) return;
        dialog.hidden = true;
        if (dialog === galleryModal) galleryTrack.innerHTML = '';
        if (dialog === lightboxModal) {
            lightboxImage.removeAttribute('src');
            lightboxImage.alt = '';
        }
        if (activeDialog === dialog) activeDialog = null;
        const galleryClosed = !galleryModal || galleryModal.hidden;
        const lightboxClosed = !lightboxModal || lightboxModal.hidden;
        if (galleryClosed && lightboxClosed) {
            document.body.classList.remove('modal-open');
        }
        if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
    }

    function openGallery(projectEl) {
        const id = projectEl.getAttribute('data-project');
        const title = projectEl.getAttribute('data-title') || 'Screenshots';
        const images = GALLERIES[id];
        if (!images) return;
        galleryTitle.textContent = title;
        galleryTrack.innerHTML = images.map(function (src) {
            return '<img src="' + src + '" alt="' + title.replace(/"/g, '') + ' screenshot">';
        }).join('');
        openDialog(galleryModal);
    }

    themeToggle.addEventListener('click', function () {
        setTheme(currentTheme() === 'dark' ? 'light' : 'dark');
    });
    updateThemeButton();

    menuToggle.addEventListener('click', function () {
        if (mobileNav.hidden) openMobileNav();
        else closeMobileNav();
    });

    mobileNav.addEventListener('click', function (event) {
        if (event.target.closest('a')) closeMobileNav();
    });

    document.querySelectorAll('.gallery-trigger').forEach(function (el) {
        el.addEventListener('click', function (event) {
            event.preventDefault();
            const project = el.closest('[data-project]');
            if (project) openGallery(project);
        });
    });

    document.querySelectorAll('.lightbox-trigger').forEach(function (btn) {
        btn.addEventListener('click', function () {
            const img = btn.querySelector('img');
            if (!img) return;
            lightboxImage.src = img.src;
            lightboxImage.alt = img.alt || '';
            openDialog(lightboxModal);
        });
    });

    document.querySelectorAll('[data-close-gallery]').forEach(function (el) {
        el.addEventListener('click', function () { closeDialog(galleryModal); });
    });
    document.querySelectorAll('[data-close-lightbox]').forEach(function (el) {
        el.addEventListener('click', function () { closeDialog(lightboxModal); });
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            if (activeDialog) closeDialog(activeDialog);
            else closeMobileNav();
            return;
        }
        if (!mobileNav.hidden) trapTab(event, mobileNav);
        if (activeDialog && !activeDialog.hidden) trapTab(event, activeDialog);
    });

    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener('click', function (event) {
            const id = link.getAttribute('href');
            if (!id || id === '#') return;
            const target = document.querySelector(id);
            if (!target) return;
            event.preventDefault();
            closeMobileNav();
            const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
            if (history.replaceState) history.replaceState(null, '', id);
        });
    });

    const sectionIds = ['home', 'work', 'achievements', 'experience', 'skills', 'education', 'about', 'resume', 'contact'];
    const navLinks = document.querySelectorAll('.nav-list a[href^="#"]');

    function setActiveNav() {
        const offset = 96;
        let current = 'home';
        sectionIds.forEach(function (id) {
            const el = document.getElementById(id);
            if (el && el.getBoundingClientRect().top - offset <= 0) current = id;
        });
        navLinks.forEach(function (link) {
            const target = link.getAttribute('href').slice(1);
            const isActive = target === current || (current === 'resume' && target === 'contact');
            link.classList.toggle('active', isActive);
        });
    }

    window.addEventListener('scroll', setActiveNav, { passive: true });
    setActiveNav();

    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
