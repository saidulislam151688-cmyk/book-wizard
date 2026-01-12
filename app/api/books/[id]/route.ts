import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { updateBookSchema } from '@/lib/validations';

export const dynamic = 'force-dynamic';


// GET /api/books/[id] - Get a specific book
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const { data: book, error } = await supabase
            .from('books')
            .select(`
        *,
        chapters (
          id,
          chapter_number,
          title,
          created_at
        )
      `)
            .eq('id', id)
            .single();

        if (error) throw error;

        if (!book) {
            return NextResponse.json({
                success: false,
                error: 'Book not found'
            }, { status: 404 });
        }

        // Sort chapters by number
        if (book.chapters) {
            book.chapters.sort((a: any, b: any) => a.chapter_number - b.chapter_number);
        }

        return NextResponse.json({
            success: true,
            book
        });

    } catch (error: any) {
        console.error('Error fetching book:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to fetch book'
        }, { status: 500 });
    }
}

// PUT /api/books/[id] - Update a book
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const body = await request.json();
        const validatedData = updateBookSchema.parse(body);

        const { data: book, error } = await supabase
            .from('books')
            .update({
                title: validatedData.title,
                book_type: validatedData.bookType,
                genre: validatedData.genre,
                category: validatedData.category,
                target_audience: validatedData.targetAudience,
                writing_tone: validatedData.writingTone,
                themes: validatedData.themes
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        // Update chapters if provided
        if (validatedData.chapters) {
            // Delete existing chapters
            await supabase
                .from('chapters')
                .delete()
                .eq('book_id', id);

            // Insert new chapters
            const chaptersData = validatedData.chapters.map(ch => ({
                book_id: id,
                chapter_number: ch.number,
                title: ch.title
            }));

            await supabase
                .from('chapters')
                .insert(chaptersData);
        }

        return NextResponse.json({
            success: true,
            message: 'Book updated successfully'
        });

    } catch (error: any) {
        console.error('Error updating book:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to update book'
        }, { status: 400 });
    }
}

// DELETE /api/books/[id] - Delete a book
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const { error } = await supabase
            .from('books')
            .delete()
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({
            success: true,
            message: 'Book deleted successfully'
        });

    } catch (error: any) {
        console.error('Error deleting book:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to delete book'
        }, { status: 500 });
    }
}
