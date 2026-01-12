"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Sphere, Trail } from "@react-three/drei";
import * as THREE from "three";
import { useWizardStore } from "@/lib/wizard-store";

export default function MagicalPen() {
    const meshRef = useRef<THREE.Group>(null);
    const { isWriting, tempInput } = useWizardStore();

    // Writing animation state
    const animationState = useRef({
        time: 0,
        x: 0,
        y: 0,
        z: 0
    });

    useFrame((state) => {
        if (!meshRef.current) return;

        if (isWriting) {
            // Simulate writing movement
            const t = state.clock.elapsedTime * 8;
            animationState.current.x = Math.sin(t) * 0.1;
            animationState.current.y = Math.cos(t * 0.5) * 0.05;

            // Move pen to a "writing position" near the book
            // Assuming book is at [0, 1.5, 4] for hero shot
            meshRef.current.position.set(
                0.3 + animationState.current.x,
                1.5 + animationState.current.y,
                4.05
            );
            meshRef.current.rotation.z = Math.sin(t) * 0.2;
            meshRef.current.visible = true;
        } else {
            meshRef.current.visible = false;
        }
    });

    return (
        <group ref={meshRef}>
            <Float speed={5} rotationIntensity={0.5} floatIntensity={0.5}>
                {/* Pen Body (Quill style) */}
                <mesh rotation={[Math.PI / 4, 0, 0]}>
                    <cylinderGeometry args={[0.01, 0.002, 0.4, 8]} />
                    <meshStandardMaterial color="#2c3e50" metalness={0.8} roughness={0.2} />
                </mesh>

                {/* Feather part */}
                <mesh position={[0, 0.2, 0]} rotation={[0, 0, 0.2]}>
                    <boxGeometry args={[0.05, 0.25, 0.005]} />
                    <meshStandardMaterial color="#ecf0f1" transparent opacity={0.8} />
                </mesh>

                {/* Magical Glow */}
                <Sphere args={[0.02, 16, 16]} position={[0, -0.2, 0]}>
                    <meshStandardMaterial
                        color="#a29bfe"
                        emissive="#a29bfe"
                        emissiveIntensity={2}
                        transparent
                        opacity={0.6}
                    />
                </Sphere>

                {/* Magic Ink Trail */}
                <Trail
                    width={0.5}
                    length={3}
                    color="#a29bfe"
                    attenuation={(t) => t * t}
                >
                    <Sphere args={[0.005]} />
                </Trail>
            </Float>
        </group>
    );
}
