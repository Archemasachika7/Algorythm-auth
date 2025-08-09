/**
 * FIXED AuthManager - Resolved initialization and cursor issues
 */

class AuthManager {
    constructor() {
        console.log('🎯 AuthManager constructor called');
        
        // Bind methods to maintain context
        this.handleLogin = this.handleLogin.bind(this);
        this.handleRegister = this.handleRegister.bind(this);
        this.handleSocialAuth = this.handleSocialAuth.bind(this);
        
        // Performance monitoring
        this.performanceMarks = new Map();
        this.initialized = false;
        
        // FIXED: Initialize immediately if DOM is ready
        this.init();
    }

    init() {
        console.log('🚀 Starting AuthManager initialization...');
        this.mark('init-start');
        
        try {
            // FIXED: Better DOM ready check
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
            } else {
                this.initializeComponents();
            }
        } catch (error) {
            console.error('❌ Critical initialization error:', error);
            this.handleInitializationError(error);
        }
    }

    initializeComponents() {
        console.log('🔧 Initializing components...');
        
        try {
            // Cache DOM elements first
            this.cacheElements();
            
            // FIXED: Verify critical elements exist
            if (!this.verifyCriticalElements()) {
                throw new Error('Critical DOM elements missing');
            }
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Initialize background effects (non-blocking)
            this.initializeBackgroundEffects().catch(err => {
                console.warn('⚠️ Background effects failed (non-critical):', err);
            });
            
            // Setup form validation
            this.setupFormValidation();
            
            // Initialize accessibility features
            this.setupAccessibility();
            
            // FIXED: Setup cursor follower with proper checks
            this.setupCursorFollower();
            
            // Mark as initialized
            this.initialized = true;
            
            this.mark('init-end');
            this.measure('initialization', 'init-start', 'init-end');
            
            console.log('✅ AuthManager initialized successfully!');
            
            // Show success notification
            setTimeout(() => {
                this.showToast('AlgoRhythm ready to use! 🎉', 'success');
            }, 500);
            
        } catch (error) {
            console.error('❌ Component initialization failed:', error);
            this.handleInitializationError(error);
        }
    }

    cacheElements() {
        console.log('📋 Caching DOM elements...');
        
        // Main container elements
        this.container = document.getElementById('container');
        this.registerBtn = document.getElementById('registerBtn');
        this.loginBtn = document.getElementById('loginBtn');
        
        // Forms
        this.loginForm = document.getElementById('loginForm');
        this.registerForm = document.getElementById('registerForm');
        
        // Form inputs
        this.loginEmail = document.getElementById('loginEmail');
        this.loginPassword = document.getElementById('loginPassword');
        this.registerName = document.getElementById('registerName');
        this.registerEmail = document.getElementById('registerEmail');
        this.registerPassword = document.getElementById('registerPassword');
        this.confirmPassword = document.getElementById('confirmPassword');
        
        // UI elements
        this.successModal = document.getElementById('successModal');
        this.toastContainer = document.getElementById('toast-container');
        
        // Canvas elements
        this.canvas3D = document.getElementById('auth-3d-canvas');
        this.matrixCanvas = document.getElementById('matrix-canvas');
        
        console.log('📋 Elements cached:', {
            container: !!this.container,
            registerBtn: !!this.registerBtn,
            loginBtn: !!this.loginBtn,
            forms: !!(this.loginForm && this.registerForm)
        });
    }

    verifyCriticalElements() {
        const critical = {
            container: this.container,
            registerBtn: this.registerBtn,
            loginBtn: this.loginBtn,
            loginForm: this.loginForm,
            registerForm: this.registerForm
        };
        
        const missing = Object.entries(critical)
            .filter(([key, element]) => !element)
            .map(([key]) => key);
        
        if (missing.length > 0) {
            console.error('❌ Missing critical elements:', missing);
            return false;
        }
        
        console.log('✅ All critical elements found');
        return true;
    }

    handleInitializationError(error) {
        console.error('🔥 AuthManager initialization failed:', error);
        
        // Create fallback UI
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

    setupEventListeners() {
        console.log('🎯 Setting up event listeners...');
        
        // FIXED: Add null checks and better error handling
        try {
            // Form toggle buttons
            if (this.registerBtn) {
                this.registerBtn.addEventListener('click', this.handleToggleToRegister.bind(this));
                console.log('✅ Register button listener added');
            }
            
            if (this.loginBtn) {
                this.loginBtn.addEventListener('click', this.handleToggleToLogin.bind(this));
                console.log('✅ Login button listener added');
            }
            
            // Form submissions
            if (this.loginForm) {
                this.loginForm.addEventListener('submit', this.handleLogin);
                console.log('✅ Login form listener added');
            }
            
            if (this.registerForm) {
                this.registerForm.addEventListener('submit', this.handleRegister);
                console.log('✅ Register form listener added');
            }
            
            // Social authentication buttons
            const socialButtons = document.querySelectorAll('.social-btn');
            socialButtons.forEach(btn => {
                btn.addEventListener('click', this.handleSocialAuth);
            });
            console.log(`✅ ${socialButtons.length} social buttons configured`);
            
            // Password toggle buttons
            const passwordToggles = document.querySelectorAll('.password-toggle');
            passwordToggles.forEach(toggle => {
                toggle.addEventListener('click', this.togglePasswordVisibility.bind(this));
            });
            console.log(`✅ ${passwordToggles.length} password toggles configured`);
            
            // Forgot password link
            const forgotLink = document.getElementById('forgotPassword');
            if (forgotLink) {
                forgotLink.addEventListener('click', this.handleForgotPassword.bind(this));
                console.log('✅ Forgot password link configured');
            }
            
            // Input event listeners for real-time validation
            this.setupInputEventListeners();
            
            // Window events
            window.addEventListener('resize', this.debounce(this.handleResize.bind(this), 250));
            window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));
            
            // FIXED: Keyboard navigation with better error handling
            document.addEventListener('keydown', this.handleKeyDown.bind(this));
            
            console.log('✅ All event listeners configured');
            
        } catch (error) {
            console.error('❌ Event listener setup failed:', error);
            throw error;
        }
    }

    setupInputEventListeners() {
        try {
            // Real-time validation for all inputs
            const inputs = document.querySelectorAll('input[required]');
            inputs.forEach(input => {
                input.addEventListener('blur', this.validateInput.bind(this, input));
                input.addEventListener('input', this.debounce(() => this.validateInput(input), 300));
            });
            
            // FIXED: Password strength with null check
            if (this.registerPassword) {
                this.registerPassword.addEventListener('input', this.updatePasswordStrength.bind(this));
            }
            
            // FIXED: Password confirmation with null check
            if (this.confirmPassword) {
                this.confirmPassword.addEventListener('input', this.validatePasswordMatch.bind(this));
            }
            
            console.log(`✅ Input listeners configured for ${inputs.length} inputs`);
        } catch (error) {
            console.error('❌ Input listeners setup failed:', error);
        }
    }

    handleToggleToRegister(e) {
        e.preventDefault();
        console.log('🔄 Switching to register form');
        
        if (!this.container) {
            console.error('❌ Container not found for toggle');
            return;
        }
        
        try {
            // Use View Transitions API if available
            if (document.startViewTransition) {
                document.startViewTransition(() => {
                    this.container.classList.add('active');
                });
            } else {
                this.container.classList.add('active');
            }
            
            this.animateTransition('register');
            this.announceToScreenReader('Switched to registration form');
            
            // FIXED: Focus first input after transition
            setTimeout(() => {
                if (this.registerName) {
                    this.registerName.focus();
                }
            }, 600);
            
        } catch (error) {
            console.error('❌ Toggle to register failed:', error);
        }
    }

    handleToggleToLogin(e) {
        e.preventDefault();
        console.log('🔄 Switching to login form');
        
        if (!this.container) {
            console.error('❌ Container not found for toggle');
            return;
        }
        
        try {
            if (document.startViewTransition) {
                document.startViewTransition(() => {
                    this.container.classList.remove('active');
                });
            } else {
                this.container.classList.remove('active');
            }
            
            this.animateTransition('login');
            this.announceToScreenReader('Switched to login form');
            
            // FIXED: Focus first input after transition
            setTimeout(() => {
                if (this.loginEmail) {
                    this.loginEmail.focus();
                }
            }, 600);
            
        } catch (error) {
            console.error('❌ Toggle to login failed:', error);
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        console.log('🔐 Handling login...');
        
        const formData = new FormData(e.target);
        const credentials = Object.fromEntries(formData);
        const submitBtn = e.target.querySelector('.btn-primary');
        
        // Client-side validation
        if (!this.validateLoginForm(credentials)) {
            return;
        }
        
        try {
            this.setButtonLoading(submitBtn, true);
            this.updateStatus('login-status', 'Signing in...');
            
            // Simulate API call
            const result = await this.authenticateUser(credentials, 'login');
            
            if (result.success) {
                this.setButtonSuccess(submitBtn);
                this.showSuccessModal('Welcome back to AlgoRhythm!');
                this.updateStatus('login-status', 'Login successful');
                
                await this.delay(2000);
                console.log('✅ Login successful, redirecting...');
                // await this.redirectToApp();
            }
        } catch (error) {
            this.handleAuthError(error, submitBtn);
            this.updateStatus('login-status', `Login failed: ${error.message}`);
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        console.log('📝 Handling registration...');
        
        // FIXED: Add throttling to prevent overload
        if (this.registrationInProgress) {
            console.log('⏳ Registration already in progress, ignoring...');
            return;
        }
        
        this.registrationInProgress = true;
        
        try {
            const formData = new FormData(e.target);
            const userData = Object.fromEntries(formData);
            const submitBtn = e.target.querySelector('.btn-primary');
            
            // Client-side validation
            if (!this.validateRegisterForm(userData)) {
                return;
            }
            
            this.setButtonLoading(submitBtn, true);
            this.updateStatus('register-status', 'Creating account...');
            
            // FIXED: Add longer delay to prevent server overload
            const result = await this.authenticateUser(userData, 'register');
            
            if (result.success) {
                this.setButtonSuccess(submitBtn);
                this.showSuccessModal('Welcome to AlgoRhythm!');
                this.updateStatus('register-status', 'Account created successfully');
                
                await this.delay(2000);
                console.log('✅ Registration successful');
                // await this.redirectToApp();
            }
        } catch (error) {
            this.handleAuthError(error, submitBtn);
            this.updateStatus('register-status', `Registration failed: ${error.message}`);
        } finally {
            // FIXED: Always reset registration flag
            setTimeout(() => {
                this.registrationInProgress = false;
            }, 1000);
        }
    }

    async handleSocialAuth(e) {
        e.preventDefault();
        const provider = e.currentTarget.dataset.provider;
        
        try {
            this.showToast(`Connecting to ${this.capitalizeFirst(provider)}...`, 'info');
            
            const result = await this.authenticateWithProvider(provider);
            
            if (result.success) {
                this.showSuccessModal(`Successfully connected with ${this.capitalizeFirst(provider)}!`);
                await this.delay(2000);
                console.log(`✅ ${provider} auth successful`);
                // await this.redirectToApp();
            }
        } catch (error) {
            this.showToast(`Failed to connect with ${this.capitalizeFirst(provider)}`, 'error');
            console.error(`❌ Social auth error (${provider}):`, error);
        }
    }

    togglePasswordVisibility(e) {
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
        
        // Name validation
        if (!name || name.trim().length < 2) {
            this.showFieldError('name-error', 'Please enter your full name (at least 2 characters)');
            isValid = false;
        } else {
            this.clearFieldError('name-error');
        }
        
        // Email validation
        if (!this.isValidEmail(email)) {
            this.showFieldError('register-email-error', 'Please enter a valid email address');
            isValid = false;
        } else {
            this.clearFieldError('register-email-error');
        }
        
        // Password validation
        const passwordValidation = this.validatePassword(password);
        if (!passwordValidation.isValid) {
            this.showFieldError('register-password-error', passwordValidation.message);
            isValid = false;
        } else {
            this.clearFieldError('register-password-error');
        }
        
        // Password confirmation
        if (password !== confirmPassword) {
            this.showFieldError('confirm-password-error', 'Passwords do not match');
            isValid = false;
        } else {
            this.clearFieldError('confirm-password-error');
        }
        
        return isValid;
    }

    validateInput(input) {
        if (!input) return true;
        
        const value = input.value.trim();
        const type = input.type;
        const name = input.name;
        
        let isValid = true;
        let message = '';
        
        if (input.hasAttribute('required') && !value) {
            isValid = false;
            message = `${this.getFieldLabel(input)} is required`;
        } else if (type === 'email' && value && !this.isValidEmail(value)) {
            isValid = false;
            message = 'Please enter a valid email address';
        } else if (type === 'password' && value) {
            const validation = this.validatePassword(value);
            if (!validation.isValid) {
                isValid = false;
                message = validation.message;
            }
        }
        
        // Update visual state
        input.setAttribute('aria-invalid', !isValid);
        return isValid;
    }

    updatePasswordStrength() {
        if (!this.registerPassword) return;
        
        const password = this.registerPassword.value;
        const strengthElement = document.querySelector('.strength-fill');
        const strengthText = document.querySelector('.strength-text');
        
        if (!strengthElement || !strengthText) return;
        
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
        if (!this.registerPassword || !this.confirmPassword) return;
        
        const password = this.registerPassword.value;
        const confirmPassword = this.confirmPassword.value;
        
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
        
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
            return { isValid: false, message: 'Password must contain uppercase, lowercase, and number' };
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
            errorElement.setAttribute('aria-live', 'polite');
        }
    }

    clearFieldError(elementId) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.removeAttribute('aria-live');
        }
    }

    getFieldLabel(input) {
        const label = document.querySelector(`label[for="${input.id}"]`);
        return label ? label.textContent : input.placeholder || input.name;
    }

    async authenticateUser(credentials, type) {
        console.log(`🔑 Authenticating user (${type})...`);
        
        // FIXED: Add realistic delay based on type
        const delay = type === 'register' ? 2000 + Math.random() * 1000 : 1000 + Math.random() * 500;
        await this.delay(delay);
        
        // Simulate different scenarios
        if (credentials.email === 'test@error.com') {
            throw new Error('Invalid credentials');
        }
        
        if (credentials.email === 'test@network.com') {
            throw new Error('Network connection failed');
        }
        
        return {
            success: true,
            user: {
                id: crypto.randomUUID(),
                email: credentials.email,
                name: credentials.name || 'User'
            },
            token: 'mock-jwt-token'
        };
    }

    async authenticateWithProvider(provider) {
        console.log(`🔗 Authenticating with ${provider}...`);
        await this.delay(1000);
        
        if (Math.random() > 0.1) {
            return {
                success: true,
                provider,
                user: {
                    id: crypto.randomUUID(),
                    email: `user@${provider}.com`,
                    name: `${provider} User`
                }
            };
        } else {
            throw new Error(`${provider} authentication failed`);
        }
    }

    handleAuthError(error, button) {
        console.error('🔥 Auth error:', error);
        this.setButtonLoading(button, false);
        
        let message = 'Authentication failed. Please try again.';
        
        if (error.message.includes('network') || error.message.includes('Network')) {
            message = 'Network error. Please check your connection.';
        } else if (error.message.includes('credentials') || error.message.includes('Invalid')) {
            message = 'Invalid credentials. Please check your details.';
        }
        
        this.showToast(message, 'error');
    }

    setButtonLoading(button, loading) {
        if (!button) return;
        
        if (loading) {
            button.classList.add('loading');
            button.disabled = true;
            button.setAttribute('aria-busy', 'true');
        } else {
            button.classList.remove('loading');
            button.disabled = false;
            button.setAttribute('aria-busy', 'false');
        }
    }

    setButtonSuccess(button) {
        if (!button) return;
        
        button.classList.remove('loading');
        button.style.background = 'linear-gradient(135deg, var(--color-success), #059669)';
        button.setAttribute('aria-busy', 'false');
        
        setTimeout(() => {
            if (button) button.style.background = '';
        }, 3000);
    }

    showSuccessModal(message) {
        const modal = this.successModal;
        const messageEl = document.getElementById('successMessage');
        
        if (messageEl) messageEl.textContent = message;
        
        if (modal) {
            modal.classList.add('show');
            modal.setAttribute('aria-hidden', 'false');
            
            const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (focusableElements.length > 0) {
                focusableElements[focusableElements.length - 1].focus();
            }
        }
    }

    closeSuccessModal() {
        const modal = this.successModal;
        if (modal) {
            modal.classList.remove('show');
            modal.setAttribute('aria-hidden', 'true');
        }
    }

    showToast(message, type = 'info') {
        if (!this.toastContainer) {
            console.warn('Toast container not found');
            return;
        }
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');
        
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

    updateStatus(elementId, message) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = message;
        }
    }

    announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.className = 'sr-only';
        announcement.setAttribute('aria-live', 'polite');
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            if (document.body.contains(announcement)) {
                document.body.removeChild(announcement);
            }
        }, 1000);
    }

    async initializeBackgroundEffects() {
        console.log('🎨 Initializing background effects...');
        
        try {
            if (window.THREE && this.canvas3D) {
                await this.setup3DBackground();
                console.log('✅ 3D background initialized');
            }
            
            if (this.matrixCanvas) {
                this.setupMatrixEffect();
                console.log('✅ Matrix effect initialized');
            }
            
            this.setupFloatingCodeAnimation();
            console.log('✅ Floating code animation initialized');
            
        } catch (error) {
            console.warn('⚠️ Background effects initialization failed:', error);
        }
    }

    async setup3DBackground() {
        if (!window.THREE || !this.canvas3D) return;
        
        try {
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ 
                canvas: this.canvas3D, 
                alpha: true,
                antialias: window.devicePixelRatio === 1
            });
            
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            
            const geometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
            const material = new THREE.MeshBasicMaterial({
                color: 0xF59E0B,
                wireframe: true,
                transparent: true,
                opacity: 0.4
            });
            
            const shapes = [];
            const shapeCount = window.innerWidth < 768 ? 15 : 30;
            
            for (let i = 0; i < shapeCount; i++) {
                const cube = new THREE.Mesh(geometry, material);
                cube.position.set(
                    (Math.random() - 0.5) * 20,
                    (Math.random() - 0.5) * 20,
                    (Math.random() - 0.5) * 20
                );
                cube.rotation.set(
                    Math.random() * Math.PI,
                    Math.random() * Math.PI, 
                    Math.random() * Math.PI
                );
                
                scene.add(cube);
                shapes.push(cube);
            }
            
            const musicGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
            const musicMaterial = new THREE.MeshBasicMaterial({
                color: 0xF59E0B,
                wireframe: true,
                transparent: true,
                opacity: 0.7
            });
            const musicCube = new THREE.Mesh(musicGeometry, musicMaterial);
            scene.add(musicCube);
            
            camera.position.z = 12;
            
            let mouseX = 0;
            let mouseY = 0;
            let targetX = 0;
            let targetY = 0;
            
            const handleMouseMove = this.throttle((e) => {
                targetX = (e.clientX / window.innerWidth) * 2 - 1;
                targetY = -(e.clientY / window.innerHeight) * 2 + 1;
            }, 16);
            
            document.addEventListener('mousemove', handleMouseMove);
            
            let lastTime = 0;
            const animate = (currentTime) => {
                mouseX += (targetX - mouseX) * 0.05;
                mouseY += (targetY - mouseY) * 0.05;
                
                shapes.forEach((shape, index) => {
                    shape.rotation.x += 0.005;
                    shape.rotation.y += 0.005;
                    shape.position.y += Math.sin(currentTime * 0.001 + index) * 0.003;
                });
                
                musicCube.rotation.x += 0.008;
                musicCube.rotation.y += 0.012;
                musicCube.scale.setScalar(1 + Math.sin(currentTime * 0.004) * 0.1);
                
                camera.position.x += (mouseX * 3 - camera.position.x) * 0.05;
                camera.position.y += (mouseY * 3 - camera.position.y) * 0.05;
                camera.lookAt(0, 0, 0);
                
                renderer.render(scene, camera);
                requestAnimationFrame(animate);
            };
            
            animate(0);
            
            const handleResize = this.debounce(() => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            }, 250);
            
            window.addEventListener('resize', handleResize);
            
        } catch (error) {
            console.warn('3D background setup failed:', error);
        }
    }

    setupMatrixEffect() {
        if (!this.matrixCanvas) return;
        
        try {
            const ctx = this.matrixCanvas.getContext('2d');
            this.matrixCanvas.width = window.innerWidth;
            this.matrixCanvas.height = window.innerHeight;
            
            const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()+-=[]{}|;:,.<?".split("");
            const font_size = 12;
            const columns = Math.floor(this.matrixCanvas.width / font_size);
            const drops = new Array(columns).fill(1);
            
            const draw = () => {
                ctx.fillStyle = 'rgba(5, 5, 8, 0.05)';
                ctx.fillRect(0, 0, this.matrixCanvas.width, this.matrixCanvas.height);
                
                ctx.fillStyle = '#F59E0B';
                ctx.font = `${font_size}px monospace`;
                
                for (let i = 0; i < drops.length; i++) {
                    const text = matrix[Math.floor(Math.random() * matrix.length)];
                    ctx.fillText(text, i * font_size, drops[i] * font_size);
                    
                    if (drops[i] * font_size > this.matrixCanvas.height && Math.random() > 0.975) {
                        drops[i] = 0;
                    }
                    
                    drops[i]++;
                }
            };
            
            const matrixInterval = setInterval(draw, 50);
            
            window.addEventListener('beforeunload', () => {
                clearInterval(matrixInterval);
            });
            
        } catch (error) {
            console.warn('Matrix effect setup failed:', error);
        }
    }

    // FIXED: Improved cursor follower with better checks
    setupCursorFollower() {
        console.log('🖱️ Setting up cursor follower...');
        
        const follower = document.querySelector('.cursor-follower');
        if (!follower) {
            console.warn('Cursor follower element not found');
            return;
        }
        
        // Check if device supports hover
        if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
            console.log('Device does not support cursor follower, hiding...');
            follower.style.display = 'none';
            return;
        }
        
        let mouseX = 0;
        let mouseY = 0;
        let followerX = 0;
        let followerY = 0;
        let isActive = false;
        
        const handleMouseMove = this.throttle((e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            isActive = true;
        }, 16);
        
        const handleMouseLeave = () => {
            isActive = false;
        };
        
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseleave', handleMouseLeave);
        
        const animateFollower = () => {
            if (isActive) {
                followerX += (mouseX - followerX) * 0.1;
                followerY += (mouseY - followerY) * 0.1;
                
                follower.style.left = `${followerX}px`;
                follower.style.top = `${followerY}px`;
                follower.style.opacity = '1';
            } else {
                follower.style.opacity = '0';
            }
            
            requestAnimationFrame(animateFollower);
        };
        
        animateFollower();
        console.log('✅ Cursor follower initialized');
    }

    setupFloatingCodeAnimation() {
        if (window.gsap) {
            try {
                gsap.to('.code-snippet', {
                    y: -10,
                    duration: 2,
                    ease: "sine.inOut",
                    yoyo: true,
                    repeat: -1,
                    stagger: 0.5
                });
                console.log('✅ GSAP animations initialized');
            } catch (error) {
                console.warn('GSAP animation setup failed:', error);
            }
        } else {
            console.log('GSAP not available, skipping animations');
        }
    }

    animateTransition(toForm) {
        if (window.gsap) {
            try {
                const forms = document.querySelectorAll('.form-box');
                forms.forEach(form => {
                    gsap.from(form, {
                        opacity: 0,
                        x: toForm === 'register' ? 20 : -20,
                        duration: 0.5,
                        delay: 0.3,
                        ease: "power2.out"
                    });
                });
            } catch (error) {
                console.warn('Transition animation failed:', error);
            }
        }
    }

    setupAccessibility() {
        this.setupKeyboardNavigation();
        this.setupLiveRegions();
        this.setupFocusManagement();
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.successModal?.classList.contains('show')) {
                this.closeSuccessModal();
            }
        });
    }

    setupLiveRegions() {
        const statusElements = ['login-status', 'register-status'];
        statusElements.forEach(id => {
            let element = document.getElementById(id);
            if (!element) {
                element = document.createElement('div');
                element.id = id;
                element.className = 'sr-only';
                element.setAttribute('role', 'status');
                element.setAttribute('aria-live', 'polite');
                document.body.appendChild(element);
            }
        });
    }

    setupFocusManagement() {
        // Focus management is handled in the toggle functions
    }

    setupFormValidation() {
        console.log('✅ Form validation setup completed');
    }

    handleResize() {
        if (this.matrixCanvas) {
            this.matrixCanvas.width = window.innerWidth;
            this.matrixCanvas.height = window.innerHeight;
        }
    }

    handleBeforeUnload() {
        this.cleanup();
    }

    handleKeyDown(e) {
        if (e.ctrlKey || e.metaKey) {
            if (e.key === 'k') {
                e.preventDefault();
                const activeForm = this.container?.classList.contains('active') ? 'register' : 'login';
                const firstInput = activeForm === 'register' ? this.registerName : this.loginEmail;
                if (firstInput) {
                    firstInput.focus();
                }
            }
        }
    }

    handleForgotPassword(e) {
        e.preventDefault();
        
        if (!this.loginEmail) {
            this.showToast('Email field not found', 'error');
            return;
        }
        
        const email = this.loginEmail.value;
        
        if (!email) {
            this.showToast('Please enter your email address first', 'warning');
            this.loginEmail.focus();
            return;
        }
        
        if (!this.isValidEmail(email)) {
            this.showToast('Please enter a valid email address', 'error');
            this.loginEmail.focus();
            return;
        }
        
        this.showToast('Password reset link sent to your email!', 'success');
    }

    cleanup() {
        this.performanceMarks.clear();
    }

    // Utility methods
    mark(name) {
        if ('performance' in window && 'mark' in performance) {
            performance.mark(name);
            this.performanceMarks.set(name, Date.now());
        }
    }

    measure(name, startMark, endMark) {
        if ('performance' in window && 'measure' in performance) {
            try {
                performance.measure(name, startMark, endMark);
                const measure = performance.getEntriesByName(name)[0];
                console.log(`⏱️ ${name}: ${measure.duration.toFixed(2)}ms`);
            } catch (error) {
                console.warn('Performance measurement failed:', error);
            }
        }
    }

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

    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

// Global functions for backward compatibility
function closeSuccessModal() {
    if (window.authManager) {
        window.authManager.closeSuccessModal();
    }
}

// FIXED: Initialize with proper error handling
try {
    console.log('🚀 Creating AuthManager instance...');
    window.authManager = new AuthManager();
    console.log('✅ AuthManager instance created successfully');
} catch (error) {
    console.error('❌ Failed to create AuthManager:', error);
    
    // Fallback initialization
    document.addEventListener('DOMContentLoaded', () => {
        try {
            if (!window.authManager) {
                console.log('🔄 Retrying AuthManager creation...');
                window.authManager = new AuthManager();
            }
        } catch (retryError) {
            console.error('❌ Retry failed:', retryError);
        }
    });
}

// Progressive enhancement
document.documentElement.className = document.documentElement.className.replace('no-js', 'js');
