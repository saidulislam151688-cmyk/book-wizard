import { create } from "zustand";
import { StepId, WIZARD_STEPS } from "./wizard-steps";

interface WizardAnswer {
    stepId: StepId;
    value: any;
}

interface WizardState {
    // Current state
    currentStep: StepId;
    answers: WizardAnswer[];
    isComplete: boolean;
    isWriting: boolean;
    tempInput: string; // Used for real-time text appearance on the book

    // Actions
    startWizard: () => void;
    answerStep: (value: any) => void;
    goToPreviousStep: () => void;
    resetWizard: () => void;
    setWriting: (isWriting: boolean) => void;
    setTempInput: (value: string) => void;

    // Getters
    getCurrentStepData: () => any;
    getAnswer: (stepId: StepId) => any;
}

export const useWizardStore = create<WizardState>((set, get) => ({
    // Initial state
    currentStep: "INIT",
    answers: [],
    isComplete: false,
    isWriting: false,
    tempInput: "",

    // Start the wizard
    startWizard: () => {
        set({ currentStep: "INIT", answers: [], isComplete: false, isWriting: false, tempInput: "" });
    },

    // Answer current step and move to next
    answerStep: (value: any) => {
        const { currentStep, answers } = get();
        const stepData = WIZARD_STEPS[currentStep];

        // Validate if validation exists
        if (stepData.validate && !stepData.validate(value)) {
            console.error("Validation failed for step:", currentStep);
            return;
        }

        // Save the answer
        const newAnswer: WizardAnswer = {
            stepId: currentStep,
            value
        };
        const updatedAnswers = [...answers, newAnswer];

        // Determine next step (THE BRAIN LOGIC)
        let nextStep: StepId;

        if (stepData.inputType === "choice") {
            // For choices, find which choice was selected
            const selectedChoice = stepData.choices?.find(c => c.value === value);
            nextStep = selectedChoice?.nextStep || "COMPLETE";
        } else {
            // For other input types, use predefined nextStep
            nextStep = stepData.nextStep || "COMPLETE";
        }

        // Check if wizard is complete
        const isComplete = nextStep === "COMPLETE";

        set({
            answers: updatedAnswers,
            currentStep: nextStep,
            isComplete,
            tempInput: "" // Reset temp input on step completion
        });
    },

    // Go back to previous step
    goToPreviousStep: () => {
        const { answers } = get();
        if (answers.length === 0) return;

        // Remove last answer
        const updatedAnswers = answers.slice(0, -1);

        // Get previous step
        const previousStep = updatedAnswers.length > 0
            ? updatedAnswers[updatedAnswers.length - 1].stepId
            : "INIT";

        set({
            answers: updatedAnswers,
            currentStep: previousStep,
            isComplete: false,
            tempInput: ""
        });
    },

    // Reset wizard
    resetWizard: () => {
        set({
            currentStep: "INIT",
            answers: [],
            isComplete: false,
            isWriting: false,
            tempInput: ""
        });
    },

    setWriting: (isWriting: boolean) => set({ isWriting }),
    setTempInput: (tempInput: string) => set({ tempInput }),

    // Get current step data
    getCurrentStepData: () => {
        const { currentStep } = get();
        return WIZARD_STEPS[currentStep];
    },

    // Get specific answer
    getAnswer: (stepId: StepId) => {
        const { answers } = get();
        const answer = answers.find(a => a.stepId === stepId);
        return answer?.value;
    }
}));
