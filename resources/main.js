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
                nav.classList.remove('visible');
                footer.classList.remove('visible');
            } else {
                nav.classList.add('visible');
                footer.classList.add('visible');
                updateActiveNavLink(page);
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
 * Atualizar link ativo no menu
 */
function updateActiveNavLink(page) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === `#${page}`) {
            link.classList.add('active');
        }
    });
}

/**
 * Funcao de Logout
 */
document.addEventListener('click', function(e) {
    if (e.target.id === 'logoutLink' || e.target.closest('#logoutLink')) {
        e.preventDefault();
        localStorage.removeItem('loggedIn');
        localStorage.removeItem('username');
        nav.classList.remove('visible');
        footer.classList.remove('visible');
        window.location.hash = 'login';
    }
});

/**
 * Dropdown Menu Toggle
 */
function initDropdowns() {
    console.log('Initializing dropdowns...');
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    console.log('Found dropdowns:', dropdownToggles.length);
    
    dropdownToggles.forEach((toggle, index) => {
        console.log('Setting up dropdown', index);
        // Remove old listeners by cloning
        const newToggle = toggle.cloneNode(true);
        toggle.parentNode.replaceChild(newToggle, toggle);
        
        newToggle.addEventListener('click', function(e) {
            console.log('Dropdown clicked!');
            e.preventDefault();
            e.stopPropagation();
            const dropdown = this.parentElement;
            
            // Close other dropdowns
            document.querySelectorAll('.nav-dropdown').forEach(dd => {
                if (dd !== dropdown) {
                    dd.classList.remove('active');
                }
            });
            
            // Toggle current dropdown
            const isActive = dropdown.classList.contains('active');
            dropdown.classList.toggle('active');
            console.log('Dropdown toggled, now active:', !isActive);
        });
    });
    
    // Close dropdown when clicking on menu item
    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', function(e) {
            console.log('Dropdown item clicked');
            document.querySelectorAll('.nav-dropdown').forEach(dd => {
                dd.classList.remove('active');
            });
        });
    });
}

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
    if (!e.target.closest('.nav-dropdown')) {
        const dropdowns = document.querySelectorAll('.nav-dropdown.active');
        if (dropdowns.length > 0) {
            console.log('Closing dropdowns from outside click');
            dropdowns.forEach(dd => {
                dd.classList.remove('active');
            });
        }
    }
});

// Initialize dropdowns
setTimeout(() => {
    console.log('Running initial dropdown setup');
    initDropdowns();
}, 500);

// Re-initialize after navigation
window.addEventListener('hashchange', function() {
    console.log('Hash changed, re-initializing dropdowns');
    setTimeout(initDropdowns, 200);
});