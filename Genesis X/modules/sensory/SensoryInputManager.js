/**
 * SensoryInputManager.js - Sensory Input Management
 * 
 * Handles sensory input processing for the Genesis Engine.
 * This module manages environmental data collection and processing,
 * implementing the Formula of Creation: Sound → Frequency → Light → Soul Dust
 */

class SensoryInputManager {
    constructor() {
        this.isInitialized = false;
        this.sensors = new Map();
        
        // Audio processing components
        this.audioContext = null;
        this.analyser = null;
        this.microphone = null;
        this.audioStream = null;
        
        // FFT analysis
        this.fftSize = 1024;
        this.frequencyData = new Float32Array(this.fftSize);
        this.timeDomainData = new Float32Array(this.fftSize);
        
        // Audio analysis results
        this.audioAnalysis = {
            frequency: 440,
            amplitude: 0.5,
            spectralComplexity: 0,
            timestamp: 0
        };
        
        // Soul Dust generation
        this.soulDustGenerationEnabled = true;
        this.generationRate = 10; // particles per second
        this.lastGenerationTime = 0;
        
        // Event subscriptions
        this.eventSubscriptions = [];
    }

    /**
     * Initialize the sensory input manager
     */
    async initialize() {
        try {
            // Safety check for Utils availability
            if (!window.Utils || !window.Utils.isInitialized) {
                console.warn('⚠️ Utils not available during SensoryInputManager initialization, waiting...');
                let attempts = 0;
                while ((!window.Utils || !window.Utils.isInitialized) && attempts < 50) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                    attempts++;
                }
                
                if (!window.Utils || !window.Utils.isInitialized) {
                    throw new Error('Utils failed to initialize after 5 seconds');
                }
            }
            
            // Initialize audio context
            await this.initializeAudioContext();
            
            // Set up event subscriptions
            this.setupEventSubscriptions();
            
            this.isInitialized = true;
            console.log('👁️ Sensory Input Manager initialized');
            
        } catch (error) {
            console.error('❌ Failed to initialize Sensory Input Manager:', error);
            throw error;
        }
    }

    /**
     * Initialize audio context and microphone
     */
    async initializeAudioContext() {
        try {
            // Use existing AudioManager instead of requesting new permissions
            if (window.AudioManager && window.AudioManager.isInitialized) {
                console.log('🎤 Using existing AudioManager for microphone access');
                this.audioContext = window.AudioManager.audioContext;
                this.analyser = window.AudioManager.analyser;
                this.microphone = window.AudioManager.microphone;
                return;
            }
            
            // Fallback: Create audio context only if AudioManager is not available
            console.warn('⚠️ AudioManager not available, creating fallback audio context');
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Request microphone access only if AudioManager is not available
            this.audioStream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    sampleRate: 44100,
                    channelCount: 1,
                    echoCancellation: false,
                    noiseSuppression: false,
                    autoGainControl: false
                }
            });
            
            // Create microphone source
            this.microphone = this.audioContext.createMediaStreamSource(this.audioStream);
            
            // Create analyser node
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = this.fftSize;
            this.analyser.smoothingTimeConstant = 0.8;
            
            // Connect microphone to analyser
            this.microphone.connect(this.analyser);
            
            console.log('🎤 Audio context initialized successfully');
            
        } catch (error) {
            console.warn('⚠️ Audio initialization failed, continuing without audio:', error);
            this.audioContext = null;
            this.analyser = null;
            this.microphone = null;
        }
    }

    /**
     * Set up event subscriptions
     */
    setupEventSubscriptions() {
        // Subscribe to engine events
        this.eventSubscriptions.push(
            window.EventBus.subscribe('engine:update', (eventData) => {
                this.update(eventData.deltaTime);
            })
        );
    }

    /**
     * Update the sensory input manager
     * @param {number} deltaTime - Time since last update
     */
    update(deltaTime) {
        if (!this.isInitialized) return;
        
        // Update audio analysis
        this.updateAudioAnalysis();
        
        // Transmit to UVO (vibrational substrate)
        if (window.UVO && this.audioAnalysis) {
            const sensitivity = window.Utils.getConfig('audio.influence.sensitivity', 1.0);
            const scaled = {
                frequency: this.audioAnalysis.frequency,
                amplitude: this.audioAnalysis.amplitude * sensitivity,
                spectralComplexity: this.audioAnalysis.spectralComplexity,
                timestamp: this.audioAnalysis.timestamp,
                buffer: this.frequencyData
            };
            if (window.Utils.getConfig('audio.influence.affectUVO', true)) {
                window.UVO.transduceAudio(scaled);
            }
        }
        
        // Generate Soul Dust particles
        this.updateSoulDustGeneration(deltaTime);
    }

    /**
     * Update audio analysis using FFT
     */
    updateAudioAnalysis() {
        if (!this.analyser) return;
        // Prefer AudioManager data if available
        if (window.AudioManager && window.AudioManager.isInitialized) {
            // Pull latest processed metrics from AudioManager
            const stats = window.AudioManager.getAudioStats();
            const last = window.AudioManager.audioHistory.length ? window.AudioManager.audioHistory[window.AudioManager.audioHistory.length - 1] : null;
            if (last) {
                this.audioAnalysis.frequency = last.frequency;
                this.audioAnalysis.amplitude = last.amplitude;
                this.audioAnalysis.spectralComplexity = last.spectralComplexity;
                this.audioAnalysis.timestamp = last.timestamp;
            }
        }
        
        // Get frequency data
        this.analyser.getFloatFrequencyData(this.frequencyData);
        this.analyser.getFloatTimeDomainData(this.timeDomainData);
        
        // Analyze audio data
        this.analyzeAudioData();
        
        // Publish audio buffer event
        window.EventBus.publish('sensory:audioBuffer', {
            timestamp: performance.now(),
            buffer: this.frequencyData,
            avgFreq: this.audioAnalysis.frequency,
            amplitude: this.audioAnalysis.amplitude,
            spectralComplexity: this.audioAnalysis.spectralComplexity
        });
    }

    /**
     * Analyze audio data using FFT
     */
    analyzeAudioData() {
        // Calculate dominant frequency
        this.audioAnalysis.frequency = this.calculateDominantFrequency();
        
        // Calculate amplitude
        this.audioAnalysis.amplitude = this.calculateAmplitude();
        
        // Calculate spectral complexity
        this.audioAnalysis.spectralComplexity = this.calculateSpectralComplexity();
        
        // Update timestamp
        this.audioAnalysis.timestamp = performance.now();
    }

    /**
     * Calculate dominant frequency from FFT data
     * @returns {number} - Dominant frequency in Hz
     */
    calculateDominantFrequency() {
        if (!this.analyser) return 440;
        
        const sampleRate = this.audioContext.sampleRate;
        const binSize = sampleRate / this.fftSize;
        
        let maxMagnitude = -Infinity;
        let dominantBin = 0;
        
        // Find the bin with maximum magnitude
        for (let i = 0; i < this.fftSize / 2; i++) {
            const magnitude = this.frequencyData[i];
            if (magnitude > maxMagnitude) {
                maxMagnitude = magnitude;
                dominantBin = i;
            }
        }
        
        // Convert bin to frequency
        const frequency = dominantBin * binSize;
        
        // Clamp to audible range
        return Math.max(20, Math.min(20000, frequency));
    }

    /**
     * Calculate amplitude from time domain data
     * @returns {number} - Amplitude (0-1)
     */
    calculateAmplitude() {
        if (!this.analyser) return 0.5;
        
        let sum = 0;
        
        // Calculate RMS amplitude
        for (let i = 0; i < this.timeDomainData.length; i++) {
            sum += this.timeDomainData[i] * this.timeDomainData[i];
        }
        
        const rms = Math.sqrt(sum / this.timeDomainData.length);
        
        // Convert to 0-1 range
        return Math.min(1.0, Math.max(0.0, rms * 10));
    }

    /**
     * Calculate spectral complexity
     * @returns {number} - Spectral complexity (0-1)
     */
    calculateSpectralComplexity() {
        if (!this.analyser) return 0;
        
        let peakCount = 0;
        const threshold = -50; // dB threshold for peaks
        
        // Count frequency peaks
        for (let i = 1; i < this.frequencyData.length - 1; i++) {
            const current = this.frequencyData[i];
            const prev = this.frequencyData[i - 1];
            const next = this.frequencyData[i + 1];
            
            if (current > threshold && current > prev && current > next) {
                peakCount++;
            }
        }
        
        // Normalize to 0-1 range
        return Math.min(1.0, peakCount / 100);
    }

    /**
     * Update Soul Dust generation
     * @param {number} deltaTime - Time since last update
     */
    updateSoulDustGeneration(deltaTime) {
        if (!this.soulDustGenerationEnabled) return;
        
        const currentTime = performance.now();
        const timeSinceLastGeneration = currentTime - this.lastGenerationTime;
        const generationInterval = 1000 / this.generationRate; // milliseconds per particle
        
        if (timeSinceLastGeneration >= generationInterval) {
            this.generateSoulDustParticle();
            this.lastGenerationTime = currentTime;
        }
    }

    /**
     * Generate a new Soul Dust particle
     */
    generateSoulDustParticle() {
        if (!window.SoulDustParticle) {
            console.warn('⚠️ SoulDustParticle not available, skipping generation');
            return;
        }
        
        if (!window.Utils || !window.Utils.isInitialized) {
            console.warn('⚠️ Utils not available or not initialized, skipping Soul Dust generation');
            return;
        }
        
        // Check if SoulDustParticle can be created safely
        if (!window.SoulDustParticle.canCreate()) {
            console.warn('⚠️ SoulDustParticle cannot be created safely (THREE or Utils not available), skipping generation');
            return;
        }
        
        try {
            // Create audio data for particle
            const sensitivity = window.Utils.getConfig('audio.influence.sensitivity', 1.0);
            const audioData = {
                frequency: this.audioAnalysis.frequency || 440,
                amplitude: (this.audioAnalysis.amplitude || 0.5) * sensitivity,
                spectralComplexity: this.audioAnalysis.spectralComplexity || 0,
                timestamp: performance.now(),
                buffer: this.frequencyData || new Float32Array(1024)
            };
            
            // Create Soul Dust particle
            const particle = new window.SoulDustParticle(audioData);
            if (window.GenesisEngine && window.GenesisEngine.soulDustField) {
                window.GenesisEngine.soulDustField.push(particle);
            }
            
            // Publish particle creation event
            window.EventBus.publish('soulDust:particleCreated', {
                particle: particle,
                audioData: audioData,
                timestamp: performance.now()
            });
            
            console.log('✨ Soul Dust particle created:', particle.id);
            
        } catch (error) {
            console.error('❌ SoulDustParticle creation failed:', error);
        }
    }

    /**
     * Enable or disable Soul Dust generation
     * @param {boolean} enabled - Whether to enable generation
     */
    setSoulDustGenerationEnabled(enabled) {
        this.soulDustGenerationEnabled = enabled;
        console.log(`✨ Soul Dust generation ${enabled ? 'enabled' : 'disabled'}`);
    }

    /**
     * Set Soul Dust generation rate
     * @param {number} rate - Particles per second
     */
    setGenerationRate(rate) {
        this.generationRate = Math.max(1, Math.min(100, rate));
        console.log(`✨ Soul Dust generation rate set to ${this.generationRate} particles/second`);
    }

    /**
     * Get current audio analysis
     * @returns {Object} - Current audio analysis
     */
    getAudioAnalysis() {
        return { ...this.audioAnalysis };
    }

    /**
     * Get sensory input statistics
     * @returns {Object} - Sensory input statistics
     */
    getStats() {
        return {
            isInitialized: this.isInitialized,
            sensorCount: this.sensors.size,
            audioContext: !!this.audioContext,
            analyser: !!this.analyser,
            microphone: !!this.microphone,
            soulDustGenerationEnabled: this.soulDustGenerationEnabled,
            generationRate: this.generationRate,
            audioAnalysis: this.audioAnalysis
        };
    }

    /**
     * Destroy the sensory input manager
     */
    destroy() {
        // Stop audio stream
        if (this.audioStream) {
            this.audioStream.getTracks().forEach(track => track.stop());
        }
        
        // Close audio context
        if (this.audioContext) {
            this.audioContext.close();
        }
        
        // Clear sensors
        this.sensors.clear();
        
        // Unsubscribe from events
        this.eventSubscriptions.forEach(subscription => {
            if (subscription && typeof subscription.unsubscribe === 'function') {
                subscription.unsubscribe();
            }
        });
        
        this.eventSubscriptions = [];
        this.isInitialized = false;
        
        console.log('🗑️ Sensory Input Manager destroyed');
    }
}

// Create global sensory input manager instance
window.SensoryInputManager = new SensoryInputManager();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SensoryInputManager;
} 