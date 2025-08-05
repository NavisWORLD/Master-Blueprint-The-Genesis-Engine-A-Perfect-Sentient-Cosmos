/**
 * Renderer.js - Main Rendering Pipeline
 * 
 * Handles the main rendering pipeline for the Genesis Engine.
 * This module manages the Three.js renderer, scene, camera, and rendering loop.
 */

class Renderer {
    constructor() {
        this.isInitialized = false;
        this.renderer = null;
        this.scene = null;
        this.camera = null;
        this.composer = null;
        this.renderTarget = null;
        
        // Rendering settings
        this.antialias = true;
        this.shadowMap = true;
        this.pixelRatio = window.devicePixelRatio;
        this.clearColor = new THREE.Color(0x000000);
        
        // Performance tracking
        this.frameCount = 0;
        this.lastFrameTime = 0;
        this.fps = 0;
    }

    /**
     * Initialize the renderer with Three.js
     */
    initialize() {
        try {
            // Check if Three.js is available
            if (typeof THREE === 'undefined') {
                throw new Error('Three.js is not loaded');
            }
            
            // Create WebGL renderer
            this.renderer = new THREE.WebGLRenderer({
                antialias: this.antialias,
                alpha: true,
                preserveDrawingBuffer: false
            });
            
            // Configure renderer
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.setPixelRatio(this.pixelRatio);
            this.renderer.setClearColor(this.clearColor);
            this.renderer.shadowMap.enabled = this.shadowMap;
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            this.renderer.outputEncoding = THREE.sRGBEncoding;
            this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
            this.renderer.toneMappingExposure = 1.0;
            
            // Create scene
            this.scene = new THREE.Scene();
            this.scene.fog = new THREE.Fog(0x000000, 100, 10000);
            
            // Create camera
            this.camera = new THREE.PerspectiveCamera(
                75, 
                window.innerWidth / window.innerHeight, 
                0.1, 
                1000000
            );
            this.camera.position.set(0, 100, 200);
            this.camera.lookAt(0, 0, 0);
            
            // Create render target for post-processing
            this.renderTarget = new THREE.WebGLRenderTarget(
                window.innerWidth,
                window.innerHeight,
                {
                    minFilter: THREE.LinearFilter,
                    magFilter: THREE.LinearFilter,
                    format: THREE.RGBAFormat,
                    encoding: THREE.sRGBEncoding
                }
            );
            
            // Add to DOM - check for canvas container first
            const container = document.getElementById('canvas-container');
            if (container) {
                // Remove any existing canvas
                const existingCanvas = container.querySelector('canvas');
                if (existingCanvas) {
                    existingCanvas.remove();
                }
                
                // Add the renderer's canvas
                container.appendChild(this.renderer.domElement);
                console.log('🎨 Renderer canvas added to container');
            } else {
                // Fallback: add to body if container doesn't exist
                console.warn('⚠️ Canvas container not found, adding renderer to body');
                document.body.appendChild(this.renderer.domElement);
            }
            
            this.isInitialized = true;
            console.log('🎨 Renderer initialized with Three.js');
            
        } catch (error) {
            console.error('❌ Failed to initialize renderer:', error);
            this.isInitialized = false;
        }
    }

    /**
     * Render the scene
     * @param {number} deltaTime - Time since last frame
     */
    render(deltaTime) {
        if (!this.isInitialized || !this.renderer || !this.scene || !this.camera) {
            return;
        }
        
        // Update performance metrics
        this.updatePerformanceMetrics(deltaTime);
        
        // Render with post-processing if available
        if (this.composer && window.PostProcessor && window.PostProcessor.isInitialized) {
            this.composer.render();
        } else {
            this.renderer.render(this.scene, this.camera);
        }
        
        this.frameCount++;
    }

    /**
     * Update performance metrics
     * @param {number} deltaTime - Time since last frame
     */
    updatePerformanceMetrics(deltaTime) {
        this.fps = 1 / deltaTime;
        this.lastFrameTime = deltaTime * 1000;
    }

    /**
     * Handle window resize
     */
    onWindowResize() {
        if (!this.isInitialized) return;
        
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        
        this.renderer.setSize(width, height);
        
        if (this.renderTarget) {
            this.renderTarget.setSize(width, height);
        }
        
        if (this.composer) {
            this.composer.setSize(width, height);
        }
    }

    /**
     * Add object to scene
     * @param {THREE.Object3D} object - Object to add
     */
    addToScene(object) {
        if (this.scene) {
            this.scene.add(object);
        }
    }

    /**
     * Remove object from scene
     * @param {THREE.Object3D} object - Object to remove
     */
    removeFromScene(object) {
        if (this.scene) {
            this.scene.remove(object);
        }
    }

    /**
     * Set camera position
     * @param {THREE.Vector3} position - Camera position
     */
    setCameraPosition(position) {
        if (this.camera) {
            this.camera.position.copy(position);
        }
    }

    /**
     * Set camera target
     * @param {THREE.Vector3} target - Camera target
     */
    setCameraTarget(target) {
        if (this.camera) {
            this.camera.lookAt(target);
        }
    }

    /**
     * Setup post-processing effects
     */
    setupPostProcessing() {
        if (!this.isInitialized) {
            console.warn('⚠️ Renderer not initialized, cannot setup post-processing');
            return;
        }
        
        try {
            // Check if EffectComposer is available
            if (typeof THREE.EffectComposer === 'undefined') {
                console.warn('⚠️ THREE.EffectComposer not available, skipping post-processing');
                return;
            }
            
            // Create post-processing composer if not exists
            if (!this.composer) {
                this.composer = new THREE.EffectComposer(this.renderer, this.renderTarget);
                console.log('🎨 Post-processing composer created');
            }
            
            // Add basic render pass
            const renderPass = new THREE.RenderPass(this.scene, this.camera);
            this.composer.addPass(renderPass);
            
            console.log('✅ Post-processing setup completed');
        } catch (error) {
            console.warn('⚠️ Post-processing setup failed:', error.message);
            // Continue without post-processing
        }
    }

    /**
     * Get renderer statistics
     * @returns {Object} - Renderer statistics
     */
    getStats() {
        return {
            isInitialized: this.isInitialized,
            fps: this.fps,
            frameTime: this.lastFrameTime,
            frameCount: this.frameCount,
            sceneChildren: this.scene ? this.scene.children.length : 0,
            rendererInfo: this.renderer ? this.renderer.info : null
        };
    }

    /**
     * Destroy the renderer
     */
    destroy() {
        if (this.renderer) {
            this.renderer.dispose();
            this.renderer = null;
        }
        
        if (this.renderTarget) {
            this.renderTarget.dispose();
            this.renderTarget = null;
        }
        
        if (this.composer) {
            this.composer.dispose();
            this.composer = null;
        }
        
        this.scene = null;
        this.camera = null;
        this.isInitialized = false;
        console.log('🗑️ Renderer destroyed');
    }
}

// Make the class available globally
window.RendererClass = Renderer;

// Create global renderer instance
window.Renderer = new Renderer();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Renderer;
} 