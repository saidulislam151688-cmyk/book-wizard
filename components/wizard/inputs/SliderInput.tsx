"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface SliderInputProps {
    label: string;
    min: number;
    max: number;
    defaultValue: number;
    leftLabel: string;
    rightLabel: string;
    onSubmit: (value: number) => void;
}

export default function SliderInput({
    label,
    min,
    max,
    defaultValue,
    leftLabel,
    rightLabel,
    onSubmit
}: SliderInputProps) {
    const [value, setValue] = useState(defaultValue);

    return (
        <div className="space-y-6">
            <div className="text-center">
                <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                    {value}
                </div>
                <div className="text-purple-300 text-sm mt-1">{label}</div>
            </div>

            <div className="space-y-3">
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={value}
                    onChange={(e) => setValue(parseInt(e.target.value))}
                    className="w-full h-2 bg-purple-900/30 rounded-lg appearance-none cursor-pointer slider-thumb"
                    style={{
                        background: `linear-gradient(to right, rgb(168 85 247) 0%, rgb(168 85 247) ${((value - min) / (max - min)) * 100}%, rgb(88 28 135 / 0.3) ${((value - min) / (max - min)) * 100}%, rgb(88 28 135 / 0.3) 100%)`
                    }}
                />
                <div className="flex justify-between text-purple-300 text-sm">
                    <span>{leftLabel}</span>
                    <span>{rightLabel}</span>
                </div>
            </div>

            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSubmit(value)}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all"
            >
                Continue →
            </motion.button>
        </div>
    );
}
