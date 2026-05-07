import ChatInterface from '@/components/chat/ChatInterface';

export default async function ChatPage({ params }) {
  const { id } = await params;
  return <ChatInterface chatId={id} />;
}
