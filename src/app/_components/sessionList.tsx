'use client';

import Link from 'next/link';
import { SessionInfo } from '~/tools/chat-store';
import { KebabMenu } from "~/components/kebab-menu";
import { useRouter } from 'next/navigation';
import { toast } from "sonner";

export default function SessionList({ sessions }: { sessions: SessionInfo[] }) {
  const router = useRouter();

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/sessions/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete chat');
      
      toast.success('Chat deleted');
      router.refresh();
    } catch (error) {
      toast.error('Failed to delete chat');
      console.error('Error deleting chat:', error);
    }
  };

  return (
    <div className="overflow-y-auto">
      <h2 className="mb-2 px-2 text-xs font-semibold text-gray-500">Chat History</h2>
      <ul className="space-y-1">
        {sessions.length === 0 ? (
          <li className="px-2 py-1 text-sm text-gray-500 italic">
            No chats yet
          </li>
        ) : (
          sessions.map(session => (
            <li key={session.id} className="group relative hover:bg-gray-200 rounded-lg">
              <div className="flex items-center justify-between px-2 py-1">
                <Link
                  href={`/chat/${session.id}`}
                  className="flex items-center text-xs text-gray-700 w-12"
                >
                  <span className="mr-2 flex-shrink-0">💬</span>
                  <span className="truncate">{session.title}</span>
                </Link>
                <div className="flex-shrink-0 ml-2 opacity-0 group-hover:opacity-100">
                  <KebabMenu
                    onDelete={() => handleDelete(session.id)}
                    onEdit={() => toast.info('Edit functionality coming soon')}
                    onShare={() => toast.info('Share functionality coming soon')}
                  />
                </div>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}