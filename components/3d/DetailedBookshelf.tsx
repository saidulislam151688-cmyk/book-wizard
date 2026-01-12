"use client";

import { useMemo } from "react";
import { Instances, Instance, RoundedBox, Text } from "@react-three/drei";
import { Color } from "three";

export default function DetailedBookshelf({ position }: { position: [number, number, number] }) {
    // Pre-generate book data to keep it static
    const booksData = useMemo(() => {
        const books = [];
        const colors = ["#61DAFB", "#000000", "#E91E63", "#2196F3", "#795548", "#3F51B5", "#4CAF50", "#FF5722", "#607D8B", "#9C27B0", "#FFC107"];

        // Generate books for 4 shelves
        for (let row = 0; row < 4; row++) {
            const y = 0.8 + row * 1.0;
            // 12 books per shelf
            for (let col = 0; col < 12; col++) {
                const x = -3 + col * 0.5 + Math.random() * 0.1;
                const height = 0.4 + Math.random() * 0.1;
                const thickness = 0.08 + Math.random() * 0.04;
                const color = colors[Math.floor(Math.random() * colors.length)];
                books.push({ position: [x, y + 0.02 + height / 2, 0.2] as [number, number, number], args: [thickness, height, 0.4] as [number, number, number], color });
            }
        }
        return books;
    }, []);

    return (
        <group position={position}>
            {/* Main Unit - Simplified Geometry */}
            <mesh position={[0, 2, 0]} castShadow receiveShadow>
                <boxGeometry args={[7, 4, 0.6]} />
                <meshStandardMaterial color="#2c1b18" roughness={0.7} />
            </mesh>

            {/* Shelves - Single merged mesh would be better but simple boxes are okay */}
            {[0.8, 1.8, 2.8, 3.8].map((y, row) => (
                <mesh key={row} position={[0, y, 0.2]} receiveShadow>
                    <boxGeometry args={[6.6, 0.04, 0.5]} />
                    <meshStandardMaterial color="#3E2723" roughness={0.8} />
                </mesh>
            ))}

            {/* Optimized Books using Instances */}
            <Instances range={booksData.length} castShadow receiveShadow>
                <boxGeometry />
                <meshStandardMaterial roughness={0.5} />

                {booksData.map((data, i) => (
                    <Instance
                        key={i}
                        position={data.position}
                        scale={data.args}
                        color={data.color}
                    />
                ))}
            </Instances>
        </group>
    );
}
