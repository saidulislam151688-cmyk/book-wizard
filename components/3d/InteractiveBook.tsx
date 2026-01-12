"use client";

import { useMemo, useRef, useEffect, useState } from "react";
import { RoundedBox, Text, Float, Trail } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Color, Group, MathUtils } from "three";
import gsap from "gsap";
import { useWizardStore } from "@/lib/wizard-store";

interface BookProps {
    position: [number, number, number];
    rotation?: [number, number, number];
    color?: string;
    title?: string;
}

export default function InteractiveBook({ position, rotation = [0, 0, 0], color = "#ffffff" }: BookProps) {
    const groupRef = useRef<Group>(null);
    const coverRef = useRef<any>(null);
    const { currentStep, isWriting, tempInput, getAnswer } = useWizardStore();

    // Derived content
    const bookTitle = currentStep === "BOOK_TITLE" ? (tempInput || getAnswer("BOOK_TITLE") || "Untitled Book") : (getAnswer("BOOK_TITLE") || "Untitled Book");
    const bookType = getAnswer("BOOK_TYPE") || "Generic";

    // Dynamic visibility for pages
    const showChapters = ["CHAPTER_NAMES", "COMPLETE"].includes(currentStep);
    const flippedCount = currentStep === "COMPLETE" ? 3 : (currentStep === "CHAPTER_NAMES" ? 1 : 0);

    // Initial position on desk vs Hero position
    const isHero = currentStep !== "INIT";
    const heroPosition: [number, number, number] = [0, 1.5, 4];
    const heroRotation: [number, number, number] = [0, 0, 0];

    useEffect(() => {
        if (!groupRef.current) return;

        if (isHero) {
            // Cinematic float up
            gsap.to(groupRef.current.position, {
                x: heroPosition[0],
                y: heroPosition[1],
                z: heroPosition[2],
                duration: 1.5,
                ease: "power3.out"
            });
            gsap.to(groupRef.current.rotation, {
                x: heroRotation[0],
                y: heroRotation[1],
                z: heroRotation[2],
                duration: 1.5,
                ease: "power3.out"
            });
        } else {
            // Return to desk
            gsap.to(groupRef.current.position, {
                x: position[0],
                y: position[1],
                z: position[2],
                duration: 1.2,
                ease: "power2.inOut"
            });
            gsap.to(groupRef.current.rotation, {
               x: rotation[0],
               y: rotation[1],
               z: rotation[2],
                duration: 1.2,
                ease: "power2.inOut"
            });
        }
    }, [isHero, position, rotation]);

    // Floating effect when in Hero mode
    useFrame((state) => {
        if (isHero && groupRef.current) {
            const t = state.clock.getElapsedTime();
            groupRef.current.position.y = heroPosition[1] + Math.sin(t * 0.5) * 0.05;
            groupRef.current.rotation.z = Math.sin(t * 0.3) * 0.02;
            groupRef.current.rotation.y = Math.sin(t * 0.2) * 0.03;
        }
    });

    return (
        <group ref={groupRef} position={position} rotation={rotation}>
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
                {/* Book Cover */}
                <mesh castShadow ref={coverRef}>
                    <boxGeometry args={[1.2, 1.6, 0.15]} />
                    <meshStandardMaterial color={color} roughness={0.3} metalness={0.2} />

                    {/* Book Type Label */}
                    <Text
                        position={[0.4, 0.6, 0.08]}
                        fontSize={0.06}
                        color="white"
                        font="/fonts/Inter-Bold.ttf"
                        anchorX="center"
                        anchorY="middle"
                        fillOpacity={0.8}
                    >
                        {bookType.toUpperCase()}
                    </Text>

                    {/* Book Title */}
                    <Text
                        position={[0, 0, 0.08]}
                        fontSize={0.12}
                        color="#FFD700"
                        font="/fonts/Inter-Bold.ttf"
                        maxWidth={0.8}
                        textAlign="center"
                        anchorX="center"
                        anchorY="middle"
                    >
                        {bookTitle}
                    </Text>
                </mesh>

                {/* Pages */}
                <group position={[0, 0, -0.01]}>
                    <mesh position={[0, 0, 0.05]}>
                        <boxGeometry args={[1.1, 1.5, 0.1]} />
                        <meshStandardMaterial color="#fffef0" />
                    </mesh>

                    {/* Animated Pages */}
                    <DynamicPages show={showChapters} flippedCount={flippedCount} />
                </group>
            </Float>
        </group>
    );
}

function DynamicPages({ show, flippedCount }: { show: boolean; flippedCount: number }) {
    if (!show) return null;

    return (
        <group position={[0, 0, 0.06]}>
            <FlippingPage index={0} isFlipped={flippedCount >= 1} />
            <FlippingPage index={1} isFlipped={flippedCount >= 2} />
            <FlippingPage index={2} isFlipped={flippedCount >= 3} />
        </group>
    );
}

function FlippingPage({ index, isFlipped }: { index: number; isFlipped: boolean }) {
    const pageRef = useRef<Group>(null);
    const { tempInput, getAnswer, currentStep } = useWizardStore();
    
    // Chapter names preview
    const chapterNames = getAnswer("CHAPTER_NAMES") || [];
    const displayChapters = currentStep === "CHAPTER_NAMES" && tempInput 
        ? [...chapterNames, tempInput] 
        : chapterNames;

    useEffect(() => {
        if (!pageRef.current) return;
        if (isFlipped) {
            gsap.to(pageRef.current.rotation, {
                y: -Math.PI + 0.1,
                duration: 1.2,
                delay: index * 0.1,
                ease: "power2.inOut"
            });
        } else {
            gsap.to(pageRef.current.rotation, {
                y: 0,
                duration: 1.2,
                ease: "power2.inOut"
            });
        }
    }, [isFlipped, index]);

    return (
        <group ref={pageRef} position={[0.55, 0, 0]}>
            <mesh position={[-0.55, 0, 0]}>
                <boxGeometry args={[1.1, 1.5, 0.005]} />
                <meshStandardMaterial color="#fffef0" />
                
                {index === 0 && (
                    <Text
                        position={[-0.1, 0.3, 0.01]}
                        fontSize={0.07}
                        color="#333"
                        maxWidth={0.8}
                        font="/fonts/Inter-Regular.ttf"
                    >
                        {displayChapters.length > 0 ? "Table of Contents\n\n" + displayChapters.join("\n") : "Writing..."}
                    </Text>
                )}
            </mesh>
        </group>
    );
}
