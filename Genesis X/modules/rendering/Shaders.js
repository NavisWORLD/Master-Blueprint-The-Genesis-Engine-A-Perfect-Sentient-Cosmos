/**
 * Shaders.js - Shader Management
 * 
 * Handles shader compilation and management for the Genesis Engine.
 * This module manages vertex and fragment shaders for Soul Dust particles,
 * quantum effects, and atmospheric scattering.
 */

class Shaders {
    constructor() {
        this.isInitialized = false;
        this.shaders = new Map();
        this.materials = new Map();
        
        // Shader settings
        this.soulDustShaderEnabled = true;
        this.quantumShaderEnabled = true;
        this.atmosphericShaderEnabled = true;
        
        // Soul Dust shader parameters
        this.soulDustParticleSize = 2.0;
        this.soulDustGlowIntensity = 1.5;
        this.soulDustPulseSpeed = 1.0;
        
        // Quantum shader parameters
        this.quantumEntanglementStrength = 0.8;
        this.quantumSuperpositionBlend = 0.5;
        this.quantumPhaseSpeed = 2.0;
        
        // Atmospheric shader parameters
        this.atmosphereHeight = 100.0;
        this.atmosphereDensity = 0.1;
        this.atmosphereColor = new THREE.Color(0x87CEEB);
    }

    /**
     * Initialize the shader manager
     */
    initialize() {
        try {
            // Initialize shaders
            this.initializeSoulDustShaders();
            this.initializeQuantumShaders();
            this.initializeAtmosphericShaders();
            
            this.isInitialized = true;
            console.log('🎭 Shaders initialized with custom effects');
            
        } catch (error) {
            console.error('❌ Failed to initialize shaders:', error);
            this.isInitialized = false;
        }
    }

    /**
     * Initialize Soul Dust particle shaders
     */
    initializeSoulDustShaders() {
        if (!this.soulDustShaderEnabled) return;
        
        try {
            // Vertex shader for Soul Dust particles
            const soulDustVertexShader = `
                attribute float size;
                attribute float energy;
                attribute vec3 color;
                attribute float phase;
                
                varying float vEnergy;
                varying vec3 vColor;
                varying float vPhase;
                
                uniform float time;
                uniform float pulseSpeed;
                
                void main() {
                    vEnergy = energy;
                    vColor = color;
                    vPhase = phase;
                    
                    // Pulsing effect
                    float pulse = sin(time * pulseSpeed + phase) * 0.5 + 0.5;
                    float finalSize = size * pulse * energy;
                    
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = finalSize * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `;
            
            // Fragment shader for Soul Dust particles
            const soulDustFragmentShader = `
                varying float vEnergy;
                varying vec3 vColor;
                varying float vPhase;
                
                uniform float time;
                uniform float glowIntensity;
                
                void main() {
                    // Create circular particle
                    vec2 center = gl_PointCoord - vec2(0.5);
                    float dist = length(center);
                    
                    if (dist > 0.5) discard;
                    
                    // Energy-based glow
                    float glow = 1.0 - dist * 2.0;
                    glow = pow(glow, 2.0) * glowIntensity * vEnergy;
                    
                    // Color with energy influence
                    vec3 finalColor = vColor * glow;
                    
                    // Add pulsing effect
                    float pulse = sin(time + vPhase) * 0.3 + 0.7;
                    finalColor *= pulse;
                    
                    gl_FragColor = vec4(finalColor, glow);
                }
            `;
            
            // Create shader material
            const soulDustMaterial = new THREE.ShaderMaterial({
                vertexShader: soulDustVertexShader,
                fragmentShader: soulDustFragmentShader,
                transparent: true,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
                uniforms: {
                    time: { value: 0.0 },
                    pulseSpeed: { value: this.soulDustPulseSpeed },
                    glowIntensity: { value: this.soulDustGlowIntensity }
                }
            });
            
            this.shaders.set('soulDust', {
                vertexShader: soulDustVertexShader,
                fragmentShader: soulDustFragmentShader,
                material: soulDustMaterial
            });
            
            console.log('✨ Soul Dust shaders initialized');
        } catch (error) {
            console.warn('⚠️ Failed to initialize Soul Dust shaders:', error);
        }
    }

    /**
     * Initialize quantum effect shaders
     */
    initializeQuantumShaders() {
        if (!this.quantumShaderEnabled) return;
        
        try {
            // Vertex shader for quantum effects
            const quantumVertexShader = `
                attribute float entanglement;
                attribute float superposition;
                attribute float phase;
                
                varying float vEntanglement;
                varying float vSuperposition;
                varying float vPhase;
                
                uniform float time;
                uniform float entanglementStrength;
                uniform float superpositionBlend;
                
                void main() {
                    vEntanglement = entanglement;
                    vSuperposition = superposition;
                    vPhase = phase;
                    
                    // Quantum superposition effect
                    vec3 quantumPosition = position;
                    quantumPosition += sin(time + phase) * entanglementStrength * entanglement;
                    
                    vec4 mvPosition = modelViewMatrix * vec4(quantumPosition, 1.0);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `;
            
            // Fragment shader for quantum effects
            const quantumFragmentShader = `
                varying float vEntanglement;
                varying float vSuperposition;
                varying float vPhase;
                
                uniform float time;
                uniform float quantumPhaseSpeed;
                
                void main() {
                    // Quantum interference pattern
                    float interference = sin(time * quantumPhaseSpeed + vPhase) * 0.5 + 0.5;
                    
                    // Entanglement visualization
                    float entanglementGlow = vEntanglement * interference;
                    
                    // Superposition blending
                    vec3 color = mix(vec3(0.0, 1.0, 1.0), vec3(1.0, 0.0, 1.0), vSuperposition);
                    color *= entanglementGlow;
                    
                    gl_FragColor = vec4(color, entanglementGlow);
                }
            `;
            
            // Create quantum material
            const quantumMaterial = new THREE.ShaderMaterial({
                vertexShader: quantumVertexShader,
                fragmentShader: quantumFragmentShader,
                transparent: true,
                blending: THREE.AdditiveBlending,
                uniforms: {
                    time: { value: 0.0 },
                    entanglementStrength: { value: this.quantumEntanglementStrength },
                    superpositionBlend: { value: this.quantumSuperpositionBlend },
                    quantumPhaseSpeed: { value: this.quantumPhaseSpeed }
                }
            });
            
            this.shaders.set('quantum', {
                vertexShader: quantumVertexShader,
                fragmentShader: quantumFragmentShader,
                material: quantumMaterial
            });
            
            console.log('✨ Quantum shaders initialized');
        } catch (error) {
            console.warn('⚠️ Failed to initialize quantum shaders:', error);
        }
    }

    /**
     * Initialize atmospheric scattering shaders
     */
    initializeAtmosphericShaders() {
        if (!this.atmosphericShaderEnabled) return;
        
        try {
            // Vertex shader for atmospheric scattering
            const atmosphericVertexShader = `
                varying vec3 vWorldPosition;
                varying vec3 vViewDirection;
                
                void main() {
                    vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
                    vViewDirection = normalize(cameraPosition - vWorldPosition);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `;
            
            // Fragment shader for atmospheric scattering
            const atmosphericFragmentShader = `
                varying vec3 vWorldPosition;
                varying vec3 vViewDirection;
                
                uniform vec3 atmosphereColor;
                uniform float atmosphereHeight;
                uniform float atmosphereDensity;
                uniform vec3 sunDirection;
                
                void main() {
                    // Calculate atmospheric scattering
                    float height = vWorldPosition.y;
                    float density = exp(-height / atmosphereHeight) * atmosphereDensity;
                    
                    // Rayleigh scattering (blue sky)
                    float rayleigh = 1.0 - exp(-density * 0.1);
                    
                    // Mie scattering (hazy sky)
                    float mie = 1.0 - exp(-density * 0.05);
                    
                    // Combine scattering effects
                    vec3 scattered = atmosphereColor * rayleigh + vec3(1.0) * mie;
                    
                    gl_FragColor = vec4(scattered, density);
                }
            `;
            
            // Create atmospheric material
            const atmosphericMaterial = new THREE.ShaderMaterial({
                vertexShader: atmosphericVertexShader,
                fragmentShader: atmosphericFragmentShader,
                transparent: true,
                blending: THREE.AdditiveBlending,
                uniforms: {
                    atmosphereColor: { value: this.atmosphereColor },
                    atmosphereHeight: { value: this.atmosphereHeight },
                    atmosphereDensity: { value: this.atmosphereDensity },
                    sunDirection: { value: new THREE.Vector3(0, 1, 0) }
                }
            });
            
            this.shaders.set('atmospheric', {
                vertexShader: atmosphericVertexShader,
                fragmentShader: atmosphericFragmentShader,
                material: atmosphericMaterial
            });
            
            console.log('✨ Atmospheric shaders initialized');
        } catch (error) {
            console.warn('⚠️ Failed to initialize atmospheric shaders:', error);
        }
    }

    /**
     * Update shader uniforms
     * @param {number} deltaTime - Time since last update
     */
    update(deltaTime) {
        if (!this.isInitialized) return;
        
        const time = performance.now() * 0.001;
        
        // Update Soul Dust shader
        const soulDustShader = this.shaders.get('soulDust');
        if (soulDustShader && soulDustShader.material) {
            soulDustShader.material.uniforms.time.value = time;
        }
        
        // Update quantum shader
        const quantumShader = this.shaders.get('quantum');
        if (quantumShader && quantumShader.material) {
            quantumShader.material.uniforms.time.value = time;
        }
    }

    /**
     * Get shader material
     * @param {string} shaderName - Name of shader
     * @returns {THREE.ShaderMaterial} - Shader material
     */
    getShaderMaterial(shaderName) {
        const shader = this.shaders.get(shaderName);
        return shader ? shader.material : null;
    }

    /**
     * Set shader parameter
     * @param {string} shaderName - Name of shader
     * @param {string} parameter - Parameter name
     * @param {*} value - Parameter value
     */
    setShaderParameter(shaderName, parameter, value) {
        const shader = this.shaders.get(shaderName);
        if (shader && shader.material && shader.material.uniforms[parameter]) {
            shader.material.uniforms[parameter].value = value;
        }
    }

    /**
     * Get shader statistics
     * @returns {Object} - Shader statistics
     */
    getStats() {
        return {
            isInitialized: this.isInitialized,
            shaderCount: this.shaders.size,
            shaders: Array.from(this.shaders.keys()),
            soulDustShaderEnabled: this.soulDustShaderEnabled,
            quantumShaderEnabled: this.quantumShaderEnabled,
            atmosphericShaderEnabled: this.atmosphericShaderEnabled
        };
    }

    /**
     * Destroy the shader manager
     */
    destroy() {
        // Dispose of all shader materials
        this.shaders.forEach(shader => {
            if (shader.material) {
                shader.material.dispose();
            }
        });
        
        this.shaders.clear();
        this.materials.clear();
        this.isInitialized = false;
        console.log('🗑️ Shaders destroyed');
    }
}

// Create global shaders instance
window.Shaders = new Shaders();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Shaders;
} 