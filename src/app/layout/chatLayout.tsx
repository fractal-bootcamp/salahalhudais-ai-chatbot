import SessionList from '../_components/sessionList';
import { getSessionsInfo } from '~/tools/chat-store';
import Link from 'next/link';

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sessions = await getSessionsInfo();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 border-r border-gray-200 bg-gray-100 p-4">
        <Link
          href="/chat"
          className="mb-4 flex w-full items-center justify-center rounded-md bg-white p-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        >
          <span className="mr-2">+</span> New Chat
        </Link>
        <SessionList sessions={sessions} />
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col">
        {children}
      </div>
    </div>
  );
}