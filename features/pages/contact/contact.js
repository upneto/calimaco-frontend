// Contact JS
// Contact JS
const contactForm = document.getElementById('contactForm');
const contactAlert = document.getElementById('contactAlert');

function showAlert(message, type = 'danger') {
    contactAlert.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
    setTimeout(() => {
        contactAlert.innerHTML = '';
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

if (contactForm) {
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', () => validateField(input));
    });

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            showAlert('Por favor, corrija os erros no formulário.', 'danger');
            return;
        }
        
        // Simulação de envio (substitua por chamada real para backend)
        showAlert('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
        contactForm.reset();
        inputs.forEach(input => {
            input.classList.remove('is-valid');
        });
    });
}
