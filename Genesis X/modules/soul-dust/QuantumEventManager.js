/**
 * QuantumEventManager.js - Soul Dust Event Management
 * 
 * Manages Soul Dust events and critical threshold detection for the Genesis Engine.
 * This module handles the quantum brain's collective consciousness events and
 * triggers autonomous creation when critical thresholds are reached.
 */

class QuantumEventManager {
    constructor() {
        this.isInitialized = false;
        this.isActive = false;
        this.criticalThreshold = 1000; // Default value, will be updated during initialization
        this.eventHistory = [];
        this.maxHistorySize = 1000;
        
        // Quantum brain state
        this.quantumBrainState = {
            totalEnergy: 0,
            averageConsciousness: 0,
            entanglementCount: 0,
            particleCount: 0,
            isActive: false
        };
        
        // Critical event types
        this.criticalEventTypes = {
            STELLAR_NURSERY: 'stellar_nursery',
            CHAOTIC_DESTABILIZATION: 'chaotic_destabilization',
            DIMENSIONAL_RIFT: 'dimensional_rift',
            QUANTUM_COALESCENCE: 'quantum_coalescence',
            CONSCIOUSNESS_SURGE: 'consciousness_surge'
        };
        
        // Event subscriptions
        this.eventSubscriptions = [];
    }

    /**
     * Initialize the quantum event manager
     */
    initialize() {
        this.updateConfiguration();
        this.setupEventSubscriptions();
        this.isInitialized = true;
        this.isActive = true;
        console.log('⚛️ Quantum Event Manager initialized');
    }

    /**
     * Update configuration from Config module
     */
    updateConfiguration() {
        this.criticalThreshold = window.Utils.getConfig('physics.criticalEnergyThreshold', 1000);
    }

    /**
     * Set up event subscriptions
     */
    setupEventSubscriptions() {
        // Subscribe to Soul Dust generation events
        this.eventSubscriptions.push(
            window.EventBus.subscribe('engine:soulDustGenerated', (eventData) => {
                this.handleSoulDustGenerated(eventData);
            })
        );
        
        // Subscribe to Soul Dust death events
        this.eventSubscriptions.push(
            window.EventBus.subscribe('soulDust:particleDied', (eventData) => {
                this.handleSoulDustDied(eventData);
            })
        );
        
        // Subscribe to entanglement events
        this.eventSubscriptions.push(
            window.EventBus.subscribe('soulDust:entanglement', (eventData) => {
                this.handleEntanglement(eventData);
            })
        );
    }

    /**
     * Update the quantum event manager
     * @param {number} deltaTime - Time since last update
     * @param {Array} soulDustField - Current Soul Dust field
     */
    update(deltaTime, soulDustField) {
        if (!this.isActive) return;
        
        // Update quantum brain state
        this.updateQuantumBrainState(soulDustField);
        
        // Check for critical threshold events
        this.checkCriticalEvents(soulDustField);
        
        // Process any pending events
        this.processEvents();
    }

    /**
     * Update quantum brain state
     * @param {Array} soulDustField - Current Soul Dust field
     */
    updateQuantumBrainState(soulDustField) {
        // Calculate quantum brain state using UnifiedFormula
        this.quantumBrainState = window.UnifiedFormula.calculateQuantumBrainState(soulDustField);
        
        // Publish quantum brain state update
        window.EventBus.publish('quantumBrain:stateUpdated', {
            timestamp: performance.now(),
            state: this.quantumBrainState
        });
    }

    /**
     * Handle Soul Dust generation event
     * @param {Object} eventData - Event data
     */
    handleSoulDustGenerated(eventData) {
        // Log the creation of a new Soul Dust particle
        console.log('✨ Soul Dust particle created:', eventData.particleID);
        
        // Add to event history
        this.addToEventHistory('soulDust_generated', eventData);
    }

    /**
     * Handle Soul Dust death event
     * @param {Object} eventData - Event data
     */
    handleSoulDustDied(eventData) {
        // Log the death of a Soul Dust particle
        console.log('💫 Soul Dust particle died:', eventData.particleId);
        
        // Add to event history
        this.addToEventHistory('soulDust_died', eventData);
    }

    /**
     * Handle entanglement event
     * @param {Object} eventData - Event data
     */
    handleEntanglement(eventData) {
        // Log quantum entanglement
        console.log('🔗 Quantum entanglement:', eventData.particle1, '↔', eventData.particle2);
        
        // Add to event history
        this.addToEventHistory('entanglement', eventData);
    }

    /**
     * Add event to history
     * @param {string} eventType - Type of event
     * @param {Object} eventData - Event data
     */
    addToEventHistory(eventType, eventData) {
        const event = {
            id: window.Utils.generateUUID(),
            type: eventType,
            data: eventData,
            timestamp: performance.now()
        };
        
        this.eventHistory.push(event);
        
        // Keep history size manageable
        if (this.eventHistory.length > this.maxHistorySize) {
            this.eventHistory.shift();
        }
    }

    /**
     * Process pending events
     */
    processEvents() {
        // Process any pending events in the queue
        // This can be expanded for more sophisticated event processing
    }

    /**
     * Check for critical threshold events
     * @param {Array} soulDustField - Current Soul Dust field
     */
    checkCriticalEvents(soulDustField) {
        // Check total energy threshold
        if (this.quantumBrainState.totalEnergy >= this.criticalThreshold) {
            this.triggerCriticalEvent(this.criticalEventTypes.CONSCIOUSNESS_SURGE, {
                energy: this.quantumBrainState.totalEnergy,
                consciousness: this.quantumBrainState.averageConsciousness
            });
        }
        
        // Check for high entanglement density
        if (this.quantumBrainState.entanglementCount > this.quantumBrainState.particleCount * 0.5) {
            this.triggerCriticalEvent(this.criticalEventTypes.QUANTUM_COALESCENCE, {
                entanglementCount: this.quantumBrainState.entanglementCount,
                particleCount: this.quantumBrainState.particleCount
            });
        }
        
        // Check for dimensional rift conditions
        if (this.quantumBrainState.averageConsciousness > 0.8 && this.quantumBrainState.totalEnergy > this.criticalThreshold * 0.5) {
            this.triggerCriticalEvent(this.criticalEventTypes.DIMENSIONAL_RIFT, {
                consciousness: this.quantumBrainState.averageConsciousness,
                energy: this.quantumBrainState.totalEnergy
            });
        }
    }

    /**
     * Trigger a critical event
     * @param {string} eventType - Type of critical event
     * @param {Object} eventData - Additional event data
     */
    triggerCriticalEvent(eventType, eventData) {
        // Calculate event location based on Soul Dust field
        const location = this.calculateEventLocation();
        
        const event = {
            id: window.Utils.generateUUID(),
            type: eventType,
            data: eventData,
            location: location,
            timestamp: performance.now()
        };
        
        this.eventHistory.push(event);
        if (this.eventHistory.length > this.maxHistorySize) {
            this.eventHistory.shift();
        }
        
        // Publish critical event for autonomous creation
        window.EventBus.publish('engine:criticalEventTriggered', {
            eventType: eventType,
            location: location,
            energyReleased: eventData.energy || eventData.consciousness || 0,
            timestamp: event.timestamp,
            eventData: eventData
        });
        
        console.log('⚡ Critical event triggered:', event);
        
        // Trigger autonomous creation based on event type
        this.triggerAutonomousCreation(eventType, location, eventData);
    }

    /**
     * Calculate event location based on Soul Dust field
     * @returns {Object} - Event location
     */
    calculateEventLocation() {
        // For now, return a random location
        // In a full implementation, this would be calculated based on Soul Dust density
        return {
            x: (Math.random() - 0.5) * 1000,
            y: (Math.random() - 0.5) * 1000,
            z: (Math.random() - 0.5) * 1000
        };
    }

    /**
     * Trigger autonomous creation based on critical event
     * @param {string} eventType - Type of critical event
     * @param {Object} location - Event location
     * @param {Object} eventData - Event data
     */
    triggerAutonomousCreation(eventType, location, eventData) {
        switch (eventType) {
            case this.criticalEventTypes.STELLAR_NURSERY:
                this.createStellarNursery(location, eventData);
                break;
                
            case this.criticalEventTypes.CHAOTIC_DESTABILIZATION:
                this.createChaoticDestabilization(location, eventData);
                break;
                
            case this.criticalEventTypes.DIMENSIONAL_RIFT:
                this.createDimensionalRift(location, eventData);
                break;
                
            case this.criticalEventTypes.QUANTUM_COALESCENCE:
                this.createQuantumCoalescence(location, eventData);
                break;
                
            case this.criticalEventTypes.CONSCIOUSNESS_SURGE:
                this.createConsciousnessSurge(location, eventData);
                break;
        }
    }

    /**
     * Create stellar nursery (high energy event)
     * @param {Object} location - Creation location
     * @param {Object} eventData - Event data
     */
    createStellarNursery(location, eventData) {
        window.EventBus.publish('ai:autonomousCreation', {
            objectType: 'stellar_nursery',
            position: location,
            properties: {
                energy: eventData.energy,
                size: eventData.energy / 100,
                lifetime: 300
            },
            timestamp: performance.now()
        });
    }

    /**
     * Create chaotic destabilization
     * @param {Object} location - Creation location
     * @param {Object} eventData - Event data
     */
    createChaoticDestabilization(location, eventData) {
        window.EventBus.publish('ai:autonomousCreation', {
            objectType: 'chaotic_field',
            position: location,
            properties: {
                chaosLevel: eventData.consciousness || 0.5,
                radius: 100,
                lifetime: 60
            },
            timestamp: performance.now()
        });
    }

    /**
     * Create dimensional rift
     * @param {Object} location - Creation location
     * @param {Object} eventData - Event data
     */
    createDimensionalRift(location, eventData) {
        window.EventBus.publish('ai:autonomousCreation', {
            objectType: 'dimensional_rift',
            position: location,
            properties: {
                consciousness: eventData.consciousness,
                energy: eventData.energy,
                size: 50,
                lifetime: 120
            },
            timestamp: performance.now()
        });
    }

    /**
     * Create quantum coalescence
     * @param {Object} location - Creation location
     * @param {Object} eventData - Event data
     */
    createQuantumCoalescence(location, eventData) {
        window.EventBus.publish('ai:autonomousCreation', {
            objectType: 'quantum_coalescence',
            position: location,
            properties: {
                entanglementCount: eventData.entanglementCount,
                particleCount: eventData.particleCount,
                size: 30,
                lifetime: 90
            },
            timestamp: performance.now()
        });
    }

    /**
     * Create consciousness surge
     * @param {Object} location - Creation location
     * @param {Object} eventData - Event data
     */
    createConsciousnessSurge(location, eventData) {
        window.EventBus.publish('ai:autonomousCreation', {
            objectType: 'consciousness_surge',
            position: location,
            properties: {
                consciousness: eventData.consciousness,
                energy: eventData.energy,
                size: 40,
                lifetime: 180
            },
            timestamp: performance.now()
        });
    }

    /**
     * Get quantum brain state
     * @returns {Object} - Quantum brain state
     */
    getQuantumBrainState() {
        return this.quantumBrainState;
    }

    /**
     * Get event statistics
     * @returns {Object} - Event statistics
     */
    getStats() {
        return {
            isActive: this.isActive,
            eventCount: this.eventHistory.length,
            criticalThreshold: this.criticalThreshold,
            quantumBrainState: this.quantumBrainState,
            recentEvents: this.eventHistory.slice(-10)
        };
    }

    /**
     * Destroy the quantum event manager
     */
    destroy() {
        this.isActive = false;
        this.eventHistory = [];
        
        // Unsubscribe from events
        this.eventSubscriptions.forEach(subscription => {
            if (subscription && typeof subscription.unsubscribe === 'function') {
                subscription.unsubscribe();
            }
        });
        
        this.eventSubscriptions = [];
        
        console.log('🗑️ Quantum Event Manager destroyed');
    }
}

// Create global quantum event manager instance
window.QuantumEventManager = new QuantumEventManager();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = QuantumEventManager;
} 