(function () {
    const GALLERIES = {
        'serveit-user': [
            { src: 'images/serveit-user/su1.webp', alt: 'ServeIt User screen listing home services including AC, plumbing, pest control, electrician, pooja, and CCTV' },
            { src: 'images/serveit-user/su2.webp', alt: 'ServeIt User home screen with location, service search, and service categories' },
            { src: 'images/serveit-user/su3.webp', alt: 'ServeIt User AC Services screen with service options and Book Now' },
            { src: 'images/serveit-user/su4.webp', alt: 'ServeIt User My Bookings screen tracking active jobs' },
            { src: 'images/serveit-user/su5.webp', alt: 'ServeIt User My Profile screen for account and address management' }
        ],
        'serveit-partner': [
            { src: 'images/servit-partner/sp1.webp', alt: 'ServeIt Partner splash screen' },
            { src: 'images/servit-partner/sp2.webp', alt: 'ServeIt Partner home dashboard with new job requests and Accept or Reject actions' },
            { src: 'images/servit-partner/sp3.webp', alt: 'ServeIt Partner My Jobs screen listing new service requests' },
            { src: 'images/servit-partner/sp4.webp', alt: 'ServeIt Partner Earnings Dashboard with payouts and platform fee' },
            { src: 'images/servit-partner/sp5.webp', alt: 'ServeIt Partner Profile screen for personal, service, and verification details' }
        ],
        'expense-tracker': [
            { src: 'images/expense_tracker/login.jpeg', alt: 'Expense Tracker login screen' },
            { src: 'images/expense_tracker/register.jpeg', alt: 'Expense Tracker register screen' },
            { src: 'images/expense_tracker/home.jpeg', alt: 'Expense Tracker dashboard' },
            { src: 'images/expense_tracker/add_transaction.jpeg', alt: 'Add transaction screen' },
            { src: 'images/expense_tracker/transactions.jpeg', alt: 'Transactions list' },
            { src: 'images/expense_tracker/breakdown.jpeg', alt: 'Analytics breakdown' },
            { src: 'images/expense_tracker/logout.jpeg', alt: 'Expense Tracker logout screen' }
        ],
        agewell: [
            { src: 'images/agewell/1.jpeg', alt: 'AGEWELL connect with elders' },
            { src: 'images/agewell/2.jpeg', alt: 'AGEWELL home screen' },
            { src: 'images/agewell/3.jpeg', alt: 'AGEWELL app screen' },
            { src: 'images/agewell/4.jpeg', alt: 'AGEWELL app screen' },
            { src: 'images/agewell/5.jpeg', alt: 'AGEWELL app screen' },
            { src: 'images/agewell/6.jpeg', alt: 'AGEWELL emergency contact' },
            { src: 'images/agewell/7.jpeg', alt: 'AGEWELL app screen' }
        ],
        carbonview: [
            { src: 'images/carbonview/1.jpeg', alt: 'Carbon View screen' },
            { src: 'images/carbonview/2.jpeg', alt: 'Carbon View dashboard overview' },
            { src: 'images/carbonview/3.jpeg', alt: 'Carbon View screen' },
            { src: 'images/carbonview/4.jpeg', alt: 'Carbon View vehicle report' },
            { src: 'images/carbonview/5.jpeg', alt: 'Carbon View screen' },
            { src: 'images/carbonview/6.jpeg', alt: 'Carbon View screen' },
            { src: 'images/carbonview/7.jpeg', alt: 'Carbon View screen' },
            { src: 'images/carbonview/8.jpeg', alt: 'Carbon View screen' },
            { src: 'images/carbonview/9.jpeg', alt: 'Carbon View emissions dashboard' }
        ],
        policebharti: [
            { src: 'images/policebharti/1.jpeg', alt: 'Police Bharti home screen' },
            { src: 'images/policebharti/2.jpeg', alt: 'Subject-wise MCQs' },
            { src: 'images/policebharti/3.jpeg', alt: 'Police Bharti study screen' },
            { src: 'images/policebharti/4.jpeg', alt: 'Police Bharti test screen' },
            { src: 'images/policebharti/5.jpeg', alt: 'Police Bharti app screen' }
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
    const lightboxCount = document.getElementById('lightbox-count');
    const lightboxPrev = lightboxModal.querySelector('[data-lightbox-prev]');
    const lightboxNext = lightboxModal.querySelector('[data-lightbox-next]');
    const yearEl = document.getElementById('year');

    let lastFocus = null;
    let activeDialog = null;
    let lightboxItems = [];
    let lightboxIndex = 0;
    let touchStartX = 0;

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
            lightboxItems = [];
            lightboxIndex = 0;
            if (lightboxCount) lightboxCount.textContent = '';
        }
        if (activeDialog === dialog) activeDialog = null;
        const galleryClosed = !galleryModal || galleryModal.hidden;
        const lightboxClosed = !lightboxModal || lightboxModal.hidden;
        if (galleryClosed && lightboxClosed) {
            document.body.classList.remove('modal-open');
        }
        if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
    }

    function pad2(n) {
        return String(n).padStart(2, '0');
    }

    function galleryItemsFromProject(projectEl) {
        const id = projectEl.getAttribute('data-project');
        const title = projectEl.getAttribute('data-title') || 'Screenshots';
        const images = GALLERIES[id] || [];
        return images.map(function (item) {
            if (typeof item === 'string') {
                return { src: item, alt: title + ' screenshot' };
            }
            return { src: item.src, alt: item.alt || title + ' screenshot' };
        });
    }

    function showLightboxImage() {
        const item = lightboxItems[lightboxIndex];
        if (!item) return;
        lightboxImage.src = item.src;
        lightboxImage.alt = item.alt || '';
        const many = lightboxItems.length > 1;
        if (lightboxPrev) lightboxPrev.hidden = !many;
        if (lightboxNext) lightboxNext.hidden = !many;
        if (lightboxCount) {
            lightboxCount.textContent = many ? pad2(lightboxIndex + 1) + ' / ' + pad2(lightboxItems.length) : '';
        }
    }

    function openLightbox(items, index) {
        lightboxItems = items;
        lightboxIndex = Math.max(0, Math.min(index || 0, items.length - 1));
        showLightboxImage();
        openDialog(lightboxModal);
    }

    function stepLightbox(dir) {
        if (!lightboxItems.length) return;
        lightboxIndex = (lightboxIndex + dir + lightboxItems.length) % lightboxItems.length;
        showLightboxImage();
    }

    function openGallery(projectEl) {
        const id = projectEl.getAttribute('data-project');
        const title = projectEl.getAttribute('data-title') || 'Screenshots';
        const images = GALLERIES[id];
        if (!images) return;
        galleryTitle.textContent = title;
        galleryTrack.innerHTML = images.map(function (item) {
            const src = typeof item === 'string' ? item : item.src;
            const alt = typeof item === 'string' ? (title.replace(/"/g, '') + ' screenshot') : String(item.alt || '').replace(/"/g, '');
            return '<img src="' + src + '" alt="' + alt + '">';
        }).join('');
        openDialog(galleryModal);
    }

    function setupShotGallery(gallery) {
        const track = gallery.querySelector('.shot-gallery-track');
        const indexEl = gallery.querySelector('[data-gallery-index]');
        const prev = gallery.querySelector('.gallery-prev');
        const next = gallery.querySelector('.gallery-next');
        if (!track) return;
        const shots = [...track.querySelectorAll('.featured-shot')];
        let pointerX = 0;
        let dragged = false;

        function currentIndex() {
            const left = track.scrollLeft;
            let idx = 0;
            shots.forEach(function (shot, i) {
                if (shot.offsetLeft - track.offsetLeft <= left + 24) idx = i;
            });
            return idx;
        }

        function updateChrome() {
            const idx = currentIndex();
            if (indexEl) indexEl.textContent = pad2(idx + 1);
            const totalEl = gallery.querySelector('[data-gallery-total]');
            if (totalEl) totalEl.textContent = pad2(shots.length);
            const max = track.scrollWidth - track.clientWidth - 4;
            if (prev) prev.disabled = track.scrollLeft <= 4;
            if (next) next.disabled = track.scrollLeft >= max;
        }

        function scrollByShot(dir) {
            const shot = shots[0];
            if (!shot) return;
            const step = shot.getBoundingClientRect().width + 12;
            track.scrollBy({ left: dir * step, behavior: 'smooth' });
        }

        track.addEventListener('scroll', updateChrome, { passive: true });
        track.addEventListener('wheel', function (event) {
            if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
            if (track.scrollWidth <= track.clientWidth + 1) return;
            event.preventDefault();
            track.scrollLeft += event.deltaY;
        }, { passive: false });

        track.addEventListener('pointerdown', function (event) {
            pointerX = event.clientX;
            dragged = false;
        });
        track.addEventListener('pointermove', function (event) {
            if (Math.abs(event.clientX - pointerX) > 10) dragged = true;
        });

        shots.forEach(function (shot) {
            shot.addEventListener('click', function () {
                if (dragged) return;
                const project = gallery.closest('[data-project]');
                if (!project) return;
                const items = galleryItemsFromProject(project);
                const index = Number(shot.getAttribute('data-shot-index') || '0');
                openLightbox(items, index);
            });
        });

        if (prev) prev.addEventListener('click', function () { scrollByShot(-1); });
        if (next) next.addEventListener('click', function () { scrollByShot(1); });
        updateChrome();
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

    document.querySelectorAll('.shot-gallery').forEach(setupShotGallery);

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
            openLightbox([{ src: img.src, alt: img.alt || '' }], 0);
        });
    });

    if (lightboxPrev) lightboxPrev.addEventListener('click', function () { stepLightbox(-1); });
    if (lightboxNext) lightboxNext.addEventListener('click', function () { stepLightbox(1); });

    lightboxImage.addEventListener('touchstart', function (event) {
        touchStartX = event.changedTouches[0].clientX;
    }, { passive: true });
    lightboxImage.addEventListener('touchend', function (event) {
        const dx = event.changedTouches[0].clientX - touchStartX;
        if (dx > 40) stepLightbox(-1);
        else if (dx < -40) stepLightbox(1);
    }, { passive: true });

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
        if (activeDialog === lightboxModal && !lightboxModal.hidden) {
            if (event.key === 'ArrowLeft') {
                event.preventDefault();
                stepLightbox(-1);
                return;
            }
            if (event.key === 'ArrowRight') {
                event.preventDefault();
                stepLightbox(1);
                return;
            }
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
