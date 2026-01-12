import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Avoid throwing at top level to prevent build-time failures during static analysis
export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseKey || 'placeholder'
);


// Types
export interface Book {
    id: string;
    title: string;
    book_type: string;
    genre?: string;
    category?: string;
    target_audience?: string;
    writing_tone?: number;
    themes?: string[];
    created_at: string;
    updated_at: string;
}

export interface Chapter {
    id: string;
    book_id: string;
    chapter_number: number;
    title: string;
    created_at: string;
}

export interface BookWithChapters extends Book {
    chapters: Chapter[];
}
