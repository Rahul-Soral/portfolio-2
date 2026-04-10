/* ============================================================
   RAHUL SORAL — PORTFOLIO SCRIPT
   Bringing the cinematic experience to life.
   ============================================================ */

(function () {
    'use strict';

    // === PRELOADER ===
    const preloader = document.getElementById('preloader');
    const preloaderCounter = document.getElementById('preloaderCounter');
    let counter = 0;

    function animatePreloader() {
        const interval = setInterval(() => {
            counter += Math.floor(Math.random() * 8) + 1;
            if (counter >= 100) {
                counter = 100;
                preloaderCounter.textContent = counter;
                clearInterval(interval);
                setTimeout(() => {
                    preloader.classList.add('done');
                    document.body.style.overflow = 'auto';
                    initAnimations();
                }, 500);
                return;
            }
            preloaderCounter.textContent = counter;
        }, 50);
    }

    document.body.style.overflow = 'hidden';
    window.addEventListener('load', () => {
        setTimeout(animatePreloader, 300);
    });

    // === CUSTOM CURSOR ===
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursorFollower');
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (cursor) {
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
        }
    });

    function animateFollower() {
        followerX += (mouseX - followerX) * 0.12;
        followerY += (mouseY - followerY) * 0.12;
        if (follower) {
            follower.style.left = followerX + 'px';
            follower.style.top = followerY + 'px';
        }
        requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Cursor hover effect
    const hoverElements = document.querySelectorAll('a, button, .reel-card, .project-card, .skill-category, .volunteer-card, .contact-method, .resume-download-btn, .timeline-content');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor && cursor.classList.add('cursor-hover');
            follower && follower.classList.add('cursor-hover');
        });
        el.addEventListener('mouseleave', () => {
            cursor && cursor.classList.remove('cursor-hover');
            follower && follower.classList.remove('cursor-hover');
        });
    });

    // === NAVIGATION ===
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    // Scroll behavior
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        if (currentScroll > 80) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Mobile toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('open');
        mobileMenu.classList.toggle('open');
        document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : 'auto';
    });

    // Close mobile menu on link click
    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('open');
            mobileMenu.classList.remove('open');
            document.body.style.overflow = 'auto';
        });
    });

    // === SMOOTH SCROLL FOR NAV LINKS ===
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId === '#') return;
            e.preventDefault();
            const target = document.querySelector(targetId);
            if (target) {
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // === INTERSECTION OBSERVER — SCROLL REVEALS ===
    function initAnimations() {
        // Timeline items
        const timelineItems = document.querySelectorAll('.timeline-item');
        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, index * 150);
                    timelineObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        timelineItems.forEach(item => timelineObserver.observe(item));

        // General scroll reveals
        const revealTargets = document.querySelectorAll(
            '.section-header, .reel-card, .project-card, .skill-category, .volunteer-card, .resume-wrapper, .about-wrapper, .contact-content'
        );

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        revealTargets.forEach((el, i) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(40px)';
            el.style.transition = `all 0.8s ${0.1 * (i % 4)}s cubic-bezier(0.16, 1, 0.3, 1)`;
            revealObserver.observe(el);
        });

        // Stat counter animation
        animateCounters();
    }

    // === COUNTER ANIMATION ===
    function animateCounters() {
        const counters = document.querySelectorAll('.hero-stat-number[data-count]');
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.getAttribute('data-count'));
                    const duration = 2000;
                    const increment = target / (duration / 16);
                    let current = 0;

                    const updateCounter = () => {
                        current += increment;
                        if (current >= target) {
                            el.textContent = target.toLocaleString();
                            return;
                        }
                        el.textContent = Math.floor(current).toLocaleString();
                        requestAnimationFrame(updateCounter);
                    };

                    updateCounter();
                    counterObserver.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => counterObserver.observe(counter));
    }

    // === IDENTITY CARD TILT EFFECT ===
    const identityCard = document.getElementById('identityCard');
    if (identityCard) {
        identityCard.addEventListener('mousemove', (e) => {
            const rect = identityCard.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            const inner = identityCard.querySelector('.identity-card-inner');
            if (inner) {
                inner.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
            }
        });

        identityCard.addEventListener('mouseleave', () => {
            const inner = identityCard.querySelector('.identity-card-inner');
            if (inner) {
                inner.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            }
        });
    }

    // === REEL CARDS STAGGERED ANIMATION ===
    const reelCards = document.querySelectorAll('.reel-card');
    const reelObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const index = parseInt(entry.target.getAttribute('data-reel')) - 1;
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                reelObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    reelCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(60px)';
        card.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        reelObserver.observe(card);
    });

    // === REEL VIDEO HOVER-TO-PLAY ===
    reelCards.forEach(card => {
        const video = card.querySelector('.reel-video');
        if (!video) return;

        card.addEventListener('mouseenter', () => {
            video.play().catch(() => {});
        });

        card.addEventListener('mouseleave', () => {
            video.pause();
            video.currentTime = 0;
        });
    });

    // === PARALLAX ELEMENTS ===
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Hero orbs parallax
        const orbs = document.querySelectorAll('.hero-gradient-orb');
        orbs.forEach((orb, i) => {
            const speed = 0.1 + i * 0.05;
            orb.style.transform = `translateY(${scrollY * speed}px)`;
        });

        // Hero 3d float
        const float3d = document.querySelector('.hero-3d-float');
        if (float3d) {
            float3d.style.transform = `translateY(${scrollY * 0.15}px) rotate(${scrollY * 0.02}deg)`;
        }
    });

    // === MAGNETIC BUTTON EFFECT ===
    const magneticElements = document.querySelectorAll('.btn-primary, .nav-cta, .resume-download-btn');
    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            el.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = 'translate(0, 0)';
        });
    });

    // === TYPING EFFECT FOR HERO (subtle) ===
    const heroOverline = document.querySelector('.hero-overline');
    if (heroOverline) {
        heroOverline.style.opacity = '0';
        setTimeout(() => {
            heroOverline.style.opacity = '1';
            heroOverline.style.transition = 'opacity 1s';
        }, 800);
    }

    // === NAVBAR ACTIVE LINK HIGHLIGHT ===
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 200;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.style.color = '';
            if (link.getAttribute('href') === '#' + current) {
                link.style.color = 'var(--text-primary)';
            }
        });
    });

    // === RESUME DOWNLOAD ANIMATION ===
    const resumeBtn = document.getElementById('resumeDownloadBtn');
    if (resumeBtn) {
        resumeBtn.addEventListener('click', () => {
            const icon = resumeBtn.querySelector('.resume-btn-icon');
            if (icon) {
                icon.style.background = 'var(--accent-secondary)';
                icon.style.transition = 'background 0.3s';
                setTimeout(() => {
                    icon.style.background = 'var(--accent-primary)';
                }, 1000);
            }
        });
    }

})();
