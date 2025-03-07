import { db } from "~/server/db";
import { sessions } from "~/server/db/schema";
import { NextResponse } from "next/server";

export async function POST() {
  const session = await db.insert(sessions).values({
    id: crypto.randomUUID(),
  }).returning();

  return NextResponse.json(session[0]);
}

export async function GET() {
  const sessions = await db.query.sessions.findMany({
    orderBy: (sessions) => [sessions.createdAt],
  });
  
  return NextResponse.json(sessions);
}