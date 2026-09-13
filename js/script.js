// ===== Partículas flutuantes =====
function createParticle() {
    const colors = ['#00D4FF', '#FF00C8', '#7B2CBF'];
    const particle = document.createElement('div');
    particle.style.position = 'absolute';
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
    particle.style.borderRadius = '50%';
    particle.style.width = `${Math.random() * 4 + 2}px`;
    particle.style.height = particle.style.width;
    particle.style.left = `${Math.random() * 100}vw`;
    particle.style.top = `${Math.random() * 100}vh`;
    particle.style.opacity = `${Math.random() * 0.3 + 0.1}`;
    particle.style.zIndex = '0';
    particle.style.filter = 'blur(1px)';

    const bg = document.querySelector('.bg-particles');
    if (bg) {
        bg.appendChild(particle);
        setTimeout(() => particle.remove(), 20000);
    }
}

function initParticles() {
    for (let i = 0; i < 50; i++) {
        setTimeout(() => createParticle(), i * 100);
    }
    setInterval(createParticle, 800);
}

// ===== Navegação =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
if (header) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// ===== Typewriter para hero role =====
function initTypewriter() {
    const roleEl = document.querySelector('.hero-role');
    if (!roleEl) return;

    const roles = [
        'Analista de Infraestrutura & Dados',
        'Especialista em Alta Disponibilidade',
        'Expert em Segurança & Automação',
        'Transformando dados em decisões'
    ];

    let idx = 0, char = 0, deleting = false;

    function type() {
        const text = roles[idx];
        if (deleting) {
            char--;
        } else {
            char++;
        }
        roleEl.textContent = text.substring(0, char);

        let delay = deleting ? 75 : 150;
        if (!deleting && char === text.length) {
            delay = 3000; deleting = true;
        } else if (deleting && char === 0) {
            deleting = false;
            idx = (idx + 1) % roles.length;
            delay = 500;
        }
        setTimeout(type, delay);
    }
    type();
}

// ===== GitHub Stats via API =====
async function fetchGitHubStats() {
    try {
        const res = await fetch('https://api.github.com/users/GotardoN1');
        if (!res.ok) throw new Error('API error');
        const data = await res.json();

        document.getElementById('stat-repos').textContent = data.public_repos;
        document.getElementById('stat-followers').textContent = data.followers;
        document.getElementById('stat-following').textContent = data.following;

        const starsRes = await fetch('https://api.github.com/users/GotardoN1/repos?per_page=100&sort=stars');
        const repos = await starsRes.json();
        const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);
        document.getElementById('stat-stars').textContent = totalStars;
    } catch (err) {
        console.error('Failed to fetch GitHub stats:', err);
    }
}

// ===== Top Languages via API =====
async function fetchTopLangs() {
    const container = document.getElementById('top-langs');
    if (!container) return;

    try {
        const res = await fetch('https://api.github.com/users/GotardoN1/repos?per_page=100&sort=updated');
        if (!res.ok) throw new Error('API error');
        const repos = await res.json();

        const langs = {};
        repos.forEach(repo => {
            if (repo.language) {
                langs[repo.language] = (langs[repo.language] || 0) + 1;
            }
        });

        const sorted = Object.entries(langs).sort((a, b) => b[1] - a[1]).slice(0, 6);

        const colors = {
            Python: '#3776AB', JavaScript: '#F7DF1E', HTML: '#E34F26',
            CSS: '#1572B6', CSharp: '#239120', C: '#A8B9CC',
            PowerShell: '#5391FE', Dockerfile: '#2496ED'
        };

        container.innerHTML = sorted.map(([name, count]) => {
            const color = colors[name] || '#6e7681';
            return `<span class="lang-item"><span class="lang-color" style="background:${color}"></span><span class="lang-name">${name}</span><span class="lang-percent">${count} repo(s)</span></span>`;
        }).join('');
    } catch (err) {
        console.error('Failed to fetch languages:', err);
        container.innerHTML = '<span class="lang-item">Dados indisponíveis</span>';
    }
}

// ===== Snake Animation Fallback =====
function initSnake() {
    const img = document.getElementById('snake-img');
    if (!img) return;

    const wrapper = img.parentElement;
    wrapper.classList.add('loading');

    img.onload = () => {
        wrapper.classList.remove('loading');
        img.classList.add('loaded');
    };

    img.onerror = () => {
        wrapper.classList.remove('loading');
        wrapper.innerHTML = '<p style="color: #6b7280; text-align: center; font-family: Fira Code, monospace;">Snake animation ainda não gerado. Rode o <code>snake.yml</code> workflow.</p>';
    };
}

// ===== Animação de entrada no scroll =====
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// ===== Formulário de contato =====
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const btn = this.querySelector('button[type="submit"]');
        const original = btn.textContent;
        btn.textContent = 'Enviando...';
        btn.disabled = true;

        setTimeout(() => {
            btn.textContent = original;
            btn.disabled = false;
            this.reset();

            const alert = document.createElement('div');
            alert.style.cssText = 'position:fixed;top:20px;right:20px;padding:16px 24px;background:linear-gradient(45deg,#00D4FF,#7B2CBF);color:#0a0a0e;border-radius:12px;font-weight:600;box-shadow:0 0 30px rgba(0,212,255,0.4);z-index:10000;';
            alert.textContent = 'Obrigado! Sua mensagem foi enviada com sucesso.';
            document.body.appendChild(alert);
            setTimeout(() => alert.remove(), 3000);
        }, 1500);
    });
}

// ===== Back to Top =====
const backToTop = document.getElementById('back-to-top');
if (backToTop) {
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

window.addEventListener('scroll', () => {
    if (backToTop) {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }

    // Atualizar links de navegação ativos
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    let current = '';

    sections.forEach(section => {
        const top = section.offsetTop;
        if (window.scrollY >= top - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-nav') === current) {
            link.classList.add('active');
        }
    });
});

// ===== Parallax =====
let parallaxTick = null;
window.addEventListener('scroll', () => {
    if (parallaxTick) return;
    parallaxTick = requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const spheres = document.querySelectorAll('.gradient-sphere');
        spheres.forEach((sphere, i) => {
            const speed = 0.4 + i * 0.1;
            sphere.style.transform = `translateY(${scrollY * speed}px)`;
        });
        parallaxTick = null;
    });
});

// ===== Inicialização =====
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initTypewriter();
    fetchGitHubStats();
    fetchTopLangs();
    initSnake();

    const animatedElements = document.querySelectorAll(
        '.project-card, .tech-category, .stats-card, .contact-link, .info-card, .skill-tag'
    );

    animatedElements.forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`;
        observer.observe(el);
    });
});
