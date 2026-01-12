// Step Types and Definitions

export type StepId =
    | "INIT"
    | "BOOK_TYPE"
    | "BOOK_TITLE"
    | "FICTION_GENRE"
    | "NON_FICTION_CATEGORY"
    | "TARGET_AUDIENCE"
    | "WRITING_TONE"
    | "THEMES"
    | "CHAPTER_COUNT"
    | "CHAPTER_NAMES"
    | "COMPLETE";

export type InputType = "choice" | "text" | "number" | "list" | "slider" | "multi-select";

export interface StepChoice {
    value: string;
    label: string;
    nextStep: StepId;
    sceneEffect?: string; // 3D effect to trigger
}

export interface Step {
    id: StepId;
    title: string;
    description: string;
    inputType: InputType;
    choices?: StepChoice[];
    nextStep?: StepId; // For non-choice steps
    validate?: (value: any) => boolean;
    // Slider-specific
    sliderConfig?: {
        min: number;
        max: number;
        default: number;
        leftLabel: string;
        rightLabel: string;
    };
    // Multi-select specific
    multiSelectConfig?: {
        minSelect?: number;
        maxSelect?: number;
        options: Array<{ value: string; label: string; icon?: string }>;
    };
}

// Define all wizard steps
export const WIZARD_STEPS: Record<StepId, Step> = {
    INIT: {
        id: "INIT",
        title: "Welcome to Book Wizard",
        description: "Let's create something magical together",
        inputType: "choice",
        choices: [
            {
                value: "start",
                label: "Start Creating",
                nextStep: "BOOK_TYPE",
                sceneEffect: "glow"
            }
        ]
    },

    BOOK_TYPE: {
        id: "BOOK_TYPE",
        title: "What type of book do you want to create?",
        description: "This will help us tailor the questions for you",
        inputType: "choice",
        choices: [
            {
                value: "fiction",
                label: "📚 Fiction (Novel, Story)",
                nextStep: "FICTION_GENRE",
                sceneEffect: "add_book_fiction"
            },
            {
                value: "non-fiction",
                label: "📖 Non-Fiction (Educational, Technical)",
                nextStep: "NON_FICTION_CATEGORY",
                sceneEffect: "add_book_technical"
            }
        ]
    },

    FICTION_GENRE: {
        id: "FICTION_GENRE",
        title: "Choose your fiction genre",
        description: "What kind of story do you want to tell?",
        inputType: "choice",
        choices: [
            {
                value: "fantasy",
                label: "🧙 Fantasy",
                nextStep: "BOOK_TITLE",
                sceneEffect: "add_magic_staff"
            },
            {
                value: "sci-fi",
                label: "🚀 Science Fiction",
                nextStep: "BOOK_TITLE",
                sceneEffect: "add_hologram"
            },
            {
                value: "mystery",
                label: "🔍 Mystery",
                nextStep: "BOOK_TITLE",
                sceneEffect: "add_magnifying_glass"
            },
            {
                value: "romance",
                label: "❤️ Romance",
                nextStep: "BOOK_TITLE",
                sceneEffect: "add_rose"
            }
        ]
    },

    NON_FICTION_CATEGORY: {
        id: "NON_FICTION_CATEGORY",
        title: "What's your non-fiction category?",
        description: "Select the type of educational content",
        inputType: "choice",
        choices: [
            {
                value: "programming",
                label: "💻 Programming/Software",
                nextStep: "BOOK_TITLE",
                sceneEffect: "add_laptop"
            },
            {
                value: "business",
                label: "💼 Business/Finance",
                nextStep: "BOOK_TITLE",
                sceneEffect: "add_briefcase"
            },
            {
                value: "science",
                label: "🔬 Science/Research",
                nextStep: "BOOK_TITLE",
                sceneEffect: "add_microscope"
            },
            {
                value: "self-help",
                label: "🌟 Self-Help/Personal Development",
                nextStep: "BOOK_TITLE",
                sceneEffect: "add_star"
            }
        ]
    },

    BOOK_TITLE: {
        id: "BOOK_TITLE",
        title: "What's the title of your book?",
        description: "Give your book a name",
        inputType: "text",
        nextStep: "TARGET_AUDIENCE",
        validate: (value: string) => value.length >= 3
    },

    TARGET_AUDIENCE: {
        id: "TARGET_AUDIENCE",
        title: "Who is your target audience?",
        description: "Select the primary readers for your book",
        inputType: "choice",
        choices: [
            {
                value: "children",
                label: "👶 Children (ages 3-12)",
                nextStep: "WRITING_TONE"
            },
            {
                value: "young-adult",
                label: "🎒 Young Adult (ages 13-18)",
                nextStep: "WRITING_TONE"
            },
            {
                value: "adults",
                label: "👨‍💼 Adults (ages 18+)",
                nextStep: "WRITING_TONE"
            },
            {
                value: "professionals",
                label: "💼 Professionals/Academics",
                nextStep: "WRITING_TONE"
            }
        ]
    },

    WRITING_TONE: {
        id: "WRITING_TONE",
        title: "Choose your writing style",
        description: "How formal should the tone be?",
        inputType: "slider",
        nextStep: "THEMES",
        sliderConfig: {
            min: 1,
            max: 10,
            default: 5,
            leftLabel: "Casual & Playful",
            rightLabel: "Formal & Academic"
        }
    },

    THEMES: {
        id: "THEMES",
        title: "Select themes for your book",
        description: "Pick 1-3 themes that will be central to your story",
        inputType: "multi-select",
        nextStep: "CHAPTER_COUNT",
        multiSelectConfig: {
            minSelect: 1,
            maxSelect: 3,
            options: [
                { value: "love", label: "Love & Romance", icon: "❤️" },
                { value: "adventure", label: "Adventure", icon: "🗺️" },
                { value: "mystery", label: "Mystery & Suspense", icon: "🔍" },
                { value: "coming-of-age", label: "Coming of Age", icon: "🌱" },
                { value: "good-vs-evil", label: "Good vs Evil", icon: "⚔️" },
                { value: "redemption", label: "Redemption", icon: "✨" },
                { value: "survival", label: "Survival", icon: "🏔️" },
                { value: "betrayal", label: "Betrayal & Trust", icon: "🎭" }
            ]
        }
    },

    CHAPTER_COUNT: {
        id: "CHAPTER_COUNT",
        title: "How many chapters will your book have?",
        description: "Choose between 1 and 50 chapters",
        inputType: "number",
        nextStep: "CHAPTER_NAMES",
        validate: (value: number) => value >= 1 && value <= 50
    },

    CHAPTER_NAMES: {
        id: "CHAPTER_NAMES",
        title: "Name your chapters",
        description: "Provide a name for each chapter",
        inputType: "list",
        nextStep: "COMPLETE"
    },

    COMPLETE: {
        id: "COMPLETE",
        title: "✨ Your book structure is ready!",
        description: "We've created the foundation for your book",
        inputType: "choice",
        choices: [
            {
                value: "save",
                label: "Save to Database",
                nextStep: "COMPLETE"
            },
            {
                value: "export",
                label: "Export as JSON",
                nextStep: "COMPLETE"
            }
        ]
    }
};
