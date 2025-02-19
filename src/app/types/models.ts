export type ModelProvider = 'OpenAI' | 'Anthropic' | 'Mistral';

export interface ModelOption {
  provider: ModelProvider;
  id: string;
  name: string;
  supportsImages: boolean;
  supportsObjectGen: boolean;
  supportsTools: boolean;
  supportsToolStreaming: boolean;
}

export type ModelId = 'gpt-4o' | 'gpt-4o-mini' | 'gpt-4-turbo' | 'gpt-4' | 'o3-mini' | 'o1';

export const MODEL_OPTIONS: ModelOption[] = [
  {
    provider: 'OpenAI',
    id: 'gpt-4o',
    name: 'GPT-4 Optimized',
    supportsImages: true,
    supportsObjectGen: true,
    supportsTools: true,
    supportsToolStreaming: true,
  },
  {
    provider: 'OpenAI',
    id: 'gpt-4o-mini',
    name: 'GPT-4 Optimized Mini',
    supportsImages: true,
    supportsObjectGen: true,
    supportsTools: true,
    supportsToolStreaming: true,
  },
  {
    provider: 'OpenAI',
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    supportsImages: true,
    supportsObjectGen: true,
    supportsTools: true,
    supportsToolStreaming: true,
  },
  {
    provider: 'OpenAI',
    id: 'gpt-4',
    name: 'GPT-4',
    supportsImages: true,
    supportsObjectGen: true,
    supportsTools: true,
    supportsToolStreaming: true,
  },
  {
    provider: 'OpenAI',
    id: 'o3-mini',
    name: 'O3 Mini',
    supportsImages: false,
    supportsObjectGen: false,
    supportsTools: true,
    supportsToolStreaming: true,
  },
  {
    provider: 'OpenAI',
    id: 'o1',
    name: 'O1',
    supportsImages: false,
    supportsObjectGen: false,
    supportsTools: true,
    supportsToolStreaming: true,
  },
  {
    provider: 'OpenAI',
    id: 'o1-mini',
    name: 'O1 Mini',
    supportsImages: false,
    supportsObjectGen: false,
    supportsTools: true,
    supportsToolStreaming: true,
  },
];