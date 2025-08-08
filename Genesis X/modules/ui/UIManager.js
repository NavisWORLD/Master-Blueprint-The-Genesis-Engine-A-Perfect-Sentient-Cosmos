/**
 * UIManager.js - UI Management System
 * 
 * Handles UI updates and interactions for the Genesis Engine.
 * This module manages the user interface, tab interactions,
 * and provides comprehensive UI controls.
 */

console.log('🔧 UIManager.js: Starting to load...');

class UIManager {
    constructor() {
        console.log('🔧 UIManager: Constructor called');
        this.isInitialized = false;
        this.windows = new Map();
        this.draggableWindows = new Map();
        this.activeWindow = null;
        
        // UI state
        this.isUIVisible = true;
        this.isDragging = false;
        this.dragOffset = { x: 0, y: 0 };
        
        // Tab management
        this.activeTab = 'controls';
        this.tabs = ['controls', 'performance', 'universe', 'soul-dust', 'ai'];
        
        // Window management
        this.windowZIndex = 1000;
        
        // UI elements
        this.uiElements = new Map();
        this.eventListeners = new Map();
        
        console.log('🔧 UIManager: Constructor completed');
    }

    /**
     * Initialize the UI manager
     */
    initialize() {
        console.log('🔧 UIManager: initialize() called');
        this.isInitialized = true;
        this.setupDraggableWindows();
        this.setupEventListeners();
        this.setupTabSystem();
        // Initialize audio slider from config
        const slider = document.getElementById('audio-sensitivity-slider');
        const sensValEl = document.getElementById('audio-sensitivity-value');
        if (slider && window.Config) {
            const sensitivity = window.Config.get('audio.influence.sensitivity') ?? 1.0;
            slider.value = Math.round(sensitivity * 100);
            if (sensValEl) sensValEl.textContent = Math.round(sensitivity * 100) + '%';
        }
        console.log('🖥️ UI Manager initialized');
    }

    /**
     * Setup tab system
     */
    setupTabSystem() {
        console.log('🔧 UIManager: Setting up tab system');
        
        // Set up tab click handlers
        this.tabs.forEach(tabName => {
            const tabElement = document.querySelector(`[data-tab="${tabName}"]`);
            const tabContent = document.getElementById(`${tabName}-tab`);
            
            if (tabElement && tabContent) {
                this.uiElements.set(tabName, { tab: tabElement, content: tabContent });
            }
        });
        
        console.log('🔧 UIManager: Tab system setup complete');
    }

    /**
     * Switch to a specific tab
     * @param {string} tabName - Name of tab to switch to
     */
    switchTab(tabName) {
        if (!this.tabs.includes(tabName)) return;
        
        // Remove active class from all tabs and contents
        this.tabs.forEach(tab => {
            const tabElement = document.querySelector(`[data-tab="${tab}"]`);
            const tabContent = document.getElementById(`${tab}-tab`);
            
            if (tabElement) tabElement.classList.remove('active');
            if (tabContent) tabContent.classList.remove('active');
        });
        
        // Add active class to selected tab and content
        const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
        const selectedContent = document.getElementById(`${tabName}-tab`);
        
        if (selectedTab) selectedTab.classList.add('active');
        if (selectedContent) selectedContent.classList.add('active');
        
        this.activeTab = tabName;
        console.log(`🔧 UIManager: Switched to tab: ${tabName}`);
    }

    /**
     * Setup draggable windows
     */
    setupDraggableWindows() {
        console.log('🔧 UIManager: setupDraggableWindows() called');
        try {
            const draggableWindows = document.querySelectorAll('.draggable');
            console.log('🔧 UIManager: Found ' + draggableWindows.length + ' draggable windows');
            
            draggableWindows.forEach((window, index) => {
                console.log('🔧 UIManager: Processing window ' + index);
                this.setupDraggableWindow(window);
            });
            console.log('🔧 UIManager: setupDraggableWindows() completed');
        } catch (error) {
            console.warn('⚠️ UIManager: setupDraggableWindows() error:', error);
        }
    }

    /**
     * Setup individual draggable window
     * @param {HTMLElement} windowElement - Window element to make draggable
     */
    setupDraggableWindow(windowElement) {
        const header = windowElement.querySelector('h3');
        if (!header) return;
        
        // Make header draggable
        header.style.cursor = 'move';
        header.style.userSelect = 'none';
        
        // Add drag event listeners
        const onMouseDown = (e) => {
            this.isDragging = true;
            this.activeWindow = windowElement;
            
            const rect = windowElement.getBoundingClientRect();
            this.dragOffset.x = e.clientX - rect.left;
            this.dragOffset.y = e.clientY - rect.top;
            
            // Bring window to front
            windowElement.style.zIndex = this.windowZIndex++;
            
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        };
        
        const onMouseMove = (e) => {
            if (!this.isDragging || this.activeWindow !== windowElement) return;
            
            const x = e.clientX - this.dragOffset.x;
            const y = e.clientY - this.dragOffset.y;
            
            windowElement.style.left = x + 'px';
            windowElement.style.top = y + 'px';
        };
        
        const onMouseUp = () => {
            this.isDragging = false;
            this.activeWindow = null;
            
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };
        
        header.addEventListener('mousedown', onMouseDown);
        this.draggableWindows.set(windowElement, { onMouseDown, onMouseMove, onMouseUp });
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Window resize
        window.addEventListener('resize', this.onWindowResize.bind(this));
        
        // Keyboard shortcuts
        document.addEventListener('keydown', this.onKeyDown.bind(this));
        
        console.log('🔧 UIManager: Event listeners setup complete');
    }

    /**
     * Handle window resize
     */
    onWindowResize() {
        // Ensure windows stay within viewport
        this.windows.forEach((windowElement, windowId) => {
            const rect = windowElement.getBoundingClientRect();
            const maxX = window.innerWidth - rect.width;
            const maxY = window.innerHeight - rect.height;
            
            let x = parseInt(windowElement.style.left);
            let y = parseInt(windowElement.style.top);
            
            x = Math.max(0, Math.min(maxX, x));
            y = Math.max(0, Math.min(maxY, y));
            
            windowElement.style.left = x + 'px';
            windowElement.style.top = y + 'px';
        });
    }

    /**
     * Handle key down events
     * @param {KeyboardEvent} event - Key event
     */
    onKeyDown(event) {
        switch (event.code) {
            case 'KeyH':
                this.toggleUIVisibility();
                break;
            case 'KeyR':
                this.resetAllWindows();
                break;
            case 'Digit1':
                this.switchTab('controls');
                break;
            case 'Digit2':
                this.switchTab('performance');
                break;
            case 'Digit3':
                this.switchTab('universe');
                break;
            case 'Digit4':
                this.switchTab('soul-dust');
                break;
            case 'Digit5':
                this.switchTab('ai');
                break;
        }
    }

    /**
     * Toggle UI visibility
     */
    toggleUIVisibility() {
        this.isUIVisible = !this.isUIVisible;
        const overlay = document.getElementById('ui-overlay');
        if (overlay) {
            overlay.style.display = this.isUIVisible ? 'block' : 'none';
        }
    }

    /**
     * Reset all windows to default positions
     */
    resetAllWindows() {
        const mainWindow = document.getElementById('main-ui-window');
        if (mainWindow) {
            mainWindow.style.left = '20px';
            mainWindow.style.top = '20px';
        }
    }

    /**
     * Update the UI manager
     * @param {number} deltaTime - Time since last update
     */
    update(deltaTime) {
        if (!this.isInitialized) return;
        
        // Update UI elements
        this.updateUIElements();
    }

    /**
     * Update UI elements with current data
     */
    updateUIElements() {
        // Update performance display
        this.updatePerformanceDisplay();
        
        // Update universe display
        this.updateUniverseDisplay();
        
        // Update soul dust display
        this.updateSoulDustDisplay();

        // Update audio UI elements
        this.updateAudioUI();
        
        // Update AI display
        this.updateAIDisplay();
    }

    /**
     * Update performance display
     */
    updatePerformanceDisplay() {
        const fpsDisplay = document.getElementById('fps-display');
        const frameTimeDisplay = document.getElementById('frame-time-display');
        const memoryDisplay = document.getElementById('memory-display');
        const drawCallsDisplay = document.getElementById('draw-calls-display');
        const trianglesDisplay = document.getElementById('triangles-display');
        
        if (window.PerformanceMonitor && window.PerformanceMonitor.isInitialized) {
            const stats = window.PerformanceMonitor.getStats();
            if (fpsDisplay) fpsDisplay.textContent = Math.round(stats.metrics.fps);
            if (frameTimeDisplay) frameTimeDisplay.textContent = Math.round(stats.metrics.frameTime) + 'ms';
            if (memoryDisplay) memoryDisplay.textContent = Math.round(stats.metrics.memoryUsage / 1024 / 1024) + 'MB';
            if (drawCallsDisplay) drawCallsDisplay.textContent = stats.metrics.drawCalls;
            if (trianglesDisplay) trianglesDisplay.textContent = stats.metrics.triangles;
        }
    }

    /**
     * Update universe display
     */
    updateUniverseDisplay() {
        const sectorsDisplay = document.getElementById('sectors-display');
        const activeSectorsDisplay = document.getElementById('active-sectors-display');
        const totalObjectsDisplay = document.getElementById('total-objects-display');
        const universeAgeDisplay = document.getElementById('universe-age-display');
        const generationQueueDisplay = document.getElementById('generation-queue-display');
        
        if (window.UniverseManager && window.UniverseManager.isInitialized) {
            const stats = window.UniverseManager.getStats();
            if (sectorsDisplay) sectorsDisplay.textContent = stats.sectorCount;
            if (activeSectorsDisplay) activeSectorsDisplay.textContent = stats.activeSectors;
            if (totalObjectsDisplay) totalObjectsDisplay.textContent = stats.totalObjects;
            if (universeAgeDisplay) universeAgeDisplay.textContent = Math.round(stats.universeAge) + 's';
            if (generationQueueDisplay) generationQueueDisplay.textContent = stats.generationQueueLength;
        }
    }

    /**
     * Update soul dust display
     */
    updateSoulDustDisplay() {
        const soulDustCount = document.getElementById('soul-dust-count');
        const soulDustEnergy = document.getElementById('soul-dust-energy');
        const soulDustFrequency = document.getElementById('soul-dust-frequency');
        const quantumBrainStatus = document.getElementById('quantum-brain-status');
        
        // This would be updated with actual Soul Dust data
        const field = (window.GenesisEngine && window.GenesisEngine.soulDustField) ? window.GenesisEngine.soulDustField : [];
        if (soulDustCount) soulDustCount.textContent = field.length.toString();
        if (soulDustEnergy) {
            const totalEnergy = field.reduce((sum, p) => sum + (p.currentEnergy || 0), 0);
            soulDustEnergy.textContent = totalEnergy.toFixed(2);
        }
        if (soulDustFrequency) {
            const analysis = (window.SensoryInputManager && window.SensoryInputManager.getAudioAnalysis) ? window.SensoryInputManager.getAudioAnalysis() : null;
            soulDustFrequency.textContent = analysis ? Math.round(analysis.frequency) + 'Hz' : '0Hz';
        }
        if (quantumBrainStatus) quantumBrainStatus.textContent = (window.QuantumEventManager && window.QuantumEventManager.getQuantumBrainState().isActive) ? 'Active' : 'Inactive';
    }

    /**
     * Update AI display
     */
    updateAIDisplay() {
        const aiLearningStatus = document.getElementById('ai-learning-status');
        const aiCreationStatus = document.getElementById('ai-creation-status');
        const aiCreationCount = document.getElementById('ai-creation-count');
        const aiLastCreation = document.getElementById('ai-last-creation');
        
        if (window.AIConsciousness && window.AIConsciousness.isInitialized) {
            const stats = window.AIConsciousness.getStats();
            if (aiLearningStatus) aiLearningStatus.textContent = stats.isLearning ? 'Active' : 'Inactive';
            if (aiCreationStatus) aiCreationStatus.textContent = stats.isCreating ? 'Active' : 'Inactive';
            if (aiCreationCount) aiCreationCount.textContent = stats.creationCount;
            if (aiLastCreation) aiLastCreation.textContent = stats.lastCreation ? 'Recent' : 'Never';
        }
    }

    updateAudioUI() {
        const ampEl = document.getElementById('audio-amplitude');
        const compEl = document.getElementById('audio-complexity');
        const micEl = document.getElementById('microphone-status');
        const sensValEl = document.getElementById('audio-sensitivity-value');
        const slider = document.getElementById('audio-sensitivity-slider');

        if (slider && !slider._genesisBound) {
            slider.addEventListener('input', () => {
                const value = parseInt(slider.value, 10);
                const normalized = value / 100; // 0.0 - 2.0
                if (sensValEl) sensValEl.textContent = Math.round(normalized * 100) + '%';
                if (window.Config) window.Config.set('audio.influence.sensitivity', normalized);
            });
            slider._genesisBound = true;
        }

        const analysis = (window.SensoryInputManager && window.SensoryInputManager.getAudioAnalysis) ? window.SensoryInputManager.getAudioAnalysis() : null;
        if (analysis) {
            if (ampEl) ampEl.textContent = analysis.amplitude.toFixed(2);
            if (compEl) compEl.textContent = analysis.spectralComplexity.toFixed(2);
        }

        if (micEl) micEl.textContent = (window.AudioManager && window.AudioManager.isRecording) ? 'Active' : 'Inactive';
    }

    // Control methods
    setCameraMode(mode) {
        if (window.CameraController) {
            window.CameraController.setControlMode(mode);
        }
    }

    resetView() {
        if (window.CameraController) {
            window.CameraController.resetCamera();
        }
    }

    clearSoulDust() {
        // Clear soul dust particles
        console.log('🧹 Clearing Soul Dust');
    }

    boostEnergy() {
        // Boost energy
        console.log('⚡ Boosting Energy');
    }

    toggleAICreation() {
        if (window.AIConsciousness) {
            window.AIConsciousness.toggleCreation();
        }
    }

    toggleLearning() {
        if (window.AIConsciousness) {
            window.AIConsciousness.toggleLearning();
        }
    }

    forceCreation() {
        if (window.AIConsciousness) {
            window.AIConsciousness.forceCreation();
        }
    }

    togglePerformanceMode() {
        if (window.InfiniteScaling) {
            const currentMode = window.InfiniteScaling.performanceMode;
            window.InfiniteScaling.setPerformanceMode(!currentMode);
        }
    }

    regenerateUniverse() {
        if (window.UniverseManager) {
            // Trigger universe regeneration
            console.log('🌌 Regenerating Universe');
        }
    }

    boostSoulDust() {
        // Boost soul dust energy
        console.log('✨ Boosting Soul Dust Energy');
    }

    toggleAudio() {
        if (!window.AudioManager) return;
        const enabled = window.Config ? window.Config.get('audio.influence.enableMicrophone') : true;
        const next = !enabled;
        if (window.Config) window.Config.set('audio.influence.enableMicrophone', next);
        if (next) {
            if (!window.AudioManager.isInitialized) {
                window.AudioManager.initialize().then(() => window.AudioManager.start());
            } else {
                window.AudioManager.start();
            }
        } else {
            window.AudioManager.stop();
        }
    }

    /**
     * Get UI statistics
     * @returns {Object} - UI statistics
     */
    getStats() {
        return {
            windowCount: this.windows.size,
            isInitialized: this.isInitialized,
            isUIVisible: this.isUIVisible,
            isDragging: this.isDragging,
            activeTab: this.activeTab
        };
    }

    /**
     * Destroy the UI manager
     */
    destroy() {
        // Remove event listeners
        this.draggableWindows.forEach((listeners, windowElement) => {
            const header = windowElement.querySelector('h3');
            if (header) {
                header.removeEventListener('mousedown', listeners.onMouseDown);
            }
        });
        
        this.windows.clear();
        this.draggableWindows.clear();
        this.uiElements.clear();
        this.eventListeners.clear();
        this.isInitialized = false;
        console.log('🗑️ UI Manager destroyed');
    }
}

console.log('🔧 UIManager.js: Class defined, creating global instance...');

// Make the class available globally
window.UIManagerClass = UIManager;

// Create global UI manager instance
try {
    window.UIManager = new UIManager();
    console.log('✅ UIManager: Global instance created successfully');
    console.log('🔧 UIManager: window.UIManager type:', typeof window.UIManager);
    console.log('🔧 UIManager: window.UIManager.constructor:', window.UIManager.constructor.name);
    console.log('🔧 UIManager: window.UIManager.initialize type:', typeof window.UIManager.initialize);
} catch (error) {
    console.error('❌ UIManager: Failed to create global instance:', error);
}

console.log('🔧 UIManager.js: Script completed');

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIManager;
} 