'use client';

import { MODEL_OPTIONS } from '../types/models';

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (modelId: string) => void;
}

export default function ModelSelector({ selectedModel, onModelChange }: ModelSelectorProps) {
  return (
    <select
      value={selectedModel}
      onChange={(e) => onModelChange(e.target.value)}
      className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
    >
      {MODEL_OPTIONS.map((model) => (
        <option key={model.id} value={model.id}>
          {model.name}
        </option>
      ))}
    </select>
  );
}