# Site Pessoal - Matheus Gotardo

Site pessoal minimalista desenvolvido para apresentação profissional, focado em projetos e atividades nas áreas de tecnologia e jogos digitais.

## 🎨 Design

- **Estilo:** Minimalista com contraste em preto, cinza e branco
- **Responsivo:** Adaptado para desktop, tablet e mobile
- **Tipografia:** Inter (Google Fonts)
- **Animações:** Transições suaves e efeitos de scroll

## 📋 Seções

1. **Hero:** Apresentação principal com nome e profissões
2. **Sobre:** Biografia e habilidades principais
3. **Projetos:** Portfolio de projetos em análise de dados e jornalismo
4. **Experiência:** Timeline profissional
5. **Contato:** Formulário e links de contato

## 🚀 Como hospedar no GitHub Pages

### 1. Criar repositório no GitHub

1. Acesse [GitHub](https://github.com) e faça login
2. Clique em "New repository"
3. Nome do repositório: `seu-usuario.github.io` (substitua "seu-usuario" pelo seu username)
4. Marque como "Public"
5. Clique em "Create repository"

### 2. Fazer upload dos arquivos

**Opção A - Via interface web:**
1. No repositório criado, clique em "uploading an existing file"
2. Arraste todos os arquivos do site (index.html, css/, js/, images/)
3. Adicione uma mensagem de commit: "Adicionar site pessoal"
4. Clique em "Commit changes"

**Opção B - Via Git (linha de comando):**
```bash
git clone https://github.com/seu-usuario/seu-usuario.github.io.git
cd seu-usuario.github.io
# Copie todos os arquivos do site para esta pasta
git add .
git commit -m "Adicionar site pessoal"
git push origin main
```

### 3. Configurar GitHub Pages

1. No repositório, vá em "Settings"
2. Role até a seção "Pages"
3. Em "Source", selecione "Deploy from a branch"
4. Em "Branch", selecione "main" e "/ (root)"
5. Clique em "Save"

### 4. Acessar o site

Após alguns minutos, seu site estará disponível em:
`https://seu-usuario.github.io`

## 🛠️ Personalização

### Alterar informações pessoais

Edite o arquivo `index.html` e modifique:
- Nome e título na seção hero
- Biografia na seção sobre
- Projetos na seção projetos
- Experiências na seção experiência
- Informações de contato

### Alterar cores

Edite o arquivo `css/style.css` e modifique as variáveis de cor:
- `#000` - Preto
- `#fff` - Branco
- `#f8f8f8` - Cinza claro
- `#666` - Cinza médio
- `#333` - Cinza escuro

### Adicionar imagens

1. Coloque suas imagens na pasta `images/`
2. Para foto de perfil: `images/profile.jpg`
3. Para projetos: `images/projects/nome-do-projeto.jpg`
4. Atualize os caminhos no HTML

### Configurar formulário de contato

O formulário atual é apenas demonstrativo. Para funcionar, você pode usar:

**Formspree (Recomendado):**
1. Acesse [Formspree](https://formspree.io)
2. Crie uma conta gratuita
3. Substitua a tag `<form>` por:
```html
<form action="https://formspree.io/f/SEU_ID" method="POST" class="contact-form">
```

**Netlify Forms:**
1. Hospede o site no Netlify
2. Adicione `netlify` ao atributo da tag form:
```html
<form netlify class="contact-form">
```

## 📱 Recursos

- ✅ Design responsivo
- ✅ Navegação suave
- ✅ Menu mobile
- ✅ Animações de scroll
- ✅ Efeito de digitação
- ✅ Formulário de contato
- ✅ SEO básico

## 🔧 Tecnologias

- HTML5
- CSS3 (Flexbox, Grid, Animations)
- JavaScript (ES6+)
- Google Fonts

## 📄 Licença

Este projeto está sob a licença MIT. Sinta-se livre para usar e modificar.

---

**Desenvolvido por Matheus Gotardo**

