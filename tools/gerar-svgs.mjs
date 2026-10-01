// Gera as imagens animadas do README (tema escuro e claro).
// Uso: node tools/gerar-svgs.mjs
import { writeFileSync, mkdirSync } from 'node:fs';

const temas = {
  dark: { bg: '#0d1117', card: '#161b22', line: '#30363d', text: '#e6edf3', muted: '#8b949e', accent: '#2dd4bf', warm: '#f5b84b', node: '#1f2630' },
  light: { bg: '#ffffff', card: '#f6f8fa', line: '#d0d7de', text: '#1f2328', muted: '#59636e', accent: '#0f766e', warm: '#b45309', node: '#ffffff' },
};

const SANS = "'Segoe UI', -apple-system, Helvetica, Arial, sans-serif";
const MONO = "ui-monospace, SFMono-Regular, Consolas, 'Liberation Mono', monospace";

// Topologia: cada nó é uma área de atuação
const nos = [
  { id: 'infra', x: 860, y: 70, r: 26, label: 'Infra' },
  { id: 'redes', x: 1060, y: 92, r: 22, label: 'Redes' },
  { id: 'dados', x: 760, y: 190, r: 24, label: 'Dados' },
  { id: 'core', x: 950, y: 170, r: 34, label: 'mg', core: true },
  { id: 'auto', x: 1120, y: 210, r: 24, label: 'Automação' },
  { id: 'bi', x: 840, y: 280, r: 20, label: 'BI' },
  { id: 'web', x: 1030, y: 280, r: 22, label: 'Web' },
];
const ligacoes = [['core', 'infra'], ['core', 'redes'], ['core', 'dados'], ['core', 'auto'], ['core', 'web'], ['core', 'bi'], ['infra', 'redes'], ['dados', 'bi'], ['auto', 'web'], ['infra', 'dados'], ['redes', 'auto']];
const no = (id) => nos.find((n) => n.id === id);

const papeis = ['Infraestrutura &amp; Redes', 'Dados &amp; Business Intelligence', 'Automação &amp; Software', 'Sistemas que rodam em produção'];

function cabecalho(t) {
  const ciclo = papeis.length * 3; // 3 s por papel
  const arestas = ligacoes.map(([a, b], i) => {
    const A = no(a), B = no(b);
    const d = `M${A.x},${A.y} L${B.x},${B.y}`;
    const dur = (2.4 + (i % 4) * 0.7).toFixed(1);
    return `
    <path id="e${i}" d="${d}" stroke="${t.line}" stroke-width="1.5" fill="none"/>
    <circle r="3.2" fill="${i % 3 === 0 ? t.warm : t.accent}">
      <animateMotion dur="${dur}s" repeatCount="indefinite" begin="${(i * 0.37).toFixed(2)}s"${i % 2 ? ' keyPoints="1;0" keyTimes="0;1" calcMode="linear"' : ''}><mpath href="#e${i}"/></animateMotion>
    </circle>`;
  }).join('');

  const circulos = nos.map((n, i) => n.core ? `
    <circle cx="${n.x}" cy="${n.y}" r="${n.r + 10}" fill="none" stroke="${t.accent}" stroke-opacity=".35">
      <animate attributeName="r" values="${n.r + 4};${n.r + 22};${n.r + 4}" dur="3s" repeatCount="indefinite"/>
      <animate attributeName="stroke-opacity" values=".5;0;.5" dur="3s" repeatCount="indefinite"/>
    </circle>
    <circle cx="${n.x}" cy="${n.y}" r="${n.r}" fill="${t.accent}"/>
    <text x="${n.x}" y="${n.y + 7}" text-anchor="middle" font-family="${MONO}" font-size="20" font-weight="700" fill="${t.bg}">${n.label}</text>` : `
    <g>
      <circle cx="${n.x}" cy="${n.y}" r="${n.r}" fill="${t.node}" stroke="${t.line}" stroke-width="1.5"/>
      <circle cx="${n.x}" cy="${n.y}" r="5" fill="${i % 2 ? t.warm : t.accent}">
        <animate attributeName="opacity" values="1;.25;1" dur="${(1.6 + i * 0.3).toFixed(1)}s" repeatCount="indefinite"/>
      </circle>
      <text x="${n.x}" y="${n.y + n.r + 18}" text-anchor="middle" font-family="${MONO}" font-size="13" fill="${t.muted}">${n.label}</text>
    </g>`).join('');

  const textosPapel = papeis.map((p, i) => {
    // cada papel aparece por 3 s, com 0,3 s de transição (keyTimes podem se repetir nas pontas)
    const ini = (i * 3) / ciclo, fim = ((i + 1) * 3) / ciclo, e = 0.3 / ciclo;
    const kt = [0, ini, ini + e, fim - e, fim, 1].map((x) => +x.toFixed(4));
    return `<text x="64" y="212" font-family="${SANS}" font-size="26" font-weight="600" fill="${t.accent}" opacity="0">${p}<animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="${kt.join(';')}" dur="${ciclo}s" repeatCount="indefinite"/></text>`;
  }).join('\n    ');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 340" width="1200" height="340" role="img" aria-label="Matheus Gotardo — Infraestrutura, Dados e Automação">
  <title>Matheus Gotardo — Infraestrutura, Dados e Automação</title>
  <defs>
    <pattern id="grade" width="28" height="28" patternUnits="userSpaceOnUse">
      <circle cx="1" cy="1" r="1" fill="${t.line}"/>
    </pattern>
    <linearGradient id="fade" x1="0" x2="1">
      <stop offset="0" stop-color="${t.card}" stop-opacity="1"/>
      <stop offset=".55" stop-color="${t.card}" stop-opacity=".92"/>
      <stop offset="1" stop-color="${t.card}" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect x="1" y="1" width="1198" height="338" rx="16" fill="${t.card}" stroke="${t.line}"/>
  <rect x="1" y="1" width="1198" height="338" rx="16" fill="url(#grade)"/>
  <g>${arestas}
  </g>
  <g>${circulos}
  </g>
  <rect x="1" y="1" width="700" height="338" rx="16" fill="url(#fade)"/>

  <text x="64" y="84" font-family="${MONO}" font-size="16" fill="${t.muted}">~/gotardo <tspan fill="${t.accent}">$</tspan> whoami<tspan fill="${t.accent}">▌<animate attributeName="opacity" values="1;1;0;0" keyTimes="0;.5;.5;1" dur="1s" repeatCount="indefinite"/></tspan></text>
  <text x="62" y="152" font-family="${SANS}" font-size="56" font-weight="800" fill="${t.text}" letter-spacing="-1">Matheus Gotardo</text>
  ${textosPapel}
  <text x="64" y="262" font-family="${SANS}" font-size="17" fill="${t.muted}">Eu projeto, automatizo e mantenho no ar os sistemas</text>
  <text x="64" y="288" font-family="${SANS}" font-size="17" fill="${t.muted}">que fazem uma empresa funcionar no dia a dia.</text>
</svg>
`;
}

// Divisória fina animada entre seções
function divisoria(t) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 24" width="1200" height="24" aria-hidden="true">
  <line x1="0" y1="12" x2="1200" y2="12" stroke="${t.line}" stroke-width="1.5"/>
  <circle cy="12" r="4" fill="${t.accent}"><animate attributeName="cx" values="0;1200" dur="6s" repeatCount="indefinite"/></circle>
  <circle cy="12" r="3" fill="${t.warm}"><animate attributeName="cx" values="1200;0" dur="9s" repeatCount="indefinite"/></circle>
</svg>
`;
}

// Cabeçalhos dos READMEs de cada projeto (usados pelos outros repositórios)
const cores = {
  dark: { accent: '#2dd4bf', warm: '#f5b84b', violet: '#a78bfa', pink: '#f472b6', sky: '#38bdf8', stone: '#a8a29e' },
  light: { accent: '#0f766e', warm: '#b45309', violet: '#6d28d9', pink: '#be185d', sky: '#0369a1', stone: '#57534e' },
};
const projetos = [
  { slug: 'ocr-obras', repo: 'medicao-obras-ocr', icone: '🏗️', cor: 'violet', titulo: 'Medição de obras com OCR', sub: 'Do caderno de campo ao orçamento pela tabela SINAPI', stack: ['C++', 'Qt', 'Tesseract OCR', 'MySQL'] },
  { slug: 'ocr-obras-estudo', repo: 'medicao-obras-ocr-estudo', icone: '📑', cor: 'violet', titulo: 'Medição de obras com OCR: o estudo', sub: 'Problema, pesquisa de campo e engenharia da solução', stack: ['UML', 'Kanban', 'Plano de testes'] },
  { slug: 'bi-energia', repo: 'bi-eficiencia-energetica', icone: '☀️', cor: 'sky', titulo: 'BI e eficiência energética', sub: 'Energia solar numa planta industrial em Salvador/BA', stack: ['MySQL', 'Star Schema', 'Python', 'Power BI'] },
  { slug: 'recs', repo: 'sustentabilidade-energetica-recs', icone: '🌱', cor: 'sky', titulo: 'Sustentabilidade energética e RECs', sub: 'Dados para decidir pela energia renovável', stack: ['Python', 'MySQL', 'Power BI', 'ETL'] },
  { slug: 'trena', repo: 'trena-digital-ux-ml', icone: '📏', cor: 'sky', titulo: 'Trena digital com Machine Learning', sub: 'Medidas escritas à mão viram dados no relatório', stack: ['Python', 'scikit-learn', 'SVM', 'Figma'] },
  { slug: 'colina', repo: 'rede-supermercado-colina', icone: '🛒', cor: 'accent', titulo: 'Rede do Supermercado Colina', sub: 'Três unidades interligadas, com IPv6, serviços e IoT', stack: ['Cisco Packet Tracer', 'IPv6', 'IoT'] },
  { slug: 'grafo', repo: 'grafo-social', icone: '🕸️', cor: 'stone', titulo: 'Grafo Social', sub: 'A teoria dos grafos por trás do Facebook', stack: ['Python', 'NetworkX', 'TAO', 'GraphQL'] },
  { slug: 'o3de', repo: 'pong-o3de', icone: '🏓', cor: 'stone', titulo: 'Pong no Open 3D Engine', sub: 'Estudo do motor O3DE com um Pong em Python', stack: ['O3DE', 'Python', 'Gems'] },
  { slug: 'sequencia', repo: 'jogo-repita-a-sequencia', icone: '🧠', cor: 'violet', titulo: 'Repita a Sequência', sub: 'Jogo de memória com cores e sons, em C', stack: ['C', 'Windows', 'Console'] },
];

function cabecalhoProjeto(p, t, c) {
  const cor = c[p.cor];
  let x = 64;
  const chips = p.stack.map((s) => {
    const w = s.length * 8.4 + 24;
    const g = `<g><rect x="${x}" y="196" width="${w}" height="28" rx="14" fill="none" stroke="${t.line}"/><text x="${x + w / 2}" y="215" text-anchor="middle" font-family="${MONO}" font-size="14" fill="${t.muted}">${s}</text></g>`;
    x += w + 8;
    return g;
  }).join('');
  // mini-rede decorativa à direita
  const pts = [[970, 70], [1070, 58], [1150, 118], [1030, 150], [1120, 202], [950, 196]];
  const lig = [[0, 1], [1, 2], [0, 3], [3, 2], [3, 4], [3, 5], [2, 4]];
  const linhas = lig.map(([a, b], i) => `<path id="l${i}" d="M${pts[a][0]},${pts[a][1]} L${pts[b][0]},${pts[b][1]}" stroke="${t.line}" stroke-width="1.5"/>`).join('');
  const pacotes = lig.map((_, i) => `<circle r="3" fill="${i % 2 ? t.warm : cor}"><animateMotion dur="${(2.2 + (i % 3) * 0.6).toFixed(1)}s" begin="${(i * 0.3).toFixed(1)}s" repeatCount="indefinite"><mpath href="#l${i}"/></animateMotion></circle>`).join('');
  const nos = pts.map(([px, py], i) => `<circle cx="${px}" cy="${py}" r="${i === 3 ? 12 : 7}" fill="${i === 3 ? cor : t.node}" stroke="${i === 3 ? cor : t.line}" stroke-width="1.5">${i === 3 ? `<animate attributeName="r" values="11;14;11" dur="2.4s" repeatCount="indefinite"/>` : ''}</circle>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 260" width="1200" height="260" role="img" aria-label="${p.titulo}">
  <title>${p.titulo}</title>
  <defs>
    <pattern id="grade" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="${t.line}"/></pattern>
    <linearGradient id="fade" x1="0" x2="1"><stop offset="0" stop-color="${t.card}"/><stop offset=".6" stop-color="${t.card}" stop-opacity=".9"/><stop offset="1" stop-color="${t.card}" stop-opacity="0"/></linearGradient>
  </defs>
  <rect x="1" y="1" width="1198" height="258" rx="16" fill="${t.card}" stroke="${t.line}"/>
  <rect x="1" y="1" width="1198" height="258" rx="16" fill="url(#grade)"/>
  <g>${linhas}${pacotes}${nos}</g>
  <rect x="1" y="1" width="880" height="258" rx="16" fill="url(#fade)"/>
  <rect x="1" y="1" width="6" height="258" rx="3" fill="${cor}"/>
  <text x="64" y="62" font-family="${MONO}" font-size="15" fill="${t.muted}">GotardoN1 <tspan fill="${cor}">/</tspan> ${p.repo}</text>
  <text x="62" y="124" font-family="${SANS}" font-size="40" font-weight="800" fill="${t.text}" letter-spacing="-.5"><tspan>${p.icone}</tspan> ${p.titulo}</text>
  <text x="64" y="162" font-family="${SANS}" font-size="20" fill="${t.muted}">${p.sub}</text>
  ${chips}
</svg>
`;
}

mkdirSync('assets/projetos', { recursive: true });
for (const [nome, t] of Object.entries(temas)) {
  writeFileSync(`assets/cabecalho-${nome}.svg`, cabecalho(t));
  writeFileSync(`assets/divisoria-${nome}.svg`, divisoria(t));
  for (const p of projetos) writeFileSync(`assets/projetos/${p.slug}-${nome}.svg`, cabecalhoProjeto(p, t, cores[nome]));
}
console.log('SVGs gerados em assets/ e assets/projetos/');
