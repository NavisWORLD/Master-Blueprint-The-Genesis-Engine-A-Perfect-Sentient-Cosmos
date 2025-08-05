/**
 * AudioManager.js - Audio Input and Processing
 * 
 * Handles microphone input and audio processing for the Genesis Engine.
 * Captures environmental audio and processes it for transmutation into Soul Dust.
 */

class AudioManager {
    constructor() {
        console.log('🎵 AudioManager: Constructor starting...');
        
        this.audioContext = null;
        this.analyser = null;
        this.microphone = null;
        this.isInitialized = false;
        this.isRecording = false;
        
        // Audio processing parameters
        this.sampleRate = 44100; // Default, will be updated during initialization
        this.bufferSize = 2048; // Default, will be updated during initialization
        this.smoothing = 0.8; // Default, will be updated during initialization
        
        // FFT parameters
        this.fftSize = 1024; // Default, will be updated during initialization
        this.minFrequency = 20; // Default, will be updated during initialization
        this.maxFrequency = 20000; // Default, will be updated during initialization
        
        // Audio data buffers
        this.frequencyData = new Float32Array(this.fftSize / 2);
        this.timeData = new Float32Array(this.fftSize);
        
        // Processing history
        this.audioHistory = [];
        this.maxHistorySize = 100;
        
        console.log('🎵 AudioManager: Constructor completed');
    }

    /**
     * Initialize the audio manager
     */
    async initialize() {
        try {
            // Update configuration from Config module
            this.updateConfiguration();
            
            // Create audio context
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Request microphone access
            const stream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                    sampleRate: this.sampleRate,
                    channelCount: 1,
                    echoCancellation: false,
                    noiseSuppression: false,
                    autoGainControl: false
                } 
            });
            
            // Create audio source
            this.microphone = this.audioContext.createMediaStreamSource(stream);
            
            // Create analyser node
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = this.fftSize;
            this.analyser.smoothingTimeConstant = this.smoothing;
            
            // Connect microphone to analyser
            this.microphone.connect(this.analyser);
            
            this.isInitialized = true;
            console.log('🎵 Audio Manager initialized');
            
        } catch (error) {
            console.error('❌ Failed to initialize Audio Manager:', error);
            this.isInitialized = false;
        }
    }

    /**
     * Start audio recording
     */
    start() {
        if (!this.isInitialized) {
            console.warn('⚠️ Audio Manager not initialized');
            return;
        }
        
        this.isRecording = true;
        this.processAudio();
        
        console.log('🎤 Audio recording started');
    }

    /**
     * Stop audio recording
     */
    stop() {
        this.isRecording = false;
        console.log('⏹️ Audio recording stopped');
    }

    /**
     * Process audio data
     */
    processAudio() {
        if (!this.isRecording) return;
        
        // Get frequency data
        this.analyser.getFloatFrequencyData(this.frequencyData);
        this.analyser.getFloatTimeDomainData(this.timeData);
        
        // Calculate audio metrics
        const audioData = this.calculateAudioMetrics();
        
        // Store in history
        this.audioHistory.push(audioData);
        if (this.audioHistory.length > this.maxHistorySize) {
            this.audioHistory.shift();
        }
        
        // Publish audio buffer event
        window.EventBus.publish('sensory:audioBuffer', {
            timestamp: performance.now(),
            buffer: this.timeData,
            avgFreq: audioData.frequency,
            amplitude: audioData.amplitude,
            spectralComplexity: audioData.spectralComplexity
        });
        
        // Continue processing
        requestAnimationFrame(() => this.processAudio());
    }

    /**
     * Calculate audio metrics from frequency data
     * @returns {Object} - Audio metrics
     */
    calculateAudioMetrics() {
        // Calculate average frequency
        let totalFrequency = 0;
        let frequencyCount = 0;
        
        for (let i = 0; i < this.frequencyData.length; i++) {
            const freq = this.mapBinToFrequency(i);
            if (freq >= this.minFrequency && freq <= this.maxFrequency) {
                const magnitude = Math.pow(10, this.frequencyData[i] / 20);
                totalFrequency += freq * magnitude;
                frequencyCount += magnitude;
            }
        }
        
        const avgFrequency = frequencyCount > 0 ? totalFrequency / frequencyCount : 440;
        
        // Calculate amplitude (RMS)
        let sum = 0;
        for (let i = 0; i < this.timeData.length; i++) {
            sum += this.timeData[i] * this.timeData[i];
        }
        const rms = Math.sqrt(sum / this.timeData.length);
        const amplitude = window.Utils.clamp(rms * 10, 0, 1); // Scale and clamp
        
        // Calculate spectral complexity
        const spectralComplexity = this.calculateSpectralComplexity();
        
        return {
            frequency: avgFrequency,
            amplitude: amplitude,
            spectralComplexity: spectralComplexity,
            timestamp: performance.now()
        };
    }

    /**
     * Map FFT bin index to frequency
     * @param {number} binIndex - FFT bin index
     * @returns {number} - Frequency in Hz
     */
    mapBinToFrequency(binIndex) {
        return binIndex * this.audioContext.sampleRate / this.fftSize;
    }

    /**
     * Calculate spectral complexity
     * @returns {number} - Spectral complexity (0-1)
     */
    calculateSpectralComplexity() {
        // Count peaks in frequency spectrum
        let peakCount = 0;
        const threshold = -50; // dB threshold for peaks
        
        for (let i = 1; i < this.frequencyData.length - 1; i++) {
            const prev = this.frequencyData[i - 1];
            const curr = this.frequencyData[i];
            const next = this.frequencyData[i + 1];
            
            if (curr > threshold && curr > prev && curr > next) {
                peakCount++;
            }
        }
        
        // Normalize to 0-1 range
        return window.Utils.clamp(peakCount / 50, 0, 1);
    }

    /**
     * Get current audio level
     * @returns {number} - Audio level (0-1)
     */
    getAudioLevel() {
        if (this.audioHistory.length === 0) return 0;
        
        const latest = this.audioHistory[this.audioHistory.length - 1];
        return latest.amplitude;
    }

    /**
     * Get audio statistics
     * @returns {Object} - Audio statistics
     */
    getAudioStats() {
        if (this.audioHistory.length === 0) {
            return {
                avgFrequency: 0,
                avgAmplitude: 0,
                avgComplexity: 0,
                isRecording: this.isRecording
            };
        }
        
        const avgFrequency = this.audioHistory.reduce((sum, data) => sum + data.frequency, 0) / this.audioHistory.length;
        const avgAmplitude = this.audioHistory.reduce((sum, data) => sum + data.amplitude, 0) / this.audioHistory.length;
        const avgComplexity = this.audioHistory.reduce((sum, data) => sum + data.spectralComplexity, 0) / this.audioHistory.length;
        
        return {
            avgFrequency,
            avgAmplitude,
            avgComplexity,
            isRecording: this.isRecording,
            historySize: this.audioHistory.length
        };
    }

    /**
     * Update configuration from Config module
     */
    updateConfiguration() {
        this.sampleRate = window.Utils.getConfig('audio.microphone.sampleRate', 44100);
        this.bufferSize = window.Utils.getConfig('audio.microphone.bufferSize', 2048);
        this.smoothing = window.Utils.getConfig('audio.microphone.smoothing', 0.8);
        this.fftSize = window.Utils.getConfig('audio.fft.size', 1024);
        this.minFrequency = window.Utils.getConfig('audio.fft.minFrequency', 20);
        this.maxFrequency = window.Utils.getConfig('audio.fft.maxFrequency', 20000);
    }

    /**
     * Destroy the audio manager
     */
    destroy() {
        this.stop();
        
        if (this.microphone) {
            this.microphone.disconnect();
        }
        
        if (this.audioContext) {
            this.audioContext.close();
        }
        
        this.isInitialized = false;
        console.log('🗑️ Audio Manager destroyed');
    }
}

// Create global audio manager instance
console.log('🎵 AudioManager: Creating global instance...');
window.AudioManager = new AudioManager();
console.log('🎵 AudioManager: Global instance created:', !!window.AudioManager);

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AudioManager;
} 