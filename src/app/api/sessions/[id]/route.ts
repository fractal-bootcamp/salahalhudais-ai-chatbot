import { NextResponse } from 'next/server';
import { db } from '~/server/db';
import { messages, sessions } from '~/server/db/schema';
import { eq } from 'drizzle-orm';

export async function DELETE(req: Request,
  {params}: {params: {id: string}}
) {
  try {
    const { id } = await params;
    const sessionId = Number(id);
    await db.delete(messages).where(eq(messages.sessionId, sessionId));
    await db.delete(sessions).where(eq(sessions.id, sessionId));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting session:', error);
    return NextResponse.json({ error: 'Failure' }, { status: 500 });
  }
}