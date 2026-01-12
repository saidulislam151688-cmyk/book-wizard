"use client";

import { useRef, useState } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import { Mesh } from "three";
import { RoundedBox } from "@react-three/drei";

interface LampProps {
    position: [number, number, number];
}

export default function Lamp({ position }: LampProps) {
    const [isOn, setIsOn] = useState(false);
    const [lightIntensity, setLightIntensity] = useState(0);

    useFrame(() => {
        if (isOn) {
            if (lightIntensity < 1) {
                setLightIntensity(Math.min(lightIntensity + 0.1, 1));
            }
        } else {
            if (lightIntensity > 0) {
                setLightIntensity(Math.max(lightIntensity - 0.1, 0));
            }
        }
    });

    const handleClick = (e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        setIsOn(!isOn);
    };

    return (
        <group position={position}>
            {/* Modern Base */}
            <RoundedBox args={[0.2, 0.05, 0.2]} radius={0.02} smoothness={4} castShadow>
                <meshStandardMaterial color="#212121" metalness={0.8} roughness={0.2} />
            </RoundedBox>

            {/* Stem */}
            <mesh position={[0, 0.3, 0]} castShadow>
                <cylinderGeometry args={[0.02, 0.02, 0.6, 16]} />
                <meshStandardMaterial color="#FFD700" metalness={1} roughness={0.1} />
            </mesh>

            {/* Modern Shade (Hemisphere type) */}
            <group position={[0, 0.6, 0]} onClick={handleClick}>
                <mesh castShadow rotation={[0, 0, 0]}>
                    <sphereGeometry args={[0.2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
                    <meshStandardMaterial color="#212121" metalness={0.5} roughness={0.5} side={2} />
                </mesh>

                {/* Bulb emissive part */}
                <mesh position={[0, -0.05, 0]}>
                    <sphereGeometry args={[0.08, 16, 16]} />
                    <meshStandardMaterial
                        color={isOn ? "#FFC107" : "#424242"}
                        emissive={isOn ? "#FFC107" : "#000000"}
                        emissiveIntensity={lightIntensity * 2}
                    />
                </mesh>
            </group>

            {/* Realistic Warm Light */}
            {isOn && (
                <spotLight
                    position={[0, 0.55, 0]}
                    angle={1}
                    penumbra={0.5}
                    intensity={lightIntensity * 8}
                    color="#FFD700"
                    castShadow
                    shadow-bias={-0.0001}
                />
            )}
        </group>
    );
}
