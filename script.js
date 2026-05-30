document.addEventListener('DOMContentLoaded', function () {
    const root = document.documentElement;
    const body = document.body;
    const navToggle = document.querySelector('.nav-toggle');
    const navShell = document.querySelector('.nav-shell');
    const navLinks = document.querySelectorAll('.nav-links a');
    const themeToggle = document.querySelector('[data-theme-toggle]');
    const revealItems = document.querySelectorAll('.reveal');
    const counterItems = document.querySelectorAll('[data-counter]');
    const magneticItems = document.querySelectorAll('.magnetic');
    const backToTop = document.querySelector('.back-to-top');
    const lightbox = document.querySelector('.lightbox');
    const lightboxImage = lightbox ? lightbox.querySelector('img') : null;
    const lightboxCaption = lightbox ? lightbox.querySelector('figcaption') : null;
    const lightboxClose = document.querySelector('.lightbox-close');
    const parallaxCard = document.querySelector('.parallax-card');
    const heroVisual = document.querySelector('.hero-visual');
    const particleField = document.querySelector('[data-particles]');

    const storageKeyTheme = 'inamigos-theme';

    function applyTheme(theme) {
        root.dataset.theme = theme;
        localStorage.setItem(storageKeyTheme, theme);
        if (themeToggle) {
            themeToggle.setAttribute('aria-pressed', String(theme === 'dark'));
        }
    }

    function createParticles() {
        if (!particleField) {
            return;
        }

        const count = 18;
        for (let index = 0; index < count; index += 1) {
            const particle = document.createElement('span');
            const size = 4 + Math.random() * 7;
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDuration = 14 + Math.random() * 16 + 's';
            particle.style.animationDelay = Math.random() * 8 + 's';
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.opacity = String(0.25 + Math.random() * 0.5);
            particleField.appendChild(particle);
        }
    }

    function animateCounter(element) {
        const target = Number.parseInt(element.dataset.counter || '0', 10);
        const duration = 1600;
        const start = performance.now();

        function tick(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            element.textContent = Math.round(target * eased).toLocaleString('en-US') + '+';
            if (progress < 1) {
                window.requestAnimationFrame(tick);
            }
        }

        window.requestAnimationFrame(tick);
    }

    function closeMobileNav() {
        if (navShell && navToggle) {
            navShell.classList.remove('is-open');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    }

    const preferredTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    applyTheme(localStorage.getItem(storageKeyTheme) || preferredTheme);
    createParticles();

    window.setTimeout(function () {
        body.classList.add('is-ready');
    }, 300);

    window.addEventListener('load', function () {
        body.classList.add('is-ready');
    });

    if (navToggle && navShell) {
        navToggle.addEventListener('click', function () {
            const isOpen = navShell.classList.toggle('is-open');
            navToggle.setAttribute('aria-expanded', String(isOpen));
        });
    }

    navLinks.forEach(function (link) {
        link.addEventListener('click', closeMobileNav);
    });

    if (themeToggle) {
        themeToggle.addEventListener('click', function () {
            const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
            applyTheme(nextTheme);
        });
    }

    magneticItems.forEach(function (element) {
        element.addEventListener('mousemove', function (event) {
            const bounds = element.getBoundingClientRect();
            const offsetX = (event.clientX - bounds.left) / bounds.width - 0.5;
            const offsetY = (event.clientY - bounds.top) / bounds.height - 0.5;
            element.style.transform = 'translate3d(' + (offsetX * 8).toFixed(2) + 'px, ' + (offsetY * 8).toFixed(2) + 'px, 0)';
        });
        element.addEventListener('mouseleave', function () {
            element.style.transform = '';
        });
    });

    const revealObserver = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.18 }
    );

    revealItems.forEach(function (item) {
        revealObserver.observe(item);
    });

    const counterObserver = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.5 }
    );

    counterItems.forEach(function (item) {
        counterObserver.observe(item);
    });

    const sections = document.querySelectorAll('main section[id]');
    const sectionObserver = new IntersectionObserver(
        function (entries) {
            const active = entries.filter(function (entry) {
                return entry.isIntersecting;
            }).sort(function (left, right) {
                return right.intersectionRatio - left.intersectionRatio;
            })[0];

            if (!active) {
                return;
            }

            navLinks.forEach(function (link) {
                const isCurrent = link.getAttribute('href') === '#' + active.target.id;
                if (isCurrent) {
                    link.setAttribute('aria-current', 'page');
                } else {
                    link.removeAttribute('aria-current');
                }
            });
        },
        { threshold: 0.45 }
    );

    sections.forEach(function (section) {
        sectionObserver.observe(section);
    });

    function updateBackToTop() {
        if (!backToTop) {
            return;
        }

        if (window.scrollY > 700) {
            backToTop.classList.add('is-visible');
        } else {
            backToTop.classList.remove('is-visible');
        }
    }

    window.addEventListener('scroll', function () {
        updateBackToTop();

        if (parallaxCard) {
            const offset = Math.min(window.scrollY * 0.06, 28);
            parallaxCard.style.transform = 'translateY(' + offset.toFixed(2) + 'px)';
        }

        if (heroVisual) {
            const offsetY = Math.min(window.scrollY * 0.02, 8);
            heroVisual.style.transform = 'translateY(' + (-offsetY).toFixed(2) + 'px)';
        }
    }, { passive: true });

    updateBackToTop();

    if (backToTop) {
        backToTop.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    const galleryButtons = document.querySelectorAll('[data-lightbox]');
    galleryButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            if (!lightbox || !lightboxImage || !lightboxCaption) {
                return;
            }

            lightboxImage.src = button.dataset.lightbox || '';
            lightboxImage.alt = button.querySelector('img') ? button.querySelector('img').alt : 'Gallery image';
            lightboxCaption.textContent = button.dataset.caption || '';
            lightbox.hidden = false;
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        });
    });

    function closeLightbox() {
        if (!lightbox) {
            return;
        }

        lightbox.hidden = true;
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightbox) {
        lightbox.addEventListener('click', function (event) {
            if (event.target === lightbox) {
                closeLightbox();
            }
        });
    }

    window.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            closeMobileNav();
            closeLightbox();
        }
    });
});
