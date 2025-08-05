/**
 * Token.js - Universal Data Format
 * 
 * This is the universal data format for all information entering the engine.
 * Every piece of data becomes a Token for standardized processing.
 */

class Token {
    constructor({ type, source, data, bioFrequency, amplitude }) {
        this.id = this.createUUID();
        this.timestamp = performance.now();
        this.type = type; // e.g., 'SOUL_DUST', 'OBJECT_DETECTED', 'USER_INTERACTION', 'COSMIC_EVENT'
        this.source = source; // e.g., 'microphone', 'camera', 'nasa_apod_api', 'mouse_click'
        this.data = data; // The raw data payload, e.g., { label: 'book', confidence: 0.9 }
        
        // Bio-Signature: Every token is imprinted with the user's state at the moment of its creation
        this.bioFrequency = bioFrequency || 0; // User's dominant vocal frequency at this moment
        this.amplitude = amplitude || 0; // User's vocal amplitude at this moment
    }

    /**
     * Create a unique identifier
     * @returns {string} - UUID
     */
    createUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    /**
     * Get token as string for debugging
     * @returns {string} - Token string representation
     */
    toString() {
        return `Token[${this.type}] from ${this.source} at ${new Date(this.timestamp).toISOString()}`;
    }

    /**
     * Get token energy level based on amplitude
     * @returns {number} - Energy level (0-1)
     */
    getEnergyLevel() {
        return Math.min(this.amplitude / 100, 1.0);
    }

    /**
     * Get token frequency category
     * @returns {string} - Frequency category
     */
    getFrequencyCategory() {
        if (this.bioFrequency < 200) return 'low';
        if (this.bioFrequency < 800) return 'mid';
        return 'high';
    }
}

// Create global Token class
window.Token = Token;

// Create global Token instance for convenience
window.TokenInstance = new Token({
    type: 'SYSTEM',
    source: 'token_system',
    data: { initialized: true }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Token;
} 