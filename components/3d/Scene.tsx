"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, PerspectiveCamera } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { Suspense, lazy } from "react";
import LoadingScreen from "./LoadingScreen";

// Lazy load heavy components
const LuxuryRoom = lazy(() => import("./LuxuryRoom"));
const MagicalParticles = lazy(() => import("./MagicalParticles"));
const CameraController = lazy(() => import("./CameraController"));
const DynamicLighting = lazy(() => import("./DynamicLighting"));
const MagicalPen = lazy(() => import("./MagicalPen"));
const InteractiveBook = lazy(() => import("./InteractiveBook"));

export default function Scene() {

    return (
        <Canvas
            shadows
            className="w-full h-full"
            dpr={[1, 1.5]} // Optimize for performance
            gl={{
                antialias: true,
                alpha: false,
                powerPreference: "high-performance",
                stencil: false,
                depth: true
            }}
            performance={{ min: 0.5 }} // Auto-scale performance
            frameloop="always" // Continuous smooth rendering
        >
            {/* Camera Setup */}
            <PerspectiveCamera makeDefault position={[0, 2, 6]} fov={65} />

            {/* 3D Environment with Lazy Loading */}
            <Suspense fallback={<LoadingScreen />}>
                <CameraController />
                <DynamicLighting />
                <Environment preset="apartment" background={false} />
                <LuxuryRoom />
                <MagicalParticles />
                <MagicalPen />
                <InteractiveBook
                    position={[0, 0.85, 2.2]}
                    rotation={[0, 0, 0]}
                    color="#4A148C"
                />
            </Suspense>


            {/* Window light (optimized) */}
            <directionalLight
                position={[5, 5, -3]}
                intensity={0.3}
                castShadow
                shadow-mapSize-width={512}
                shadow-mapSize-height={512}
                shadow-bias={-0.0001}
            />

            {/* Post Processing Effects - Lighter */}
            <EffectComposer multisampling={0} enableNormalPass={false}>
                <Bloom
                    intensity={0.8}
                    luminanceThreshold={0.3}
                    luminanceSmoothing={0.9}
                    mipmapBlur
                />
                <Vignette
                    offset={0.3}
                    darkness={0.5}
                />
            </EffectComposer>

            {/* Full 360° Controls - Optimized */}
            <OrbitControls
                makeDefault
                enablePan={true}
                enableZoom={true}
                minPolarAngle={0}
                maxPolarAngle={Math.PI}
                minDistance={2}
                maxDistance={12}
                enableDamping
                dampingFactor={0.08}
                rotateSpeed={0.5}
                zoomSpeed={0.8}
            />
        </Canvas>
    );
}
