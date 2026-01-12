"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useWizardStore } from "@/lib/wizard-store";
import { useState } from "react";
import SliderInput from "@/components/wizard/inputs/SliderInput";
import MultiSelectInput from "@/components/wizard/inputs/MultiSelectInput";
import { StepChoice } from "@/lib/wizard-steps";

export default function WizardOverlay() {
    const {
        currentStep,
        getCurrentStepData,
        answerStep,
        goToPreviousStep,
        answers,
        isComplete,
        setTempInput,
        setWriting
    } = useWizardStore();
    const stepData = getCurrentStepData();
    const [inputValue, setInputValue] = useState("");
    const [chapterNames, setChapterNames] = useState<string[]>([]);

    const handleInputChange = (val: string) => {
        setInputValue(val);
        setTempInput(val);
        setWriting(val.length > 0);
    };


    const handleChoice = (value: string) => {
        answerStep(value);
    };

    const handleTextSubmit = () => {
        if (inputValue.trim()) {
            answerStep(inputValue);
            setInputValue("");
        }
    };

    const handleNumberSubmit = () => {
        const num = parseInt(inputValue);
        if (!isNaN(num)) {
            answerStep(num);
            // Initialize chapter names array
            setChapterNames(Array(num).fill(""));
            setInputValue("");
        }
    };

    const handleChapterNamesSubmit = () => {
        if (chapterNames.every(name => name.trim())) {
            answerStep(chapterNames);
            setChapterNames([]);
        }
    };

    const updateChapterName = (index: number, value: string) => {
        const updated = [...chapterNames];
        updated[index] = value;
        setChapterNames(updated);
    };

    // Don't show wizard on INIT step
    if (currentStep === "INIT") {
        return (
            <div className="flex items-center justify-center h-screen pointer-events-none">
                <motion.button
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => answerStep("start")}
                    className="px-12 py-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-2xl font-bold rounded-full shadow-2xl hover:shadow-purple-500/50 transition-shadow pointer-events-auto cursor-pointer"
                >
                    ✨ Start Creating Your Book
                </motion.button>
            </div>
        );
    }

    return (
        <div className="absolute inset-0 flex items-end justify-center p-8 pointer-events-none">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    transition={{ duration: 0.5, type: "spring" }}
                    className="w-full max-w-2xl bg-black/60 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/30 shadow-2xl pointer-events-auto"
                >
                    {/* Progress indicator */}
                    <div className="mb-6 flex items-center justify-between">
                        <span className="text-purple-300 text-sm font-medium">
                            Step {answers.length + 1}
                        </span>
                        {answers.length > 0 && (
                            <button
                                onClick={goToPreviousStep}
                                className="text-purple-400 hover:text-purple-300 transition-colors text-sm"
                            >
                                ← Back
                            </button>
                        )}
                    </div>

                    {/* Title */}
                    <motion.h2
                        initial={{ x: -20 }}
                        animate={{ x: 0 }}
                        className="text-3xl font-bold text-white mb-3"
                    >
                        {stepData.title}
                    </motion.h2>

                    {/* Description */}
                    <p className="text-purple-200 mb-8">{stepData.description}</p>

                    {/* Input based on type */}
                    <div className="space-y-4">
                        {stepData.inputType === "choice" && (
                            <div className="grid grid-cols-1 gap-3">
                                {stepData.choices?.map((choice: StepChoice, index: number) => (
                                    <motion.button
                                        key={choice.value}
                                        initial={{ x: -50, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ scale: 1.02, x: 5 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleChoice(choice.value)}
                                        className="w-full text-left p-5 bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/40 hover:to-pink-600/40 rounded-xl border border-purple-500/30 text-white font-medium transition-all"
                                    >
                                        {choice.label}
                                    </motion.button>
                                ))}
                            </div>
                        )}

                        {stepData.inputType === "text" && (
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => handleInputChange(e.target.value)}
                                    onBlur={() => setWriting(false)}
                                    onKeyPress={(e) => e.key === "Enter" && handleTextSubmit()}
                                    placeholder="Enter your book title..."
                                    className="w-full px-6 py-4 bg-white/10 border border-purple-500/30 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 transition-colors"
                                    autoFocus
                                />
                                <button
                                    onClick={handleTextSubmit}
                                    disabled={!inputValue.trim()}
                                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                                >
                                    Continue →
                                </button>
                            </div>
                        )}

                        {stepData.inputType === "number" && (
                            <div className="space-y-4">
                                <input
                                    type="number"
                                    value={inputValue}
                                    onChange={(e) => handleInputChange(e.target.value)}
                                    onBlur={() => setWriting(false)}
                                    onKeyPress={(e) => e.key === "Enter" && handleNumberSubmit()}
                                    placeholder="Number of chapters (1-50)"
                                    min="1"
                                    max="50"
                                    className="w-full px-6 py-4 bg-white/10 border border-purple-500/30 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 transition-colors"
                                    autoFocus
                                />
                                <button
                                    onClick={handleNumberSubmit}
                                    disabled={!inputValue || parseInt(inputValue) < 1 || parseInt(inputValue) > 50}
                                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                                >
                                    Continue →
                                </button>
                            </div>
                        )}

                        {stepData.inputType === "list" && (
                            <div className="space-y-4 max-h-96 overflow-y-auto">
                                {chapterNames.map((name, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        value={name}
                                        onChange={(e) => {
                                            updateChapterName(index, e.target.value);
                                            handleInputChange(e.target.value);
                                        }}
                                        onBlur={() => setWriting(false)}
                                        placeholder={`Chapter ${index + 1} name...`}

                                        className="w-full px-6 py-3 bg-white/10 border border-purple-500/30 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 transition-colors"
                                    />
                                ))}
                                <button
                                    onClick={handleChapterNamesSubmit}
                                    disabled={!chapterNames.every(name => name.trim())}
                                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                                >
                                    Complete Setup →
                                </button>
                            </div>
                        )}

                        {stepData.inputType === "slider" && stepData.sliderConfig && (
                            <SliderInput
                                label={stepData.sliderConfig.leftLabel + " ← → " + stepData.sliderConfig.rightLabel}
                                min={stepData.sliderConfig.min}
                                max={stepData.sliderConfig.max}
                                defaultValue={stepData.sliderConfig.default}
                                leftLabel={stepData.sliderConfig.leftLabel}
                                rightLabel={stepData.sliderConfig.rightLabel}
                                onSubmit={(value) => answerStep(value)}
                            />
                        )}

                        {stepData.inputType === "multi-select" && stepData.multiSelectConfig && (
                            <MultiSelectInput
                                options={stepData.multiSelectConfig.options}
                                minSelect={stepData.multiSelectConfig.minSelect}
                                maxSelect={stepData.multiSelectConfig.maxSelect}
                                onSubmit={(values) => answerStep(values)}
                            />
                        )}
                    </div>

                    {/* Completion state */}
                    {isComplete && (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-center mt-8"
                        >
                            <div className="text-6xl mb-4">🎉</div>
                            <h3 className="text-2xl font-bold text-white mb-4">
                                Your book structure is ready!
                            </h3>
                            <p className="text-purple-200 mb-6">
                                Book Type: {useWizardStore.getState().getAnswer("BOOK_TYPE")}
                                <br />
                                Title: {useWizardStore.getState().getAnswer("BOOK_TITLE")}
                                <br />
                                Chapters: {useWizardStore.getState().getAnswer("CHAPTER_COUNT")}
                            </p>

                            <SaveToDatabase />
                        </motion.div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

// Save to Database Component
function SaveToDatabase() {
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState("");
    const { answers } = useWizardStore();

    const handleSave = async () => {
        setSaving(true);
        setError("");

        try {
            // Prepare data from wizard answers
            const wizardData = {
                title: useWizardStore.getState().getAnswer("BOOK_TITLE"),
                bookType: useWizardStore.getState().getAnswer("BOOK_TYPE"),
                genre: useWizardStore.getState().getAnswer("FICTION_GENRE"),
                category: useWizardStore.getState().getAnswer("NON_FICTION_CATEGORY"),
                targetAudience: useWizardStore.getState().getAnswer("TARGET_AUDIENCE"),
                writingTone: useWizardStore.getState().getAnswer("WRITING_TONE"),
                themes: useWizardStore.getState().getAnswer("THEMES"),
                chapters: (useWizardStore.getState().getAnswer("CHAPTER_NAMES") || []).map((title: string, index: number) => ({
                    number: index + 1,
                    title
                }))
            };

            const response = await fetch('/api/books', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(wizardData)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to save');
            }

            setSaved(true);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Something went wrong';
            setError(message);
        } finally {
            setSaving(false);
        }
    };

    if (saved) {
        return (
            <div className="text-green-400 font-medium">
                ✅ Saved to database successfully!
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <button
                onClick={handleSave}
                disabled={saving}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-green-500/50 transition-all"
            >
                {saving ? '💾 Saving...' : '💾 Save to Database'}
            </button>

            {error && (
                <div className="text-red-400 text-sm">
                    ❌ {error}
                </div>
            )}
        </div>
    );
}
