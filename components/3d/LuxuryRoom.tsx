"use client";

import { RoundedBox, MeshReflectorMaterial } from "@react-three/drei";
import InteractiveBook from "./InteractiveBook";
import Lamp from "./Lamp";
import FishTank from "./FishTank";
import Sofa from "./Sofa";
import DetailedBookshelf from "./DetailedBookshelf";
import FlowerPlant from "./FlowerPlant";
import CyberpunkCar from "./CyberpunkCar";
import FireplaceTV from "./FireplaceTV";
import SceneEffects from "./SceneEffects";

export default function LuxuryRoom() {
    return (
        <group>
            {/* Floor - Optimized Reflections */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
                <planeGeometry args={[30, 30]} />
                <MeshReflectorMaterial
                    blur={[400, 100]}
                    resolution={512}
                    mixBlur={0.8}
                    mixStrength={30}
                    roughness={0.6}
                    depthScale={1}
                    minDepthThreshold={0.5}
                    maxDepthThreshold={1.2}
                    color="#2a1b15"
                    metalness={0.05}
                    mirror={0}
                />
            </mesh>

            {/* Walls */}
            <mesh receiveShadow position={[0, 5, -10]}>
                <boxGeometry args={[30, 10, 0.2]} />
                <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
            </mesh>
            <mesh receiveShadow position={[-15, 5, 0]} rotation={[0, Math.PI / 2, 0]}>
                <boxGeometry args={[30, 10, 0.2]} />
                <meshStandardMaterial color="#dcdcdc" roughness={0.9} />
            </mesh>
            <mesh receiveShadow position={[15, 5, 0]} rotation={[0, -Math.PI / 2, 0]}>
                <boxGeometry args={[30, 10, 0.2]} />
                <meshStandardMaterial color="#dcdcdc" roughness={0.9} />
            </mesh>

            {/* LEFT SIDE: Cyberpunk Car */}
            <group position={[-7, 0, 0]} rotation={[0, 0.5, 0]}>
                <CyberpunkCar position={[0, 0, 0]} />
            </group>

            {/* RIGHT SIDE: Sofa Living Area */}
            <group position={[8, 0, 1]} rotation={[0, -0.6, 0]}>
                <Sofa position={[0, 0, 0]} />
                <Sofa position={[-2.5, 0, 1]} rotation={[0, Math.PI / 2, 0]} />
                {/* Coffee Table */}
                <group position={[-1, 0.2, 1]}>
                    <RoundedBox args={[1.5, 0.4, 1.5]} radius={0.05} smoothness={4}>
                        <meshPhysicalMaterial
                            color="#1a1a1a"
                            roughness={0.1}
                            metalness={0.2}
                            clearcoat={1}
                        />
                    </RoundedBox>
                </group>
                {/* Fish Tank moved to side of sofa */}
                <FishTank position={[2, 0, -2]} rotation={[0, -0.2, 0]} />
            </group>

            {/* BACK WALL: Fireplace TV Center */}
            <FireplaceTV position={[0, 3.5, -9.8]} />

            {/* Bookshelves flanking the TV */}
            <group scale={[0.8, 0.8, 0.8]}>
                <DetailedBookshelf position={[-6, 0, -11]} />
                <DetailedBookshelf position={[6, 0, -11]} />
            </group>

            {/* CORNERS: Flower Plants */}
            <FlowerPlant position={[-12, 0, -8]} />
            <FlowerPlant position={[12, 0, -8]} />

            {/* CENTER: Main Executive Desk */}
            <group position={[0, 0, 2]}> {/* Moved forward slightly */}
                <RoundedBox args={[5, 0.15, 2.5]} radius={0.05} smoothness={8} position={[0, 0.75, 0]} castShadow receiveShadow>
                    <meshPhysicalMaterial
                        color="#111111"
                        roughness={0.1}
                        metalness={0.1}
                        clearcoat={1}
                        clearcoatRoughness={0.1}
                    />
                </RoundedBox>

                {/* Legs */}
                {[[-2, 0.35, 1], [2, 0.35, 1], [-2, 0.35, -1], [2, 0.35, -1]].map((pos, i) => (
                    <mesh key={i} position={pos as [number, number, number]} castShadow>
                        <cylinderGeometry args={[0.06, 0.04, 0.75, 32]} />
                        <meshStandardMaterial color="#D4AF37" metalness={1} roughness={0.2} />
                    </mesh>
                ))}

                {/* Decorative Items */}
                <InteractiveBook position={[-1.5, 0.85, 0.5]} rotation={[0, 0.5, 0]} color="#1A237E" />
                <InteractiveBook position={[1.5, 0.85, 0.6]} rotation={[0, -0.5, 0]} color="#004D40" />


                <Lamp position={[-2, 0.83, -0.8]} />
                <Lamp position={[2, 0.83, -0.8]} />
            </group>

        </group>
    );
}
