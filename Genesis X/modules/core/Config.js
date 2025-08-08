/**
 * Config.js - Genesis Engine Configuration
 * 
 * Central configuration management for all Genesis Engine parameters.
 * This module contains all constants, settings, and configuration options
 * that govern the behavior of the living cosmos.
 */

class Config {
    constructor() {
        // Core System Configuration
        this.system = {
            targetFPS: 60,
            maxParticles: 100000,
            maxObjects: 10000,
            universeBounds: 1000000,
            sectorSize: 10000,
            debugMode: false,
            performanceMode: false
        };

        // Physics Constants (Unified Formula Parameters)
        this.physics = {
            // Speed of light (c)
            c: 299792458,
            
            // Gravitational constant (G)
            G: 6.67430e-11,
            
            // Planck constant (h)
            h: 6.62607015e-34,
            
            // Boltzmann constant (k)
            k: 1.380649e-23,
            
            // Cosmological constant (λ) - from 11D Lorenz attractor
            lambda: 1.1056e-52,
            
            // Soul Dust critical energy threshold
            criticalEnergyThreshold: 1000,
            
            // UVO (Unified Vibrational Ontology) parameters
            uvo: {
                frequencyRange: [20, 20000], // Hz
                amplitudeRange: [0, 1],
                spectralComplexityWeight: 0.5,
                transductionEfficiency: 0.8
            },
            
            // CST (Cosmic Synapse Theory) parameters
            cst: {
                dimensions: 12,
                synapticStrengthRange: [0, 1],
                consciousnessFieldStrength: 0.1,
                quantumEntanglementRange: 1000
            }
        };

        // Rendering Configuration
        this.rendering = {
            // Quality settings
            quality: {
                low: {
                    particleCount: 1000,
                    shadowQuality: 'low',
                    postProcessing: false,
                    textureQuality: 'low'
                },
                medium: {
                    particleCount: 10000,
                    shadowQuality: 'medium',
                    postProcessing: true,
                    textureQuality: 'medium'
                },
                high: {
                    particleCount: 50000,
                    shadowQuality: 'high',
                    postProcessing: true,
                    textureQuality: 'high'
                },
                ultra: {
                    particleCount: 100000,
                    shadowQuality: 'ultra',
                    postProcessing: true,
                    textureQuality: 'ultra'
                }
            },
            
            // Post-processing effects
            postProcessing: {
                bloom: {
                    enabled: true,
                    threshold: 0.8,
                    strength: 1.0,
                    radius: 0.8
                },
                godRays: {
                    enabled: true,
                    density: 0.96,
                    decay: 0.93,
                    weight: 0.4,
                    exposure: 0.6,
                    clampMax: 1.0
                },
                lensFlare: {
                    enabled: true,
                    intensity: 1.0
                },
                atmosphericScattering: {
                    enabled: true,
                    rayleigh: [2.802, 2.802, 2.802],
                    mie: [0.8, 0.8, 0.8],
                    rayleighHeight: 8000,
                    mieHeight: 1200
                }
            },
            
            // Soul Dust visualization
            soulDust: {
                pointSize: 2.0,
                maxPointSize: 10.0,
                fadeDistance: 1000,
                energyToBrightness: 1.0,
                frequencyToColor: true,
                amplitudeToSize: true
            }
        };

        // Audio Configuration
        this.audio = {
            // Microphone settings
            microphone: {
                sampleRate: 44100,
                bufferSize: 2048,
                channels: 1,
                smoothing: 0.8
            },
            
            // FFT analysis
            fft: {
                size: 1024,
                smoothing: 0.8,
                minFrequency: 20,
                maxFrequency: 20000
            },
            
            // Global influence controls
            influence: {
                sensitivity: 1.0, // 0.0 - 2.0, multiplies audio impact everywhere
                enableMicrophone: true,
                affectSoulDust: true,
                affectUnifiedFormula: true,
                affectUVO: true
            },

            // Audio to visual mapping
            mapping: {
                frequencyToColor: {
                    red: [20, 200],      // Low frequencies
                    orange: [200, 400],
                    yellow: [400, 800],
                    green: [800, 1600],
                    blue: [1600, 3200],
                    violet: [3200, 20000] // High frequencies
                },
                amplitudeToBrightness: {
                    min: 0.1,
                    max: 1.0,
                    gamma: 2.2
                }
            }
        };

        // AI Configuration
        this.ai = {
            // Consciousness parameters
            consciousness: {
                learningRate: 0.01,
                memoryCapacity: 10000,
                attentionSpan: 100,
                creativityFactor: 0.8
            },
            
            // Creation system
            creation: {
                maxObjectsPerSecond: 10,
                creationRadius: 1000,
                objectLifetime: 300, // seconds
                autonomousCreation: true,
                userInfluenceWeight: 0.7
            },
            
            // Learning sources
            learning: {
                enableLocalData: true,
                enableExternalAPIs: true,
                enableUserInteraction: true,
                enableEnvironmentalData: true
            }
        };

        // Universe Configuration
        this.universe = {
            // Scaling system
            scaling: {
                infiniteZoom: true,
                dynamicLOD: true,
                sectorBasedGeneration: true,
                objectCulling: true
            },
            
            // Object types
            objectTypes: {
                celestial: ['star', 'planet', 'nebula', 'galaxy', 'blackhole'],
                nature: ['tree', 'flower', 'mountain', 'ocean', 'cloud'],
                urban: ['building', 'car', 'bridge', 'road', 'lamp'],
                character: ['human', 'animal', 'robot', 'alien', 'spirit'],
                abstract: ['emotion', 'concept', 'energy', 'thought', 'dream'],
                fantasy: ['dragon', 'castle', 'magic', 'portal', 'crystal']
            },
            
            // Procedural generation
            procedural: {
                noiseScale: 0.01,
                octaves: 4,
                persistence: 0.5,
                lacunarity: 2.0
            }
        };

        // UI Configuration
        this.ui = {
            // Window settings
            windows: {
                draggable: true,
                resizable: true,
                minWidth: 200,
                maxWidth: 600,
                minHeight: 150,
                maxHeight: 400
            },
            
            // Performance monitoring
            performance: {
                showFPS: true,
                showMemory: true,
                showDrawCalls: true,
                showTriangles: true,
                updateInterval: 1000 // ms
            },
            
            // Controls
            controls: {
                mouseSensitivity: 0.002,
                keyboardSensitivity: 1.0,
                scrollSensitivity: 0.1,
                autoSave: true,
                saveInterval: 30000 // ms
            }
        };

        // Event Schema (for EventBus)
        this.events = {
            // Sensory events
            'sensory:audioBuffer': {
                description: 'Raw audio data from microphone',
                payload: {
                    timestamp: 'number',
                    buffer: 'Float32Array',
                    avgFreq: 'number',
                    amplitude: 'number',
                    spectralComplexity: 'number'
                }
            },
            
            // Engine events
            'engine:soulDustGenerated': {
                description: 'Soul Dust particle created',
                payload: {
                    timestamp: 'number',
                    particleID: 'string',
                    position: 'Vector3',
                    frequency: 'number',
                    amplitude: 'number',
                    energy: 'number'
                }
            },
            
            'engine:criticalEventTriggered': {
                description: 'Critical threshold event',
                payload: {
                    eventType: 'string',
                    location: 'Vector3',
                    energyReleased: 'number',
                    timestamp: 'number'
                }
            },
            
            // AI events
            'ai:objectCreated': {
                description: 'AI created new object',
                payload: {
                    objectType: 'string',
                    position: 'Vector3',
                    properties: 'object',
                    timestamp: 'number'
                }
            },
            
            // Universe events
            'universe:sectorGenerated': {
                description: 'New universe sector created',
                payload: {
                    sectorID: 'string',
                    position: 'Vector3',
                    objects: 'array',
                    timestamp: 'number'
                }
            }
        };

        this.isInitialized = false;
    }

    /**
     * Initialize the Config module
     */
    initialize() {
        this.isInitialized = true;
        console.log('🔧 Config initialized');
    }

    /**
     * Get configuration value by path
     * @param {string} path - Dot-separated path to config value
     * @returns {*} - Configuration value
     */
    get(path) {
        const keys = path.split('.');
        let value = this;
        
        for (const key of keys) {
            if (value && typeof value === 'object' && key in value) {
                value = value[key];
            } else {
                return undefined;
            }
        }
        
        return value;
    }

    /**
     * Set configuration value by path
     * @param {string} path - Dot-separated path to config value
     * @param {*} value - Value to set
     */
    set(path, value) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        let current = this;
        
        for (const key of keys) {
            if (!(key in current) || typeof current[key] !== 'object') {
                current[key] = {};
            }
            current = current[key];
        }
        
        current[lastKey] = value;
    }

    /**
     * Get quality settings for current performance level
     * @param {string} quality - Quality level ('low', 'medium', 'high', 'ultra')
     * @returns {Object} - Quality settings
     */
    getQualitySettings(quality = 'medium') {
        return this.rendering.quality[quality] || this.rendering.quality.medium;
    }

    /**
     * Update configuration from external source
     * @param {Object} newConfig - New configuration object
     */
    update(newConfig) {
        Object.assign(this, newConfig);
    }

    /**
     * Export current configuration
     * @returns {Object} - Configuration object
     */
    export() {
        return JSON.parse(JSON.stringify(this));
    }

    /**
     * Import configuration
     * @param {Object} config - Configuration object to import
     */
    import(config) {
        this.update(config);
    }

    /**
     * Set debug mode
     * @param {boolean} enabled - Whether debug mode is enabled
     */
    setDebugMode(enabled) {
        this.system.debugMode = enabled;
        console.log(`🔧 Debug mode ${enabled ? 'enabled' : 'disabled'}`);
    }

    /**
     * Reset to default configuration
     */
    reset() {
        Object.assign(this, new Config());
    }
}

// Create global config instance
window.Config = new Config();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Config;
} 