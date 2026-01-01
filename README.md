# Calímaco - Sistema de Catalogação de Livros

**Calímaco** é uma aplicação web moderna e intuitiva para catalogação e gerenciamento de bibliotecas pessoais. Desenvolvida especialmente para bibliófios, colecionadores e amantes de literatura, oferece uma solução completa para organização de livros e histórias em quadrinhos.

## 📚 Sobre o Projeto

O Calímaco permite que você:
- 📖 **Catalogue sua coleção**: Registre livros e HQs com detalhes completos (autor, editora, ano, ISBN, etc.)
- 🔍 **Pesquise facilmente**: Encontre rapidamente qualquer item com filtros inteligentes e busca avançada
- 📊 **Visualize estatísticas**: Acompanhe sua coleção através de gráficos interativos
- 📸 **Cadastro por foto**: Registre livros rapidamente tirando foto da capa (OCR em desenvolvimento)
- 🏷️ **Organize por categorias**: Classifique por gênero, autor, série, status de leitura e tags personalizadas
- ⚙️ **Parametrize o sistema**: Configure categorias, gêneros, editoras, autores e coleções

### Sobre o Nome

O projeto homenageia **Calímaco de Cirene** (310-240 a.C.), célebre bibliotecário da Biblioteca de Alexandria que criou os *Pinakes*, o primeiro catálogo bibliográfico sistemático da história. Assim como Calímaco organizou o conhecimento humano da antiguidade, este sistema ajuda você a organizar sua biblioteca pessoal.

## 🚀 Tecnologias Utilizadas

- **HTML5/CSS3**: Interface moderna com design responsivo
- **JavaScript (Vanilla)**: SPA com roteamento hash-based, sem frameworks pesados
- **Bootstrap 5**: Componentes e utilitários responsivos
- **Chart.js**: Gráficos interativos para visualização de dados
- **localStorage**: Persistência de dados no navegador
- **Nginx**: Servidor web local para desenvolvimento

## 📁 Estrutura do Projeto

```
/
├── index.html                 # Página principal SPA
├── start.bat                  # Script para iniciar servidor Nginx
├── stop.bat                   # Script para parar servidor Nginx
├── resources/
│   ├── main.css               # Estilos globais e tema
│   ├── main.js                # Roteamento SPA e lógica principal
│   └── bootstrap/             # Framework Bootstrap
├── features/
│   ├── authentication/        # Login, registro e recuperação de senha
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   └── pages/
│       ├── home/              # Dashboard com estatísticas e gráficos
│       ├── books-list/        # Listagem, filtros e gerenciamento de livros
│       ├── books-add/         # Formulário de cadastro/edição de livros
│       ├── books-scan/        # Cadastro por foto (OCR)
│       ├── settings/          # Parametrização (5 abas: categorias, gêneros, etc.)
│       ├── about/             # Sobre o sistema e guia de uso
│       └── contact/           # Formulário de contato
└── server/
    ├── nginx/                 # Servidor Nginx 1.25.3
    └── docker/                # Configuração Docker (opcional)
```

## 🎯 Funcionalidades Principais

### Dashboard Interativo
- Cards com resumo: total de livros, lidos, lendo e a ler
- Gráficos Chart.js com 8 visualizações diferentes (barras, pizza, linha, rosca)
- Análise por gênero, autor, editora, categoria e ano de publicação
- Acesso rápido aos últimos livros cadastrados

### Gestão de Livros
- **Cadastro completo**: Informações básicas, detalhes físicos, classificação e observações
- **Listagem em cards**: Visual moderno com capa, título, autor e editora
- **Filtros avançados**: Por categoria, gênero e status de leitura
- **Busca**: Pesquisa por título, autor ou editora
- **Modal de detalhes**: Visualização completa com opções de editar/excluir
- **Cadastro por foto**: Interface drag-drop para upload de imagens (OCR em desenvolvimento)

### Sistema de Parametrização
5 abas para gerenciar dados mestres:
- Categorias (Livros, HQs, Mangás, Revistas)
- Gêneros (Ficção, Romance, Suspense, etc.)
- Editoras
- Autores
- Coleções (Harry Potter, Marvel, DC Comics)

Cada aba possui CRUD completo com validações.

## 💻 Como Executar

### Opção 1: Windows (Nginx Local)
1. Execute `start.bat` (como administrador se necessário).
2. Abra o navegador e acesse `http://localhost:8080`.
3. Para parar o servidor, execute `stop.bat`.

### Opção 2: Linux (Nginx Local)
**Nota**: O binário do Nginx incluído é para Windows. Para Linux, instale o Nginx separadamente.

1. Instale o Nginx:
   - Ubuntu/Debian: `sudo apt update && sudo apt install nginx`
   - CentOS/RHEL: `sudo yum install nginx` ou `sudo dnf install nginx`
   - Arch: `sudo pacman -S nginx`
2. Copie `server/nginx/nginx-1.25.3/conf/nginx.conf` para `/etc/nginx/nginx.conf` (ou o diretório de config do seu sistema).
3. Edite o arquivo copiado e mude `root c:/Workspace/frontend/blank;` para o caminho absoluto do projeto no Linux, ex.: `root /home/usuario/projeto;`.
4. Reinicie o Nginx: `sudo systemctl restart nginx` ou `sudo nginx -s reload`.
5. Abra o navegador e acesse `http://localhost` (porta 80).
6. Para parar: `sudo systemctl stop nginx` ou `sudo nginx -s stop`.

### Opção 3: Linux/Mac/Windows (Docker)
1. Instale o Docker e Docker Compose.
2. Navegue para `server/docker/` e execute `./start.sh` (Linux/Mac) ou `docker-compose up --build`.
3. Abra o navegador e acesse `http://localhost:8080`.
4. Para parar, execute `./stop.sh` ou `docker-compose down`.

**Nota**: A opção Docker permite rodar em qualquer sistema operacional com Docker instalado.

## Configuração para Diretório Diferente

Se o projeto for movido para um diretório diferente:

1. Abra o arquivo `server/nginx/nginx-1.25.3/conf/nginx.conf`.
2. Localize a linha com o caminho `root`.
3. Substitua pelo novo caminho absoluto do diretório raiz do projeto.
4. Salve o arquivo e execute `start.bat` novamente.

**Nota**: Use barras `/` e caminhos absolutos. Se houver espaços, envolva em aspas duplas.

## 🛠️ Desenvolvimento

### Estrutura de Cada Funcionalidade
Cada página/funcionalidade possui três arquivos:
- `*.html` - Estrutura da página
- `*.css` - Estilos específicos
- `*.js` - Lógica e interações

### Adicionando Novas Páginas
1. Crie uma nova pasta em `features/pages/` com os três arquivos
2. Atualize o roteamento em `resources/main.js`
3. Adicione link no menu em `index.html` (se necessário)

### Persistência de Dados
O sistema utiliza **localStorage** para armazenar:
- `calimaco_books` - Livros cadastrados
- `calimaco_categories` - Categorias
- `calimaco_genres` - Gêneros
- `calimaco_publishers` - Editoras
- `calimaco_authors` - Autores
- `calimaco_collections` - Coleções

**Importante**: Os dados ficam salvos no navegador. Para produção, implemente backend com banco de dados.

## 🎨 Design

- **Tema**: Gradiente roxo (#667eea → #764ba2)
- **Estilo**: Modern glassmorphism com cards elevados
- **Responsivo**: Mobile-first, otimizado para celular e desktop
- **Animações**: Transições suaves e hover effects
- **Ícones**: Bootstrap Icons (SVG inline)

## 📝 Roadmap

- [ ] Integração com backend (API REST)
- [ ] Sistema de autenticação real (JWT)
- [ ] Implementação completa do OCR para cadastro por foto
- [ ] Controle de empréstimos
- [ ] Lista de desejos
- [ ] Exportação/importação de dados (CSV, JSON)
- [ ] Sistema de avaliação e resenhas
- [ ] PWA (Progressive Web App)
- [ ] Modo escuro
- [ ] Múltiplos idiomas

## 📄 Licença

Este projeto está sob licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👤 Autor

Desenvolvido com 💜 por bibliófios, para bibliófios.

---

**Calímaco** - *Organizando bibliotecas desde a Antiguidade até hoje* 📚