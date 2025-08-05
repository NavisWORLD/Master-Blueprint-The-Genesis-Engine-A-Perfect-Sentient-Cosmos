/**
 * ObjectLibrary.js - 3D Object Library
 * 
 * Manages the library of 3D objects for AI creation in the Genesis Engine.
 * This module provides objects for the AI to spawn in the universe.
 */

class ObjectLibrary {
    constructor() {
        this.isInitialized = false;
        this.objects = new Map();
    }

    /**
     * Initialize the object library
     */
    initialize() {
        this.updateConfiguration();
        this.isInitialized = true;
        this.loadObjectTypes();
        console.log('📚 Object Library initialized');
    }

    /**
     * Update configuration from Config module
     */
    updateConfiguration() {
        // Configuration will be loaded during loadObjectTypes
    }

    /**
     * Load object types
     */
    loadObjectTypes() {
        // Safety check for Utils availability
        let objectTypes = {};
        if (window.Utils && typeof window.Utils.getConfig === 'function') {
            objectTypes = window.Utils.getConfig('universe.objectTypes', {});
        } else {
            console.warn('⚠️ Utils.getConfig not available, using empty object types');
        }
        
        // This will be implemented when we add actual 3D models
        console.log('📦 Object types loaded:', Object.keys(objectTypes));
    }

    /**
     * Get object by type
     * @param {string} type - Object type
     * @returns {Object} - Object data
     */
    getObject(type) {
        // This will be implemented when we add actual 3D models
        return {
            type: type,
            geometry: null,
            material: null
        };
    }

    /**
     * Get object library statistics
     * @returns {Object} - Object library statistics
     */
    getStats() {
        return {
            objectCount: this.objects.size,
            isInitialized: this.isInitialized
        };
    }

    /**
     * Destroy the object library
     */
    destroy() {
        this.objects.clear();
        this.isInitialized = false;
        console.log('🗑️ Object Library destroyed');
    }
}

// Create global object library instance
window.ObjectLibrary = new ObjectLibrary();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ObjectLibrary;
} 