import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectMongo from '@/lib/mongodb';
import Chat from '@/models/Chat';
import Message from '@/models/Message';

export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Wait for params in Next.js 15
    const { id } = await params;

    await connectMongo();

    const chat = await Chat.findOne({ _id: id, userId: session.user.id });

    if (!chat) {
      return NextResponse.json({ message: 'Chat not found' }, { status: 404 });
    }

    const messages = await Message.find({ chatId: id }).sort({ createdAt: 1 });

    return NextResponse.json({ chat, messages }, { status: 200 });
  } catch (error) {
    console.error('Error fetching chat:', error);
    return NextResponse.json(
      { message: 'Failed to fetch chat' },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await connectMongo();

    const chat = await Chat.findOneAndDelete({ _id: id, userId: session.user.id });

    if (!chat) {
      return NextResponse.json({ message: 'Chat not found' }, { status: 404 });
    }

    await Message.deleteMany({ chatId: id });

    return NextResponse.json({ message: 'Chat deleted' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting chat:', error);
    return NextResponse.json(
      { message: 'Failed to delete chat' },
      { status: 500 }
    );
  }
}

export async function PATCH(req, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { title } = await req.json();

    if (!title) {
      return NextResponse.json({ message: 'Title is required' }, { status: 400 });
    }

    await connectMongo();

    const chat = await Chat.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { title },
      { new: true }
    );

    if (!chat) {
      return NextResponse.json({ message: 'Chat not found' }, { status: 404 });
    }

    return NextResponse.json(chat, { status: 200 });
  } catch (error) {
    console.error('Error renaming chat:', error);
    return NextResponse.json(
      { message: 'Failed to rename chat' },
      { status: 500 }
    );
  }
}
