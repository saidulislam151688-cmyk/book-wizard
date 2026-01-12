"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Group } from "three";
import { RoundedBox } from "@react-three/drei";

export default function FishTank({ position, rotation }: { position: [number, number, number], rotation?: [number, number, number] }) {
    return (
        <group position={position} rotation={rotation}>
            {/* Tank Stand/Table */}
            <mesh position={[0, -0.6, 0]} castShadow>
                <boxGeometry args={[2.5, 1.2, 1.2]} />
                <meshStandardMaterial color="#263238" roughness={0.2} />
            </mesh>

            {/* Glass Tank */}
            <RoundedBox args={[2.4, 1, 1]} radius={0.02} smoothness={4} position={[0, 0.5, 0]}>
                <meshPhysicalMaterial
                    color="#E1F5FE"
                    transmission={0.9}
                    opacity={0.3}
                    transparent
                    roughness={0}
                    ior={1.5}
                    thickness={0.1}
                />
            </RoundedBox>

            {/* Water */}
            <mesh position={[0, 0.45, 0]}>
                <boxGeometry args={[2.3, 0.9, 0.9]} />
                <meshPhysicalMaterial
                    color="#039BE5"
                    transmission={0.6}
                    opacity={0.4}
                    transparent
                    roughness={0.1}
                />
            </mesh>

            {/* Sand/Gravel */}
            <mesh position={[0, 0.05, 0]}>
                <boxGeometry args={[2.3, 0.1, 0.9]} />
                <meshStandardMaterial color="#E0C097" roughness={0.8} />
            </mesh>

            {/* Decorations */}
            <mesh position={[-0.5, 0.2, -0.2]}>
                <coneGeometry args={[0.1, 0.4, 8]} />
                <meshStandardMaterial color="#2E7D32" />
            </mesh>
            <mesh position={[0.6, 0.15, 0.3]}>
                <dodecahedronGeometry args={[0.15]} />
                <meshStandardMaterial color="#795548" />
            </mesh>

            {/* Fish */}
            <Fish startPos={[0, 0.5, 0]} color="#FF5722" speed={1} />
            <Fish startPos={[0.5, 0.7, 0.3]} color="#FFEB3B" speed={0.8} />
            <Fish startPos={[-0.5, 0.3, -0.2]} color="#03A9F4" speed={1.2} />
            <Fish startPos={[0.2, 0.6, -0.3]} color="#E91E63" speed={0.9} />
            <Fish startPos={[-0.3, 0.4, 0.2]} color="#FF9800" speed={1.1} />
        </group>
    );
}

function Fish({ startPos, color, speed }: { startPos: [number, number, number], color: string, speed: number }) {
    const fishRef = useRef<Group>(null);
    const timeOffset = Math.random() * 100;

    useFrame((state) => {
        if (fishRef.current) {
            const time = state.clock.elapsedTime * speed + timeOffset;
            // Swim in figure 8 pattern
            fishRef.current.position.x = startPos[0] + Math.sin(time) * 0.8;
            fishRef.current.position.z = startPos[2] + Math.cos(time * 0.5) * 0.3;
            fishRef.current.position.y = startPos[1] + Math.sin(time * 2) * 0.05;

            // Rotate to face direction
            fishRef.current.rotation.y = Math.cos(time) + Math.PI / 2;

            // Wiggle tail
            const tail = fishRef.current.children[1];
            if (tail) {
                tail.rotation.y = Math.sin(time * 15) * 0.5;
            }
        }
    });

    return (
        <group ref={fishRef} position={startPos}>
            {/* Body */}
            <mesh>
                <capsuleGeometry args={[0.04, 0.1, 4, 8]} />
                <meshStandardMaterial color={color} />
            </mesh>
            {/* Tail */}
            <mesh position={[-0.08, 0, 0]}> // Tail at back
                <coneGeometry args={[0.03, 0.08, 4]} />
                <meshStandardMaterial color={color} />
            </mesh>
        </group>
    );
}
