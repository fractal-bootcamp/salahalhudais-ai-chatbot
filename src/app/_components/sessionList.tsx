'use client';

import Link from 'next/link';

export default function SessionList({ sessionIds }: { sessionIds: number[] }) {
  return (
    <div className="overflow-y-auto">
      <h2 className="mb-2 px-2 text-xs font-semibold text-gray-500">Chat History</h2>
      <ul className="space-y-1">
        {sessionIds.length === 0 ? (
          <li className="px-2 py-1 text-sm text-gray-500 italic">
            No chats yet
          </li>
        ) : (
          sessionIds.map(id => (
            <li key={id}>
              <Link
                href={`/chat/${id}`}
                className="flex items-center rounded-lg px-2 py-2 text-sm text-gray-700 hover:bg-gray-200"
              >
                <span className="mr-2">💬</span>
                Chat {id}
              </Link>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}