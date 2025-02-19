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
  const { messages, input, handleSubmit, handleInputChange, status, error } = useChat({
    id: chatId.toString(),
    initialMessages,
    body: {
      model: selectedModel,
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
            <ChatMessage key={`${message.id}-${index}`} message={message} />
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