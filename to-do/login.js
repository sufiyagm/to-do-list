/* ===================================
   Login Page JavaScript
   =================================== */

class LoginManager {
    constructor() {
        this.form = document.getElementById('loginForm');
        this.emailInput = document.getElementById('emailInput');
        this.passwordInput = document.getElementById('passwordInput');
        this.togglePassword = document.getElementById('togglePassword');
        this.loginButton = document.getElementById('loginButton');
        this.rememberMe = document.getElementById('rememberMe');
        this.errorBanner = document.getElementById('errorMessage');
        this.errorText = document.getElementById('errorText');
        this.forgotPassword = document.getElementById('forgotPassword');
        this.signUpLink = document.getElementById('signUpLink');

        this.isLoading = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkRememberedCredentials();
        this.setupKeyboardNavigation();
    }

    setupEventListeners() {
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Password toggle
        this.togglePassword.addEventListener('click', () => this.togglePasswordVisibility());

        // Real-time validation
        this.emailInput.addEventListener('blur', () => this.validateEmail());
        this.emailInput.addEventListener('input', () => this.clearEmailError());
        this.passwordInput.addEventListener('blur', () => this.validatePassword());
        this.passwordInput.addEventListener('input', () => this.clearPasswordError());

        // Links
        this.forgotPassword.addEventListener('click', (e) => this.handleForgotPassword(e));
        this.signUpLink.addEventListener('click', (e) => this.handleSignUp(e));

        // Enter key handling
        this.emailInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.passwordInput.focus();
            }
        });

        this.passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.handleSubmit(e);
            }
        });
    }

    setupKeyboardNavigation() {
        // Ensure all interactive elements are keyboard accessible
        const focusableElements = [
            this.emailInput,
            this.passwordInput,
            this.togglePassword,
            this.rememberMe,
            this.forgotPassword,
            this.signUpLink,
            this.loginButton
        ];

        // Tab order is handled by DOM order, but we can add focus management
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.clearErrors();
            }
        });
    }

    togglePasswordVisibility() {
        const isPassword = this.passwordInput.type === 'password';
        this.passwordInput.type = isPassword ? 'text' : 'password';

        // Update toggle icon
        const toggleIcon = this.togglePassword.querySelector('.toggle-icon');
        toggleIcon.textContent = isPassword ? '🙈' : '👁️';

        // Update aria-label
        this.togglePassword.setAttribute('aria-label',
            isPassword ? 'Hide password' : 'Show password'
        );

        // Focus back to password input for better UX
        this.passwordInput.focus();
    }

    validateEmail() {
        const email = this.emailInput.value.trim();
        const emailError = document.getElementById('emailError');

        if (!email) {
            this.showError('email', 'Email or username is required');
            return false;
        }

        // Basic email validation if it looks like an email
        if (email.includes('@')) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                this.showError('email', 'Please enter a valid email address');
                return false;
            }
        }

        this.clearEmailError();
        return true;
    }

    validatePassword() {
        const password = this.passwordInput.value;
        const passwordError = document.getElementById('passwordError');

        if (!password) {
            this.showError('password', 'Password is required');
            return false;
        }

        if (password.length < 6) {
            this.showError('password', 'Password must be at least 6 characters long');
            return false;
        }

        this.clearPasswordError();
        return true;
    }

    showError(field, message) {
        const errorElement = document.getElementById(`${field}Error`);
        const inputElement = document.getElementById(`${field}Input`);

        errorElement.textContent = message;
        errorElement.classList.add('show');
        inputElement.setAttribute('aria-invalid', 'true');
        inputElement.classList.add('error');
    }

    clearEmailError() {
        const emailError = document.getElementById('emailError');
        emailError.classList.remove('show');
        this.emailInput.removeAttribute('aria-invalid');
        this.emailInput.classList.remove('error');
    }

    clearPasswordError() {
        const passwordError = document.getElementById('passwordError');
        passwordError.classList.remove('show');
        this.passwordInput.removeAttribute('aria-invalid');
        this.passwordInput.classList.remove('error');
    }

    clearErrors() {
        this.clearEmailError();
        this.clearPasswordError();
        this.hideErrorBanner();
    }

    showErrorBanner(message) {
        this.errorText.textContent = message;
        this.errorBanner.classList.remove('hidden');
        this.errorBanner.setAttribute('aria-live', 'polite');

        // Auto-hide after 5 seconds
        setTimeout(() => {
            this.hideErrorBanner();
        }, 5000);
    }

    hideErrorBanner() {
        this.errorBanner.classList.add('hidden');
        this.errorBanner.removeAttribute('aria-live');
    }

    setLoading(loading) {
        this.isLoading = loading;
        const buttonText = this.loginButton.querySelector('.button-text');
        const spinner = this.loginButton.querySelector('.loading-spinner');

        if (loading) {
            this.loginButton.disabled = true;
            buttonText.style.opacity = '0';
            spinner.classList.remove('hidden');
            this.loginButton.setAttribute('aria-busy', 'true');
        } else {
            this.loginButton.disabled = false;
            buttonText.style.opacity = '1';
            spinner.classList.add('hidden');
            this.loginButton.removeAttribute('aria-busy');
        }
    }

    async handleSubmit(e) {
        e.preventDefault();

        if (this.isLoading) return;

        // Clear previous errors
        this.clearErrors();

        // Validate form
        const isEmailValid = this.validateEmail();
        const isPasswordValid = this.validatePassword();

        if (!isEmailValid || !isPasswordValid) {
            return;
        }

        // Start loading
        this.setLoading(true);

        try {
            // Simulate API call - replace with actual authentication
            const result = await this.authenticateUser(
                this.emailInput.value.trim(),
                this.passwordInput.value
            );

            if (result.success) {
                // Handle remember me
                if (this.rememberMe.checked) {
                    this.saveCredentials(this.emailInput.value.trim());
                } else {
                    this.clearSavedCredentials();
                }

                // Success - redirect to main app
                this.showSuccessAndRedirect();
            } else {
                throw new Error(result.message || 'Authentication failed');
            }

        } catch (error) {
            console.error('Login error:', error);
            this.showErrorBanner(error.message || 'Login failed. Please try again.');
        } finally {
            this.setLoading(false);
        }
    }

    async authenticateUser(email, password) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Mock authentication - replace with real API call
        // For demo purposes, accept any email/password combination
        // In production, this would be an API call to your backend

        if (email && password.length >= 6) {
            // Simulate successful login
            return {
                success: true,
                user: {
                    id: 'user123',
                    email: email,
                    name: 'Demo User'
                }
            };
        } else {
            // Simulate failed login
            return {
                success: false,
                message: 'Invalid email or password'
            };
        }

        // Example of how to integrate with Firebase Auth:
        /*
        try {
            const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
            return {
                success: true,
                user: userCredential.user
            };
        } catch (error) {
            return {
                success: false,
                message: this.getFirebaseErrorMessage(error.code)
            };
        }
        */

        // Example of how to integrate with Auth0:
        /*
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                return {
                    success: true,
                    user: data.user,
                    token: data.token
                };
            } else {
                const error = await response.json();
                return {
                    success: false,
                    message: error.message
                };
            }
        } catch (error) {
            return {
                success: false,
                message: 'Network error. Please try again.'
            };
        }
        */
    }

    getFirebaseErrorMessage(errorCode) {
        const errorMessages = {
            'auth/user-not-found': 'No account found with this email address.',
            'auth/wrong-password': 'Incorrect password.',
            'auth/invalid-email': 'Invalid email address.',
            'auth/user-disabled': 'This account has been disabled.',
            'auth/too-many-requests': 'Too many failed login attempts. Please try again later.',
        };
        return errorMessages[errorCode] || 'Login failed. Please try again.';
    }

    saveCredentials(email) {
        try {
            localStorage.setItem('taskflow_remember_email', email);
        } catch (error) {
            console.warn('Could not save credentials to localStorage:', error);
        }
    }

    clearSavedCredentials() {
        try {
            localStorage.removeItem('taskflow_remember_email');
        } catch (error) {
            console.warn('Could not clear credentials from localStorage:', error);
        }
    }

    checkRememberedCredentials() {
        try {
            const savedEmail = localStorage.getItem('taskflow_remember_email');
            if (savedEmail) {
                this.emailInput.value = savedEmail;
                this.rememberMe.checked = true;
            }
        } catch (error) {
            console.warn('Could not load saved credentials:', error);
        }
    }

    showSuccessAndRedirect() {
        // Show success state
        this.loginButton.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        const buttonText = this.loginButton.querySelector('.button-text');
        buttonText.textContent = 'Success!';

        // Store authentication state
        this.setAuthenticatedState();

        // Redirect after a short delay
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }

    setAuthenticatedState() {
        // Store authentication token/session
        // This is a simple example - in production use proper JWT tokens
        try {
            const authData = {
                isAuthenticated: true,
                loginTime: new Date().toISOString(),
                // In production, store JWT token here
            };
            localStorage.setItem('taskflow_auth', JSON.stringify(authData));
        } catch (error) {
            console.warn('Could not save authentication state:', error);
        }
    }

    handleForgotPassword(e) {
        e.preventDefault();

        // For now, show an alert. In production, this would open a modal or redirect
        alert('Forgot password functionality would typically:\n\n1. Show a modal to enter email\n2. Send password reset email\n3. Show confirmation message\n\nThis can be easily integrated with Firebase Auth.sendPasswordResetEmail() or your backend API.');

        // Example implementation:
        /*
        const email = prompt('Enter your email address:');
        if (email) {
            // Call your password reset API
            this.sendPasswordReset(email);
        }
        */
    }

    handleSignUp(e) {
        e.preventDefault();

        // For now, show an alert. In production, this would redirect to signup page
        alert('Sign up functionality would typically:\n\n1. Redirect to a registration page\n2. Collect user details (name, email, password)\n3. Validate and create account\n4. Send verification email\n\nThis can be integrated with Firebase Auth.createUserWithEmailAndPassword() or your backend API.');

        // Example implementation:
        // window.location.href = 'signup.html';
    }

    async sendPasswordReset(email) {
        // Example for Firebase:
        /*
        try {
            await firebase.auth().sendPasswordResetEmail(email);
            alert('Password reset email sent! Check your inbox.');
        } catch (error) {
            alert('Error sending password reset email: ' + error.message);
        }
        */

        // Example for custom backend:
        /*
        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            if (response.ok) {
                alert('Password reset email sent! Check your inbox.');
            } else {
                throw new Error('Failed to send password reset email');
            }
        } catch (error) {
            alert('Error: ' + error.message);
        }
        */
    }
}

// Initialize login manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LoginManager();
});

// Export for potential use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LoginManager;
}