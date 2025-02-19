import { after } from 'next/server';
import { openai } from '@ai-sdk/openai';
import { appendClientMessage, appendResponseMessages, streamText } from 'ai';
import { saveChat, generateSessionTitle, updateSessionTitle } from '~/tools/chat-store';
import { loadChat } from '~/tools/chat-store';
import { ChatRequestBody } from '~/app/_components/chat';
import { z } from 'zod';
export const maxDuration = 30;




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
    toolCallStreaming: true,
    model: openai(model),
    messages,
    tools: {
      getWeatherInformation: {
        description: 'Show the weather in a given city to the user',
        parameters: z.object({city: z.string()}),
        execute: async({}: { city: string }) => {
          const weatherOptions = ['sunny', 'cloudy','rainy','snowy','windy'];
          return weatherOptions[
            Math.floor(Math.random() * weatherOptions.length)
          ];
        },
      },
      askForConfirmation: {
        description: 'Ask the user for confirmation',
        parameters: z.object({
          message: z.string().describe('The message to ask for confirmation.'),
        }),
      },

      getLocation: {
        description:
        'Get the user location.Always ask for confirmation before using this tool',
        parameters: z.object({}),
      },
    },
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