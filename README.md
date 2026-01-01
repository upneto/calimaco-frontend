# Frontend SPA Project

Este é um projeto de aplicação web de página única (SPA) desenvolvida com tecnologias puras: HTML, CSS e JavaScript. Utiliza Bootstrap para estilização e Nginx como servidor local.

## Tecnologias Utilizadas

- **HTML**: Estrutura das páginas.
- **CSS**: Estilização personalizada.
- **JavaScript**: Lógica da aplicação, incluindo roteamento SPA.
- **Bootstrap**: Framework CSS para componentes responsivos e utilitários.
- **Nginx**: Servidor web para hospedar a aplicação localmente.

## Estrutura do Projeto

```
/
├── index.html                 # Página principal da aplicação
├── start.bat                  # Script para iniciar o servidor Nginx
├── stop.bat                   # Script para parar o servidor Nginx
├── resources/
│   ├── main.css               # Estilos globais
│   ├── main.js                # Lógica principal e roteamento SPA
│   ├── bootstrap/             # Arquivos do Bootstrap
│   │   ├── bootstrap.min.css
│   │   └── bootstrap.bundle.min.js
│   └── nginx/                 # Servidor Nginx
│       └── nginx-1.25.3/
│           ├── nginx.exe
│           └── conf/
│               └── nginx.conf # Configuração do Nginx
└── features/                  # Funcionalidades/telas da aplicação
    ├── home/
    │   ├── home.html
    │   ├── home.css
    │   └── home.js
    ├── about/
    │   ├── about.html
    │   ├── about.css
    │   └── about.js
    └── contact/
        ├── contact.html
        ├── contact.css
        └── contact.js
```

## Como Executar

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

1. Abra o arquivo `resources/nginx/nginx-1.25.3/conf/nginx.conf`.
2. Localize a linha `root   c:/Workspace/frontend/blank;`.
3. Substitua pelo novo caminho absoluto do diretório raiz do projeto (ex.: `root   c:/Novo/Caminho/Para/Projeto;`).
4. Salve o arquivo.
5. Execute `start.bat` novamente.

**Nota**: O caminho deve usar barras `/` e ser absoluto. Se houver espaços no caminho, envolva em aspas duplas no arquivo de configuração.

## Desenvolvimento

- Cada funcionalidade tem seus próprios arquivos HTML, CSS e JS em `features/`.
- O Bootstrap é carregado globalmente, então pode ser usado em qualquer arquivo.
- Para adicionar novas páginas, crie uma nova pasta em `features/` com os três arquivos e atualize a navegação em `index.html`.
- As páginas de autenticação (login, register, forgot-password) não aparecem no menu principal.
- Autenticação simulada com localStorage (substitua por backend real).

## Requisitos

- Windows (o Nginx é específico para Windows).
- Permissões para executar executáveis (pode requerer execução como administrador).

Se houver problemas, verifique o console do navegador para erros ou logs do Nginx.