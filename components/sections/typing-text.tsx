"use client";

import { config } from "@/lib/config";
import { useEffect, useState } from "react";

interface TypingTextProps {
  texts: string[];
}

export function TypingText({ texts }: TypingTextProps) {
  const [typedText, setTypedText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  
  useEffect(() => {
    const typeText = async () => {
      // Type current text
      const currentText = texts[textIndex];
      for (let i = 0; i <= currentText.length; i++) {
        setTypedText(currentText.substring(0, i));
        await new Promise(resolve => setTimeout(resolve, config.typingDelay));
      }
      
      // Pause at the end
      await new Promise(resolve => setTimeout(resolve, config.pauseDelay));
      
      // Delete the text
      for (let i = currentText.length; i >= 0; i--) {
        setTypedText(currentText.substring(0, i));
        await new Promise(resolve => setTimeout(resolve, config.deletingDelay));
      }
      
      // Move to next text
      setTextIndex((textIndex + 1) % texts.length);
    };
    
    typeText();
  }, [textIndex, texts]);

  return (
    <h2 className="text-xl md:text-2xl font-medium text-muted-foreground">
      <span className="text-primary">{typedText}</span>
      <span className="animate-pulse">|</span>
    </h2>
  );
} 