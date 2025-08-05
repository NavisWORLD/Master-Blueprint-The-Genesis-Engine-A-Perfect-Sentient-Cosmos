/**
 * TokenizationEngine.js - Central Data Processor
 * 
 * This module is a central data processor. It subscribes to all raw data events
 * and converts them into standardized Token objects.
 */

console.log('🔧 TokenizationEngine.js: Starting to load...');

class TokenizationEngine {
    constructor() {
        this.latestBioFrequency = 0;
        this.latestAmplitude = 0;
        this.isInitialized = false;
        
        console.log('🔧 TokenizationEngine: Constructor completed');
    }

    /**
     * Initialize the tokenization engine
     */
    initialize() {
        if (this.isInitialized) return;
        
        // Check if Token class is available
        if (typeof window.Token === 'undefined') {
            console.error('❌ TokenizationEngine: Token class not available');
            throw new Error('Token class not available');
        }
        
        // Subscribe to all raw data sources
        if (window.EventBus) {
            window.EventBus.subscribe('sensory:audioBuffer', data => this.processAudio(data));
            window.EventBus.subscribe('input:mouseMove', data => this.processMouseMove(data));
            window.EventBus.subscribe('input:mouseDown', data => this.processMouseClick(data));
            window.EventBus.subscribe('input:wheel', data => this.processWheel(data));
            window.EventBus.subscribe('input:keyDown', data => this.processKeyPress(data));
        }
        
        this.isInitialized = true;
        console.log('🔧 TokenizationEngine initialized');
    }

    /**
     * Process audio data into tokens
     * @param {Object} audioData - Audio data from microphone
     */
    processAudio(audioData) {
        this.latestBioFrequency = audioData.frequency || 0;
        this.latestAmplitude = audioData.amplitude || 0;

        // Audio becomes a "SOUL_DUST" token
        const token = new window.Token({
            type: 'SOUL_DUST',
            source: 'microphone',
            data: { 
                frequency: audioData.frequency, 
                amplitude: audioData.amplitude,
                spectralData: audioData.spectralData || []
            },
            bioFrequency: this.latestBioFrequency,
            amplitude: this.latestAmplitude
        });
        
        if (window.EventBus) {
            window.EventBus.publish('token:generated', token);
        }
    }

    /**
     * Process mouse movement into tokens
     * @param {Object} mouseData - Mouse movement data
     */
    processMouseMove(mouseData) {
        const token = new window.Token({
            type: 'USER_INTERACTION',
            source: 'mouse',
            data: { 
                action: 'move',
                x: mouseData.x, 
                y: mouseData.y 
            },
            bioFrequency: this.latestBioFrequency,
            amplitude: this.latestAmplitude
        });
        
        if (window.EventBus) {
            window.EventBus.publish('token:generated', token);
        }
    }

    /**
     * Process mouse clicks into tokens
     * @param {Object} clickData - Mouse click data
     */
    processMouseClick(clickData) {
        const token = new window.Token({
            type: 'USER_INTERACTION',
            source: 'mouse',
            data: { 
                action: 'click',
                button: clickData.button,
                x: clickData.x, 
                y: clickData.y 
            },
            bioFrequency: this.latestBioFrequency,
            amplitude: this.latestAmplitude
        });
        
        if (window.EventBus) {
            window.EventBus.publish('token:generated', token);
        }
    }

    /**
     * Process wheel events into tokens
     * @param {Object} wheelData - Wheel event data
     */
    processWheel(wheelData) {
        const token = new window.Token({
            type: 'USER_INTERACTION',
            source: 'wheel',
            data: { 
                action: 'scroll',
                delta: wheelData.delta,
                direction: wheelData.delta > 0 ? 'up' : 'down'
            },
            bioFrequency: this.latestBioFrequency,
            amplitude: this.latestAmplitude
        });
        
        if (window.EventBus) {
            window.EventBus.publish('token:generated', token);
        }
    }

    /**
     * Process key presses into tokens
     * @param {Object} keyData - Key press data
     */
    processKeyPress(keyData) {
        const token = new window.Token({
            type: 'USER_INTERACTION',
            source: 'keyboard',
            data: { 
                action: 'keypress',
                key: keyData.key,
                code: keyData.code
            },
            bioFrequency: this.latestBioFrequency,
            amplitude: this.latestAmplitude
        });
        
        if (window.EventBus) {
            window.EventBus.publish('token:generated', token);
        }
    }

    /**
     * Process external data into tokens
     * @param {Object} externalData - External data
     */
    processExternalData(externalData) {
        const token = new window.Token({
            type: 'EXTERNAL_DATA',
            source: externalData.source || 'unknown',
            data: externalData.data || {},
            bioFrequency: this.latestBioFrequency,
            amplitude: this.latestAmplitude
        });
        
        if (window.EventBus) {
            window.EventBus.publish('token:generated', token);
        }
    }

    /**
     * Get current bio signature
     * @returns {Object} - Bio signature data
     */
    getBioSignature() {
        return {
            bioFrequency: this.latestBioFrequency,
            amplitude: this.latestAmplitude,
            timestamp: performance.now()
        };
    }

    /**
     * Get engine statistics
     * @returns {Object} - Engine statistics
     */
    getStats() {
        return {
            isInitialized: this.isInitialized,
            latestBioFrequency: this.latestBioFrequency,
            latestAmplitude: this.latestAmplitude
        };
    }

    /**
     * Destroy the tokenization engine
     */
    destroy() {
        this.isInitialized = false;
        console.log('🗑️ TokenizationEngine destroyed');
    }
}

console.log('🔧 TokenizationEngine.js: Class defined, creating global instance...');

// Create global TokenizationEngine instance
try {
    window.TokenizationEngine = new TokenizationEngine();
    console.log('✅ TokenizationEngine: Global instance created successfully');
    console.log('🔧 TokenizationEngine: window.TokenizationEngine type:', typeof window.TokenizationEngine);
    console.log('🔧 TokenizationEngine: window.TokenizationEngine.initialize type:', typeof window.TokenizationEngine.initialize);
} catch (error) {
    console.error('❌ TokenizationEngine: Failed to create global instance:', error);
}

console.log('🔧 TokenizationEngine.js: Script completed');

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TokenizationEngine;
} 