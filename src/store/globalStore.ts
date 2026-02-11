import { create } from "zustand";
import type TranscriptionSegment from "../interfaces/transcription.interfaces";

interface GlobalState {
  url: string;
  setUrl: (url: string) => void;
  index: number; // Para controlar a posição atual na transcrição
  setCurrentIndex: (index: number) => void;
  isLoading: boolean; // Para criar telas de carregamento e evitar ações durante processos assíncronos
  setIsLoading: (isLoading: boolean) => void;
  isTyping: boolean; // Para saber quando o usuário está digitando e impedir certos eventos
  setIsTyping: (isTyping: boolean) => void;
  isRunning: boolean; // Controla o período de escrita (jogo rodando)
  setIsRunning: (isRunning: boolean) => void;
  score: number; // Para armazenar a pontuação do usuário
  setScore: (score: number) => void;
  transcription: TranscriptionSegment[]; // Para armazenar a transcrição do vídeo
  setTranscription: (segments: TranscriptionSegment[]) => void;
  maxUnlockedTime: number; // Para controlar até onde o usuário pode assistir o vídeo
  setMaxUnlockedTime: (time: number) => void;
}

const useGlobalStore = create<GlobalState>((set) => ({
  url: "",
  setUrl: (url: string) => set({ url }),
  index: 0,
  setCurrentIndex: (index: number) => set({ index }),
  isLoading: false,
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  isTyping: false,
  setIsTyping: (isTyping: boolean) => set({ isTyping }),
  isRunning: false,
  setIsRunning: (isRunning: boolean) => set({ isRunning }),
  score: 0,
  setScore: (score: number) => set({ score }),
  transcription: [],
  setTranscription: (segments) => set({ transcription: segments }),
  maxUnlockedTime: 0,
  setMaxUnlockedTime: (time: number) => set({ maxUnlockedTime: time }),
}));

export default useGlobalStore;
