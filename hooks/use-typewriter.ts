"use client";

import { useEffect, useState } from "react";

interface TypeOnceOptions {
  speed?: number;
  startDelay?: number;
}

export function useTypeOnce(text: string, options: TypeOnceOptions = {}) {
  const { speed = 55, startDelay = 0 } = options;
  const [displayText, setDisplayText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setDisplayText("");
    setIsComplete(false);

    let index = 0;
    let interval: ReturnType<typeof setInterval> | undefined;

    const startTimer = setTimeout(() => {
      interval = setInterval(() => {
        index += 1;
        setDisplayText(text.slice(0, index));

        if (index >= text.length) {
          setIsComplete(true);
          if (interval) clearInterval(interval);
        }
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(startTimer);
      if (interval) clearInterval(interval);
    };
  }, [text, speed, startDelay]);

  return { displayText, isComplete };
}

interface CycleTypewriterOptions {
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  startDelay?: number;
}

export function useCycleTypewriter(
  texts: string[],
  options: CycleTypewriterOptions = {}
) {
  const {
    typingSpeed = 75,
    deletingSpeed = 45,
    pauseDuration = 1800,
    startDelay = 0,
  } = options;

  const [textIndex, setTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), startDelay);
    return () => clearTimeout(timer);
  }, [startDelay]);

  useEffect(() => {
    if (!started || texts.length === 0) return;

    const currentText = texts[textIndex % texts.length];

    if (isPaused) {
      const pauseTimer = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, pauseDuration);
      return () => clearTimeout(pauseTimer);
    }

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        const next = currentText.slice(0, displayText.length + 1);
        setDisplayText(next);

        if (next.length === currentText.length) {
          setIsPaused(true);
        }
      } else {
        const next = currentText.slice(0, displayText.length - 1);
        setDisplayText(next);

        if (next.length === 0) {
          setIsDeleting(false);
          setTextIndex((prev) => (prev + 1) % texts.length);
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timeout);
  }, [
    displayText,
    isDeleting,
    isPaused,
    started,
    textIndex,
    texts,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
  ]);

  return { displayText };
}
