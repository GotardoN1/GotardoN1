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

mkdirSync('assets', { recursive: true });
for (const [nome, t] of Object.entries(temas)) {
  writeFileSync(`assets/cabecalho-${nome}.svg`, cabecalho(t));
  writeFileSync(`assets/divisoria-${nome}.svg`, divisoria(t));
}
console.log('SVGs gerados em assets/');
