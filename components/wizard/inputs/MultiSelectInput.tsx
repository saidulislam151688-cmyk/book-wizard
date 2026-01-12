"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Option {
    value: string;
    label: string;
    icon?: string;
}

interface MultiSelectInputProps {
    options: Option[];
    minSelect?: number;
    maxSelect?: number;
    onSubmit: (values: string[]) => void;
}

export default function MultiSelectInput({
    options,
    minSelect = 1,
    maxSelect = options.length,
    onSubmit
}: MultiSelectInputProps) {
    const [selected, setSelected] = useState<string[]>([]);

    const toggleOption = (value: string) => {
        if (selected.includes(value)) {
            setSelected(selected.filter(v => v !== value));
        } else {
            if (selected.length < maxSelect) {
                setSelected([...selected, value]);
            }
        }
    };

    const isValid = selected.length >= minSelect && selected.length <= maxSelect;

    return (
        <div className="space-y-4">
            <div className="text-purple-300 text-sm text-center">
                Select {minSelect === maxSelect ? minSelect : `${minSelect}-${maxSelect}`} option{maxSelect > 1 ? 's' : ''}
                {selected.length > 0 && ` (${selected.length} selected)`}
            </div>

            <div className="grid grid-cols-2 gap-3">
                {options.map((option, index) => {
                    const isSelected = selected.includes(option.value);
                    return (
                        <motion.button
                            key={option.value}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => toggleOption(option.value)}
                            className={`p-4 rounded-xl border-2 transition-all ${isSelected
                                    ? 'border-purple-500 bg-gradient-to-r from-purple-600/40 to-pink-600/40 shadow-lg shadow-purple-500/30'
                                    : 'border-purple-500/30 bg-purple-600/10 hover:border-purple-500/50'
                                }`}
                        >
                            {option.icon && <div className="text-3xl mb-2">{option.icon}</div>}
                            <div className="text-white font-medium text-sm">{option.label}</div>
                        </motion.button>
                    );
                })}
            </div>

            <motion.button
                whileHover={{ scale: isValid ? 1.02 : 1 }}
                whileTap={{ scale: isValid ? 0.98 : 1 }}
                onClick={() => isValid && onSubmit(selected)}
                disabled={!isValid}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-purple-500/50 transition-all"
            >
                Continue →
            </motion.button>
        </div>
    );
}
