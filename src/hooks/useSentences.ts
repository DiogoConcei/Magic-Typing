import { useEffect, useState } from "react";
import type TranscriptionSegment from "../interfaces/transcription.interfaces";

export default function useSentences(segments: TranscriptionSegment[]) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!segments || segments.length === 0) return;
    setCurrentIndex(0);
  }, [segments]);

  const next = () => {
    setCurrentIndex((i) => Math.min(i + 1, segments.length - 1));
  };

  const prev = () => {
    setCurrentIndex((i) => Math.max(i - 1, 0));
  };

  return {
    sentences: segments,
    currentSentence: segments[currentIndex] || null,
    currentIndex,
    total: segments.length,
    next,
    prev,
  };
}
