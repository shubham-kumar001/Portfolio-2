// js/particles-system.js
class ParticlesSystem {
    constructor() {
        this.particles = [];
        this.canvas = null;
        this.ctx = null;
        this.width = 0;
        this.height = 0;
        this.mouse = { x: 0, y: 0, radius: 100 };
        this.animationId = null;
        
        this.init();
    }

    init() {
        this.createCanvas();
        this.createParticles();
        this.animate();
        this.setupEventListeners();
    }

    createCanvas() {
        // Create canvas for particles
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'particles-canvas';
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '-1';
        
        document.body.appendChild(this.canvas);
        
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
    }

    resizeCanvas() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    createParticles() {
        const particleCount = Math.min(100, Math.floor((this.width * this.height) / 10000));
        const colors = [
            'rgba(99, 102, 241, 0.6)',
            'rgba(139, 92, 246, 0.6)',
            'rgba(236, 72, 153, 0.6)',
            'rgba(16, 185, 129, 0.6)',
            'rgba(245, 158, 11, 0.6)'
        ];

        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                color: colors[Math.floor(Math.random() * colors.length)],
                originalX: Math.random() * this.width,
                originalY: Math.random() * this.height,
                angle: Math.random() * Math.PI * 2,
                frequency: Math.random() * 0.02 + 0.01,
                amplitude: Math.random() * 20 + 10
            });
        }
    }

    drawParticles() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Draw connecting lines
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    const opacity = 1 - (distance / 100);
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(99, 102, 241, ${opacity * 0.2})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
        
        // Draw particles
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.fillStyle = particle.color;
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Add glow effect
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color.replace('0.6', '0.2');
            this.ctx.fill();
        });
    }

    updateParticles() {
        this.particles.forEach(particle => {
            // Apply floating motion
            particle.angle += particle.frequency;
            particle.x = particle.originalX + Math.sin(particle.angle) * particle.amplitude;
            particle.y = particle.originalY + Math.cos(particle.angle * 0.7) * particle.amplitude;
            
            // Add mouse interaction
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.mouse.radius) {
                const force = (this.mouse.radius - distance) / this.mouse.radius;
                const angle = Math.atan2(dy, dx);
                
                particle.x -= Math.cos(angle) * force * 10;
                particle.y -= Math.sin(angle) * force * 10;
            }
            
            // Keep particles within bounds
            if (particle.x < 0) particle.x = this.width;
            if (particle.x > this.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.height;
            if (particle.y > this.height) particle.y = 0;
        });
    }

    animate() {
        this.updateParticles();
        this.drawParticles();
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
        });
        
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        
        document.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.mouse.x = e.touches[0].clientX;
            this.mouse.y = e.touches[0].clientY;
        }, { passive: false });
        
        // Mouse leave event
        document.addEventListener('mouseleave', () => {
            this.mouse.x = -100;
            this.mouse.y = -100;
        });
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

// Initialize particles system
let particlesSystem = null;

document.addEventListener('DOMContentLoaded', () => {
    particlesSystem = new ParticlesSystem();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (particlesSystem) {
        particlesSystem.destroy();
    }
});

// Export for use in main.js
window.ParticlesSystem = ParticlesSystem;