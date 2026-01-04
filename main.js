// js/main.js
class ProfessionalPortfolio {
    constructor() {
        this.init();
    }

    init() {
        this.setupPreloader();
        this.setupNavigation();
        this.setupTheme();
        this.setupSound();
        this.setupAnimations();
        this.setupCounters();
        this.setupProgressBars();
        this.setupMagneticButtons();
        this.setupCursor();
        this.setupScrollEffects();
        this.setupContactForm();
        this.setupAudio();
        this.setupThreeJS();
        this.setupParticles();
        this.setupObservers();
    }

    setupPreloader() {
        const preloader = document.querySelector('.preloader');
        const progressBar = document.querySelector('.progress-bar');
        const progressText = document.querySelector('.progress-text');
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 10;
            if (progress > 100) {
                progress = 100;
                clearInterval(interval);
                
                setTimeout(() => {
                    preloader.classList.add('fade-out');
                    setTimeout(() => {
                        preloader.style.display = 'none';
                        this.triggerWelcomeAnimation();
                    }, 500);
                }, 500);
            }
            
            progressBar.style.width = `${progress}%`;
            progressText.textContent = `${Math.round(progress)}%`;
        }, 50);
    }

    setupNavigation() {
        const menuToggle = document.getElementById('menuToggle');
        const navMenu = document.querySelector('.nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');
        
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
        
        // Update active nav link on scroll
        window.addEventListener('scroll', () => {
            const sections = document.querySelectorAll('section');
            const scrollPos = window.pageYOffset + 100;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        });
    }

    setupTheme() {
        const themeToggle = document.getElementById('themeToggle');
        const html = document.documentElement;
        
        // Check for saved theme or prefer-color-scheme
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'light' || (!savedTheme && !prefersDark)) {
            html.setAttribute('data-theme', 'light');
        }
        
        themeToggle.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Play sound
            this.playSound('click');
        });
    }

    setupSound() {
        const soundToggle = document.getElementById('soundToggle');
        const html = document.documentElement;
        
        // Check for saved sound preference
        const soundEnabled = localStorage.getItem('sound') !== 'false';
        
        if (!soundEnabled) {
            html.classList.add('sound-off');
        }
        
        soundToggle.addEventListener('click', () => {
            const soundOff = html.classList.toggle('sound-off');
            localStorage.setItem('sound', !soundOff);
            
            // Play sound
            this.playSound('click');
        });
    }

    setupAnimations() {
        // Animate hero title
        const titleWords = document.querySelectorAll('.title-word');
        titleWords.forEach((word, index) => {
            setTimeout(() => {
                word.style.opacity = '1';
                word.style.transform = 'translateY(0)';
            }, index * 200);
        });
        
        // Add scroll animations
        this.setupScrollAnimations();
    }

    setupCounters() {
        const counters = document.querySelectorAll('.stat-number');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const count = parseInt(target.getAttribute('data-count'));
                    const duration = 2000;
                    const increment = count / (duration / 16);
                    let current = 0;
                    
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= count) {
                            target.textContent = count + (target.getAttribute('data-suffix') || '');
                            clearInterval(timer);
                        } else {
                            target.textContent = Math.floor(current);
                        }
                    }, 16);
                    
                    observer.unobserve(target);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => observer.observe(counter));
    }

    setupProgressBars() {
        const progressBars = document.querySelectorAll('.skill-progress, .progress-fill');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const width = entry.target.getAttribute('data-width');
                    entry.target.style.width = width + '%';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        progressBars.forEach(bar => observer.observe(bar));
    }

    setupMagneticButtons() {
        const magneticButtons = document.querySelectorAll('.btn-magnetic');
        
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

    setupCursor() {
        const cursorDot = document.querySelector('.cursor-dot');
        const cursorOutline = document.querySelector('.cursor-outline');
        
        document.addEventListener('mousemove', (e) => {
            cursorDot.style.left = `${e.clientX}px`;
            cursorDot.style.top = `${e.clientY}px`;
            
            setTimeout(() => {
                cursorOutline.style.left = `${e.clientX}px`;
                cursorOutline.style.top = `${e.clientY}px`;
            }, 100);
        });
        
        // Interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .interactive');
        
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorDot.classList.add('active');
                cursorOutline.classList.add('active');
                this.playSound('hover');
            });
            
            el.addEventListener('mouseleave', () => {
                cursorDot.classList.remove('active');
                cursorOutline.classList.remove('active');
            });
            
            el.addEventListener('mousedown', () => {
                cursorDot.classList.add('click');
                cursorOutline.classList.add('click');
            });
            
            el.addEventListener('mouseup', () => {
                cursorDot.classList.remove('click');
                cursorOutline.classList.remove('click');
            });
        });
    }

    setupScrollEffects() {
        const backToTop = document.getElementById('backToTop');
        
        window.addEventListener('scroll', () => {
            // Show/hide back to top button
            if (window.pageYOffset > 500) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
            
            // Update navbar on scroll
            const navbar = document.querySelector('.navbar');
            if (window.pageYOffset > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
        
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.playSound('click');
        });
    }

    setupScrollAnimations() {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        animatedElements.forEach(el => observer.observe(el));
    }

    setupContactForm() {
        const contactForm = document.getElementById('contactForm');
        
        if (contactForm) {
            contactForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const formData = new FormData(contactForm);
                const data = Object.fromEntries(formData);
                
                // Here you would typically send the data to a server
                // For now, we'll just show a success message
                
                const submitButton = contactForm.querySelector('.btn-submit');
                const originalText = submitButton.querySelector('span').textContent;
                
                submitButton.querySelector('span').textContent = 'Sending...';
                submitButton.disabled = true;
                
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                submitButton.querySelector('span').textContent = 'Message Sent!';
                submitButton.style.background = 'var(--success)';
                
                setTimeout(() => {
                    submitButton.querySelector('span').textContent = originalText;
                    submitButton.disabled = false;
                    submitButton.style.background = '';
                    contactForm.reset();
                }, 3000);
                
                this.playSound('click');
            });
        }
    }

    setupAudio() {
        this.hoverSound = document.getElementById('hoverSound');
        this.clickSound = document.getElementById('clickSound');
    }

    playSound(type) {
        if (document.documentElement.classList.contains('sound-off')) return;
        
        const sound = type === 'hover' ? this.hoverSound : this.clickSound;
        
        if (sound) {
            sound.currentTime = 0;
            sound.play().catch(() => {
                // Sound play failed, ignore
            });
        }
    }

    setupThreeJS() {
        // This would be implemented in threejs-scene.js
        console.log('Three.js scene setup');
    }

    setupParticles() {
        // This would be implemented in particles-system.js
        console.log('Particles system setup');
    }

    setupObservers() {
        // Intersection Observer for all animated elements
        const observers = [];
        
        // Stagger animations
        const staggerContainers = document.querySelectorAll('.stagger-container');
        const staggerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.2 });
        
        staggerContainers.forEach(container => staggerObserver.observe(container));
        observers.push(staggerObserver);
        
        // Cleanup
        return observers;
    }

    triggerWelcomeAnimation() {
        // Add welcome animation class to body
        document.body.classList.add('loaded');
        
        // Trigger confetti or other welcome effects
        setTimeout(() => {
            this.createConfetti();
        }, 1000);
    }

    createConfetti() {
        const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'];
        
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = '50%';
            confetti.style.top = '0';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.zIndex = '9999';
            confetti.style.pointerEvents = 'none';
            
            document.body.appendChild(confetti);
            
            // Animation
            const animation = confetti.animate([
                { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
                { transform: `translateY(${window.innerHeight}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
            ], {
                duration: Math.random() * 3000 + 2000,
                easing: 'cubic-bezier(0.215, 0.610, 0.355, 1)'
            });
            
            animation.onfinish = () => confetti.remove();
        }
    }
}

// Initialize portfolio when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const portfolio = new ProfessionalPortfolio();
    
    // Expose to global scope for debugging
    window.portfolio = portfolio;
});