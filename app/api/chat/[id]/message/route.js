import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectMongo from '@/lib/mongodb';
import Chat from '@/models/Chat';
import Message from '@/models/Message';
import { generateAIResponse } from '@/lib/gemini';

export async function POST(req, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { content } = await req.json();

    if (!content) {
      return NextResponse.json(
        { message: 'Message content is required' },
        { status: 400 }
      );
    }

    await connectMongo();

    const chat = await Chat.findOne({ _id: id, userId: session.user.id });

    if (!chat) {
      return NextResponse.json({ message: 'Chat not found' }, { status: 404 });
    }

    // Save user message
    const userMessage = await Message.create({
      chatId: id,
      sender: 'user',
      content,
    });

    // Fetch previous messages for context
    const previousMessages = await Message.find({ chatId: id })
      .sort({ createdAt: 1 })
      .lean();

    // Call Gemini API
    const aiResponseContent = await generateAIResponse(content, previousMessages);

    // Save AI message
    const aiMessage = await Message.create({
      chatId: id,
      sender: 'ai',
      content: aiResponseContent,
    });

    // Update chat updated timestamp
    chat.updatedAt = new Date();
    // Auto-generate title if this is the first message and title is default
    if (chat.title === 'New Chat' && previousMessages.length <= 1) {
       try {
         const titlePrompt = `Generate a very short title (max 4 words) summarizing this message: "${content}"`;
         const newTitle = await generateAIResponse(titlePrompt, []);
         chat.title = newTitle.replace(/["']/g, '').trim();
       } catch (e) {
         console.error('Failed to generate title', e);
       }
    }
    
    await chat.save();

    return NextResponse.json(
      { userMessage, aiMessage, chatTitle: chat.title },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { message: 'Failed to send message' },
      { status: 500 }
    );
  }
}
