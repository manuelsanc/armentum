import { useState, KeyboardEvent } from "react";
import { X } from "lucide-react";
import { Badge } from "./badge";
import { Input } from "./input";

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function TagInput({ tags, onChange, placeholder = "Agregar etiquetas...", className = "" }: TagInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const trimmedValue = inputValue.trim();

    // Add tag on Enter, comma, or semicolon
    if ((e.key === "Enter" || e.key === "," || e.key === ";") && trimmedValue) {
      e.preventDefault();
      if (!tags.includes(trimmedValue)) {
        onChange([...tags, trimmedValue]);
      }
      setInputValue("");
      return;
    }

    // Remove last tag on Backspace when input is empty
    if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      e.preventDefault();
      onChange(tags.slice(0, -1));
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onChange(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="gap-1 pl-2 pr-1">
            {tag}
            <button
              type="button"
              onClick={() => handleRemoveTag(tag)}
              className="ml-1 rounded-full hover:bg-muted-foreground/20"
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}
      </div>
      <Input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
      />
      <p className="text-xs text-muted-foreground">
        Presiona Enter, coma o punto y coma para agregar etiquetas
      </p>
    </div>
  );
}
