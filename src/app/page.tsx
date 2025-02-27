'use client';

import { useChat } from '@ai-sdk/react';
import { SessionsList } from './session-list';

export default function Page() {
  const { messages, setMessages, input, handleInputChange, handleSubmit, status, stop } = useChat({});

  const handleDelete = (id: string) => {
    setMessages(messages.filter(message => message.id !== id));
  }


  return (
    <div className="flex">
      <div className="w-1/4">
        <SessionsList />
      </div>
      <div className="w-3/4">
        {messages.map(message => (
          <div key={message.id}>
            {message.role === 'user' ? 'User: ' : 'AI: '}
            {message.content}
            <button onClick={() => handleDelete(message.id)}>Delete</button>
          </div>
        ))}
        <form onSubmit={handleSubmit}>
          <input name="prompt" value={input} onChange={handleInputChange} />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}