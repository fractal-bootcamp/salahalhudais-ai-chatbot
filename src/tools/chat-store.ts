import { generateId, generateText } from 'ai';
import { existsSync, mkdirSync } from 'fs';
import { writeFile } from 'fs/promises';
import path from 'path';
import { Message } from 'ai';
import { readFile } from 'fs/promises';
import { db } from '~/server/db';
import { sessions, messages as dbMessages } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { openai } from '@ai-sdk/openai';

type SaveChatParams = {
  sessionId: number;
  messages: Message[];
}

export async function saveChat({
  sessionId,
  messages,
}: SaveChatParams): Promise<void> {
  // Get just the last message
  const lastMessage = messages[messages.length - 1];
  
  // Insert only the last message
  if (lastMessage) {
    await db.insert(dbMessages).values({
      sessionId,
      message: lastMessage.content,
      role: lastMessage.role as "user" | "assistant",
    });
  }
}

export async function loadChat(id: number): Promise<Message[]> {
  // console.log("loading chat! ", id)
  const result = await db
    .select()
    .from(dbMessages)
    .where(eq(dbMessages.sessionId, id))
    .orderBy(dbMessages.createdAt);

    // console.log("got chats: ", result)

  return result.map((msg) => ({
    id: msg.id.toString(),
    content: msg.message,
    role: msg.role,
  }));
}

export async function createChat(): Promise<number | undefined> {
  // console.log("creating chat")
  const result = await db.insert(sessions).values({}).returning({sessionId: sessions.id})
  // console.log(result)
  return result[0]?.sessionId
}

export type SessionInfo = {
  id: number,
  title: string,
}

// todo: include titles to sessionID;
export async function getSessionsInfo(): Promise<SessionInfo[]> {
  try {
    const allSessions = await db.select({
      id: sessions.id,
      title: sessions.title
    })
    .from(sessions)
    .orderBy(sessions.createdAt);
    
    return allSessions.map(session => ({
      id: session.id,
      title: session.title ?? 'Untitled Chat'
    }));
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return [];
  }
}

// todo: retreive titles
export async function generateSessionTitle(message: string): Promise<string> {
  // This code is generative and has a dangerous side effect with a high failure rate
  // so probably you can't trust it to work on the first try.
 const result = await generateText({
      model: openai("gpt-3.5-turbo"),
      messages: [
        {
          role: "system",
          content: "generate a brief summary no longer than 6 words",
        },
        {
          role: "user",
          content: message
        }
      ],
      maxTokens: 20,
      temperature: 0.7,
    }) ?? "New Chat";
  // console.log("This is the generated title:", result);
  return result.text;
}

export async function updateSessionTitle(sessionId: number, title: string): Promise<void> {
  await db.update(sessions)
    .set({ title })
    .where(eq(sessions.id, sessionId));
}