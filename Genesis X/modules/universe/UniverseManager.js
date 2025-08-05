/**
 * UniverseManager.js - Universe Management System
 * 
 * Manages the universe state and sectors for the Genesis Engine.
 * This module handles infinite universe scaling, sector management,
 * and dynamic content generation.
 */

class UniverseManager {
    constructor() {
        this.isInitialized = false;
        this.sectors = new Map();
        this.bounds = 1000000; // Default value, will be updated during initialization
        this.sectorSize = 10000; // Default value, will be updated during initialization
        this.maxSectors = 1000; // Maximum sectors to keep in memory
        
        // Universe state
        this.universeAge = 0;
        this.totalObjects = 0;
        this.activeSectors = 0;
        
        // Sector management
        this.sectorLoadDistance = 50000; // Distance to load sectors
        this.sectorUnloadDistance = 100000; // Distance to unload sectors
        
        // Content generation
        this.generationQueue = [];
        this.isGenerating = false;
        
        // Performance tracking
        this.lastUpdateTime = 0;
        this.updateInterval = 1000; // Update every second
    }

    /**
     * Initialize the universe manager
     */
    initialize() {
        this.updateConfiguration();
        this.initializeSectorSystem();
        this.isInitialized = true;
        console.log('🌌 Universe Manager initialized');
    }

    /**
     * Update configuration from Config module
     */
    updateConfiguration() {
        // Safety check for Utils availability
        if (window.Utils && typeof window.Utils.getConfig === 'function') {
            this.bounds = window.Utils.getConfig('system.universeBounds', 1000000);
            this.sectorSize = window.Utils.getConfig('system.sectorSize', 10000);
            this.maxSectors = window.Utils.getConfig('system.maxSectors', 1000);
            this.sectorLoadDistance = window.Utils.getConfig('system.sectorLoadDistance', 50000);
            this.sectorUnloadDistance = window.Utils.getConfig('system.sectorUnloadDistance', 100000);
        } else {
            console.warn('⚠️ Utils.getConfig not available, using default configuration');
            // Keep default values from constructor
        }
    }

    /**
     * Initialize the sector system
     */
    initializeSectorSystem() {
        // Create initial sectors around origin
        this.createSector(0, 0, 0);
        this.createSector(1, 0, 0);
        this.createSector(-1, 0, 0);
        this.createSector(0, 1, 0);
        this.createSector(0, -1, 0);
        this.createSector(0, 0, 1);
        this.createSector(0, 0, -1);
        
        console.log('🌌 Sector system initialized');
    }

    /**
     * Create a new sector
     * @param {number} x - Sector X coordinate
     * @param {number} y - Sector Y coordinate
     * @param {number} z - Sector Z coordinate
     * @returns {Object} - Created sector
     */
    createSector(x, y, z) {
        const sectorKey = `${x},${y},${z}`;
        
        if (this.sectors.has(sectorKey)) {
            return this.sectors.get(sectorKey);
        }
        
        const sector = {
            id: sectorKey,
            position: { x, y, z },
            worldPosition: {
                x: x * this.sectorSize,
                y: y * this.sectorSize,
                z: z * this.sectorSize
            },
            objects: new Map(),
            isLoaded: false,
            isGenerating: false,
            lastVisited: 0,
            objectCount: 0
        };
        
        this.sectors.set(sectorKey, sector);
        return sector;
    }

    /**
     * Get sector at position
     * @param {number} x - World X coordinate
     * @param {number} y - World Y coordinate
     * @param {number} z - World Z coordinate
     * @returns {Object} - Sector at position
     */
    getSectorAtPosition(x, y, z) {
        const sectorX = Math.floor(x / this.sectorSize);
        const sectorY = Math.floor(y / this.sectorSize);
        const sectorZ = Math.floor(z / this.sectorSize);
        
        return this.createSector(sectorX, sectorY, sectorZ);
    }

    /**
     * Load sector content
     * @param {Object} sector - Sector to load
     */
    async loadSector(sector) {
        if (sector.isLoaded || sector.isGenerating) return;
        
        sector.isGenerating = true;
        
        try {
            // Generate sector content
            await this.generateSectorContent(sector);
            
            sector.isLoaded = true;
            sector.isGenerating = false;
            sector.lastVisited = performance.now();
            
            console.log(`🌌 Sector ${sector.id} loaded with ${sector.objectCount} objects`);
            
        } catch (error) {
            console.error(`❌ Failed to load sector ${sector.id}:`, error);
            sector.isGenerating = false;
        }
    }

    /**
     * Generate content for a sector
     * @param {Object} sector - Sector to generate content for
     */
    async generateSectorContent(sector) {
        // Generate stars
        const starCount = Math.floor(Math.random() * 10) + 5;
        for (let i = 0; i < starCount; i++) {
            const star = this.createStar(sector);
            sector.objects.set(`star_${i}`, star);
            sector.objectCount++;
        }
        
        // Generate planets (less common)
        if (Math.random() < 0.3) {
            const planetCount = Math.floor(Math.random() * 3) + 1;
            for (let i = 0; i < planetCount; i++) {
                const planet = this.createPlanet(sector);
                sector.objects.set(`planet_${i}`, planet);
                sector.objectCount++;
            }
        }
        
        // Generate nebulae (rare)
        if (Math.random() < 0.1) {
            const nebula = this.createNebula(sector);
            sector.objects.set('nebula_0', nebula);
            sector.objectCount++;
        }
        
        // Generate black holes (very rare)
        if (Math.random() < 0.02) {
            const blackHole = this.createBlackHole(sector);
            sector.objects.set('blackhole_0', blackHole);
            sector.objectCount++;
        }
    }

    /**
     * Create a star
     * @param {Object} sector - Sector to create star in
     * @returns {Object} - Star object
     */
    createStar(sector) {
        const x = sector.worldPosition.x + Math.random() * this.sectorSize;
        const y = sector.worldPosition.y + Math.random() * this.sectorSize;
        const z = sector.worldPosition.z + Math.random() * this.sectorSize;
        
        return {
            type: 'star',
            position: { x, y, z },
            size: Math.random() * 50 + 10,
            color: this.getRandomStarColor(),
            brightness: Math.random() * 2 + 0.5,
            temperature: Math.random() * 5000 + 3000
        };
    }

    /**
     * Create a planet
     * @param {Object} sector - Sector to create planet in
     * @returns {Object} - Planet object
     */
    createPlanet(sector) {
        const x = sector.worldPosition.x + Math.random() * this.sectorSize;
        const y = sector.worldPosition.y + Math.random() * this.sectorSize;
        const z = sector.worldPosition.z + Math.random() * this.sectorSize;
        
        return {
            type: 'planet',
            position: { x, y, z },
            size: Math.random() * 20 + 5,
            color: this.getRandomPlanetColor(),
            atmosphere: Math.random() > 0.5,
            rings: Math.random() < 0.2
        };
    }

    /**
     * Create a nebula
     * @param {Object} sector - Sector to create nebula in
     * @returns {Object} - Nebula object
     */
    createNebula(sector) {
        const x = sector.worldPosition.x + Math.random() * this.sectorSize;
        const y = sector.worldPosition.y + Math.random() * this.sectorSize;
        const z = sector.worldPosition.z + Math.random() * this.sectorSize;
        
        return {
            type: 'nebula',
            position: { x, y, z },
            size: Math.random() * 200 + 100,
            color: this.getRandomNebulaColor(),
            density: Math.random() * 0.5 + 0.1
        };
    }

    /**
     * Create a black hole
     * @param {Object} sector - Sector to create black hole in
     * @returns {Object} - Black hole object
     */
    createBlackHole(sector) {
        const x = sector.worldPosition.x + Math.random() * this.sectorSize;
        const y = sector.worldPosition.y + Math.random() * this.sectorSize;
        const z = sector.worldPosition.z + Math.random() * this.sectorSize;
        
        return {
            type: 'blackhole',
            position: { x, y, z },
            size: Math.random() * 30 + 20,
            mass: Math.random() * 1000 + 100,
            eventHorizon: Math.random() * 10 + 5
        };
    }

    /**
     * Get random star color
     * @returns {string} - Star color
     */
    getRandomStarColor() {
        const colors = ['#ffffff', '#ffff00', '#ff0000', '#0000ff', '#ff00ff'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    /**
     * Get random planet color
     * @returns {string} - Planet color
     */
    getRandomPlanetColor() {
        const colors = ['#8B4513', '#228B22', '#4169E1', '#FFD700', '#FF6347'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    /**
     * Get random nebula color
     * @returns {string} - Nebula color
     */
    getRandomNebulaColor() {
        const colors = ['#FF69B4', '#00CED1', '#9370DB', '#32CD32', '#FF4500'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    /**
     * Update the universe manager
     * @param {number} deltaTime - Time since last update
     * @param {THREE.Vector3} cameraPosition - Current camera position
     */
    update(deltaTime, cameraPosition) {
        if (!this.isInitialized) return;
        
        this.universeAge += deltaTime;
        
        // Update sectors based on camera position
        if (cameraPosition) {
            this.updateSectorLoading(cameraPosition);
        }
        
        // Process generation queue
        this.processGenerationQueue();
        
        // Periodic updates
        const currentTime = performance.now();
        if (currentTime - this.lastUpdateTime > this.updateInterval) {
            this.performPeriodicUpdates();
            this.lastUpdateTime = currentTime;
        }
    }

    /**
     * Update sector loading based on camera position
     * @param {THREE.Vector3} cameraPosition - Camera position
     */
    updateSectorLoading(cameraPosition) {
        const cameraX = cameraPosition.x;
        const cameraY = cameraPosition.y;
        const cameraZ = cameraPosition.z;
        
        // Get sectors within load distance
        const loadRadius = Math.ceil(this.sectorLoadDistance / this.sectorSize);
        const cameraSectorX = Math.floor(cameraX / this.sectorSize);
        const cameraSectorY = Math.floor(cameraY / this.sectorSize);
        const cameraSectorZ = Math.floor(cameraZ / this.sectorSize);
        
        // Load nearby sectors
        for (let x = cameraSectorX - loadRadius; x <= cameraSectorX + loadRadius; x++) {
            for (let y = cameraSectorY - loadRadius; y <= cameraSectorY + loadRadius; y++) {
                for (let z = cameraSectorZ - loadRadius; z <= cameraSectorZ + loadRadius; z++) {
                    const sector = this.createSector(x, y, z);
                    if (!sector.isLoaded && !sector.isGenerating) {
                        this.generationQueue.push(sector);
                    }
                }
            }
        }
        
        // Unload distant sectors
        const unloadRadius = Math.ceil(this.sectorUnloadDistance / this.sectorSize);
        this.sectors.forEach((sector, key) => {
            const distance = Math.sqrt(
                Math.pow(sector.position.x - cameraSectorX, 2) +
                Math.pow(sector.position.y - cameraSectorY, 2) +
                Math.pow(sector.position.z - cameraSectorZ, 2)
            );
            
            if (distance > unloadRadius && sector.isLoaded) {
                this.unloadSector(sector);
            }
        });
    }

    /**
     * Process the generation queue
     */
    processGenerationQueue() {
        if (this.isGenerating || this.generationQueue.length === 0) return;
        
        this.isGenerating = true;
        
        // Process up to 2 sectors per frame
        const sectorsToProcess = Math.min(2, this.generationQueue.length);
        
        for (let i = 0; i < sectorsToProcess; i++) {
            const sector = this.generationQueue.shift();
            if (sector) {
                this.loadSector(sector);
            }
        }
        
        this.isGenerating = false;
    }

    /**
     * Unload a sector
     * @param {Object} sector - Sector to unload
     */
    unloadSector(sector) {
        sector.objects.clear();
        sector.isLoaded = false;
        sector.objectCount = 0;
        
        console.log(`🌌 Sector ${sector.id} unloaded`);
    }

    /**
     * Perform periodic updates
     */
    performPeriodicUpdates() {
        this.activeSectors = 0;
        this.totalObjects = 0;
        
        this.sectors.forEach(sector => {
            if (sector.isLoaded) {
                this.activeSectors++;
                this.totalObjects += sector.objectCount;
            }
        });
    }

    /**
     * Get universe statistics
     * @returns {Object} - Universe statistics
     */
    getStats() {
        return {
            sectorCount: this.sectors.size,
            activeSectors: this.activeSectors,
            totalObjects: this.totalObjects,
            bounds: this.bounds,
            sectorSize: this.sectorSize,
            universeAge: this.universeAge,
            generationQueueLength: this.generationQueue.length,
            isInitialized: this.isInitialized
        };
    }

    /**
     * Destroy the universe manager
     */
    destroy() {
        this.sectors.clear();
        this.generationQueue = [];
        this.isInitialized = false;
        console.log('🗑️ Universe Manager destroyed');
    }
}

// Make the class available globally
window.UniverseManagerClass = UniverseManager;

// Create global universe manager instance
window.UniverseManager = new UniverseManager();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UniverseManager;
} 