'use client';
import { Message, useChat } from '@ai-sdk/react';
import { useRef, useState } from 'react';
import ModelSelector from './modelSelector';
import { cn } from "~/lib/utils";
import { CodeBlock } from "~/code-block";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { PaperclipIcon, SendIcon } from "lucide-react";
import { UIMessage } from 'ai';
import { ModelId } from '../types/models';
import { ToolInvocation } from 'ai';

type ChatProps = {
  chatId: number;
  initialMessages: Message[];
};

export type ChatRequestBody = {
  messages: UIMessage[],
  id: number,
  model: ModelId
}

export default function Chat({ chatId, initialMessages }: ChatProps) {
  const [selectedModel, setSelectedModel] = useState<ModelId>('gpt-4o-mini');
  const { messages, input, handleSubmit, handleInputChange, status, error, addToolResult } = useChat({
    maxSteps: 5,
    id: chatId.toString(),
    initialMessages,
    body: {
      model: selectedModel,
    },

    async onToolCall({ toolCall}) {
      if (toolCall.toolName === 'getLocation') {
        const cities = [
          'New York',
          'Los Angeles',
          'Chicago',
          'San Franciso',
        ];
        return cities[Math.floor(Math.random() * cities.length)];
      }
    },
    experimental_prepareRequestBody({ messages }) {
      return {
        messages,
        id: chatId,
        model: selectedModel
      }
    },
  });
  // console.log(status, error)

  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(event.target.files);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="h-14 border-b flex items-center px-4">
        <ModelSelector 
          selectedModel={selectedModel} 
          onModelChange={setSelectedModel} 
        />
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto py-4 px-4">
          {messages.map((message, index) => (
            <div key={index}>
              {
                message.parts.map(part => {
                  switch (part.type) {
                    case 'text':
                      return <ChatMessage key={`${message.id}-${index}`} message={message} />

                    case 'tool-invocation': {
                      const callId = part.toolInvocation.toolCallId;

                      switch (part.toolInvocation.toolName) {
                        case 'askForConfirmation': {
                          switch (part.toolInvocation.state) {
                            case 'call':
                              return (
                                <div key={callId}>
                                  {part.toolInvocation.args.message}
                                  <div>
                                    <button
                                      onClick={() => 
                                        addToolResult({
                                          toolCallId: callId,
                                          result: 'Yes, confirmed.',
                                        })
                                      }
                                    >
                                      Yes
                                    </button>
                                    <button
                                      onClick={() =>
                                        addToolResult({
                                          toolCallId: callId,
                                          result: 'No, denied',
                                        })
                                      }
                                      >
                                        No
                                      </button>
                                    </div>
                                </div>
                              );
                            case 'result':
                              return (
                                <div key={callId}>
                                  Location access allows:{' '}
                                  {part.toolInvocation.result}
                                </div>
                              );
                          }
                          break;
                        }
                        case 'getLocation': {
                          switch(part.toolInvocation.state) {
                            case 'call':
                              return <div key={callId}> Getting location...</div>
                            case 'result':
                              return (
                                <div key={callId}>
                                  Location: {part.toolInvocation.result}
                                </div>
                              );
                          }
                          break;
                        }

                        case 'getWeatherInformation': {
                          switch (part.toolInvocation.state) {
                            case 'partial-call':
                              return (
                                <pre key={callId}>
                                  {JSON.stringify(part.toolInvocation, null, 2)}
                                </pre>
                              );
                            case 'call':
                              return (
                                <div key={callId} className="flex items-center gap-2 text-muted-foreground">
                                  <div className="animate-spin">⌛</div>
                                  <span>Fetching weather data for {part.toolInvocation.args.city}...</span>
                                </div>
                              );
                            case 'result':
                              return (
                                <div key={callId} className="rounded-lg border bg-card p-4 shadow-sm">
                                  <div className="flex items-center gap-2 font-medium text-foreground">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="20"
                                      height="20"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="text-blue-500"
                                    >
                                      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
                                    </svg>
                                    <span>Weather Report for {part.toolInvocation.args.city}</span>
                                  </div>
                                  <div className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
                                    {part.toolInvocation.result}
                                  </div>
                                </div>
                              );
                          }
                          break;
                        }
                      }
                    }
                  }
                })
              }
            </div>
          ))}
        </div>
      </div>
      <div className="border-t bg-background">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit}>
            {}
            {files && (
              <div className="px-4 py-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <PaperclipIcon className="h-3 w-3" />
                  <span>{files.length} files selected</span>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2 p-4">
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                className="shrink-0"
                onClick={() => fileInputRef.current?.click()}
              >
                <PaperclipIcon className="h-5 w-5 text-muted-foreground" />
              </Button>
              
              <Input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                multiple
              />
              
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder="Send a message..."
                disabled={status !== 'ready'}
                className="min-h-[44px] border-0 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none text-[#09090b] placeholder:text-[#09090b] bg-[#f4f4f5] flex-grow"
              />
              
              <Button 
                type="submit" 
                disabled={status !== 'ready'} 
                size="icon"
                className="shrink-0"
              >
                <SendIcon className="h-5 w-5" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === 'user';
  const parts = message.content.split(/(```[\s\S]*?```)/);
  
  return (
    <div className={cn(
      "mb-4 flex",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-[85%] rounded-lg px-4 py-2",
        isUser ? "bg-primary text-primary-foreground" : "bg-muted"
      )}>
        {parts.map((part, i) => {
          if (part.startsWith("```")) {
            const [_, lang, ...code] = part.split("\n");
            const codeContent = code.slice(0, -1).join("\n");
            return <CodeBlock key={i} language={lang?.replace("```", "") || "markdown"} code={codeContent} />;
          }
          return <p key={i} className="text-sm whitespace-pre-wrap">{part}</p>;
        })}
      </div>
    </div>
  );
}


