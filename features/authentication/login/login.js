// Login JS
const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginAlert = document.getElementById('loginAlert');

function showAlert(message, type = 'danger') {
    loginAlert.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
    setTimeout(() => {
        loginAlert.innerHTML = '';
    }, 5000);
}

function validateField(input) {
    if (input.validity.valid) {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
        return true;
    } else {
        input.classList.remove('is-valid');
        input.classList.add('is-invalid');
        return false;
    }
}

// Validação em tempo real
usernameInput.addEventListener('input', () => validateField(usernameInput));
passwordInput.addEventListener('input', () => validateField(passwordInput));

loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const isUsernameValid = validateField(usernameInput);
    const isPasswordValid = validateField(passwordInput);
    
    if (!isUsernameValid || !isPasswordValid) {
        showAlert('Por favor, corrija os erros no formulário.', 'danger');
        return;
    }
    
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    
    // Simulação de autenticação (substitua por chamada real para backend)
    if (username && password) {
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('username', username);
        showAlert('Login realizado com sucesso!', 'success');
        setTimeout(() => {
            window.location.hash = 'home';
        }, 1000);
    } else {
        showAlert('Usuário e senha obrigatórios', 'danger');
    }
});
