const toggleLink = document.getElementById('toggle-link');
const authTitle = document.getElementById('auth-title');
const submitButton = document.getElementById('submit-button');
const confirmPasswordGroup = document.getElementById('confirm-password-group');

toggleLink.addEventListener('click', (e) => {
    e.preventDefault();
    const isLogin = authTitle.textContent === 'Login';

    authTitle.textContent = isLogin ? 'Register' : 'Login';
    submitButton.textContent = isLogin ? 'Register' : 'Login';
    toggleLink.textContent = isLogin
        ? 'Already have an account? Login'
        : "Don't have an account? Register";
    confirmPasswordGroup.classList.toggle('hidden');

    // Clear form fields
    document.getElementById("login-register-form").reset();
});
