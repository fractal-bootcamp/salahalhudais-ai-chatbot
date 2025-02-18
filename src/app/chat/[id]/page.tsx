import { loadChat } from '~/tools/chat-store';
import Chat from '~/app/_components/chat';

export default async function ChatPage(props: { params: Promise<{ id: number }> }) {
  const { id } = await props.params; // get the chat ID from the URL
  const messages = await loadChat(id); // load the chat messages
  return <Chat chatId={id} initialMessages={messages} />;
}