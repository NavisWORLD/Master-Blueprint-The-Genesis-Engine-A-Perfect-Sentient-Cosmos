/**
 * Utils.js - Genesis Engine Utilities
 * 
 * Essential utility functions for the Genesis Engine, including mathematical
 * operations, color conversions, performance monitoring, and helper functions.
 */

class Utils {
    constructor() {
        // Mathematical constants
        this.PI = Math.PI;
        this.TWO_PI = Math.PI * 2;
        this.HALF_PI = Math.PI / 2;
        this.DEG_TO_RAD = Math.PI / 180;
        this.RAD_TO_DEG = 180 / Math.PI;
        
        // Performance tracking
        this.performanceMetrics = {
            fps: 0,
            frameTime: 0,
            memoryUsage: 0,
            drawCalls: 0,
            triangles: 0
        };
        
        // Color mapping cache
        this.colorCache = new Map();
        
        // UUID generation
        this.uuidCounter = 0;
        
        this.isInitialized = false;
    }

    /**
     * Initialize the Utils module
     */
    initialize() {
        try {
            // Verify all methods are available
            if (typeof this.generateUUID !== 'function') {
                throw new Error('generateUUID method not available');
            }
            if (typeof this.frequencyToRGB !== 'function') {
                throw new Error('frequencyToRGB method not available');
            }
            if (typeof this.randomPointInSphere !== 'function') {
                throw new Error('randomPointInSphere method not available');
            }
            if (typeof this.randomPointOnSphere !== 'function') {
                throw new Error('randomPointOnSphere method not available');
            }
            if (typeof this.getConfig !== 'function') {
                throw new Error('getConfig method not available');
            }
            if (typeof this.clamp !== 'function') {
                throw new Error('clamp method not available');
            }
            if (typeof this.map !== 'function') {
                throw new Error('map method not available');
            }
            if (typeof this.random !== 'function') {
                throw new Error('random method not available');
            }
            
            this.isInitialized = true;
            console.log('🔧 Utils initialized successfully with all methods available');
        } catch (error) {
            console.error('❌ Utils initialization failed:', error);
            throw error;
        }
    }

    /**
     * Generate a unique identifier
     * @returns {string} - Unique ID
     */
    generateUUID() {
        this.uuidCounter++;
        return `genesis_${Date.now()}_${this.uuidCounter}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Convert frequency to RGB color using wavelength approximation
     * @param {number} frequency - Frequency in Hz
     * @returns {Object} - RGB color object {r, g, b}
     */
    frequencyToRGB(frequency) {
        // Use cached result if available
        const cacheKey = Math.round(frequency);
        if (this.colorCache.has(cacheKey)) {
            return this.colorCache.get(cacheKey);
        }

        // Convert frequency to wavelength (approximate)
        const wavelength = 3e8 / frequency; // c / f
        
        let r, g, b;
        
        if (wavelength >= 380 && wavelength < 440) {
            r = -(wavelength - 440) / (440 - 380);
            g = 0.0;
            b = 1.0;
        } else if (wavelength >= 440 && wavelength < 490) {
            r = 0.0;
            g = (wavelength - 440) / (490 - 440);
            b = 1.0;
        } else if (wavelength >= 490 && wavelength < 510) {
            r = 0.0;
            g = 1.0;
            b = -(wavelength - 510) / (510 - 490);
        } else if (wavelength >= 510 && wavelength < 580) {
            r = (wavelength - 510) / (580 - 510);
            g = 1.0;
            b = 0.0;
        } else if (wavelength >= 580 && wavelength < 645) {
            r = 1.0;
            g = -(wavelength - 645) / (645 - 580);
            b = 0.0;
        } else if (wavelength >= 645 && wavelength <= 780) {
            r = 1.0;
            g = 0.0;
            b = 0.0;
        } else {
            r = 0.0;
            g = 0.0;
            b = 0.0;
        }

        // Apply gamma correction
        const gamma = 0.8;
        r = Math.pow(r, gamma);
        g = Math.pow(g, gamma);
        b = Math.pow(b, gamma);

        const result = { r, g, b };
        this.colorCache.set(cacheKey, result);
        return result;
    }

    /**
     * Convert RGB to hexadecimal color
     * @param {number} r - Red component (0-1)
     * @param {number} g - Green component (0-1)
     * @param {number} b - Blue component (0-1)
     * @returns {string} - Hexadecimal color string
     */
    rgbToHex(r, g, b) {
        const toHex = (c) => {
            const hex = Math.round(c * 255).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }

    /**
     * Convert hexadecimal to RGB
     * @param {string} hex - Hexadecimal color string
     * @returns {Object} - RGB color object {r, g, b}
     */
    hexToRGB(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16) / 255,
            g: parseInt(result[2], 16) / 255,
            b: parseInt(result[3], 16) / 255
        } : { r: 0, g: 0, b: 0 };
    }

    /**
     * Linear interpolation between two values
     * @param {number} a - Start value
     * @param {number} b - End value
     * @param {number} t - Interpolation factor (0-1)
     * @returns {number} - Interpolated value
     */
    lerp(a, b, t) {
        return a + (b - a) * t;
    }

    /**
     * Clamp value between min and max
     * @param {number} value - Value to clamp
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number} - Clamped value
     */
    clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    /**
     * Map value from one range to another
     * @param {number} value - Input value
     * @param {number} inMin - Input minimum
     * @param {number} inMax - Input maximum
     * @param {number} outMin - Output minimum
     * @param {number} outMax - Output maximum
     * @returns {number} - Mapped value
     */
    map(value, inMin, inMax, outMin, outMax) {
        return outMin + (outMax - outMin) * ((value - inMin) / (inMax - inMin));
    }

    /**
     * Calculate distance between two 3D points
     * @param {Object} p1 - First point {x, y, z}
     * @param {Object} p2 - Second point {x, y, z}
     * @returns {number} - Distance
     */
    distance(p1, p2) {
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const dz = p2.z - p1.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    /**
     * Calculate squared distance (faster than distance)
     * @param {Object} p1 - First point {x, y, z}
     * @param {Object} p2 - Second point {x, y, z}
     * @returns {number} - Squared distance
     */
    distanceSquared(p1, p2) {
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const dz = p2.z - p1.z;
        return dx * dx + dy * dy + dz * dz;
    }

    /**
     * Generate random number between min and max
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number} - Random value
     */
    random(min, max) {
        return Math.random() * (max - min) + min;
    }

    /**
     * Generate random integer between min and max (inclusive)
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number} - Random integer
     */
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Generate random point on unit sphere
     * @returns {Object} - Random point {x, y, z}
     */
    randomPointOnSphere() {
        const theta = Math.random() * this.TWO_PI;
        const phi = Math.acos(2 * Math.random() - 1);
        
        return {
            x: Math.sin(phi) * Math.cos(theta),
            y: Math.sin(phi) * Math.sin(theta),
            z: Math.cos(phi)
        };
    }

    /**
     * Generate random point within sphere
     * @param {number} radius - Sphere radius
     * @returns {Object} - Random point {x, y, z}
     */
    randomPointInSphere(radius) {
        const point = this.randomPointOnSphere();
        const r = Math.pow(Math.random(), 1/3) * radius;
        
        return {
            x: point.x * r,
            y: point.y * r,
            z: point.z * r
        };
    }

    /**
     * Smooth step interpolation
     * @param {number} t - Interpolation factor (0-1)
     * @returns {number} - Smooth stepped value
     */
    smoothStep(t) {
        return t * t * (3 - 2 * t);
    }

    /**
     * Smoother step interpolation
     * @param {number} t - Interpolation factor (0-1)
     * @returns {number} - Smoother stepped value
     */
    smootherStep(t) {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }

    /**
     * Convert degrees to radians
     * @param {number} degrees - Degrees
     * @returns {number} - Radians
     */
    degToRad(degrees) {
        return degrees * this.DEG_TO_RAD;
    }

    /**
     * Convert radians to degrees
     * @param {number} radians - Radians
     * @returns {number} - Degrees
     */
    radToDeg(radians) {
        return radians * this.RAD_TO_DEG;
    }

    /**
     * Calculate FPS and performance metrics
     * @param {number} deltaTime - Time since last frame
     */
    updatePerformanceMetrics(deltaTime) {
        this.performanceMetrics.frameTime = deltaTime;
        this.performanceMetrics.fps = 1 / deltaTime;
        
        // Get memory usage if available
        if (performance.memory) {
            this.performanceMetrics.memoryUsage = performance.memory.usedJSHeapSize / 1024 / 1024; // MB
        }
    }

    /**
     * Get current performance metrics
     * @returns {Object} - Performance metrics
     */
    getPerformanceMetrics() {
        return { ...this.performanceMetrics };
    }

    /**
     * Format bytes to human readable string
     * @param {number} bytes - Bytes to format
     * @returns {string} - Formatted string
     */
    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    /**
     * Format time in milliseconds to human readable string
     * @param {number} ms - Milliseconds
     * @returns {string} - Formatted string
     */
    formatTime(ms) {
        if (ms < 1000) return `${ms.toFixed(1)}ms`;
        if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
        return `${(ms / 60000).toFixed(1)}m`;
    }

    /**
     * Deep clone an object
     * @param {*} obj - Object to clone
     * @returns {*} - Cloned object
     */
    deepClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj.getTime());
        if (obj instanceof Array) return obj.map(item => this.deepClone(item));
        if (typeof obj === 'object') {
            const cloned = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    cloned[key] = this.deepClone(obj[key]);
                }
            }
            return cloned;
        }
    }

    /**
     * Debounce function execution
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} - Debounced function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Throttle function execution
     * @param {Function} func - Function to throttle
     * @param {number} limit - Time limit in milliseconds
     * @returns {Function} - Throttled function
     */
    throttle(func, limit) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Check if two objects are equal (deep comparison)
     * @param {*} a - First object
     * @param {*} b - Second object
     * @returns {boolean} - True if equal
     */
    deepEqual(a, b) {
        if (a === b) return true;
        if (a == null || b == null) return false;
        if (typeof a !== typeof b) return false;
        
        if (typeof a === 'object') {
            if (Array.isArray(a) !== Array.isArray(b)) return false;
            
            const keysA = Object.keys(a);
            const keysB = Object.keys(b);
            
            if (keysA.length !== keysB.length) return false;
            
            for (const key of keysA) {
                if (!keysB.includes(key)) return false;
                if (!this.deepEqual(a[key], b[key])) return false;
            }
            
            return true;
        }
        
        return false;
    }

    /**
     * Generate a hash from a string
     * @param {string} str - String to hash
     * @returns {number} - Hash value
     */
    hashString(str) {
        let hash = 0;
        if (str.length === 0) return hash;
        
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        
        return hash;
    }

    /**
     * Check if browser supports WebGL
     * @returns {boolean} - True if WebGL is supported
     */
    isWebGLSupported() {
        try {
            const canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && 
                     (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
        } catch (e) {
            return false;
        }
    }

    /**
     * Check if browser supports Web Audio API
     * @returns {boolean} - True if Web Audio is supported
     */
    isWebAudioSupported() {
        return !!(window.AudioContext || window.webkitAudioContext);
    }

    /**
     * Get device pixel ratio
     * @returns {number} - Device pixel ratio
     */
    getDevicePixelRatio() {
        return window.devicePixelRatio || 1;
    }

    /**
     * Get viewport dimensions
     * @returns {Object} - Viewport dimensions {width, height}
     */
    getViewportSize() {
        return {
            width: window.innerWidth,
            height: window.innerHeight
        };
    }

    /**
     * Check if element is in viewport
     * @param {HTMLElement} element - Element to check
     * @returns {boolean} - True if in viewport
     */
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    /**
     * Safely get configuration value
     * @param {string} path - Configuration path
     * @param {*} defaultValue - Default value if Config is not available
     * @returns {*} - Configuration value or default
     */
    getConfig(path, defaultValue = undefined) {
        if (window.Config && typeof window.Config.get === 'function') {
            return window.Config.get(path) || defaultValue;
        }
        return defaultValue;
    }
}

// Create global utils instance
window.Utils = new Utils();

// Immediately initialize Utils to ensure it's ready
try {
    window.Utils.initialize();
    console.log('✅ Utils immediately initialized and ready');
} catch (error) {
    console.error('❌ Utils immediate initialization failed:', error);
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
} 