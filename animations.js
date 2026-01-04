// js/animations.js
class AdvancedAnimations {
    constructor() {
        this.animations = new Map();
        this.scrollEffects = [];
        this.parallaxElements = [];
        this.intersectionObserver = null;
        
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupParallax();
        this.setupIntersectionObserver();
        this.setupCustomAnimations();
        this.setupPageTransitions();
        this.setupHoverAnimations();
        this.setupClickAnimations();
    }

    setupScrollAnimations() {
        // Add scroll progress bar
        this.createScrollProgress();
        
        // Add scroll-triggered animations
        window.addEventListener('scroll', () => {
            this.updateScrollProgress();
            this.updateParallax();
            this.triggerScrollAnimations();
        });
    }

    createScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        document.body.appendChild(progressBar);
    }

    updateScrollProgress() {
        const progressBar = document.querySelector('.scroll-progress');
        if (!progressBar) return;
        
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        
        progressBar.style.width = scrolled + '%';
    }

    setupParallax() {
        this.parallaxElements = Array.from(document.querySelectorAll('.parallax-element'));
        
        if (this.parallaxElements.length > 0) {
            window.addEventListener('scroll', () => this.updateParallax());
            window.addEventListener('resize', () => this.updateParallax());
        }
    }

    updateParallax() {
        const scrollTop = window.pageYOffset;
        
        this.parallaxElements.forEach(element => {
            const speed = parseFloat(element.dataset.speed) || 0.5;
            const yPos = -(scrollTop * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }

    setupIntersectionObserver() {
        this.intersectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateOnScroll(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );
        
        // Observe all elements with animation classes
        const animatedElements = document.querySelectorAll(
            '.animate-on-scroll, .stagger-container, [data-animate]'
        );
        
        animatedElements.forEach(element => {
            this.intersectionObserver.observe(element);
        });
    }

    animateOnScroll(element) {
        if (element.classList.contains('stagger-container')) {
            this.animateStaggerContainer(element);
        } else {
            element.classList.add('visible');
            
            // Trigger custom animation if specified
            const animationType = element.dataset.animation;
            if (animationType) {
                this.playCustomAnimation(element, animationType);
            }
        }
    }

    animateStaggerContainer(container) {
        container.classList.add('visible');
        
        const items = container.querySelectorAll('.stagger-item');
        items.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('visible');
            }, index * 100);
        });
    }

    setupCustomAnimations() {
        // Text reveal animations
        this.setupTextReveal();
        
        // Counter animations
        this.setupCounters();
        
        // Progress bar animations
        this.setupProgressBars();
        
        // Typing animation
        this.setupTypingAnimation();
        
        // Particle effects
        this.setupParticleEffects();
    }

    setupTextReveal() {
        const revealElements = document.querySelectorAll('.text-reveal');
        
        revealElements.forEach(element => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        element.classList.add('revealed');
                        observer.unobserve(element);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(element);
        });
    }

    setupCounters() {
        const counters = document.querySelectorAll('.counter');
        
        counters.forEach(counter => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateCounter(counter);
                        observer.unobserve(counter);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(counter);
        });
    }

    animateCounter(element) {
        const target = parseInt(element.dataset.target) || 100;
        const duration = parseInt(element.dataset.duration) || 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target + (element.dataset.suffix || '');
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + (element.dataset.suffix || '');
            }
        }, 16);
    }

    setupProgressBars() {
        const progressBars = document.querySelectorAll('.progress-bar-animate');
        
        progressBars.forEach(bar => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const width = bar.dataset.width || '100%';
                        bar.style.width = width;
                        observer.unobserve(bar);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(bar);
        });
    }

    setupTypingAnimation() {
        const typingElements = document.querySelectorAll('.typing-animation');
        
        typingElements.forEach(element => {
            const text = element.textContent;
            element.textContent = '';
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.typeText(element, text);
                        observer.unobserve(element);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(element);
        });
    }

    typeText(element, text) {
        let index = 0;
        const speed = 50; // milliseconds per character
        
        function type() {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }

    setupParticleEffects() {
        // Button particle effects
        const buttons = document.querySelectorAll('.btn-particle');
        
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.createButtonParticles(e, button);
            });
        });
    }

    createButtonParticles(event, button) {
        const rect = button.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981'];
        
        for (let i = 0; i < 10; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.position = 'absolute';
            particle.style.width = '4px';
            particle.style.height = '4px';
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            particle.style.borderRadius = '50%';
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            particle.style.pointerEvents = 'none';
            
            button.appendChild(particle);
            
            // Animation
            const angle = Math.random() * Math.PI * 2;
            const velocity = 2 + Math.random() * 2;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            
            let posX = 0;
            let posY = 0;
            let opacity = 1;
            
            function animate() {
                posX += vx;
                posY += vy;
                opacity -= 0.02;
                
                particle.style.transform = `translate(${posX}px, ${posY}px)`;
                particle.style.opacity = opacity;
                
                if (opacity > 0) {
                    requestAnimationFrame(animate);
                } else {
                    particle.remove();
                }
            }
            
            animate();
        }
    }

    setupPageTransitions() {
        // Add page transition class to body
        document.body.classList.add('page-transition');
        
        // Handle link clicks for smooth transitions
        document.querySelectorAll('a').forEach(link => {
            if (link.href && link.href.includes(window.location.origin)) {
                link.addEventListener('click', (e) => {
                    if (!link.hash) {
                        e.preventDefault();
                        this.transitionToPage(link.href);
                    }
                });
            }
        });
    }

    transitionToPage(url) {
        document.body.classList.add('page-exit');
        
        setTimeout(() => {
            window.location.href = url;
        }, 500);
    }

    setupHoverAnimations() {
        // Tilt effect
        this.setupTiltEffect();
        
        // Magnetic buttons
        this.setupMagneticButtons();
        
        // Hover sound effects
        this.setupHoverSounds();
    }

    setupTiltEffect() {
        const tiltElements = document.querySelectorAll('.tilt-effect');
        
        tiltElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                element.style.transform = `
                    perspective(1000px)
                    rotateX(${rotateX}deg)
                    rotateY(${rotateY}deg)
                    scale3d(1.05, 1.05, 1.05)
                `;
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            });
        });
    }

    setupMagneticButtons() {
        const magneticButtons = document.querySelectorAll('.magnetic-button');
        
        magneticButtons.forEach(button => {
            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                const distance = Math.sqrt(x * x + y * y);
                const maxDistance = 50;
                
                if (distance < maxDistance) {
                    const scale = 1 + (maxDistance - distance) / maxDistance * 0.1;
                    button.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px) scale(${scale})`;
                }
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translate(0, 0) scale(1)';
            });
        });
    }

    setupHoverSounds() {
        const hoverElements = document.querySelectorAll('.hover-sound');
        
        hoverElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.playHoverSound();
            });
        });
    }

    playHoverSound() {
        // Create audio context for hover sounds
        if (!window.audioContext) {
            window.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        const oscillator = window.audioContext.createOscillator();
        const gainNode = window.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(window.audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, window.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, window.audioContext.currentTime + 0.01);
        gainNode.gain.linearRampToValueAtTime(0, window.audioContext.currentTime + 0.1);
        
        oscillator.start(window.audioContext.currentTime);
        oscillator.stop(window.audioContext.currentTime + 0.1);
    }

    setupClickAnimations() {
        // Ripple effect
        this.setupRippleEffect();
        
        // Click animations
        this.setupClickSounds();
    }

    setupRippleEffect() {
        const rippleElements = document.querySelectorAll('.ripple-effect');
        
        rippleElements.forEach(element => {
            element.addEventListener('click', (e) => {
                this.createRipple(e, element);
            });
        });
    }

    createRipple(event, element) {
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    setupClickSounds() {
        const clickElements = document.querySelectorAll('.click-sound');
        
        clickElements.forEach(element => {
            element.addEventListener('click', () => {
                this.playClickSound();
            });
        });
    }

    playClickSound() {
        if (!window.audioContext) {
            window.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        const oscillator = window.audioContext.createOscillator();
        const gainNode = window.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(window.audioContext.destination);
        
        oscillator.frequency.value = 1200;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, window.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.2, window.audioContext.currentTime + 0.01);
        gainNode.gain.linearRampToValueAtTime(0, window.audioContext.currentTime + 0.1);
        
        oscillator.start(window.audioContext.currentTime);
        oscillator.stop(window.audioContext.currentTime + 0.1);
    }

    playCustomAnimation(element, animationType) {
        switch (animationType) {
            case 'fadeIn':
                element.classList.add('animate-fade');
                break;
            case 'slideUp':
                element.classList.add('animate-slide-up');
                break;
            case 'scale':
                element.classList.add('animate-scale');
                break;
            case 'rotate':
                element.classList.add('animate-rotate');
                break;
            case 'bounce':
                element.classList.add('animate-bounce');
                break;
        }
    }

    triggerScrollAnimations() {
        this.scrollEffects.forEach(effect => {
            effect();
        });
    }

    destroy() {
        if (this.intersectionObserver) {
            this.intersectionObserver.disconnect();
        }
        
        // Clean up event listeners
        window.removeEventListener('scroll', this.updateScrollProgress);
        window.removeEventListener('scroll', this.updateParallax);
        window.removeEventListener('resize', this.updateParallax);
    }
}

// Initialize animations
let advancedAnimations = null;

document.addEventListener('DOMContentLoaded', () => {
    advancedAnimations = new AdvancedAnimations();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (advancedAnimations) {
        advancedAnimations.destroy();
    }
});

// Export for use in main.js
window.AdvancedAnimations = AdvancedAnimations;