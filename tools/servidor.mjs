// Prévia local: node tools/servidor.mjs  →  http://localhost:5310
//   /         o site (index.html)
//   /readme   o README.md renderizado pela API de Markdown do GitHub
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = fileURLToPath(new URL('..', import.meta.url));
const porta = Number(process.env.PORT) || 5310;
const tipos = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon', '.json': 'application/json', '.md': 'text/plain; charset=utf-8', '.webmanifest': 'application/manifest+json' };

async function readme() {
  const md = await readFile(join(raiz, 'README.md'), 'utf8');
  const r = await fetch('https://api.github.com/markdown', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/vnd.github+json' },
    body: JSON.stringify({ text: md, mode: 'markdown' }),
  });
  const corpo = await r.text();
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Prévia do README</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/github-markdown-css@5/github-markdown.min.css">
<style>body{margin:0;background:#fff}@media (prefers-color-scheme:dark){body{background:#0d1117}}.markdown-body{max-width:1012px;margin:0 auto;padding:32px 16px}</style>
</head><body><article class="markdown-body">${corpo}</article></body></html>`;
}

createServer(async (req, res) => {
  try {
    const caminho = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (caminho === '/readme') {
      res.writeHead(200, { 'Content-Type': tipos['.html'] });
      return res.end(await readme());
    }
    const arquivo = normalize(join(raiz, caminho.endsWith('/') ? caminho + 'index.html' : caminho));
    if (!arquivo.startsWith(normalize(raiz))) throw new Error('fora da raiz');
    const dados = await readFile(arquivo);
    res.writeHead(200, { 'Content-Type': tipos[extname(arquivo)] ?? 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(dados);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Não encontrado');
  }
}).listen(porta, () => console.log(`Prévia em http://localhost:${porta}`));
