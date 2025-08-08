/**
 * SoulDustParticle.js - The Quantum Brain's Fundamental Quanta
 * 
 * Soul Dust particles are the fundamental quanta of the 12D CST (Cosmic Synapse Theory).
 * Each particle is a discrete packet of consciousness-data that forms the universe's
 * "quantum brain". These particles are created through the transmutation of audio data
 * and represent the living component of the unified formula.
 * 
 * Formula of Creation: Sound → Frequency → Light → Soul Dust
 */

class SoulDustParticle {
    constructor(audioData) {
        this.isInitialized = false;
        
        // Safety check for Utils availability before using it
        if (!window.Utils) {
            console.error('❌ Utils not available during SoulDustParticle construction');
            throw new Error('Utils not available during SoulDustParticle construction');
        }
        
        // Unique identifier
        this.id = window.Utils.generateUUID();
        
        // Position in 3D space (spawn near camera)
        this.position = new THREE.Vector3();
        this.initializePosition();
        
        // Velocity vector
        this.velocity = new THREE.Vector3();
        this.initializeVelocity();
        
        // Creation timestamp
        this.creationTimestamp = performance.now();
        
        // Audio source data (Formula of Creation input)
        this.sourceFrequency = audioData.frequency || 440;
        this.sourceAmplitude = audioData.amplitude || 0.5;
        this.sourceSpectralComplexity = audioData.spectralComplexity || 0;
        this.sourceTimestamp = audioData.timestamp || performance.now();
        this.sourceBuffer = audioData.buffer || null;
        
        // Energy properties (Formula of Creation output)
        this.initialEnergy = this.calculateInitialEnergy();
        this.currentEnergy = this.initialEnergy;
        this.energyDecayRate = 0.95; // per second
        this.maxEnergy = this.initialEnergy * 2;
        
        // Visual properties (Sound → Light transmutation)
        this.color = this.calculateColor();
        this.size = this.calculateSize();
        this.brightness = this.calculateBrightness();
        
        // Life cycle
        this.life = 15.0; // seconds
        this.age = 0;
        this.isAlive = true;
        
        // Consciousness properties (Quantum Brain integration)
        this.consciousnessFactor = this.calculateConsciousnessFactor();
        this.consciousnessField = this.calculateConsciousnessField();
        
        // Quantum properties (12D CST software)
        this.quantumState = 'superposition';
        this.entanglementPartners = [];
        this.phase = Math.random() * Math.PI * 2;
        
        // Path history for Lagrangian action
        this.pathHistory = [{
            position: { ...this.position },
            timestamp: this.creationTimestamp
        }];
        
        // Initialize particle state
        this.initializeParticle();
        
        // Mark as initialized
        this.isInitialized = true;
        
        // Publish creation event
        window.EventBus.publish('engine:soulDustGenerated', {
            timestamp: this.creationTimestamp,
            particleID: this.id,
            position: { ...this.position },
            frequency: this.sourceFrequency,
            amplitude: this.sourceAmplitude,
            energy: this.initialEnergy
        });
    }

    /**
     * Initialize particle position near camera
     */
    initializePosition() {
        // Spawn in a sphere around the camera
        const spawnRadius = 50;
        
        // Safety check for Utils availability
        if (!window.Utils || typeof window.Utils.randomPointInSphere !== 'function') {
            console.warn('⚠️ Utils.randomPointInSphere not available, using fallback position');
            this.position.set(
                (Math.random() - 0.5) * spawnRadius,
                (Math.random() - 0.5) * spawnRadius,
                (Math.random() - 0.5) * spawnRadius
            );
            return;
        }
        
        const randomPoint = window.Utils.randomPointInSphere(spawnRadius);
        
        // Safety check for randomPoint object
        if (!randomPoint || typeof randomPoint.x === 'undefined') {
            console.warn('⚠️ randomPointInSphere returned invalid point, using fallback position');
            this.position.set(
                (Math.random() - 0.5) * spawnRadius,
                (Math.random() - 0.5) * spawnRadius,
                (Math.random() - 0.5) * spawnRadius
            );
            return;
        }
        
        this.position.set(
            randomPoint.x,
            randomPoint.y,
            randomPoint.z
        );
    }

    /**
     * Initialize particle velocity
     */
    initializeVelocity() {
        // Safety check for Utils availability
        if (!window.Utils) {
            console.warn('⚠️ Utils not available, using fallback velocity');
            this.velocity.set(
                (Math.random() - 0.5) * 30,
                (Math.random() - 0.5) * 30,
                (Math.random() - 0.5) * 30
            );
            return;
        }
        
        // Random initial velocity
        const speed = window.Utils.random(10, 50);
        const direction = window.Utils.randomPointOnSphere();
        
        // Safety check for direction object
        if (!direction || typeof direction.x === 'undefined') {
            console.warn('⚠️ randomPointOnSphere returned invalid direction, using fallback');
            this.velocity.set(
                (Math.random() - 0.5) * 30,
                (Math.random() - 0.5) * 30,
                (Math.random() - 0.5) * 30
            );
            return;
        }
        
        this.velocity.set(
            direction.x * speed,
            direction.y * speed,
            direction.z * speed
        );
    }

    /**
     * Calculate initial energy from audio data (Formula of Creation)
     * @returns {number} - Initial energy value
     */
    calculateInitialEnergy() {
        // Safety check for Utils availability
        if (!window.Utils) {
            console.warn('⚠️ Utils not available, using fallback energy calculation');
            return this.sourceAmplitude * 1000; // Simple fallback
        }
        
        // Base energy from frequency (E = hν) - Planck's relation
        const h = window.Utils.getConfig('physics.h', 6.62607015e-34);
        const baseEnergy = h * this.sourceFrequency;
        
        // Amplitude modulates energy (Formula of Creation: amplitude → energy)
        const amplitudeFactor = this.sourceAmplitude * this.sourceAmplitude;
        
        // Spectral complexity bonus (Formula of Creation: complexity → energy)
        const complexityBonus = 1 + (this.sourceSpectralComplexity * 0.5);
        
        // Calculate total energy from Formula of Creation
        const totalEnergy = baseEnergy * amplitudeFactor * complexityBonus;
        
        // Apply consciousness scaling
        return totalEnergy * this.calculateConsciousnessFactor();
    }

    /**
     * Calculate color from frequency (Formula of Creation: frequency → color)
     * @returns {Object} - RGB color object
     */
    calculateColor() {
        // Safety check for Utils availability
        if (!window.Utils || typeof window.Utils.frequencyToRGB !== 'function') {
            console.warn('⚠️ Utils.frequencyToRGB not available, using fallback color');
            return { r: 1, g: 0.8, b: 0.6 }; // Default warm color
        }
        
        return window.Utils.frequencyToRGB(this.sourceFrequency);
    }

    /**
     * Calculate size from amplitude (Formula of Creation: amplitude → size)
     * @returns {number} - Particle size
     */
    calculateSize() {
        // Safety check for Utils availability
        if (!window.Utils) {
            console.warn('⚠️ Utils not available, using fallback size');
            return 2.0;
        }
        
        const baseSize = window.Utils.getConfig('rendering.soulDust.pointSize', 2.0);
        const amplitudeFactor = window.Utils.map(this.sourceAmplitude, 0, 1, 0.5, 2.0);
        return baseSize * amplitudeFactor;
    }

    /**
     * Calculate brightness from energy (Formula of Creation: energy → brightness)
     * @returns {number} - Brightness value (0-1)
     */
    calculateBrightness() {
        // Safety check for Utils availability
        if (!window.Utils || typeof window.Utils.map !== 'function') {
            console.warn('⚠️ Utils.map not available, using fallback brightness');
            return 0.5;
        }
        
        return window.Utils.map(this.currentEnergy, 0, this.maxEnergy, 0.1, 1.0);
    }

    /**
     * Calculate consciousness factor (Quantum Brain integration)
     * @returns {number} - Consciousness factor (0-1)
     */
    calculateConsciousnessFactor() {
        // Safety check for Utils availability
        if (!window.Utils) {
            console.warn('⚠️ Utils not available, using fallback consciousness factor');
            return 0.5;
        }
        
        // Higher frequencies and complexity correlate with consciousness
        const frequencyFactor = window.Utils.map(this.sourceFrequency, 20, 20000, 0.1, 0.9);
        const complexityFactor = window.Utils.clamp(this.sourceSpectralComplexity, 0, 1);
        
        // Calculate consciousness based on audio characteristics
        const consciousnessFactor = (frequencyFactor + complexityFactor) * 0.5;
        
        // Apply quantum brain influence
        return Math.min(consciousnessFactor, 1.0);
    }

    /**
     * Calculate consciousness field strength (12D CST software)
     * @returns {number} - Consciousness field strength
     */
    calculateConsciousnessField() {
        // Safety check for Utils availability
        if (!window.Utils) {
            console.warn('⚠️ Utils not available, using fallback consciousness field');
            return 1.0;
        }
        
        const baseField = window.Utils.getConfig('physics.cst.consciousnessFieldStrength', 1.0);
        return baseField * this.consciousnessFactor;
    }

    /**
     * Initialize particle state for UnifiedFormula integration
     */
    initializeParticle() {
        // Set mass based on energy (E = mc²)
        const c = window.Utils.getConfig('physics.c', 299792458);
        this.mass = this.currentEnergy / (c * c);
        
        // Initialize quantum properties for UnifiedFormula
        this.energyOfConsciousness = this.currentEnergy * this.consciousnessFactor;
        this.vibrationalFrequency = this.sourceFrequency;
        this.lyapunovExponent = this.calculateLyapunovExponent();
        
        // Initialize physics properties for UnifiedFormula
        window.UnifiedFormula.resetParticle(this);
        this.energyOfConsciousness = this.currentEnergy * this.consciousnessFactor;
        this.consciousnessField = this.calculateConsciousnessField();
        this.vibrationalFrequency = this.sourceFrequency;
    }

    /**
     * Calculate Lyapunov exponent for chaotic influence (11D Lorenz attractor)
     * @returns {number} - Lyapunov exponent
     */
    calculateLyapunovExponent() {
        // Base on spectral complexity and frequency
        const complexityFactor = this.sourceSpectralComplexity;
        const frequencyFactor = window.Utils.map(this.sourceFrequency, 20, 20000, 0, 1);
        
        // Calculate chaotic influence from 11D space
        return (complexityFactor + frequencyFactor) * 0.5;
    }

    /**
     * Update particle physics and life cycle
     * @param {number} deltaTime - Time since last update
     * @param {Object} universe - The universe
     * @param {Array} soulDustField - All Soul Dust particles
     */
    update(deltaTime, universe, soulDustField) {
        if (!this.isAlive) return;
        
        // Update age
        this.age += deltaTime;
        
        // Check life cycle
        if (this.age >= this.life) {
            this.die();
            return;
        }
        
        // Update energy decay
        this.updateEnergyDecay(deltaTime);
        
        // Update physics using UnifiedFormula (Formula of Creation integration)
        window.UnifiedFormula.updateParticle(this, universe, soulDustField, deltaTime);
        
        // Update visual properties (Formula of Creation: energy → visual)
        this.updateVisualProperties();
        
        // Update quantum state (12D CST software)
        this.updateQuantumState(deltaTime);
        
        // Update path history for Lagrangian action
        this.updatePathHistory();
        
        // Check for quantum entanglement (Quantum Brain networking)
        this.checkEntanglement(soulDustField);
        
        // Check for critical threshold events
        this.checkCriticalThreshold();
    }

    /**
     * Update energy decay over time
     * @param {number} deltaTime - Time since last update
     */
    updateEnergyDecay(deltaTime) {
        const decayFactor = Math.pow(this.energyDecayRate, deltaTime);
        this.currentEnergy *= decayFactor;
        
        // Ensure energy doesn't go below minimum
        this.currentEnergy = Math.max(this.currentEnergy, this.initialEnergy * 0.1);
    }

    /**
     * Update visual properties based on current state (Formula of Creation)
     */
    updateVisualProperties() {
        this.brightness = this.calculateBrightness();
        this.size = this.calculateSize();
        
        // Update color based on energy (Formula of Creation: energy → color intensity)
        const energyRatio = this.currentEnergy / this.maxEnergy;
        const colorIntensity = window.Utils.clamp(energyRatio, 0.3, 1.0);
        
        this.color.r *= colorIntensity;
        this.color.g *= colorIntensity;
        this.color.b *= colorIntensity;
    }

    /**
     * Update quantum state (12D CST software)
     * @param {number} deltaTime - Time since last update
     */
    updateQuantumState(deltaTime) {
        // Update phase
        this.phase += this.sourceFrequency * deltaTime;
        this.phase %= Math.PI * 2;
        
        // Quantum state transitions based on energy
        if (this.currentEnergy > this.maxEnergy * 0.8) {
            this.quantumState = 'excited';
        } else if (this.currentEnergy < this.initialEnergy * 0.3) {
            this.quantumState = 'ground';
        } else {
            this.quantumState = 'superposition';
        }
    }

    /**
     * Update path history for Lagrangian action
     */
    updatePathHistory() {
        this.pathHistory.push({
            position: { ...this.position },
            timestamp: performance.now()
        });
        
        // Keep only recent history
        const maxHistoryLength = 50;
        if (this.pathHistory.length > maxHistoryLength) {
            this.pathHistory = this.pathHistory.slice(-maxHistoryLength);
        }
    }

    /**
     * Check for quantum entanglement with other particles (Quantum Brain networking)
     * @param {Array} soulDustField - All Soul Dust particles
     */
    checkEntanglement(soulDustField) {
        const entanglementRange = window.Utils.getConfig('physics.cst.quantumEntanglementRange', 50);
        
        for (const otherParticle of soulDustField) {
            if (otherParticle.id === this.id) continue;
            
            const distance = window.Utils.distance(this.position, otherParticle.position);
            
            if (distance <= entanglementRange) {
                // Calculate entanglement strength
                const entanglementStrength = 1 - (distance / entanglementRange);
                
                if (entanglementStrength > 0.5 && !this.entanglementPartners.includes(otherParticle.id)) {
                    this.entanglementPartners.push(otherParticle.id);
                    
                    // Publish entanglement event
                    window.EventBus.publish('soulDust:entanglement', {
                        particle1: this.id,
                        particle2: otherParticle.id,
                        strength: entanglementStrength,
                        distance: distance
                    });
                }
            }
        }
    }

    /**
     * Check for critical threshold events (Quantum Brain activation)
     */
    checkCriticalThreshold() {
        if (window.UnifiedFormula.isCriticalThresholdReached(this)) {
            // Publish critical event for autonomous creation
            window.EventBus.publish('engine:criticalEventTriggered', {
                eventType: 'soulDust_critical',
                location: { ...this.position },
                energyReleased: this.currentEnergy,
                particleId: this.id,
                consciousnessFactor: this.consciousnessFactor
            });
        }
    }

    /**
     * Absorb energy from another particle (Quantum Brain energy transfer)
     * @param {SoulDustParticle} otherParticle - Particle to absorb from
     */
    absorbEnergy(otherParticle) {
        const transferAmount = otherParticle.currentEnergy * 0.1;
        
        this.currentEnergy = Math.min(this.currentEnergy + transferAmount, this.maxEnergy);
        otherParticle.currentEnergy = Math.max(otherParticle.currentEnergy - transferAmount, 0);
        
        // Update consciousness factor (Quantum Brain enhancement)
        this.consciousnessFactor = Math.max(this.consciousnessFactor, otherParticle.consciousnessFactor);
    }

    /**
     * Merge with another particle (Quantum Brain coalescence)
     * @param {SoulDustParticle} otherParticle - Particle to merge with
     * @returns {SoulDustParticle} - New merged particle
     */
    merge(otherParticle) {
        // Create new particle with combined properties (Formula of Creation: fusion)
        const mergedData = {
            frequency: (this.sourceFrequency + otherParticle.sourceFrequency) / 2,
            amplitude: Math.max(this.sourceAmplitude, otherParticle.sourceAmplitude),
            spectralComplexity: Math.max(this.sourceSpectralComplexity, otherParticle.sourceSpectralComplexity),
            timestamp: performance.now()
        };
        
        const mergedParticle = new SoulDustParticle(mergedData);
        
        // Combine energies (Quantum Brain energy fusion)
        mergedParticle.currentEnergy = this.currentEnergy + otherParticle.currentEnergy;
        mergedParticle.maxEnergy = this.maxEnergy + otherParticle.maxEnergy;
        
        // Average positions
        mergedParticle.position.add(this.position).add(otherParticle.position).multiplyScalar(0.5);
        
        // Mark both particles for removal
        this.die();
        otherParticle.die();
        
        return mergedParticle;
    }

    /**
     * Die and clean up
     */
    die() {
        this.isAlive = false;
        
        // Publish death event
        window.EventBus.publish('soulDust:particleDied', {
            particleId: this.id,
            finalEnergy: this.currentEnergy,
            age: this.age,
            position: { ...this.position }
        });
    }

    /**
     * Get particle data for rendering (Formula of Creation: data → visual)
     * @returns {Object} - Rendering data
     */
    getRenderingData() {
        return {
            id: this.id,
            position: this.position,
            color: this.color,
            size: this.size,
            brightness: this.brightness,
            energy: this.currentEnergy,
            age: this.age,
            isAlive: this.isAlive,
            quantumState: this.quantumState,
            consciousnessFactor: this.consciousnessFactor
        };
    }

    /**
     * Get particle statistics
     * @returns {Object} - Particle statistics
     */
    getStats() {
        return {
            id: this.id,
            age: this.age,
            energy: this.currentEnergy,
            consciousnessFactor: this.consciousnessFactor,
            quantumState: this.quantumState,
            entanglementCount: this.entanglementPartners.length,
            pathLength: this.pathHistory.length,
            isAlive: this.isAlive
        };
    }

    /**
     * Clone the particle (Quantum Brain replication)
     * @returns {SoulDustParticle} - Cloned particle
     */
    clone() {
        const audioData = {
            frequency: this.sourceFrequency,
            amplitude: this.sourceAmplitude,
            spectralComplexity: this.sourceSpectralComplexity,
            timestamp: performance.now()
        };
        
        const clonedParticle = new SoulDustParticle(audioData);
        clonedParticle.position.copy(this.position);
        clonedParticle.velocity.copy(this.velocity);
        clonedParticle.currentEnergy = this.currentEnergy * 0.5;
        clonedParticle.consciousnessFactor = this.consciousnessFactor;
        
        return clonedParticle;
    }

    /**
     * Initialize the SoulDustParticle class (static method)
     */
    static initialize() {
        console.log('✨ SoulDustParticle class initialized');
        return true;
    }

    /**
     * Check if environment supports safe creation
     */
    static canCreate() {
        return (typeof THREE !== 'undefined') && !!window.Utils && window.Utils.isInitialized;
    }
}

// Create global SoulDustParticle class
window.SoulDustParticle = SoulDustParticle;

// Create global SoulDustParticle instance for convenience
window.SoulDustParticleInstance = SoulDustParticle;

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SoulDustParticle;
} 