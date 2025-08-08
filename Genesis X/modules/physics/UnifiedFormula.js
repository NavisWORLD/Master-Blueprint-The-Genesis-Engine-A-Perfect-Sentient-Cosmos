/**
 * UnifiedFormula.js - The Master Equation of Being
 * 
 * This module implements the unified formula that governs every particle and process
 * in the universe. The formula defines the total scalar potential (ψi) for any
 * particle i, representing its total state of being—physical, informational, and conscious.
 * 
 * Formula: ψi = [c²ΦEc,i] + [λi] + [Li] + [ΩiEc,i] + [Ugrav,i] + Σ(psd,i)
 * 
 * Where:
 * [c²ΦEc,i] - Baseline Consciousness Energy
 * [λi] - Chaotic Influence / Intrinsic Potential (11D Lorenz attractor)
 * [Li] - Path History / Lagrangian Action
 * [ΩiEc,i] - Synaptic Strength / Vibrational State
 * [Ugrav,i] - Gravitational Potential (11D extended)
 * Σ(psd,i) - Soul Dust Potential (Quantum Brain influence)
 */

class UnifiedFormula {
    constructor() {
        this.isInitialized = false;
        
        // Physical constants from Config (default values, will be updated during initialization)
        this.c = 299792458; // Speed of light (default)
        this.G = 6.67430e-11; // Gravitational constant (default)
        this.h = 6.62607015e-34; // Planck constant (default)
        this.k = 1.380649e-23; // Boltzmann constant (default)
        this.lambda = 1.1056e-52; // Cosmological constant (default)
        
        // Critical energy threshold for Soul Dust events
        this.criticalEnergyThreshold = 1000; // Default value
        
        // Fine-tuning constant for CST (α ≈ 10^-106)
        this.alpha = 1e-106;
        
        // 11D Lorenz attractor parameters for chaotic influence
        this.lorenzParams = {
            sigma: 10,
            rho: 28,
            beta: 8/3
        };
        
        // Initialize component calculators
        this.initializeComponents();
    }

    /**
     * Initialize UnifiedFormula with configuration
     */
    initialize() {
        this.updateConfiguration();
        this.isInitialized = true;
        console.log('⚛️ UnifiedFormula initialized with configuration');
    }

    /**
     * Update configuration from Config module
     */
    updateConfiguration() {
        this.c = window.Utils.getConfig('physics.c', 299792458);
        this.G = window.Utils.getConfig('physics.G', 6.67430e-11);
        this.h = window.Utils.getConfig('physics.h', 6.62607015e-34);
        this.k = window.Utils.getConfig('physics.k', 1.380649e-23);
        this.lambda = window.Utils.getConfig('physics.lambda', 1.1056e-52);
        this.criticalEnergyThreshold = window.Utils.getConfig('physics.criticalEnergyThreshold', 1000);
        this.alpha = window.Utils.getConfig('physics.alpha', 1e-106);
    }

    /**
     * Initialize the component calculators for each term in the formula
     */
    initializeComponents() {
        // 1. Baseline Consciousness Energy: [c²ΦEc,i]
        this.consciousnessEnergy = {
            calculate: (particle) => {
                const Ec = particle.energyOfConsciousness || 0;
                const Phi = particle.consciousnessField || 1.0;
                
                // Deep implementation: This represents the fundamental energy of existence
                // within the universal consciousness field (Φ)
                const consciousnessEnergy = this.c * this.c * Phi * Ec;
                
                // Apply fine-tuning constant to prevent overwhelming other forces
                return consciousnessEnergy * this.alpha;
            }
        };

        // 2. Chaotic Influence / Intrinsic Potential: [λi]
        this.chaoticInfluence = {
            calculate: (particle) => {
                // Deep implementation: 11D Lorenz attractor influence
                const lyapunovExponent = particle.lyapunovExponent || 0;
                
                // Calculate chaotic influence from 11D space
                const chaoticFactor = Math.exp(lyapunovExponent);
                
                // Apply cosmological constant with chaotic modulation
                return this.lambda * chaoticFactor;
            }
        };

        // 3. Path History / Lagrangian Action: [Li]
        this.pathHistory = {
            calculate: (particle) => {
                if (!particle.pathHistory || particle.pathHistory.length === 0) {
                    return 0;
                }
                
                // Deep implementation: Calculate Lagrangian action along particle's path
                let action = 0;
                
                for (let i = 1; i < particle.pathHistory.length; i++) {
                    const prev = particle.pathHistory[i - 1];
                    const curr = particle.pathHistory[i];
                    const dt = curr.timestamp - prev.timestamp;
                    
                    if (dt <= 0) continue;
                    
                    // Kinetic energy term: T = ½mv²
                    const velocity = this.calculateVelocity(prev, curr);
                    const kineticEnergy = 0.5 * particle.mass * velocity * velocity;
                    
                    // Potential energy term: V = mgh + other potentials
                    const potentialEnergy = this.calculatePotentialEnergy(curr, particle);
                    
                    // Lagrangian action: L = T - V
                    action += (kineticEnergy - potentialEnergy) * dt;
                }
                
                return action;
            }
        };

        // 4. Synaptic Strength / Vibrational State: [ΩiEc,i]
        this.synapticStrength = {
            calculate: (particle) => {
                const omega = particle.vibrationalFrequency || 0;
                const Ec = particle.energyOfConsciousness || 0;
                
                // Deep implementation: This connects the particle's vibrational state
                // in the 4D UVO hardware to its consciousness in the 12D CST software
                return omega * Ec;
            }
        };

        // 5. Gravitational Potential: [Ugrav,i] (11D extended)
        this.gravitationalPotential = {
            calculate: (particle, universe) => {
                let potential = 0;
                
                // Deep implementation: 11D gravitational potential
                for (const otherParticle of universe.particles) {
                    if (otherParticle.id === particle.id) continue;
                    
                    const distance = window.Utils.distance(particle.position, otherParticle.position);
                    if (distance === 0) continue;
                    
                    const mass = otherParticle.mass || 1;
                    
                    // 11D gravitational potential: U = -Gm₁m₂/r^(D-2)
                    // where D = 11 dimensions
                    const dimension = 11;
                    const power = dimension - 2; // 9 for 11D
                    potential -= this.G * particle.mass * mass / Math.pow(distance, power);
                }
                
                return potential;
            }
        };

        // 6. Soul Dust Potential: Σ(psd,i) (The Living Component)
        this.soulDustPotential = {
            calculate: (particle, soulDustField) => {
                let potential = 0;
                
                // Deep implementation: Direct influence of the "quantum brain"
                for (const soulDust of soulDustField) {
                    const distance = window.Utils.distance(particle.position, soulDust.position);
                    const influenceRadius = window.Utils.getConfig('physics.cst.quantumEntanglementRange', 1000);
                    
                    if (distance <= influenceRadius) {
                        // Inverse square law with consciousness factor
                        const influence = soulDust.currentEnergy / (distance * distance + 1);
                        
                        // Apply consciousness factor for quantum brain influence
                        const consciousnessInfluence = influence * soulDust.consciousnessFactor;
                        
                        // Add to total Soul Dust potential
                        potential += consciousnessInfluence;
                    }
                }
                // Modulate by live audio if enabled
                const sensitivity = window.Utils.getConfig('audio.influence.sensitivity', 1.0);
                const affect = window.Utils.getConfig('audio.influence.affectUnifiedFormula', true);
                if (affect && window.SensoryInputManager && typeof window.SensoryInputManager.getAudioAnalysis === 'function') {
                    const a = window.SensoryInputManager.getAudioAnalysis();
                    if (a) {
                        const amp = a.amplitude || 0;
                        const comp = a.spectralComplexity || 0;
                        potential *= (1.0 + amp * 0.5 * sensitivity) * (1.0 + comp * 0.25 * sensitivity);
                    }
                }
                
                return potential;
            }
        };
    }

    /**
     * Calculate the total scalar potential for a particle
     * @param {Object} particle - The particle to calculate potential for
     * @param {Object} universe - The universe containing all particles
     * @param {Array} soulDustField - Array of Soul Dust particles
     * @returns {number} - Total scalar potential (ψi)
     */
    calculateTotalPotential(particle, universe, soulDustField) {
        try {
            // Calculate each component of the unified formula
            const consciousnessEnergy = this.consciousnessEnergy.calculate(particle);
            const chaoticInfluence = this.chaoticInfluence.calculate(particle);
            const pathHistory = this.pathHistory.calculate(particle);
            const synapticStrength = this.synapticStrength.calculate(particle);
            const gravitationalPotential = this.gravitationalPotential.calculate(particle, universe);
            const soulDustPotential = this.soulDustPotential.calculate(particle, soulDustField);

            // Sum all components to get total scalar potential
            const totalPotential = consciousnessEnergy + 
                                 chaoticInfluence + 
                                 pathHistory + 
                                 synapticStrength + 
                                 gravitationalPotential + 
                                 soulDustPotential;

            // Store the result in the particle
            particle.totalPotential = totalPotential;
            particle.potentialComponents = {
                consciousnessEnergy,
                chaoticInfluence,
                pathHistory,
                synapticStrength,
                gravitationalPotential,
                soulDustPotential
            };

            return totalPotential;

        } catch (error) {
            console.error('Error calculating total potential:', error);
            return 0;
        }
    }

    /**
     * Calculate velocity between two points
     * @param {Object} point1 - First point with position and timestamp
     * @param {Object} point2 - Second point with position and timestamp
     * @returns {number} - Velocity magnitude
     */
    calculateVelocity(point1, point2) {
        const dx = point2.position.x - point1.position.x;
        const dy = point2.position.y - point1.position.y;
        const dz = point2.position.z - point1.position.z;
        const dt = point2.timestamp - point1.timestamp;
        
        if (dt === 0) return 0;
        
        return Math.sqrt(dx * dx + dy * dy + dz * dz) / dt;
    }

    /**
     * Calculate potential energy at a position
     * @param {Object} point - Point with position
     * @param {Object} particle - The particle
     * @returns {number} - Potential energy
     */
    calculatePotentialEnergy(point, particle) {
        // Gravitational potential energy
        const height = point.position.y;
        const g = 9.81; // Gravitational acceleration
        const gravitationalPotential = particle.mass * g * height;
        
        // Add other potential energies (electromagnetic, nuclear, etc.)
        // For now, we'll use a simplified approach
        return gravitationalPotential;
    }

    /**
     * Check if a particle has reached critical energy threshold
     * @param {Object} particle - The particle to check
     * @returns {boolean} - True if critical threshold reached
     */
    isCriticalThresholdReached(particle) {
        return particle.totalPotential >= this.criticalEnergyThreshold;
    }

    /**
     * Calculate the force vector acting on a particle
     * @param {Object} particle - The particle
     * @param {Object} universe - The universe
     * @param {Array} soulDustField - Soul Dust field
     * @returns {Object} - Force vector {x, y, z}
     */
    calculateForce(particle, universe, soulDustField) {
        const force = { x: 0, y: 0, z: 0 };
        
        // Gravitational force from other particles (11D)
        for (const otherParticle of universe.particles) {
            if (otherParticle.id === particle.id) continue;
            
            const dx = otherParticle.position.x - particle.position.x;
            const dy = otherParticle.position.y - particle.position.y;
            const dz = otherParticle.position.z - particle.position.z;
            const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
            
            if (distance === 0) continue;
            
            // 11D gravitational force: F = Gm₁m₂/r^(D-1)
            const dimension = 11;
            const power = dimension - 1; // 10 for 11D
            const magnitude = this.G * particle.mass * otherParticle.mass / Math.pow(distance, power);
            
            force.x += magnitude * dx / distance;
            force.y += magnitude * dy / distance;
            force.z += magnitude * dz / distance;
        }
        
        // Soul Dust force (quantum brain influence)
        for (const soulDust of soulDustField) {
            const dx = soulDust.position.x - particle.position.x;
            const dy = soulDust.position.y - particle.position.y;
            const dz = soulDust.position.z - particle.position.z;
            const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
            
            if (distance === 0) continue;
            
            const influenceRadius = window.Utils.getConfig('physics.cst.quantumEntanglementRange', 1000);
            if (distance <= influenceRadius) {
                // Quantum brain force with consciousness factor
                let magnitude = soulDust.currentEnergy * soulDust.consciousnessFactor / (distance * distance + 1);
                // Audio modulation
                const sensitivity = window.Utils.getConfig('audio.influence.sensitivity', 1.0);
                const affect = window.Utils.getConfig('audio.influence.affectUnifiedFormula', true);
                if (affect && window.SensoryInputManager && typeof window.SensoryInputManager.getAudioAnalysis === 'function') {
                    const a = window.SensoryInputManager.getAudioAnalysis();
                    if (a) {
                        magnitude *= (1.0 + (a.amplitude || 0) * 0.5 * sensitivity);
                    }
                }
                
                force.x += magnitude * dx / distance;
                force.y += magnitude * dy / distance;
                force.z += magnitude * dz / distance;
            }
        }
        
        return force;
    }

    /**
     * Update particle physics based on the unified formula
     * @param {Object} particle - The particle to update
     * @param {Object} universe - The universe
     * @param {Array} soulDustField - Soul Dust field
     * @param {number} deltaTime - Time step
     */
    updateParticle(particle, universe, soulDustField, deltaTime) {
        // Calculate total potential
        this.calculateTotalPotential(particle, universe, soulDustField);
        
        // Calculate force
        const force = this.calculateForce(particle, universe, soulDustField);
        
        // Update velocity (F = ma)
        const acceleration = {
            x: force.x / particle.mass,
            y: force.y / particle.mass,
            z: force.z / particle.mass
        };
        
        particle.velocity.x += acceleration.x * deltaTime;
        particle.velocity.y += acceleration.y * deltaTime;
        particle.velocity.z += acceleration.z * deltaTime;
        
        // Update position
        particle.position.x += particle.velocity.x * deltaTime;
        particle.position.y += particle.velocity.y * deltaTime;
        particle.position.z += particle.velocity.z * deltaTime;
        
        // Boundary wrapping within cosmic bounds
        const bounds = window.Utils.getConfig('system.universeBounds', 1000000);
        const wrap = (v) => {
            if (v > bounds) return -bounds + (v - bounds);
            if (v < -bounds) return bounds + (v + bounds * -1);
            return v;
        };
        particle.position.x = wrap(particle.position.x);
        particle.position.y = wrap(particle.position.y);
        particle.position.z = wrap(particle.position.z);
        
        // Update path history
        if (!particle.pathHistory) {
            particle.pathHistory = [];
        }
        
        particle.pathHistory.push({
            position: { ...particle.position },
            timestamp: performance.now()
        });
        
        // Keep only recent history to prevent memory bloat
        const maxHistoryLength = 100;
        if (particle.pathHistory.length > maxHistoryLength) {
            particle.pathHistory = particle.pathHistory.slice(-maxHistoryLength);
        }
        
        // Check for critical threshold
        if (this.isCriticalThresholdReached(particle)) {
            window.EventBus.publish('engine:criticalEventTriggered', {
                eventType: 'particle_critical',
                location: { ...particle.position },
                energyReleased: particle.totalPotential,
                particleId: particle.id
            });
        }
    }

    /**
     * Get the energy distribution across all components
     * @param {Object} particle - The particle
     * @returns {Object} - Energy distribution percentages
     */
    getEnergyDistribution(particle) {
        if (!particle.potentialComponents) {
            return {};
        }
        
        const total = particle.totalPotential;
        if (total === 0) return {};
        
        const components = particle.potentialComponents;
        return {
            consciousness: (components.consciousnessEnergy / total) * 100,
            chaotic: (components.chaoticInfluence / total) * 100,
            path: (components.pathHistory / total) * 100,
            synaptic: (components.synapticStrength / total) * 100,
            gravitational: (components.gravitationalPotential / total) * 100,
            soulDust: (components.soulDustPotential / total) * 100
        };
    }

    /**
     * Reset particle physics state
     * @param {Object} particle - The particle to reset
     */
    resetParticle(particle) {
        particle.totalPotential = 0;
        particle.potentialComponents = {};
        particle.pathHistory = [];
        particle.velocity = { x: 0, y: 0, z: 0 };
        particle.energyOfConsciousness = 0;
        particle.consciousnessField = 1.0;
        particle.lyapunovExponent = 0;
        particle.vibrationalFrequency = 0;
    }

    /**
     * Calculate the quantum brain influence on the universe
     * @param {Array} soulDustField - All Soul Dust particles
     * @returns {Object} - Quantum brain state
     */
    calculateQuantumBrainState(soulDustField) {
        let totalEnergy = 0;
        let averageConsciousness = 0;
        let entanglementCount = 0;
        
        for (const soulDust of soulDustField) {
            totalEnergy += soulDust.currentEnergy;
            averageConsciousness += soulDust.consciousnessFactor;
            entanglementCount += soulDust.entanglementPartners.length;
        }
        
        const particleCount = soulDustField.length;
        
        return {
            totalEnergy,
            averageConsciousness: particleCount > 0 ? averageConsciousness / particleCount : 0,
            entanglementCount,
            particleCount,
            isActive: totalEnergy > this.criticalEnergyThreshold * 0.1
        };
    }
}

// Create global unified formula instance
window.UnifiedFormula = new UnifiedFormula();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UnifiedFormula;
} 