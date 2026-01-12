"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

export default function MagicalParticles() {
    const particlesRef = useRef<THREE.Points>(null);

    // Generate random particle positions
    const particleCount = 400; // Optimized for smooth performance
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 20; // x
        positions[i * 3 + 1] = Math.random() * 10 - 2; // y
        positions[i * 3 + 2] = (Math.random() - 0.5) * 20; // z
    }

    // Animate particles - Optimized to only rotate the group
    useFrame((state) => {
        if (particlesRef.current) {
            particlesRef.current.rotation.y = state.clock.elapsedTime * 0.08;
            particlesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
        }
    });

    return (
        <Points ref={particlesRef} positions={positions} stride={3} frustumCulled={false}>
            <PointMaterial
                transparent
                color="#8b5cf6"
                size={0.05}
                sizeAttenuation={true}
                depthWrite={false}
                opacity={0.6}
            />
        </Points>
    );
}
