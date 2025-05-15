document.addEventListener('DOMContentLoaded', function() {
    // Initialize the spacecraft parts data
    const spacecraftParts = [
        {
            id: 'recycled-engine',
            name: 'Recycled Rocket Engine',
            description: 'Converted automobile engine modified to use alternative fuels',
            thrust: 20,
            weight: 150,
            cost: 2000,
            imgSrc: 'engine.png'
        },
        {
            id: 'scrap-fuselage',
            name: 'Scrap Metal Fuselage',
            description: 'Lightweight fuselage built from salvaged aluminum and steel',
            thrust: 0,
            weight: 200,
            cost: 1500,
            imgSrc: 'fuselage.png'
        },
        {
            id: 'diy-electronics',
            name: 'DIY Control System',
            description: 'Control system built from modified consumer electronics',
            thrust: 0,
            weight: 50,
            cost: 3000,
            imgSrc: 'electronics.png'
        },
        {
            id: 'biofuel-tank',
            name: 'Biofuel Tank',
            description: 'Fuel storage for eco-friendly alternative rocket propellants',
            thrust: 5,
            weight: 100,
            cost: 1000,
            imgSrc: 'fuel-tank.png'
        },
        {
            id: 'solar-panels',
            name: 'Recycled Solar Panels',
            description: 'Energy generation from repurposed solar cells',
            thrust: 0,
            weight: 80,
            cost: 2500,
            imgSrc: 'solar-panel.png'
        },
        {
            id: 'parachute-system',
            name: 'Parachute Recovery',
            description: 'Simplified recovery system using parachutes',
            thrust: 0,
            weight: 40,
            cost: 1200,
            imgSrc: 'parachute.png'
        }
    ];

    // Innovation concepts for affordable space travel
    const innovations = [
        {
            id: 'hybrid-propulsion',
            name: 'Hybrid Propulsion',
            description: 'Combining conventional fuels with affordable alternatives like biofuels and compressed air',
            benefit: 'Reduces fuel costs by 70% while maintaining sufficient thrust',
        },
        {
            id: 'mass-manufacturing',
            name: 'Distributed Manufacturing',
            description: 'Community-based production of spacecraft components using shared knowledge and resources',
            benefit: 'Reduces costs through collective effort and resource pooling',
        },
        {
            id: 'air-launch',
            name: 'Air Launch Platforms',
            description: 'Using modified aircraft to launch small rockets from high altitude',
            benefit: 'Significantly reduces the fuel needed to reach orbit',
        },
        {
            id: 'modular-design',
            name: 'Modular Components',
            description: 'Standardized, interchangeable parts that can be easily replaced or upgraded',
            benefit: 'Reduces complexity and allows for iterative improvements',
        },
        {
            id: 'atmospheric-harvesting',
            name: 'Atmospheric Harvesting',
            description: 'Collecting oxygen from the atmosphere during ascent to reduce carried oxidizer weight',
            benefit: 'Decreases launch weight by up to 60%',
        }
    ];

    // Educational resources
    const resources = [
        {
            title: 'DIY Rocketry Basics',
            description: 'Learn fundamental principles of rocket design and propulsion',
            link: '#rocket-basics'
        },
        {
            title: 'Alternative Propulsion Methods',
            description: 'Explore new approaches to spacecraft propulsion beyond traditional rockets',
            link: '#alt-propulsion'
        },
        {
            title: 'Salvaging Electronics for Spacecraft',
            description: 'Guide to repurposing consumer electronics for space applications',
            link: '#electronics-guide'
        },
        {
            title: 'Community Aerospace Projects',
            description: 'Examples of successful collaborative space projects',
            link: '#community-projects'
        },
        {
            title: 'Unconventional Materials for Space',
            description: 'How to use everyday materials for spacecraft construction',
            link: '#space-materials'
        },
        {
            title: 'Open Source Space Hardware',
            description: 'Community-developed blueprints and designs for space hardware',
            link: '#open-hardware'
        }
    ];

    // Reference to DOM elements
    const partsList = document.getElementById('parts-list');
    const craftPreview = document.getElementById('craft-preview');
    const statsThrustValue = document.getElementById('thrust-value');
    const statsWeightValue = document.getElementById('weight-value');
    const statsCostValue = document.getElementById('cost-value');
    const statsAltitudeValue = document.getElementById('altitude-value');
    const innovationsContainer = document.getElementById('innovations');
    const resourceList = document.getElementById('resource-list');
    const launchBtn = document.getElementById('launch-btn');
    const launchAnimation = document.getElementById('launch-animation');

    // New elements for AI features
    const itemDescriptionInput = document.getElementById('item-description');
    const photoUploadBtn = document.getElementById('photo-upload-btn');
    const photoUploadInput = document.getElementById('photo-upload');
    const photoPreview = document.getElementById('photo-preview');
    const analyzeBtn = document.getElementById('analyze-btn');
    const analysisResults = document.getElementById('analysis-results');
    const resourcesInput = document.getElementById('resources-input');
    const goalInput = document.getElementById('goal-input');
    const customGoalInput = document.getElementById('custom-goal');
    const generateRoadmapBtn = document.getElementById('generate-roadmap-btn');
    const roadmapResults = document.getElementById('roadmap-results');

    // New references for underwater launch system
    const waterTempSlider = document.getElementById('water-temp');
    const waterTempValue = document.getElementById('water-temp-value');
    const waterPressureSlider = document.getElementById('water-pressure');
    const waterPressureValue = document.getElementById('water-pressure-value');
    const saltTempSlider = document.getElementById('salt-temperature');
    const saltTempValue = document.getElementById('salt-temperature-value');
    const saltMixtureSlider = document.getElementById('salt-mixture');
    const saltMixtureValue = document.getElementById('salt-mixture-value');
    const simulateLaunchBtn = document.getElementById('simulate-launch');
    const launchSimulationContainer = document.getElementById('launch-simulation-container');
    const currentPhaseDisplay = document.getElementById('current-phase');
    const currentAltitudeDisplay = document.getElementById('current-altitude');
    const currentVelocityDisplay = document.getElementById('current-velocity');
    const stage1EfficiencyDisplay = document.getElementById('stage1-efficiency');
    const stage2StatusDisplay = document.getElementById('stage2-status');
    const underwaterDiagram = document.getElementById('underwater-diagram');

    // Spacecraft configuration
    let craftConfiguration = {
        parts: [],
        getTotalThrust: function() {
            return this.parts.reduce((total, part) => total + part.thrust, 0);
        },
        getTotalWeight: function() {
            return this.parts.reduce((total, part) => total + part.weight, 0);
        },
        getTotalCost: function() {
            return this.parts.reduce((total, part) => total + part.cost, 0);
        },
        getMaxAltitude: function() {
            const thrust = this.getTotalThrust();
            const weight = this.getTotalWeight();
            if (weight === 0) return 0;

            // Simple formula: thrust-to-weight ratio determines max altitude
            // This is a simplified model for the simulation
            const thrustToWeightRatio = thrust / weight;
            if (thrustToWeightRatio < 1.2) return 0;
            if (thrustToWeightRatio < 1.5) return 10; // 10 km
            if (thrustToWeightRatio < 2) return 50; // 50 km
            if (thrustToWeightRatio < 2.5) return 100; // 100 km (edge of space)
            if (thrustToWeightRatio < 3) return 200; // Low Earth orbit
            return 400; // Higher orbit
        },
        canReachSpace: function() {
            return this.getMaxAltitude() >= 100; // 100 km is the Kármán line
        }
    };

    // Initialize the parts list
    function initPartsList() {
        spacecraftParts.forEach(part => {
            const partItem = document.createElement('div');
            partItem.className = 'part-item';
            partItem.dataset.partId = part.id;
            partItem.innerHTML = `
                <img src="${part.imgSrc}" alt="${part.name}">
                <div class="part-name">${part.name}</div>
            `;
            partItem.addEventListener('click', () => addPartToCraft(part));
            partsList.appendChild(partItem);
        });
    }

    // Add part to the spacecraft configuration
    function addPartToCraft(part) {
        // Add the part to the configuration
        craftConfiguration.parts.push(part);

        // Create a visual representation in the preview
        const partElement = document.createElement('div');
        partElement.className = 'spacecraft-part';
        partElement.dataset.partId = part.id;
        partElement.style.backgroundImage = `url(${part.imgSrc})`;
        partElement.style.backgroundSize = 'contain';
        partElement.style.backgroundRepeat = 'no-repeat';
        partElement.style.width = '60px';
        partElement.style.height = '60px';

        // Position the part in the preview area
        const positionMultiplier = craftConfiguration.parts.length - 1;
        partElement.style.top = `${50 + (positionMultiplier * -20)}px`;
        partElement.style.left = '50%';
        partElement.style.transform = 'translateX(-50%)';

        craftPreview.appendChild(partElement);

        // Update the stats display
        updateStats();

        // Highlight the added part
        partElement.classList.add('highlight');
        setTimeout(() => partElement.classList.remove('highlight'), 1000);
    }

    // Update spacecraft stats display
    function updateStats() {
        statsThrustValue.textContent = craftConfiguration.getTotalThrust();
        statsWeightValue.textContent = craftConfiguration.getTotalWeight();
        statsCostValue.textContent = `$${craftConfiguration.getTotalCost().toLocaleString()}`;
        statsAltitudeValue.textContent = `${craftConfiguration.getMaxAltitude()} km`;

        // Update launch button state
        if (craftConfiguration.canReachSpace()) {
            launchBtn.classList.add('ready');
            launchBtn.textContent = 'LAUNCH TO SPACE!';
        } else if (craftConfiguration.getMaxAltitude() > 0) {
            launchBtn.classList.remove('ready');
            launchBtn.textContent = 'LAUNCH (SUB-ORBITAL)';
        } else {
            launchBtn.classList.remove('ready');
            launchBtn.textContent = 'CRAFT NOT LAUNCHABLE';
            launchBtn.disabled = true;
        }

        // Enable launch button if we have at least some parts
        if (craftConfiguration.parts.length > 0 && craftConfiguration.getTotalThrust() > 0) {
            launchBtn.disabled = false;
        }
    }

    // Initialize the innovations list
    function initInnovations() {
        innovations.forEach(innovation => {
            const innovationCard = document.createElement('div');
            innovationCard.className = 'innovation-card';
            innovationCard.dataset.innovationId = innovation.id;
            innovationCard.innerHTML = `
                <h4>${innovation.name}</h4>
                <p>${innovation.description}</p>
                <p class="benefit"><strong>Benefit:</strong> ${innovation.benefit}</p>
            `;
            innovationsContainer.appendChild(innovationCard);
        });
    }

    // Initialize the resources list
    function initResources() {
        resources.forEach(resource => {
            const resourceItem = document.createElement('div');
            resourceItem.className = 'resource-item';
            resourceItem.innerHTML = `
                <h4>${resource.title}</h4>
                <p>${resource.description}</p>
                <a href="${resource.link}">Learn more →</a>
            `;
            resourceList.appendChild(resourceItem);
        });
    }

    // Initialize the underwater launch system diagram
    function initUnderwaterLaunchSystem() {
        // Check if the elements exist
        if (!underwaterDiagram) return;

        // Add the diagram image
        underwaterDiagram.innerHTML = `<img src="underwater-launch-diagram.png" alt="Underwater Launch System Diagram" style="max-width: 100%; max-height: 300px;">`;

        // Initialize the sliders
        if (waterTempSlider && waterTempValue) {
            waterTempSlider.addEventListener('input', () => {
                waterTempValue.textContent = `${waterTempSlider.value}°C`;
            });
        }

        if (waterPressureSlider && waterPressureValue) {
            waterPressureSlider.addEventListener('input', () => {
                waterPressureValue.textContent = `${waterPressureSlider.value} MPa`;
            });
        }

        if (saltTempSlider && saltTempValue) {
            saltTempSlider.addEventListener('input', () => {
                saltTempValue.textContent = `${saltTempSlider.value}°C`;
            });
        }

        if (saltMixtureSlider && saltMixtureValue) {
            saltMixtureSlider.addEventListener('input', () => {
                saltMixtureValue.textContent = saltMixtureSlider.value;
            });
        }

        // Initialize the simulate launch button
        if (simulateLaunchBtn) {
            simulateLaunchBtn.addEventListener('click', simulateUnderwaterLaunch);
        }
    }

    // Simulate underwater launch
    function simulateUnderwaterLaunch() {
        if (!launchSimulationContainer) return;

        // Get the values from the sliders
        const waterTemp = parseInt(waterTempSlider.value);
        const waterPressure = parseInt(waterPressureSlider.value);
        const saltTemp = parseInt(saltTempSlider.value);
        const saltMixture = parseInt(saltMixtureSlider.value);

        // Calculate the stage 1 efficiency based on water temp and pressure
        // This is a simplified model - in reality, the physics would be more complex
        const stage1Efficiency = Math.min(100, (waterTemp / 5) + (waterPressure * 1.5));

        // Calculate whether stage 2 will activate successfully based on salt temp and mixture
        const stage2Success = saltTemp >= 1000 && saltMixture >= 4;

        // Calculate max altitude based on the efficiencies
        let maxAltitude = 0;
        if (stage1Efficiency >= 50) {
            maxAltitude = 3000 + (stage1Efficiency - 50) * 100; // Minimum 3000ft as stated in the prompt

            if (stage2Success) {
                maxAltitude += (saltTemp / 10) * (saltMixture / 2) * 1000;
            }
        }

        // Setup the simulation container
        launchSimulationContainer.innerHTML = '';
        launchSimulationContainer.style.height = '400px';

        // Create the ocean environment
        const oceanBackground = document.createElement('div');
        oceanBackground.className = 'ocean-background';
        launchSimulationContainer.appendChild(oceanBackground);

        // Create the ocean floor
        const oceanFloor = document.createElement('div');
        oceanFloor.className = 'ocean-floor';
        launchSimulationContainer.appendChild(oceanFloor);

        // Create the water surface
        const waterSurface = document.createElement('div');
        waterSurface.className = 'water-surface';
        launchSimulationContainer.appendChild(waterSurface);

        // Create the underwater vehicle
        const underwaterVehicle = document.createElement('div');
        underwaterVehicle.className = 'underwater-vehicle';
        launchSimulationContainer.appendChild(underwaterVehicle);

        // Create the heating chamber
        const heatingChamber = document.createElement('div');
        heatingChamber.className = 'heating-chamber';
        underwaterVehicle.appendChild(heatingChamber);

        // Create the laser beam
        const laserBeam = document.createElement('div');
        laserBeam.className = 'laser-beam';
        launchSimulationContainer.appendChild(laserBeam);

        // Create the bubbles container
        const bubbles = document.createElement('div');
        bubbles.className = 'bubbles';
        launchSimulationContainer.appendChild(bubbles);

        // Create the steam effect
        const steamEffect = document.createElement('div');
        steamEffect.className = 'steam-effect';
        underwaterVehicle.appendChild(steamEffect);

        // Create the salt combustion effect
        const saltCombustion = document.createElement('div');
        saltCombustion.className = 'salt-combustion';
        underwaterVehicle.appendChild(saltCombustion);

        // Start the simulation
        let phase = 'preparation';
        let altitude = 0;
        let velocity = 0;
        let time = 0;

        // Update displays
        currentPhaseDisplay.textContent = 'Preparation';
        currentAltitudeDisplay.textContent = '0 m';
        currentVelocityDisplay.textContent = '0 m/s';
        stage1EfficiencyDisplay.textContent = `${Math.round(stage1Efficiency)}%`;
        stage2StatusDisplay.textContent = 'Standby';

        // Simulation interval
        const simulationInterval = setInterval(() => {
            time += 0.1; // 100ms in simulation time

            // Phase 1: Preparation (heating)
            if (phase === 'preparation') {
                // Show laser beam and gradually increase opacity
                laserBeam.style.opacity = Math.min(1, time / 3);
                heatingChamber.style.backgroundColor = `rgb(${Math.min(255, 204 + time * 20)}, ${Math.max(0, 51 - time * 10)}, 0)`;

                // Create bubbles randomly
                if (Math.random() > 0.7) {
                    const bubble = document.createElement('div');
                    bubble.className = 'bubble';
                    bubble.style.width = `${Math.random() * 10 + 5}px`;
                    bubble.style.height = bubble.style.width;
                    bubble.style.left = `${Math.random() * 80 + 10}%`;
                    bubble.style.bottom = `${Math.random() * 50 + 50}px`;
                    bubbles.appendChild(bubble);

                    // Remove bubble after animation
                    setTimeout(() => bubble.remove(), 4000);
                }

                // Update displays
                currentPhaseDisplay.textContent = 'Heating Water Chamber';

                // After 5 seconds, move to the next phase
                if (time > 5) {
                    phase = 'release';
                    time = 0;
                }
            }
            // Phase 2: Release and Stage 1 (Steam Propulsion)
            else if (phase === 'release') {
                // Hide laser beam
                laserBeam.style.opacity = Math.max(0, 1 - time);

                // Show steam effect
                steamEffect.style.opacity = Math.min(1, time);

                // Move the vehicle upward
                const newBottom = 50 + time * 30 * (stage1Efficiency / 100);
                underwaterVehicle.style.bottom = `${newBottom}px`;

                // Calculate altitude and velocity
                altitude = Math.max(0, newBottom - 80); // 80px is water surface position
                velocity = 30 * (stage1Efficiency / 100);

                // Update displays
                currentPhaseDisplay.textContent = altitude < 0 ? 'Underwater Ascent' : 'Stage 1: Steam Propulsion';
                currentAltitudeDisplay.textContent = `${Math.round(altitude * 10)} m`;
                currentVelocityDisplay.textContent = `${Math.round(velocity * 10)} m/s`;

                // If the vehicle has reached a certain altitude, jettison stage 1 components
                if (altitude > 200) {
                    phase = 'jettison';
                    time = 0;
                }
            }
            // Phase 3: Jettison Stage 1
            else if (phase === 'jettison') {
                // Create jettison effect - falling parts
                if (time < 0.5) {
                    // Create several falling parts
                    for (let i = 0; i < 5; i++) {
                        const jettison = document.createElement('div');
                        jettison.className = 'jettison-piece';
                        jettison.style.width = `${Math.random() * 15 + 5}px`;
                        jettison.style.height = `${Math.random() * 15 + 5}px`;
                        jettison.style.bottom = `${underwaterVehicle.style.bottom}`;
                        jettison.style.left = `${Math.random() * 20 + 40}%`;

                        // Random fall direction and rotation
                        const fallX = (Math.random() * 200 - 100) + 'px';
                        const fallY = (Math.random() * -100 - 100) + 'px';
                        const fallRotate = (Math.random() * 720 - 360) + 'deg';
                        jettison.style.setProperty('--fall-x', fallX);
                        jettison.style.setProperty('--fall-y', fallY);
                        jettison.style.setProperty('--fall-rotate', fallRotate);

                        launchSimulationContainer.appendChild(jettison);
                    }

                    // Modify the vehicle to look smaller (stage 2 only)
                    underwaterVehicle.style.width = '40px';
                    underwaterVehicle.style.height = '80px';

                    // Hide steam effect
                    steamEffect.style.opacity = 0;
                }

                // Continue moving upward but slower
                const currentBottom = parseFloat(underwaterVehicle.style.bottom);
                underwaterVehicle.style.bottom = `${currentBottom + 2}px`;

                // Update altitude and velocity
                altitude = Math.max(0, currentBottom - 80);
                velocity = Math.max(0, velocity - 5);

                // Update displays
                currentPhaseDisplay.textContent = 'Stage 1 Separation';
                currentAltitudeDisplay.textContent = `${Math.round(altitude * 10)} m`;
                currentVelocityDisplay.textContent = `${Math.round(velocity * 10)} m/s`;

                // After 2 seconds, move to the next phase
                if (time > 2) {
                    phase = 'stage2';
                    time = 0;
                    stage2StatusDisplay.textContent = stage2Success ? 'Ignition' : 'Failure';
                }
            }
            // Phase 4: Stage 2 (Salt Combustion)
            else if (phase === 'stage2') {
                // If stage 2 is successful, continue upward with salt combustion
                if (stage2Success) {
                    // Show salt combustion effect
                    saltCombustion.style.opacity = Math.min(1, time);

                    // Move the vehicle upward faster
                    const currentBottom = parseFloat(underwaterVehicle.style.bottom);
                    const newBottom = currentBottom + time * 10;
                    underwaterVehicle.style.bottom = `${newBottom}px`;

                    // Calculate altitude and velocity
                    altitude = Math.max(0, newBottom - 80);
                    velocity = 10 + time * 15; // Accelerating

                    // Update displays
                    currentPhaseDisplay.textContent = 'Stage 2: Salt Combustion';
                    currentAltitudeDisplay.textContent = `${Math.round(altitude * 10)} m`;
                    currentVelocityDisplay.textContent = `${Math.round(velocity * 10)} m/s`;
                    stage2StatusDisplay.textContent = 'Burning';

                    // If the vehicle has gone off-screen, end the simulation
                    if (newBottom > 500) {
                        clearInterval(simulationInterval);

                        // Show final results
                        currentPhaseDisplay.textContent = 'Mission Complete';
                        currentAltitudeDisplay.textContent = `${Math.round(maxAltitude)} m`;
                        stage2StatusDisplay.textContent = 'Success';

                        // Add success message
                        const successMessage = document.createElement('div');
                        successMessage.className = 'success-message';
                        successMessage.innerHTML = `
                            <h3>Mission Successful!</h3>
                            <p>Two-stage propulsion achieved a maximum altitude of ${Math.round(maxAltitude)} meters</p>
                            <p>This innovative approach shows great promise for affordable space access!</p>
                        `;
                        successMessage.style.position = 'absolute';
                        successMessage.style.top = '50%';
                        successMessage.style.left = '50%';
                        successMessage.style.transform = 'translate(-50%, -50%)';
                        successMessage.style.background = 'rgba(0, 0, 0, 0.8)';
                        successMessage.style.padding = '20px';
                        successMessage.style.borderRadius = '10px';
                        successMessage.style.color = '#fff';
                        successMessage.style.textAlign = 'center';
                        successMessage.style.zIndex = '10';
                        launchSimulationContainer.appendChild(successMessage);
                    }
                }
                // If stage 2 fails, start falling
                else {
                    // Move the vehicle downward
                    const currentBottom = parseFloat(underwaterVehicle.style.bottom);
                    const newBottom = Math.max(50, currentBottom - time * 5);
                    underwaterVehicle.style.bottom = `${newBottom}px`;

                    // Calculate altitude and velocity
                    altitude = Math.max(0, newBottom - 80);
                    velocity = -time * 10; // Decelerating/falling

                    // Update displays
                    currentPhaseDisplay.textContent = 'Stage 2 Failure';
                    currentAltitudeDisplay.textContent = `${Math.round(altitude * 10)} m`;
                    currentVelocityDisplay.textContent = `${Math.round(velocity * 10)} m/s`;

                    // If the vehicle has reached the ground/water, end the simulation
                    if (newBottom <= 80) {
                        clearInterval(simulationInterval);

                        // Show failure message
                        const failureMessage = document.createElement('div');
                        failureMessage.className = 'failure-message';
                        failureMessage.innerHTML = `
                            <h3>Stage 2 Failure</h3>
                            <p>Salt combustion did not ignite properly</p>
                            <p>Suggestion: Increase salt temperature to at least 1000°C and mixture ratio to at least 4</p>
                        `;
                        failureMessage.style.position = 'absolute';
                        failureMessage.style.top = '50%';
                        failureMessage.style.left = '50%';
                        failureMessage.style.transform = 'translate(-50%, -50%)';
                        failureMessage.style.background = 'rgba(0, 0, 0, 0.8)';
                        failureMessage.style.padding = '20px';
                        failureMessage.style.borderRadius = '10px';
                        failureMessage.style.color = '#ff5050';
                        failureMessage.style.textAlign = 'center';
                        failureMessage.style.zIndex = '10';
                        launchSimulationContainer.appendChild(failureMessage);
                    }
                }
            }

        }, 100); // Update every 100ms
    }

    // Launch animation
    function launchSpacecraft() {
        // Show animation container
        launchAnimation.style.display = 'block';

        // Create spacecraft for animation
        const animationCraft = document.createElement('div');
        animationCraft.className = 'animation-spacecraft';
        animationCraft.style.width = '50px';
        animationCraft.style.height = '100px';
        animationCraft.style.backgroundColor = '#ccc';
        animationCraft.style.borderRadius = '10px 10px 0 0';
        animationCraft.style.position = 'absolute';
        animationCraft.style.bottom = '10px';
        animationCraft.style.left = '50%';
        animationCraft.style.transform = 'translateX(-50%)';

        // Create thruster flame
        const flame = document.createElement('div');
        flame.className = 'thruster-flame';
        animationCraft.appendChild(flame);

        launchAnimation.appendChild(animationCraft);

        // Launch animation
        let position = 10;
        const maxAltitude = craftConfiguration.getMaxAltitude();
        const interval = setInterval(() => {
            position++;
            animationCraft.style.bottom = `${position}px`;

            // Calculate scale based on altitude
            const scale = Math.max(0.2, 1 - (position / 300));
            animationCraft.style.transform = `translateX(-50%) scale(${scale})`;

            // Add smoke particles
            if (position % 5 === 0) {
                const smoke = document.createElement('div');
                smoke.style.width = '10px';
                smoke.style.height = '10px';
                smoke.style.borderRadius = '50%';
                smoke.style.backgroundColor = 'rgba(200, 200, 200, 0.5)';
                smoke.style.position = 'absolute';
                smoke.style.bottom = `${position - 10}px`;
                smoke.style.left = `${50 + (Math.random() * 20 - 10)}%`;
                smoke.style.opacity = '0.8';
                launchAnimation.appendChild(smoke);

                // Fade and remove smoke
                setTimeout(() => {
                    smoke.style.transition = 'all 2s ease';
                    smoke.style.opacity = '0';
                    smoke.style.transform = 'scale(2)';
                    setTimeout(() => smoke.remove(), 2000);
                }, 100);
            }

            // End animation when rocket goes out of view
            if (position > 300) {
                clearInterval(interval);

                // Show result message
                const resultMessage = document.createElement('div');
                resultMessage.style.position = 'absolute';
                resultMessage.style.top = '50%';
                resultMessage.style.left = '50%';
                resultMessage.style.transform = 'translate(-50%, -50%)';
                resultMessage.style.color = '#fff';
                resultMessage.style.fontSize = '1.5rem';
                resultMessage.style.textAlign = 'center';
                resultMessage.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                resultMessage.style.padding = '20px';
                resultMessage.style.borderRadius = '10px';

                if (maxAltitude >= 100) {
                    resultMessage.innerHTML = `
                        <h3>Space Achieved!</h3>
                        <p>Your spacecraft reached ${maxAltitude} km altitude</p>
                        <p>Total cost: $${craftConfiguration.getTotalCost().toLocaleString()}</p>
                    `;
                } else {
                    resultMessage.innerHTML = `
                        <h3>Sub-Orbital Flight</h3>
                        <p>Your spacecraft reached ${maxAltitude} km altitude</p>
                        <p>Try adding more thrust or reducing weight to reach space (100 km)</p>
                    `;
                }

                launchAnimation.appendChild(resultMessage);

                // Add reset button
                const resetBtn = document.createElement('button');
                resetBtn.textContent = 'Build New Spacecraft';
                resetBtn.style.marginTop = '15px';
                resetBtn.style.padding = '10px 20px';
                resetBtn.style.border = 'none';
                resetBtn.style.borderRadius = '5px';
                resetBtn.style.backgroundColor = '#00ccff';
                resetBtn.style.color = '#000';
                resetBtn.style.cursor = 'pointer';
                resetBtn.onclick = resetSimulation;

                resultMessage.appendChild(resetBtn);
            }
        }, 50);
    }

    // Reset the simulation
    function resetSimulation() {
        // Clear the launch animation
        launchAnimation.style.display = 'none';
        launchAnimation.innerHTML = '';

        // Reset the craft configuration
        craftConfiguration.parts = [];
        craftPreview.innerHTML = '';

        // Update stats
        updateStats();
    }

    // AI Material Analysis Functions

    // Photo upload handling
    if (photoUploadBtn && photoUploadInput) {
        photoUploadBtn.addEventListener('click', () => {
            photoUploadInput.click();
        });

        photoUploadInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                const file = e.target.files[0];
                const reader = new FileReader();

                reader.onload = (e) => {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    photoPreview.innerHTML = '';
                    photoPreview.appendChild(img);
                };

                reader.readAsDataURL(file);
            }
        });
    }

    // Item analysis
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', analyzeItem);
    }

    async function analyzeItem() {
        const itemDescription = itemDescriptionInput.value.trim();

        if (!itemDescription) {
            alert('Please describe the item you want to analyze.');
            return;
        }

        // Show loading state
        analysisResults.innerHTML = `
            <div class="loading">
                <div class="loading-spinner"></div>
            </div>
        `;

        // Get image if available
        let imageData = null;
        if (photoPreview.querySelector('img')) {
            imageData = photoPreview.querySelector('img').src;
        }

        try {
            // Prepare the content array for the AI model
            const content = [
                {
                    type: "text",
                    text: `Analyze this everyday item for potential use in DIY spacecraft construction. The item is: ${itemDescription}\n\n` + 
                          "Respond with JSON that follows this schema, and absolutely no other text:\n" + 
                          "{\n" + 
                          "  spacePotential: number (1-10 rating of how useful this could be for spacecraft),\n" + 
                          "  possibleUses: Array of strings (list of 3-5 ways this could be repurposed for spacecraft),\n" + 
                          "  repurposingSteps: Array of strings (list of 3-7 steps to convert this for space use),\n" + 
                          "  safetyConsiderations: Array of strings (list of 2-3 safety issues to consider),\n" + 
                          "  alternativeMaterials: Array of strings (list of 2-3 alternatives that could work similarly)\n" + 
                          "}\n"
                }
            ];

            // Add image if available
            if (imageData) {
                content.push({
                    type: "image_url",
                    image_url: { url: imageData }
                });
            }

            // Call the AI model
            const completion = await websim.chat.completions.create({
                messages: [
                    {
                        role: "user",
                        content: content
                    }
                ],
                json: true
            });

            // Parse the response
            const result = JSON.parse(completion.content);

            // Display the analysis results
            displayAnalysisResults(result, itemDescription);
        } catch (error) {
            analysisResults.innerHTML = `
                <div class="error-message">
                    <p>Sorry, there was an error analyzing your item. Please try again.</p>
                </div>
            `;
            console.error('Analysis error:', error);
        }
    }

    function displayAnalysisResults(result, itemName) {
        // Create the result display
        let html = `
            <div class="result-card">
                <h3 class="result-title">Space Potential for: ${itemName}</h3>
                <div class="potential-rating">
                    <div class="rating-stars">
        `;

        // Add rating stars
        for (let i = 1; i <= 10; i++) {
            const starClass = i <= result.spacePotential ? 'filled' : 'empty';
            html += `<span class="star ${starClass}">★</span>`;
        }

        html += `
                    </div>
                    <div class="rating-text">${result.spacePotential}/10</div>
                </div>
                
                <div class="result-section">
                    <h4>Possible Uses:</h4>
                    <ul class="result-list">
        `;

        // Add possible uses
        result.possibleUses.forEach(use => {
            html += `<li>${use}</li>`;
        });

        html += `
                    </ul>
                </div>
                
                <div class="result-section">
                    <h4>Repurposing Steps:</h4>
                    <ol class="result-steps">
        `;

        // Add repurposing steps
        result.repurposingSteps.forEach(step => {
            html += `<li>${step}</li>`;
        });

        html += `
                    </ol>
                </div>
                
                <div class="result-section">
                    <h4>Safety Considerations:</h4>
                    <ul class="result-list warning">
        `;

        // Add safety considerations
        result.safetyConsiderations.forEach(consideration => {
            html += `<li>${consideration}</li>`;
        });

        html += `
                    </ul>
                </div>
                
                <div class="result-section">
                    <h4>Alternative Materials:</h4>
                    <ul class="result-list alternatives">
        `;

        // Add alternative materials
        result.alternativeMaterials.forEach(material => {
            html += `<li>${material}</li>`;
        });

        html += `
                    </ul>
                </div>
            </div>
            
            <button id="add-to-knowledge" class="secondary-btn">Add to Knowledge Base</button>
        `;

        // Update the results container
        analysisResults.innerHTML = html;

        // Add event listener to the "Add to Knowledge Base" button
        document.getElementById('add-to-knowledge').addEventListener('click', () => {
            // This would normally add the knowledge to a database
            alert('Item analysis added to your knowledge base!');
        });
    }

    // Roadmap Generation Functions

    // Show custom goal input when "Custom Goal" is selected
    if (goalInput) {
        goalInput.addEventListener('change', () => {
            if (goalInput.value === 'custom') {
                customGoalInput.style.display = 'block';
            } else {
                customGoalInput.style.display = 'none';
            }
        });
    }

    // Generate roadmap
    if (generateRoadmapBtn) {
        generateRoadmapBtn.addEventListener('click', generateRoadmap);
    }

    async function generateRoadmap() {
        const resources = resourcesInput.value.trim();
        let goal = goalInput.value;

        if (goal === 'custom') {
            goal = customGoalInput.value.trim();
            if (!goal) {
                alert('Please describe your custom goal.');
                return;
            }
        }

        if (!resources) {
            alert('Please describe the resources and skills you have access to.');
            return;
        }

        // Show loading state
        roadmapResults.innerHTML = `
            <div class="loading">
                <div class="loading-spinner"></div>
            </div>
        `;

        try {
            // Call the AI model
            const completion = await websim.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: "You are an expert in spacecraft engineering with unconventional approaches. You help people create plans to build their own spacecraft with limited resources."
                    },
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: `Create a step-by-step roadmap for building a spacecraft to achieve this goal: ${goal}.\n` +
                                      `Available resources and skills: ${resources}\n\n` +
                                      "Respond with JSON that follows this schema, and absolutely no other text:\n" +
                                      "{\n" +
                                      "  missionName: string (creative name for this mission),\n" +
                                      "  timeEstimate: string (rough time estimate to complete),\n" +
                                      "  difficulty: number (1-10 rating of difficulty),\n" +
                                      "  costEstimate: string (rough cost estimate range),\n" +
                                      "  steps: Array of {\n" +
                                      "    title: string (step name),\n" +
                                      "    description: string (detailed explanation),\n" +
                                      "    duration: string (time estimate for this step),\n" +
                                      "    keyResources: Array of strings (critical materials or skills),\n" +
                                      "    alternatives: Array of strings (alternative approaches)\n" +
                                      "  }\n" +
                                      "}\n"
                            }
                        ]
                    }
                ],
                json: true
            });

            // Parse the response
            const result = JSON.parse(completion.content);

            // Display the roadmap
            displayRoadmap(result);
        } catch (error) {
            roadmapResults.innerHTML = `
                <div class="error-message">
                    <p>Sorry, there was an error generating your roadmap. Please try again.</p>
                </div>
            `;
            console.error('Roadmap generation error:', error);
        }
    }

    function displayRoadmap(result) {
        // Create the roadmap display
        let html = `
            <div class="roadmap-header">
                <h3>${result.missionName}</h3>
                <div class="roadmap-meta">
                    <div class="meta-item">
                        <span class="meta-label">Time Estimate:</span>
                        <span class="meta-value">${result.timeEstimate}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Difficulty:</span>
                        <span class="meta-value">${result.difficulty}/10</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Est. Cost:</span>
                        <span class="meta-value">${result.costEstimate}</span>
                    </div>
                </div>
            </div>
            
            <div class="roadmap-steps">
        `;

        // Add steps
        result.steps.forEach((step, index) => {
            html += `
                <div class="roadmap-step">
                    <h4 class="step-title">Step ${index + 1}: ${step.title}</h4>
                    <p class="step-description">${step.description}</p>
                    <div class="step-meta">
                        <span class="step-duration">Duration: ${step.duration}</span>
                    </div>
                    
                    <div class="step-resources">
                        <h5>Key Resources:</h5>
                        <ul>
            `;

            // Add key resources
            step.keyResources.forEach(resource => {
                html += `<li>${resource}</li>`;
            });

            html += `
                        </ul>
                    </div>
                    
                    <div class="step-resources">
                        <h5>Alternative Approaches:</h5>
                        <ul>
            `;

            // Add alternatives
            step.alternatives.forEach(alt => {
                html += `<li>${alt}</li>`;
            });

            html += `
                        </ul>
                    </div>
                </div>
            `;
        });

        html += `
            </div>
            
            <div class="roadmap-footer">
                <button id="download-roadmap" class="secondary-btn">Download Roadmap</button>
                <button id="share-roadmap" class="secondary-btn">Share Roadmap</button>
            </div>
        `;

        // Update the results container
        roadmapResults.innerHTML = html;

        // Add event listeners to the buttons
        document.getElementById('download-roadmap').addEventListener('click', () => {
            alert('Roadmap would be downloaded here in a real application!');
        });

        document.getElementById('share-roadmap').addEventListener('click', () => {
            alert('Roadmap would be shared here in a real application!');
        });
    }

    // Launch button click handler
    launchBtn.addEventListener('click', launchSpacecraft);

    // Initialize the interface
    initPartsList();
    initInnovations();
    initResources();
    initUnderwaterLaunchSystem(); // Initialize the new underwater launch system
    updateStats();
});