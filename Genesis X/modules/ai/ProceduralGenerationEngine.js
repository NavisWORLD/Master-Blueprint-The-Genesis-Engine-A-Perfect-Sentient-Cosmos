/**
 * ProceduralGenerationEngine.js - Procedural Content Generation
 * 
 * Handles procedural generation of universe content for the Genesis Engine.
 * This module creates stars, planets, and other cosmic objects procedurally.
 */

class ProceduralGenerationEngine {
    constructor() {
        this.isInitialized = false;
        this.generationCount = 0;
        this.noise = null;
    }

    /**
     * Initialize the procedural generation engine
     */
    initialize() {
        this.isInitialized = true;
        // Initialize noise generator
        this.noise = new SimplexNoise();
        console.log('🎲 Procedural Generation Engine initialized');
    }

    /**
     * Generate objects for a sector
     * @param {Object} sector - Sector to generate objects for
     */
    generateSectorObjects(sector) {
        if (!this.isInitialized) return;
        
        // Generate some basic objects for the sector
        const objectCount = Math.floor(Math.random() * 5) + 1;
        
        for (let i = 0; i < objectCount; i++) {
            const object = this.generateRandomObject(sector);
            sector.objects.push(object);
        }
        
        this.generationCount += objectCount;
        console.log(`🌍 Generated ${objectCount} objects for sector ${sector.id}`);
    }

    /**
     * Generate a random object
     * @param {Object} sector - Sector to generate object in
     * @returns {Object} - Generated object
     */
    generateRandomObject(sector) {
        const objectTypes = ['star', 'planet', 'nebula', 'asteroid'];
        const type = objectTypes[Math.floor(Math.random() * objectTypes.length)];
        
        // Safety check for Utils availability
        let objectId;
        if (window.Utils && typeof window.Utils.generateUUID === 'function') {
            objectId = window.Utils.generateUUID();
        } else {
            console.warn('⚠️ Utils.generateUUID not available, using fallback ID');
            objectId = `object_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        }
        
        const object = {
            id: objectId,
            type: type,
            position: {
                x: sector.position.x + (Math.random() - 0.5) * 1000,
                y: sector.position.y + (Math.random() - 0.5) * 1000,
                z: sector.position.z + (Math.random() - 0.5) * 1000
            },
            size: Math.random() * 100 + 10,
            color: this.generateRandomColor(),
            createdAt: performance.now()
        };
        
        return object;
    }

    /**
     * Generate a random color
     * @returns {Object} - RGB color object
     */
    generateRandomColor() {
        return {
            r: Math.random(),
            g: Math.random(),
            b: Math.random()
        };
    }

    /**
     * Get generation statistics
     * @returns {Object} - Generation statistics
     */
    getStats() {
        return {
            generationCount: this.generationCount,
            isInitialized: this.isInitialized
        };
    }

    /**
     * Destroy the procedural generation engine
     */
    destroy() {
        this.isInitialized = false;
        console.log('🗑️ Procedural Generation Engine destroyed');
    }
}

// Make the class available globally
window.ProceduralGenerationEngineClass = ProceduralGenerationEngine;

// Create global procedural generation engine instance
window.ProceduralGenerationEngine = new ProceduralGenerationEngine();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProceduralGenerationEngine;
} 