"use client";

import { useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { useWizardStore } from "@/lib/wizard-store";
import { Vector3, Euler } from "three";
import * as THREE from "three";

/**
 * CameraController - Smoothly animates camera based on wizard step
 */
export default function CameraController() {
    const { camera } = useThree();
    const currentStep = useWizardStore(state => state.currentStep);

    const targetPosition = useRef(new Vector3(0, 2, 8));
    const targetRotation = useRef(new Euler(0, 0, 0));
    const smoothness = 0.04; // Medium speed - balanced between smooth and responsive

    useEffect(() => {
        // Define camera positions for each step
        const cameraPositions: Record<string, { position: Vector3; lookAt: Vector3 }> = {
            "INIT": {
                position: new Vector3(0, 2, 8),
                lookAt: new Vector3(0, 1, 0)
            },
            "BOOK_TYPE": {
                position: new Vector3(-2, 2.5, 6),
                lookAt: new Vector3(0, 1, 0)
            },
            "FICTION_GENRE": {
                position: new Vector3(2, 2, 5),
                lookAt: new Vector3(0, 0.8, 0)
            },
            "NON_FICTION_CATEGORY": {
                position: new Vector3(-2, 2, 5),
                lookAt: new Vector3(0, 0.8, 0)
            },
            "BOOK_TITLE": {
                // Focused hero shot of the book
                position: new Vector3(0, 1.6, 5.5),
                lookAt: new Vector3(0, 1.5, 4)
            },
            "TARGET_AUDIENCE": {
                position: new Vector3(1, 2, 5.5),
                lookAt: new Vector3(0, 1.5, 4)
            },
            "WRITING_TONE": {
                position: new Vector3(-1, 1.8, 5.5),
                lookAt: new Vector3(0, 1.5, 4)
            },
            "THEMES": {
                position: new Vector3(0, 2.2, 6),
                lookAt: new Vector3(0, 1.5, 4)
            },
            "CHAPTER_COUNT": {
                position: new Vector3(0.5, 1.8, 5.5),
                lookAt: new Vector3(0, 1.5, 4)
            },
            "CHAPTER_NAMES": {
                position: new Vector3(0, 1.7, 5.2),
                lookAt: new Vector3(0, 1.5, 4)
            },
            "COMPLETE": {
                // Celebration shot
                position: new Vector3(0, 2.5, 7),
                lookAt: new Vector3(0, 1.5, 4)
            }

        };

        const config = cameraPositions[currentStep] || cameraPositions["INIT"];
        targetPosition.current = config.position;

        // Calculate rotation to look at target
        const direction = new Vector3().subVectors(config.lookAt, config.position).normalize();
        const targetQuaternion = new THREE.Quaternion().setFromUnitVectors(
            new Vector3(0, 0, -1),
            direction
        );
        targetRotation.current.setFromQuaternion(targetQuaternion);

    }, [currentStep]);

    useFrame(() => {
        // Smoothly interpolate camera position
        camera.position.lerp(targetPosition.current, smoothness);

        // Smoothly interpolate camera rotation
        const currentQuaternion = camera.quaternion.clone();
        const targetQuaternion = new THREE.Quaternion().setFromEuler(targetRotation.current);
        camera.quaternion.slerp(targetQuaternion, smoothness);
    });

    return null;
}
