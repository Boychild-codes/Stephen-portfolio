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

    // ========== MOBILE MENU (full-screen overlay) ==========
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    if (menuToggle && navLinks) {
        const closeMenu = () => {
            navLinks.classList.remove('open');
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('no-scroll');
        };

        menuToggle.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('open');
            menuToggle.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', String(isOpen));
            document.body.classList.toggle('no-scroll', isOpen);
        });

        // Close on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Close on tapping empty space inside the overlay
        navLinks.addEventListener('click', (e) => {
            if (e.target === navLinks) closeMenu();
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('open')) closeMenu();
        });
    }

    // ========== CONTACT FORM (real submission via Resend, through /api/contact) ==========
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    const submitBtn = document.getElementById('contactSubmit');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const originalBtnText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            formStatus.textContent = '';
            formStatus.className = 'form-status';

            const payload = {
                name: contactForm.name.value,
                email: contactForm.email.value,
                message: contactForm.message.value
            };

            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const data = await response.json().catch(() => null);

                if (response.ok) {
                    formStatus.textContent = 'Thanks! Your message has been sent — I\'ll get back to you soon.';
                    formStatus.classList.add('success');
                    contactForm.reset();
                } else {
                    formStatus.textContent = (data && data.error) || 'Something went wrong. Please try again or email me directly.';
                    formStatus.classList.add('error');
                }
            } catch (err) {
                formStatus.textContent = 'Network error — please email me directly at stephenjiru@gmail.com.';
                formStatus.classList.add('error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
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

    // ========== PROJECT IMAGE SLIDESHOW (with captions) ==========
    document.querySelectorAll('.project-image').forEach((projectImage) => {
        const slideshow = projectImage.querySelector('.project-slideshow');
        const captionEl = projectImage.querySelector('.slide-caption');
        if (!slideshow) return;

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

        function updateCaption(img) {
            if (!captionEl) return;
            captionEl.textContent = img.dataset.caption || img.alt || '';
        }

        function startSlideshow() {
            if (validImgs.length === 0) return;

            validImgs.forEach((img, i) => {
                img.style.display = 'block';
                img.classList.toggle('active', i === 0);
            });
            updateCaption(validImgs[0]);

            if (validImgs.length === 1) return;

            let current = 0;
            setInterval(() => {
                validImgs[current].classList.remove('active');
                current = (current + 1) % validImgs.length;
                validImgs[current].classList.add('active');
                updateCaption(validImgs[current]);
            }, 10000);
        }
    });
});