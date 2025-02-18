import { generateId } from 'ai';
import { existsSync, mkdirSync } from 'fs';
import { writeFile } from 'fs/promises';
import path from 'path';
import { Message } from 'ai';
import { readFile } from 'fs/promises';
import { db } from '~/server/db';
import { sessions, messages } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export async function saveChat({
  id,
  messages: chatMessages,
}: {
  id: string;
  messages: Message[];
}): Promise<void> {
  await db
    .insert(sessions)
    .values({
      sessionId: id,
    })
    .onConflictDoNothing();

  // Insert all messages
  if (chatMessages.length > 0) {
    await db.insert(messages).values(
      chatMessages.map((msg) => ({
        sessionId: id,
        message: msg.content,
      }))
    );
  }
}

export async function loadChat(id: string): Promise<Message[]> {
  const result = await db
    .select()
    .from(messages)
    .where(eq(messages.sessionId, id))
    .orderBy(messages.createdAt);

  return result.map((msg) => ({
    id: msg.id.toString(),
    content: msg.message,
    role: 'user', // You might want to add a role column
  }));
}

export async function createChat(): Promise<string> {
  const id = generateId();
  await db.insert(sessions).values({
    sessionId: id,
  });
  return id;
}

export async function getSessionIds(): Promise<string[]> {
  try {
    const allSessions = await db.select({
      sessionId: sessions.sessionId,
    })
    .from(sessions)
    .orderBy(sessions.createdAt);
    
    return allSessions.map(session => session.sessionId);
  } catch (error) {
    console.error('Error fetching session IDs:', error);
    return [];
  }
}