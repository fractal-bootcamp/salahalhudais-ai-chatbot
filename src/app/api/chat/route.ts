import { after } from 'next/server';
import { openai } from '@ai-sdk/openai';
import { appendClientMessage, appendResponseMessages, streamText } from 'ai';
import { saveChat, generateSessionTitle, updateSessionTitle } from '~/tools/chat-store';
import { loadChat } from '~/tools/chat-store';
import { ChatRequestBody } from '~/app/_components/chat';
import { z } from 'zod';
import { env } from '~/env';

export const maxDuration = 30;

async function getWeatherData(city: string) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${env.OPENWEATHER_API_KEY}&units=metric`
    );
    
    if (!response.ok) {
      throw new Error('Weather data fetch failed');
    }

    const data = await response.json();
    return {
      temperature: Math.round(data.main.temp),
      condition: data.weather[0].main.toLowerCase(),
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed),
      description: data.weather[0].description
    };
  } catch (error) {
    console.error('Error fetching weather:', error);
    throw new Error('Failed to fetch weather data');
  }
}

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
        description: 'Get real-time weather information for a given city.',
        parameters: z.object({
          city: z.string().describe('The name of the city to get weather for')
        }),
        execute: async({ city }: { city: string }) => {
          const weather = await getWeatherData(city);
          return `Current weather in ${city}: ${weather.temperature}°C, ${weather.description}. 
          Humidity: ${weather.humidity}%, Wind Speed: ${weather.windSpeed} m/s`;
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