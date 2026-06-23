"use client";

import { useTypeOnce, useCycleTypewriter } from "@/hooks/use-typewriter";

function TypewriterCursor() {
  return <span className="typewriter-cursor" aria-hidden="true" />;
}

export function HeroTypingHeadline({ name }: { name: string }) {
  const greetingPrefix = "Hi, I'm ";
  const fullText = `${greetingPrefix}${name}`;
  const { displayText, isComplete } = useTypeOnce(fullText, {
    speed: 58,
    startDelay: 250,
  });

  const greetingText = displayText.slice(0, greetingPrefix.length);
  const nameText = displayText.slice(greetingPrefix.length);

  return (
    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
      <span className="block min-h-[1.15em] text-foreground">
        {greetingText}
        {displayText.length <= greetingPrefix.length && !isComplete && (
          <TypewriterCursor />
        )}
      </span>
      <span className="mt-1 block min-h-[1.15em]">
        <span className="gradient-text-shimmer">{nameText}</span>
        {displayText.length > greetingPrefix.length && !isComplete && (
          <TypewriterCursor />
        )}
      </span>
    </h1>
  );
}

export function HeroTypingRole({
  roles,
  startDelay = 1200,
}: {
  roles: string[];
  startDelay?: number;
}) {
  const { displayText } = useCycleTypewriter(roles, {
    startDelay,
    typingSpeed: 70,
    deletingSpeed: 40,
    pauseDuration: 2000,
  });

  return (
    <p className="min-h-[2rem] text-xl font-medium text-muted-foreground sm:min-h-[2.5rem] sm:text-2xl">
      <span>{displayText}</span>
      <TypewriterCursor />
    </p>
  );
}

export function HeroTypingDescription({
  text,
  startDelay = 2000,
}: {
  text: string;
  startDelay?: number;
}) {
  const { displayText, isComplete } = useTypeOnce(text, {
    speed: 28,
    startDelay,
  });

  return (
    <p className="min-h-[4.5rem] max-w-lg leading-relaxed text-muted-foreground sm:min-h-[5rem]">
      {displayText}
      {!isComplete && <TypewriterCursor />}
    </p>
  );
}
