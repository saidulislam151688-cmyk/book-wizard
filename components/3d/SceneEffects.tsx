"use client";

import { useEffect, useRef } from "react";
import { useWizardStore } from "@/lib/wizard-store";
import { useFrame } from "@react-three/fiber";
import { Group } from "three";
import { Text } from "@react-three/drei";

/**
 * SceneEffects - Reacts to wizard state and applies visual effects
 * This component is the "bridge" between the wizard UI and 3D scene
 */
export default function SceneEffects() {
    const { answers, currentStep } = useWizardStore();
    const effectsGroupRef = useRef<Group>(null);
    const pulseRef = useRef(0);

    // Animate pulsing glow effect
    useFrame((state) => {
        pulseRef.current = Math.sin(state.clock.elapsedTime * 2) * 0.5 + 0.5;
    });

    // Get user's choices
    const bookType = useWizardStore.getState().getAnswer("BOOK_TYPE");
    const genre = useWizardStore.getState().getAnswer("FICTION_GENRE");
    const category = useWizardStore.getState().getAnswer("NON_FICTION_CATEGORY");
    const bookTitle = useWizardStore.getState().getAnswer("BOOK_TITLE");
    const themes = useWizardStore.getState().getAnswer("THEMES");

    return (
        <group ref={effectsGroupRef}>
            {/* Show floating book title if entered */}
            {bookTitle && (
                <group position={[0, 3, -8]}>
                    <Text
                        fontSize={0.8}
                        color="#FFD700"
                        anchorX="center"
                        anchorY="middle"
                        outlineWidth={0.02}
                        outlineColor="#000"
                    >
                        {bookTitle}
                    </Text>
                    {/* Glow effect under title */}
                    <pointLight position={[0, -0.5, 0]} intensity={pulseRef.current * 2} color="#FFD700" distance={5} />
                </group>
            )}

            {/* Genre-specific objects on desk */}
            {genre === "fantasy" && (
                <MagicStaff position={[-1.5, 0.85, 0.5]} />
            )}

            {genre === "sci-fi" && (
                <Hologram position={[1.5, 0.85, 0.5]} />
            )}

            {genre === "mystery" && (
                <MagnifyingGlass position={[0, 0.85, 1]} />
            )}

            {category === "programming" && (
                <Laptop position={[0, 0.85, 0.8]} />
            )}

            {/* Theme indicators - Floating icons */}
            {themes && Array.isArray(themes) && themes.length > 0 && (
                <group position={[3, 2, -5]}>
                    {themes.map((theme: string, index: number) => {
                        const icons: Record<string, string> = {
                            "love": "❤️",
                            "adventure": "🗺️",
                            "mystery": "🔍",
                            "coming-of-age": "🌱",
                            "good-vs-evil": "⚔️",
                            "redemption": "✨",
                            "survival": "🏔️",
                            "betrayal": "🎭"
                        };

                        return (
                            <Text
                                key={theme}
                                position={[0, index * 0.5, 0]}
                                fontSize={0.4}
                                color="#fff"
                                anchorX="center"
                            >
                                {icons[theme] || "✨"} {theme}
                            </Text>
                        );
                    })}
                </group>
            )}
        </group>
    );
}

// Genre-specific 3D objects
function MagicStaff({ position }: { position: [number, number, number] }) {
    return (
        <group position={position} rotation={[0, 0, -0.3]}>
            {/* Wooden shaft */}
            <mesh>
                <cylinderGeometry args={[0.03, 0.03, 1.2]} />
                <meshStandardMaterial color="#8B4513" />
            </mesh>
            {/* Glowing crystal on top */}
            <mesh position={[0, 0.6, 0]}>
                <octahedronGeometry args={[0.1]} />
                <meshStandardMaterial color="#9C27B0" emissive="#9C27B0" emissiveIntensity={2} />
            </mesh>
            <pointLight position={[0, 0.6, 0]} intensity={1} color="#9C27B0" distance={2} />
        </group>
    );
}

function Hologram({ position }: { position: [number, number, number] }) {
    return (
        <group position={position}>
            {/* Hologram projector base */}
            <mesh position={[0, -0.05, 0]}>
                <cylinderGeometry args={[0.15, 0.15, 0.1]} />
                <meshStandardMaterial color="#00BCD4" metalness={0.8} />
            </mesh>
            {/* Holographic display */}
            <mesh position={[0, 0.3, 0]}>
                <boxGeometry args={[0.4, 0.6, 0.02]} />
                <meshStandardMaterial
                    color="#00E5FF"
                    emissive="#00E5FF"
                    emissiveIntensity={1.5}
                    transparent
                    opacity={0.6}
                />
            </mesh>
            <pointLight position={[0, 0.3, 0]} intensity={0.8} color="#00E5FF" distance={2} />
        </group>
    );
}

function MagnifyingGlass({ position }: { position: [number, number, number] }) {
    return (
        <group position={position} rotation={[0, 0.5, 0]}>
            {/* Handle */}
            <mesh position={[0, -0.3, 0]}>
                <cylinderGeometry args={[0.02, 0.02, 0.5]} />
                <meshStandardMaterial color="#654321" />
            </mesh>
            {/* Glass rim */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.15, 0.02, 16, 32]} />
                <meshStandardMaterial color="#FFD700" metalness={0.9} />
            </mesh>
            {/* Glass lens */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <circleGeometry args={[0.14]} />
                <meshPhysicalMaterial
                    color="#E3F2FD"
                    transmission={0.9}
                    opacity={0.3}
                    transparent
                />
            </mesh>
        </group>
    );
}

function Laptop({ position }: { position: [number, number, number] }) {
    return (
        <group position={position} rotation={[0, Math.PI / 6, 0]}>
            {/* Base */}
            <mesh position={[0, -0.02, 0]}>
                <boxGeometry args={[0.6, 0.04, 0.4]} />
                <meshStandardMaterial color="#2C3E50" />
            </mesh>
            {/* Screen */}
            <mesh position={[0, 0.2, -0.15]} rotation={[-0.2, 0, 0]}>
                <boxGeometry args={[0.58, 0.4, 0.02]} />
                <meshStandardMaterial color="#000" />
            </mesh>
            {/* Screen glow */}
            <mesh position={[0, 0.2, -0.14]} rotation={[-0.2, 0, 0]}>
                <planeGeometry args={[0.54, 0.36]} />
                <meshStandardMaterial
                    color="#4CAF50"
                    emissive="#4CAF50"
                    emissiveIntensity={1}
                />
            </mesh>
        </group>
    );
}
