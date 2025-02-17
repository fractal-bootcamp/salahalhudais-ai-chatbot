import { db } from "~/server/db";
import { messages } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { sessionId, content, role } = await req.json();
  
  const message = await db.insert(messages).values({
    id: crypto.randomUUID(),
    sessionId,
    content,
    role,
  }).returning();
  return NextResponse.json(message[0]);
}
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("sessionId");
  
  if (!sessionId) {
    return new NextResponse("Session ID required", { status: 400 });
  }
  const messages = await db.query.messages.findMany({
    where: (messages, { eq }) => eq(messages.sessionId, sessionId),
    orderBy: (messages) => [messages.createdAt],
  });
  return NextResponse.json(messages);
}