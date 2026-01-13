"use client";

import InteractiveBook from "./InteractiveBook";
import Candle from "./Candle";

export default function LibraryTable() {
    return (
        <group>
            {/* Floor - Dark wood */}
            <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
                <planeGeometry args={[30, 30]} />
                <meshStandardMaterial
                    color="#1a1410"
                    roughness={0.9}
                    metalness={0.1}
                />
            </mesh>

            {/* Table Surface - Rich wood texture */}
            <mesh castShadow receiveShadow position={[0, 0, 0]}>
                <boxGeometry args={[5, 0.15, 3]} />
                <meshStandardMaterial
                    color="#3d2817"
                    roughness={0.6}
                    metalness={0.2}
                />
            </mesh>

            {/* Table legs */}
            {[
                [-2.3, -0.5, 1.3],
                [2.3, -0.5, 1.3],
                [-2.3, -0.5, -1.3],
                [2.3, -0.5, -1.3],
            ].map((pos, i) => (
                <mesh key={i} castShadow position={pos as [number, number, number]}>
                    <cylinderGeometry args={[0.1, 0.12, 1, 16]} />
                    <meshStandardMaterial
                        color="#2d1f14"
                        roughness={0.7}
                    />
                </mesh>
            ))}

            {/* Books on table - Multiple books */}
            <InteractiveBook
                position={[-1.5, 0.15, 0]}
                rotation={[0, 0.3, 0]}
                color="#8b4513"
                title="Mystery Tales"
            />

            <InteractiveBook
                position={[-0.5, 0.15, 0.5]}
                rotation={[0, -0.2, 0]}
                color="#2c5f2d"
                title="Nature Guide"
            />

            <InteractiveBook
                position={[0.5, 0.15, -0.3]}
                rotation={[0, 0.8, 0]}
                color="#4a4a8a"
                title="Magic Secrets"
            />

            <InteractiveBook
                position={[1.4, 0.15, 0.2]}
                rotation={[0, -0.5, 0]}
                color="#8b0000"
                title="Ancient Wisdom"
            />

            <InteractiveBook
                position={[-0.2, 0.23, -0.8]}
                rotation={[0, 0.1, 0]}
                color="#4b0082"
                title="Spellbook"
            />

            {/* Stack of books */}
            <group position={[1.8, 0.15, -0.8]}>
                <InteractiveBook
                    position={[0, 0, 0]}
                    rotation={[0, 0.4, 0]}
                    color="#654321"
                    title="History"
                />
                <InteractiveBook
                    position={[0, 0.06, 0]}
                    rotation={[0, -0.3, 0]}
                    color="#2f4f4f"
                    title="Science"
                />
            </group>

            {/* Candles on table sides */}
            <Candle position={[-2.2, 0.1, 0]} />
            <Candle position={[2.2, 0.1, 0]} />
            <Candle position={[0, 0.1, 1.3]} />
            <Candle position={[0, 0.1, -1.3]} />

            {/* Decorative items */}
            {/* Ink bottle */}
            <mesh castShadow position={[-1.9, 0.2, 0.8]}>
                <cylinderGeometry args={[0.06, 0.08, 0.15, 16]} />
                <meshStandardMaterial
                    color="#1a1a1a"
                    roughness={0.3}
                    metalness={0.7}
                />
            </mesh>

            {/* Quill */}
            <group position={[-1.7, 0.15, 0.7]} rotation={[0, 0, -0.3]}>
                <mesh castShadow>
                    <cylinderGeometry args={[0.01, 0.01, 0.3, 8]} />
                    <meshStandardMaterial color="#8b7355" />
                </mesh>
            </group>
        </group>
    );
}
