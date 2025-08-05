/**
 * main.js - Genesis Engine Entry Point
 * 
 * This is the main entry point for the Genesis Engine. It handles initialization,
 * loading screen management, and user interactions to start the living cosmos.
 */

// Global variables
let genesisEngine = null;
let loadingProgress = 0;
let isEngineStarted = false;

/**
 * Initialize the application
 */
async function initializeApplication() {
    try {
        console.log('🚀 Starting Genesis Engine application...');
        
        // Show loading screen
        showLoadingScreen();
        
        // Initialize core systems
        await initializeCoreSystems();
        
        // Initialize Genesis Engine
        await initializeGenesisEngine();
        
        // Hide loading screen
        hideLoadingScreen();
        
        // Set up event listeners
        setupEventListeners();
        
        // Start the engine
        startEngine();
        
        console.log('✅ Genesis Engine application initialized successfully');
        
    } catch (error) {
        console.error('❌ Failed to initialize application:', error);
        showErrorMessage('Failed to initialize Genesis Engine. Please refresh the page.');
    }
}

/**
 * Initialize core systems
 */
async function initializeCoreSystems() {
    updateLoadingProgress(10, 'Initializing core systems...');
    
    // Safety check for Utils availability
    if (!window.Utils || !window.Utils.isInitialized) {
        console.warn('⚠️ Utils not initialized, waiting...');
        // Wait for Utils to be initialized
        let attempts = 0;
        while ((!window.Utils || !window.Utils.isInitialized) && attempts < 50) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        if (!window.Utils || !window.Utils.isInitialized) {
            throw new Error('Utils failed to initialize after 5 seconds');
        }
    }
    
    // Check WebGL support
    if (!window.Utils.isWebGLSupported()) {
        throw new Error('WebGL is not supported in this browser');
    }
    
    // Check Web Audio support
    if (!window.Utils.isWebAudioSupported()) {
        console.warn('⚠️ Web Audio API not supported, audio features will be disabled');
    }
    
    // Initialize configuration
    window.Config.setDebugMode(window.Utils.getConfig('system.debugMode', false));
    
    updateLoadingProgress(30, 'Core systems initialized');
}

/**
 * Initialize Genesis Engine
 */
async function initializeGenesisEngine() {
    updateLoadingProgress(40, 'Initializing Genesis Engine...');
    
    // Debug: Check all global instances before creating GenesisEngine
    console.log('🔍 Checking global instances before GenesisEngine initialization...');
    
    const requiredComponents = [
        'EventBus', 'Config', 'Utils', 'TokenizationEngine', 'PlayerControls',
        'UVO', 'UnifiedFormula', 'CST',
        'AudioManager', 'SensoryInputManager', 
        'SoulDustParticle', 'QuantumEventManager',
        'Renderer', 'PostProcessor', 'Shaders', 
        'UIManager', 'PerformanceMonitor',
        'AIConsciousness', 'ProceduralGenerationEngine', 'ObjectLibrary',
        'UniverseManager', 'CameraController', 'InfiniteScaling', 'GenesisEngine'
    ];
    
    const missingComponents = [];
    
    for (const componentName of requiredComponents) {
        if (window[componentName]) {
            console.log(`✅ ${componentName}: Available`);
            if (window[componentName].initialize && typeof window[componentName].initialize === 'function') {
                console.log(`   - ${componentName}.initialize(): Available`);
            } else {
                console.log(`   - ${componentName}.initialize(): NOT AVAILABLE`);
            }
        } else {
            console.log(`❌ ${componentName}: UNDEFINED`);
            missingComponents.push(componentName);
        }
    }
    
    if (missingComponents.length > 0) {
        console.warn('⚠️ Missing components:', missingComponents);
    }
    
    updateLoadingProgress(60, 'Components verified');
    
    // Safety check for GenesisEngine availability
    if (!window.GenesisEngine) {
        console.warn('⚠️ GenesisEngine not available, waiting...');
        // Wait for GenesisEngine to be available
        let attempts = 0;
        while (!window.GenesisEngine && attempts < 50) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        if (!window.GenesisEngine) {
            throw new Error('GenesisEngine failed to load after 5 seconds');
        }
    }
    
    genesisEngine = window.GenesisEngine;
    
    // Initialize the engine
    try {
        await genesisEngine.initialize();
    } catch (error) {
        console.error('❌ GenesisEngine initialization failed:', error);
        throw error;
    }
    
    updateLoadingProgress(80, 'Genesis Engine initialized');
    
    console.log('✅ Genesis Engine initialization completed');
}

/**
 * Set up event listeners
 */
function setupEventListeners() {
    // Window resize
    window.addEventListener('resize', handleWindowResize);
    
    // Keyboard controls
    document.addEventListener('keydown', handleKeyDown);
    
    // Mouse controls
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('wheel', handleWheel);
    
    // Touch controls (for mobile)
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    
    console.log('📡 Event listeners set up');
}

/**
 * Start the engine
 */
function startEngine() {
    if (!genesisEngine) {
        console.error('❌ Genesis Engine not initialized');
        return;
    }
    
    try {
        genesisEngine.start();
        isEngineStarted = true;
        console.log('🚀 Genesis Engine started successfully');
        
        // Update UI to show engine is running
        updateUIStatus('running');
        
    } catch (error) {
        console.error('❌ Failed to start Genesis Engine:', error);
        showErrorMessage('Failed to start Genesis Engine');
    }
}

/**
 * Show loading screen
 */
function showLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.display = 'flex';
    }
}

/**
 * Hide loading screen
 */
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 1000);
    }
}

/**
 * Update loading progress
 * @param {number} progress - Progress percentage (0-100)
 * @param {string} message - Loading message
 */
function updateLoadingProgress(progress, message) {
    loadingProgress = progress;
    
    const progressBar = document.getElementById('loading-progress');
    if (progressBar) {
        progressBar.style.width = `${progress}%`;
    }
    
    const loadingMessage = document.querySelector('#loading-screen p');
    if (loadingMessage) {
        loadingMessage.textContent = message;
    }
    
    console.log(`📊 Loading: ${progress}% - ${message}`);
}

/**
 * Show error message
 * @param {string} message - Error message
 */
function showErrorMessage(message) {
    console.error('❌ Error:', message);
    
    // Create error overlay
    const errorOverlay = document.createElement('div');
    errorOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 0, 0, 0.9);
        color: white;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        font-family: Arial, sans-serif;
    `;
    
    errorOverlay.innerHTML = `
        <h1>❌ Genesis Engine Error</h1>
        <p>${message}</p>
        <button onclick="location.reload()" style="padding: 10px 20px; margin-top: 20px; background: white; color: red; border: none; border-radius: 5px; cursor: pointer;">Reload Page</button>
    `;
    
    document.body.appendChild(errorOverlay);
}

/**
 * Handle window resize
 */
function handleWindowResize() {
    if (genesisEngine && genesisEngine.renderer) {
        genesisEngine.renderer.handleResize();
    }
}

/**
 * Handle key down events
 */
function handleKeyDown(event) {
    if (!genesisEngine) return;
    
    switch (event.key.toLowerCase()) {
        case 'o':
            // Orbit camera mode
            if (window.UIManager) {
                window.UIManager.setCameraMode('orbit');
            }
            break;
            
        case 'f':
            // First-person camera mode
            if (window.UIManager) {
                window.UIManager.setCameraMode('first-person');
            }
            break;
            
        case 'c':
            // Cinematic camera mode
            if (window.UIManager) {
                window.UIManager.setCameraMode('cinematic');
            }
            break;
            
        case 'r':
            // Reset view
            if (window.UIManager) {
                window.UIManager.resetView();
            }
            break;
            
        case 'space':
            // Toggle AI creation
            event.preventDefault();
            toggleAICreation();
            break;
            
        case 'escape':
            // Pause/unpause
            event.preventDefault();
            togglePause();
            break;
    }
}

/**
 * Handle mouse down events
 */
function handleMouseDown(event) {
    if (!genesisEngine) return;
    
    // Handle mouse interactions
    if (genesisEngine.camera) {
        genesisEngine.camera.handleMouseDown(event);
    }
}

/**
 * Handle mouse move events
 */
function handleMouseMove(event) {
    if (!genesisEngine) return;
    
    // Handle mouse interactions
    if (genesisEngine.camera) {
        genesisEngine.camera.handleMouseMove(event);
    }
}

/**
 * Handle wheel events
 */
function handleWheel(event) {
    if (!genesisEngine) return;
    
    // Handle zoom
    if (genesisEngine.camera) {
        genesisEngine.camera.handleWheel(event);
    }
}

/**
 * Handle touch start events
 */
function handleTouchStart(event) {
    if (!genesisEngine) return;
    
    // Handle touch interactions
    if (genesisEngine.camera) {
        genesisEngine.camera.handleTouchStart(event);
    }
}

/**
 * Handle touch move events
 */
function handleTouchMove(event) {
    if (!genesisEngine) return;
    
    // Handle touch interactions
    if (genesisEngine.camera) {
        genesisEngine.camera.handleTouchMove(event);
    }
}

/**
 * Toggle AI creation
 */
function toggleAICreation() {
    if (!genesisEngine || !genesisEngine.aiConsciousness) return;
    
    const isEnabled = genesisEngine.aiConsciousness.toggleCreation();
    console.log(`🤖 AI Creation ${isEnabled ? 'enabled' : 'disabled'}`);
    
    // Update UI
    updateUIStatus('ai-creation', isEnabled);
}

/**
 * Reset view
 */
function resetView() {
    if (!genesisEngine || !genesisEngine.camera) return;
    
    genesisEngine.camera.reset();
    console.log('🔄 View reset');
}

/**
 * Clear Soul Dust
 */
function clearSoulDust() {
    if (!genesisEngine) return;
    
    genesisEngine.soulDustField = [];
    console.log('✨ Soul Dust cleared');
    
    // Update UI
    updateUIStatus('soul-dust', 0);
}

/**
 * Boost energy
 */
function boostEnergy() {
    if (!genesisEngine) return;
    
    // Add high-energy Soul Dust particles
    for (let i = 0; i < 20; i++) {
        const audioData = {
            frequency: 1000 + Math.random() * 2000,
            amplitude: 0.9 + Math.random() * 0.1,
            spectralComplexity: 0.8 + Math.random() * 0.2,
            timestamp: performance.now()
        };
        
        const particle = new window.SoulDustParticle(audioData);
        genesisEngine.soulDustField.push(particle);
    }
    
    console.log('⚡ Energy boosted');
}

/**
 * Toggle learning
 */
function toggleLearning() {
    if (!genesisEngine || !genesisEngine.aiConsciousness) return;
    
    const isEnabled = genesisEngine.aiConsciousness.toggleLearning();
    console.log(`🧠 Learning ${isEnabled ? 'enabled' : 'disabled'}`);
    
    // Update UI
    updateUIStatus('learning', isEnabled);
}

/**
 * Force creation
 */
function forceCreation() {
    if (!genesisEngine || !genesisEngine.aiConsciousness) return;
    
    genesisEngine.aiConsciousness.forceCreation();
    console.log('🎨 Forced creation triggered');
}

/**
 * Toggle pause
 */
function togglePause() {
    if (!genesisEngine) return;
    
    if (genesisEngine.isRunning) {
        genesisEngine.stop();
        updateUIStatus('paused');
        console.log('⏸️ Engine paused');
    } else {
        genesisEngine.start();
        updateUIStatus('running');
        console.log('▶️ Engine resumed');
    }
}

/**
 * Update UI status
 * @param {string} status - Status type
 * @param {*} value - Status value
 */
function updateUIStatus(status, value) {
    // Update status indicators in UI
    const statusElements = {
        'running': document.getElementById('engine-status'),
        'paused': document.getElementById('engine-status'),
        'ai-creation': document.getElementById('ai-creation-status'),
        'learning': document.getElementById('ai-learning-status'),
        'soul-dust': document.getElementById('soul-dust-count')
    };
    
    const element = statusElements[status];
    if (element) {
        if (status === 'running') {
            element.textContent = 'Running';
            element.className = 'status-active';
        } else if (status === 'paused') {
            element.textContent = 'Paused';
            element.className = 'status-inactive';
        } else if (typeof value === 'boolean') {
            element.textContent = value ? 'Active' : 'Inactive';
            element.className = value ? 'status-active' : 'status-inactive';
        } else if (typeof value === 'number') {
            element.textContent = value.toString();
        }
    }
}

/**
 * Get application statistics
 * @returns {Object} - Application statistics
 */
function getApplicationStats() {
    if (!genesisEngine) {
        return { error: 'Engine not initialized' };
    }
    
    const stats = genesisEngine.getStats();
    
    // Add additional stats
    stats.timestamp = performance.now();
    stats.memoryUsage = performance.memory ? performance.memory.usedJSHeapSize / 1024 / 1024 : 0;
    stats.userAgent = navigator.userAgent;
    
    return stats;
}

/**
 * Clean up application
 */
function cleanupApplication() {
    console.log('🧹 Cleaning up application...');
    
    // Stop the engine
    if (genesisEngine) {
        genesisEngine.destroy();
        genesisEngine = null;
    }
    
    // Remove event listeners
    window.removeEventListener('resize', handleWindowResize);
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('mousedown', handleMouseDown);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('wheel', handleWheel);
    document.removeEventListener('touchstart', handleTouchStart);
    document.removeEventListener('touchmove', handleTouchMove);
    
    console.log('✅ Application cleanup completed');
}

// Initialize application when DOM is loaded
// Wait for all components to be initialized before starting the application
window.addEventListener('load', function() {
    // Give init_components.js time to initialize everything
    setTimeout(initializeApplication, 1500);
});

// Clean up on page unload
window.addEventListener('beforeunload', cleanupApplication);

// Export functions for global access
window.GenesisEngineApp = {
    initializeApplication,
    startEngine,
    toggleAICreation,
    resetView,
    clearSoulDust,
    boostEnergy,
    toggleLearning,
    forceCreation,
    togglePause,
    getApplicationStats,
    cleanupApplication
}; 