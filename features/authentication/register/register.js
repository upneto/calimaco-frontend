// Register JS
const registerForm = document.getElementById('registerForm');
const regUsernameInput = document.getElementById('regUsername');
const regEmailInput = document.getElementById('regEmail');
const regPasswordInput = document.getElementById('regPassword');
const regConfirmPasswordInput = document.getElementById('regConfirmPassword');
const registerAlert = document.getElementById('registerAlert');

function showAlert(message, type = 'danger') {
    registerAlert.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
    setTimeout(() => {
        registerAlert.innerHTML = '';
    }, 5000);
}

function validateField(input) {
    if (input.id === 'regConfirmPassword') {
        const password = regPasswordInput.value;
        const confirmPassword = input.value;
        
        if (confirmPassword && password !== confirmPassword) {
            input.setCustomValidity('As senhas não coincidem');
        } else {
            input.setCustomValidity('');
        }
    }
    
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
regUsernameInput.addEventListener('input', () => validateField(regUsernameInput));
regEmailInput.addEventListener('input', () => validateField(regEmailInput));
regPasswordInput.addEventListener('input', () => {
    validateField(regPasswordInput);
    if (regConfirmPasswordInput.value) {
        validateField(regConfirmPasswordInput);
    }
});
regConfirmPasswordInput.addEventListener('input', () => validateField(regConfirmPasswordInput));

registerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const isUsernameValid = validateField(regUsernameInput);
    const isEmailValid = validateField(regEmailInput);
    const isPasswordValid = validateField(regPasswordInput);
    const isConfirmPasswordValid = validateField(regConfirmPasswordInput);
    
    if (!isUsernameValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
        showAlert('Por favor, corrija os erros no formulário.', 'danger');
        return;
    }
    
    const username = regUsernameInput.value.trim();
    const email = regEmailInput.value.trim();
    const password = regPasswordInput.value;
    const confirmPassword = regConfirmPasswordInput.value;
    
    if (password !== confirmPassword) {
        showAlert('As senhas não coincidem', 'danger');
        return;
    }
    
    // Simulação de cadastro (substitua por chamada real para backend)
    showAlert('Usuário cadastrado com sucesso! Redirecionando para login...', 'success');
    setTimeout(() => {
        window.location.hash = 'login';
    }, 2000);
});
