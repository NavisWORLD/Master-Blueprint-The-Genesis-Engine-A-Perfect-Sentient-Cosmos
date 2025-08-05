/**
 * PerformanceMonitor.js - Performance Monitoring
 * 
 * Handles performance monitoring and optimization for the Genesis Engine.
 * This module tracks FPS, memory usage, and other performance metrics.
 */

class PerformanceMonitor {
    constructor() {
        this.isInitialized = false;
        this.metrics = {
            fps: 0,
            frameTime: 0,
            memoryUsage: 0,
            drawCalls: 0,
            triangles: 0,
            points: 0,
            lines: 0
        };
        
        // Performance tracking
        this.frameCount = 0;
        this.lastFrameTime = 0;
        this.frameTimes = [];
        this.maxFrameTimeHistory = 60;
        
        // Performance thresholds
        this.fpsThreshold = 30;
        this.memoryThreshold = 100 * 1024 * 1024; // 100MB
        this.drawCallThreshold = 1000;
        
        // Performance optimization
        this.autoOptimize = true;
        this.optimizationLevel = 0; // 0 = normal, 1 = optimized, 2 = minimal
        this.lastOptimizationCheck = 0;
        this.optimizationCheckInterval = 5000; // Check every 5 seconds
        
        // Memory monitoring
        this.memoryHistory = [];
        this.maxMemoryHistory = 100;
        
        // Performance alerts
        this.alerts = [];
        this.maxAlerts = 10;
    }

    /**
     * Initialize the performance monitor
     */
    initialize() {
        this.isInitialized = true;
        this.startMonitoring();
        console.log('📊 PerformanceMonitor initialized');
    }

    /**
     * Start performance monitoring
     */
    startMonitoring() {
        // Start frame time monitoring
        this.lastFrameTime = performance.now();
        
        // Start memory monitoring
        this.updateMemoryUsage();
        
        // Set up periodic checks
        setInterval(() => {
            this.updateMemoryUsage();
            this.checkPerformanceAlerts();
            this.autoOptimizePerformance();
        }, 1000);
    }

    /**
     * Update performance metrics
     * @param {number} deltaTime - Time since last update
     */
    update(deltaTime) {
        if (!this.isInitialized) return;
        
        // Update frame time metrics
        const currentTime = performance.now();
        const frameTime = currentTime - this.lastFrameTime;
        this.lastFrameTime = currentTime;
        
        // Update FPS
        this.metrics.fps = 1 / deltaTime;
        this.metrics.frameTime = frameTime;
        
        // Store frame time history
        this.frameTimes.push(frameTime);
        if (this.frameTimes.length > this.maxFrameTimeHistory) {
            this.frameTimes.shift();
        }
        
        // Update renderer info if available
        this.updateRendererInfo();
        
        this.frameCount++;
    }

    /**
     * Update renderer information
     */
    updateRendererInfo() {
        if (window.Renderer && window.Renderer.renderer && window.Renderer.renderer.info) {
            const info = window.Renderer.renderer.info;
            this.metrics.drawCalls = info.render.calls;
            this.metrics.triangles = info.render.triangles;
            this.metrics.points = info.render.points;
            this.metrics.lines = info.render.lines;
        }
    }

    /**
     * Update memory usage
     */
    updateMemoryUsage() {
        if (performance.memory) {
            this.metrics.memoryUsage = performance.memory.usedJSHeapSize;
            
            // Store memory history
            this.memoryHistory.push({
                timestamp: performance.now(),
                usage: this.metrics.memoryUsage
            });
            
            if (this.memoryHistory.length > this.maxMemoryHistory) {
                this.memoryHistory.shift();
            }
        }
    }

    /**
     * Check for performance alerts
     */
    checkPerformanceAlerts() {
        const alerts = [];
        
        // Check FPS
        if (this.metrics.fps < this.fpsThreshold) {
            alerts.push({
                type: 'fps',
                severity: 'warning',
                message: `Low FPS: ${Math.round(this.metrics.fps)} (threshold: ${this.fpsThreshold})`,
                timestamp: performance.now()
            });
        }
        
        // Check memory usage
        if (this.metrics.memoryUsage > this.memoryThreshold) {
            alerts.push({
                type: 'memory',
                severity: 'warning',
                message: `High memory usage: ${Math.round(this.metrics.memoryUsage / 1024 / 1024)}MB`,
                timestamp: performance.now()
            });
        }
        
        // Check draw calls
        if (this.metrics.drawCalls > this.drawCallThreshold) {
            alerts.push({
                type: 'drawCalls',
                severity: 'info',
                message: `High draw calls: ${this.metrics.drawCalls}`,
                timestamp: performance.now()
            });
        }
        
        // Add new alerts
        this.alerts.push(...alerts);
        
        // Limit alert history
        if (this.alerts.length > this.maxAlerts) {
            this.alerts = this.alerts.slice(-this.maxAlerts);
        }
    }

    /**
     * Auto-optimize performance
     */
    autoOptimizePerformance() {
        if (!this.autoOptimize) return;
        
        const currentTime = performance.now();
        if (currentTime - this.lastOptimizationCheck < this.optimizationCheckInterval) {
            return;
        }
        
        this.lastOptimizationCheck = currentTime;
        
        // Check if optimization is needed
        const needsOptimization = this.metrics.fps < this.fpsThreshold || 
                                 this.metrics.memoryUsage > this.memoryThreshold;
        
        if (needsOptimization && this.optimizationLevel < 2) {
            this.optimizationLevel++;
            this.applyOptimization();
        } else if (!needsOptimization && this.optimizationLevel > 0) {
            this.optimizationLevel--;
            this.applyOptimization();
        }
    }

    /**
     * Apply performance optimization
     */
    applyOptimization() {
        console.log(`📊 Applying optimization level ${this.optimizationLevel}`);
        
        switch (this.optimizationLevel) {
            case 0: // Normal
                this.setNormalQuality();
                break;
            case 1: // Optimized
                this.setOptimizedQuality();
                break;
            case 2: // Minimal
                this.setMinimalQuality();
                break;
        }
    }

    /**
     * Set normal quality settings
     */
    setNormalQuality() {
        if (window.InfiniteScaling) {
            window.InfiniteScaling.setPerformanceMode(false);
        }
        
        if (window.PostProcessor) {
            window.PostProcessor.toggleEffect('bloom');
            window.PostProcessor.toggleEffect('godRays');
            window.PostProcessor.toggleEffect('lensFlare');
        }
    }

    /**
     * Set optimized quality settings
     */
    setOptimizedQuality() {
        if (window.InfiniteScaling) {
            window.InfiniteScaling.setPerformanceMode(true);
        }
        
        if (window.PostProcessor) {
            window.PostProcessor.toggleEffect('godRays');
            window.PostProcessor.toggleEffect('lensFlare');
        }
    }

    /**
     * Set minimal quality settings
     */
    setMinimalQuality() {
        if (window.InfiniteScaling) {
            window.InfiniteScaling.setPerformanceMode(true);
        }
        
        if (window.PostProcessor) {
            window.PostProcessor.toggleEffect('bloom');
            window.PostProcessor.toggleEffect('godRays');
            window.PostProcessor.toggleEffect('lensFlare');
        }
    }

    /**
     * Get average FPS over time
     * @param {number} duration - Duration in seconds
     * @returns {number} - Average FPS
     */
    getAverageFPS(duration = 5) {
        const recentFrameTimes = this.frameTimes.slice(-Math.floor(duration * 60));
        if (recentFrameTimes.length === 0) return 0;
        
        const averageFrameTime = recentFrameTimes.reduce((sum, time) => sum + time, 0) / recentFrameTimes.length;
        return 1000 / averageFrameTime;
    }

    /**
     * Get memory usage trend
     * @returns {string} - Memory trend ('increasing', 'decreasing', 'stable')
     */
    getMemoryTrend() {
        if (this.memoryHistory.length < 10) return 'stable';
        
        const recent = this.memoryHistory.slice(-10);
        const first = recent[0].usage;
        const last = recent[recent.length - 1].usage;
        const change = last - first;
        const threshold = first * 0.1; // 10% threshold
        
        if (change > threshold) return 'increasing';
        if (change < -threshold) return 'decreasing';
        return 'stable';
    }

    /**
     * Get performance score (0-100)
     * @returns {number} - Performance score
     */
    getPerformanceScore() {
        let score = 100;
        
        // FPS penalty
        if (this.metrics.fps < 60) {
            score -= (60 - this.metrics.fps) * 2;
        }
        
        // Memory penalty
        const memoryMB = this.metrics.memoryUsage / 1024 / 1024;
        if (memoryMB > 50) {
            score -= (memoryMB - 50) * 0.5;
        }
        
        // Draw call penalty
        if (this.metrics.drawCalls > 500) {
            score -= (this.metrics.drawCalls - 500) * 0.01;
        }
        
        return Math.max(0, Math.min(100, score));
    }

    /**
     * Get detailed performance statistics
     * @returns {Object} - Detailed performance statistics
     */
    getDetailedStats() {
        return {
            current: this.metrics,
            average: {
                fps: this.getAverageFPS(),
                frameTime: this.frameTimes.length > 0 ? 
                    this.frameTimes.reduce((sum, time) => sum + time, 0) / this.frameTimes.length : 0
            },
            memory: {
                current: this.metrics.memoryUsage,
                trend: this.getMemoryTrend(),
                history: this.memoryHistory
            },
            performance: {
                score: this.getPerformanceScore(),
                optimizationLevel: this.optimizationLevel,
                alerts: this.alerts
            }
        };
    }

    /**
     * Get performance statistics
     * @returns {Object} - Performance statistics
     */
    getStats() {
        return {
            isInitialized: this.isInitialized,
            metrics: this.metrics,
            averageFPS: this.getAverageFPS(),
            memoryTrend: this.getMemoryTrend(),
            performanceScore: this.getPerformanceScore(),
            optimizationLevel: this.optimizationLevel,
            alertCount: this.alerts.length
        };
    }

    /**
     * Toggle auto-optimization
     * @param {boolean} enabled - Enable auto-optimization
     */
    setAutoOptimize(enabled) {
        this.autoOptimize = enabled;
        console.log(`📊 Auto-optimization ${enabled ? 'enabled' : 'disabled'}`);
    }

    /**
     * Set performance thresholds
     * @param {Object} thresholds - Performance thresholds
     */
    setThresholds(thresholds) {
        if (thresholds.fps !== undefined) this.fpsThreshold = thresholds.fps;
        if (thresholds.memory !== undefined) this.memoryThreshold = thresholds.memory;
        if (thresholds.drawCalls !== undefined) this.drawCallThreshold = thresholds.drawCalls;
    }

    /**
     * Clear performance alerts
     */
    clearAlerts() {
        this.alerts = [];
    }

    /**
     * Destroy the performance monitor
     */
    destroy() {
        this.isInitialized = false;
        this.frameTimes = [];
        this.memoryHistory = [];
        this.alerts = [];
        console.log('🗑️ PerformanceMonitor destroyed');
    }
}

// Create global performance monitor instance
window.PerformanceMonitor = new PerformanceMonitor();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceMonitor;
} 