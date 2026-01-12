"use client";

import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, Text, Float } from "@react-three/drei";
import { Group, MeshStandardMaterial, Color } from "three";
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

    // Selective subscriptions to prevent unnecessary re-renders
    const currentStep = useWizardStore(state => state.currentStep);
    const getAnswer = useWizardStore(state => state.getAnswer);

    // Animation states
    const [isHero, setIsHero] = useState(false);
    const [flippedPages, setFlippedPages] = useState<number>(0);

    // Derived data for display
    const bookType = getAnswer("BOOK_TYPE") || "";
    const chapterNames = [...(getAnswer("CHAPTER_NAMES") || [])];

    useEffect(() => {
        if (!groupRef.current) return;

        // Transition to Hero shot when wizard starts
        if (currentStep !== "INIT" && !isHero) {
            setIsHero(true);
            gsap.killTweensOf(groupRef.current.position);
            gsap.killTweensOf(groupRef.current.rotation);

            gsap.to(groupRef.current.position, {
                x: 0,
                y: 1.5,
                z: 4,
                duration: 1.2,
                ease: "power2.inOut"
            });
            gsap.to(groupRef.current.rotation, {
                x: 0.2, // Slight tilt for readability
                y: 0,
                z: 0,
                duration: 1.2,
                ease: "power2.inOut"
            });
        } else if (currentStep === "INIT" && isHero) {
            setIsHero(false);
            gsap.killTweensOf(groupRef.current.position);
            gsap.killTweensOf(groupRef.current.rotation);

            gsap.to(groupRef.current.position, {
                x: position[0],
                y: position[1],
                z: position[2],
                duration: 1,
                ease: "power2.inOut"
            });
            gsap.to(groupRef.current.rotation, {
                x: rotation[0],
                y: rotation[1],
                z: rotation[2],
                duration: 1,
                ease: "power2.inOut"
            });
        }

        // Automatic page flip logic based on progress
        if (currentStep === "CHAPTER_NAMES") {
            setFlippedPages(1);
        } else if (currentStep === "COMPLETE") {
            setFlippedPages(2);
        } else {
            setFlippedPages(0);
        }
    }, [currentStep, isHero, position, rotation]);

    useFrame((state) => {
        if (groupRef.current && isHero) {
            // Subtle floating effect in hero mode
            groupRef.current.position.y = 1.5 + Math.sin(state.clock.elapsedTime * 1.5) * 0.04;
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.015;
        }
    });

    return (
        <group ref={groupRef} position={position} rotation={rotation}>
            {/* Book Body */}
            <group>
                {/* Front Cover */}
                <RoundedBox
                    ref={coverRef}
                    args={[0.65, 0.08, 0.9]}
                    radius={0.02}
                    smoothness={2} // Reduced from 4 for performance
                    castShadow
                    receiveShadow
                >
                    <meshStandardMaterial
                        color={color}
                        roughness={0.4}
                        metalness={0.1}
                    />
                </RoundedBox>

                {/* Cover Text (Title) - Isolated in sub-component */}
                <group position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <BookTitleText bookTitleStatic={getAnswer("BOOK_TITLE") || ""} />

                    {/* Corner Label (Type) */}
                    <Text
                        position={[0.2, -0.35, 0]}
                        fontSize={0.03}
                        color="#ffffff"
                        fillOpacity={0.7}
                        textAlign="right"
                    >
                        {bookType}
                    </Text>
                </group>

                {/* Pages Content Simulation */}
                <mesh position={[0.01, 0, 0]}>
                    <boxGeometry args={[0.62, 0.07, 0.88]} />
                    <meshStandardMaterial color="#FFF8E1" />
                </mesh>
            </group>

            {/* Flipping Pages */}
            <DynamicPages flippedCount={flippedPages} chapters={chapterNames} />
        </group>
    );
}

/**
 * Isolated component to handle the book title text.
 * Only re-renders when tempInput or currentStep changes.
 */
function BookTitleText({ bookTitleStatic }: { bookTitleStatic: string }) {
    const currentStep = useWizardStore(state => state.currentStep);
    const tempInput = useWizardStore(state => state.tempInput);

    const displayTitle = currentStep === "BOOK_TITLE" ? tempInput : bookTitleStatic;

    return (
        <Text
            position={[0, 0.1, 0]}
            fontSize={0.06}
            color="#d4af37"
            maxWidth={0.5}
            textAlign="center"
            font="https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvD7K_aerSgP-be73rXnhXNUEx_4gzF68YgTeWmMto.woff"
        >
            {displayTitle}
        </Text>
    );
}

function DynamicPages({ flippedCount, chapters }: { flippedCount: number, chapters: string[] }) {
    return (
        <group>
            {[1, 2].map((i) => {
                const isFlipped = flippedCount >= i;
                return (
                    <FlippingPage
                        key={i}
                        index={i}
                        isFlipped={isFlipped}
                        chapters={i === 1 ? chapters : null}
                    />
                );
            })}
        </group>
    );
}

function FlippingPage({ index, isFlipped, chapters }: { index: number, isFlipped: boolean, chapters: string[] | null }) {
    const pageRef = useRef<Group>(null);

    useEffect(() => {
        if (pageRef.current) {
            gsap.killTweensOf(pageRef.current.rotation);
            gsap.killTweensOf(pageRef.current.position);

            gsap.to(pageRef.current.rotation, {
                z: isFlipped ? -Math.PI * 0.9 : 0,
                duration: 1.5,
                ease: "power2.inOut",
                delay: index * 0.1
            });
            gsap.to(pageRef.current.position, {
                y: isFlipped ? 0.04 + (index * 0.01) : 0.04 + (index * 0.002),
                duration: 1.5
            });
        }
    }, [isFlipped, index]);

    return (
        <group ref={pageRef} position={[-0.32, 0.04, 0]}>
            <mesh position={[0.32, 0, 0]}>
                <boxGeometry args={[0.6, 0.005, 0.86]} />
                <meshStandardMaterial color="#FFFDE7" />

                {/* Page Content - Isolated */}
                {chapters ? (
                    <PageContent chaptersStatic={chapters} />
                ) : (
                    index === 2 && isFlipped && (
                        <Text
                            position={[0, 0.003, 0]}
                            rotation={[-Math.PI / 2, 0, 0]}
                            fontSize={0.04}
                            color="#2c3e50"
                            textAlign="center"
                        >
                            THE END
                        </Text>
                    )
                )}
            </mesh>
        </group>
    );
}

function PageContent({ chaptersStatic }: { chaptersStatic: string[] }) {
    const tempInput = useWizardStore(state => state.tempInput);
    const currentStep = useWizardStore(state => state.currentStep);

    const displayContent = [...chaptersStatic];
    if (currentStep === "CHAPTER_NAMES" && tempInput) {
        displayContent.push(tempInput);
    }

    return (
        <Text
            position={[0, 0.003, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.025}
            color="#2c3e50"
            maxWidth={0.5}
            textAlign="left"
            anchorX="center"
            anchorY="middle"
        >
            {displayContent.join("\n")}
        </Text>
    );
}
