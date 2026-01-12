"use client";

import { Html, useProgress } from "@react-three/drei";
import { useEffect, useState } from "react";

export default function LoadingScreen() {
    const { progress, active } = useProgress();
    const [shown, setShown] = useState(true);

    useEffect(() => {
        if (!active && progress === 100) {
            const timeout = setTimeout(() => setShown(false), 800);
            return () => clearTimeout(timeout);
        } else {
            setShown(true);
        }
    }, [progress, active]);

    if (!shown) return null;

    return (
        <Html center portal={undefined} zIndexRange={[100, 0]}>
            <div className="flex flex-col items-center justify-center p-10 bg-slate-900/90 rounded-3xl backdrop-blur-xl border border-white/10 min-w-[320px] shadow-2xl">
                {/* Progress Bar Container */}
                <div className="w-64 h-2 bg-white/5 rounded-full overflow-hidden mb-6 relative">
                    {/* Glowing track */}
                    <div 
                        className="h-full bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                
                {/* Status Text */}
                <div className="flex flex-col items-center gap-2">
                    <div className="text-sm font-bold tracking-[0.2em] uppercase text-purple-300 animate-pulse">
                        Magical Resonance
                    </div>
                    <div className="text-2xl font-black text-white tabular-nums">
                        {progress.toFixed(0)}%
                    </div>
                </div>
            </div>
        </Html>
    );
}
