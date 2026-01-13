"use client";

import { useRef, useState } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import { Mesh } from "three";

interface CandleProps {
    position: [number, number, number];
}

export default function Candle({ position }: CandleProps) {
    const flameRef = useRef<Mesh>(null);
    const [isLit, setIsLit] = useState(false);
    const [flameIntensity, setFlameIntensity] = useState(0);

    // Flame animation
    useFrame((state) => {
        if (isLit) {
            if (flameIntensity < 1) {
                setFlameIntensity(Math.min(flameIntensity + 0.05, 1));
            }

            if (flameRef.current) {
                // Flickering effect
                const flicker = Math.sin(state.clock.elapsedTime * 10) * 0.1 + 0.9;
                flameRef.current.scale.set(1, 1 + Math.sin(state.clock.elapsedTime * 5) * 0.2, 1);
                (flameRef.current.material as any).emissiveIntensity = flicker * flameIntensity * 2;
            }
        } else {
            if (flameIntensity > 0) {
                setFlameIntensity(Math.max(flameIntensity - 0.1, 0));
            }
        }
    });

    const handleClick = (e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        setIsLit(!isLit);
    };

    return (
        <group position={position}>
            {/* Candle body */}
            <mesh castShadow onClick={handleClick}>
                <cylinderGeometry args={[0.08, 0.1, 0.4, 16]} />
                <meshStandardMaterial
                    color="#f5e6d3"
                    roughness={0.8}
                />
            </mesh>

            {/* Candle top */}
            <mesh position={[0, 0.2, 0]}>
                <cylinderGeometry args={[0.08, 0.08, 0.02, 16]} />
                <meshStandardMaterial
                    color="#fff9e6"
                    roughness={0.6}
                />
            </mesh>

            {/* Wick */}
            <mesh position={[0, 0.25, 0]}>
                <cylinderGeometry args={[0.01, 0.01, 0.1, 8]} />
                <meshStandardMaterial color="#2c2c2c" />
            </mesh>

            {/* Flame (only visible when lit) */}
            {isLit && (
                <>
                    <mesh
                        ref={flameRef}
                        position={[0, 0.35, 0]}
                    >
                        <sphereGeometry args={[0.08, 16, 16]} />
                        <meshStandardMaterial
                            color="#ff6b00"
                            emissive="#ff6b00"
                            emissiveIntensity={2}
                            transparent
                            opacity={0.9}
                        />
                    </mesh>

                    {/* Flame glow */}
                    <mesh position={[0, 0.35, 0]}>
                        <sphereGeometry args={[0.12, 16, 16]} />
                        <meshStandardMaterial
                            color="#ffaa00"
                            emissive="#ffaa00"
                            emissiveIntensity={1}
                            transparent
                            opacity={0.3}
                        />
                    </mesh>
                </>
            )}

            {/* Point light from flame */}
            {isLit && (
                <pointLight
                    position={[0, 0.35, 0]}
                    color="#ff8844"
                    intensity={flameIntensity * 3}
                    distance={5}
                    castShadow
                />
            )}
        </group>
    );
}
