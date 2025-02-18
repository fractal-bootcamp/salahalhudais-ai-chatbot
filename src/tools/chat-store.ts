import { generateId } from 'ai';
import { existsSync, mkdirSync } from 'fs';
import { writeFile } from 'fs/promises';
import path from 'path';
import { Message } from 'ai';
import { readFile } from 'fs/promises';
import { db } from '~/server/db';
import { sessions, messages as dbMessages } from "~/server/db/schema";
import { eq } from "drizzle-orm";

type SaveChatParams = {
  sessionId: number;
  messages: Message[];
}

export async function saveChat({
  sessionId,
  messages,
}: SaveChatParams): Promise<void> {
  console.log("Saving Messages", sessionId, messages)

  // Insert all messages
  if (messages.length > 0) {
    await db.insert(dbMessages).values(
      messages.map((msg) => ({
        sessionId,
        message: msg.content,
      }))
    ).onConflictDoNothing();
  }
}

export async function loadChat(id: number): Promise<Message[]> {
  console.log("loading chat! ", id)
  const result = await db
    .select()
    .from(dbMessages)
    .where(eq(dbMessages.sessionId, id))
    .orderBy(dbMessages.createdAt);

    console.log("got chats: ", result)

  return result.map((msg) => ({
    id: msg.id.toString(),
    content: msg.message,
    role: 'user', // You might want to add a role column
  }));
}

export async function createChat(): Promise<number | undefined> {
  console.log("creating chat")
  const result = await db.insert(sessions).values({}).returning({sessionId: sessions.id})
  console.log(result)
  return result[0]?.sessionId
}

export async function getSessionIds(): Promise<number[]> {
  try {
    const allSessions = await db.select({id: sessions.id})
    .from(sessions)
    .orderBy(sessions.createdAt);
    
    return allSessions.map(session => session.id);
  } catch (error) {
    console.error('Error fetching session IDs:', error);
    return [];
  }
}