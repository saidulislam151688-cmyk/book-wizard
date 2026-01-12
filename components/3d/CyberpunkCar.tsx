"use client";

import { RoundedBox } from "@react-three/drei";

export default function CyberpunkCar({ position, rotation }: { position: [number, number, number], rotation?: [number, number, number] }) {
    // Reference: Black supercar, Orange Glowing Wheels, Aggressive Orange Body Lines
    const neonColor = "#FF3D00"; // Deep Orange/Red
    const bodyColor = "#080808"; // Almost pure black

    return (
        <group position={position} rotation={rotation}>

            {/* Main Body Chassis */}
            <group position={[0, 0.45, 0]}>
                {/* Central Body - Extremely Low Profile */}
                <RoundedBox args={[2.1, 0.5, 4.6]} radius={0.15} smoothness={8} position={[0, 0, 0]} castShadow>
                    <meshPhysicalMaterial
                        color={bodyColor}
                        roughness={0.2}
                        metalness={0.9}
                        clearcoat={1}
                        clearcoatRoughness={0.1}
                    />
                </RoundedBox>

                {/* Cabin - Bubble Canopy style */}
                <mesh position={[0, 0.4, -0.1]}>
                    <sphereGeometry args={[0.9, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.4]} />
                    <meshPhysicalMaterial color="#000" roughness={0} metalness={1} />
                </mesh>

                {/* Side Vents / Intakes - The "Hook" shape from image */}
                {/* Left Side Glow */}
                <group position={[-1.02, 0, 0.5]}>
                    <mesh rotation={[0, 0, 0]}>
                        {/* L-Shape light strip */}
                        <boxGeometry args={[0.05, 0.1, 2.5]} />
                        <meshStandardMaterial color={neonColor} emissive={neonColor} emissiveIntensity={4} toneMapped={false} />
                    </mesh>
                    <mesh position={[0, 0.2, -1.2]} rotation={[Math.PI / 4, 0, 0]}>
                        <boxGeometry args={[0.05, 0.1, 0.5]} />
                        <meshStandardMaterial color={neonColor} emissive={neonColor} emissiveIntensity={4} toneMapped={false} />
                    </mesh>
                </group>

                {/* Right Side Glow */}
                <group position={[1.02, 0, 0.5]}>
                    <mesh rotation={[0, 0, 0]}>
                        <boxGeometry args={[0.05, 0.1, 2.5]} />
                        <meshStandardMaterial color={neonColor} emissive={neonColor} emissiveIntensity={4} toneMapped={false} />
                    </mesh>
                    <mesh position={[0, 0.2, -1.2]} rotation={[Math.PI / 4, 0, 0]}>
                        <boxGeometry args={[0.05, 0.1, 0.5]} />
                        <meshStandardMaterial color={neonColor} emissive={neonColor} emissiveIntensity={4} toneMapped={false} />
                    </mesh>
                </group>

                {/* Front "Mean" Eyes/Headlights - Angled Orange Lines */}
                <mesh position={[0.7, -0.1, 2.35]} rotation={[0, 0.4, 0]}>
                    <boxGeometry args={[0.6, 0.05, 0.1]} />
                    <meshStandardMaterial color={neonColor} emissive={neonColor} emissiveIntensity={5} toneMapped={false} />
                </mesh>
                <mesh position={[-0.7, -0.1, 2.35]} rotation={[0, -0.4, 0]}>
                    <boxGeometry args={[0.6, 0.05, 0.1]} />
                    <meshStandardMaterial color={neonColor} emissive={neonColor} emissiveIntensity={5} toneMapped={false} />
                </mesh>

                {/* Rear Diffuser Area/Tail lights */}
                <mesh position={[0, 0.1, -2.35]}>
                    <boxGeometry args={[2.0, 0.05, 0.1]} />
                    <meshStandardMaterial color={neonColor} emissive={neonColor} emissiveIntensity={5} toneMapped={false} />
                </mesh>
            </group>

            {/* Glowing Wheels */}
            <GlowingWheel position={[1.15, 0.35, 1.3]} color={neonColor} />
            <GlowingWheel position={[-1.15, 0.35, 1.3]} color={neonColor} />
            <GlowingWheel position={[1.15, 0.4, -1.3]} size={0.48} color={neonColor} />
            <GlowingWheel position={[-1.15, 0.4, -1.3]} size={0.48} color={neonColor} />

            {/* Spoiler - Large Wing */}
            <group position={[0, 0.95, -2.1]}>
                <mesh position={[0, 0.2, 0]}>
                    <boxGeometry args={[2.3, 0.05, 0.5]} />
                    <meshPhysicalMaterial color={bodyColor} metalness={0.8} />
                </mesh>
                {/* Wing Supports */}
                <mesh position={[-0.6, -0.2, 0]} rotation={[0.2, 0, 0]}>
                    <boxGeometry args={[0.1, 0.5, 0.2]} />
                    <meshStandardMaterial color={bodyColor} />
                </mesh>
                <mesh position={[0.6, -0.2, 0]} rotation={[0.2, 0, 0]}>
                    <boxGeometry args={[0.1, 0.5, 0.2]} />
                    <meshStandardMaterial color={bodyColor} />
                </mesh>
            </group>

        </group>
    );
}

function GlowingWheel({ position, size = 0.35, color }: { position: [number, number, number], size?: number, color: string }) {
    return (
        <group position={position} rotation={[0, 0, Math.PI / 2]}>
            {/* Tire Tread */}
            <mesh castShadow>
                <cylinderGeometry args={[size, size, 0.35, 32]} />
                <meshStandardMaterial color="#050505" roughness={0.9} />
            </mesh>

            {/* The GLOWING Rim (The main feature from the image) */}
            <group position={[0, 0.18, 0]}>
                {/* Outer Ring Glow */}
                <mesh>
                    <ringGeometry args={[size * 0.7, size * 0.8, 32]} />
                    <meshStandardMaterial color={color} emissive={color} emissiveIntensity={4} toneMapped={false} side={2} />
                </mesh>

                {/* 5 Spoke Star Glow */}
                {[0, 72, 144, 216, 288].map((angle, i) => (
                    <mesh key={i} rotation={[0, 0, (angle * Math.PI) / 180]} position={[0, 0, -0.01]}>
                        <planeGeometry args={[0.06, size * 0.7]} />
                        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={4} toneMapped={false} />
                    </mesh>
                ))}

                {/* Inner Hub */}
                <mesh position={[0, 0, 0.01]}>
                    <circleGeometry args={[size * 0.2, 16]} />
                    <meshStandardMaterial color="#000" />
                </mesh>
            </group>
        </group>
    )
}
