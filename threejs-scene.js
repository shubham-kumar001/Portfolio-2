// js/threejs-scene.js
class ThreeJSScene {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.objects = [];
        this.clock = new THREE.Clock();
        
        this.init();
    }

    init() {
        // Check if Three.js is available
        if (typeof THREE === 'undefined') {
            console.warn('Three.js not loaded. Skipping 3D scene.');
            return;
        }

        // Create container
        const container = document.getElementById('threejs-container');
        if (!container) return;

        // Scene setup
        this.setupScene(container);
        this.setupCamera();
        this.setupRenderer(container);
        this.setupLights();
        this.createObjects();
        this.setupControls();
        this.animate();
        this.handleResize();
    }

    setupScene(container) {
        this.scene = new THREE.Scene();
        this.scene.background = null;
        this.scene.fog = new THREE.Fog(0x0f172a, 10, 50);
    }

    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 5;
    }

    setupRenderer(container) {
        this.renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        container.appendChild(this.renderer.domElement);
    }

    setupLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        // Directional light
        const directionalLight = new THREE.DirectionalLight(0x6366f1, 1);
        directionalLight.position.set(5, 5, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);

        // Point lights for accent
        const pointLight1 = new THREE.PointLight(0x8b5cf6, 0.5, 20);
        pointLight1.position.set(-5, 3, 5);
        this.scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0xec4899, 0.5, 20);
        pointLight2.position.set(5, -3, -5);
        this.scene.add(pointLight2);
    }

    createObjects() {
        // Create floating geometric objects
        this.createFloatingGeometry();
        
        // Create particle system
        this.createParticleSystem();
        
        // Create orbiting rings
        this.createOrbitingRings();
    }

    createFloatingGeometry() {
        const geometryTypes = [
            new THREE.IcosahedronGeometry(1, 0),
            new THREE.OctahedronGeometry(1, 0),
            new THREE.TetrahedronGeometry(1, 0),
            new THREE.DodecahedronGeometry(1, 0)
        ];

        const colors = [0x6366f1, 0x8b5cf6, 0xec4899, 0x10b981];

        for (let i = 0; i < 8; i++) {
            const geometry = geometryTypes[Math.floor(Math.random() * geometryTypes.length)];
            const material = new THREE.MeshPhongMaterial({
                color: colors[Math.floor(Math.random() * colors.length)],
                transparent: true,
                opacity: 0.6,
                shininess: 100
            });

            const mesh = new THREE.Mesh(geometry, material);
            
            // Random position
            mesh.position.x = (Math.random() - 0.5) * 20;
            mesh.position.y = (Math.random() - 0.5) * 20;
            mesh.position.z = (Math.random() - 0.5) * 20;
            
            // Random scale
            const scale = 0.5 + Math.random() * 1;
            mesh.scale.set(scale, scale, scale);
            
            // Store animation properties
            mesh.userData = {
                speed: {
                    rotation: {
                        x: (Math.random() - 0.5) * 0.01,
                        y: (Math.random() - 0.5) * 0.01,
                        z: (Math.random() - 0.5) * 0.01
                    },
                    float: {
                        amplitude: 0.5 + Math.random() * 1,
                        frequency: 0.5 + Math.random() * 1,
                        offset: Math.random() * Math.PI * 2
                    }
                }
            };

            this.scene.add(mesh);
            this.objects.push(mesh);
        }
    }

    createParticleSystem() {
        const particleCount = 1000;
        const particles = new THREE.BufferGeometry();
        
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        
        const color = new THREE.Color();
        
        for (let i = 0; i < particleCount; i++) {
            // Position
            positions[i * 3] = (Math.random() - 0.5) * 50;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
            
            // Color
            const hue = Math.random();
            color.setHSL(hue, 0.8, 0.6);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }
        
        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 0.6
        });
        
        const particleSystem = new THREE.Points(particles, particleMaterial);
        particleSystem.userData = {
            speed: 0.001
        };
        
        this.scene.add(particleSystem);
        this.objects.push(particleSystem);
    }

    createOrbitingRings() {
        const ringGeometry = new THREE.TorusGeometry(8, 0.1, 16, 100);
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: 0x6366f1,
            transparent: true,
            opacity: 0.2,
            side: THREE.DoubleSide
        });
        
        for (let i = 0; i < 3; i++) {
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.rotation.x = Math.PI / 2;
            ring.position.z = i * 2 - 2;
            
            ring.userData = {
                speed: 0.001 * (i + 1),
                radius: 8,
                angle: Math.random() * Math.PI * 2
            };
            
            this.scene.add(ring);
            this.objects.push(ring);
        }
    }

    setupControls() {
        // Add subtle auto-rotation
        this.autoRotate = true;
        this.rotationSpeed = 0.0001;
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        const delta = this.clock.getDelta();
        const time = this.clock.getElapsedTime();
        
        // Auto-rotate camera
        if (this.autoRotate) {
            this.camera.position.x = Math.sin(time * this.rotationSpeed) * 10;
            this.camera.position.z = Math.cos(time * this.rotationSpeed) * 10;
            this.camera.lookAt(this.scene.position);
        }
        
        // Animate objects
        this.objects.forEach((object, index) => {
            if (object.userData.speed) {
                // Rotation animation
                if (object.userData.speed.rotation) {
                    object.rotation.x += object.userData.speed.rotation.x;
                    object.rotation.y += object.userData.speed.rotation.y;
                    object.rotation.z += object.userData.speed.rotation.z;
                }
                
                // Floating animation
                if (object.userData.speed.float) {
                    const float = object.userData.speed.float;
                    object.position.y += Math.sin(time * float.frequency + float.offset) * 0.01 * float.amplitude;
                }
                
                // Orbital animation for rings
                if (object.userData.radius) {
                    object.userData.angle += object.userData.speed;
                    object.position.x = Math.cos(object.userData.angle) * object.userData.radius;
                    object.position.z = Math.sin(object.userData.angle) * object.userData.radius;
                }
            }
        });
        
        this.renderer.render(this.scene, this.camera);
    }

    handleResize() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    dispose() {
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        this.objects.forEach(object => {
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(material => material.dispose());
                } else {
                    object.material.dispose();
                }
            }
        });
    }
}

// Initialize Three.js scene
let threeScene = null;

document.addEventListener('DOMContentLoaded', () => {
    if (typeof THREE !== 'undefined') {
        threeScene = new ThreeJSScene();
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (threeScene) {
        threeScene.dispose();
    }
});