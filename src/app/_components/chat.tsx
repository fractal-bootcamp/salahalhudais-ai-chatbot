'use client';

import { Message, useChat } from '@ai-sdk/react';
import { useRef, useState } from 'react';

type ChatProps = {
  chatId: string;
  initialMessages: Message[];
};

export default function Chat({ chatId, initialMessages }: ChatProps) {
  const { messages, input, handleSubmit, handleInputChange, status } = useChat({
    id: chatId,
    initialMessages,
  });

  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] bg-white rounded-lg shadow-sm border border-gray-100">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={`${message.id}-${index}`}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800'
                }`}
            >
              <div className="text-sm">{message.content}</div>

              {/* Image Attachments */}
              {message.experimental_attachments?.filter(attachment =>
                attachment?.contentType?.startsWith('image/')
              ).map((attachment, attachmentIndex) => (
                <img
                  key={`${message.id}-${index}-${attachmentIndex}`}
                  src={attachment.url}
                  alt={attachment.name}
                  className="mt-2 rounded-md max-w-full"
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={event => {
          handleSubmit(event, {
            experimental_attachments: files,
          });
          setFiles(undefined);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }}
        className="border-t border-gray-100 p-4 space-y-4"
      >
        <div className="flex items-center space-x-4">
          <input
            type="file"
            onChange={event => {
              if (event.target.files) {
                setFiles(event.target.files);
              }
            }}
            multiple
            ref={fileInputRef}
            className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 
                     file:rounded-full file:border-0 file:text-sm file:font-semibold
                     file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <div className="flex space-x-4">
          <input
            value={input}
            placeholder="Send a message..."
            onChange={handleInputChange}
            disabled={status !== 'ready'}
            className="flex-1 min-w-0 rounded-lg border border-gray-200 px-4 py-2 text-sm
                     focus:outline-none focus:border-blue-500 disabled:opacity-50
                     disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={status !== 'ready'}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium
                     hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}