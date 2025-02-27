import { NextResponse } from 'next/server';
import { getSessionsInfo } from '~/tools/chat-store';

export async function GET() {
  try {
    const sessionIds = await getSessionsInfo();
    return NextResponse.json({ sessions: sessionIds });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 });
  }
}