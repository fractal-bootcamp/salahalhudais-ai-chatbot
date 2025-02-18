import { generateId } from 'ai';
import { existsSync, mkdirSync } from 'fs';
import { writeFile } from 'fs/promises';
import path from 'path';
import { Message } from 'ai';
import { readFile } from 'fs/promises';

// In-memory storage for chats
export const chats: { id: string; messages: Message[] }[] = [];

export async function saveChat({
  id,
  messages,
}: {
  id: string;
  messages: Message[];
}): Promise<void> {
  const chatIndex = chats.findIndex(chat => chat.id === id);
  if (chatIndex !== -1) {
    const chat = chats[chatIndex];
    if (chat) {
      chat.messages = messages;
    }
  } else {
    chats.push({ id, messages });
  }

  const content = JSON.stringify(messages, null, 2);
  await writeFile(getChatFile(id), content);
}

export async function loadChat(id: string): Promise<Message[]> {
  const chat = chats.find(chat => chat.id === id);
  if (chat) {
    return chat.messages;
  }
  return JSON.parse(await readFile(getChatFile(id), 'utf8'));
}

export async function createChat(): Promise<string> {
  const id = generateId(); // generate a unique chat ID
  await writeFile(getChatFile(id), '[]'); // create an empty chat file
  return id;
}

function getChatFile(id: string): string {
  const chatDir = path.join(process.cwd(), '.chats');
  if (!existsSync(chatDir)) mkdirSync(chatDir, { recursive: true });
  return path.join(chatDir, `${id}.json`);
}

export function getSessionIds() {
  return chats.map(chat => chat.id)
}