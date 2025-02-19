'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "~/components/ui/select";
import { MODEL_OPTIONS } from '../types/models';

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (modelId: string) => void;
}

export default function ModelSelector({ selectedModel, onModelChange }: ModelSelectorProps) {
  return (
    <Select value={selectedModel} onValueChange={onModelChange}>
      <SelectTrigger className="w-[200px] h-8">
        <SelectValue placeholder="Select a model" />
      </SelectTrigger>
      <SelectContent className="w-[200px]">
        <SelectGroup>
          {MODEL_OPTIONS.map((model) => (
            <SelectItem key={model.id} value={model.id}>
              {model.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}