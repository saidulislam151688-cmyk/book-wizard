"use client";

import { useProgress } from "@react-three/drei";
import { useEffect, useState } from "react";

export default function LoadingScreen() {
    const { progress, active } = useProgress();
    const [localProgress, setLocalProgress] = useState(0);
    const [shouldShow, setShouldShow] = useState(true);
    const [isFading, setIsFading] = useState(false);

    // Sync progress safely via useEffect to avoid React state update conflicts
    useEffect(() => {
        setLocalProgress(progress);
    }, [progress]);

    // Handle fading and hiding
    useEffect(() => {
        // If everything is loaded and we are at 100%
        if (!active && progress >= 100) {
            // Start fading out after a short delay
            const fadeTimeout = setTimeout(() => setIsFading(true), 500);
            // Completely unmount after fade animation
            const hideTimeout = setTimeout(() => setShouldShow(false), 1500);
            
            return () => {
                clearTimeout(fadeTimeout);
                clearTimeout(hideTimeout);
            };
        } else if (active) {
            setShouldShow(true);
            setIsFading(false);
        }
    }, [active, progress]);

    if (!shouldShow) return null;

    return (
        <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-900 transition-opacity duration-1000 ${isFading ? 'opacity-0' : 'opacity-100'}`}>
            <div className="flex flex-col items-center justify-center p-12 bg-slate-800/50 rounded-[2.5rem] backdrop-blur-2xl border border-white/10 min-w-[340px] shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                {/* Book Icon/Logo Animation */}
                <div className="mb-8 relative">
                   <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
                   <div className="absolute inset-0 flex items-center justify-center text-2xl">✨</div>
                </div>

                {/* Progress Bar Container */}
                <div className="w-64 h-2.5 bg-white/5 rounded-full overflow-hidden mb-6 relative">
                    {/* Glowing track */}
                    <div 
                        className="h-full bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 transition-all duration-700 ease-out"
                        style={{ width: `${localProgress}%` }}
                    />
                </div>
                
                {/* Status Text */}
                <div className="flex flex-col items-center gap-2">
                    <div className="text-xs font-bold tracking-[0.3em] uppercase text-purple-300/80 animate-pulse">
                        Summoning Library
                    </div>
                    <div className="text-3xl font-black text-white tabular-nums drop-shadow-md">
                        {localProgress.toFixed(0)}%
                    </div>
                </div>
            </div>
            
            {/* Subtle background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full -z-10 transition-all duration-1000"></div>
        </div>
    );
}
