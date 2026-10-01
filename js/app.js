import { perfil, areas, projetos, etapas, stack } from './dados.js';

/* ============ utilidades ============ */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const norm = (s) => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const calmo = matchMedia('(prefers-reduced-motion: reduce)').matches;
const area = (id) => areas.find((a) => a.id === id);
const guardar = {
  ler(k) { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
  gravar(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* sem armazenamento */ } },
};
const rel = new Intl.RelativeTimeFormat('pt-BR', { numeric: 'auto' });
function haQuanto(iso) {
  const s = (new Date(iso) - Date.now()) / 1000;
  const passos = [[60, 'second'], [3600, 'minute', 60], [86400, 'hour', 3600], [2592000, 'day', 86400], [31536000, 'month', 2592000], [Infinity, 'year', 31536000]];
  for (const [lim, un, div = 1] of passos) if (Math.abs(s) < lim) return rel.format(Math.round(s / div), un);
}
let avisoTimer;
function avisar(msg) {
  const el = $('.aviso');
  el.textContent = msg;
  el.classList.add('mostrar');
  clearTimeout(avisoTimer);
  avisoTimer = setTimeout(() => el.classList.remove('mostrar'), 2200);
}
async function copiarEmail() {
  try { await navigator.clipboard.writeText(perfil.email); avisar(`E-mail copiado: ${perfil.email}`); }
  catch { location.href = `mailto:${perfil.email}`; }
}
function irPara(id) { document.getElementById(id)?.scrollIntoView({ behavior: calmo ? 'auto' : 'smooth' }); }

/* ============ tema ============ */
function temaAtual() {
  return document.documentElement.dataset.theme ?? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
}
function definirTema(t) {
  if (t === 'auto') { delete document.documentElement.dataset.theme; try { localStorage.removeItem('tema'); } catch {} }
  else { document.documentElement.dataset.theme = t; try { localStorage.setItem('tema', t); } catch {} }
  $('meta[name="theme-color"]').content = temaAtual() === 'dark' ? '#0b0e12' : '#f7f6f2';
  atualizarCobra();
}
// a cobrinha acompanha o tema do site, não só o do sistema
function atualizarCobra() {
  const img = $('.cobra__img');
  if (img) img.src = `https://raw.githubusercontent.com/${perfil.usuario}/${perfil.usuario}/main/output/github-snake${temaAtual() === 'dark' ? '-dark' : ''}.svg`;
}
const alternarTema = () => definirTema(temaAtual() === 'dark' ? 'light' : 'dark');

/* ============ topo: progresso, sombra e seção ativa ============ */
function iniciarTopo() {
  const barra = $('.progresso span'), topo = $('.topo');
  const atualizar = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    barra.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    topo.classList.toggle('rolou', scrollY > 8);
  };
  addEventListener('scroll', atualizar, { passive: true });
  atualizar();
  const links = $$('.menu a');
  const obs = new IntersectionObserver((ents) => {
    for (const e of ents) if (e.isIntersecting) links.forEach((a) => a.classList.toggle('ativo', a.hash === `#${e.target.id}`));
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('main > section[id]').forEach((s) => obs.observe(s));
}

/* ============ papel digitando ============ */
function iniciarPapel() {
  const el = $('.papel__txt');
  if (calmo) { el.textContent = perfil.papeis.join(' · '); return; }
  let i = 0, j = perfil.papeis[0].length, apagando = true;
  const passo = () => {
    const alvo = perfil.papeis[i];
    if (apagando) {
      j--;
      if (j <= 0) { apagando = false; i = (i + 1) % perfil.papeis.length; }
    } else {
      j++;
      if (j >= perfil.papeis[i].length) { apagando = true; el.textContent = perfil.papeis[i]; return setTimeout(passo, 2200); }
    }
    el.textContent = (apagando ? alvo : perfil.papeis[i]).slice(0, Math.max(j, 0));
    setTimeout(passo, apagando ? 28 : 55);
  };
  setTimeout(passo, 2400);
}

/* ============ mapa interativo ============ */
function iniciarMapa() {
  const svg = $('.mapa__svg');
  const NS = 'http://www.w3.org/2000/svg';
  const mk = (tag, attrs = {}, pai = svg) => { const el = document.createElementNS(NS, tag); for (const k in attrs) el.setAttribute(k, attrs[k]); pai.appendChild(el); return el; };
  const C = { x: 260, y: 205 };
  const pos = Object.fromEntries(areas.map((a, i) => {
    const ang = (-90 + i * (360 / areas.length)) * Math.PI / 180;
    return [a.id, { x: C.x + Math.cos(ang) * 168, y: C.y + Math.sin(ang) * 150 }];
  }));

  // arestas: núcleo → área, e entre áreas que dividem projetos
  const arestas = areas.map((a) => ({ a: 'nucleo', b: a.id, p1: C, p2: pos[a.id], peso: 1 }));
  for (let i = 0; i < areas.length; i++) for (let k = i + 1; k < areas.length; k++) {
    const juntos = projetos.filter((p) => p.areas.includes(areas[i].id) && p.areas.includes(areas[k].id)).length;
    if (juntos) arestas.push({ a: areas[i].id, b: areas[k].id, p1: pos[areas[i].id], p2: pos[areas[k].id], peso: juntos });
  }
  const gA = mk('g');
  arestas.forEach((e) => { e.el = mk('line', { class: 'aresta', x1: e.p1.x, y1: e.p1.y, x2: e.p2.x, y2: e.p2.y, 'stroke-width': 1 + e.peso * 0.6 }, gA); });

  // pacotes que viajam pelas arestas
  const gP = mk('g');
  const cores = ['var(--accent)', 'var(--warm)'];
  const pacotes = calmo ? [] : Array.from({ length: 14 }, (_, i) => ({
    e: arestas[i % arestas.length], t: Math.random(), v: 0.0025 + Math.random() * 0.004, ida: Math.random() > 0.5,
    el: mk('circle', { r: 3, class: 'pacote', fill: cores[i % 2] }, gP),
  }));

  // núcleo
  const gN = mk('g', { class: 'nucleo' });
  const pulso = mk('circle', { cx: C.x, cy: C.y, r: 46, class: 'pulso' }, gN);
  mk('circle', { cx: C.x, cy: C.y, r: 40 }, gN);
  mk('text', { x: C.x, y: C.y + 8, 'text-anchor': 'middle' }, gN).textContent = 'mg';

  // nós das áreas
  const info = { t: $('.mapa__titulo'), x: $('.mapa__texto') };
  if (matchMedia('(hover: none)').matches) info.t.textContent = 'Toque numa área';
  const padrao = { t: info.t.textContent, x: info.x.textContent };
  const nos = areas.map((a) => {
    const { x, y } = pos[a.id];
    const qtd = projetos.filter((p) => p.areas.includes(a.id)).length;
    const g = mk('g', { class: 'no', tabindex: 0, role: 'button', 'data-cor': a.cor, 'aria-label': `${a.nome}: ${qtd} projetos. Ver projetos.` });
    mk('circle', { class: 'anel', cx: x, cy: y, r: 40 }, g);
    mk('circle', { class: 'fundo', cx: x, cy: y, r: 32 }, g);
    mk('circle', { class: 'ponto', cx: x, cy: y - 12, r: 4 }, g);
    mk('text', { class: 'qtd', x, y: y + 10, 'text-anchor': 'middle' }, g).textContent = qtd;
    mk('text', { x, y: y + 52, 'text-anchor': 'middle' }, g).textContent = a.curto;
    const focar = () => {
      svg.classList.add('focado');
      nos.forEach((n) => n.g.classList.remove('ligado'));
      g.classList.add('ligado');
      arestas.forEach((e) => {
        const liga = e.a === a.id || e.b === a.id;
        e.el.classList.toggle('acesa', liga);
        if (liga) nos.find((n) => n.id === (e.a === a.id ? e.b : e.a))?.g.classList.add('ligado');
      });
      info.t.textContent = `${a.nome} · ${qtd} projeto${qtd > 1 ? 's' : ''}`;
      info.x.textContent = a.texto;
    };
    const soltar = () => {
      svg.classList.remove('focado');
      arestas.forEach((e) => e.el.classList.remove('acesa'));
      info.t.textContent = padrao.t; info.x.textContent = padrao.x;
    };
    const escolher = () => { filtrar({ area: a.id, q: '' }); irPara('projetos'); };
    g.addEventListener('mouseenter', focar); g.addEventListener('focus', focar);
    g.addEventListener('mouseleave', soltar); g.addEventListener('blur', soltar);
    g.addEventListener('click', escolher);
    g.addEventListener('keydown', (ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); escolher(); } });
    return { id: a.id, g };
  });
  marcarNoAtivo = (id) => nos.forEach((n) => n.g.classList.toggle('ativo', n.id === id));

  if (calmo) return;
  let visivel = true, t0 = 0;
  new IntersectionObserver(([e]) => { visivel = e.isIntersecting; if (visivel) requestAnimationFrame(quadro); }).observe(svg);
  function quadro(ts) {
    if (!visivel) return;
    const r = 46 + ((ts - t0) % 2400) / 2400 * 22;
    pulso.setAttribute('r', r);
    pulso.setAttribute('opacity', 1 - (r - 46) / 22);
    for (const p of pacotes) {
      p.t += p.v;
      if (p.t >= 1) { p.t = 0; p.e = arestas[(Math.random() * arestas.length) | 0]; p.ida = Math.random() > 0.5; }
      const k = p.ida ? p.t : 1 - p.t;
      p.el.setAttribute('cx', p.e.p1.x + (p.e.p2.x - p.e.p1.x) * k);
      p.el.setAttribute('cy', p.e.p1.y + (p.e.p2.y - p.e.p1.y) * k);
    }
    requestAnimationFrame(quadro);
  }
  requestAnimationFrame((ts) => { t0 = ts; quadro(ts); });
}
let marcarNoAtivo = () => {};

/* ============ números ============ */
const valores = { projetos: projetos.length, repos: 13 };
function contar(el, alvo) {
  const suf = el.dataset.sufixo ?? '';
  if (calmo) { el.textContent = alvo + suf; return; }
  const ini = performance.now(), dur = 1100;
  const passo = (t) => {
    const k = Math.min(1, (t - ini) / dur);
    el.textContent = Math.round(alvo * (1 - Math.pow(1 - k, 3))) + suf;
    if (k < 1) requestAnimationFrame(passo);
  };
  requestAnimationFrame(passo);
}
function alvoDe(el) { const c = el.dataset.contar; return Number.isNaN(Number(c)) ? valores[c] : Number(c); }
function iniciarNumeros() {
  const obs = new IntersectionObserver((ents) => {
    for (const e of ents) if (e.isIntersecting) { e.target.dataset.visto = '1'; contar(e.target, alvoDe(e.target)); obs.unobserve(e.target); }
  }, { threshold: 0.6 });
  $$('[data-contar]').forEach((el) => obs.observe(el));
}

/* ============ como eu trabalho ============ */
function iniciarEtapas() {
  const abas = $('.etapas__abas'), painel = $('.etapas__painel');
  let atual = 0, auto = !calmo, timer;
  abas.innerHTML = etapas.map((e, i) => `<button class="etapa" role="tab" id="etapa-${i}" aria-controls="etapa-painel" tabindex="${i ? -1 : 0}"><small>0${i + 1}</small><span>${esc(e.titulo)}</span></button>`).join('');
  painel.id = 'etapa-painel';
  const mostrar = (i, foco = false) => {
    atual = i;
    $$('.etapa', abas).forEach((b, k) => { b.setAttribute('aria-selected', k === i); b.tabIndex = k === i ? 0 : -1; });
    if (foco) $$('.etapa', abas)[i].focus();
    painel.setAttribute('aria-labelledby', `etapa-${i}`);
    painel.innerHTML = `<h3>${esc(etapas[i].titulo)}</h3><p>${esc(etapas[i].texto)}</p>${auto ? '<div class="etapas__barra"><i></i></div>' : ''}`;
    clearTimeout(timer);
    if (auto) {
      requestAnimationFrame(() => $('.etapas__barra', painel)?.classList.add('rodando'));
      timer = setTimeout(() => mostrar((atual + 1) % etapas.length), 6000);
    }
  };
  const parar = () => { auto = false; clearTimeout(timer); };
  abas.addEventListener('click', (e) => { const b = e.target.closest('.etapa'); if (!b) return; parar(); mostrar($$('.etapa', abas).indexOf(b)); });
  abas.addEventListener('keydown', (e) => {
    const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!d) return;
    e.preventDefault(); parar(); mostrar((atual + d + etapas.length) % etapas.length, true);
  });
  // só começa a girar quando a pessoa chega na seção
  new IntersectionObserver(([e], o) => { if (e.isIntersecting) { mostrar(0); o.disconnect(); } }, { threshold: 0.4 }).observe(abas);
  mostrar(0);
  clearTimeout(timer);
}

function iniciarStack() {
  $('.stack').innerHTML = stack.map((g) => `<div class="stack__grupo"><h3>${esc(g.grupo)}</h3><ul>${g.itens.map((i) => `<li><button type="button" data-tec="${esc(i)}">${esc(i)}</button></li>`).join('')}</ul></div>`).join('');
  $('.stack').addEventListener('click', (e) => {
    const b = e.target.closest('[data-tec]');
    if (!b) return;
    filtrar({ area: 'todos', q: b.dataset.tec });
    irPara('projetos');
  });
}

/* ============ projetos ============ */
const estado = { area: 'todos', q: '' };
const vivo = {}; // dados do GitHub por repositório
const corLing = { Python: '#3572A5', 'C#': '#178600', TypeScript: '#3178c6', JavaScript: '#f1e05a', C: '#8a8a8a', HTML: '#e34c26', CSS: '#663399', Shell: '#89e051', PowerShell: '#5391FE', 'Jupyter Notebook': '#DA5B0B' };
let listaVisivel = [];

function combina(p) {
  if (estado.area !== 'todos' && !p.areas.includes(estado.area)) return false;
  if (!estado.q) return true;
  const alvo = norm([p.titulo, p.resumo, p.descricao, ...p.stack, ...p.areas.map((a) => area(a).nome)].join(' '));
  return norm(estado.q).split(/\s+/).every((t) => alvo.includes(t));
}

function rodapeCard(p) {
  if (p.privado) return '<span>🔒 código privado</span><span class="abrir">Detalhes →</span>';
  const v = vivo[p.repo];
  const lang = v?.language ? `<span class="lang"><i style="background:${corLing[v.language] ?? 'var(--muted)'}"></i>${esc(v.language)}</span>` : '';
  const quando = v?.pushed_at ? `<span>${esc(haQuanto(v.pushed_at))}</span>` : '';
  return `${lang}${quando}<span class="abrir">Detalhes →</span>`;
}

function renderProjetos(animar = true) {
  listaVisivel = projetos.filter(combina);
  const grade = $('.grade');
  grade.innerHTML = listaVisivel.map((p, i) => {
    const a = area(p.areas[0]);
    return `<a class="card${animar ? ' sai' : ''}" href="#projeto/${p.slug}" data-cor="${a.cor}" style="animation-delay:${Math.min(i, 8) * 35}ms">
      <div class="card__topo"><span class="card__icone" aria-hidden="true">${p.icone}</span>${p.areas.includes('producao') ? '<span class="selo selo--prod">em produção</span>' : `<span class="selo">${esc(a.curto)}</span>`}</div>
      <h3>${esc(p.titulo)}</h3>
      <p>${esc(p.resumo)}</p>
      <div class="tags">${p.stack.slice(0, 4).map((s) => `<span class="tag">${esc(s)}</span>`).join('')}</div>
      <div class="card__rodape">${rodapeCard(p)}</div>
    </a>`;
  }).join('');
  const n = listaVisivel.length;
  const filtroTxt = [estado.area !== 'todos' && area(estado.area).nome, estado.q && `“${estado.q}”`].filter(Boolean).join(' + ');
  $('.contagem').textContent = `${n} de ${projetos.length} projetos${filtroTxt ? ` · filtro: ${filtroTxt}` : ''}`;
  $('.vazio').hidden = n > 0;
  $$('.chip').forEach((c) => c.setAttribute('aria-pressed', c.dataset.area === estado.area));
  marcarNoAtivo(estado.area);
}

function filtrar(novo) {
  Object.assign(estado, novo);
  const campo = $('.busca input');
  if (campo.value !== estado.q) campo.value = estado.q;
  renderProjetos();
}

function iniciarProjetos() {
  const chips = [{ id: 'todos', nome: 'Todos', cor: '' }, ...areas];
  $('.chips').innerHTML = chips.map((c) => {
    const qtd = c.id === 'todos' ? projetos.length : projetos.filter((p) => p.areas.includes(c.id)).length;
    return `<button type="button" class="chip" data-area="${c.id}" ${c.cor ? `data-cor="${c.cor}"` : ''} aria-pressed="false">${c.cor ? '<i></i>' : ''}${esc(c.nome)} <small>${qtd}</small></button>`;
  }).join('');
  $('.chips').addEventListener('click', (e) => { const c = e.target.closest('.chip'); if (c) filtrar({ area: c.dataset.area }); });
  let t;
  $('.busca input').addEventListener('input', (e) => { clearTimeout(t); t = setTimeout(() => filtrar({ q: e.target.value.trim() }), 120); });
  $('[data-acao="limpar-filtros"]').addEventListener('click', () => filtrar({ area: 'todos', q: '' }));
  // brilho que segue o mouse
  $('.grade').addEventListener('pointermove', (e) => {
    const c = e.target.closest('.card'); if (!c) return;
    const r = c.getBoundingClientRect();
    c.style.setProperty('--mx', `${e.clientX - r.left}px`); c.style.setProperty('--my', `${e.clientY - r.top}px`);
  });
  renderProjetos(false);
}

/* ============ modal do projeto ============ */
const modal = $('.modal');
let projetoAberto = null;
function abrirProjeto(slug, { historico = true } = {}) {
  const p = projetos.find((x) => x.slug === slug);
  if (!p) return;
  projetoAberto = p;
  const a = area(p.areas[0]);
  const v = vivo[p.repo];
  const repoUrl = p.repo && `https://github.com/${perfil.usuario}/${p.repo}`;
  const lista = listaVisivel.some((x) => x.slug === slug) ? listaVisivel : projetos;
  const i = lista.findIndex((x) => x.slug === slug);
  modal.dataset.cor = a.cor;
  modal.querySelector('.modal__corpo').innerHTML = `
    <div class="modal__cab">
      <span class="card__icone" aria-hidden="true">${p.icone}</span>
      <div>
        <h2 id="modal-titulo">${esc(p.titulo)}</h2>
        <div class="modal__areas">${p.areas.map((id) => `<span class="selo${id === 'producao' ? ' selo--prod' : ''}">${esc(area(id).nome)}</span>`).join('')}</div>
      </div>
      <button class="btn-icone modal__fechar" type="button" data-fechar aria-label="Fechar"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button>
    </div>
    <p class="modal__desc">${esc(p.descricao)}</p>
    <h3>Destaques</h3>
    <ul class="destaques">${p.destaques.map((d) => `<li>${esc(d)}</li>`).join('')}</ul>
    <h3>Tecnologias</h3>
    <div class="tags">${p.stack.map((s) => `<span class="tag">${esc(s)}</span>`).join('')}</div>
    ${p.equipe ? `<h3>Equipe</h3><p>${esc(p.equipe)}</p>` : ''}
    ${p.privado ? '<p class="privado">🔒 Sistema em uso numa empresa. O código é privado, então aqui vai só o resumo. Posso mostrar mais numa conversa.</p>' : ''}
    ${v ? `<div class="modal__meta">${v.language ? `<span>● ${esc(v.language)}</span>` : ''}<span>criado ${esc(haQuanto(v.created_at))}</span><span>último envio ${esc(haQuanto(v.pushed_at))}</span>${v.stargazers_count ? `<span>★ ${v.stargazers_count}</span>` : ''}</div>` : ''}
    <div class="modal__acoes">
      ${p.site ? `<a class="btn btn--forte" href="${p.site}" target="_blank" rel="noopener">Abrir site ↗</a>` : ''}
      ${repoUrl ? `<a class="btn${p.site ? '' : ' btn--forte'}" href="${repoUrl}" target="_blank" rel="noopener">Ver no GitHub ↗</a>` : ''}
      ${p.extra ? `<a class="btn" href="${p.extra.url}" target="_blank" rel="noopener">${esc(p.extra.rotulo)} ↗</a>` : ''}
      <div class="modal__nav">
        <button class="btn" type="button" data-ir="${lista[(i - 1 + lista.length) % lista.length].slug}" aria-label="Projeto anterior">←</button>
        <button class="btn" type="button" data-ir="${lista[(i + 1) % lista.length].slug}" aria-label="Próximo projeto">→</button>
      </div>
    </div>`;
  if (historico && location.hash !== `#projeto/${slug}`) history.replaceState(null, '', `#projeto/${slug}`);
  if (!modal.open) modal.showModal();
  modal.querySelector('.modal__corpo').scrollTop = 0;
}
function fecharProjeto() { if (modal.open) modal.close(); }
function iniciarModal() {
  modal.addEventListener('close', () => {
    projetoAberto = null;
    if (location.hash.startsWith('#projeto/')) history.replaceState(null, '', '#projetos');
  });
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.closest('[data-fechar]')) return fecharProjeto();
    const ir = e.target.closest('[data-ir]');
    if (ir) abrirProjeto(ir.dataset.ir);
  });
  modal.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      const alvo = modal.querySelector(`[data-ir]:${e.key === 'ArrowRight' ? 'last' : 'first'}-of-type`);
      alvo && abrirProjeto(alvo.dataset.ir);
    }
  });
  const pelaUrl = () => {
    const m = location.hash.match(/^#projeto\/([\w-]+)/);
    if (m) abrirProjeto(m[1], { historico: false });
  };
  $('.grade').addEventListener('click', (e) => {
    const c = e.target.closest('.card');
    if (!c || e.metaKey || e.ctrlKey) return;
    e.preventDefault();
    abrirProjeto(c.getAttribute('href').slice('#projeto/'.length));
  });
  addEventListener('hashchange', pelaUrl);
  pelaUrl();
}

/* ============ GitHub ao vivo ============ */
async function buscarGitHub(caminho, chave) {
  const cache = guardar.ler(chave);
  if (cache && Date.now() - cache.t < 30 * 60 * 1000) return cache.d;
  try {
    const r = await fetch(`https://api.github.com${caminho}`, { headers: { Accept: 'application/vnd.github+json' } });
    if (!r.ok) throw new Error(r.status);
    const d = await r.json();
    guardar.gravar(chave, { t: Date.now(), d });
    return d;
  } catch (e) {
    if (cache) return cache.d; // dado antigo é melhor que nada
    throw e;
  }
}

const descreverEvento = (ev) => {
  const repo = ev.repo.name.replace(`${perfil.usuario}/`, '');
  const link = `<a href="https://github.com/${esc(ev.repo.name)}" target="_blank" rel="noopener">${esc(repo)}</a>`;
  const p = ev.payload ?? {};
  switch (ev.type) {
    case 'PushEvent': { const n = p.size ?? p.commits?.length; return ['⬆️', n ? `${n} commit${n > 1 ? 's' : ''} em ${link}` : `Enviou código para ${link}`]; }
    case 'CreateEvent': return p.ref_type === 'repository' ? ['✨', `Criou o repositório ${link}`] : ['🌿', `Criou ${p.ref_type === 'tag' ? 'a tag' : 'o branch'} <code>${esc(p.ref ?? '')}</code> em ${link}`];
    case 'ReleaseEvent': return ['🚀', `Publicou ${esc(p.release?.tag_name ?? 'uma versão')} de ${link}`];
    case 'WatchEvent': return ['⭐', `Deu estrela em ${link}`];
    case 'PublicEvent': return ['🌍', `Tornou ${link} público`];
    case 'ForkEvent': return ['🍴', `Fez fork de ${link}`];
    case 'PullRequestEvent': return ['🔀', `${p.action === 'closed' ? 'Fechou' : 'Abriu'} um pull request em ${link}`];
    case 'IssuesEvent': return ['📌', `${p.action === 'closed' ? 'Fechou' : 'Abriu'} uma issue em ${link}`];
    case 'DeleteEvent': return ['🧹', `Removeu ${p.ref_type === 'tag' ? 'a tag' : 'o branch'} <code>${esc(p.ref ?? '')}</code> em ${link}`];
    default: return null;
  }
};

let resumoGitHub = null;
async function iniciarGitHub() {
  const [repos, eventos] = await Promise.allSettled([
    buscarGitHub(`/users/${perfil.usuario}/repos?per_page=100&sort=pushed`, 'gh-repos'),
    buscarGitHub(`/users/${perfil.usuario}/events/public?per_page=40`, 'gh-eventos'),
  ]);

  if (repos.status === 'fulfilled') {
    const lista = repos.value.filter((r) => !r.fork);
    lista.forEach((r) => { vivo[r.name] = r; });
    valores.repos = lista.length;
    $$('[data-contar="repos"]').forEach((el) => { el.dataset.visto ? contar(el, lista.length) : (el.textContent = lista.length); });
    renderProjetos(false);

    // linguagens (linguagem principal de cada repositório)
    const cont = {};
    lista.forEach((r) => { if (r.language) cont[r.language] = (cont[r.language] ?? 0) + 1; });
    const total = Object.values(cont).reduce((a, b) => a + b, 0);
    const ord = Object.entries(cont).sort((a, b) => b[1] - a[1]);
    $('.barra-ling').innerHTML = ord.map(([l, n]) => `<span data-l="${esc(l)}" style="flex-grow:${n};background:${corLing[l] ?? 'var(--muted)'}" title="${esc(l)}: ${n}"></span>`).join('');
    $('.legenda').innerHTML = ord.map(([l, n]) => `<li data-l="${esc(l)}"><i style="background:${corLing[l] ?? 'var(--muted)'}"></i><b>${esc(l)}</b><span>${n} repo${n > 1 ? 's' : ''} · ${Math.round((n / total) * 100)}%</span></li>`).join('')
      + `<li><i style="background:var(--surface-2)"></i>Sem linguagem detectada<span>${lista.length - total}</span></li>`;
    const realcar = (l) => $$('.gh__ling [data-l]').forEach((el) => el.classList.toggle('realce', el.dataset.l === l));
    $('.gh__ling').addEventListener('pointerover', (e) => realcar(e.target.closest('[data-l]')?.dataset.l));
    $('.gh__ling').addEventListener('pointerleave', () => realcar(null));

    // atualizados recentemente
    $('.recentes').innerHTML = lista.slice(0, 5).map((r) => {
      const p = projetos.find((x) => x.repo === r.name);
      const nome = p ? p.titulo : r.name;
      return `<li><a href="${p ? `#projeto/${p.slug}` : r.html_url}" ${p ? '' : 'target="_blank" rel="noopener"'}>${esc(nome)}</a><small>${r.language ? `${esc(r.language)} · ` : ''}${esc(haQuanto(r.pushed_at))}</small></li>`;
    }).join('');
    resumoGitHub = { repos: lista.length, linguagens: ord.slice(0, 4).map(([l]) => l), ultimo: lista[0] };
  } else {
    $('.recentes').innerHTML = '<li class="carregando">Não consegui falar com o GitHub agora. Tente recarregar daqui a pouco.</li>';
    $('.barra-ling').closest('.cartao').insertAdjacentHTML('beforeend', '<p class="carregando">Sem dados no momento.</p>');
  }

  if (eventos.status === 'fulfilled') {
    // envios seguidos para o mesmo repositório viram uma linha só
    const agrupados = [];
    for (const ev of eventos.value) {
      const ant = agrupados[agrupados.length - 1];
      if (ev.type === 'PushEvent' && ant?.ev.type === 'PushEvent' && ant.ev.repo.name === ev.repo.name) { ant.vezes++; continue; }
      agrupados.push({ ev, vezes: 1 });
    }
    const itens = agrupados.map(({ ev, vezes }) => {
      const d = descreverEvento(ev);
      if (d && vezes > 1) d[1] = `${vezes} envios de código para ${d[1].slice(d[1].indexOf('<a'))}`;
      return { ev, d };
    }).filter((x) => x.d).slice(0, 6);
    $('.atividade').innerHTML = itens.length
      ? itens.map(({ ev, d: [ic, txt] }) => `<li><span class="ic" aria-hidden="true">${ic}</span><span>${txt}<small>${esc(haQuanto(ev.created_at))}</small></span></li>`).join('')
      : '<li class="carregando">Nenhuma atividade pública nos últimos 90 dias.</li>';
    if (resumoGitHub && itens[0]) resumoGitHub.evento = itens[0];
  } else {
    $('.atividade').innerHTML = '<li class="carregando">Não consegui carregar a atividade agora.</li>';
  }
}

/* ============ terminal ============ */
function iniciarTerminal() {
  const saida = $('.term__saida'), campo = $('.term__in'), form = $('.term__linha');
  const hist = []; let pos = 0;
  const out = (html, cls = '') => { const d = document.createElement('div'); if (cls) d.className = cls; d.innerHTML = html; saida.appendChild(d); saida.scrollTop = saida.scrollHeight; return d; };
  const vazio = () => out('&nbsp;');
  const btnProj = (p, n) => `<button type="button" class="c-link" data-abrir="${p.slug}">${n ? `${String(n).padStart(2, ' ')}. ` : ''}${esc(p.titulo)}</button>`;

  const comandos = {
    ajuda: { d: 'lista os comandos', f() {
      out(Object.entries(comandos).filter(([, c]) => c.d).map(([n, c]) => `  <span class="c-ok">${n.padEnd(10)}</span> ${esc(c.d)}`).join('\n'));
      out('\n<span class="c-fraco">Dicas: Tab completa, ↑ ↓ navegam no histórico e Ctrl+L limpa a tela.</span>');
    } },
    sobre: { d: 'quem sou eu', f() {
      out(`<span class="c-quente">${esc(perfil.nome)}</span>\nInfraestrutura, dados e automação.\nTransformo processo manual em sistema que roda sozinho.\n\n<span class="c-fraco">formação</span>  ${esc(perfil.formacao)}\n<span class="c-fraco">hoje</span>      intranet corporativa, apps desktop e acesso remoto em produção`);
    } },
    projetos: { d: 'lista projetos (ex.: projetos dados)', f(args) {
      const a = args[0] && areas.find((x) => norm(x.id) === norm(args[0]) || norm(x.curto) === norm(args[0]) || norm(x.nome).startsWith(norm(args[0])));
      if (args[0] && !a) return out(`Área desconhecida: ${esc(args[0])}. Áreas: ${areas.map((x) => x.id).join(', ')}`, 'c-erro');
      const lista = projetos.filter((p) => !a || p.areas.includes(a.id));
      out(`<span class="c-fraco">${lista.length} projeto(s)${a ? ` em ${esc(a.nome)}` : ''}. Clique ou digite <span class="c-ok">abrir &lt;número&gt;</span>.</span>`);
      out(lista.map((p) => `${btnProj(p, projetos.indexOf(p) + 1)}${p.privado ? ' <span class="c-quente">[produção]</span>' : ''}`).join('\n'));
      if (a) filtrar({ area: a.id, q: '' });
    } },
    abrir: { d: 'abre um projeto (número ou nome)', f(args) {
      const q = norm(args.join(' '));
      if (!q) return out('Uso: abrir &lt;número ou nome&gt;. Exemplo: <span class="c-ok">abrir 1</span>', 'c-fraco');
      const p = projetos[Number(q) - 1] ?? projetos.find((x) => x.slug === q || norm(x.titulo).includes(q) || norm(x.repo ?? '').includes(q));
      if (!p) return out(`Projeto não encontrado: ${esc(args.join(' '))}`, 'c-erro');
      out(`Abrindo <span class="c-ok">${esc(p.titulo)}</span>…`);
      abrirProjeto(p.slug);
    } },
    areas: { d: 'áreas de atuação', f() { out(areas.map((a) => `  <span class="c-ok">${a.id.padEnd(9)}</span> ${esc(a.nome)} <span class="c-fraco">· ${projetos.filter((p) => p.areas.includes(a.id)).length} projetos</span>`).join('\n')); } },
    stack: { d: 'ferramentas por área', f() { out(stack.map((g) => `  <span class="c-quente">${g.grupo.padEnd(15)}</span> ${g.itens.join(' · ')}`).join('\n')); } },
    github: { d: 'resumo do GitHub ao vivo', f() {
      if (!resumoGitHub) return out('Ainda carregando os dados do GitHub (ou a API está fora do ar). Tente de novo em alguns segundos.', 'c-fraco');
      const g = resumoGitHub;
      out(`<span class="c-ok">github.com/${perfil.usuario}</span>\n  repositórios públicos  ${g.repos}\n  linguagens principais  ${g.linguagens.join(', ')}\n  último envio           ${esc(g.ultimo.name)} (${esc(haQuanto(g.ultimo.pushed_at))})${g.evento ? `\n  atividade recente      ${g.evento.d[1].replace(/<[^>]+>/g, '')}` : ''}`);
    } },
    contato: { d: 'como falar comigo', f() {
      out(`  e-mail    <a href="mailto:${perfil.email}">${perfil.email}</a>  <button type="button" class="c-link" data-copiar>copiar</button>\n  linkedin  <a href="${perfil.linkedin}" target="_blank" rel="noopener">matheus-gotardo</a>\n  github    <a href="${perfil.github}" target="_blank" rel="noopener">${perfil.usuario}</a>`);
    } },
    neofetch: { d: 'informações do “sistema”', f() {
      const arte = ['   ███╗   ███╗ ██████╗ ', '   ████╗ ████║██╔════╝ ', '   ██╔████╔██║██║  ███╗', '   ██║╚██╔╝██║██║   ██║', '   ██║ ╚═╝ ██║╚██████╔╝', '   ╚═╝     ╚═╝ ╚═════╝ '];
      const info = [`<span class="c-ok">gotardo</span>@<span class="c-ok">portfolio</span>`, '─────────────────', `<span class="c-quente">SO</span>        Infra &amp; Dados 2026`, `<span class="c-quente">Kernel</span>    automação-${new Date().getFullYear()}`, `<span class="c-quente">Uptime</span>    desde o primeiro "funciona na minha máquina"`, `<span class="c-quente">Shell</span>     PowerShell, Bash`, `<span class="c-quente">Projetos</span>  ${projetos.length} (${projetos.filter((p) => p.privado).length} em produção)`, `<span class="c-quente">Tema</span>      ${temaAtual() === 'dark' ? 'escuro' : 'claro'}`];
      out(arte.map((l, i) => `<span class="c-ok">${l}</span>   ${info[i] ?? ''}`).concat(info.slice(arte.length).map((l) => ' '.repeat(26) + l)).join('\n'));
    } },
    ping: { d: 'teste de latência (simulado)', async f(args) {
      const alvo = esc(args[0] ?? 'gotardo');
      out(`PING ${alvo}: 56 bytes de dados <span class="c-fraco">(simulação: este site não acessa nenhuma rede interna)</span>`);
      for (let i = 1; i <= 4; i++) {
        await new Promise((r) => setTimeout(r, 380));
        out(`64 bytes de ${alvo}: icmp_seq=${i} ttl=64 tempo=${(8 + Math.random() * 14).toFixed(1)} ms`);
      }
      out(`<span class="c-ok">--- ${alvo}: 4 enviados, 4 recebidos, 0% de perda ---</span>`);
    } },
    tema: { d: 'tema claro | escuro | auto', f(args) {
      const m = { claro: 'light', light: 'light', escuro: 'dark', dark: 'dark', auto: 'auto' };
      const t = m[norm(args[0] ?? '')];
      if (!t) { alternarTema(); return out(`Tema: <span class="c-ok">${temaAtual() === 'dark' ? 'escuro' : 'claro'}</span>`); }
      definirTema(t); out(`Tema: <span class="c-ok">${args[0]}</span>`);
    } },
    ls: { d: 'lista arquivos', f() { out('<span class="c-ok">projetos/</span>  sobre.txt  stack.txt  contato.txt  leia-me.md'); } },
    cat: { f(args) {
      const m = { 'sobre.txt': 'sobre', 'stack.txt': 'stack', 'contato.txt': 'contato', 'leia-me.md': 'ajuda' };
      const c = m[args[0]];
      if (c) return comandos[c].f([]);
      out(args[0] ? `cat: ${esc(args[0])}: arquivo não encontrado` : 'Uso: cat &lt;arquivo&gt;. Veja com ls.', 'c-erro');
    } },
    cd: { f(a) { if ((a[0] ?? '').startsWith('projetos')) return comandos.projetos.f([]); out('Aqui não tem para onde ir. Use <span class="c-ok">abrir</span> ou aperte Ctrl+K.', 'c-fraco'); } },
    whoami: { f() { out('visitante <span class="c-fraco">(e o dono da casa é o Matheus; digite sobre)</span>'); } },
    data: { d: 'data e hora', f() { out(new Date().toLocaleString('pt-BR', { dateStyle: 'full', timeStyle: 'short' })); } },
    eco: { f(args) { out(esc(args.join(' '))); } },
    historico: { d: 'comandos digitados', f() { out(hist.map((h, i) => `  ${String(i + 1).padStart(3)}  ${esc(h)}`).join('\n') || 'vazio', 'c-fraco'); } },
    sudo: { f() { out('[sudo] senha para visitante: ********\n<span class="c-erro">visitante não está no arquivo sudoers.</span> Este incidente será reportado ao setor de TI.\n<span class="c-fraco">(O setor de TI sou eu. Pode ficar tranquilo.)</span>'); } },
    exit: { f() { out('Não dá para sair, mas é só rolar a página 😉', 'c-fraco'); } },
    limpar: { d: 'limpa a tela', f() { saida.innerHTML = ''; } },
  };
  const apelidos = { help: 'ajuda', '?': 'ajuda', clear: 'limpar', cls: 'limpar', echo: 'eco', history: 'historico', theme: 'tema', about: 'sobre', projects: 'projetos', open: 'abrir', contact: 'contato', date: 'data', quit: 'exit', sair: 'exit', dir: 'ls', type: 'cat' };

  async function executar(linha) {
    const txt = linha.trim();
    out(esc(txt), 'c-cmd');
    if (!txt) return;
    hist.push(txt); pos = hist.length;
    const [nome, ...args] = txt.split(/\s+/);
    const chave = apelidos[norm(nome)] ?? norm(nome);
    const cmd = comandos[chave];
    if (!cmd) return out(`comando não encontrado: ${esc(nome)}. Digite <span class="c-ok">ajuda</span>.`, 'c-erro');
    campo.disabled = true;
    try { await cmd.f(args); } finally { campo.disabled = false; if (document.activeElement === document.body) campo.focus({ preventScroll: true }); }
  }
  terminalExecutar = (c) => { irPara('terminal'); executar(c); };

  form.addEventListener('submit', (e) => { e.preventDefault(); const v = campo.value; campo.value = ''; executar(v).then(() => campo.focus({ preventScroll: true })); });
  campo.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' && hist.length) { e.preventDefault(); pos = Math.max(0, pos - 1); campo.value = hist[pos]; }
    else if (e.key === 'ArrowDown' && hist.length) { e.preventDefault(); pos = Math.min(hist.length, pos + 1); campo.value = hist[pos] ?? ''; }
    else if (e.key === 'l' && e.ctrlKey) { e.preventDefault(); saida.innerHTML = ''; }
    else if (e.key === 'Tab') {
      const v = campo.value; const partes = v.split(' ');
      if (!v) return; e.preventDefault();
      const opcoes = partes.length === 1 ? Object.keys(comandos) : ['abrir'].includes(partes[0]) ? projetos.map((p) => p.slug) : partes[0] === 'projetos' ? areas.map((a) => a.id) : partes[0] === 'tema' ? ['claro', 'escuro', 'auto'] : [];
      const ult = partes[partes.length - 1];
      const achou = opcoes.filter((o) => o.startsWith(norm(ult)));
      if (achou.length === 1) { partes[partes.length - 1] = achou[0]; campo.value = partes.join(' ') + ' '; }
      else if (achou.length > 1) out(achou.join('  '), 'c-fraco');
    }
  });
  saida.addEventListener('click', (e) => {
    const b = e.target.closest('[data-abrir]'); if (b) return abrirProjeto(b.dataset.abrir);
    if (e.target.closest('[data-copiar]')) return copiarEmail();
    if (!getSelection().toString() && !e.target.closest('a,button')) campo.focus({ preventScroll: true });
  });
  $('.term__sugestoes').addEventListener('click', (e) => { const b = e.target.closest('[data-cmd]'); if (b) executar(b.dataset.cmd); });

  out(`<span class="c-ok">Bem-vindo ao terminal do portfólio.</span> <span class="c-fraco">v${new Date().getFullYear()}.1</span>`);
  out('Digite <span class="c-ok">ajuda</span> para ver os comandos ou clique numa sugestão abaixo.');
  vazio();
}
let terminalExecutar = () => {};

/* ============ busca rápida (Ctrl+K) ============ */
function iniciarPaleta() {
  const dlg = $('.paleta'), campo = $('input', dlg), lista = $('.paleta__lista', dlg);
  const secoes = [['inicio', 'Início', '🏠'], ['sobre', 'Sobre', '👋'], ['projetos', 'Projetos', '🗂️'], ['terminal', 'Terminal', '⌨️'], ['github', 'GitHub ao vivo', '📡'], ['contato', 'Contato', '✉️']];
  const itens = [
    ...secoes.map(([id, nome, ic]) => ({ g: 'Seções', ic, nome, dica: `#${id}`, f: () => irPara(id) })),
    ...projetos.map((p) => ({ g: 'Projetos', ic: p.icone, nome: p.titulo, chaves: p.stack.join(' '), dica: area(p.areas[0]).curto, f: () => abrirProjeto(p.slug) })),
    ...areas.map((a) => ({ g: 'Filtrar', ic: '⚑', nome: `Projetos de ${a.nome}`, dica: 'filtro', f: () => { filtrar({ area: a.id, q: '' }); irPara('projetos'); } })),
    { g: 'Ações', ic: '🌓', nome: 'Alternar tema claro/escuro', chaves: 'dark light modo', f: alternarTema },
    { g: 'Ações', ic: '📋', nome: 'Copiar meu e-mail', chaves: 'email contato', f: copiarEmail },
    { g: 'Ações', ic: '⌨️', nome: 'Rodar neofetch no terminal', chaves: 'terminal', f: () => terminalExecutar('neofetch') },
    { g: 'Links', ic: '↗', nome: 'Abrir LinkedIn', f: () => open(perfil.linkedin, '_blank', 'noopener') },
    { g: 'Links', ic: '↗', nome: 'Abrir perfil no GitHub', f: () => open(perfil.github, '_blank', 'noopener') },
  ];
  let filtrados = [], sel = 0;
  const desenhar = () => {
    const q = norm(campo.value.trim());
    filtrados = itens.filter((i) => !q || q.split(/\s+/).every((t) => norm(`${i.nome} ${i.chaves ?? ''} ${i.g}`).includes(t)));
    sel = Math.min(sel, Math.max(0, filtrados.length - 1));
    let grupo = '';
    lista.innerHTML = filtrados.map((it, k) => {
      const cab = it.g !== grupo ? `<li class="grupo" role="presentation">${esc((grupo = it.g))}</li>` : '';
      return `${cab}<li role="option" id="op-${k}" data-k="${k}" aria-selected="${k === sel}"><span class="ic" aria-hidden="true">${it.ic}</span>${esc(it.nome)}${it.dica ? `<small>${esc(it.dica)}</small>` : ''}</li>`;
    }).join('') || '<li class="grupo">Nada encontrado</li>';
    campo.setAttribute('aria-activedescendant', filtrados.length ? `op-${sel}` : '');
    $(`#op-${sel}`, lista)?.scrollIntoView({ block: 'nearest' });
  };
  const executar = (k) => { const it = filtrados[k]; if (!it) return; dlg.close(); setTimeout(it.f, 10); };
  abrirPaleta = () => { if (dlg.open) return dlg.close(); campo.value = ''; sel = 0; desenhar(); dlg.showModal(); campo.focus(); };
  campo.addEventListener('input', () => { sel = 0; desenhar(); });
  campo.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); sel = (sel + 1) % Math.max(1, filtrados.length); desenhar(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); sel = (sel - 1 + filtrados.length) % Math.max(1, filtrados.length); desenhar(); }
    else if (e.key === 'Enter') { e.preventDefault(); executar(sel); }
  });
  lista.addEventListener('click', (e) => { const li = e.target.closest('[data-k]'); if (li) executar(Number(li.dataset.k)); });
  lista.addEventListener('pointermove', (e) => { const li = e.target.closest('[data-k]'); if (li && Number(li.dataset.k) !== sel) { sel = Number(li.dataset.k); $$('[data-k]', lista).forEach((x) => x.setAttribute('aria-selected', x === li)); } });
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
}
let abrirPaleta = () => {};

/* ============ entrada nas seções ============ */
function iniciarRevelar() {
  if (calmo) return;
  const alvos = $$('.secao__cab, .sobre, .stack, .filtros, .term, .gh, .cobra, .contato > *, .numeros');
  alvos.forEach((el) => el.classList.add('revelar'));
  const obs = new IntersectionObserver((ents) => {
    for (const e of ents) if (e.isIntersecting) { e.target.classList.add('visivel'); obs.unobserve(e.target); }
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  alvos.forEach((el) => obs.observe(el));
}

/* ============ atalhos e ações globais ============ */
function iniciarAtalhos() {
  document.addEventListener('click', (e) => {
    const a = e.target.closest('[data-acao]')?.dataset.acao;
    if (a === 'tema') alternarTema();
    else if (a === 'paleta') abrirPaleta();
    else if (a === 'copiar-email') copiarEmail();
  });
  document.addEventListener('keydown', (e) => {
    const digitando = e.target.closest?.('input, textarea, [contenteditable]');
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); abrirPaleta(); }
    else if (e.key === '/' && !digitando && !$('dialog[open]')) { e.preventDefault(); abrirPaleta(); }
  });
}

/* ============ início ============ */
atualizarCobra();
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', atualizarCobra);
iniciarTopo();
iniciarAtalhos();
iniciarPapel();
iniciarMapa();
iniciarNumeros();
iniciarEtapas();
iniciarStack();
iniciarProjetos();
iniciarModal();
iniciarTerminal();
iniciarPaleta();
iniciarRevelar();
iniciarGitHub();
