# Guia Completo: Como Hospedar seu Site no GitHub Pages

## 📋 Pré-requisitos

- Conta no GitHub (gratuita)
- Arquivos do site prontos (você já tem!)
- Navegador web

## 🚀 Passo a Passo Detalhado

### 1. Criar Conta no GitHub (se não tiver)

1. Acesse [github.com](https://github.com)
2. Clique em "Sign up"
3. Preencha os dados e confirme o email

### 2. Criar Repositório

1. **Faça login no GitHub**
2. **Clique no botão verde "New"** (ou ícone "+" no canto superior direito)
3. **Nome do repositório:** `seu-usuario.github.io`
   - ⚠️ **IMPORTANTE:** Substitua "seu-usuario" pelo seu username exato do GitHub
   - Exemplo: se seu username é "matheusgotardo", o repositório deve ser "matheusgotardo.github.io"
4. **Configurações:**
   - ✅ Marque como "Public"
   - ❌ NÃO marque "Add a README file"
   - ❌ NÃO adicione .gitignore
   - ❌ NÃO escolha licença
5. **Clique em "Create repository"**

### 3. Fazer Upload dos Arquivos

**Opção A - Interface Web (Mais Fácil):**

1. **Na página do repositório criado**, você verá uma tela com instruções
2. **Clique em "uploading an existing file"**
3. **Arraste TODOS os arquivos do seu site:**
   - `index.html`
   - Pasta `css/` (com o arquivo `style.css` dentro)
   - Pasta `js/` (com o arquivo `script.js` dentro)
   - Pasta `images/` (vazia por enquanto, mas pode adicionar suas fotos depois)
   - `README.md`
4. **Adicione uma mensagem de commit:** "Adicionar site pessoal inicial"
5. **Clique em "Commit changes"**

**Opção B - Git (Para usuários avançados):**

```bash
# Clone o repositório
git clone https://github.com/SEU-USUARIO/SEU-USUARIO.github.io.git
cd SEU-USUARIO.github.io

# Copie todos os arquivos do site para esta pasta
# Depois execute:
git add .
git commit -m "Adicionar site pessoal inicial"
git push origin main
```

### 4. Configurar GitHub Pages

1. **No seu repositório**, clique na aba "Settings"
2. **Role para baixo** até encontrar a seção "Pages" (no menu lateral esquerdo)
3. **Em "Source"**, selecione "Deploy from a branch"
4. **Em "Branch"**, selecione "main" (ou "master" se for o caso)
5. **Em "Folder"**, deixe "/ (root)"
6. **Clique em "Save"**

### 5. Aguardar e Acessar

1. **Aguarde 5-10 minutos** para o GitHub processar
2. **Seu site estará disponível em:** `https://seu-usuario.github.io`
3. **O GitHub mostrará o link** na seção Pages após o processamento

## 🔄 Como Atualizar o Site

### Método 1 - Interface Web:
1. Acesse seu repositório no GitHub
2. Clique no arquivo que deseja editar (ex: `index.html`)
3. Clique no ícone de lápis (Edit)
4. Faça as alterações
5. Role para baixo, adicione uma mensagem de commit
6. Clique em "Commit changes"

### Método 2 - Upload de Novos Arquivos:
1. Clique em "Add file" > "Upload files"
2. Arraste os arquivos atualizados
3. Commit as mudanças

## 🎨 Personalizações Recomendadas

### Adicionar sua Foto de Perfil:
1. Adicione uma foto chamada `profile.jpg` na pasta `images/`
2. Edite o `index.html` e adicione na seção "Sobre":
```html
<div class="about-image">
    <img src="images/profile.jpg" alt="Matheus Gotardo" class="profile-photo">
</div>
```

### Adicionar Imagens dos Projetos:
1. Adicione imagens na pasta `images/projects/`
2. Substitua os emojis nos cards de projeto por:
```html
<img src="images/projects/nome-do-projeto.jpg" alt="Nome do Projeto">
```

### Atualizar Links de Contato:
1. Edite o `index.html`
2. Substitua os links de exemplo pelos seus reais:
   - Email real
   - LinkedIn real
   - GitHub real

## 🔧 Configurar Formulário de Contato

O formulário atual é apenas visual. Para funcionar:

### Opção 1 - Formspree (Recomendado):
1. Acesse [formspree.io](https://formspree.io)
2. Crie conta gratuita
3. Crie um novo form
4. Substitua a tag `<form>` no seu HTML por:
```html
<form action="https://formspree.io/f/SEU_ID_AQUI" method="POST" class="contact-form">
```

### Opção 2 - Netlify (Alternativa):
1. Mova seu site para o Netlify
2. Adicione `netlify` na tag form:
```html
<form netlify class="contact-form">
```

## 📱 Domínio Personalizado (Opcional)

Se quiser usar um domínio próprio (ex: matheusgotardo.com):

1. **Compre um domínio** (Registro.br, GoDaddy, Namecheap)
2. **No GitHub**, vá em Settings > Pages
3. **Em "Custom domain"**, digite seu domínio
4. **Configure o DNS** do seu domínio para apontar para o GitHub:
   - Tipo: CNAME
   - Nome: www
   - Valor: seu-usuario.github.io

## 🆘 Solução de Problemas

### Site não carrega:
- Verifique se o nome do repositório está correto
- Aguarde até 10 minutos após fazer upload
- Verifique se o arquivo se chama exatamente `index.html`

### Imagens não aparecem:
- Verifique os caminhos das imagens no HTML
- Certifique-se que as imagens foram enviadas para o repositório

### CSS não funciona:
- Verifique se a pasta `css` foi enviada
- Verifique o caminho no HTML: `<link rel="stylesheet" href="css/style.css">`

## 📞 Suporte

- **Documentação oficial:** [docs.github.com/pages](https://docs.github.com/pages)
- **Comunidade GitHub:** [github.community](https://github.community)

---

**🎉 Parabéns! Seu site pessoal está no ar!**

Compartilhe o link `https://seu-usuario.github.io` com seus contatos e nas suas redes sociais.

