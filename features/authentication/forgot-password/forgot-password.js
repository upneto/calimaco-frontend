// Forgot Password JS
document.getElementById('forgotForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    
    // Simulação de envio de email (substitua por chamada real para backend)
    alert('Link de recuperação enviado para ' + email);
    window.location.hash = 'login';
});