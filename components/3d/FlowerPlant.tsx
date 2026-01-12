"use client";

export default function FlowerPlant({ position }: { position: [number, number, number] }) {
    return (
        <group position={position}>
            {/* Pot */}
            <mesh castShadow position={[0, 0.3, 0]}>
                <cylinderGeometry args={[0.25, 0.15, 0.6, 16]} />
                <meshStandardMaterial color="#795548" roughness={0.6} />
            </mesh>

            {/* Soil */}
            <mesh position={[0, 0.55, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[0.23, 16]} />
                <meshStandardMaterial color="#3E2723" />
            </mesh>

            {/* Stems & Leaves */}
            <group position={[0, 0.6, 0]}>
                {/* Center Stem */}
                <mesh position={[0, 0.4, 0]}>
                    <cylinderGeometry args={[0.02, 0.02, 0.8]} />
                    <meshStandardMaterial color="#2E7D32" />
                </mesh>

                {/* Flowers - Simple stylized */}
                <mesh position={[0, 0.8, 0]}>
                    <sphereGeometry args={[0.15]} />
                    <meshStandardMaterial color="#E91E63" />
                </mesh>

                <mesh position={[0.2, 0.6, 0.1]} rotation={[0, 0, -0.3]}>
                    <cylinderGeometry args={[0.015, 0.015, 0.6]} />
                    <meshStandardMaterial color="#388E3C" />
                </mesh>
                <mesh position={[0.25, 0.9, 0.15]}>
                    <sphereGeometry args={[0.1]} />
                    <meshStandardMaterial color="#FFEB3B" />
                </mesh>

                <mesh position={[-0.2, 0.5, -0.1]} rotation={[0, 0, 0.3]}>
                    <cylinderGeometry args={[0.015, 0.015, 0.5]} />
                    <meshStandardMaterial color="#388E3C" />
                </mesh>
                <mesh position={[-0.25, 0.75, -0.15]}>
                    <sphereGeometry args={[0.12]} />
                    <meshStandardMaterial color="#9C27B0" />
                </mesh>
            </group>
        </group>
    );
}
