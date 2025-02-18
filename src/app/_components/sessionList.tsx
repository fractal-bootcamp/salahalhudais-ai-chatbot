'use client';

import Link from 'next/link';

export default function SessionList({sessionIds}: {sessionIds: number[]}) {

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <h2 className="px-4 py-3 text-sm font-medium text-gray-700 border-b border-gray-100">
        Chat History
      </h2>
      <ul className="divide-y divide-gray-100">
        {sessionIds.length === 0 ? (
          <li className="px-4 py-3 text-sm text-gray-500 italic">
            No chats yet
          </li>
        ) : (
          sessionIds.map(id => (
            <li key={id}>
              <Link
                href={`/chat/${id}`}
                className="px-4 py-3 flex items-center text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <span className="mr-2">💬</span>
                Chat {id}...
              </Link>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}