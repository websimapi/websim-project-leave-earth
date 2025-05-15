import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as CANNON from 'cannon-es';

// Physics Simulation Class for Underwater Launch System
class PhysicsUnderwaterLaunchSim {
    constructor(container) {
        this.container = container;
        this.params = {
            waterTemp: 100, // °C
            waterPressure: 10, // MPa
            saltTemp: 1000, // °C
            saltMixture: 5, // ratio
            oceanDepth: 500, // meters
            waterDensity: 1025 // kg/m³
        };
        
        // Simulation state
        this.simState = {
            phase: 'preparation', // preparation, stage1, separation, stage2
            time: 0,
            altitude: 0,
            velocity: 0,
            acceleration: 0,
            thrust: 0,
            drag: 0,
            waterPressure: 0,
            stage1Status: 'Standby',
            stage2Status: 'Standby'
        };
        
        // Physics world setup
        this.world = new CANNON.World({
            gravity: new CANNON.Vec3(0, -9.82, 0) // Earth gravity
        });
        this.world.allowSleep = true;
        
        // Three.js setup
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 50000);
        this.camera.position.set(0, 10, 30);
        
        // Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.setClearColor(0x001832);
        this.renderer.shadowMap.enabled = true;
        this.container.innerHTML = '';
        this.container.appendChild(this.renderer.domElement);
        
        // Camera controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        
        // Resize handler
        window.addEventListener('resize', this.onWindowResize.bind(this));
        
        // Physics objects
        this.rocketBody = null;
        this.stage1Body = null;
        this.stage2Body = null;
        
        // Three.js objects
        this.rocketMesh = null;
        this.stage1Mesh = null;
        this.stage2Mesh = null;
        this.waterSurfaceMesh = null;
        this.oceanFloorMesh = null;
        
        // Effects
        this.waterParticles = [];
        this.steamParticles = [];
        this.flameParticles = [];
        
        // Timing
        this.clock = new THREE.Clock();
        this.running = false;
        
        // Initialize scene
        this.initializeScene();
    }
    
    // Set simulation parameters
    setParams(params) {
        Object.assign(this.params, params);
    }
    
    // Initialize the 3D scene
    initializeScene() {
        // Add lights
        const ambientLight = new THREE.AmbientLight(0x404040);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(10, 20, 10);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);
        
        // Create water surface
        const waterGeometry = new THREE.PlaneGeometry(1000, 1000);
        const waterMaterial = new THREE.MeshStandardMaterial({
            color: 0x0077be,
            transparent: true,
            opacity: 0.8,
            side: THREE.DoubleSide
        });
        this.waterSurfaceMesh = new THREE.Mesh(waterGeometry, waterMaterial);
        this.waterSurfaceMesh.rotation.x = -Math.PI / 2;
        this.waterSurfaceMesh.position.y = 0; // Water at y=0
        this.waterSurfaceMesh.receiveShadow = true;
        this.scene.add(this.waterSurfaceMesh);
        
        // Create ocean floor
        const floorGeometry = new THREE.PlaneGeometry(1000, 1000);
        const floorMaterial = new THREE.MeshStandardMaterial({
            color: 0x654321,
            side: THREE.DoubleSide
        });
        this.oceanFloorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
        this.oceanFloorMesh.rotation.x = -Math.PI / 2;
        this.oceanFloorMesh.position.y = -this.params.oceanDepth; // Ocean floor depth
        this.oceanFloorMesh.receiveShadow = true;
        this.scene.add(this.oceanFloorMesh);
        
        // Create the rocket with two stages
        this.createRocket();
        
        // Physics ground plane for water surface
        const groundShape = new CANNON.Plane();
        const groundBody = new CANNON.Body({
            mass: 0,
            shape: groundShape
        });
        groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
        groundBody.position.set(0, 0, 0);
        this.world.addBody(groundBody);
        
        // Render initial scene
        this.render();
    }
    
    // Create the rocket with physics bodies
    createRocket() {
        // Stage 1 - Cylindrical body with water propulsion
        const stage1Geometry = new THREE.CylinderGeometry(2, 2.5, 8, 16);
        const stage1Material = new THREE.MeshStandardMaterial({ color: 0x888888 });
        this.stage1Mesh = new THREE.Mesh(stage1Geometry, stage1Material);
        this.stage1Mesh.castShadow = true;
        this.stage1Mesh.receiveShadow = true;
        this.scene.add(this.stage1Mesh);
        
        // Stage 2 - Upper rocket body with salt combustion
        const stage2Geometry = new THREE.CylinderGeometry(1.5, 2, 5, 16);
        const stage2Material = new THREE.MeshStandardMaterial({ color: 0x555555 });
        this.stage2Mesh = new THREE.Mesh(stage2Geometry, stage2Material);
        this.stage2Mesh.castShadow = true;
        this.stage2Mesh.receiveShadow = true;
        this.scene.add(this.stage2Mesh);
        
        // Rocket nose cone
        const noseGeometry = new THREE.ConeGeometry(1.5, 3, 16);
        const noseMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
        const noseMesh = new THREE.Mesh(noseGeometry, noseMaterial);
        noseMesh.castShadow = true;
        noseMesh.receiveShadow = true;
        noseMesh.position.y = 4; // Position on top of stage2
        this.stage2Mesh.add(noseMesh);
        
        // Initial position - at ocean floor
        this.stage1Mesh.position.set(0, -this.params.oceanDepth, 0);
        this.stage2Mesh.position.set(0, -this.params.oceanDepth + 6.5, 0); // Positioned on top of stage1
        
        // Physics bodies
        const stage1Shape = new CANNON.Cylinder(2, 2.5, 8, 16);
        this.stage1Body = new CANNON.Body({
            mass: 5000, // kg
            shape: stage1Shape
        });
        this.stage1Body.position.set(0, -this.params.oceanDepth, 0);
        this.world.addBody(this.stage1Body);
        
        const stage2Shape = new CANNON.Cylinder(1.5, 2, 8, 16); // Including nose cone height
        this.stage2Body = new CANNON.Body({
            mass: 2000, // kg
            shape: stage2Shape
        });
        this.stage2Body.position.set(0, -this.params.oceanDepth + 6.5, 0);
        this.world.addBody(this.stage2Body);
        
        // Connect stages with constraint
        const constraint = new CANNON.LockConstraint(this.stage1Body, this.stage2Body);
        this.world.addConstraint(constraint);
        this.stageConstraint = constraint;
    }
    
    // Handle window resize
    onWindowResize() {
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }
    
    // Start the simulation
    start() {
        this.running = true;
        this.simState.phase = 'preparation';
        this.simState.time = 0;
        this.clock.start();
        this.animate();
    }
    
    // Stop the simulation
    stop() {
        this.running = false;
    }
    
    // Reset simulation to initial state
    reset() {
        // Reset simulation state
        this.simState = {
            phase: 'preparation',
            time: 0,
            altitude: 0,
            velocity: 0,
            acceleration: 0,
            thrust: 0,
            drag: 0,
            waterPressure: 0,
            stage1Status: 'Standby',
            stage2Status: 'Standby'
        };
        
        // Reset rocket position
        if (this.stage1Body) {
            this.stage1Body.position.set(0, -this.params.oceanDepth, 0);
            this.stage1Body.velocity.set(0, 0, 0);
            this.stage1Body.angularVelocity.set(0, 0, 0);
        }
        
        if (this.stage2Body) {
            this.stage2Body.position.set(0, -this.params.oceanDepth + 6.5, 0);
            this.stage2Body.velocity.set(0, 0, 0);
            this.stage2Body.angularVelocity.set(0, 0, 0);
        }
        
        // Reconnect stages if separated
        if (this.stageConstraint && !this.world.constraints.includes(this.stageConstraint)) {
            this.world.addConstraint(this.stageConstraint);
        }
        
        // Remove any particles
        this.clearEffects();
    }
    
    // Clear visual effects
    clearEffects() {
        // Remove steam particles
        for (let i = 0; i < this.steamParticles.length; i++) {
            this.scene.remove(this.steamParticles[i]);
        }
        this.steamParticles = [];
        
        // Remove water particles
        for (let i = 0; i < this.waterParticles.length; i++) {
            this.scene.remove(this.waterParticles[i]);
        }
        this.waterParticles = [];
        
        // Remove flame particles
        for (let i = 0; i < this.flameParticles.length; i++) {
            this.scene.remove(this.flameParticles[i]);
        }
        this.flameParticles = [];
    }
    
    // Update physics and visuals
    update() {
        const deltaTime = this.clock.getDelta();
        this.simState.time += deltaTime;
        
        // Update physics world
        this.world.step(1/60, deltaTime, 3);
        
        // Transfer physics to visuals
        if (this.stage1Body && this.stage1Mesh) {
            this.stage1Mesh.position.copy(this.stage1Body.position);
            this.stage1Mesh.quaternion.copy(this.stage1Body.quaternion);
        }
        
        if (this.stage2Body && this.stage2Mesh) {
            this.stage2Mesh.position.copy(this.stage2Body.position);
            this.stage2Mesh.quaternion.copy(this.stage2Body.quaternion);
        }
        
        // Update simulation based on current phase
        switch (this.simState.phase) {
            case 'preparation':
                this.updatePreparationPhase(deltaTime);
                break;
            case 'stage1':
                this.updateStage1Phase(deltaTime);
                break;
            case 'separation':
                this.updateSeparationPhase(deltaTime);
                break;
            case 'stage2':
                this.updateStage2Phase(deltaTime);
                break;
        }
        
        // Update effects
        this.updateEffects(deltaTime);
        
        // Update simulation metrics
        this.updateSimulationMetrics();
    }
    
    // Preparation phase - heating water
    updatePreparationPhase(deltaTime) {
        // In preparation phase, rocket remains on ocean floor while water heats up
        
        // Create bubbles as water heats
        if (Math.random() > 0.9) {
            this.createBubbleEffect();
        }
        
        // After heating period, transition to stage 1
        if (this.simState.time > 5) { // 5 seconds of heating
            this.simState.phase = 'stage1';
            this.simState.time = 0;
            this.simState.stage1Status = 'Active';
        }
    }
    
    // Stage 1 - Steam propulsion
    updateStage1Phase(deltaTime) {
        // Calculate thrust based on water temperature and pressure
        // This is a simplified model and could be made more physically accurate
        const baseThrust = 10000 * (this.params.waterTemp / 100) * (this.params.waterPressure / 10);
        
        // Water resistance/drag is based on density and velocity
        const velocity = this.stage1Body.velocity.length();
        const dragCoefficient = 0.8; // Simplified drag coefficient
        const area = Math.PI * 2.5 * 2.5; // Approximated cross-sectional area
        
        // Check if underwater
        if (this.stage1Body.position.y < 0) {
            // Underwater drag calculations
            const waterDensity = this.params.waterDensity;
            this.simState.drag = 0.5 * waterDensity * velocity * velocity * dragCoefficient * area;
            
            // Water pressure calculation based on depth
            const depth = -this.stage1Body.position.y;
            this.simState.waterPressure = waterDensity * 9.81 * depth / 1000000; // MPa
            
            // Add buoyancy force (simplified)
            const volume = Math.PI * 2 * 2 * 8; // Simple cylinder volume approximation
            const buoyancyForce = waterDensity * 9.81 * volume;
            this.stage1Body.applyForce(new CANNON.Vec3(0, buoyancyForce, 0), this.stage1Body.position);
            
            // Add thrust force
            this.simState.thrust = baseThrust;
            this.stage1Body.applyForce(new CANNON.Vec3(0, this.simState.thrust, 0), this.stage1Body.position);
            
            // Create water trail effect
            if (Math.random() > 0.7) {
                this.createWaterTrailEffect();
            }
        } else {
            // Aerial drag calculations (much less than water)
            const airDensity = 1.225; // kg/m³ at sea level
            this.simState.drag = 0.5 * airDensity * velocity * velocity * dragCoefficient * area;
            this.simState.waterPressure = 0;
            
            // Add thrust force (reduced in air)
            this.simState.thrust = baseThrust * 0.8; // Reduced efficiency in air
            this.stage1Body.applyForce(new CANNON.Vec3(0, this.simState.thrust, 0), this.stage1Body.position);
            
            // Create steam effect
            if (Math.random() > 0.3) {
                this.createSteamEffect();
            }
        }
        
        // Apply drag force opposite to velocity
        if (velocity > 0) {
            const dragForce = this.simState.drag;
            const dragDirection = this.stage1Body.velocity.clone().normalize().scale(-1);
            this.stage1Body.applyForce(dragDirection.scale(dragForce), this.stage1Body.position);
        }
        
        // Calculate current altitude from water surface
        this.simState.altitude = this.stage1Body.position.y;
        this.simState.velocity = this.stage1Body.velocity.y;
        
        // Transition to separation phase when reaching sufficient altitude
        if (this.simState.altitude > 300) { // 300m altitude for separation
            this.simState.phase = 'separation';
            this.simState.time = 0;
        }
    }
    
    // Stage separation phase
    updateSeparationPhase(deltaTime) {
        // Remove constraint between stages
        if (this.simState.time < 0.1 && this.stageConstraint) {
            this.world.removeConstraint(this.stageConstraint);
            
            // Apply small separation force
            this.stage2Body.applyForce(new CANNON.Vec3(0, 2000, 0), this.stage2Body.position);
            this.stage1Body.applyForce(new CANNON.Vec3(0, -1000, 0), this.stage1Body.position);
            
            // Update status
            this.simState.stage1Status = 'Separated';
        }
        
        // Apply drag to both bodies
        this.applyAerodynamicDrag(this.stage1Body, 0.8);
        this.applyAerodynamicDrag(this.stage2Body, 0.6);
        
        // Calculate current altitude and velocity from stage 2
        this.simState.altitude = this.stage2Body.position.y;
        this.simState.velocity = this.stage2Body.velocity.y;
        
        // Transition to stage 2 after short separation period
        if (this.simState.time > 2) {
            this.simState.phase = 'stage2';
            this.simState.time = 0;
            this.simState.stage2Status = 'Active';
        }
    }
    
    // Stage 2 - Salt combustion
    updateStage2Phase(deltaTime) {
        // Check if salt temperature and mixture are sufficient for combustion
        const saltCombustionSuccessful = this.params.saltTemp >= 1000 && this.params.saltMixture >= 4;
        
        if (saltCombustionSuccessful) {
            // Calculate thrust based on salt temperature and mixture
            const thrust = 15000 * (this.params.saltTemp / 1000) * (this.params.saltMixture / 5);
            this.simState.thrust = thrust;
            
            // Apply thrust to stage 2
            this.stage2Body.applyForce(new CANNON.Vec3(0, thrust, 0), this.stage2Body.position);
            
            // Create flame effect
            if (Math.random() > 0.3) {
                this.createFlameEffect();
            }
            
            // Update status
            this.simState.stage2Status = 'Burning';
        } else {
            // Combustion failed
            this.simState.thrust = 0;
            this.simState.stage2Status = 'Failure';
        }
        
        // Apply drag
        this.applyAerodynamicDrag(this.stage2Body, 0.6);
        
        // Calculate current altitude and velocity from stage 2
        this.simState.altitude = this.stage2Body.position.y;
        this.simState.velocity = this.stage2Body.velocity.y;
        
        // End simulation if altitude is very high or if stage 2 falls back to water
        if (this.simState.altitude > 10000 || (this.simState.altitude < 0 && this.simState.velocity < 0)) {
            this.stop();
            
            // Show success or failure message
            const message = saltCombustionSuccessful ? 
                'Mission Successful! Reached altitude: ' + Math.round(this.simState.altitude) + 'm' :
                'Stage 2 Failure: Salt combustion did not ignite properly';
                
            console.log(message);
        }
    }
    
    // Helper function to apply aerodynamic drag to a body
    applyAerodynamicDrag(body, coefficient) {
        const velocity = body.velocity.length();
        if (velocity > 0) {
            const airDensity = 1.225 * Math.exp(-body.position.y / 10000); // Air density decreases with altitude
            const area = Math.PI * 2 * 2; // Approximate cross-sectional area
            const drag = 0.5 * airDensity * velocity * velocity * coefficient * area;
            
            const dragDirection = body.velocity.clone().normalize().scale(-1);
            body.applyForce(dragDirection.scale(drag), body.position);
            
            this.simState.drag = drag;
        }
    }
    
    // Create bubble effect during heating
    createBubbleEffect() {
        const bubbleSize = Math.random() * 0.3 + 0.1;
        const bubbleGeometry = new THREE.SphereGeometry(bubbleSize, 8, 8);
        const bubbleMaterial = new THREE.MeshBasicMaterial({
            color: 0xaaffff,
            transparent: true,
            opacity: 0.3
        });
        
        const bubble = new THREE.Mesh(bubbleGeometry, bubbleMaterial);
        
        // Position bubble near the rocket's bottom
        bubble.position.set(
            this.stage1Body.position.x + (Math.random() * 4 - 2),
            this.stage1Body.position.y - 4,
            this.stage1Body.position.z + (Math.random() * 4 - 2)
        );
        
        this.scene.add(bubble);
        this.waterParticles.push({
            mesh: bubble,
            velocity: new THREE.Vector3(Math.random() * 0.2 - 0.1, Math.random() * 0.5 + 0.5, Math.random() * 0.2 - 0.1),
            lifetime: 0,
            maxLifetime: 3 + Math.random() * 2
        });
    }
    
    // Create water trail effect during underwater ascent
    createWaterTrailEffect() {
        const dropSize = Math.random() * 0.5 + 0.3;
        const dropGeometry = new THREE.SphereGeometry(dropSize, 8, 8);
        const dropMaterial = new THREE.MeshBasicMaterial({
            color: 0x0077be,
            transparent: true,
            opacity: 0.6
        });
        
        const drop = new THREE.Mesh(dropGeometry, dropMaterial);
        
        // Position drop at the bottom of the rocket
        drop.position.set(
            this.stage1Body.position.x + (Math.random() * 3 - 1.5),
            this.stage1Body.position.y - 4,
            this.stage1Body.position.z + (Math.random() * 3 - 1.5)
        );
        
        this.scene.add(drop);
        this.waterParticles.push({
            mesh: drop,
            velocity: new THREE.Vector3(
                Math.random() * 2 - 1,
                -this.stage1Body.velocity.y * 0.2 - Math.random() * 2,
                Math.random() * 2 - 1
            ),
            lifetime: 0,
            maxLifetime: 1 + Math.random()
        });
    }
    
    // Create steam effect during stage 1
    createSteamEffect() {
        const steamSize = Math.random() * 1 + 0.5;
        const steamGeometry = new THREE.SphereGeometry(steamSize, 8, 8);
        const steamMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.3
        });
        
        const steam = new THREE.Mesh(steamGeometry, steamMaterial);
        
        // Position steam at the bottom of the rocket
        steam.position.set(
            this.stage1Body.position.x + (Math.random() * 2 - 1),
            this.stage1Body.position.y - 4,
            this.stage1Body.position.z + (Math.random() * 2 - 1)
        );
        
        this.scene.add(steam);
        this.steamParticles.push({
            mesh: steam,
            velocity: new THREE.Vector3(
                Math.random() * 2 - 1,
                -Math.random() * 5 - 3,
                Math.random() * 2 - 1
            ),
            lifetime: 0,
            maxLifetime: 1.5 + Math.random()
        });
    }
    
    // Create flame effect during stage 2
    createFlameEffect() {
        const flameSize = Math.random() * 1.2 + 0.8;
        const flameGeometry = new THREE.ConeGeometry(flameSize, flameSize * 2, 8);
        const flameMaterial = new THREE.MeshBasicMaterial({
            color: new THREE.Color(Math.random() * 0.5 + 0.5, Math.random() * 0.5, 0),
            transparent: true,
            opacity: 0.7
        });
        
        const flame = new THREE.Mesh(flameGeometry, flameMaterial);
        flame.rotation.x = Math.PI; // Point cone downward
        
        // Position flame at the bottom of stage 2
        flame.position.set(
            this.stage2Body.position.x + (Math.random() * 0.5 - 0.25),
            this.stage2Body.position.y - 4,
            this.stage2Body.position.z + (Math.random() * 0.5 - 0.25)
        );
        
        this.scene.add(flame);
        this.flameParticles.push({
            mesh: flame,
            velocity: new THREE.Vector3(
                Math.random() * 1 - 0.5,
                -Math.random() * 10 - 5,
                Math.random() * 1 - 0.5
            ),
            lifetime: 0,
            maxLifetime: 0.5 + Math.random() * 0.5
        });
    }
    
    // Update particle effects
    updateEffects(deltaTime) {
        // Update water particles
        for (let i = this.waterParticles.length - 1; i >= 0; i--) {
            const particle = this.waterParticles[i];
            particle.lifetime += deltaTime;
            
            if (particle.lifetime > particle.maxLifetime) {
                this.scene.remove(particle.mesh);
                this.waterParticles.splice(i, 1);
                continue;
            }
            
            // Update position
            particle.mesh.position.x += particle.velocity.x * deltaTime;
            particle.mesh.position.y += particle.velocity.y * deltaTime;
            particle.mesh.position.z += particle.velocity.z * deltaTime;
            
            // Fade out
            const opacity = 0.6 * (1 - particle.lifetime / particle.maxLifetime);
            particle.mesh.material.opacity = opacity;
        }
        
        // Update steam particles
        for (let i = this.steamParticles.length - 1; i >= 0; i--) {
            const particle = this.steamParticles[i];
            particle.lifetime += deltaTime;
            
            if (particle.lifetime > particle.maxLifetime) {
                this.scene.remove(particle.mesh);
                this.steamParticles.splice(i, 1);
                continue;
            }
            
            // Update position
            particle.mesh.position.x += particle.velocity.x * deltaTime;
            particle.mesh.position.y += particle.velocity.y * deltaTime;
            particle.mesh.position.z += particle.velocity.z * deltaTime;
            
            // Expand and fade
            const scale = 1 + particle.lifetime;
            particle.mesh.scale.set(scale, scale, scale);
            
            const opacity = 0.3 * (1 - particle.lifetime / particle.maxLifetime);
            particle.mesh.material.opacity = opacity;
        }
        
        // Update flame particles
        for (let i = this.flameParticles.length - 1; i >= 0; i--) {
            const particle = this.flameParticles[i];
            particle.lifetime += deltaTime;
            
            if (particle.lifetime > particle.maxLifetime) {
                this.scene.remove(particle.mesh);
                this.flameParticles.splice(i, 1);
                continue;
            }
            
            // Update position
            particle.mesh.position.x += particle.velocity.x * deltaTime;
            particle.mesh.position.y += particle.velocity.y * deltaTime;
            particle.mesh.position.z += particle.velocity.z * deltaTime;
            
            // Scale and fade
            const lifeRatio = particle.lifetime / particle.maxLifetime;
            const scaleXZ = 1 + lifeRatio * 2;
            const scaleY = 1 - lifeRatio * 0.5;
            particle.mesh.scale.set(scaleXZ, scaleY, scaleXZ);
            
            const opacity = 0.7 * (1 - lifeRatio);
            particle.mesh.material.opacity = opacity;
            
            // Color transition from yellow to red
            const r = Math.min(1, 0.5 + lifeRatio * 0.5);
            const g = Math.max(0, 0.5 - lifeRatio * 0.5);
            particle.mesh.material.color.setRGB(r, g, 0);
        }
    }
    
    // Update simulation metrics and UI displays
    updateSimulationMetrics() {
        // Calculate acceleration
        const currentVelocity = this.simState.velocity;
        const prevVelocity = this.prevVelocity || 0;
        const deltaTime = this.clock.getDelta();
        
        if (deltaTime > 0) {
            this.simState.acceleration = (currentVelocity - prevVelocity) / deltaTime;
        }
        this.prevVelocity = currentVelocity;
        
        // Update UI elements if provided
        if (window.updatePhysicsUI) {
            window.updatePhysicsUI(this.simState);
        }
    }
    
    // Animation loop
    animate() {
        if (!this.running) return;
        
        requestAnimationFrame(this.animate.bind(this));
        this.update();
        this.render();
    }
    
    // Render the scene
    render() {
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}

export { PhysicsUnderwaterLaunchSim };