import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const revalidate = 0;
export const fetchCache = 'force-no-store';

// GET - Fetch single training by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Dynamic import to avoid build-time issues
    const { prisma } = await import('@/lib/prisma');
    const { id } = params;

    const training = await prisma.training.findUnique({
      where: { id },
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

    if (!training) {
      return NextResponse.json(
        { message: 'Training not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(training);
  } catch (error) {
    console.error('Error fetching training:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update training
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  let updateData: Record<string, any> = {};
  try {
    // Dynamic import to avoid build-time issues
    const { prisma } = await import('@/lib/prisma');
    const { id } = params;
    const data = await request.json();
    console.log('PUT /api/trainings/[id] called', { id, data });

    // Only allow valid fields to be updated
    const allowedFields = [
      'title',
      'description',
      'category',
      'conductedBy',
      'dateTime',
      'meetingLink',
      'videoUrl',
      'pptUrl',
      'summary',
      'instructorId',
    ];
    for (const key of allowedFields) {
      if (data[key] !== undefined) {
        updateData[key] = data[key];
      }
    }

    // Validate category if present
    const validCategories = ['FE', 'BE', 'QA', 'General'];
    if (updateData.category) {
      const cat =
        typeof updateData.category === 'string'
          ? updateData.category.toUpperCase()
          : updateData.category;
      const matched = validCategories.find(c => c.toUpperCase() === cat);
      if (!matched) {
        return NextResponse.json(
          { message: 'Invalid category' },
          { status: 400 }
        );
      }
      updateData.category = matched;
    }

    if (updateData.dateTime) {
      updateData.dateTime = new Date(updateData.dateTime);
    }

    const updatedTraining = await prisma.training.update({
      where: { id },
      data: updateData,
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

    return NextResponse.json(updatedTraining);
  } catch (error) {
    console.error('Error updating training:', error);
    console.error('Update payload:', JSON.stringify(updateData, null, 2));
    const errorMsg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        message: 'Internal server error',
        error: errorMsg,
        payload: updateData,
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete training
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Dynamic import to avoid build-time issues
    const { prisma } = await import('@/lib/prisma');
    const { id } = params;

    await prisma.training.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Training deleted successfully' });
  } catch (error) {
    console.error('Error deleting training:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
