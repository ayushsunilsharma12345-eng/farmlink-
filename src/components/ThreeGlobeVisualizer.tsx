import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { CityHub, RouteOption } from '../types';
import { Compass, RotateCw, ZoomIn, ZoomOut, Eye, Sparkles, Navigation, Layers } from 'lucide-react';

interface ThreeGlobeVisualizerProps {
  selectedRoute: RouteOption | null;
  origin: CityHub;
  destination: CityHub;
  allHubs: CityHub[];
  onSelectHub?: (hub: CityHub) => void;
}

export const ThreeGlobeVisualizer: React.FC<ThreeGlobeVisualizerProps> = ({
  selectedRoute,
  origin,
  destination,
  allHubs,
  onSelectHub,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const globeGroupRef = useRef<THREE.Group | null>(null);
  const arcGroupRef = useRef<THREE.Group | null>(null);
  const particleGroupRef = useRef<THREE.Group | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [cameraView, setCameraView] = useState<'focused' | 'global' | 'night'>('focused');
  const [altitudeMode, setAltitudeMode] = useState<boolean>(true);
  const [fps, setFps] = useState<number>(60);

  // Lat/Lng to Vector3 on sphere of radius R
  const latLngToVector3 = (lat: number, lng: number, radius: number): THREE.Vector3 => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    return new THREE.Vector3(x, y, z);
  };

  // Generate an procedural canvas texture for earth with continents & lat-long grid
  const createEarthTexture = (): THREE.CanvasTexture => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Deep ocean navy base
    ctx.fillStyle = '#0a1329';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Latitude & longitude grid lines
    ctx.strokeStyle = 'rgba(30, 64, 115, 0.35)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= canvas.width; x += 64) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Continents & Landmasses approximation using geometric paths for sleek tech aesthetic
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;

    // North America
    ctx.beginPath();
    ctx.ellipse(280, 160, 140, 80, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // South America
    ctx.beginPath();
    ctx.ellipse(360, 340, 70, 110, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Europe
    ctx.beginPath();
    ctx.ellipse(530, 140, 65, 55, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Africa
    ctx.beginPath();
    ctx.ellipse(540, 270, 85, 110, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Asia
    ctx.beginPath();
    ctx.ellipse(750, 180, 160, 100, 0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Australia
    ctx.beginPath();
    ctx.ellipse(870, 360, 65, 45, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // City glow clusters
    ctx.fillStyle = '#38bdf8';
    const cityCoords = [
      [280, 160], [240, 150], [530, 130], [550, 150], [740, 210],
      [820, 160], [810, 260], [360, 340], [540, 260], [870, 360],
    ];
    cityCoords.forEach(([cx, cy]) => {
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight || 460;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 5, 24);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    containerRef.current.replaceChildren(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    dirLight.position.set(15, 10, 20);
    scene.add(dirLight);

    const backLight = new THREE.DirectionalLight(0x6366f1, 0.6);
    backLight.position.set(-15, -10, -10);
    scene.add(backLight);

    // Globe Group
    const globeGroup = new THREE.Group();
    globeGroupRef.current = globeGroup;
    scene.add(globeGroup);

    // Main Sphere
    const radius = 7.5;
    const sphereGeo = new THREE.SphereGeometry(radius, 64, 64);
    const texture = createEarthTexture();
    const sphereMat = new THREE.MeshPhongMaterial({
      map: texture,
      shininess: 25,
      specular: new THREE.Color(0x0284c7),
      emissive: new THREE.Color(0x030712),
    });
    const earthMesh = new THREE.Mesh(sphereGeo, sphereMat);
    globeGroup.add(earthMesh);

    // Atmosphere Outer Glow
    const atmosphereGeo = new THREE.SphereGeometry(radius * 1.035, 32, 32);
    const atmosphereMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.12,
      side: THREE.BackSide,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    globeGroup.add(atmosphereMesh);

    // Starfield background
    const starsGeo = new THREE.BufferGeometry();
    const starCount = 600;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 120;
      starPositions[i + 1] = (Math.random() - 0.5) * 120;
      starPositions[i + 2] = (Math.random() - 0.5) * 120;
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0x94a3b8,
      size: 0.6,
      transparent: true,
      opacity: 0.7,
    });
    const starField = new THREE.Points(starsGeo, starMat);
    scene.add(starField);

    // Arc Group for routes
    const arcGroup = new THREE.Group();
    arcGroupRef.current = arcGroup;
    globeGroup.add(arcGroup);

    // Particle Group for moving transport indicators
    const particleGroup = new THREE.Group();
    particleGroupRef.current = particleGroup;
    globeGroup.add(particleGroup);

    // City markers on globe
    allHubs.forEach((hub) => {
      const pos = latLngToVector3(hub.coordinates.lat, hub.coordinates.lng, radius * 1.01);
      const isSelected = hub.id === origin.id || hub.id === destination.id;

      // Outer ring
      const ringGeo = new THREE.RingGeometry(0.12, 0.22, 16);
      const ringMat = new THREE.MeshBasicMaterial({
        color: isSelected ? 0x10b981 : 0x38bdf8,
        side: THREE.DoubleSide,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.copy(pos);
      ringMesh.lookAt(new THREE.Vector3(0, 0, 0));
      globeGroup.add(ringMesh);

      // Center sphere pin
      const pinGeo = new THREE.SphereGeometry(isSelected ? 0.18 : 0.1, 12, 12);
      const pinMat = new THREE.MeshBasicMaterial({
        color: isSelected ? (hub.id === origin.id ? 0x10b981 : 0xf59e0b) : 0x60a5fa,
      });
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      pinMesh.position.copy(pos);
      globeGroup.add(pinMesh);
    });

    // Mouse drag interaction
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !globeGroupRef.current) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      globeGroupRef.current.rotation.y += deltaX * 0.005;
      globeGroupRef.current.rotation.x += deltaY * 0.005;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Resize observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newW = entry.contentRect.width;
        const newH = entry.contentRect.height || 460;
        if (newW > 0 && newH > 0 && cameraRef.current && rendererRef.current) {
          cameraRef.current.aspect = newW / newH;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(newW, newH);
        }
      }
    });
    resizeObserver.observe(containerRef.current);

    // Animation loop
    let lastTime = performance.now();
    let frameCount = 0;
    let fpsTimer = performance.now();

    const animate = (time: number) => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      // Auto rotation
      if (globeGroupRef.current && isRotating && !isDragging) {
        globeGroupRef.current.rotation.y += 0.002;
      }

      // Measure FPS
      frameCount++;
      if (time - fpsTimer > 1000) {
        setFps(Math.round((frameCount * 1000) / (time - fpsTimer)));
        frameCount = 0;
        fpsTimer = time;
      }

      // Animate active traveling beacons along trajectory
      if (particleGroupRef.current) {
        particleGroupRef.current.children.forEach((child) => {
          const userData = child.userData as { curve?: THREE.QuadraticBezierCurve3; progress?: number; speed?: number };
          if (userData.curve) {
            userData.progress = ((userData.progress || 0) + (userData.speed || 0.006)) % 1;
            const newPos = userData.curve.getPoint(userData.progress);
            child.position.copy(newPos);
          }
        });
      }

      renderer.render(scene, camera);
    };

    animFrameIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      resizeObserver.disconnect();
      renderer.dispose();
    };
  }, [allHubs]);

  // Update Route Curve & Flying Beacon when selected route, origin or destination changes
  useEffect(() => {
    if (!arcGroupRef.current || !particleGroupRef.current) return;

    // Clear existing arcs and beacons
    while (arcGroupRef.current.children.length > 0) {
      const obj = arcGroupRef.current.children[0];
      arcGroupRef.current.remove(obj);
    }
    while (particleGroupRef.current.children.length > 0) {
      const obj = particleGroupRef.current.children[0];
      particleGroupRef.current.remove(obj);
    }

    const radius = 7.5;
    const vOrigin = latLngToVector3(origin.coordinates.lat, origin.coordinates.lng, radius * 1.01);
    const vDest = latLngToVector3(destination.coordinates.lat, destination.coordinates.lng, radius * 1.01);

    // Calculate middle control point elevated in space for arc
    const vMid = new THREE.Vector3().addVectors(vOrigin, vDest).multiplyScalar(0.5);
    const dist = vOrigin.distanceTo(vDest);
    const arcHeight = Math.min(dist * 0.45, 4.2);
    vMid.normalize().multiplyScalar(radius + arcHeight);

    const curve = new THREE.QuadraticBezierCurve3(vOrigin, vMid, vDest);
    const points = curve.getPoints(64);
    const curveGeo = new THREE.BufferGeometry().setFromPoints(points);

    const mode = selectedRoute?.mode || 'flight';
    const arcColor =
      mode === 'flight'
        ? 0x38bdf8 // Sky Blue
        : mode === 'train'
        ? 0x10b981 // Emerald
        : mode === 'multimodal'
        ? 0xa855f7 // Purple
        : mode === 'bus'
        ? 0xf59e0b // Amber
        : 0x06b6d4; // Cyan

    const arcMat = new THREE.LineBasicMaterial({
      color: arcColor,
      linewidth: 3,
      transparent: true,
      opacity: 0.85,
    });
    const arcLine = new THREE.Line(curveGeo, arcMat);
    arcGroupRef.current.add(arcLine);

    // Moving Vehicle / Beacon on the arc
    const beaconGeo = new THREE.SphereGeometry(0.22, 16, 16);
    const beaconMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
    });
    const beaconMesh = new THREE.Mesh(beaconGeo, beaconMat);
    beaconMesh.userData = {
      curve,
      progress: 0,
      speed: mode === 'flight' ? 0.008 : mode === 'train' ? 0.006 : 0.004,
    };
    particleGroupRef.current.add(beaconMesh);

    // Second pulsing glow beacon
    const glowGeo = new THREE.SphereGeometry(0.42, 12, 12);
    const glowMat = new THREE.MeshBasicMaterial({
      color: arcColor,
      transparent: true,
      opacity: 0.45,
    });
    const glowMesh = new THREE.Mesh(glowGeo, glowMat);
    glowMesh.userData = {
      curve,
      progress: 0,
      speed: mode === 'flight' ? 0.008 : mode === 'train' ? 0.006 : 0.004,
    };
    particleGroupRef.current.add(glowMesh);

    // Rotate globe to center on origin/destination midpoint
    if (globeGroupRef.current) {
      const midLat = (origin.coordinates.lat + destination.coordinates.lat) / 2;
      const midLng = (origin.coordinates.lng + destination.coordinates.lng) / 2;
      globeGroupRef.current.rotation.y = -((midLng + 180) * (Math.PI / 180)) + Math.PI / 2;
      globeGroupRef.current.rotation.x = (midLat * (Math.PI / 180)) * 0.5;
    }
  }, [selectedRoute, origin, destination]);

  const handleZoom = (delta: number) => {
    if (!cameraRef.current) return;
    const currentZ = cameraRef.current.position.z;
    cameraRef.current.position.z = Math.min(Math.max(currentZ + delta, 12), 38);
  };

  const resetCamera = () => {
    if (!cameraRef.current || !globeGroupRef.current) return;
    cameraRef.current.position.set(0, 5, 24);
    cameraRef.current.lookAt(0, 0, 0);
    globeGroupRef.current.rotation.set(0.1, 0, 0);
  };

  return (
    <div id="threejs-globe-card" className="relative w-full h-[460px] rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl flex flex-col">
      {/* Top HUD Bar */}
      <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between pointer-events-none gap-2">
        <div className="flex items-center space-x-2 bg-slate-900/85 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-700/60 pointer-events-auto">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 -ml-5" />
          <span className="text-xs font-semibold text-slate-200 tracking-wide uppercase">
            3D Route Spatial Visualizer (Three.js)
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-sky-400 border border-slate-700">
            {fps} FPS
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-1.5 pointer-events-auto bg-slate-900/85 backdrop-blur-md p-1 rounded-xl border border-slate-700/60">
          <button
            id="btn-toggle-rotation"
            onClick={() => setIsRotating(!isRotating)}
            className={`p-2 rounded-lg text-xs font-medium transition-colors ${
              isRotating ? 'bg-indigo-600/70 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title="Toggle Earth Auto-Rotation"
          >
            <RotateCw className={`w-4 h-4 ${isRotating ? 'animate-spin' : ''}`} />
          </button>
          <button
            id="btn-zoom-in"
            onClick={() => handleZoom(-3)}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            id="btn-zoom-out"
            onClick={() => handleZoom(3)}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            id="btn-reset-cam"
            onClick={resetCamera}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="Reset Camera Angle"
          >
            <Compass className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* WebGL Canvas Container */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Bottom Route Telemetry Overlay */}
      <div className="absolute bottom-3 left-3 right-3 z-10 pointer-events-none flex flex-wrap items-center justify-between gap-2">
        <div className="bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-800 pointer-events-auto flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-slate-300 font-medium">{origin.code} ({origin.city})</span>
          </div>
          <span className="text-slate-500">→</span>
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-slate-300 font-medium">{destination.code} ({destination.city})</span>
          </div>
          <span className="text-slate-600">|</span>
          <span className="text-sky-400 font-mono">
            {selectedRoute ? `${selectedRoute.durationMinutes} min • $${selectedRoute.priceUSD} • ${selectedRoute.co2Kg}kg CO₂` : 'Calculating Bézier trajectory...'}
          </span>
        </div>

        <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 pointer-events-auto text-[11px] text-slate-400 flex items-center space-x-2">
          <span>Click & Drag to rotate • Scroll to zoom</span>
        </div>
      </div>
    </div>
  );
};
