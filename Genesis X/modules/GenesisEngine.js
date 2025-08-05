/**
 * GenesisEngine.js - The Living, Infinite Cosmos
 * 
 * The main engine that orchestrates all components and implements the core game loop
 * for the Genesis Engine. This module manages the microkernel architecture, plug-in
 * modules, and the event-driven system that creates a perfect, real-time simulation
 * of a living, breathing, and infinite universe.
 * 
 * Core Systems:
 * - Unified Formula Physics (ψi = [c²ΦEc,i] + [λi] + [Li] + [ΩiEc,i] + [Ugrav,i] + Σ(psd,i))
 * - Formula of Creation (Sound → Frequency → Light → Soul Dust)
 * - Quantum Brain (Collective Consciousness)
 * - Autonomous AI Creation
 */

console.log('🌌 GenesisEngine.js: Starting to load...');

class GenesisEngine {
    constructor() {
        console.log('🌌 GenesisEngine: Constructor called');
        
        // Core system state
        this.isRunning = false;
        this.isInitialized = false;
        this.startTime = 0;
        this.lastFrameTime = 0;
        this.frameCount = 0;
        
        // Performance tracking
        this.fps = 0;
        this.frameTime = 0;
        this.memoryUsage = 0;
        
        // Universe state
        this.universe = {
            particles: [],
            objects: [],
            sectors: new Map(),
            bounds: 1000000, // Default value, will be updated during initialization
            sectorSize: 10000 // Default value, will be updated during initialization
        };
        
        // Soul Dust field (Quantum Brain)
        this.soulDustField = [];
        this.soulDustManager = null;
        
        // Component managers
        this.renderer = null;
        this.camera = null;
        this.scene = null;
        this.audioManager = null;
        this.uiManager = null;
        this.aiConsciousness = null;
        this.proceduralGenerator = null;
        this.sensoryInputManager = null;
        this.quantumEventManager = null;
        
        // Event subscriptions
        this.eventSubscriptions = [];
        
        console.log('🌌 GenesisEngine: Constructor completed');
    }

    /**
     * Initialize the Genesis Engine
     */
    async initialize() {
        try {
            console.log('🌌 Initializing Genesis Engine...');
            
            // Update configuration from Config module
            this.updateConfiguration();
            
            // Initialize core components
            await this.initializeCoreComponents();
            
            // Initialize plug-in modules
            await this.initializePluginModules();
            
            // Set up event subscriptions
            this.setupEventSubscriptions();
            
            // Initialize universe
            this.initializeUniverse();
            
            this.isInitialized = true;
            console.log('✅ Genesis Engine initialized successfully');
            
            // Publish initialization event
            window.EventBus.publish('engine:initialized', {
                timestamp: performance.now(),
                components: Object.keys(this).filter(key => this[key] && typeof this[key] === 'object')
            });
            
        } catch (error) {
            console.error('❌ Failed to initialize Genesis Engine:', error);
            throw error;
        }
    }

    /**
     * Update configuration from Config module
     */
    updateConfiguration() {
        this.universe.bounds = window.Utils.getConfig('system.universeBounds', 1000000);
        this.universe.sectorSize = window.Utils.getConfig('system.sectorSize', 10000);
        console.log('🔧 Configuration updated from Config module');
    }

    /**
     * Initialize core components
     */
    async initializeCoreComponents() {
        console.log('🔧 Initializing core components...');
        
        // Ensure Utils is fully initialized before proceeding
        if (!window.Utils || !window.Utils.isInitialized) {
            console.warn('⚠️ Utils not initialized, waiting...');
            let attempts = 0;
            while ((!window.Utils || !window.Utils.isInitialized) && attempts < 50) {
                await new Promise(resolve => setTimeout(resolve, 100));
                attempts++;
            }
            
            if (!window.Utils || !window.Utils.isInitialized) {
                throw new Error('Utils failed to initialize after 5 seconds');
            }
        }
        
        console.log('✅ Utils is ready, proceeding with component initialization');
        
        // Initialize UnifiedFormula
        if (window.UnifiedFormula) {
            window.UnifiedFormula.initialize();
        }
        
        // Initialize SensoryInputManager (Formula of Creation)
        if (window.SensoryInputManager) {
            await window.SensoryInputManager.initialize();
            this.sensoryInputManager = window.SensoryInputManager;
        }
        
        // Initialize QuantumEventManager (Quantum Brain)
        if (window.QuantumEventManager) {
            window.QuantumEventManager.initialize();
            this.quantumEventManager = window.QuantumEventManager;
        }
        
        // Initialize other core components
        if (window.Renderer) {
            this.renderer = window.Renderer;
            await this.renderer.initialize();
        }
        
        if (window.CameraController) {
            this.camera = window.CameraController;
            this.camera.initialize();
        }
        
        if (window.UIManager) {
            this.uiManager = window.UIManager;
            this.uiManager.initialize();
        }
        
        console.log('✅ Core components initialized');
    }

    /**
     * Initialize plug-in modules
     */
    async initializePluginModules() {
        console.log('🔌 Initializing plug-in modules...');
        
        // Initialize AI Consciousness
        if (window.AIConsciousness) {
            this.aiConsciousness = window.AIConsciousness;
            await this.aiConsciousness.initialize();
        }
        
        // Initialize Procedural Generation Engine
        if (window.ProceduralGenerationEngine) {
            this.proceduralGenerator = window.ProceduralGenerationEngine;
            await this.proceduralGenerator.initialize();
        }
        
        // Initialize Universe Manager
        if (window.UniverseManager) {
            this.universeManager = window.UniverseManager;
            this.universeManager.initialize();
        }
        
        console.log('✅ Plug-in modules initialized');
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
        
        // Subscribe to critical event triggers
        this.eventSubscriptions.push(
            window.EventBus.subscribe('engine:criticalEventTriggered', (eventData) => {
                this.handleCriticalEvent(eventData);
            })
        );
        
        // Subscribe to AI creation events
        this.eventSubscriptions.push(
            window.EventBus.subscribe('ai:autonomousCreation', (eventData) => {
                this.handleObjectCreated(eventData);
            })
        );
        
        // Subscribe to universe sector generation
        this.eventSubscriptions.push(
            window.EventBus.subscribe('universe:sectorGenerated', (eventData) => {
                this.handleSectorGenerated(eventData);
            })
        );
        
        console.log('📡 Event subscriptions set up');
    }

    /**
     * Initialize universe
     */
    initializeUniverse() {
        console.log('🌌 Initializing universe...');
        
        // Generate initial sector
        this.generateInitialSector();
        
        // Set up lighting
        this.setupLighting();
        
        // Set up post-processing
        this.setupPostProcessing();
        
        console.log('✅ Universe initialized');
    }

    /**
     * Generate initial sector
     */
    generateInitialSector() {
        // Create initial sector at origin
        const sector = {
            id: 'sector_0_0_0',
            position: { x: 0, y: 0, z: 0 },
            objects: [],
            isLoaded: true
        };
        
        this.universe.sectors.set(sector.id, sector);
        
        // Generate some initial objects
        this.generateInitialObjects();
    }

    /**
     * Generate initial objects
     */
    generateInitialObjects() {
        // Create some initial stars and planets
        for (let i = 0; i < 10; i++) {
            const object = {
                id: `object_${i}`,
                type: 'star',
                position: {
                    x: (Math.random() - 0.5) * 1000,
                    y: (Math.random() - 0.5) * 1000,
                    z: (Math.random() - 0.5) * 1000
                },
                properties: {
                    size: Math.random() * 10 + 5,
                    brightness: Math.random() * 0.5 + 0.5,
                    color: { r: 1, g: 0.8, b: 0.6 }
                }
            };
            
            this.universe.objects.push(object);
        }
    }

    /**
     * Set up lighting
     */
    setupLighting() {
        if (this.renderer && this.renderer.scene) {
            // Add ambient light
            const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
            this.renderer.scene.add(ambientLight);
            
            // Add directional light
            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
            directionalLight.position.set(100, 100, 100);
            this.renderer.scene.add(directionalLight);
        }
    }

    /**
     * Set up post-processing
     */
    setupPostProcessing() {
        if (this.renderer) {
            this.renderer.setupPostProcessing();
        }
    }

    /**
     * Start the Genesis Engine
     */
    start() {
        if (!this.isInitialized) {
            console.error('❌ Cannot start engine: not initialized');
            return;
        }
        
        this.isRunning = true;
        this.startTime = performance.now();
        this.lastFrameTime = this.startTime;
        
        console.log('🚀 Genesis Engine started');
        
        // Start the game loop
        this.gameLoop();
    }

    /**
     * Stop the Genesis Engine
     */
    stop() {
        this.isRunning = false;
        console.log('⏹️ Genesis Engine stopped');
    }

    /**
     * Main game loop
     */
    gameLoop() {
        if (!this.isRunning) return;
        
        const currentTime = performance.now();
        const deltaTime = (currentTime - this.lastFrameTime) / 1000; // Convert to seconds
        this.lastFrameTime = currentTime;
        
        // Update all systems
        this.update(deltaTime);
        
        // Render the scene
        this.render();
        
        // Update performance metrics
        this.updatePerformanceMetrics(deltaTime);
        
        // Continue the loop
        requestAnimationFrame(() => this.gameLoop());
    }

    /**
     * Update all systems
     * @param {number} deltaTime - Time since last update
     */
    update(deltaTime) {
        // Update Soul Dust field (Quantum Brain)
        this.updateSoulDustField(deltaTime);
        
        // Update universe
        this.updateUniverse(deltaTime);
        
        // Update sectors
        this.updateSectors();
        
        // Update AI systems
        if (this.aiConsciousness) {
            this.aiConsciousness.update(deltaTime);
        }
        
        // Update quantum event manager
        if (this.quantumEventManager) {
            this.quantumEventManager.update(deltaTime, this.soulDustField);
        }
        
        // Update sensory input manager
        if (this.sensoryInputManager) {
            this.sensoryInputManager.update(deltaTime);
        }
        
        // Update UI
        if (this.uiManager) {
            this.uiManager.update(deltaTime);
        }
    }

    /**
     * Update Soul Dust field (Quantum Brain)
     * @param {number} deltaTime - Time since last update
     */
    updateSoulDustField(deltaTime) {
        // Update existing Soul Dust particles
        for (let i = this.soulDustField.length - 1; i >= 0; i--) {
            const particle = this.soulDustField[i];
            
            if (particle.isAlive) {
                particle.update(deltaTime, this.universe, this.soulDustField);
            } else {
                // Remove dead particles
                this.soulDustField.splice(i, 1);
            }
        }
        
        // Check particle interactions
        this.checkParticleInteractions();
    }

    /**
     * Check particle interactions
     */
    checkParticleInteractions() {
        // Check for particle merging and energy absorption
        for (let i = 0; i < this.soulDustField.length; i++) {
            for (let j = i + 1; j < this.soulDustField.length; j++) {
                const particle1 = this.soulDustField[i];
                const particle2 = this.soulDustField[j];
                
                if (!particle1.isAlive || !particle2.isAlive) continue;
                
                const distance = window.Utils.distance(particle1.position, particle2.position);
                const mergeDistance = 10; // Distance for merging
                
                if (distance < mergeDistance) {
                    // Merge particles
                    const mergedParticle = particle1.merge(particle2);
                    if (mergedParticle) {
                        this.soulDustField.push(mergedParticle);
                    }
                }
            }
        }
    }

    /**
     * Update universe
     * @param {number} deltaTime - Time since last update
     */
    updateUniverse(deltaTime) {
        // Update universe objects
        for (const object of this.universe.objects) {
            // Apply unified formula to objects
            if (window.UnifiedFormula) {
                window.UnifiedFormula.updateParticle(object, this.universe, this.soulDustField, deltaTime);
            }
        }
        
        // Update universe manager
        if (this.universeManager) {
            this.universeManager.update(deltaTime);
        }
    }

    /**
     * Update sectors
     */
    updateSectors() {
        if (!this.camera) return;
        
        const cameraPosition = this.camera.getPosition();
        
        // Load nearby sectors
        this.loadNearbySectors(cameraPosition.x, cameraPosition.y, cameraPosition.z);
        
        // Unload distant sectors
        this.unloadDistantSectors(cameraPosition.x, cameraPosition.y, cameraPosition.z);
    }

    /**
     * Load nearby sectors
     * @param {number} centerX - Center X coordinate
     * @param {number} centerY - Center Y coordinate
     * @param {number} centerZ - Center Z coordinate
     */
    loadNearbySectors(centerX, centerY, centerZ) {
        const loadDistance = this.universe.sectorSize * 2;
        
        for (let x = -2; x <= 2; x++) {
            for (let y = -2; y <= 2; y++) {
                for (let z = -2; z <= 2; z++) {
                    const sectorX = Math.floor(centerX / this.universe.sectorSize) + x;
                    const sectorY = Math.floor(centerY / this.universe.sectorSize) + y;
                    const sectorZ = Math.floor(centerZ / this.universe.sectorSize) + z;
                    
                    const sectorId = `sector_${sectorX}_${sectorY}_${sectorZ}`;
                    
                    if (!this.universe.sectors.has(sectorId)) {
                        this.loadSector(sectorX, sectorY, sectorZ);
                    }
                }
            }
        }
    }

    /**
     * Load a sector
     * @param {number} x - Sector X coordinate
     * @param {number} y - Sector Y coordinate
     * @param {number} z - Sector Z coordinate
     */
    loadSector(x, y, z) {
        const sectorId = `sector_${x}_${y}_${z}`;
        
        if (this.universe.sectors.has(sectorId)) return;
        
        const sector = {
            id: sectorId,
            position: {
                x: x * this.universe.sectorSize,
                y: y * this.universe.sectorSize,
                z: z * this.universe.sectorSize
            },
            objects: [],
            isLoaded: true
        };
        
        // Generate sector content
        this.generateSectorContent(sector);
        
        this.universe.sectors.set(sectorId, sector);
        
        // Publish sector generation event
        window.EventBus.publish('universe:sectorGenerated', {
            sectorID: sectorId,
            position: sector.position,
            objects: sector.objects,
            timestamp: performance.now()
        });
    }

    /**
     * Generate sector content
     * @param {Object} sector - Sector to generate content for
     */
    generateSectorContent(sector) {
        // Generate random objects for the sector
        const objectCount = Math.floor(Math.random() * 5) + 1;
        
        for (let i = 0; i < objectCount; i++) {
            const object = {
                id: `${sector.id}_object_${i}`,
                type: Math.random() > 0.5 ? 'star' : 'planet',
                position: {
                    x: sector.position.x + (Math.random() - 0.5) * this.universe.sectorSize,
                    y: sector.position.y + (Math.random() - 0.5) * this.universe.sectorSize,
                    z: sector.position.z + (Math.random() - 0.5) * this.universe.sectorSize
                },
                properties: {
                    size: Math.random() * 10 + 5,
                    brightness: Math.random() * 0.5 + 0.5,
                    color: { r: Math.random(), g: Math.random(), b: Math.random() }
                }
            };
            
            sector.objects.push(object);
            this.universe.objects.push(object);
        }
    }

    /**
     * Unload distant sectors
     * @param {number} centerX - Center X coordinate
     * @param {number} centerY - Center Y coordinate
     * @param {number} centerZ - Center Z coordinate
     */
    unloadDistantSectors(centerX, centerY, centerZ) {
        const unloadDistance = this.universe.sectorSize * 4;
        
        for (const [sectorId, sector] of this.universe.sectors) {
            const distance = Math.sqrt(
                Math.pow(sector.position.x - centerX, 2) +
                Math.pow(sector.position.y - centerY, 2) +
                Math.pow(sector.position.z - centerZ, 2)
            );
            
            if (distance > unloadDistance) {
                // Remove sector objects from universe
                for (const object of sector.objects) {
                    const index = this.universe.objects.findIndex(obj => obj.id === object.id);
                    if (index !== -1) {
                        this.universe.objects.splice(index, 1);
                    }
                }
                
                this.universe.sectors.delete(sectorId);
            }
        }
    }

    /**
     * Render the scene
     */
    render() {
        if (!this.renderer) return;
        
        // Update Soul Dust rendering
        this.updateSoulDustRendering();
        
        // Update universe rendering
        this.updateUniverseRendering();
        
        // Render the scene
        this.renderer.render(this.camera);
    }

    /**
     * Update Soul Dust rendering
     */
    updateSoulDustRendering() {
        if (!this.renderer || !this.renderer.scene) return;
        
        // Remove old Soul Dust particles from scene
        const soulDustGroup = this.renderer.scene.getObjectByName('soulDustGroup');
        if (soulDustGroup) {
            this.renderer.scene.remove(soulDustGroup);
        }
        
        // Create new Soul Dust group
        const newSoulDustGroup = new THREE.Group();
        newSoulDustGroup.name = 'soulDustGroup';
        
        // Add Soul Dust particles to scene
        for (const particle of this.soulDustField) {
            if (!particle.isAlive) continue;
            
            const renderingData = particle.getRenderingData();
            
            // Create point geometry for Soul Dust particle
            const geometry = new THREE.BufferGeometry();
            const positions = new Float32Array([
                renderingData.position.x,
                renderingData.position.y,
                renderingData.position.z
            ]);
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            
            // Create material with particle color and size
            const material = new THREE.PointsMaterial({
                color: new THREE.Color(renderingData.color.r, renderingData.color.g, renderingData.color.b),
                size: renderingData.size,
                transparent: true,
                opacity: renderingData.brightness,
                blending: THREE.AdditiveBlending
            });
            
            // Create point and add to group
            const point = new THREE.Points(geometry, material);
            newSoulDustGroup.add(point);
        }
        
        // Add Soul Dust group to scene
        this.renderer.scene.add(newSoulDustGroup);
    }

    /**
     * Update universe rendering
     */
    updateUniverseRendering() {
        if (!this.renderer || !this.renderer.scene) return;
        
        // Remove old universe objects from scene
        const universeGroup = this.renderer.scene.getObjectByName('universeGroup');
        if (universeGroup) {
            this.renderer.scene.remove(universeGroup);
        }
        
        // Create new universe group
        const newUniverseGroup = new THREE.Group();
        newUniverseGroup.name = 'universeGroup';
        
        // Add universe objects to scene
        for (const object of this.universe.objects) {
            let geometry, material;
            
            if (object.type === 'star') {
                // Create star geometry
                geometry = new THREE.SphereGeometry(object.properties.size, 16, 16);
                material = new THREE.MeshBasicMaterial({
                    color: new THREE.Color(object.properties.color.r, object.properties.color.g, object.properties.color.b),
                    emissive: new THREE.Color(object.properties.color.r, object.properties.color.g, object.properties.color.b),
                    emissiveIntensity: object.properties.brightness
                });
            } else if (object.type === 'planet') {
                // Create planet geometry
                geometry = new THREE.SphereGeometry(object.properties.size, 16, 16);
                material = new THREE.MeshLambertMaterial({
                    color: new THREE.Color(object.properties.color.r, object.properties.color.g, object.properties.color.b)
                });
            }
            
            if (geometry && material) {
                const mesh = new THREE.Mesh(geometry, material);
                mesh.position.set(object.position.x, object.position.y, object.position.z);
                newUniverseGroup.add(mesh);
            }
        }
        
        // Add universe group to scene
        this.renderer.scene.add(newUniverseGroup);
    }

    /**
     * Update performance metrics
     * @param {number} deltaTime - Time since last update
     */
    updatePerformanceMetrics(deltaTime) {
        this.frameCount++;
        
        // Calculate FPS
        if (deltaTime > 0) {
            this.fps = 1 / deltaTime;
        }
        
        this.frameTime = deltaTime * 1000; // Convert to milliseconds
        
        // Update memory usage (if available)
        if (performance.memory) {
            this.memoryUsage = performance.memory.usedJSHeapSize / 1024 / 1024; // MB
        }
        
        // Publish performance update
        window.EventBus.publish('engine:performanceUpdate', {
            fps: this.fps,
            frameTime: this.frameTime,
            memoryUsage: this.memoryUsage,
            frameCount: this.frameCount
        });
    }

    /**
     * Handle Soul Dust generation event
     * @param {Object} eventData - Event data
     */
    handleSoulDustGenerated(eventData) {
        // Add new Soul Dust particle to field
        // Note: The particle is already created in SensoryInputManager
        console.log('✨ Soul Dust particle added to field:', eventData.particleID);
    }

    /**
     * Handle critical event
     * @param {Object} eventData - Event data
     */
    handleCriticalEvent(eventData) {
        console.log('⚡ Critical event handled:', eventData.eventType);
        
        // Handle different types of critical events
        switch (eventData.eventType) {
            case 'soulDust_critical':
                this.handleSoulDustCritical(eventData);
                break;
            case 'consciousness_surge':
                this.handleConsciousnessSurge(eventData);
                break;
            case 'quantum_coalescence':
                this.handleQuantumCoalescence(eventData);
                break;
            default:
                console.log('Unknown critical event type:', eventData.eventType);
        }
    }

    /**
     * Handle Soul Dust critical event
     * @param {Object} eventData - Event data
     */
    handleSoulDustCritical(eventData) {
        // Create a burst of Soul Dust particles
        for (let i = 0; i < 10; i++) {
            const audioData = {
                frequency: 440 + Math.random() * 880,
                amplitude: 0.8 + Math.random() * 0.2,
                spectralComplexity: 0.5 + Math.random() * 0.5,
                timestamp: performance.now()
            };
            
            const particle = new window.SoulDustParticle(audioData);
            this.soulDustField.push(particle);
        }
    }

    /**
     * Handle consciousness surge event
     * @param {Object} eventData - Event data
     */
    handleConsciousnessSurge(eventData) {
        // Trigger AI creation
        if (this.aiConsciousness) {
            this.aiConsciousness.triggerCreation(eventData);
        }
    }

    /**
     * Handle quantum coalescence event
     * @param {Object} eventData - Event data
     */
    handleQuantumCoalescence(eventData) {
        // Create a dimensional rift effect
        console.log('🌀 Quantum coalescence creating dimensional rift');
    }

    /**
     * Handle object created event
     * @param {Object} eventData - Event data
     */
    handleObjectCreated(eventData) {
        // Add new object to universe
        const object = {
            id: eventData.objectID || window.Utils.generateUUID(),
            type: eventData.objectType,
            position: eventData.position,
            properties: eventData.properties
        };
        
        this.universe.objects.push(object);
        
        console.log('🎨 Object created:', object.type, 'at', object.position);
    }

    /**
     * Handle sector generated event
     * @param {Object} eventData - Event data
     */
    handleSectorGenerated(eventData) {
        console.log('🌌 Sector generated:', eventData.sectorID);
    }

    /**
     * Get engine statistics
     * @returns {Object} - Engine statistics
     */
    getStats() {
        return {
            isRunning: this.isRunning,
            isInitialized: this.isInitialized,
            fps: this.fps,
            frameTime: this.frameTime,
            memoryUsage: this.memoryUsage,
            frameCount: this.frameCount,
            soulDustCount: this.soulDustField.length,
            objectCount: this.universe.objects.length,
            sectorCount: this.universe.sectors.size
        };
    }

    /**
     * Destroy the Genesis Engine
     */
    destroy() {
        this.stop();
        
        // Destroy all components
        if (this.renderer) this.renderer.destroy();
        if (this.camera) this.camera.destroy();
        if (this.uiManager) this.uiManager.destroy();
        if (this.aiConsciousness) this.aiConsciousness.destroy();
        if (this.proceduralGenerator) this.proceduralGenerator.destroy();
        if (this.sensoryInputManager) this.sensoryInputManager.destroy();
        if (this.quantumEventManager) this.quantumEventManager.destroy();
        
        // Unsubscribe from events
        this.eventSubscriptions.forEach(subscription => {
            if (subscription && typeof subscription.unsubscribe === 'function') {
                subscription.unsubscribe();
            }
        });
        
        this.eventSubscriptions = [];
        this.soulDustField = [];
        this.universe.objects = [];
        this.universe.sectors.clear();
        
        console.log('🗑️ Genesis Engine destroyed');
    }
}

// Make the class available globally
window.GenesisEngineClass = GenesisEngine;

// Create global Genesis Engine instance
window.GenesisEngine = new GenesisEngine();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GenesisEngine;
}