import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { useSync } from '~/lib/SyncContext';
import { products } from '../../constants/products';

// ─── Asset Configuration ───
// Allows easy swapping of 3D models and textures in the future.
// When using GLTF/GLB models, standard Three.js GLTFLoader can be initialized here.
const ASSETS_CONFIG = {
    productModelPath: null,
    environmentMapPath: null,
    cityNoiseTextureResolution: 256,
    themeColors: {
        background: '#050a05', // Deep Tactical Green-Black
        cityConcrete: 0x051a05,
        tokyoSpec: 0x021102,
        primary: '#b4f0b4', // Tactical Lime Green Emission
        accent: '#00ff41',
        indicator: '#00ff41',
        searchlight: 0x00ff41
    }
};

/**
 * 3D Hero Scene: TOKYO FOCUS implementation
 * Features "fly-in" camera movement, structural wireframes, spotlight highlights,
 * and dynamic city & typography synchronization responding to Z depth.
 */
export default function HeroScene() {
    const hudRef = useRef(null);
    const activeUniforms = useRef([]);
    const containerRef = useRef(null);
    const sceneRef = useRef(null);
    const groupRef = useRef(null);
    const cineRef = useRef({ progress: 1, startAngle: 0, currentAngle: 0 });
    const [activeTargetIndex, setActiveTargetIndex] = useState(0);
    const [copyOpacity, setCopyOpacity] = useState(0);
    const { isSynchronized, syncedCity } = useSync();

    const syncRef = useRef(false);
    const syncedCityRef = useRef('');

    useEffect(() => {
        syncRef.current = isSynchronized;
        syncedCityRef.current = syncedCity;
    }, [isSynchronized, syncedCity]);

    // Handle button clicks to trigger Cinematic Orbit Move
    useEffect(() => {
        if (cineRef.current.progress >= 1) {
            cineRef.current.startAngle = cineRef.current.currentAngle;
            cineRef.current.progress = 0; // Trigger curve
        }
    }, [activeTargetIndex]);

    // Real-time DOM refs to update HUD without React re-renders mapping 60fps
    const indicatorNodeRef = useRef(null);
    const indicatorNameRef = useRef(null);
    const indicatorCoordsRef = useRef(null);

    // Central Dynamic Typography refs
    const centralScaleRef = useRef(null);
    const centralTextRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // ─── Scene Setup ───
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(ASSETS_CONFIG.themeColors.background);
        scene.fog = new THREE.FogExp2(ASSETS_CONFIG.themeColors.background, 0.025);

        const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
        // Base distance set back to capture full legs/body of Angr-kun beautifully (0, 2, 15)
        camera.position.set(0, 2, 15);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        // slightly darker tone mapping
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 0.9;

        containerRef.current.appendChild(renderer.domElement);

        // ─── Texture Generation (Tokyo Noise Bump) ───
        const res = ASSETS_CONFIG.cityNoiseTextureResolution;
        const canvas = document.createElement('canvas');
        canvas.width = res;
        canvas.height = res;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#111';
        ctx.fillRect(0, 0, res, res);
        ctx.fillStyle = '#fff';
        // Random window patterns
        for (let i = 0; i < res; i += 8) {
            for (let j = 0; j < res; j += 8) {
                if (Math.random() > 0.6) {
                    ctx.fillRect(i, j, 4, 6);
                }
            }
        }
        const windowTexture = new THREE.CanvasTexture(canvas);
        windowTexture.wrapS = THREE.RepeatWrapping;
        windowTexture.wrapT = THREE.RepeatWrapping;

        // ─── Lighting (Architectural Shadows & Tokyo Spotlight) ───
        // Reduced ambient for much higher contrast
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
        scene.add(ambientLight);

        // Increased main light intensity for sharp specular hits
        const mainLight = new THREE.DirectionalLight(0xffffff, 3.5);
        mainLight.position.set(10, 20, 10);
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 2048;
        mainLight.shadow.mapSize.height = 2048;
        mainLight.shadow.camera.near = 0.5;
        mainLight.shadow.camera.far = 100;
        mainLight.shadow.camera.left = -30;
        mainLight.shadow.camera.right = 30;
        mainLight.shadow.camera.top = 30;
        mainLight.shadow.camera.bottom = -30;
        mainLight.shadow.bias = -0.0005;
        scene.add(mainLight);

        const fillLight = new THREE.DirectionalLight(0x8ba4b5, 0.4);
        fillLight.position.set(-15, 5, -15);
        scene.add(fillLight);

        // ─── Hero Key Light (Angr-kun Dedicated) ───
        // Redness enhancer: High intensity PointLight close to the Gatekeeper
        const heroLight = new THREE.PointLight(0xffffff, 15.0, 25);
        heroLight.position.set(0, 6, 8); // Adjusted outwards and more intense for wider z=10 distance
        heroLight.castShadow = true;
        scene.add(heroLight);

        // ─── Hero Rim Light (For 360-degree rotation backside) ───
        const rimLight = new THREE.DirectionalLight(0xffffff, 3.5);
        rimLight.position.set(0, 8, -10); // Placed high behind the model
        scene.add(rimLight);

        // Dynamic Spotlight dedicated ONLY for Tokyo core
        const tokyoSpotLight = new THREE.SpotLight(0xffffff, 8);
        tokyoSpotLight.position.set(0, 12, 10); // Pointing steeply down into Tokyo
        tokyoSpotLight.target.position.set(0, 0, -2);
        tokyoSpotLight.angle = Math.PI / 4;
        tokyoSpotLight.penumbra = 0.5;
        tokyoSpotLight.castShadow = true;
        scene.add(tokyoSpotLight);
        scene.add(tokyoSpotLight.target);

        // ─── Angr-kun Model (Replaces Macro Sphere) ───
        const product = new THREE.Group();
        // Fully centered exactly at 0, 0, 0
        product.position.set(0, 0, 0);
        scene.add(product);

        const loader = new GLTFLoader();
        
        loader.load('/assets/Angr-kun bler赤.glb', (gltf) => {
            // Clean up previous references to avoid memory leaks or duplicated shader unifs
            activeUniforms.current = [];
            
            const model = gltf.scene;
            model.scale.set(5.0, 5.0, 5.0);
            
            // Force reset model's internal geometry offset (Pivot correction)
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            model.position.sub(center); 
            
            // Revert to 1 Single Asset placed centrally.
            model.userData = { productIndex: 0 };
            
            model.traverse((node) => {
                if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                    node.frustumCulled = false;
                    
                    if (node.material) {
                        node.material = node.material.clone();
                        node.material.onBeforeCompile = (shader) => {
                            shader.uniforms.uTime = { value: 0 };
                            shader.uniforms.uHover = { value: 0 };
                            activeUniforms.current.push(shader.uniforms);
                            
                            shader.fragmentShader = `
                                uniform float uTime;
                                uniform float uHover;
                                ${shader.fragmentShader}
                            `;
                            
                            shader.fragmentShader = shader.fragmentShader.replace(
                                '#include <dithering_fragment>',
                                `#include <dithering_fragment>
                                if (uHover > 0.05) {
                                    float scanline = sin(gl_FragCoord.y * 0.2 - uTime * 6.0);
                                    if (scanline > 0.95) {
                                        gl_FragColor.rgb += vec3(0.0, 1.0, 0.25) * uHover * 2.5;
                                    }
                                }
                                `
                            );
                        };
                    }
                }
            });
            product.add(model);
        }, undefined, (error) => {
            console.error('Error loading model:', error);
        });

        // ─── City Buildings (Matte Concrete + Tokyo Hub) ───
        const cityGroup = new THREE.Group();
        cityGroup.position.y = -8;

        const baseBuildingMat = new THREE.MeshStandardMaterial({
            color: ASSETS_CONFIG.themeColors.cityConcrete,
            roughness: 0.7,
            metalness: 0.3,
        });

        const tokyoBuildingMat = new THREE.MeshStandardMaterial({
            color: ASSETS_CONFIG.themeColors.tokyoSpec,
            roughness: 0.25, // Extremely specular and sharp for Tokyo
            metalness: 0.85,
            bumpMap: windowTexture,
            bumpScale: 0.08,
        });

        const lineMat = new THREE.LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.05
        });

        const originalBuildings = [];

        for (let i = 0; i < 150; i++) {
            const isTokyo = i < 60; // First 60 buildings are clustered for Tokyo
            const angle = Math.random() * Math.PI * 2;
            // DONUT LAYOUT: Force a minimum radius of 15 units to keep the center completely empty for the Gatekeeper
            const baseRadiusOffset = 15;
            const radius = baseRadiusOffset + (isTokyo ? Math.random() * 8 : Math.random() * 25);

            const h = isTokyo ? (4 + Math.random() * 14) : (2 + Math.random() * 8);
            const w = 0.8 + Math.random() * 1.5;
            const d = 0.8 + Math.random() * 1.5;

            const buildingGeo = new THREE.BoxGeometry(w, h, d);
            const mat = isTokyo ? tokyoBuildingMat.clone() : baseBuildingMat;

            if (isTokyo) {
                // Adjust texture repeat to match building scale
                mat.bumpMap = windowTexture.clone();
                mat.bumpMap.needsUpdate = true;
                mat.bumpMap.repeat.set(w * 2, h);
            }

            const building = new THREE.Mesh(buildingGeo, mat);
            building.position.set(
                Math.cos(angle) * radius,
                h / 2 - 1,
                Math.sin(angle) * radius,
            );
            building.castShadow = true;
            building.receiveShadow = true;

            // Add architectural wireframe
            const edges = new THREE.EdgesGeometry(buildingGeo);
            const wireframe = new THREE.LineSegments(edges, lineMat);
            building.add(wireframe);

            if (Math.random() > 0.8) {
                originalBuildings.push(building);
            }

            cityGroup.add(building);
        }

        // Ground Ring Center
        const groundGeo = new THREE.CylinderGeometry(40, 40, 1, 64);
        const groundMat = new THREE.MeshStandardMaterial({
            color: 0x050505,
            roughness: 0.95,
            metalness: 0.1
        });
        const ground = new THREE.Mesh(groundGeo, groundMat);
        ground.position.y = -1;
        ground.receiveShadow = true;
        cityGroup.add(ground);
        scene.add(cityGroup);

        // ─── City Label Data & Searchlights ───
        const cities = [
            { name: 'BANGKOK', pos: new THREE.Vector3(-14, 5, 28), coords: '13.7563° N, 100.5018° E' },
            { name: 'HO CHI MINH', pos: new THREE.Vector3(12, 6, 23), coords: '10.7769° N, 106.7009° E' },
            { name: 'SHANGHAI', pos: new THREE.Vector3(10, 8, 18), coords: '31.2304° N, 121.4737° E' },
            { name: 'TAIPEI', pos: new THREE.Vector3(-10, 7, 13), coords: '25.0330° N, 121.5654° E' },
            { name: 'SEOUL', pos: new THREE.Vector3(8, 10, 8), coords: '37.5665° N, 126.9780° E' },
            { name: 'TOKYO', pos: new THREE.Vector3(0, 12, -2), coords: '35.6895° N, 139.6917° E' },
        ];

        const cityNodes = [];
        const searchLightGeo = new THREE.CylinderGeometry(0.15, 0.15, 40, 16);
        searchLightGeo.translate(0, 20, 0); // anchor at bottom
        const searchLightMat = new THREE.MeshBasicMaterial({
            color: ASSETS_CONFIG.themeColors.searchlight,
            transparent: true,
            opacity: 0.12,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        cities.forEach((city) => {
            // Create tiny city text sprite floating above
            const canvas = document.createElement('canvas');
            canvas.width = 512;
            canvas.height = 128;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 64px "Noto Sans JP", Outfit, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.letterSpacing = '12px';
            ctx.fillText(city.name, 256, 64);

            const texture = new THREE.CanvasTexture(canvas);
            const spriteMat = new THREE.SpriteMaterial({
                map: texture,
                transparent: true,
                opacity: 0,
                depthTest: false,
            });
            const sprite = new THREE.Sprite(spriteMat);
            sprite.position.copy(city.pos);
            sprite.scale.set(6, 1.5, 1);
            scene.add(sprite);

            // Create searchlight marking the coordinates
            const searchLight = new THREE.Mesh(searchLightGeo, searchLightMat);
            searchLight.position.copy(city.pos);
            searchLight.position.y -= 10;
            scene.add(searchLight);

            cityNodes.push({ sprite, searchLight, name: city.name, coords: city.coords, z: city.pos.z });
        });

        // ─── Particles ───
        const particleCount = 300;
        const particlePositions = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount; i++) {
            particlePositions[i * 3] = (Math.random() - 0.5) * 60;
            particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 20;
            particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 60;
        }
        const particleGeo = new THREE.BufferGeometry();
        particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        const particleMat = new THREE.PointsMaterial({
            size: 0.05,
            color: ASSETS_CONFIG.themeColors.indicator,
            transparent: true,
            opacity: 0.5,
            sizeAttenuation: true
        });
        const particles = new THREE.Points(particleGeo, particleMat);
        scene.add(particles);

        // ─── GPU Burst Shader Material ───
        const burstUniforms = {
            uTime: { value: 0.0 },
            uColor: { value: new THREE.Color(0x00ffff) }
        };
        const burstGeo = new THREE.BufferGeometry();
        const bCount = 4000;
        const bPositions = new Float32Array(bCount * 3);
        const bVelocities = new Float32Array(bCount * 3);
        for (let i = 0; i < bCount; i++) {
            bPositions[i * 3] = 0; bPositions[i * 3 + 1] = 0; bPositions[i * 3 + 2] = 0;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(Math.random() * 2 - 1);
            const speed = 10 + Math.random() * 30;
            bVelocities[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
            bVelocities[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed;
            bVelocities[i * 3 + 2] = Math.cos(phi) * speed;
        }
        burstGeo.setAttribute('position', new THREE.BufferAttribute(bPositions, 3));
        burstGeo.setAttribute('velocity', new THREE.BufferAttribute(bVelocities, 3));

        const burstMat = new THREE.ShaderMaterial({
            uniforms: burstUniforms,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            vertexShader: `
                uniform float uTime;
                attribute vec3 velocity;
                varying float vOpacity;
                void main() {
                    vec3 pos = position + velocity * uTime;
                    pos.y -= uTime * uTime * 6.0; 
                    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
                    gl_PointSize = (100.0 / -mvPos.z);
                    gl_Position = projectionMatrix * mvPos;
                    vOpacity = max(0.0, 1.0 - (uTime * 0.4));
                }
            `,
            fragmentShader: `
                uniform vec3 uColor;
                varying float vOpacity;
                void main() {
                    float dist = length(gl_PointCoord - vec2(0.5));
                    if (dist > 0.5) discard;
                    gl_FragColor = vec4(uColor, vOpacity * (1.0 - dist * 2.0));
                }
            `
        });
        const burstPoints = new THREE.Points(burstGeo, burstMat);
        burstPoints.position.copy(product.position);
        scene.add(burstPoints);

        // ─── Interaction & Responsive Input (Inertia Drag-to-Rotate) ───
        // True physical velocity and damping setup
        const dragInfo = { isDragging: false, startX: 0, startY: 0, lastX: 0, lastY: 0, velocityX: 0, velocityY: 0 };
        const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
        
        // Raycaster Setup
        const raycaster = new THREE.Raycaster();
        const mouseObj = new THREE.Vector2(-9999, -9999);
        let isHoveredTarget = false;

        function onPointerDown(e) {
            dragInfo.isDragging = true;
            dragInfo.startX = e.touches ? e.touches[0].clientX : e.clientX;
            dragInfo.startY = e.touches ? e.touches[0].clientY : e.clientY;
            dragInfo.lastX = dragInfo.startX;
            dragInfo.lastY = dragInfo.startY;
            dragInfo.velocityX = 0;
            dragInfo.velocityY = 0;
        }

        function onPointerMove(e) {
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;

            if (dragInfo.isDragging) {
                if (e.cancelable) e.preventDefault(); 

                const deltaX = clientX - dragInfo.lastX;
                const deltaY = clientY - dragInfo.lastY;

                dragInfo.velocityX = deltaX * 0.0018; 
                dragInfo.velocityY = deltaY * 0.0018;

                dragInfo.lastX = clientX;
                dragInfo.lastY = clientY;
            }
        }

        function onPointerUp() {
            dragInfo.isDragging = false;
        }

        const wrapperEl = containerRef.current;
        const canvasEl = renderer.domElement;
        canvasEl.style.pointerEvents = 'auto'; // Force canvas level auto
        console.log("Canvas Container Active - Interaction Listeners Bound!");

        // Bind Mouse completely non-passive
        wrapperEl.addEventListener('mousedown', onPointerDown, { passive: false });
        wrapperEl.addEventListener('mousemove', onPointerMove, { passive: false });
        window.addEventListener('mouseup', onPointerUp, { passive: false });
        wrapperEl.addEventListener('mouseleave', onPointerUp, { passive: false });
        // Bind Touch completely non-passive
        wrapperEl.addEventListener('touchstart', onPointerDown, { passive: false });
        wrapperEl.addEventListener('touchmove', onPointerMove, { passive: false });
        window.addEventListener('touchend', onPointerUp, { passive: false });

        // ─── Scroll & Resize ───
        let scrollOffset = 0;
        const totalScrollHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);

        function onScroll() {
            scrollOffset = Math.max(0, Math.min(1, window.scrollY / totalScrollHeight));

            // Sync overlay typography (Full opacity at 0.8)
            const cp = THREE.MathUtils.clamp((scrollOffset - 0.5) / 0.3, 0, 1);
            setCopyOpacity(cp);
        }
        window.addEventListener('scroll', onScroll, { passive: true });

        function onResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }
        window.addEventListener('resize', onResize);

        // ─── Animation Loop ───
        const clock = new THREE.Clock();
        let animationId;
        let syncTriggered = false;
        let syncStartTime = 0;

        function animate() {
            animationId = requestAnimationFrame(animate);
            const elapsed = clock.getElapsedTime();

            // ─── Premium Interaction Physics (Velocity + Damping) ───
            // Apply velocity to rotation continuously
            product.rotation.y += dragInfo.velocityX;
            product.rotation.x += dragInfo.velocityY;

            // Apply Damping (Air Friction/Inertia) so it spins smoothly and then comes to a stop
            dragInfo.velocityX *= 0.95;
            dragInfo.velocityY *= 0.95;

            // Clamp vertical rotation so you can't view completely under/over and flip it
            product.rotation.x = THREE.MathUtils.clamp(product.rotation.x, -Math.PI / 4, Math.PI / 4);

            // Ambient passive floating Z roll for a tiny bit of life
            product.rotation.z = Math.sin(elapsed * 0.3) * 0.02;

            // Fixed Center alignment - completely independent from scroll jitter
            product.position.y = 0; // Forced absolute center

            // Camera Flight: Apply easing (x^3) to scroll to create dramatic sudden zoom out late in the scroll
            const easeScroll = Math.pow(scrollOffset, 3);
            
            // Cinematic Orbital Engine
            const targetInfo = products[activeTargetIndex];
            if (cineRef.current.progress < 1) {
                cineRef.current.progress += 0.015; // Animation speed
                if (cineRef.current.progress > 1) cineRef.current.progress = 1;
            }
            
            // Generate smoothly mapped transition (Angle)
            const easeP = THREE.MathUtils.smoothstep(cineRef.current.progress, 0, 1);
            cineRef.current.currentAngle = THREE.MathUtils.lerp(cineRef.current.startAngle, targetInfo.cameraAngle, easeP);
            
            // Radius expands heavily during transition to give wide berth
            const parabolicRadiusBump = Math.sin(cineRef.current.progress * Math.PI) * 15;
            // Base Z interpolates to 45 on scroll, starts at 15
            const baseRadius = THREE.MathUtils.lerp(15, 45, easeScroll) + parabolicRadiusBump;
            
            const targetX = Math.sin(cineRef.current.currentAngle) * baseRadius;
            const targetZFull = Math.cos(cineRef.current.currentAngle) * baseRadius;
            const targetY = THREE.MathUtils.lerp(2, 12, easeScroll);

            // Apply interpolations
            camera.position.x += (targetX - camera.position.x) * 0.05;
            camera.position.y += (targetY - camera.position.y) * 0.05;
            camera.position.z += (targetZFull - camera.position.z) * 0.05;

            // Lock lookAt focus exactly dynamically to center origin
            camera.lookAt(0, 0, 0);

            // ─── Tactical HUD & Raycaster Engine ───
            raycaster.setFromCamera(mouseObj, camera);
            const intersects = raycaster.intersectObject(product, true);
            isHoveredTarget = intersects.length > 0 && !dragInfo.isDragging && !isTouchDevice;
            
            // Identify which model is hovered via userData traversal up the tree
            let hoveredIdx = activeTargetIndex; 
            // Since there's only 1 model now, the index dictates the HUD text directly
            if (isHoveredTarget) {
                hoveredIdx = activeTargetIndex;
            }

            // Sync Hover State to Fragment Shader uniforms
            activeUniforms.current?.forEach(u => {
                u.uTime.value = elapsed;
                u.uHover.value = THREE.MathUtils.lerp(u.uHover.value, isHoveredTarget ? 1.0 : 0.0, 0.1);
            });

            // Sync Hover Box UI DOM independently via DOM ref injection (Bypassing React Renders for 60FPS)
            if (hudRef.current) {
                if (isHoveredTarget) {
                    // Position HUD right next to the geometry (vector projected)
                    const hudAnchorPos = new THREE.Vector3(2.0, 0, 0);
                    hudAnchorPos.applyMatrix4(product.matrixWorld);
                    hudAnchorPos.project(camera);
                    
                    const uiX = (hudAnchorPos.x * 0.5 + 0.5) * window.innerWidth;
                    const uiY = (hudAnchorPos.y * -0.5 + 0.5) * window.innerHeight;
                    
                    if (hudRef.current?.style) {
                        hudRef.current.style.opacity = '1';
                        hudRef.current.style.transform = `translate(${uiX}px, ${uiY}px)`;
                    }
                    // Add state class to trigger the CSS typing animations if not already present
                    if(!hudRef.current.classList.contains('scanning-active') || hudRef.current.getAttribute('data-active-index') !== hoveredIdx.toString()) {
                        hudRef.current.classList.remove('scanning-active');
                        // Small reflow to reset CSS anim
                        void hudRef.current.offsetWidth;
                        hudRef.current.classList.add('scanning-active');
                        hudRef.current.setAttribute('data-active-index', hoveredIdx);
                        
                        // Dynamically update text contents manually for raw DOM approach
                        const container = hudRef.current;
                        if(container) {
                            const domType = container.querySelector('#ui-type-id');
                            const domName = container.querySelector('#ui-name');
                            const domPrsn = container.querySelector('#ui-prsn');
                            const domStat = container.querySelector('#ui-status');
                            if(domType) domType.innerText = `TYPE_ID: ${products[hoveredIdx].hud.typeId}`;
                            if(domName) domName.innerText = `NAME: ${products[hoveredIdx].hud.name}`;
                            if(domPrsn) domPrsn.innerText = `PRSN: ${products[hoveredIdx].hud.personality}`;
                            if(domStat) domStat.innerText = `> ${products[hoveredIdx].hud.status}`;
                        }
                    }
                } else {
                    if (hudRef.current?.style) hudRef.current.style.opacity = '0';
                    hudRef.current?.classList?.remove('scanning-active');
                }
            }

            // HUD & Central Typography visibility mechanics
            let maxIndicatorOp = 0;
            let targetCentralOp = 0;
            let targetCentralBlur = 20;
            let targetCentralScale = 0.5;
            let activeCity = cityNodes[cityNodes.length - 1]; // Default fallback to Tokyo

            cityNodes.forEach((node) => {
                const dist = camera.position.z - node.z;
                const absDist = Math.abs(dist);
                let op = 0;
                let indicatorOp = 0;
                let centralOp = 0;
                let centralBlur = 20;
                let centralScale = 0.5;

                // Searchlight pulse effect
                node.searchLight.material.opacity = 0.08 + Math.sin(elapsed * 2 + node.z) * 0.04;

                if (node.name === 'TOKYO') {
                    // Tokyo specific mechanics
                    const tokyoOp = THREE.MathUtils.clamp((scrollOffset - 0.6) / 0.3, 0, 1);
                    node.sprite.material.opacity = tokyoOp;
                    indicatorOp = tokyoOp;

                    // Special central typography for Tokyo - larger and perfectly clear
                    const tokyoFocus = THREE.MathUtils.clamp((scrollOffset - 0.75) / 0.25, 0, 1);
                    centralOp = tokyoFocus * 0.35;
                    centralBlur = (1 - tokyoFocus) * 10;
                    centralScale = 0.8 + (tokyoFocus * 0.4);
                } else {
                    // Others fade in as camera approaches, fade out as camera passes them
                    if (dist > 1 && dist < 12) {
                        op = 1 - Math.abs(dist - 6) / 5;
                    }
                    node.sprite.material.opacity = THREE.MathUtils.clamp(op, 0, 0.8);

                    if (absDist < 5) {
                        indicatorOp = 1 - (absDist / 5);
                    }

                    // Transit central typography zooms out of blur
                    if (absDist < 6) {
                        const peek = 1 - (absDist / 6);
                        centralOp = peek * 0.15; // Subtle for transit cities
                        centralBlur = (1 - peek) * 20;
                        centralScale = 0.5 + (peek * 0.5);
                    }
                }

                if (indicatorOp > maxIndicatorOp) {
                    maxIndicatorOp = indicatorOp;
                    activeCity = node;
                }

                if (centralOp > targetCentralOp) {
                    targetCentralOp = centralOp;
                    targetCentralBlur = centralBlur;
                    targetCentralScale = centralScale;
                }
            });

            // ─── System Synchronization Logic ───
            if (syncRef.current && !syncTriggered) {
                syncTriggered = true;
                syncStartTime = elapsed;

                originalBuildings.forEach(b => {
                    b.material = b.material.clone();
                    b.material.wireframe = true;
                });

                if (indicatorNodeRef.current) indicatorNodeRef.current.style.opacity = 1;
            }

            if (syncTriggered) {
                const t = elapsed - syncStartTime;
                burstUniforms.uTime.value = t;

                // Emissive Spike on Central Product (Traversing the group)
                if (t < 0.5) {
                    const intensity = 4.0 * (1.0 - (t * 2.0));
                    product.traverse((node) => {
                        if (node.isMesh && node.material && 'emissiveIntensity' in node.material) {
                            node.material.emissiveIntensity = intensity;
                            if (intensity > 0 && node.material.emissive.getHex() === 0x000000) {
                                node.material.emissive.setHex(0xE63946); // Fallback to red pulse if none set
                            }
                        }
                    });
                } else {
                    product.traverse((node) => {
                        if (node.isMesh && node.material && 'emissiveIntensity' in node.material) {
                            node.material.emissiveIntensity = 0.0;
                        }
                    });
                }

                if (t < 1.0) {
                    originalBuildings.forEach(b => {
                        b.material.emissiveIntensity = Math.random() * 3;
                        if (Math.random() > 0.8) b.material.emissive.setHex(Math.random() > 0.5 ? 0xffffff : 0x00ffff);
                    });

                    if (indicatorCoordsRef.current) {
                        indicatorCoordsRef.current.innerText = `SYNCING WITH ${syncedCityRef.current}... ${(t * 100).toFixed(0)}%`;
                        indicatorNameRef.current.innerText = 'AWAKENING SYSTEM';
                    }
                } else if (t >= 1.0 && t < 1.1) {
                    if (indicatorCoordsRef.current) {
                        indicatorNameRef.current.innerText = `LOCATION: ${syncedCityRef.current} / STABLE`;
                        indicatorCoordsRef.current.innerText = 'SYS_NODE: ONLINE';
                    }
                    originalBuildings.forEach(b => {
                        b.material.wireframe = false;
                        b.material.metalness = 0.9;
                        b.material.emissive.setHex(0x113333);
                        b.material.emissiveIntensity = 0.8;
                    });
                }
            } else {
                // Regular HUD update synchronously
                if (indicatorNodeRef.current && indicatorNameRef.current && indicatorCoordsRef.current) {
                    const cl = THREE.MathUtils.clamp(maxIndicatorOp, 0, 1);
                    indicatorNodeRef.current.style.opacity = cl.toFixed(2);

                    if (indicatorNameRef.current.innerText !== `LOCATION: ${activeCity.name}` && cl > 0) {
                        indicatorNameRef.current.innerText = `LOCATION: ${activeCity.name}`;
                        indicatorCoordsRef.current.innerText = activeCity.coords;
                    }
                }
            }

            // Update Central Immersive Typography synchronously
            if (centralScaleRef.current && centralTextRef.current) {
                centralScaleRef.current.style.opacity = targetCentralOp.toFixed(3);
                centralScaleRef.current.style.filter = `blur(${targetCentralBlur.toFixed(1)}px)`;
                centralScaleRef.current.style.transform = `scale(${targetCentralScale.toFixed(3)})`;

                if (centralTextRef.current.innerText !== activeCity.name) {
                    centralTextRef.current.innerText = activeCity.name;
                }
            }

            // Ambient movement
            particles.rotation.y = elapsed * 0.02;
            cityGroup.rotation.y = Math.sin(elapsed * 0.05) * 0.02;

            renderer.render(scene, camera);
        }

        animate();
        sceneRef.current = { renderer, scene, camera, animationId };

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onResize);
            
            // Interaction Cleanups
            wrapperEl.removeEventListener('mousedown', onPointerDown);
            wrapperEl.removeEventListener('mousemove', onPointerMove);
            window.removeEventListener('mouseup', onPointerUp);
            wrapperEl.removeEventListener('mouseleave', onPointerUp);
            wrapperEl.removeEventListener('touchstart', onPointerDown);
            wrapperEl.removeEventListener('touchmove', onPointerMove);
            window.removeEventListener('touchend', onPointerUp);

            if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
                containerRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
            searchLightGeo.dispose();
            searchLightMat.dispose();
        };
    }, []);

    return (
        <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
    );
}
