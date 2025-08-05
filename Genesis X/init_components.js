/**
 * init_components.js - Component Initialization Script
 * 
 * This script properly initializes all Genesis Engine components in the correct order.
 */

console.log('🔧 init_components.js: Starting component initialization...');

// Wait for all scripts to load
window.addEventListener('load', function() {
    setTimeout(initializeAllComponents, 1000);
});

async function initializeAllComponents() {
    console.log('🔧 Initializing all Genesis Engine components...');
    
    try {
        // Step 1: Initialize core components
        console.log('🔧 Step 1: Initializing core components...');
        
        if (window.EventBus) {
            window.EventBus.initialize();
            console.log('✅ EventBus initialized');
        }
        
        if (window.Config) {
            window.Config.initialize();
            console.log('✅ Config initialized');
        }
        
        if (window.Utils) {
            window.Utils.initialize();
            console.log('✅ Utils initialized');
        }
        
        if (window.TokenizationEngine) {
            window.TokenizationEngine.initialize();
            console.log('✅ TokenizationEngine initialized');
        }
        
        if (window.PlayerControls) {
            window.PlayerControls.initialize();
            console.log('✅ PlayerControls initialized');
        }
        
        // Step 2: Initialize physics components
        console.log('🔧 Step 2: Initializing physics components...');
        
        if (window.UVO) {
            window.UVO.initialize();
            console.log('✅ UVO initialized');
        }
        
        if (window.UnifiedFormula) {
            window.UnifiedFormula.initialize();
            console.log('✅ UnifiedFormula initialized');
        }
        
        if (window.CST) {
            window.CST.initialize();
            console.log('✅ CST initialized');
        }
        
        // Step 3: Initialize sensory components (Formula of Creation)
        console.log('🔧 Step 3: Initializing sensory components...');
        
        if (window.SensoryInputManager) {
            window.SensoryInputManager.initialize();
            console.log('✅ SensoryInputManager initialized');
        }
        
        // Step 4: Initialize soul dust components
        console.log('🔧 Step 4: Initializing soul dust components...');
        
        if (window.QuantumEventManager) {
            window.QuantumEventManager.initialize();
            console.log('✅ QuantumEventManager initialized');
        }
        
        // Step 5: Initialize rendering components
        console.log('🔧 Step 5: Initializing rendering components...');
        
        if (window.Renderer) {
            window.Renderer.initialize();
            console.log('✅ Renderer initialized');
            
            // Initialize PostProcessor with renderer, scene, camera
            if (window.PostProcessor && window.Renderer.renderer && window.Renderer.scene && window.Renderer.camera) {
                window.PostProcessor.initialize(window.Renderer.renderer, window.Renderer.scene, window.Renderer.camera);
                console.log('✅ PostProcessor initialized');
            } else {
                console.warn('⚠️ PostProcessor initialization delayed - waiting for renderer components');
                // Try again after a short delay
                setTimeout(() => {
                    if (window.PostProcessor && window.Renderer.renderer && window.Renderer.scene && window.Renderer.camera) {
                        window.PostProcessor.initialize(window.Renderer.renderer, window.Renderer.scene, window.Renderer.camera);
                        console.log('✅ PostProcessor initialized (delayed)');
                    }
                }, 500);
            }
            
            // Initialize Shaders
            if (window.Shaders) {
                window.Shaders.initialize();
                console.log('✅ Shaders initialized');
            }
        }
        
        // Step 6: Initialize AI components
        console.log('🔧 Step 6: Initializing AI components...');
        
        if (window.AIConsciousness) {
            window.AIConsciousness.initialize();
            console.log('✅ AIConsciousness initialized');
        }
        
        if (window.ProceduralGenerationEngine) {
            window.ProceduralGenerationEngine.initialize();
            console.log('✅ ProceduralGenerationEngine initialized');
        }
        
        if (window.ObjectLibrary) {
            window.ObjectLibrary.initialize();
            console.log('✅ ObjectLibrary initialized');
        }
        
        // Step 7: Initialize universe components
        console.log('🔧 Step 7: Initializing universe components...');
        
        if (window.UniverseManager) {
            window.UniverseManager.initialize();
            console.log('✅ UniverseManager initialized');
        }
        
        if (window.CameraController) {
            if (window.Renderer && window.Renderer.camera) {
                window.CameraController.setCamera(window.Renderer.camera);
            }
            window.CameraController.initialize();
            console.log('✅ CameraController initialized');
        }
        
        if (window.InfiniteScaling) {
            window.InfiniteScaling.initialize();
            console.log('✅ InfiniteScaling initialized');
        }
        
        // Step 8: Initialize UI components
        console.log('🔧 Step 8: Initializing UI components...');
        
        if (window.UIManager) {
            window.UIManager.initialize();
            console.log('✅ UIManager initialized');
        }
        
        if (window.PerformanceMonitor) {
            window.PerformanceMonitor.initialize();
            console.log('✅ PerformanceMonitor initialized');
        }
        
        // Step 9: Initialize PlayerControls with camera and DOM
        console.log('🔧 Step 9: Setting up PlayerControls...');
        
        if (window.PlayerControls && window.Renderer) {
            window.PlayerControls.setCamera(window.Renderer.camera, window.Renderer.renderer.domElement);
            console.log('✅ PlayerControls camera and DOM set');
        }
        
        console.log('✅ All components initialized successfully!');
        
        // Step 10: Test GenesisEngine
        console.log('🔧 Step 10: Testing GenesisEngine...');
        
        if (window.GenesisEngine) {
            console.log('✅ GenesisEngine instance available');
            console.log('✅ GenesisEngine.initialize method available:', typeof window.GenesisEngine.initialize);
            
            // Use the existing global instance
            const testEngine = window.GenesisEngine;
            console.log('✅ GenesisEngine instance retrieved successfully');
            
            // Test initialization
            try {
                await testEngine.initialize();
                console.log('✅ GenesisEngine initialization successful!');
            } catch (error) {
                console.error('❌ GenesisEngine initialization failed:', error);
            }
        } else {
            console.error('❌ GenesisEngine instance not available');
        }
        
    } catch (error) {
        console.error('❌ Component initialization failed:', error);
    }
}

// Export for testing
window.initializeAllComponents = initializeAllComponents; 