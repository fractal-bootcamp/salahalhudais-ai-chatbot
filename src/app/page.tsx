'use client';

import { useChat } from '@ai-sdk/react';

export default function Page() {
  const { messages, setMessages, input, handleInputChange, handleSubmit, status, stop } = useChat({});

  const handleDelete = (id: string) => {
    setMessages(messages.filter(message => message.id !== id));
  }


  return (
    <>
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
    </>
  );
}