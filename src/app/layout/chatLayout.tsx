import SessionList from '../_components/sessionList';
import { getSessionsInfo } from '~/tools/chat-store';
import Link from 'next/link';
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import { PlusIcon } from "lucide-react";

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sessions = await getSessionsInfo();

  return (
    <div className="flex h-screen">
      <div className="w-64 border-r bg-background p-4 flex flex-col gap-4">
        <Button asChild variant="default" className="w-full flex">
          <Link href="/chat">
            <PlusIcon className="mr-2 h-4 w-4" />
            New Chat
          </Link>
        </Button>
        
        <ScrollArea className="flex-1">
          <SessionList sessions={sessions} />
        </ScrollArea>
      </div>
      
      <div className="flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
}