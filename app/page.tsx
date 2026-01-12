"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

// Dynamic imports for better performance
const Scene = dynamic(() => import("@/components/3d/Scene"), {
  ssr: false,
  loading: () => null,
});

const WizardOverlay = dynamic(() => import("@/components/ui/WizardOverlay"), {
  ssr: false,
});

const LoadingScreen = dynamic(() => import("@/components/3d/LoadingScreen"), {
  ssr: false,
});

export default function Home() {
  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      <LoadingScreen />
      
      {/* 3D Scene Container */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </div>

      {/* Wizard UI Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <Suspense fallback={null}>
          <WizardOverlay />
        </Suspense>
      </div>
    </div>
  );
}
