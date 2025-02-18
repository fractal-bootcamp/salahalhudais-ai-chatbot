'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function SessionList() {
  const [sessionIds, setSessionIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSessionIds = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/sessions');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSessionIds(data.sessions);
      } catch (error) {
        console.error('Failed to fetch session IDs:', error);
        setError('Failed to load chat sessions');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessionIds();
  }, []);

  if (isLoading) {
    return <div className="p-4 text-gray-500">Loading sessions...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

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
                Chat {id.slice(0, 8)}...
              </Link>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}