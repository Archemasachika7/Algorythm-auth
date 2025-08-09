/**
 * Modern Authentication Manager - 2025 Edition
 * Features: Web Components, Modern APIs, Enhanced Accessibility, Performance Optimizations
 */

class AuthManager {
    constructor() {
        // Bind methods to maintain context
        this.handleLogin = this.handleLogin.bind(this);
        this.handleRegister = this.handleRegister.bind(this);
        this.handleSocialAuth = this.handleSocialAuth.bind(this);
        
        // Performance monitoring
        this.performanceMarks = new Map();
        
        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    async init() {
        this.mark('init-start');
        
        try {
            // Cache DOM elements
            this.cacheElements();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Initialize background effects
            await this.initializeBackgroundEffects();
            
            // Setup form validation
            this.setupFormValidation();
            
            // Initialize accessibility features
            this.setupAccessibility();
            
            // Setup performance monitoring
            this.setupPerformanceMonitoring();
            
            this.mark('init-end');
            this.measure('initialization', 'init-start', 'init-end');
            
            console.log('🚀 AuthManager initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize AuthManager:', error);
            this.showToast('Failed to initialize application', 'error');
        }
    }

    cacheElements() {
        // Main container elements
        this.container = document.getElementById('main-content');
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
        
        // Validate critical elements
        if (!this.container || !this.registerBtn || !this.loginBtn) {
            throw new Error('Critical DOM elements not found');
        }
    }

    setupEventListeners() {
        // Form toggle buttons
        this.registerBtn?.addEventListener('click', this.handleToggleToRegister.bind(this));
        this.loginBtn?.addEventListener('click', this.handleToggleToLogin.bind(this));
        
        // Form submissions
        this.loginForm?.addEventListener('submit', this.handleLogin);
        this.registerForm?.addEventListener('submit', this.handleRegister);
        
        // Social authentication buttons
        document.querySelectorAll('.social-btn').forEach(btn => {
            btn.addEventListener('click', this.handleSocialAuth);
        });
        
        // Password toggle buttons
        document.querySelectorAll('.password-toggle').forEach(toggle => {
            toggle.addEventListener('click', this.togglePasswordVisibility.bind(this));
        });
        
        // Forgot password link
        document.getElementById('forgotPassword')?.addEventListener('click', this.handleForgotPassword.bind(this));
        
        // Input event listeners for real-time validation
        this.setupInputEventListeners();
        
        // Window events
        window.addEventListener('resize', this.debounce(this.handleResize.bind(this), 250));
        window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));
        
        // Keyboard navigation
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
    }

    setupInputEventListeners() {
        // Real-time validation for all inputs
        const inputs = document.querySelectorAll('input[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', this.validateInput.bind(this, input));
            input.addEventListener('input', this.debounce(() => this.validateInput(input), 300));
        });
        
        // Password strength indicator
        this.registerPassword?.addEventListener('input', this.updatePasswordStrength.bind(this));
        
        // Password confirmation matching
        this.confirmPassword?.addEventListener('input', this.validatePasswordMatch.bind(this));
    }

    handleToggleToRegister(e) {
        e.preventDefault();
        this.mark('toggle-to-register-start');
        
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
        this.mark('toggle-to-register-end');
    }

    handleToggleToLogin(e) {
        e.preventDefault();
        this.mark('toggle-to-login-start');
        
        if (document.startViewTransition) {
            document.startViewTransition(() => {
                this.container.classList.remove('active');
            });
        } else {
            this.container.classList.remove('active');
        }
        
        this.animateTransition('login');
        this.announceToScreenReader('Switched to login form');
        this.mark('toggle-to-login-end');
    }

    async handleLogin(e) {
        e.preventDefault();
        this.mark('login-start');
        
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
            
            // Simulate API call with modern fetch
            const result = await this.authenticateUser(credentials, 'login');
            
            if (result.success) {
                this.setButtonSuccess(submitBtn);
                this.showSuccessModal('Welcome back to AlgoRhythm!');
                this.updateStatus('login-status', 'Login successful');
                
                // Use setTimeout with modern timing
                await this.delay(2000);
                await this.redirectToApp();
            }
        } catch (error) {
            this.handleAuthError(error, submitBtn);
            this.updateStatus('login-status', `Login failed: ${error.message}`);
        } finally {
            this.mark('login-end');
            this.measure('login-duration', 'login-start', 'login-end');
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        this.mark('register-start');
        
        const formData = new FormData(e.target);
        const userData = Object.fromEntries(formData);
        const submitBtn = e.target.querySelector('.btn-primary');
        
        // Client-side validation
        if (!this.validateRegisterForm(userData)) {
            return;
        }
        
        try {
            this.setButtonLoading(submitBtn, true);
            this.updateStatus('register-status', 'Creating account...');
            
            const result = await this.authenticateUser(userData, 'register');
            
            if (result.success) {
                this.setButtonSuccess(submitBtn);
                this.showSuccessModal('Welcome to AlgoRhythm!');
                this.updateStatus('register-status', 'Account created successfully');
                
                await this.delay(2000);
                await this.redirectToApp();
            }
        } catch (error) {
            this.handleAuthError(error, submitBtn);
            this.updateStatus('register-status', `Registration failed: ${error.message}`);
        } finally {
            this.mark('register-end');
            this.measure('register-duration', 'register-start', 'register-end');
        }
    }

    async handleSocialAuth(e) {
        e.preventDefault();
        const provider = e.currentTarget.dataset.provider;
        
        try {
            this.showToast(`Connecting to ${this.capitalizeFirst(provider)}...`, 'info');
            
            // Modern Web Authentication API integration would go here
            const result = await this.authenticateWithProvider(provider);
            
            if (result.success) {
                this.showSuccessModal(`Successfully connected with ${this.capitalizeFirst(provider)}!`);
                await this.delay(2000);
                await this.redirectToApp();
            }
        } catch (error) {
            this.showToast(`Failed to connect with ${this.capitalizeFirst(provider)}`, 'error');
            console.error(`Social auth error (${provider}):`, error);
        }
    }

    togglePasswordVisibility(e) {
        const toggle = e.currentTarget;
        const input = toggle.parentElement.querySelector('input[type="password"], input[type="text"]');
        const icon = toggle.querySelector('i');
        
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
        const value = input.value.trim();
        const type = input.type;
        const name = input.name;
        const errorElement = document.getElementById(`${name}-error`) || 
                           document.getElementById(`${input.id.replace(input.id.split(/(?=[A-Z])/).join('-').toLowerCase(), '')}-error`);
        
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
        
        if (errorElement) {
            if (isValid) {
                this.clearFieldError(errorElement.id);
            } else {
                this.showFieldError(errorElement.id, message);
            }
        }
        
        // Update input visual state
        input.setAttribute('aria-invalid', !isValid);
        return isValid;
    }

    updatePasswordStrength() {
        const password = this.registerPassword.value;
        const strengthElement = document.querySelector('.strength-fill');
        const strengthText = document.querySelector('.strength-text');
        
        if (!password) {
            strengthElement.className = 'strength-fill';
            strengthText.textContent = 'Password strength';
            return;
        }
        
        const strength = this.calculatePasswordStrength(password);
        strengthElement.className = `strength-fill ${strength.level}`;
        strengthText.textContent = strength.text;
        
        // Announce to screen readers
        this.announceToScreenReader(`Password strength: ${strength.text}`);
    }

    validatePasswordMatch() {
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
        
        // Length check
        if (password.length >= 8) score += 1;
        if (password.length >= 12) score += 1;
        
        // Character variety
        if (/[a-z]/.test(password)) score += 1;
        if (/[A-Z]/.test(password)) score += 1;
        if (/[0-9]/.test(password)) score += 1;
        if (/[^A-Za-z0-9]/.test(password)) score += 1;
        
        // Pattern checks
        if (!/(.)\1{2,}/.test(password)) score += 1; // No repeated characters
        if (!/(?:abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i.test(password)) score += 1;
        
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
            return { isValid: false, message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' };
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
        // Simulate API call with realistic delay
        await this.delay(Math.random() * 1000 + 1000);
        
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
        await this.delay(1000);
        
        // Simulate success/failure
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
        this.setButtonLoading(button, false);
        
        let message = 'Authentication failed. Please try again.';
        
        if (error.message.includes('network') || error.message.includes('Network')) {
            message = 'Network error. Please check your connection and try again.';
        } else if (error.message.includes('credentials') || error.message.includes('Invalid')) {
            message = 'Invalid credentials. Please check your email and password.';
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
        
        // Reset after animation
        setTimeout(() => {
            button.style.background = '';
        }, 3000);
    }

    showSuccessModal(message) {
        const modal = this.successModal;
        const messageEl = document.getElementById('successMessage');
        
        if (messageEl) messageEl.textContent = message;
        
        if (modal) {
            modal.classList.add('show');
            modal.setAttribute('aria-hidden', 'false');
            
            // Focus management
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
        
        // Trigger animation
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });
        
        // Auto remove
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
            document.body.removeChild(announcement);
        }, 1000);
    }

    async initializeBackgroundEffects() {
        try {
            // Initialize 3D background if Three.js is available
            if (window.THREE && this.canvas3D) {
                await this.setup3DBackground();
            }
            
            // Initialize matrix effect
            if (this.matrixCanvas) {
                this.setupMatrixEffect();
            }
            
            // Initialize cursor follower
            this.setupCursorFollower();
            
            // Initialize floating code animation
            this.setupFloatingCodeAnimation();
            
        } catch (error) {
            console.warn('Background effects initialization failed:', error);
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
            
            // Create floating shapes with instanced geometry for performance
            const geometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
            const material = new THREE.MeshBasicMaterial({
                color: 0xF59E0B,
                wireframe: true,
                transparent: true,
                opacity: 0.4
            });
            
            const shapes = [];
            const shapeCount = window.innerWidth < 768 ? 15 : 30; // Responsive shape count
            
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
            
            // Central music cube
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
            
            // Mouse interaction with performance optimization
            let mouseX = 0;
            let mouseY = 0;
            let targetX = 0;
            let targetY = 0;
            
            const handleMouseMove = this.throttle((e) => {
                targetX = (e.clientX / window.innerWidth) * 2 - 1;
                targetY = -(e.clientY / window.innerHeight) * 2 + 1;
            }, 16); // ~60fps
            
            document.addEventListener('mousemove', handleMouseMove);
            
            // Animation loop with performance monitoring
            let lastTime = 0;
            const animate = (currentTime) => {
                const deltaTime = currentTime - lastTime;
                lastTime = currentTime;
                
                // Smooth mouse following
                mouseX += (targetX - mouseX) * 0.05;
                mouseY += (targetY - mouseY) * 0.05;
                
                // Animate shapes
                shapes.forEach((shape, index) => {
                    shape.rotation.x += 0.005;
                    shape.rotation.y += 0.005;
                    shape.position.y += Math.sin(currentTime * 0.001 + index) * 0.003;
                });
                
                // Animate music cube
                musicCube.rotation.x += 0.008;
                musicCube.rotation.y += 0.012;
                musicCube.scale.setScalar(1 + Math.sin(currentTime * 0.004) * 0.1);
                
                // Update camera
                camera.position.x += (mouseX * 3 - camera.position.x) * 0.05;
                camera.position.y += (mouseY * 3 - camera.position.y) * 0.05;
                camera.lookAt(0, 0, 0);
                
                renderer.render(scene, camera);
                requestAnimationFrame(animate);
            };
            
            animate(0);
            
            // Handle resize
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
            
            // Cleanup on page unload
            window.addEventListener('beforeunload', () => {
                clearInterval(matrixInterval);
            });
            
        } catch (error) {
            console.warn('Matrix effect setup failed:', error);
        }
    }

    setupCursorFollower() {
        const follower = document.querySelector('.cursor-follower');
        if (!follower || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
        
        let mouseX = 0;
        let mouseY = 0;
        let followerX = 0;
        let followerY = 0;
        
        const handleMouseMove = this.throttle((e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        }, 16);
        
        document.addEventListener('mousemove', handleMouseMove);
        
        const animateFollower = () => {
            followerX += (mouseX - followerX) * 0.1;
            followerY += (mouseY - followerY) * 0.1;
            
            follower.style.left = `${followerX}px`;
            follower.style.top = `${followerY}px`;
            
            requestAnimationFrame(animateFollower);
        };
        
        animateFollower();
    }

    setupFloatingCodeAnimation() {
        if (window.gsap) {
            gsap.to('.code-snippet', {
                y: -10,
                duration: 2,
                ease: "sine.inOut",
                yoyo: true,
                repeat: -1,
                stagger: 0.5
            });
        }
    }

    animateTransition(toForm) {
        if (window.gsap) {
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
        }
    }

    setupAccessibility() {
        // Enhanced keyboard navigation
        this.setupKeyboardNavigation();
        
        // ARIA live regions
        this.setupLiveRegions();
        
        // Focus management
        this.setupFocusManagement();
    }

    setupKeyboardNavigation() {
        // Tab trap for modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.successModal?.classList.contains('show')) {
                this.closeSuccessModal();
            }
        });
    }

    setupLiveRegions() {
        // Ensure status regions exist
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
        // Focus first input when switching forms
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const target = mutation.target;
                    if (target.classList.contains('active')) {
                        // Focus first input in register form
                        setTimeout(() => {
                            this.registerName?.focus();
                        }, 100);
                    } else {
                        // Focus first input in login form  
                        setTimeout(() => {
                            this.loginEmail?.focus();
                        }, 100);
                    }
                }
            });
        });
        
        observer.observe(this.container, {
            attributes: true,
            attributeFilter: ['class']
        });
    }

    setupPerformanceMonitoring() {
        // Monitor Core Web Vitals
        if ('PerformanceObserver' in window) {
            try {
                const observer = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (entry.entryType === 'largest-contentful-paint') {
                            console.log('LCP:', entry.startTime);
                        }
                        if (entry.entryType === 'first-input-delay') {
                            console.log('FID:', entry.processingStart - entry.startTime);
                        }
                        if (entry.entryType === 'layout-shift') {
                            console.log('CLS:', entry.value);
                        }
                    }
                });
                
                observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input-delay', 'layout-shift'] });
            } catch (error) {
                console.warn('Performance monitoring setup failed:', error);
            }
        }
    }

    handleResize() {
        // Update canvas sizes
        if (this.matrixCanvas) {
            this.matrixCanvas.width = window.innerWidth;
            this.matrixCanvas.height = window.innerHeight;
        }
        
        // Update responsive breakpoints
        this.updateResponsiveState();
    }

    updateResponsiveState() {
        const isMobile = window.innerWidth < 768;
        document.documentElement.setAttribute('data-mobile', isMobile);
    }

    handleBeforeUnload(e) {
        // Clean up resources
        this.cleanup();
    }

    handleKeyDown(e) {
        // Global keyboard shortcuts
        if (e.ctrlKey || e.metaKey) {
            if (e.key === 'k') {
                e.preventDefault();
                // Focus search or main action
                const activeForm = this.container.classList.contains('active') ? 'register' : 'login';
                const firstInput = activeForm === 'register' ? this.registerName : this.loginEmail;
                firstInput?.focus();
            }
        }
    }

    handleForgotPassword(e) {
        e.preventDefault();
        const email = this.loginEmail?.value;
        
        if (!email) {
            this.showToast('Please enter your email address first', 'warning');
            this.loginEmail?.focus();
            return;
        }
        
        if (!this.isValidEmail(email)) {
            this.showToast('Please enter a valid email address', 'error');
            this.loginEmail?.focus();
            return;
        }
        
        this.showToast('Password reset link sent to your email!', 'success');
    }

    async redirectToApp() {
        try {
            // Use Navigation API if available
            if ('navigation' in window) {
                await window.navigation.navigate('/dashboard');
            } else {
                window.location.href = '/dashboard';
            }
        } catch (error) {
            console.error('Navigation failed:', error);
            window.location.href = '/dashboard';
        }
    }

    cleanup() {
        // Remove event listeners and intervals
        // Clear any pending timeouts
        // Clean up Three.js resources
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

// Initialize the application
window.authManager = new AuthManager();

// Service Worker registration for PWA capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Progressive enhancement
document.documentElement.className = document.documentElement.className.replace('no-js', 'js');
