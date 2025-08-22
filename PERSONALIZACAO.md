# Guia de Personalização do Site

## 🎨 Alterando Cores

### Paleta Atual:
- **Preto:** `#000000` - Textos principais, fundos de destaque
- **Branco:** `#ffffff` - Fundo principal, textos em fundos escuros
- **Cinza Claro:** `#f8f8f8` - Fundos de seções alternadas
- **Cinza Médio:** `#666666` - Textos secundários
- **Cinza Escuro:** `#333333` - Bordas, elementos sutis

### Como Alterar:
1. Abra o arquivo `css/style.css`
2. Use Ctrl+F (ou Cmd+F) para buscar a cor que deseja alterar
3. Substitua pelos códigos hexadecimais das suas cores preferidas

### Sugestões de Paletas Alternativas:

**Azul Profissional:**
- Preto → `#1a365d` (azul escuro)
- Cinza escuro → `#2d3748`
- Cinza médio → `#4a5568`

**Verde Tecnológico:**
- Preto → `#1a202c`
- Destaque → `#38a169` (verde)
- Cinza escuro → `#2d3748`

## 📝 Editando Conteúdo

### Informações Pessoais:
**Arquivo:** `index.html`

**Seção Hero (Topo):**
```html
<h1 class="hero-title">SEU NOME AQUI</h1>
<p class="hero-subtitle">SUA PROFISSÃO AQUI</p>
<p class="hero-description">
    SUA DESCRIÇÃO PESSOAL AQUI
</p>
```

**Seção Sobre:**
- Edite os parágrafos com sua biografia
- Atualize as habilidades nos cards

**Seção Projetos:**
- Substitua os projetos de exemplo pelos seus
- Atualize títulos, descrições e tecnologias

**Seção Experiência:**
- Adicione suas experiências profissionais
- Mantenha a estrutura da timeline

### Adicionando Novos Projetos:

```html
<div class="project-card">
    <div class="project-image">
        <img src="images/projects/seu-projeto.jpg" alt="Seu Projeto">
    </div>
    <div class="project-content">
        <h3>Nome do Projeto</h3>
        <p>Descrição do projeto...</p>
        <div class="project-tech">
            <span class="tech-tag">Tecnologia 1</span>
            <span class="tech-tag">Tecnologia 2</span>
        </div>
    </div>
</div>
```

## 📸 Adicionando Imagens

### Estrutura de Pastas:
```
images/
├── profile.jpg          # Sua foto de perfil
├── projects/            # Imagens dos projetos
│   ├── projeto1.jpg
│   ├── projeto2.png
│   └── projeto3.gif
└── icons/              # Ícones personalizados (opcional)
```

### Formatos Recomendados:
- **Fotos:** JPG (menor tamanho)
- **Imagens com transparência:** PNG
- **Demonstrações:** GIF (animações curtas)

### Tamanhos Recomendados:
- **Foto de perfil:** 400x400px
- **Projetos:** 600x400px
- **Máximo:** 1MB por imagem

## 🔗 Links e Contatos

### Atualizando Links de Contato:
**Arquivo:** `index.html` (seção contato)

```html
<a href="mailto:SEU-EMAIL@email.com" class="contact-link">
    <span class="contact-icon">✉️</span>
    SEU-EMAIL@email.com
</a>
<a href="https://linkedin.com/in/SEU-PERFIL" class="contact-link" target="_blank">
    <span class="contact-icon">💼</span>
    LinkedIn
</a>
<a href="https://github.com/SEU-USUARIO" class="contact-link" target="_blank">
    <span class="contact-icon">💻</span>
    GitHub
</a>
```

### Adicionando Novos Links:
- Instagram: `📷`
- Twitter: `🐦`
- YouTube: `📺`
- Portfolio: `🎨`

## 🎯 SEO e Performance

### Meta Tags (no `<head>`):
```html
<meta name="description" content="Sua descrição profissional aqui">
<meta name="keywords" content="suas, palavras, chave, aqui">
<meta name="author" content="Seu Nome">

<!-- Open Graph (redes sociais) -->
<meta property="og:title" content="Seu Nome - Sua Profissão">
<meta property="og:description" content="Sua descrição">
<meta property="og:image" content="https://seu-site.github.io/images/profile.jpg">
<meta property="og:url" content="https://seu-site.github.io">
```

### Otimização de Imagens:
1. **Comprima imagens** antes de fazer upload
2. **Use ferramentas online:** TinyPNG, Squoosh
3. **Formatos modernos:** WebP (se suportado)

## 📱 Responsividade

### Testando em Diferentes Dispositivos:
1. **Chrome DevTools:** F12 → Toggle device toolbar
2. **Teste em:** iPhone, iPad, Desktop
3. **Verifique:** Menu mobile, botões, textos

### Ajustando Breakpoints:
**Arquivo:** `css/style.css`

```css
/* Tablet */
@media (max-width: 1024px) {
    /* Estilos para tablet */
}

/* Mobile */
@media (max-width: 768px) {
    /* Estilos para mobile */
}

/* Mobile pequeno */
@media (max-width: 480px) {
    /* Estilos para telas pequenas */
}
```

## 🚀 Funcionalidades Avançadas

### Google Analytics:
1. Crie conta no Google Analytics
2. Adicione o código de tracking no `<head>`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID');
</script>
```

### Formulário de Contato Funcional:
**Formspree (Gratuito):**
1. Cadastre-se em formspree.io
2. Substitua a tag form:
```html
<form action="https://formspree.io/f/SEU_ID" method="POST" class="contact-form">
```

### Blog (Opcional):
1. Crie pasta `blog/`
2. Adicione páginas HTML para posts
3. Atualize navegação para incluir "Blog"

## 🔄 Manutenção Regular

### Checklist Mensal:
- [ ] Atualizar projetos recentes
- [ ] Verificar links quebrados
- [ ] Atualizar experiências profissionais
- [ ] Revisar informações de contato
- [ ] Verificar performance do site

### Backup:
- Mantenha cópia local dos arquivos
- Use Git para controle de versão
- Considere fazer fork do repositório

## 🆘 Problemas Comuns

### Site não atualiza:
1. Limpe cache do navegador (Ctrl+F5)
2. Aguarde alguns minutos
3. Verifique se o commit foi feito corretamente

### Layout quebrado:
1. Verifique erros no console (F12)
2. Valide HTML e CSS
3. Teste em navegador diferente

### Imagens não carregam:
1. Verifique caminhos das imagens
2. Confirme se arquivos foram enviados
3. Verifique nomes dos arquivos (case-sensitive)

---

**💡 Dica:** Faça alterações pequenas e teste frequentemente para identificar problemas rapidamente!

