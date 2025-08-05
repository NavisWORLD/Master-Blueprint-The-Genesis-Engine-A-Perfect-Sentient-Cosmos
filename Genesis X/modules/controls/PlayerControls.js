/**
 * PlayerControls.js - Player Input and Camera Controls
 * 
 * A state machine that manages player input and camera controls for 
 * Orbit, First-Person, and Cinematic modes.
 */

console.log('🎮 PlayerControls.js: Starting to load...');

class PlayerControls {
    constructor() {
        // Control states
        this.isInitialized = false;
        this.controlMode = 'orbit'; // 'orbit', 'first-person', 'cinematic'
        this.isPointerLocked = false;
        
        // Movement state
        this.keys = {};
        this.mousePosition = { x: 0, y: 0 };
        this.mouseDelta = { x: 0, y: 0 };
        
        // Camera settings
        this.mouseSensitivity = 0.002;
        this.keyboardSensitivity = 50;
        this.scrollSensitivity = 0.1;
        
        // Orbit controls
        this.orbitDistance = 100;
        this.orbitTarget = new THREE.Vector3(0, 0, 0);
        this.orbitPhi = 0;
        this.orbitTheta = 0;
        
        // Camera and DOM element (will be set during initialization)
        this.camera = null;
        this.domElement = null;
        
        console.log('🎮 PlayerControls: Constructor completed');
    }

    /**
     * Initialize the player controls
     */
    initialize() {
        this.updateConfiguration();
        this.setupEventListeners();
        this.isInitialized = true;
        console.log('🎮 PlayerControls initialized');
    }

    /**
     * Set camera and DOM element
     * @param {THREE.Camera} camera - Camera to control
     * @param {HTMLElement} domElement - DOM element for events
     */
    setCamera(camera, domElement) {
        this.camera = camera;
        this.domElement = domElement;
        console.log('🎮 PlayerControls: Camera and DOM element set');
    }

    /**
     * Update configuration from Config module
     */
    updateConfiguration() {
        if (window.Utils) {
            this.mouseSensitivity = window.Utils.getConfig('ui.controls.mouseSensitivity', 0.002);
            this.keyboardSensitivity = window.Utils.getConfig('ui.controls.keyboardSensitivity', 50);
            this.scrollSensitivity = window.Utils.getConfig('ui.controls.scrollSensitivity', 0.1);
        }
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Keyboard events
        document.addEventListener('keydown', this.onKeyDown.bind(this));
        document.addEventListener('keyup', this.onKeyUp.bind(this));
        
        // Mouse events
        document.addEventListener('mousedown', this.onMouseDown.bind(this));
        document.addEventListener('mousemove', this.onMouseMove.bind(this));
        document.addEventListener('wheel', this.onWheel.bind(this));
        
        // Pointer lock events
        document.addEventListener('pointerlockchange', this.onPointerLockChange.bind(this));
        
        // Publish control events
        if (window.EventBus) {
            window.EventBus.subscribe('input:keyDown', data => this.handleKeyPress(data));
            window.EventBus.subscribe('input:mouseMove', data => this.handleMouseMove(data));
            window.EventBus.subscribe('input:wheel', data => this.handleWheel(data));
        }
    }

    /**
     * Handle key down events
     * @param {KeyboardEvent} event - Key event
     */
    onKeyDown(event) {
        this.keys[event.code] = true;
        
        // Publish key event
        if (window.EventBus) {
            window.EventBus.publish('input:keyDown', {
                key: event.key,
                code: event.code,
                timestamp: performance.now()
            });
        }
    }

    /**
     * Handle key up events
     * @param {KeyboardEvent} event - Key event
     */
    onKeyUp(event) {
        this.keys[event.code] = false;
        
        // Publish key event
        if (window.EventBus) {
            window.EventBus.publish('input:keyUp', {
                key: event.key,
                code: event.code,
                timestamp: performance.now()
            });
        }
    }

    /**
     * Handle mouse down events
     * @param {MouseEvent} event - Mouse event
     */
    onMouseDown(event) {
        this.mousePosition.x = event.clientX;
        this.mousePosition.y = event.clientY;
        
        // Publish mouse event
        if (window.EventBus) {
            window.EventBus.publish('input:mouseDown', {
                button: event.button,
                x: event.clientX,
                y: event.clientY,
                timestamp: performance.now()
            });
        }
    }

    /**
     * Handle mouse move events
     * @param {MouseEvent} event - Mouse event
     */
    onMouseMove(event) {
        if (this.isPointerLocked) {
            this.mouseDelta.x = event.movementX;
            this.mouseDelta.y = event.movementY;
        } else {
            this.mouseDelta.x = event.clientX - this.mousePosition.x;
            this.mouseDelta.y = event.clientY - this.mousePosition.y;
        }
        
        this.mousePosition.x = event.clientX;
        this.mousePosition.y = event.clientY;
        
        // Publish mouse event
        if (window.EventBus) {
            window.EventBus.publish('input:mouseMove', {
                x: event.clientX,
                y: event.clientY,
                deltaX: this.mouseDelta.x,
                deltaY: this.mouseDelta.y,
                timestamp: performance.now()
            });
        }
    }

    /**
     * Handle wheel events
     * @param {WheelEvent} event - Wheel event
     */
    onWheel(event) {
        event.preventDefault();
        
        // Publish wheel event
        if (window.EventBus) {
            window.EventBus.publish('input:wheel', {
                delta: event.deltaY,
                timestamp: performance.now()
            });
        }
    }

    /**
     * Handle pointer lock change events
     * @param {Event} event - Pointer lock change event
     */
    onPointerLockChange(event) {
        this.isPointerLocked = document.pointerLockElement === this.domElement;
    }

    /**
     * Handle key press data
     * @param {Object} data - Key press data
     */
    handleKeyPress(data) {
        // Handle movement keys
        this.handleMovementKeys(data.code);
    }

    /**
     * Handle mouse move data
     * @param {Object} data - Mouse move data
     */
    handleMouseMove(data) {
        if (this.controlMode === 'first-person' && this.isPointerLocked) {
            this.updateCameraRotation(data.deltaX, data.deltaY);
        }
    }

    /**
     * Handle wheel data
     * @param {Object} data - Wheel data
     */
    handleWheel(data) {
        this.updateCameraZoom(data.delta);
    }

    /**
     * Handle movement keys
     * @param {string} keyCode - Key code
     */
    handleMovementKeys(keyCode) {
        if (!this.camera) return;
        
        const speed = this.keyboardSensitivity;
        
        switch (keyCode) {
            case 'KeyW':
                if (this.controlMode === 'first-person') {
                    this.camera.translateZ(-speed);
                }
                break;
            case 'KeyS':
                if (this.controlMode === 'first-person') {
                    this.camera.translateZ(speed);
                }
                break;
            case 'KeyA':
                if (this.controlMode === 'first-person') {
                    this.camera.translateX(-speed);
                }
                break;
            case 'KeyD':
                if (this.controlMode === 'first-person') {
                    this.camera.translateX(speed);
                }
                break;
            case 'Space':
                if (this.controlMode === 'first-person') {
                    this.camera.translateY(speed);
                }
                break;
            case 'ShiftLeft':
                if (this.controlMode === 'first-person') {
                    this.camera.translateY(-speed);
                }
                break;
        }
    }

    /**
     * Update camera rotation
     * @param {number} deltaX - X delta
     * @param {number} deltaY - Y delta
     */
    updateCameraRotation(deltaX, deltaY) {
        if (!this.camera) return;
        
        const sensitivity = this.mouseSensitivity;
        
        // Rotate camera around Y axis (left/right)
        this.camera.rotation.y -= deltaX * sensitivity;
        
        // Rotate camera around X axis (up/down)
        this.camera.rotation.x -= deltaY * sensitivity;
        
        // Clamp vertical rotation
        this.camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.camera.rotation.x));
    }

    /**
     * Update camera zoom
     * @param {number} deltaY - Y delta
     */
    updateCameraZoom(deltaY) {
        if (!this.camera) return;
        
        const sensitivity = this.scrollSensitivity;
        
        if (this.controlMode === 'orbit') {
            this.orbitDistance += deltaY * sensitivity;
            this.orbitDistance = Math.max(10, Math.min(1000, this.orbitDistance));
            this.updateOrbitCamera();
        } else if (this.controlMode === 'first-person') {
            // Zoom in/out for first-person mode
            const zoomSpeed = 0.1;
            this.camera.fov += deltaY * zoomSpeed;
            this.camera.fov = Math.max(30, Math.min(120, this.camera.fov));
            this.camera.updateProjectionMatrix();
        }
    }

    /**
     * Update orbit camera
     */
    updateOrbitCamera() {
        if (!this.camera) return;
        
        const x = this.orbitDistance * Math.sin(this.orbitTheta) * Math.cos(this.orbitPhi);
        const y = this.orbitDistance * Math.sin(this.orbitPhi);
        const z = this.orbitDistance * Math.cos(this.orbitTheta) * Math.cos(this.orbitPhi);
        
        this.camera.position.set(x, y, z);
        this.camera.lookAt(this.orbitTarget);
    }

    /**
     * Toggle pointer lock
     */
    togglePointerLock() {
        if (this.isPointerLocked) {
            document.exitPointerLock();
        } else if (this.domElement) {
            this.domElement.requestPointerLock();
        }
    }

    /**
     * Reset camera to default position
     */
    resetCamera() {
        if (!this.camera) return;
        
        if (this.controlMode === 'orbit') {
            this.orbitPhi = 0;
            this.orbitTheta = 0;
            this.orbitDistance = 100;
            this.updateOrbitCamera();
        } else if (this.controlMode === 'first-person') {
            this.camera.position.set(0, 0, 100);
            this.camera.rotation.set(0, 0, 0);
        }
    }

    /**
     * Set control mode
     * @param {string} mode - Control mode
     */
    setControlMode(mode) {
        this.controlMode = mode;
        console.log(`🎮 PlayerControls: Switched to ${mode} mode`);
    }

    /**
     * Update player controls
     * @param {number} deltaTime - Time since last frame
     */
    update(deltaTime) {
        if (!this.isInitialized || !this.camera) return;
        
        // Update based on control mode
        switch (this.controlMode) {
            case 'orbit':
                // Orbit controls are updated via mouse events
                break;
            case 'first-person':
                // First-person controls are updated via keyboard/mouse events
                break;
            case 'cinematic':
                // Cinematic mode - automated camera movement
                this.updateCinematicCamera(deltaTime);
                break;
        }
    }

    /**
     * Update cinematic camera
     * @param {number} deltaTime - Time since last frame
     */
    updateCinematicCamera(deltaTime) {
        if (!this.camera) return;
        
        // Simple circular motion
        const time = performance.now() * 0.001;
        const radius = 200;
        const speed = 0.5;
        
        this.camera.position.x = Math.cos(time * speed) * radius;
        this.camera.position.z = Math.sin(time * speed) * radius;
        this.camera.position.y = 50 + Math.sin(time * speed * 0.5) * 20;
        this.camera.lookAt(0, 0, 0);
    }

    /**
     * Get player controls statistics
     * @returns {Object} - Controls statistics
     */
    getStats() {
        return {
            isInitialized: this.isInitialized,
            controlMode: this.controlMode,
            isPointerLocked: this.isPointerLocked,
            orbitDistance: this.orbitDistance,
            mousePosition: this.mousePosition,
            keysPressed: Object.keys(this.keys).filter(key => this.keys[key]).length
        };
    }

    /**
     * Destroy the player controls
     */
    destroy() {
        // Remove event listeners
        document.removeEventListener('keydown', this.onKeyDown);
        document.removeEventListener('keyup', this.onKeyUp);
        document.removeEventListener('mousedown', this.onMouseDown);
        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('wheel', this.onWheel);
        document.removeEventListener('pointerlockchange', this.onPointerLockChange);
        
        this.isInitialized = false;
        console.log('🗑️ PlayerControls destroyed');
    }
}

console.log('🎮 PlayerControls.js: Class defined, creating global instance...');

// Create global PlayerControls instance
try {
    window.PlayerControls = new PlayerControls();
    console.log('✅ PlayerControls: Global instance created successfully');
    console.log('🎮 PlayerControls: window.PlayerControls type:', typeof window.PlayerControls);
    console.log('🎮 PlayerControls: window.PlayerControls.initialize type:', typeof window.PlayerControls.initialize);
} catch (error) {
    console.error('❌ PlayerControls: Failed to create global instance:', error);
}

console.log('🎮 PlayerControls.js: Script completed');

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PlayerControls;
} 