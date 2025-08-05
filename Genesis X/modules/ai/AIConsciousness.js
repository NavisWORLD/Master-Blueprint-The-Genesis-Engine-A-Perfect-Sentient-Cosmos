/**
 * AIConsciousness.js - AI Consciousness System
 * 
 * Manages the AI's learning and creation capabilities for the Genesis Engine.
 * This module implements the AI's consciousness and autonomous creation system.
 */

class AIConsciousness {
    constructor() {
        this.isInitialized = false;
        this.isLearning = true;
        this.isCreating = true;
        this.learningRate = 0.1; // Default value, will be updated during initialization
        this.creationCount = 0;
        this.lastCreation = null;
    }

    /**
     * Initialize the AI consciousness
     */
    initialize() {
        this.updateConfiguration();
        this.isInitialized = true;
        console.log('🧠 AI Consciousness initialized');
    }

    /**
     * Update configuration from Config module
     */
    updateConfiguration() {
        this.learningRate = window.Utils.getConfig('ai.consciousness.learningRate', 0.1);
    }

    /**
     * Update the AI consciousness
     * @param {number} deltaTime - Time since last update
     */
    update(deltaTime) {
        if (!this.isInitialized) return;
        
        // Process learning
        if (this.isLearning) {
            this.processLearning(deltaTime);
        }
        
        // Process autonomous creation
        if (this.isCreating) {
            this.processCreation(deltaTime);
        }
    }

    /**
     * Process learning from environment
     * @param {number} deltaTime - Time since last update
     */
    processLearning(deltaTime) {
        // This will be implemented when we add sophisticated learning algorithms
    }

    /**
     * Process autonomous creation
     * @param {number} deltaTime - Time since last update
     */
    processCreation(deltaTime) {
        // This will be implemented when we add creation algorithms
    }

    /**
     * Toggle learning mode
     * @returns {boolean} - Current learning state
     */
    toggleLearning() {
        this.isLearning = !this.isLearning;
        return this.isLearning;
    }

    /**
     * Toggle creation mode
     * @returns {boolean} - Current creation state
     */
    toggleCreation() {
        this.isCreating = !this.isCreating;
        return this.isCreating;
    }

    /**
     * Trigger creation from critical event
     * @param {Object} eventData - Critical event data
     */
    triggerCreation(eventData) {
        if (!this.isCreating) return;
        
        console.log('🎨 AI triggered creation from critical event:', eventData);
        
        // This will be implemented when we add creation algorithms
        this.creationCount++;
        this.lastCreation = performance.now();
    }

    /**
     * Force AI creation
     */
    forceCreation() {
        console.log('🎨 Forcing AI creation');
        
        // This will be implemented when we add creation algorithms
        this.creationCount++;
        this.lastCreation = performance.now();
    }

    /**
     * Get AI statistics
     * @returns {Object} - AI statistics
     */
    getStats() {
        return {
            isLearning: this.isLearning,
            isCreating: this.isCreating,
            learningRate: this.learningRate,
            creationCount: this.creationCount,
            lastCreation: this.lastCreation
        };
    }

    /**
     * Destroy the AI consciousness
     */
    destroy() {
        this.isLearning = false;
        this.isCreating = false;
        console.log('🗑️ AI Consciousness destroyed');
    }
}

// Make the class available globally
window.AIConsciousnessClass = AIConsciousness;

// Create global AI consciousness instance
window.AIConsciousness = new AIConsciousness();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIConsciousness;
} 