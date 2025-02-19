import { after } from 'next/server';
import { openai } from '@ai-sdk/openai';
import { appendClientMessage, appendResponseMessages, streamText } from 'ai';
import { saveChat, generateSessionTitle, updateSessionTitle } from '~/tools/chat-store';
import { loadChat } from '~/tools/chat-store';

export async function POST(req: Request) {
  const { messages, id, model } = await req.json();
  const previousMessages = await loadChat(id);
  const fullMessages = [...previousMessages, ...messages];

  // If this is the first message, generate a title after the response
  if (previousMessages.length === 0 && messages.length === 1 && messages[0]?.role === 'user') {
    after(async () => {
      const title = await generateSessionTitle(messages[0].content);
      await updateSessionTitle(id, title);
    });
  }

  const result = streamText({
    model: openai(model),
    messages: fullMessages,
    onError({error}) {
      console.error(error)
    },
    async onFinish({ response }) {
      await saveChat({
        sessionId: id,
        messages: appendResponseMessages({
          messages: fullMessages,
          responseMessages: response.messages,
        }),
      });
    },
  });

  result.consumeStream();
  return result.toDataStreamResponse();
}