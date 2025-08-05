/**
 * PostProcessor.js - Post-Processing Pipeline
 * 
 * Handles post-processing effects for the Genesis Engine.
 * This module manages bloom, god rays, lens flares, and atmospheric scattering.
 */

class PostProcessor {
    constructor() {
        this.isInitialized = false;
        this.composer = null;
        this.effects = new Map();
        
        // Effect settings
        this.bloomEnabled = true;
        this.godRaysEnabled = true;
        this.lensFlareEnabled = true;
        this.atmosphericScatteringEnabled = true;
        
        // Bloom settings
        this.bloomStrength = 1.5;
        this.bloomRadius = 0.5;
        this.bloomThreshold = 0.85;
        
        // God rays settings
        this.godRaysIntensity = 0.5;
        this.godRaysDecay = 0.95;
        this.godRaysDensity = 0.96;
        this.godRaysWeight = 0.4;
        this.godRaysExposure = 0.6;
        this.godRaysClampMax = 1.0;
        
        // Lens flare settings
        this.lensFlareIntensity = 1.0;
        this.lensFlareDistance = 1000;
        
        // Atmospheric scattering settings
        this.atmosphereHeight = 100;
        this.atmosphereDensity = 0.1;
        this.atmosphereColor = new THREE.Color(0x87CEEB);
    }

    /**
     * Initialize the post-processor with Three.js effects
     */
    initialize(renderer, scene, camera) {
        try {
            if (!renderer || !scene || !camera) {
                throw new Error('Renderer, scene, and camera required for post-processor');
            }
            
            // Create effect composer
            this.composer = new THREE.EffectComposer(renderer);
            
            // Create render pass
            const renderPass = new THREE.RenderPass(scene, camera);
            this.composer.addPass(renderPass);
            
            // Initialize effects
            this.initializeBloom();
            this.initializeGodRays();
            this.initializeLensFlare();
            this.initializeAtmosphericScattering();
            
            this.isInitialized = true;
            console.log('✨ PostProcessor initialized with effects');
            
        } catch (error) {
            console.error('❌ Failed to initialize post-processor:', error);
            this.isInitialized = false;
        }
    }

    /**
     * Initialize bloom effect
     */
    initializeBloom() {
        if (!this.bloomEnabled || !this.composer) return;
        
        try {
            const bloomPass = new THREE.UnrealBloomPass(
                new THREE.Vector2(window.innerWidth, window.innerHeight),
                this.bloomStrength,
                this.bloomRadius,
                this.bloomThreshold
            );
            
            this.effects.set('bloom', bloomPass);
            this.composer.addPass(bloomPass);
            
            console.log('✨ Bloom effect initialized');
        } catch (error) {
            console.warn('⚠️ Failed to initialize bloom effect:', error);
        }
    }

    /**
     * Initialize god rays effect
     */
    initializeGodRays() {
        if (!this.godRaysEnabled || !this.composer) return;
        
        try {
            // Create god rays pass (simplified implementation)
            const godRaysPass = {
                enabled: true,
                intensity: this.godRaysIntensity,
                update: (deltaTime) => {
                    // God rays update logic
                }
            };
            
            this.effects.set('godRays', godRaysPass);
            console.log('✨ God rays effect initialized');
        } catch (error) {
            console.warn('⚠️ Failed to initialize god rays effect:', error);
        }
    }

    /**
     * Initialize lens flare effect
     */
    initializeLensFlare() {
        if (!this.lensFlareEnabled || !this.composer) return;
        
        try {
            // Create lens flare system
            const lensFlareSystem = {
                enabled: true,
                intensity: this.lensFlareIntensity,
                flares: [],
                addFlare: (texture, size, distance, color) => {
                    this.effects.get('lensFlare').flares.push({
                        texture, size, distance, color
                    });
                },
                update: (camera) => {
                    // Lens flare update logic
                }
            };
            
            this.effects.set('lensFlare', lensFlareSystem);
            console.log('✨ Lens flare effect initialized');
        } catch (error) {
            console.warn('⚠️ Failed to initialize lens flare effect:', error);
        }
    }

    /**
     * Initialize atmospheric scattering effect
     */
    initializeAtmosphericScattering() {
        if (!this.atmosphericScatteringEnabled || !this.composer) return;
        
        try {
            // Create atmospheric scattering pass
            const atmosphericPass = {
                enabled: true,
                height: this.atmosphereHeight,
                density: this.atmosphereDensity,
                color: this.atmosphereColor,
                update: (camera) => {
                    // Atmospheric scattering update logic
                }
            };
            
            this.effects.set('atmosphericScattering', atmosphericPass);
            console.log('✨ Atmospheric scattering effect initialized');
        } catch (error) {
            console.warn('⚠️ Failed to initialize atmospheric scattering effect:', error);
        }
    }

    /**
     * Update post-processing effects
     * @param {number} deltaTime - Time since last update
     * @param {THREE.Camera} camera - Current camera
     */
    update(deltaTime, camera) {
        if (!this.isInitialized) return;
        
        // Update god rays
        const godRays = this.effects.get('godRays');
        if (godRays && godRays.enabled) {
            godRays.update(deltaTime);
        }
        
        // Update lens flare
        const lensFlare = this.effects.get('lensFlare');
        if (lensFlare && lensFlare.enabled) {
            lensFlare.update(camera);
        }
        
        // Update atmospheric scattering
        const atmospheric = this.effects.get('atmosphericScattering');
        if (atmospheric && atmospheric.enabled) {
            atmospheric.update(camera);
        }
    }

    /**
     * Render with post-processing
     */
    render() {
        if (this.composer && this.isInitialized) {
            this.composer.render();
        }
    }

    /**
     * Toggle effect
     * @param {string} effectName - Name of effect to toggle
     * @returns {boolean} - New state of effect
     */
    toggleEffect(effectName) {
        const effect = this.effects.get(effectName);
        if (effect) {
            effect.enabled = !effect.enabled;
            return effect.enabled;
        }
        return false;
    }

    /**
     * Set effect parameter
     * @param {string} effectName - Name of effect
     * @param {string} parameter - Parameter name
     * @param {*} value - Parameter value
     */
    setEffectParameter(effectName, parameter, value) {
        const effect = this.effects.get(effectName);
        if (effect && effect[parameter] !== undefined) {
            effect[parameter] = value;
        }
    }

    /**
     * Handle window resize
     */
    onWindowResize() {
        if (this.composer) {
            this.composer.setSize(window.innerWidth, window.innerHeight);
        }
    }

    /**
     * Get post-processor statistics
     * @returns {Object} - Post-processor statistics
     */
    getStats() {
        return {
            isInitialized: this.isInitialized,
            effectCount: this.effects.size,
            effects: Array.from(this.effects.keys()),
            bloomEnabled: this.bloomEnabled,
            godRaysEnabled: this.godRaysEnabled,
            lensFlareEnabled: this.lensFlareEnabled,
            atmosphericScatteringEnabled: this.atmosphericScatteringEnabled
        };
    }

    /**
     * Destroy the post-processor
     */
    destroy() {
        if (this.composer) {
            this.composer.dispose();
            this.composer = null;
        }
        
        this.effects.clear();
        this.isInitialized = false;
        console.log('🗑️ PostProcessor destroyed');
    }
}

// Create global post-processor instance
window.PostProcessor = new PostProcessor();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PostProcessor;
} 