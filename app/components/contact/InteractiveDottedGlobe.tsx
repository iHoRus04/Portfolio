"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import GlobeLocationMarker from "./GlobeLocationMarker";

// Exact coordinates for Ho Chi Minh City, Vietnam
const HCMC_LAT = 10.8231;
const HCMC_LNG = 106.6297;
const GLOBE_RADIUS = 1.0;
const FIXED_CAMERA_DISTANCE = 3.65; // Ensures the entire globe is 100% visible with comfortable breathing room

// Precise conversion matching globe-points.json generation
function latLongToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const radLat = lat * (Math.PI / 180);
  const radLon = lon * (Math.PI / 180);
  const x = radius * Math.cos(radLat) * Math.sin(radLon);
  const y = radius * Math.sin(radLat);
  const z = radius * Math.cos(radLat) * Math.cos(radLon);
  return new THREE.Vector3(x, y, z);
}

// Generate smooth circular dot sprite for continent points
function createCircleDotTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.clearRect(0, 0, 64, 64);
    ctx.beginPath();
    ctx.arc(32, 32, 28, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  return texture;
}

export default function InteractiveDottedGlobe() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // State for projected 2D screen coordinates of the Ho Chi Minh City marker
  const [markerState, setMarkerState] = useState<{
    x: number;
    y: number;
    isVisible: boolean;
  }>({
    x: 0,
    y: 0,
    isVisible: false,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [webGlSupported, setWebGlSupported] = useState(true);

  // Interaction & Inertia refs (no zoom, pure drag rotation)
  const isPointerDownRef = useRef(false);
  const lastPointerRef = useRef({ x: 0, y: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });
  const lastInteractionTimeRef = useRef(0);

  const resetInteraction = useCallback(() => {
    lastInteractionTimeRef.current = Date.now();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    lastInteractionTimeRef.current = Date.now();

    // Check WebGL availability
    try {
      const gl =
        canvas.getContext("webgl2") ||
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl");
      if (!gl) {
        requestAnimationFrame(() => {
          setWebGlSupported(false);
          setIsLoading(false);
        });
        return;
      }
    } catch {
      requestAnimationFrame(() => {
        setWebGlSupported(false);
        setIsLoading(false);
      });
      return;
    }

    // 1. Scene, Camera & Renderer setup
    const scene = new THREE.Scene();

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0, FIXED_CAMERA_DISTANCE);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    // 2. Sophisticated Studio Lighting (Cohesive Dark Luxury theme)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    keyLight.position.set(-4, 5, 5);
    scene.add(keyLight);

    // Subtle Crimson rim light reflecting portfolio accent
    const fillLight = new THREE.DirectionalLight(0xbc0202, 0.7);
    fillLight.position.set(4, -3, -2);
    scene.add(fillLight);

    // 3. Globe Parent Group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Initial orientation: Southeast Asia (Vietnam / HCMC) facing directly forward
    const initialRotY = -(HCMC_LNG * (Math.PI / 180));
    const initialRotX = 0.16; // Slight natural axial perspective tilt
    globeGroup.rotation.y = initialRotY;
    globeGroup.rotation.x = initialRotX;
    globeGroup.rotation.z = -0.04;

    // 4. Pure Black Core Sphere (#000000 Brand Color)
    const sphereGeometry = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
    const sphereMaterial = new THREE.MeshStandardMaterial({
      color: 0x000000,
      roughness: 0.85,
      metalness: 0.15,
    });
    const coreSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    globeGroup.add(coreSphere);

    // 5. Dotted Continents Point Cloud (Luminous silver dots)
    const dotTexture = createCircleDotTexture();
    let pointsMesh: THREE.Points | null = null;

    const loadPoints = async () => {
      try {
        let positions: Float32Array;

        const binRes = await fetch("/globe-points.bin");
        if (binRes.ok) {
          const buffer = await binRes.arrayBuffer();
          positions = new Float32Array(buffer);
        } else {
          const jsonRes = await fetch("/app/data/globe-points.json");
          const jsonData = await jsonRes.json();
          positions = new Float32Array(jsonData);
        }

        const pointsGeometry = new THREE.BufferGeometry();
        // Slightly float above dark sphere surface (radius = 1.004)
        for (let i = 0; i < positions.length; i += 3) {
          const vx = positions[i];
          const vy = positions[i + 1];
          const vz = positions[i + 2];
          const len = Math.sqrt(vx * vx + vy * vy + vz * vz);
          if (len > 0) {
            positions[i] = (vx / len) * 1.004;
            positions[i + 1] = (vy / len) * 1.004;
            positions[i + 2] = (vz / len) * 1.004;
          }
        }

        pointsGeometry.setAttribute(
          "position",
          new THREE.BufferAttribute(positions, 3),
        );

        const pointsMaterial = new THREE.PointsMaterial({
          map: dotTexture,
          size: 0.024,
          color: 0xe4e4e7, // Crisp luminous silver-white dots
          transparent: true,
          opacity: 0.88,
          alphaTest: 0.02,
          sizeAttenuation: true,
          depthWrite: false,
        });

        pointsMesh = new THREE.Points(pointsGeometry, pointsMaterial);
        globeGroup.add(pointsMesh);
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to load globe points:", err);
        setIsLoading(false);
      }
    };

    loadPoints();

    // 6. Ho Chi Minh City 3D Marker Anchor (Exact geographic position)
    const hcmcPos = latLongToVector3(HCMC_LAT, HCMC_LNG, GLOBE_RADIUS * 1.01);
    const markerAnchor = new THREE.Group();
    markerAnchor.position.copy(hcmcPos);
    globeGroup.add(markerAnchor);

    // Glowing crimson 3D point on the surface (#FF0000)
    const markerDotGeometry = new THREE.SphereGeometry(0.018, 16, 16);
    const markerDotMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const markerDotMesh = new THREE.Mesh(markerDotGeometry, markerDotMaterial);
    markerAnchor.add(markerDotMesh);

    // 7. Touch & Mouse Rotation Events (Zero Zoom Interference)
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      // Do not capture pointer or initiate rotation if interacting with UI elements (links, buttons, popup card)
      if (
        target &&
        (target.closest("a") ||
          target.closest("button") ||
          target.closest(".location-popup-card"))
      ) {
        return;
      }

      isPointerDownRef.current = true;
      lastPointerRef.current = { x: e.clientX, y: e.clientY };
      velocityRef.current = { x: 0, y: 0 };
      resetInteraction();
      try {
        container.setPointerCapture(e.pointerId);
      } catch {
        // Safe ignore
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isPointerDownRef.current) return;
      resetInteraction();

      const deltaX = e.clientX - lastPointerRef.current.x;
      const deltaY = e.clientY - lastPointerRef.current.y;

      const sensitivity = 0.005;
      globeGroup.rotation.y += deltaX * sensitivity;

      const newRotX = globeGroup.rotation.x + deltaY * sensitivity;
      globeGroup.rotation.x = Math.max(-1.15, Math.min(1.15, newRotX));

      velocityRef.current = {
        x: deltaX * 0.0035,
        y: deltaY * 0.0035,
      };

      lastPointerRef.current = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = (e: PointerEvent) => {
      isPointerDownRef.current = false;
      try {
        container.releasePointerCapture(e.pointerId);
      } catch {
        // Safe ignore
      }
    };

    container.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);

    // 8. Resize Observer
    const handleResize = () => {
      const w = container.clientWidth || 500;
      const h = container.clientHeight || 500;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // 9. Animation & Render Loop
    let animId: number;
    const checkReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Handle natural momentum after release
      if (!isPointerDownRef.current) {
        globeGroup.rotation.y += velocityRef.current.x;
        const targetX = globeGroup.rotation.x + velocityRef.current.y;
        globeGroup.rotation.x = Math.max(-1.15, Math.min(1.15, targetX));

        velocityRef.current.x *= 0.94;
        velocityRef.current.y *= 0.94;

        // Auto-rotation after 2.5s idle
        const isIdle = Date.now() - lastInteractionTimeRef.current > 2500;
        if (isIdle && !checkReducedMotion) {
          globeGroup.rotation.y += 0.001;
        }
      }

      renderer.render(scene, camera);

      // Project 3D HCMC position to 2D screen coordinates
      const markerWorldPos = markerAnchor.getWorldPosition(new THREE.Vector3());

      const globeCenter = globeGroup.position;
      const surfaceNormal = markerWorldPos
        .clone()
        .sub(globeCenter)
        .normalize();
      const cameraDir = camera.position
        .clone()
        .sub(globeCenter)
        .normalize();
      const facingRatio = surfaceNormal.dot(cameraDir);
      const isVisible = facingRatio > 0.15;

      const projected = markerWorldPos.clone().project(camera);
      const currentW = container.clientWidth;
      const currentH = container.clientHeight;
      const screenX = (projected.x * 0.5 + 0.5) * currentW;
      const screenY = (-projected.y * 0.5 + 0.5) * currentH;

      setMarkerState({
        x: screenX,
        y: screenY,
        isVisible,
      });
    };

    animate();

    // 10. Clean Cleanup on Unmount
    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();

      container.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);

      sphereGeometry.dispose();
      sphereMaterial.dispose();
      dotTexture.dispose();
      markerDotGeometry.dispose();
      markerDotMaterial.dispose();

      if (pointsMesh) {
        pointsMesh.geometry.dispose();
        (pointsMesh.material as THREE.Material).dispose();
      }

      renderer.dispose();
    };
  }, [resetInteraction]);

  return (
    <div
      ref={containerRef}
      className="relative flex h-[340px] w-full max-w-[560px] mx-auto cursor-grab items-center justify-center overflow-hidden active:cursor-grabbing sm:h-[500px] lg:h-[560px] select-none touch-pan-y"
    >
      {/* Fallback for WebGL unavailable */}
      {!webGlSupported ? (
        <div className="flex flex-col items-center justify-center p-8 text-center text-zinc-500">
          <p className="text-sm font-semibold text-zinc-300">Interactive 3D Globe</p>
          <p className="text-xs">WebGL is not supported on this device/browser.</p>
        </div>
      ) : (
        <>
          {/* Subtle Loading Spinner */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="h-8 w-8 animate-spin rounded-full border-2 border-[#830000]/30 border-t-[#ff0000]" />
            </div>
          )}

          {/* Three.js Canvas */}
          <canvas
            ref={canvasRef}
            className="block h-full w-full outline-none"
          />

          {/* 2D Projection Location Marker for Ho Chi Minh City */}
          <GlobeLocationMarker
            screenX={markerState.x}
            screenY={markerState.y}
            isVisible={markerState.isVisible && !isLoading}
          />

          {/* Minimal Drag Hint */}
          <div className="pointer-events-none absolute bottom-3 right-3 hidden rounded-full border border-white/10 bg-black/60 px-3 py-1 text-[10px] font-mono tracking-wider text-zinc-400 backdrop-blur-md sm:block">
            DRAG TO ROTATE
          </div>
        </>
      )}
    </div>
  );
}
