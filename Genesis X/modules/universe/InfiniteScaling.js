/**
 * InfiniteScaling.js - Infinite Universe Scaling
 * 
 * Handles infinite universe scaling for the Genesis Engine.
 * This module manages the infinite zoom, dynamic LOD system,
 * and seamless scaling across all zoom levels.
 */

class InfiniteScaling {
    constructor() {
        this.isInitialized = false;
        this.sectors = new Map();
        
        // Scaling parameters
        this.currentScale = 1.0;
        this.minScale = 0.0001;
        this.maxScale = 1000000;
        this.scaleFactor = 1.2;
        
        // LOD (Level of Detail) settings
        this.lodLevels = [
            { distance: 100, detail: 'high' },
            { distance: 1000, detail: 'medium' },
            { distance: 10000, detail: 'low' },
            { distance: 100000, detail: 'minimal' }
        ];
        
        // Dynamic scaling
        this.dynamicScaling = true;
        this.autoLOD = true;
        this.performanceMode = false;
        
        // Camera tracking
        this.cameraPosition = new THREE.Vector3();
        this.cameraDistance = 0;
        
        // Performance tracking
        this.lastUpdateTime = 0;
        this.updateInterval = 100; // Update every 100ms
        this.frameCount = 0;
        this.fps = 0;
    }

    /**
     * Initialize the infinite scaling system
     */
    initialize() {
        this.updateConfiguration();
        this.initializeLODSystem();
        this.isInitialized = true;
        console.log('♾️ Infinite Scaling initialized');
    }

    /**
     * Update configuration from Config module
     */
    updateConfiguration() {
        // Safety check for Utils availability
        if (window.Utils && typeof window.Utils.getConfig === 'function') {
            this.minScale = window.Utils.getConfig('scaling.minScale', 0.0001);
            this.maxScale = window.Utils.getConfig('scaling.maxScale', 1000000);
            this.scaleFactor = window.Utils.getConfig('scaling.scaleFactor', 1.2);
            this.dynamicScaling = window.Utils.getConfig('scaling.dynamicScaling', true);
            this.autoLOD = window.Utils.getConfig('scaling.autoLOD', true);
            this.performanceMode = window.Utils.getConfig('scaling.performanceMode', false);
        } else {
            console.warn('⚠️ Utils.getConfig not available, using default scaling configuration');
            // Keep default values from constructor
        }
    }

    /**
     * Initialize the LOD system
     */
    initializeLODSystem() {
        // Create LOD levels based on configuration
        this.lodLevels = [
            { distance: 100, detail: 'high', objectLimit: 1000 },
            { distance: 1000, detail: 'medium', objectLimit: 500 },
            { distance: 10000, detail: 'low', objectLimit: 200 },
            { distance: 100000, detail: 'minimal', objectLimit: 50 }
        ];
        
        console.log('♾️ LOD system initialized');
    }

    /**
     * Update scaling based on camera position
     * @param {THREE.Vector3} cameraPosition - Current camera position
     * @param {number} deltaTime - Time since last update
     */
    update(cameraPosition, deltaTime) {
        if (!this.isInitialized) return;
        
        this.cameraPosition.copy(cameraPosition);
        this.cameraDistance = cameraPosition.length();
        
        // Update current scale based on camera distance
        this.updateScale();
        
        // Update LOD based on distance
        if (this.autoLOD) {
            this.updateLOD();
        }
        
        // Performance monitoring
        this.frameCount++;
        const currentTime = performance.now();
        if (currentTime - this.lastUpdateTime > this.updateInterval) {
            this.fps = this.frameCount / (this.updateInterval / 1000);
            this.frameCount = 0;
            this.lastUpdateTime = currentTime;
        }
    }

    /**
     * Update current scale based on camera distance
     */
    updateScale() {
        if (!this.dynamicScaling) return;
        
        // Calculate scale based on camera distance
        const distance = this.cameraDistance;
        let newScale = 1.0;
        
        if (distance > 1000) {
            newScale = distance / 1000;
        } else if (distance < 100) {
            newScale = distance / 100;
        }
        
        // Clamp scale to limits
        newScale = Math.max(this.minScale, Math.min(this.maxScale, newScale));
        
        // Smooth scale transition
        this.currentScale = THREE.MathUtils.lerp(this.currentScale, newScale, 0.1);
    }

    /**
     * Update LOD based on camera distance
     */
    updateLOD() {
        const distance = this.cameraDistance;
        let currentLOD = this.lodLevels[0];
        
        // Find appropriate LOD level
        for (const lod of this.lodLevels) {
            if (distance <= lod.distance) {
                currentLOD = lod;
                break;
            }
        }
        
        // Apply LOD settings
        this.applyLODSettings(currentLOD);
    }

    /**
     * Apply LOD settings
     * @param {Object} lodLevel - LOD level to apply
     */
    applyLODSettings(lodLevel) {
        // Update object visibility based on LOD
        if (window.UniverseManager && window.UniverseManager.sectors) {
            window.UniverseManager.sectors.forEach(sector => {
                if (sector.isLoaded) {
                    this.updateSectorLOD(sector, lodLevel);
                }
            });
        }
    }

    /**
     * Update sector LOD
     * @param {Object} sector - Sector to update
     * @param {Object} lodLevel - LOD level
     */
    updateSectorLOD(sector, lodLevel) {
        const objectLimit = lodLevel.objectLimit;
        let visibleCount = 0;
        
        sector.objects.forEach((object, key) => {
            const distance = this.calculateDistanceToCamera(object.position);
            
            // Show objects based on LOD and distance
            if (visibleCount < objectLimit && distance <= lodLevel.distance) {
                object.visible = true;
                visibleCount++;
            } else {
                object.visible = false;
            }
        });
    }

    /**
     * Calculate distance to camera
     * @param {Object} position - Object position
     * @returns {number} - Distance to camera
     */
    calculateDistanceToCamera(position) {
        const dx = position.x - this.cameraPosition.x;
        const dy = position.y - this.cameraPosition.y;
        const dz = position.z - this.cameraPosition.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    /**
     * Get scale factor for objects
     * @param {number} baseSize - Base object size
     * @returns {number} - Scaled size
     */
    getScaledSize(baseSize) {
        return baseSize * this.currentScale;
    }

    /**
     * Get current LOD level
     * @returns {Object} - Current LOD level
     */
    getCurrentLOD() {
        const distance = this.cameraDistance;
        
        for (const lod of this.lodLevels) {
            if (distance <= lod.distance) {
                return lod;
            }
        }
        
        return this.lodLevels[this.lodLevels.length - 1];
    }

    /**
     * Set performance mode
     * @param {boolean} enabled - Enable performance mode
     */
    setPerformanceMode(enabled) {
        this.performanceMode = enabled;
        
        if (enabled) {
            // Reduce LOD levels for better performance
            this.lodLevels = [
                { distance: 500, detail: 'medium', objectLimit: 300 },
                { distance: 5000, detail: 'low', objectLimit: 100 },
                { distance: 50000, detail: 'minimal', objectLimit: 25 }
            ];
        } else {
            // Restore normal LOD levels
            this.initializeLODSystem();
        }
        
        console.log(`♾️ Performance mode ${enabled ? 'enabled' : 'disabled'}`);
    }

    /**
     * Zoom to specific scale
     * @param {number} scale - Target scale
     * @param {number} duration - Animation duration in seconds
     */
    zoomToScale(scale, duration = 1.0) {
        const targetScale = Math.max(this.minScale, Math.min(this.maxScale, scale));
        const startScale = this.currentScale;
        const startTime = performance.now();
        
        const animate = () => {
            const elapsed = (performance.now() - startTime) / 1000;
            const progress = Math.min(elapsed / duration, 1.0);
            
            // Smooth easing
            const easedProgress = this.easeInOutCubic(progress);
            this.currentScale = THREE.MathUtils.lerp(startScale, targetScale, easedProgress);
            
            if (progress < 1.0) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }

    /**
     * Easing function for smooth animations
     * @param {number} t - Time value (0-1)
     * @returns {number} - Eased value
     */
    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    /**
     * Get scaling statistics
     * @returns {Object} - Scaling statistics
     */
    getStats() {
        return {
            isInitialized: this.isInitialized,
            currentScale: this.currentScale,
            cameraDistance: this.cameraDistance,
            currentLOD: this.getCurrentLOD(),
            fps: this.fps,
            performanceMode: this.performanceMode,
            dynamicScaling: this.dynamicScaling,
            autoLOD: this.autoLOD
        };
    }

    /**
     * Destroy the infinite scaling system
     */
    destroy() {
        this.sectors.clear();
        this.isInitialized = false;
        console.log('🗑️ Infinite Scaling destroyed');
    }
}

// Create global infinite scaling instance
window.InfiniteScaling = new InfiniteScaling();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InfiniteScaling;
} 