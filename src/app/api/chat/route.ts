import { after } from 'next/server';
import { openai } from '@ai-sdk/openai';
import { appendClientMessage, appendResponseMessages, streamText } from 'ai';
import { saveChat, generateSessionTitle, updateSessionTitle } from '~/tools/chat-store';
import { loadChat } from '~/tools/chat-store';
import { ChatRequestBody } from '~/app/_components/chat';


export async function POST(req: Request) {
  const { messages, id, model }: ChatRequestBody = await req.json();
  const firstMessage = messages[0]

  // If this is the first message, generate a title after the response
  if (firstMessage && messages[0]?.role === 'user') {
    after(async () => {
      const title = await generateSessionTitle(firstMessage.content);
      await updateSessionTitle(id, title);
    });
  }

  const result = streamText({
    model: openai(model),
    messages,
    onError({error}) {
      console.error(error)
    },
    async onFinish({ response, text}) {
      console.log(response)
      response.messages
      // Save only the AI's response message
      await saveChat({
        sessionId: id,
        messages: appendResponseMessages({
          messages,
          responseMessages: response.messages
        })
      });
    },
  });

  result.consumeStream();
  return result.toDataStreamResponse();
}