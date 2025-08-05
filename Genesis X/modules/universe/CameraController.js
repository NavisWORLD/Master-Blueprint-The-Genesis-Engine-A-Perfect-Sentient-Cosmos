/**
 * CameraController.js - Camera Control System
 * 
 * Handles camera movement and controls for the Genesis Engine.
 * This module manages camera positioning, user input, and infinite zoom.
 */

class CameraController {
    constructor(camera) {
        this.camera = camera;
        this.isInitialized = false;
        this.mouseSensitivity = 0.002; // Default value, will be updated during initialization
        this.keyboardSensitivity = 50; // Default value, will be updated during initialization
        this.scrollSensitivity = 0.1; // Default value, will be updated during initialization
        
        // Control modes
        this.controlMode = 'orbit'; // 'orbit', 'first-person', 'cinematic'
        this.isPointerLocked = false;
        
        // Camera state
        this.position = new THREE.Vector3(0, 100, 200);
        this.target = new THREE.Vector3(0, 0, 0);
        this.up = new THREE.Vector3(0, 1, 0);
        
        // Orbit controls
        this.orbitDistance = 100;
        this.orbitPhi = 0;
        this.orbitTheta = 0;
        this.minOrbitDistance = 10;
        this.maxOrbitDistance = 1000000;
        
        // First-person controls
        this.firstPersonSpeed = 100;
        this.firstPersonRotation = new THREE.Euler();
        
        // Cinematic controls
        this.cinematicPath = [];
        this.cinematicTime = 0;
        this.cinematicDuration = 10;
        
        // Input state
        this.keys = {};
        this.mousePosition = { x: 0, y: 0 };
        this.mouseDelta = { x: 0, y: 0 };
        this.isMouseDown = false;
        
        // Infinite zoom
        this.zoomLevel = 1;
        this.minZoom = 0.0001;
        this.maxZoom = 1000000;
        this.zoomSpeed = 1.2;
    }

    /**
     * Initialize the camera controller
     */
    initialize() {
        this.updateConfiguration();
        this.setupEventListeners();
        this.isInitialized = true;
        console.log('📷 Camera Controller initialized');
    }

    /**
     * Set the camera instance
     * @param {THREE.Camera} camera - The camera to control
     */
    setCamera(camera) {
        this.camera = camera;
        if (this.camera) {
            this.camera.position.copy(this.position);
            this.camera.lookAt(this.target);
            this.camera.up.copy(this.up);
        }
        console.log('📷 Camera Controller: Camera set');
    }

    /**
     * Update configuration from Config module
     */
    updateConfiguration() {
        this.mouseSensitivity = window.Utils.getConfig('ui.controls.mouseSensitivity', 0.002);
        this.keyboardSensitivity = window.Utils.getConfig('ui.controls.keyboardSensitivity', 50);
        this.scrollSensitivity = window.Utils.getConfig('ui.controls.scrollSensitivity', 0.1);
        this.firstPersonSpeed = window.Utils.getConfig('ui.controls.firstPersonSpeed', 100);
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Keyboard events
        document.addEventListener('keydown', this.onKeyDown.bind(this));
        document.addEventListener('keyup', this.onKeyUp.bind(this));
        
        // Mouse events
        document.addEventListener('mousedown', this.onMouseDown.bind(this));
        document.addEventListener('mousemove', this.onMouseMove.bind(this));
        document.addEventListener('mouseup', this.onMouseUp.bind(this));
        document.addEventListener('wheel', this.onWheel.bind(this));
        
        // Pointer lock events
        document.addEventListener('pointerlockchange', this.onPointerLockChange.bind(this));
        
        console.log('📷 Camera Controller: Event listeners setup complete');
    }

    /**
     * Handle key down events
     * @param {KeyboardEvent} event - Key event
     */
    onKeyDown(event) {
        this.keys[event.code] = true;
        
        // Mode switching
        switch (event.code) {
            case 'KeyO':
                this.setControlMode('orbit');
                break;
            case 'KeyF':
                this.setControlMode('first-person');
                break;
            case 'KeyC':
                this.setControlMode('cinematic');
                break;
            case 'Space':
                this.togglePointerLock();
                break;
        }
    }

    /**
     * Handle key up events
     * @param {KeyboardEvent} event - Key event
     */
    onKeyUp(event) {
        this.keys[event.code] = false;
    }

    /**
     * Handle mouse down events
     * @param {MouseEvent} event - Mouse event
     */
    onMouseDown(event) {
        this.isMouseDown = true;
        this.mousePosition.x = event.clientX;
        this.mousePosition.y = event.clientY;
    }

    /**
     * Handle mouse move events
     * @param {MouseEvent} event - Mouse event
     */
    onMouseMove(event) {
        if (this.isMouseDown && this.controlMode === 'orbit') {
            this.mouseDelta.x = event.clientX - this.mousePosition.x;
            this.mouseDelta.y = event.clientY - this.mousePosition.y;
            
            this.orbitPhi += this.mouseDelta.x * this.mouseSensitivity;
            this.orbitTheta += this.mouseDelta.y * this.mouseSensitivity;
            
            // Clamp theta to prevent camera flipping
            this.orbitTheta = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, this.orbitTheta));
            
            this.mousePosition.x = event.clientX;
            this.mousePosition.y = event.clientY;
        }
    }

    /**
     * Handle mouse up events
     * @param {MouseEvent} event - Mouse event
     */
    onMouseUp(event) {
        this.isMouseDown = false;
    }

    /**
     * Handle wheel events
     * @param {WheelEvent} event - Wheel event
     */
    onWheel(event) {
        if (this.controlMode === 'orbit') {
            const zoomFactor = event.deltaY > 0 ? this.zoomSpeed : 1 / this.zoomSpeed;
            this.orbitDistance *= zoomFactor;
            this.orbitDistance = Math.max(this.minOrbitDistance, Math.min(this.maxOrbitDistance, this.orbitDistance));
        }
    }

    /**
     * Handle pointer lock change
     * @param {Event} event - Pointer lock event
     */
    onPointerLockChange(event) {
        this.isPointerLocked = document.pointerLockElement !== null;
    }

    /**
     * Toggle pointer lock
     */
    togglePointerLock() {
        if (this.isPointerLocked) {
            document.exitPointerLock();
        } else {
            document.body.requestPointerLock();
        }
    }

    /**
     * Set control mode
     * @param {string} mode - Control mode
     */
    setControlMode(mode) {
        this.controlMode = mode;
        console.log(`📷 Camera Controller: Mode changed to ${mode}`);
        
        if (mode === 'first-person') {
            this.togglePointerLock();
        }
    }

    /**
     * Update orbit camera
     */
    updateOrbitCamera() {
        const x = this.target.x + this.orbitDistance * Math.sin(this.orbitPhi) * Math.cos(this.orbitTheta);
        const y = this.target.y + this.orbitDistance * Math.sin(this.orbitTheta);
        const z = this.target.z + this.orbitDistance * Math.cos(this.orbitPhi) * Math.cos(this.orbitTheta);
        
        this.position.set(x, y, z);
        
        if (this.camera) {
            this.camera.position.copy(this.position);
            this.camera.lookAt(this.target);
        }
    }

    /**
     * Update first-person camera
     * @param {number} deltaTime - Time since last update
     */
    updateFirstPersonCamera(deltaTime) {
        const speed = this.firstPersonSpeed * deltaTime;
        
        // Handle keyboard input
        if (this.keys['KeyW']) {
            this.position.add(this.camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(speed));
        }
        if (this.keys['KeyS']) {
            this.position.add(this.camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(-speed));
        }
        if (this.keys['KeyA']) {
            const right = new THREE.Vector3();
            right.crossVectors(this.camera.getWorldDirection(new THREE.Vector3()), this.up).normalize();
            this.position.add(right.multiplyScalar(-speed));
        }
        if (this.keys['KeyD']) {
            const right = new THREE.Vector3();
            right.crossVectors(this.camera.getWorldDirection(new THREE.Vector3()), this.up).normalize();
            this.position.add(right.multiplyScalar(speed));
        }
        
        if (this.camera) {
            this.camera.position.copy(this.position);
        }
    }

    /**
     * Update cinematic camera
     * @param {number} deltaTime - Time since last update
     */
    updateCinematicCamera(deltaTime) {
        if (this.cinematicPath.length === 0) {
            // Generate a simple cinematic path if none exists
            this.generateCinematicPath();
        }
        
        this.cinematicTime += deltaTime;
        const progress = (this.cinematicTime % this.cinematicDuration) / this.cinematicDuration;
        
        // Interpolate between path points
        const pathIndex = Math.floor(progress * (this.cinematicPath.length - 1));
        const nextIndex = (pathIndex + 1) % this.cinematicPath.length;
        const localProgress = (progress * (this.cinematicPath.length - 1)) % 1;
        
        const currentPoint = this.cinematicPath[pathIndex];
        const nextPoint = this.cinematicPath[nextIndex];
        
        this.position.lerpVectors(currentPoint.position, nextPoint.position, localProgress);
        this.target.lerpVectors(currentPoint.target, nextPoint.target, localProgress);
        
        if (this.camera) {
            this.camera.position.copy(this.position);
            this.camera.lookAt(this.target);
        }
    }

    /**
     * Generate cinematic path
     */
    generateCinematicPath() {
        this.cinematicPath = [
            { position: new THREE.Vector3(0, 100, 200), target: new THREE.Vector3(0, 0, 0) },
            { position: new THREE.Vector3(200, 150, 0), target: new THREE.Vector3(0, 0, 0) },
            { position: new THREE.Vector3(0, 200, -200), target: new THREE.Vector3(0, 0, 0) },
            { position: new THREE.Vector3(-200, 150, 0), target: new THREE.Vector3(0, 0, 0) },
            { position: new THREE.Vector3(0, 100, 200), target: new THREE.Vector3(0, 0, 0) }
        ];
    }

    /**
     * Reset camera to default position
     */
    resetCamera() {
        this.position.set(0, 100, 200);
        this.target.set(0, 0, 0);
        this.orbitDistance = 100;
        this.orbitPhi = 0;
        this.orbitTheta = 0;
        
        if (this.camera) {
            this.camera.position.copy(this.position);
            this.camera.lookAt(this.target);
        }
        
        console.log('📷 Camera Controller: Camera reset');
    }

    /**
     * Update the camera controller
     * @param {number} deltaTime - Time since last update
     */
    update(deltaTime) {
        if (!this.isInitialized || !this.camera) return;
        
        switch (this.controlMode) {
            case 'orbit':
                this.updateOrbitCamera();
                break;
            case 'first-person':
                this.updateFirstPersonCamera(deltaTime);
                break;
            case 'cinematic':
                this.updateCinematicCamera(deltaTime);
                break;
        }
    }

    /**
     * Get camera statistics
     * @returns {Object} - Camera statistics
     */
    getStats() {
        return {
            position: this.position ? this.position.toArray() : null,
            target: this.target ? this.target.toArray() : null,
            controlMode: this.controlMode,
            orbitDistance: this.orbitDistance,
            isPointerLocked: this.isPointerLocked,
            isInitialized: this.isInitialized
        };
    }

    /**
     * Destroy the camera controller
     */
    destroy() {
        // Remove event listeners
        document.removeEventListener('keydown', this.onKeyDown);
        document.removeEventListener('keyup', this.onKeyUp);
        document.removeEventListener('mousedown', this.onMouseDown);
        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('mouseup', this.onMouseUp);
        document.removeEventListener('wheel', this.onWheel);
        document.removeEventListener('pointerlockchange', this.onPointerLockChange);
        
        this.isInitialized = false;
        console.log('🗑️ Camera Controller destroyed');
    }
}

// Make the class available globally
window.CameraControllerClass = CameraController;

// Create global camera controller instance
window.CameraController = new CameraController(null); // Pass null for camera, will be set later

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CameraController;
} 