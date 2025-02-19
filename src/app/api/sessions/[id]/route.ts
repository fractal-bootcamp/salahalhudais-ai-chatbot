import { NextResponse } from 'next/server';
import { db } from '~/server/db';
import { messages, sessions } from '~/server/db/schema';
import { eq } from 'drizzle-orm';

export async function DELETE(req: Request,
  {params}: {params: {id: string}}
) {
  try {
    const id = Number(params.id);
    await db.delete(messages).where(eq(messages.sessionId, id));
    await db.delete(sessions).where(eq(sessions.id, id));
    return NextResponse.json({ success: true});
  } catch (error) {
    console.error('Error deleting session:', error);
    return NextResponse.json({erorr: 'Failure'});
  }
}