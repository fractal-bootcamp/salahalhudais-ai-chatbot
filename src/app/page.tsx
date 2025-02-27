import SessionList from './_components/sessionList';
import Chat from './_components/chat';
import { getSessionIds } from '~/tools/chat-store';
import Link from 'next/link';

export default function Page() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <p className="text-gray-500">Select a chat or start a new one</p>
    </div>
  );
}