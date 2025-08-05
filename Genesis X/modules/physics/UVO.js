/**
 * UVO.js - Unified Vibrational Ontology
 * 
 * The UVO is the foundational "hardware" of the universe, a 4-dimensional substrate
 * where all reality is fundamentally vibration. This substrate is not passive; it is
 * an active transduction medium that directly interfaces with the user's external
 * reality by capturing environmental sound and transmuting it into the fundamental
 * quanta of the 12D CST.
 */

class UVO {
    constructor() {
        this.isInitialized = false;
        
        console.log('🌊 UVO: Constructor starting...');
        
        // UVO parameters from Config (default values, will be updated during initialization)
        this.frequencyRange = [20, 20000]; // Default value
        this.amplitudeRange = [0, 1]; // Default value
        this.spectralComplexityWeight = 0.5; // Default value
        this.transductionEfficiency = 0.8; // Default value
        
        // 4D vibrational field
        this.vibrationalField = new Map();
        
        // Transduction history
        this.transductionHistory = [];
        this.maxHistorySize = 1000;
        
        // Active transduction zones
        this.transductionZones = [];
        
        console.log('🌊 UVO: Initializing 4D substrate...');
        // Initialize the 4D substrate
        this.initializeSubstrate();
        console.log('🌊 UVO: Constructor completed successfully');
    }

    /**
     * Initialize UVO with configuration
     */
    initialize() {
        try {
            console.log('🌊 UVO: Starting initialization...');
            console.log('🌊 UVO: window.Utils available?', !!window.Utils);
            console.log('🌊 UVO: window.Utils.getConfig available?', !!(window.Utils && window.Utils.getConfig));
            
            this.updateConfiguration();
            this.isInitialized = true;
            console.log('🌊 UVO initialized with configuration');
        } catch (error) {
            console.error('🌊 UVO initialization error:', error);
            throw error;
        }
    }

    /**
     * Update configuration from Config module
     */
    updateConfiguration() {
        try {
            console.log('🌊 UVO: Updating configuration...');
            this.frequencyRange = window.Utils.getConfig('physics.uvo.frequencyRange', [20, 20000]);
            this.amplitudeRange = window.Utils.getConfig('physics.uvo.amplitudeRange', [0, 1]);
            this.spectralComplexityWeight = window.Utils.getConfig('physics.uvo.spectralComplexityWeight', 0.5);
            this.transductionEfficiency = window.Utils.getConfig('physics.uvo.transductionEfficiency', 0.8);
            console.log('🌊 UVO: Configuration updated successfully');
        } catch (error) {
            console.error('🌊 UVO: Configuration update error:', error);
            throw error;
        }
    }

    /**
     * Initialize the 4D vibrational substrate
     */
    initializeSubstrate() {
        // Create 4D grid for vibrational field (reduced size for performance)
        this.gridSize = 10; // Reduced from 20 to 10 (10^4 = 10,000 vs 20^4 = 160,000)
        this.gridSpacing = 1.0;
        
        console.log('🌊 UVO: Initializing 4D substrate with grid size:', this.gridSize);
        
        // Initialize vibrational field with zero amplitude
        let cellCount = 0;
        for (let x = 0; x < this.gridSize; x++) {
            for (let y = 0; y < this.gridSize; y++) {
                for (let z = 0; z < this.gridSize; z++) {
                    for (let t = 0; t < this.gridSize; t++) {
                        const key = `${x},${y},${z},${t}`;
                        this.vibrationalField.set(key, {
                            amplitude: 0,
                            frequency: 0,
                            phase: 0,
                            energy: 0,
                            consciousnessFactor: 0
                        });
                        cellCount++;
                    }
                }
            }
        }
        
        console.log('🌊 UVO 4D vibrational substrate initialized with', cellCount, 'cells');
    }

    /**
     * Transduce audio data into vibrational energy
     * @param {Object} audioData - Audio data from microphone
     * @returns {Object} - Transduced vibrational data
     */
    transduceAudio(audioData) {
        try {
            const { frequency, amplitude, spectralComplexity, timestamp } = audioData;
            
            // Validate input ranges
                    const validFrequency = window.Utils.clamp(frequency, this.frequencyRange[0], this.frequencyRange[1]);
        const validAmplitude = window.Utils.clamp(amplitude, this.amplitudeRange[0], this.amplitudeRange[1]);
            
            // Calculate transduction efficiency
            const efficiency = this.calculateTransductionEfficiency(validFrequency, validAmplitude, spectralComplexity);
            
            // Create vibrational quantum
            const vibrationalQuantum = {
                id: window.Utils.generateUUID(),
                frequency: validFrequency,
                amplitude: validAmplitude,
                spectralComplexity: spectralComplexity,
                energy: this.calculateEnergy(validFrequency, validAmplitude),
                consciousnessFactor: this.calculateConsciousnessFactor(validFrequency, spectralComplexity),
                timestamp: timestamp,
                efficiency: efficiency,
                position: this.calculateTransductionPosition(validFrequency, validAmplitude)
            };
            
            // Update 4D vibrational field
            this.updateVibrationalField(vibrationalQuantum);
            
            // Store in transduction history
            this.transductionHistory.push(vibrationalQuantum);
            if (this.transductionHistory.length > this.maxHistorySize) {
                this.transductionHistory.shift();
            }
            
            // Publish transduction event
            window.EventBus.publish('uvo:transduction', {
                quantum: vibrationalQuantum,
                fieldDensity: this.getFieldDensity(),
                energyReleased: vibrationalQuantum.energy
            });
            
            return vibrationalQuantum;
            
        } catch (error) {
            console.error('Error in UVO transduction:', error);
            return null;
        }
    }

    /**
     * Calculate transduction efficiency based on input parameters
     * @param {number} frequency - Input frequency
     * @param {number} amplitude - Input amplitude
     * @param {number} spectralComplexity - Spectral complexity
     * @returns {number} - Transduction efficiency (0-1)
     */
    calculateTransductionEfficiency(frequency, amplitude, spectralComplexity) {
        // Base efficiency from config
        let efficiency = this.transductionEfficiency;
        
        // Frequency-dependent efficiency
        const frequencyEfficiency = this.getFrequencyEfficiency(frequency);
        
        // Amplitude-dependent efficiency
        const amplitudeEfficiency = Math.pow(amplitude, 0.5); // Square root for natural response
        
        // Spectral complexity bonus
        const complexityBonus = spectralComplexity * this.spectralComplexityWeight;
        
        // Combine factors
        efficiency *= frequencyEfficiency * amplitudeEfficiency * (1 + complexityBonus);
        
        return window.Utils.clamp(efficiency, 0, 1);
    }

    /**
     * Get frequency-dependent efficiency
     * @param {number} frequency - Frequency in Hz
     * @returns {number} - Efficiency factor
     */
    getFrequencyEfficiency(frequency) {
        // Optimal frequency range for transduction
        const optimalRange = [100, 8000]; // Hz
        const centerFreq = (optimalRange[0] + optimalRange[1]) / 2;
        const bandwidth = optimalRange[1] - optimalRange[0];
        
        // Gaussian response curve
        const deviation = Math.abs(frequency - centerFreq);
        const sigma = bandwidth / 4;
        
        return Math.exp(-(deviation * deviation) / (2 * sigma * sigma));
    }

    /**
     * Calculate energy from frequency and amplitude
     * @param {number} frequency - Frequency in Hz
     * @param {number} amplitude - Amplitude (0-1)
     * @returns {number} - Energy value
     */
    calculateEnergy(frequency, amplitude) {
        // E = hν where h is Planck's constant and ν is frequency
        const h = window.Utils.getConfig('physics.h', 6.62607015e-34);
        const baseEnergy = h * frequency;
        
        // Amplitude modulates the energy
        return baseEnergy * amplitude * amplitude; // Square for power relationship
    }

    /**
     * Calculate consciousness factor based on frequency and complexity
     * @param {number} frequency - Frequency in Hz
     * @param {number} spectralComplexity - Spectral complexity
     * @returns {number} - Consciousness factor (0-1)
     */
    calculateConsciousnessFactor(frequency, spectralComplexity) {
        // Higher frequencies and complexity correlate with consciousness
        const frequencyFactor = window.Utils.map(frequency, 20, 20000, 0.1, 0.9);
        const complexityFactor = window.Utils.clamp(spectralComplexity, 0, 1);
        
        // Combine factors with consciousness field strength
        const consciousnessFieldStrength = window.Utils.getConfig('physics.cst.consciousnessFieldStrength', 1.0);
        
        return (frequencyFactor + complexityFactor) * 0.5 * consciousnessFieldStrength;
    }

    /**
     * Calculate transduction position in 4D space
     * @param {number} frequency - Frequency
     * @param {number} amplitude - Amplitude
     * @returns {Object} - 4D position {x, y, z, t}
     */
    calculateTransductionPosition(frequency, amplitude) {
        // Map frequency to spatial dimensions
        const x = window.Utils.map(frequency, this.frequencyRange[0], this.frequencyRange[1], 0, this.gridSize - 1);
        const y = window.Utils.map(amplitude, this.amplitudeRange[0], this.amplitudeRange[1], 0, this.gridSize - 1);
        
        // Z dimension based on spectral characteristics
        const z = Math.floor(Math.random() * this.gridSize);
        
        // Time dimension (current time slice)
        const t = Math.floor(performance.now() / 1000) % this.gridSize;
        
        return { x: Math.floor(x), y: Math.floor(y), z, t };
    }

    /**
     * Update the 4D vibrational field with new quantum
     * @param {Object} quantum - Vibrational quantum
     */
    updateVibrationalField(quantum) {
        const pos = quantum.position;
        const key = `${pos.x},${pos.y},${pos.z},${pos.t}`;
        
        // Get current field state
        const currentState = this.vibrationalField.get(key) || {
            amplitude: 0,
            frequency: 0,
            phase: 0,
            energy: 0,
            consciousnessFactor: 0
        };
        
        // Update field state with new quantum
        const updatedState = {
            amplitude: Math.max(currentState.amplitude, quantum.amplitude),
            frequency: quantum.frequency,
            phase: (currentState.phase + quantum.frequency * quantum.timestamp) % (2 * Math.PI),
            energy: currentState.energy + quantum.energy,
            consciousnessFactor: Math.max(currentState.consciousnessFactor, quantum.consciousnessFactor)
        };
        
        this.vibrationalField.set(key, updatedState);
        
        // Create transduction zone if energy is high enough
        if (updatedState.energy > this.criticalEnergyThreshold) {
            this.createTransductionZone(pos, updatedState);
        }
    }

    /**
     * Create a transduction zone for high-energy regions
     * @param {Object} position - 4D position
     * @param {Object} state - Field state
     */
    createTransductionZone(position, state) {
        const zone = {
            id: window.Utils.generateUUID(),
            position: position,
            energy: state.energy,
            frequency: state.frequency,
            consciousnessFactor: state.consciousnessFactor,
            radius: this.calculateZoneRadius(state.energy),
            lifetime: 5000, // 5 seconds
            createdAt: performance.now()
        };
        
        this.transductionZones.push(zone);
        
        // Publish zone creation event
        window.EventBus.publish('uvo:zoneCreated', {
            zone: zone,
            fieldState: state
        });
    }

    /**
     * Calculate zone radius based on energy
     * @param {number} energy - Zone energy
     * @returns {number} - Zone radius
     */
    calculateZoneRadius(energy) {
        const baseRadius = 10;
        const energyScale = Math.log(energy + 1) / Math.log(1000);
        return baseRadius * (1 + energyScale);
    }

    /**
     * Get current field density
     * @returns {number} - Field density (0-1)
     */
    getFieldDensity() {
        let totalEnergy = 0;
        let activeCells = 0;
        
        this.vibrationalField.forEach((state) => {
            if (state.energy > 0) {
                totalEnergy += state.energy;
                activeCells++;
            }
        });
        
        const maxPossibleEnergy = this.gridSize * this.gridSize * this.gridSize * this.gridSize * 1000;
        return totalEnergy / maxPossibleEnergy;
    }

    /**
     * Get vibrational field at specific 4D coordinates
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @param {number} z - Z coordinate
     * @param {number} t - Time coordinate
     * @returns {Object} - Field state at coordinates
     */
    getFieldAt(x, y, z, t) {
        const key = `${x},${y},${z},${t}`;
        return this.vibrationalField.get(key) || {
            amplitude: 0,
            frequency: 0,
            phase: 0,
            energy: 0,
            consciousnessFactor: 0
        };
    }

    /**
     * Get field statistics
     * @returns {Object} - Field statistics
     */
    getFieldStats() {
        let totalEnergy = 0;
        let maxEnergy = 0;
        let avgFrequency = 0;
        let frequencyCount = 0;
        let totalConsciousness = 0;
        let consciousnessCount = 0;
        
        this.vibrationalField.forEach((state) => {
            totalEnergy += state.energy;
            maxEnergy = Math.max(maxEnergy, state.energy);
            
            if (state.frequency > 0) {
                avgFrequency += state.frequency;
                frequencyCount++;
            }
            
            if (state.consciousnessFactor > 0) {
                totalConsciousness += state.consciousnessFactor;
                consciousnessCount++;
            }
        });
        
        return {
            totalEnergy,
            maxEnergy,
            avgEnergy: totalEnergy / this.vibrationalField.size,
            avgFrequency: frequencyCount > 0 ? avgFrequency / frequencyCount : 0,
            avgConsciousness: consciousnessCount > 0 ? totalConsciousness / consciousnessCount : 0,
            activeZones: this.transductionZones.length,
            fieldDensity: this.getFieldDensity()
        };
    }

    /**
     * Update transduction zones
     * @param {number} deltaTime - Time since last update
     */
    updateZones(deltaTime) {
        const currentTime = performance.now();
        
        // Remove expired zones
        this.transductionZones = this.transductionZones.filter(zone => {
            const age = currentTime - zone.createdAt;
            return age < zone.lifetime;
        });
        
        // Update remaining zones
        this.transductionZones.forEach(zone => {
            const age = currentTime - zone.createdAt;
            const lifeProgress = age / zone.lifetime;
            
            // Fade energy over time
            zone.energy *= Math.exp(-lifeProgress * 0.1);
            
            // Update consciousness factor
            zone.consciousnessFactor *= Math.exp(-lifeProgress * 0.05);
        });
    }

    /**
     * Get active transduction zones
     * @returns {Array} - Array of active zones
     */
    getActiveZones() {
        return this.transductionZones.filter(zone => zone.energy > 0);
    }

    /**
     * Reset the UVO system
     */
    reset() {
        this.vibrationalField.clear();
        this.transductionHistory = [];
        this.transductionZones = [];
        this.initializeSubstrate();
        
        console.log('🔄 UVO system reset');
    }

    /**
     * Get transduction history
     * @param {number} limit - Maximum number of entries to return
     * @returns {Array} - Transduction history
     */
    getTransductionHistory(limit = 100) {
        return this.transductionHistory.slice(-limit);
    }
}

// Create global UVO instance
console.log('🌊 UVO: Creating global instance...');
try {
    window.UVO = new UVO();
    console.log('🌊 UVO: Global instance created successfully:', !!window.UVO);
    console.log('🌊 UVO: window.UVO type:', typeof window.UVO);
    console.log('🌊 UVO: window.UVO constructor:', window.UVO.constructor.name);
    console.log('🌊 UVO: window.UVO.initialize type:', typeof window.UVO.initialize);
} catch (error) {
    console.error('❌ UVO: Failed to create global instance:', error);
}

console.log('🌊 UVO: Script completed');

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UVO;
} 