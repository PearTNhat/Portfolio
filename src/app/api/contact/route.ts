import { NextResponse } from 'next/server';
import { ContactFormInput } from '@/types/contact';

export async function POST(request: Request) {
  try {
    const body: ContactFormInput = await request.json();

    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields (name, email, message)',
        },
        { status: 400 }
      );
    }

    // In static / prototype mode or until Golang BE is connected:
    const record = {
      id: `msg-${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
      status: 'unread',
    };

    return NextResponse.json(
      {
        success: true,
        data: record,
        message: 'Message received successfully',
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: 'Invalid request payload',
      },
      { status: 500 }
    );
  }
}
