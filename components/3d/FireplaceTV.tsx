"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Mesh, ShaderMaterial } from "three";
import { RoundedBox } from "@react-three/drei";

export default function FireplaceTV({ position }: { position: [number, number, number] }) {
    const shaderRef = useRef<ShaderMaterial>(null);

    useFrame((state) => {
        if (shaderRef.current) {
            shaderRef.current.uniforms.time.value = state.clock.elapsedTime;
        }
    });

    const fireShader = {
        uniforms: {
            time: { value: 0 },
            colorWarm: { value: [1.0, 0.5, 0.2] }, // Orange
            colorHot: { value: [0.8, 0.1, 0.1] },  // Red
            colorDark: { value: [0.1, 0.05, 0.0] } // Black/Dark
        },
        vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
        fragmentShader: `
      uniform float time;
      varying vec2 vUv;

      // Simple noise function
      float noise(vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
      }

      void main() {
        vec2 uv = vUv;
        
        // Animated fire algorithm simulation
        float n = noise(uv * 10.0 + time);
        float verticalFade = 1.0 - uv.y;
        
        float intensity = smoothstep(0.4, 0.8, n * verticalFade + (sin(uv.x * 10.0 + time * 2.0) * 0.1));
        
        vec3 color = mix(vec3(0.0), vec3(1.0, 0.4, 0.1), intensity); // Fire color
        
        // Add some flickering darkness
        float flicker = sin(time * 10.0) * 0.1 + 0.9;
        color *= flicker;

        gl_FragColor = vec4(color, 1.0);
      }
    `
    };

    return (
        <group position={position}>
            {/* TV Frame */}
            <RoundedBox args={[8, 4.5, 0.2]} radius={0.1} smoothness={4} castShadow>
                <meshPhysicalMaterial color="#111" roughness={0.2} metalness={0.8} clearcoat={1} />
            </RoundedBox>

            {/* Screen - Animated Fire */}
            <mesh position={[0, 0, 0.11]}>
                <planeGeometry args={[7.8, 4.3]} />
                <shaderMaterial
                    ref={shaderRef}
                    args={[fireShader]}
                />
            </mesh>

            {/* Stand/Wall Mount hint */}
            <mesh position={[0, -2.5, -0.1]}>
                <boxGeometry args={[4, 0.5, 0.5]} />
                <meshStandardMaterial color="#222" />
            </mesh>
        </group>
    );
}
