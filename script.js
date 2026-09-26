/* ========================================
   Stephen Kinyua Portfolio — Scripts
======================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Current year in footer
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    const handleScroll = () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Mobile menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            menuToggle.classList.toggle('active');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                menuToggle.classList.remove('active');
            });
        });
    }

    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you! Your message has been received. I will get back to you soon.');
            contactForm.reset();
        });
    }

    // Smooth reveal on scroll
    const revealElements = document.querySelectorAll(
        '.skill-category, .timeline-item, .project-card, .service-card, .about-content, .about-image'
    );

    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach((el) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        revealObserver.observe(el);
    });

    // ========== PROJECT IMAGE SLIDESHOW ==========
    // Cycles every 10 seconds. Only uses images that actually load.
    document.querySelectorAll('.project-slideshow').forEach((slideshow) => {
        const allImgs = Array.from(slideshow.querySelectorAll('img.slide'));
        const validImgs = [];
        let loadedCount = 0;
        const total = allImgs.length;

        if (total === 0) return;

        allImgs.forEach((img) => {
            img.style.display = 'none';
            img.classList.remove('active');

            const markDone = () => {
                loadedCount++;
                if (loadedCount === total) startSlideshow();
            };

            if (img.complete && img.naturalWidth > 0) {
                validImgs.push(img);
                markDone();
            } else {
                img.addEventListener('load', () => {
                    validImgs.push(img);
                    markDone();
                });
                img.addEventListener('error', () => {
                    markDone();
                });
            }
        });

        function startSlideshow() {
            if (validImgs.length === 0) return;

            validImgs.forEach((img, i) => {
                img.style.display = 'block';
                img.classList.toggle('active', i === 0);
            });

            if (validImgs.length === 1) return;

            let current = 0;
            setInterval(() => {
                validImgs[current].classList.remove('active');
                current = (current + 1) % validImgs.length;
                validImgs[current].classList.add('active');
            }, 10000);
        }
    });
});
