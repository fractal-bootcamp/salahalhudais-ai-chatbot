'use client';
import { useChat } from '@ai-sdk/react';
import { useEffect, useState } from 'react';

export default function Chat() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState([]);

  const { input, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat',
    body: { sessionId },
    onFinish: async (message) => {
      await fetch('/api/messages', {
        method: 'POST',
        body: JSON.stringify({
          sessionId,
          content: message.content,
          role: 'assistant'
        })
      });
    }
  });

  useEffect(() => {
    fetch('/api/sessions', { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        setSessionId(data.id);
        return fetch(`/api/messages?sessionId=${data.id}`);
      })
      .then(res => res.json())
      .then(messages => {
        setMessages(messages);
      });
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/messages', {
      method: 'POST',
      body: JSON.stringify({
        sessionId,
        content: input,
        role: 'user'
      })
    });

    handleSubmit(e);
  };

  return (
    <div>
      <ul>
        {messages.map((m, index) => (
          <li key={index}>
            {m.role === 'user' ? 'User: ' : 'AI: '}
            {m.content}
          </li>
        ))}
      </ul>
      <form onSubmit={onSubmit}>
        <input value={input} onChange={handleInputChange} />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}