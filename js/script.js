// Cursor personalizado
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

let mouseX = 0;
let mouseY = 0;
let isMoving = false;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;

    if (!isMoving) {
        isMoving = true;
        requestAnimationFrame(() => {
            cursorFollower.style.transform = `translate(${mouseX - 10}px, ${mouseY - 10}px)`;
            isMoving = false;
        });
    }
});

// Partículas flutuantes
function createParticle() {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    particle.style.left = `${Math.random() * 100}vw`;
    particle.style.top = `${Math.random() * 100}vh`;
    particle.style.width = `${Math.random() * 4 + 2}px`;
    particle.style.height = particle.style.width;
    particle.style.animationDuration = `${Math.random() * 10 + 10}s`;
    particle.style.animationDelay = `${Math.random() * 5}s`;

    const particlesContainer = document.querySelector('.particles');
    if (particlesContainer) {
        particlesContainer.appendChild(particle);
    }

    setTimeout(() => {
        particle.remove();
    }, 20000);
}

function initParticles() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const particlesContainer = document.createElement('div');
    particlesContainer.classList.add('particles');
    hero.appendChild(particlesContainer);

    for (let i = 0; i < 30; i++) {
        setTimeout(() => createParticle(), i * 300);
    }

    setInterval(createParticle, 1500);
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
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(n => {
        n.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Efeito de scroll no header
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    // Atualizar links de navegação ativos
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Animação de entrada dos elementos
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

// Aplicar animação aos elementos
document.addEventListener('DOMContentLoaded', () => {
    initParticles();

    // Animação de digitação no hero subtitle
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const typingTexts = [
        'Analista de Infraestrutura & Dados',
        'Especialista em Alta Disponibilidade',
        'Expert em Segurança & Automação',
        'Transformando dados em decisões'
    ];

    if (heroSubtitle) {
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function typeWriter() {
            const currentText = typingTexts[textIndex];

            if (isDeleting) {
                charIndex--;
                heroSubtitle.textContent = currentText.substring(0, charIndex);
            } else {
                charIndex++;
                heroSubtitle.textContent = currentText.substring(0, charIndex);
            }

            let delay = isDeleting ? 75 : 150;

            if (!isDeleting && charIndex === currentText.length) {
                delay = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % typingTexts.length;
                delay = 500;
            }

            setTimeout(typeWriter, delay);
        }

        typeWriter();
    }

    // Animação dos elementos
    const animatedElements = document.querySelectorAll('.project-card, .skill-category, .stats-card, .contact-link, .skill-badge, .about-text');

    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
});

// Formulário de contato
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = new FormData(this);
        const nome = formData.get('nome') || 'amigo';

        // Criar mensagem visual de sucesso
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = '✉️ Enviando...';
        submitBtn.disabled = true;

        setTimeout(() => {
            submitBtn.textContent = '✅ Enviado!';

            // Criar alerta customizado
            const alertDiv = document.createElement('div');
            alertDiv.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(45deg, #00D4FF, #7B2CBF);
                color: #0a0a0e;
                padding: 16px 24px;
                border-radius: 12px;
                font-weight: 600;
                box-shadow: 0 0 30px rgba(0, 212, 255, 0.4);
                z-index: 10000;
                animation: slideIn 0.3s ease;
            `;
            alertDiv.textContent = `Obrigado, ${nome}! Sua mensagem foi enviada com sucesso. 🚀`;
            document.body.appendChild(alertDiv);

            setTimeout(() => {
                alertDiv.style.opacity = '0';
                setTimeout(() => alertDiv.remove(), 300);
            }, 3000);

            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            this.reset();
        }, 1500);
    });
}

// Efeito de hover nos cards de projeto
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const angleX = (y - centerY) / 10;
        const angleY = (x - centerX) / 10;
        card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${-angleY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(-8px)';
    });
});

// Parallax sutil no hero
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const hero = document.querySelector('.hero');
    if (hero) {
        const heroElements = hero.querySelectorAll('.hero-content');
        heroElements.forEach(el => {
            const speed = 0.5;
            el.style.transform = `translateY(${scrollY * speed}px)`;
        });
    }
});

// Adicionar classe de animação quando elementos entram na viewport
const fadeElements = document.querySelectorAll('[data-animate]');
if (fadeElements.length > 0) {
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, { threshold: 0.1 });

    fadeElements.forEach(el => fadeObserver.observe(el));
}

// Botão de voltar ao topo (opcional)
const backToTopBtn = document.createElement('button');
backToTopBtn.innerHTML = '↑';
backToTopBtn.className = 'back-to-top';
backToTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: linear-gradient(45deg, #00D4FF, #7B2CBF);
    color: #0a0a0e;
    border: none;
    border-radius: 50%;
    font-size: 20px;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
    font-weight: bold;
    box-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
`;
document.body.appendChild(backToTopBtn);

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        backToTopBtn.style.opacity = '1';
        backToTopBtn.style.visibility = 'visible';
    } else {
        backToTopBtn.style.opacity = '0';
        backToTopBtn.style.visibility = 'hidden';
    }
});
