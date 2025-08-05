import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { addToWaitlist, checkEmailExists } from '@/lib/db/waitlist';

// Validation schema
const waitlistSchema = z.object({
  email: z.string().email('Invalid email address'),
  useCase: z.string().min(5, 'Please provide at least 5 characters describing your use case').max(1000, 'Use case description too long'),
  source: z.string().optional().default('popup')
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = waitlistSchema.parse(body);
    
    // Check if email already exists
    const emailExists = await checkEmailExists(validatedData.email);
    if (emailExists) {
      return NextResponse.json({
        success: false,
        message: 'This email is already on the waitlist'
      }, { status: 409 });
    }
    
    // Add to waitlist
    const result = await addToWaitlist({
      email: validatedData.email,
      useCase: validatedData.useCase,
      source: validatedData.source
    });
    
    return NextResponse.json({
      success: true,
      message: 'Successfully joined waitlist',
      data: {
        email: result.email,
        position: result.position,
        id: result.id
      }
    }, { status: 201 });
    
  } catch (error) {
    console.error('Waitlist signup error:', error);
    
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: 'Validation failed',
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      }, { status: 400 });
    }
    
    // Handle database errors
    if (error instanceof Error) {
      // Handle duplicate email constraint
      if (error.message.includes('duplicate key') || error.message.includes('unique constraint')) {
        return NextResponse.json({
          success: false,
          message: 'This email is already on the waitlist'
        }, { status: 409 });
      }
      
      // Handle other database errors
      if (error.message.includes('database') || error.message.includes('connection')) {
        return NextResponse.json({
          success: false,
          message: 'Database error. Please try again later.'
        }, { status: 503 });
      }
    }
    
    // Generic error
    return NextResponse.json({
      success: false,
      message: 'Failed to join waitlist. Please try again.'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Waitlist API endpoint'
  });
} 