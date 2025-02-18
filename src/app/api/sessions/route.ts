import { NextResponse } from 'next/server';
import { getSessionIds } from '~/tools/chat-store';

export async function GET() {
  const sessionIds = getSessionIds();
  return NextResponse.json(sessionIds);
}