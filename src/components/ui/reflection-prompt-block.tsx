"use client";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { PencilLine } from "lucide-react";
import React, { useState, useEffect } from "react";
import { ReflectionCards } from "@/components/ReflectionCards";

// Enhanced version with card stack support
export function ReflectionPromptBlock({
  prompt,
  prompts,
  allowResponse = true,
  value,
  onChange,
  className,
  useCardStack = false,
  chapterId,
}: {
  prompt?: string;
  prompts?: string[];
  allowResponse?: boolean;
  value?: string;
  onChange?: (val: string) => void;
  className?: string;
  useCardStack?: boolean;
  chapterId?: string;
}) {
  // If multiple prompts provided and card stack enabled, use ReflectionCards
  if (useCardStack && prompts && prompts.length > 1) {
    const questions = prompts.map((p, index) => ({
      id: index,
      question: p,
      placeholder: `Share your thoughts on question ${index + 1}...`
    }));

    return (
      <div className={cn("my-8", className)}>
        <ReflectionCards questions={questions} />
      </div>
    );
  }

  // Single prompt fallback to original design with enhanced styling
  const displayPrompt = prompt || (prompts && prompts[0]) || "";
  
  return (
    <Card className={cn(
      "my-6 border-0 shadow-lg", 
      "bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20",
      className
    )}>
      <CardContent className="flex flex-col gap-4 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/50">
            <PencilLine className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </div>
          <span className="font-semibold text-purple-900 dark:text-purple-200 tracking-wide">
            Reflection
          </span>
        </div>
        
        <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg border-l-4 border-purple-400">
          {displayPrompt}
        </div>
        
        {allowResponse && (
          <div className="relative">
            <Textarea
              placeholder="Write your response here..."
              value={value}
              onChange={e => onChange?.(e.target.value)}
              className={cn(
                "min-h-[120px] resize-none transition-all duration-200",
                "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm",
                "border border-purple-200 dark:border-purple-700",
                "focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500",
                "placeholder:text-gray-400 dark:placeholder:text-gray-500",
                "shadow-sm hover:shadow-md focus:shadow-lg rounded-lg"
              )}
              rows={4}
            />
            {value && (
              <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                {value.length} characters
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}