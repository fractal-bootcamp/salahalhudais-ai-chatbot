'use client';
import { useEffect, useState } from 'react';

type Session = {
  id: string;
  createdAt: number;
};

export function SessionsList() {
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    fetch('/api/sessions')
      .then(res => res.json())
      .then(data => setSessions(data))
      .catch(error => console.error('Error fetching sessions:', error));
  }, []);

  return (
    <div>
      <h2>Chat Sessions</h2>
      <ul>
        {sessions.map(session => (
          <li key={session.id}>
            {new Date(session.createdAt * 1000).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
}