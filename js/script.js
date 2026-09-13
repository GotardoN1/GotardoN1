// Cursor personalizado
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

let mouseX = 0;
let mouseY = 0;
let isMoving = false;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (cursor) {
        cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    }

    if (!isMoving) {
        isMoving = true;
        requestAnimationFrame(() => {
            if (cursorFollower) {
                cursorFollower.style.transform = `translate(${mouseX - 10}px, ${mouseY - 10}px)`;
            }
            isMoving = false;
        });
    }
});

// Partículas flutuantes
function createParticle() {
    const particle = document.createElement('div');
    particle.style.position = 'absolute';
    particle.style.background = ['#00D4FF', '#FF00C8', '#7B2CBF'][Math.floor(Math.random() * 3)];
    particle.style.borderRadius = '50%';
    particle.style.width = `${Math.random() * 4 + 2}px`;
    particle.style.height = particle.style.width;
    particle.style.left = `${Math.random() * 100}vw`;
    particle.style.top = `${Math.random() * 100}vh`;
    particle.style.opacity = `${Math.random() * 0.3 + 0.1}`;
    particle.style.animation = `float ${Math.random() * 15 + 10}s ease-in-out infinite`;
    particle.style.zIndex = '0';

    const bg = document.querySelector('.bg-particles');
    if (bg) {
        bg.appendChild(particle);
        setTimeout(() => particle.remove(), 25000);
    }
}

function initParticles() {
    for (let i = 0; i < 40; i++) {
        setTimeout(() => createParticle(), i * 200);
    }
    setInterval(createParticle, 1000);
}

// Navegação suave
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Menu mobile
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Header scroll effect
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    if (header) {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    // Active nav links
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 300) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-nav') === current) {
            link.classList.add('active');
        }
    });

    // Back to top button
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }
});

// Typewriter effect for hero role
function initTypewriter() {
    const roleElement = document.querySelector('.hero-role');
    if (!roleElement) return;

    const roles = [
        'Analista de Infraestrutura & Dados',
        'Especialista em Alta Disponibilidade',
        'Expert em Segurança & Automação',
        'Transformando dados em decisões'
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            charIndex--;
        } else {
            charIndex++;
        }

        roleElement.textContent = currentRole.substring(0, charIndex);

        let delay = isDeleting ? 75 : 150;

        if (!isDeleting && charIndex === currentRole.length) {
            delay = 3000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            delay = 500;
        }

        setTimeout(type, delay);
    }

    type();
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Initialize everything on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initTypewriter();

    // Animate elements on scroll
    const animatedElements = document.querySelectorAll(
        '.project-card, .tech-category, .stats-card, .contact-item, .info-card, .skill-tag'
    );

    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });

    // Back to top button
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});

// Contact form
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(this);
        const nome = formData.get('nome') || 'amigo';

        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;

        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            this.reset();

            const alert = document.createElement('div');
            alert.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 16px 24px;
                background: linear-gradient(45deg, #00D4FF, #7B2CBF);
                color: #0a0a0e;
                border-radius: 12px;
                font-weight: 600;
                box-shadow: 0 0 30px rgba(0, 212, 255, 0.4);
                z-index: 10000;
            `;
            alert.textContent = `Obrigado, ${nome}! Mensagem enviada com sucesso.`;
            document.body.appendChild(alert);

            setTimeout(() => {
                alert.remove();
            }, 3000);
        }, 1500);
    });
}

// Parallax no hero
let parallaxTick = null;

window.addEventListener('scroll', () => {
    if (parallaxTick) return;
    parallaxTick = requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const spheres = document.querySelectorAll('.gradient-sphere');
        spheres.forEach((sphere, i) => {
            const speed = 0.3 + i * 0.1;
            sphere.style.transform = `translateY(${scrollY * speed}px)`;
        });
        parallaxTick = null;
    });
});
