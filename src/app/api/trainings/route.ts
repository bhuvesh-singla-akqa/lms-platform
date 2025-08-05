import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

// Define valid categories as a const array for type safety
const VALID_CATEGORIES = ['FE', 'BE', 'QA', 'General'] as const;
type ValidCategory = (typeof VALID_CATEGORIES)[number];

// GET - Fetch all trainings
export async function GET(request: NextRequest) {
  try {
    // Dynamic import to avoid build-time issues
    const { prisma } = await import('@/lib/prisma');
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const upcoming = searchParams.get('upcoming');

    // Build where clause dynamically
    const whereClause: any = {};

    if (category && category !== 'all') {
      const categoryUpper = category.toUpperCase();
      if (VALID_CATEGORIES.includes(categoryUpper as ValidCategory)) {
        whereClause.category = categoryUpper;
      }
    }

    if (upcoming === 'true') {
      whereClause.dateTime = {
        gte: new Date(),
      };
    }

    const trainings = await prisma.training.findMany({
      where: whereClause,
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        dateTime: 'asc',
      },
    });

    return NextResponse.json(trainings);
  } catch (error) {
    console.error('Error fetching trainings:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new training
export async function POST(request: NextRequest) {
  try {
    // Dynamic import to avoid build-time issues
    const { prisma } = await import('@/lib/prisma');
    const {
      title,
      description,
      category,
      conductedBy,
      dateTime,
      meetingLink,
      videoUrl,
      pptUrl,
      summary,
      instructorId,
    } = await request.json();

    if (
      !title ||
      !description ||
      !category ||
      !conductedBy ||
      !dateTime ||
      !meetingLink ||
      !instructorId
    ) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate category
    if (!VALID_CATEGORIES.includes(category as ValidCategory)) {
      return NextResponse.json(
        { message: 'Invalid category' },
        { status: 400 }
      );
    }

    // Create new training
    const newTraining = await prisma.training.create({
      data: {
        title,
        description,
        category,
        conductedBy,
        dateTime: new Date(dateTime),
        meetingLink,
        videoUrl: videoUrl || null,
        pptUrl: pptUrl || null,
        summary: summary || null,
        instructorId,
      },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: 'Training created successfully',
      training: newTraining,
    });
  } catch (error) {
    console.error('Error creating training:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
