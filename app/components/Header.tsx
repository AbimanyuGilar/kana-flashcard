'use client';

import { BookOpen, ArrowLeft } from 'lucide-react';
import { GameState } from '../types';

interface HeaderProps {
  gameState: GameState;
  onBack: () => void;
}

export default function Header({ gameState, onBack }: HeaderProps) {
  return (
    <header className="max-w-4xl mx-auto w-full flex items-center justify-between pb-4">
      <div className="flex items-center gap-2">
        <BookOpen className="text-cyan-400 size-6" />
        <span className="text-xl font-black tracking-tight">Kana<span className="text-cyan-400">Quiz</span></span>
      </div>
      {gameState !== 'mode_select' && (
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition"
        >
          <ArrowLeft size={14} /> Kembali
        </button>
      )}
    </header>
  );
}