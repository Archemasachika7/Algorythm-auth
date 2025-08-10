class AuthManager {
    constructor() {
        console.log('🚀 AuthManager starting...');
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        try {
            console.log('🔧 Setting up AuthManager...');
            
            // Cache elements
            this.container = document.getElementById('container');
            this.registerBtn = document.getElementById('registerBtn');
            this.loginBtn = document.getElementById('loginBtn');
            this.loginForm = document.getElementById('loginForm');
            this.registerForm = document.getElementById('registerForm');
            this.successModal = document.getElementById('successModal');
            this.toastContainer = document.getElementById('toast-container');

            if (!this.container || !this.registerBtn || !this.loginBtn) {
                throw new Error('Critical elements not found');
            }

            this.setupEventListeners();
            this.setupFormValidation();
            
            console.log('✅ AuthManager initialized successfully');
            
            // Show ready notification
            setTimeout(() => {
                this.showToast('AlgoRhythm ready! 🎉', 'success');
            }, 1000);

        } catch (error) {
            console.error('❌ Setup failed:', error);
            this.showFallbackError();
        }
    }

    setupEventListeners() {
        console.log('🎯 Setting up event listeners...');

        // Toggle buttons
        this.registerBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Switching to register');
            this.container.classList.add('active');
            setTimeout(() => {
                const firstInput = document.getElementById('registerName');
                if (firstInput) firstInput.focus();
            }, 600);
        });

        this.loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Switching to login');
            this.container.classList.remove('active');
            setTimeout(() => {
                const firstInput = document.getElementById('loginEmail');
                if (firstInput) firstInput.focus();
            }, 600);
        });

        // Form submissions
        this.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        this.registerForm.addEventListener('submit', (e) => this.handleRegister(e));

        // Social buttons
        document.querySelectorAll('.social-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleSocialAuth(e));
        });

        // Password toggles
        document.querySelectorAll('.password-toggle').forEach(toggle => {
            toggle.addEventListener('click', (e) => this.togglePassword(e));
        });

        // Forgot password
        const forgotLink = document.getElementById('forgotPassword');
        if (forgotLink) {
            forgotLink.addEventListener('click', (e) => this.handleForgotPassword(e));
        }

        console.log('✅ Event listeners configured');
    }

    setupFormValidation() {
        // Real-time validation
        document.querySelectorAll('input[required]').forEach(input => {
            input.addEventListener('blur', () => this.validateInput(input));
            input.addEventListener('input', this.debounce(() => this.validateInput(input), 300));
        });

        // Password strength
        const passwordInput = document.getElementById('registerPassword');
        if (passwordInput) {
            passwordInput.addEventListener('input', () => this.updatePasswordStrength());
        }

        // Password confirmation
        const confirmInput = document.getElementById('confirmPassword');
        if (confirmInput) {
            confirmInput.addEventListener('input', () => this.validatePasswordMatch());
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        console.log('🔐 Handling login...');

        const formData = new FormData(e.target);
        const credentials = Object.fromEntries(formData);
        const submitBtn = e.target.querySelector('.btn-primary');

        if (!this.validateLoginForm(credentials)) {
            return;
        }

        try {
            this.setButtonLoading(submitBtn, true);
            
            // Simulate API call
            await this.delay(1500);
            
            if (credentials.email === 'test@error.com') {
                throw new Error('Invalid credentials');
            }

            this.setButtonSuccess(submitBtn);
            this.showSuccessModal('Welcome back to AlgoRhythm!');
            
            setTimeout(() => {
                console.log('✅ Login successful');
            }, 2000);

        } catch (error) {
            this.setButtonLoading(submitBtn, false);
            this.showToast(error.message, 'error');
            console.error('❌ Login failed:', error);
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        console.log('📝 Handling registration...');

        const formData = new FormData(e.target);
        const userData = Object.fromEntries(formData);
        const submitBtn = e.target.querySelector('.btn-primary');

        if (!this.validateRegisterForm(userData)) {
            return;
        }

        try {
            this.setButtonLoading(submitBtn, true);
            
            // Simulate API call
            await this.delay(2000);

            this.setButtonSuccess(submitBtn);
            this.showSuccessModal('Welcome to AlgoRhythm!');
            
            setTimeout(() => {
                console.log('✅ Registration successful');
            }, 2000);

        } catch (error) {
            this.setButtonLoading(submitBtn, false);
            this.showToast('Registration failed. Please try again.', 'error');
            console.error('❌ Registration failed:', error);
        }
    }

    async handleSocialAuth(e) {
        e.preventDefault();
        const provider = e.currentTarget.dataset.provider;
        
        try {
            this.showToast(`Connecting to ${this.capitalizeFirst(provider)}...`, 'info');
            await this.delay(1000);
            
            this.showSuccessModal(`Successfully connected with ${this.capitalizeFirst(provider)}!`);
            
        } catch (error) {
            this.showToast(`Failed to connect with ${this.capitalizeFirst(provider)}`, 'error');
        }
    }

    togglePassword(e) {
        const toggle = e.currentTarget;
        const input = toggle.parentElement.querySelector('input[type="password"], input[type="text"]');
        const icon = toggle.querySelector('i');
        
        if (!input || !icon) return;
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.replace('fa-eye', 'fa-eye-slash');
            toggle.setAttribute('aria-label', 'Hide password');
        } else {
            input.type = 'password';
            icon.classList.replace('fa-eye-slash', 'fa-eye');
            toggle.setAttribute('aria-label', 'Show password');
        }
    }

    validateLoginForm(credentials) {
        const { email, password } = credentials;
        let isValid = true;

        if (!this.isValidEmail(email)) {
            this.showFieldError('email-error', 'Please enter a valid email address');
            isValid = false;
        } else {
            this.clearFieldError('email-error');
        }

        if (!password || password.length < 1) {
            this.showFieldError('password-error', 'Password is required');
            isValid = false;
        } else {
            this.clearFieldError('password-error');
        }

        return isValid;
    }

    validateRegisterForm(userData) {
        const { name, email, password, confirmPassword } = userData;
        let isValid = true;

        if (!name || name.trim().length < 2) {
            this.showFieldError('name-error', 'Please enter your full name (at least 2 characters)');
            isValid = false;
        } else {
            this.clearFieldError('name-error');
        }

        if (!this.isValidEmail(email)) {
            this.showFieldError('register-email-error', 'Please enter a valid email address');
            isValid = false;
        } else {
            this.clearFieldError('register-email-error');
        }

        const passwordValidation = this.validatePassword(password);
        if (!passwordValidation.isValid) {
            this.showFieldError('register-password-error', passwordValidation.message);
            isValid = false;
        } else {
            this.clearFieldError('register-password-error');
        }

        if (password !== confirmPassword) {
            this.showFieldError('confirm-password-error', 'Passwords do not match');
            isValid = false;
        } else {
            this.clearFieldError('confirm-password-error');
        }

        return isValid;
    }

    validateInput(input) {
        const value = input.value.trim();
        const type = input.type;
        
        let isValid = true;
        let message = '';
        
        if (input.hasAttribute('required') && !value) {
            isValid = false;
            message = `${this.getFieldLabel(input)} is required`;
        } else if (type === 'email' && value && !this.isValidEmail(value)) {
            isValid = false;
            message = 'Please enter a valid email address';
        }
        
        input.setAttribute('aria-invalid', !isValid);
        return isValid;
    }

    updatePasswordStrength() {
        const passwordInput = document.getElementById('registerPassword');
        const strengthElement = document.querySelector('.strength-fill');
        const strengthText = document.querySelector('.strength-text');
        
        if (!passwordInput || !strengthElement || !strengthText) return;
        
        const password = passwordInput.value;
        
        if (!password) {
            strengthElement.className = 'strength-fill';
            strengthText.textContent = 'Password strength';
            return;
        }
        
        const strength = this.calculatePasswordStrength(password);
        strengthElement.className = `strength-fill ${strength.level}`;
        strengthText.textContent = strength.text;
    }

    validatePasswordMatch() {
        const passwordInput = document.getElementById('registerPassword');
        const confirmInput = document.getElementById('confirmPassword');
        
        if (!passwordInput || !confirmInput) return;
        
        const password = passwordInput.value;
        const confirmPassword = confirmInput.value;
        
        if (confirmPassword && password !== confirmPassword) {
            this.showFieldError('confirm-password-error', 'Passwords do not match');
        } else {
            this.clearFieldError('confirm-password-error');
        }
    }

    calculatePasswordStrength(password) {
        let score = 0;
        
        if (password.length >= 8) score += 1;
        if (password.length >= 12) score += 1;
        if (/[a-z]/.test(password)) score += 1;
        if (/[A-Z]/.test(password)) score += 1;
        if (/[0-9]/.test(password)) score += 1;
        if (/[^A-Za-z0-9]/.test(password)) score += 1;
        
        const levels = [
            { min: 0, max: 2, level: 'weak', text: 'Weak password' },
            { min: 3, max: 4, level: 'fair', text: 'Fair password' },
            { min: 5, max: 6, level: 'good', text: 'Good password' },
            { min: 7, max: 8, level: 'strong', text: 'Strong password' }
        ];
        
        return levels.find(level => score >= level.min && score <= level.max) || levels[0];
    }

    validatePassword(password) {
        if (!password) {
            return { isValid: false, message: 'Password is required' };
        }
        
        if (password.length < 8) {
            return { isValid: false, message: 'Password must be at least 8 characters long' };
        }
        
        return { isValid: true };
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showFieldError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    clearFieldError(elementId) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = '';
        }
    }

    getFieldLabel(input) {
        const label = document.querySelector(`label[for="${input.id}"]`);
        return label ? label.textContent : input.placeholder || input.name;
    }

    setButtonLoading(button, loading) {
        if (!button) return;
        
        if (loading) {
            button.classList.add('loading');
            button.disabled = true;
        } else {
            button.classList.remove('loading');
            button.disabled = false;
        }
    }

    setButtonSuccess(button) {
        if (!button) return;
        
        button.classList.remove('loading');
        button.style.background = 'linear-gradient(135deg, var(--color-success), #059669)';
        
        setTimeout(() => {
            if (button) button.style.background = '';
        }, 3000);
    }

    showSuccessModal(message) {
        if (!this.successModal) {
            this.successModal = document.getElementById('successModal');
            if (!this.successModal) return;
        }
        
        const messageEl = document.getElementById('successMessage');
        if (messageEl) messageEl.textContent = message;
        
        this.successModal.classList.add('show');
        
        const button = this.successModal.querySelector('button');
        if (button) button.focus();
    }

    closeSuccessModal() {
        if (this.successModal && this.successModal.classList.contains('show')) {
            this.successModal.classList.remove('show');
        }
    }

    showToast(message, type = 'info') {
        if (!this.toastContainer) {
            // Create toast container if it doesn't exist
            this.toastContainer = document.createElement('div');
            this.toastContainer.id = 'toast-container';
            this.toastContainer.className = 'toast-container';
            document.body.appendChild(this.toastContainer);
        }
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = this.getToastIcon(type);
        toast.innerHTML = `
            <i class="${icon}" aria-hidden="true"></i>
            <span>${message}</span>
        `;
        
        this.toastContainer.appendChild(toast);
        
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 4000);
    }

    getToastIcon(type) {
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        return icons[type] || icons.info;
    }

    handleForgotPassword(e) {
        e.preventDefault();
        
        const emailInput = document.getElementById('loginEmail');
        if (!emailInput) return;
        
        const email = emailInput.value;
        
        if (!email) {
            this.showToast('Please enter your email address first', 'warning');
            emailInput.focus();
            return;
        }
        
        if (!this.isValidEmail(email)) {
            this.showToast('Please enter a valid email address', 'error');
            emailInput.focus();
            return;
        }
        
        this.showToast('Password reset link sent to your email!', 'success');
    }

    showFallbackError() {
        const fallback = document.createElement('div');
        fallback.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #ef4444;
                color: white;
                padding: 20px;
                border-radius: 12px;
                text-align: center;
                z-index: 10000;
                box-shadow: 0 10px 25px rgba(0,0,0,0.3);
            ">
                <h3>⚠️ Initialization Failed</h3>
                <p>Please refresh the page to try again.</p>
                <button onclick="location.reload()" style="
                    margin-top: 10px;
                    padding: 8px 16px;
                    background: white;
                    color: #ef4444;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 600;
                ">Refresh Page</button>
            </div>
        `;
        document.body.appendChild(fallback);
    }

    // Utility methods
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

// Global function for modal
function closeSuccessModal() {
    if (window.authManager) {
        window.authManager.closeSuccessModal();
    }
}

// Initialize
try {
    window.authManager = new AuthManager();
} catch (error) {
    console.error('❌ Failed to create AuthManager:', error);
}
