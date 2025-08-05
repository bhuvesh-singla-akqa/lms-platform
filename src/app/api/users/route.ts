import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

// GET - Fetch all users
export async function GET() {
  try {
    // Dynamic import to avoid build-time issues
    const { prisma } = await import('@/lib/prisma');

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new user or update existing user role
export async function POST(request: NextRequest) {
  try {
    // Dynamic import to avoid build-time issues
    const { prisma } = await import('@/lib/prisma');
    const { name, email, role } = await request.json();

    if (!email || !role) {
      return NextResponse.json(
        { message: 'Email and role are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      // Update existing user's role
      const updatedUser = await prisma.user.update({
        where: { email },
        data: { role },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      });

      return NextResponse.json({
        message: 'User role updated successfully',
        user: updatedUser,
        action: 'updated',
      });
    } else {
      // Create new user
      if (!name) {
        return NextResponse.json(
          { message: 'Name is required for new users' },
          { status: 400 }
        );
      }

      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          role,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      });

      return NextResponse.json({
        message: 'User created successfully',
        user: newUser,
        action: 'created',
      });
    }
  } catch (error) {
    console.error('Error managing user:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update user role
export async function PUT(request: NextRequest) {
  try {
    // Dynamic import to avoid build-time issues
    const { prisma } = await import('@/lib/prisma');
    const { id, email, role } = await request.json();

    if (!role) {
      return NextResponse.json(
        { message: 'Role is required' },
        { status: 400 }
      );
    }

    if (!id && !email) {
      return NextResponse.json(
        { message: 'User ID or email is required' },
        { status: 400 }
      );
    }

    // Find user by ID or email
    const whereClause = id ? { id } : { email };

    const existingUser = await prisma.user.findUnique({
      where: whereClause,
    });

    if (!existingUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Update user role
    const updatedUser = await prisma.user.update({
      where: whereClause,
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      message: 'User role updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
