"use client";

import { RoundedBox } from "@react-three/drei";

export default function Sofa({ position, rotation }: { position: [number, number, number], rotation?: [number, number, number] }) {
    const fabricColor = "#455A64"; // Blue Grey

    return (
        <group position={position} rotation={rotation}>
            {/* Base */}
            <RoundedBox args={[2.2, 0.3, 0.8]} radius={0.05} smoothness={4} position={[0, 0.15, 0]} castShadow>
                <meshPhysicalMaterial
                    color={fabricColor}
                    roughness={0.8}
                    sheen={0.5}
                    sheenColor="#ffffff"
                />
            </RoundedBox>

            {/* Backrest */}
            <RoundedBox args={[2.2, 0.6, 0.2]} radius={0.05} smoothness={4} position={[0, 0.6, -0.3]} castShadow>
                <meshPhysicalMaterial
                    color={fabricColor}
                    roughness={0.8}
                    sheen={0.5}
                />
            </RoundedBox>

            {/* Left Arm */}
            <RoundedBox args={[0.2, 0.5, 0.8]} radius={0.05} smoothness={4} position={[-1, 0.4, 0]} castShadow>
                <meshPhysicalMaterial color={fabricColor} roughness={0.8} sheen={0.5} />
            </RoundedBox>

            {/* Right Arm */}
            <RoundedBox args={[0.2, 0.5, 0.8]} radius={0.05} smoothness={4} position={[1, 0.4, 0]} castShadow>
                <meshPhysicalMaterial color={fabricColor} roughness={0.8} sheen={0.5} />
            </RoundedBox>

            {/* Seat Cushions */}
            <RoundedBox args={[0.9, 0.15, 0.7]} radius={0.02} smoothness={8} position={[-0.5, 0.35, 0.05]} castShadow>
                <meshPhysicalMaterial color={fabricColor} roughness={0.7} sheen={0.3} />
            </RoundedBox>
            <RoundedBox args={[0.9, 0.15, 0.7]} radius={0.02} smoothness={8} position={[0.5, 0.35, 0.05]} castShadow>
                <meshPhysicalMaterial color={fabricColor} roughness={0.7} sheen={0.3} />
            </RoundedBox>

            {/* Legs */}
            {[
                [-1, 0, 0.3], [1, 0, 0.3],
                [-1, 0, -0.3], [1, 0, -0.3]
            ].map((pos, i) => (
                <mesh key={i} position={pos as [number, number, number]}>
                    <cylinderGeometry args={[0.04, 0.03, 0.15]} />
                    <meshStandardMaterial color="#3E2723" />
                </mesh>
            ))}
        </group>
    );
}
