import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createBookSchema } from '@/lib/validations';

export const dynamic = 'force-dynamic';


// POST /api/books - Create a new book
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate input
        const validatedData = createBookSchema.parse(body);

        // Insert book
        const { data: book, error: bookError } = await supabase
            .from('books')
            .insert({
                title: validatedData.title,
                book_type: validatedData.bookType,
                genre: validatedData.genre,
                category: validatedData.category,
                target_audience: validatedData.targetAudience,
                writing_tone: validatedData.writingTone,
                themes: validatedData.themes
            })
            .select()
            .single();

        if (bookError) throw bookError;

        // Insert chapters
        if (validatedData.chapters && validatedData.chapters.length > 0) {
            const chaptersData = validatedData.chapters.map(ch => ({
                book_id: book.id,
                chapter_number: ch.number,
                title: ch.title
            }));

            const { error: chaptersError } = await supabase
                .from('chapters')
                .insert(chaptersData);

            if (chaptersError) throw chaptersError;
        }

        return NextResponse.json({
            success: true,
            bookId: book.id,
            message: 'Book created successfully'
        }, { status: 201 });

    } catch (error: any) {
        console.error('Error creating book:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to create book'
        }, { status: 400 });
    }
}

// GET /api/books - List all books
export async function GET() {
    try {
        const { data: books, error } = await supabase
            .from('books')
            .select(`
        *,
        chapters (
          id,
          chapter_number,
          title
        )
      `)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return NextResponse.json({
            success: true,
            books: books || []
        });

    } catch (error: any) {
        console.error('Error fetching books:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to fetch books'
        }, { status: 500 });
    }
}
