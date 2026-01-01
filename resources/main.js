// Main JS - SPA Router
const content = document.getElementById('content');
const nav = document.querySelector('nav');
const footer = document.querySelector('footer');
const loadingSpinner = document.getElementById('loadingSpinner');

console.log('Content element:', content);
console.log('Nav element:', nav);

let currentCssLink = null;
let currentScript = null;

function showLoading() {
    if (loadingSpinner) {
        loadingSpinner.classList.add('active');
    }
}

function hideLoading() {
    if (loadingSpinner) {
        loadingSpinner.classList.remove('active');
    }
}

function loadPage(page) {
    // Verificar autenticação para páginas protegidas
    const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
    console.log('Loading page:', page, 'isLoggedIn:', isLoggedIn);
    
    if (!['login', 'register', 'forgot-password'].includes(page) && !isLoggedIn) {
        console.log('Redirecting to login');
        window.location.hash = 'login';
        return;
    }

    showLoading();

    let path = 'features/pages/';
    if (['login', 'register', 'forgot-password'].includes(page)) {
        path = 'features/authentication/';
    }
    
    fetch(`${path}${page}/${page}.html`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            content.innerHTML = html;
           
            // Remove CSS da pagina anterior para não gerar conflito
            if (currentCssLink) {
                document.head.removeChild(currentCssLink);
            }
            
            // Carrega CSS da pagina 
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = `${path}${page}/${page}.css`;
            link.onerror = () => {
                console.warn(`CSS file not found: ${link.href}`);
            };
            document.head.appendChild(link);
            currentCssLink = link;
            
            
            // Remove js da pagina anterior para não gerar conflito
            if (currentScript) {
                document.body.removeChild(currentScript);
            }
            
            // Carrega js da pagina 
            const script = document.createElement('script');
            script.src = `${path}${page}/${page}.js`;
            script.onerror = () => {
                console.warn(`JS file not found: ${script.src}`);
            };
            document.body.appendChild(script);
            currentScript = script;
            
            // Controlar visibilidade do menu e footer
            if (['login', 'register', 'forgot-password'].includes(page)) {
                nav.style.display = 'none';
                footer.style.display = 'none';
            } else {
                nav.style.display = 'block';
                footer.style.display = 'block';
            }
            
            hideLoading();
        })
        .catch(error => {
            console.error('Error loading page:', error);
            
            // Tentar carregar página 404
            if (page !== '404') {
                loadPage('404');
            } else {
                content.innerHTML = '<div class="error-container text-center"><h1>Erro ao carregar página</h1><p>Ocorreu um erro inesperado. Por favor, tente novamente.</p></div>';
                hideLoading();
            }
        });
}

// Executa funcao quando URL é altearada
window.addEventListener('hashchange', () => {
    const page = location.hash.substring(1) || 'login';
    loadPage(page);
});

// Verifica autenticacao a partir do localStorage no carregamento da pagina
const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
loadPage(isLoggedIn ? 'home' : 'login');

/*
* -----------------------------------------------------------------
*           FUNCOES GLOBAIS DO SISTEMA
* -----------------------------------------------------------------
*/

/**
 * Funcao de Logout
 */
document.addEventListener('click', function(e) {
    if (e.target.id === 'logoutLink') {
        e.preventDefault();
        localStorage.removeItem('loggedIn');
        localStorage.removeItem('username');
        nav.style.display = 'none';
        footer.style.display = 'none';
        window.location.hash = 'login';
    }
});