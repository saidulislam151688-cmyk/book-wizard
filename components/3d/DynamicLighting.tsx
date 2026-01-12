"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useWizardStore } from "@/lib/wizard-store";
import * as THREE from "three";

/**
 * DynamicLighting - Adjusts scene lighting based on wizard choices
 */
export default function DynamicLighting() {
    const { currentStep } = useWizardStore();
    const ambientRef = useRef<THREE.AmbientLight>(null);
    const spotRef = useRef<THREE.SpotLight>(null);

    const targetIntensity = useRef(0.5);
    const targetColor = useRef("#ffffff");
    const targetSpotIntensity = useRef(0);

    useEffect(() => {
        const genre = useWizardStore.getState().getAnswer("FICTION_GENRE");
        const category = useWizardStore.getState().getAnswer("NON_FICTION_CATEGORY");
        const tone = useWizardStore.getState().getAnswer("WRITING_TONE") || 5;

        // Adjust lighting based on genre/category
        if (genre === "fantasy") {
            targetColor.current = "#9C27B0"; // Purple magical glow
            targetIntensity.current = 0.6;
            targetSpotIntensity.current = 0.8;
        } else if (genre === "sci-fi") {
            targetColor.current = "#00BCD4"; // Cyan futuristic
            targetIntensity.current = 0.5;
            targetSpotIntensity.current = 1.0;
        } else if (genre === "mystery") {
            targetColor.current = "#455A64"; // Dark mysterious
            targetIntensity.current = 0.3;
            targetSpotIntensity.current = 0.5;
        } else if (genre === "romance") {
            targetColor.current = "#F06292"; // Pink romantic
            targetIntensity.current = 0.7;
            targetSpotIntensity.current = 0.6;
        } else if (category === "programming") {
            targetColor.current = "#4CAF50"; // Green code
            targetIntensity.current = 0.5;
            targetSpotIntensity.current = 0.7;
        } else if (category === "business") {
            targetColor.current = "#FF9800"; // Orange corporate
            targetIntensity.current = 0.6;
            targetSpotIntensity.current = 0.8;
        } else {
            targetColor.current = "#ffffff";
            targetIntensity.current = 0.5;
            targetSpotIntensity.current = 0;
        }

        // Adjust intensity based on writing tone (casual = brighter, formal = dimmer)
        const toneMultiplier = 1 - (tone / 10) * 0.3; // Formal writing = darker mood
        targetIntensity.current *= toneMultiplier;

    }, [currentStep]);

    // Smooth transitions
    useFrame(() => {
        if (ambientRef.current) {
            ambientRef.current.intensity += (targetIntensity.current - ambientRef.current.intensity) * 0.02;
        }
        if (spotRef.current) {
            spotRef.current.intensity += (targetSpotIntensity.current - spotRef.current.intensity) * 0.02;
        }
    });

    return (
        <>
            <ambientLight ref={ambientRef} intensity={0.5} color={targetColor.current} />

            {/* Dynamic spotlight that follows genre */}
            <spotLight
                ref={spotRef}
                position={[0, 5, 0]}
                angle={0.6}
                penumbra={0.5}
                intensity={0}
                color={targetColor.current}
                castShadow
            />
        </>
    );
}
