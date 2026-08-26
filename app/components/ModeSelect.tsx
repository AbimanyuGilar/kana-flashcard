'use client';

import { Type, MessageSquareCode } from 'lucide-react';
import { QuizMode } from '../types';

interface ModeSelectProps {
  onSelectMode: (mode: QuizMode) => void;
}

export default function ModeSelect({ onSelectMode }: ModeSelectProps) {
  return (
    <main className="max-w-xl mx-auto w-full my-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-white">Pilih Mode Latihan</h1>
        <p className="text-sm text-slate-400">Pilih jenis tebakan yang ingin kamu latih</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => onSelectMode('single')}
          className="bg-slate-900 border border-slate-800 hover:border-cyan-500/50 p-6 rounded-3xl text-left space-y-3 transition-all hover:scale-[1.02]"
        >
          <div className="size-12 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-2xl flex items-center justify-center">
            <Type size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Mode Single Karakter</h3>
            <p className="text-xs text-slate-400 mt-1">Tebak karakter satu per satu (pilihan ganda) sesuai select all/baris huruf.</p>
          </div>
        </button>

        <button
          onClick={() => onSelectMode('sentence')}
          className="bg-slate-900 border border-slate-800 hover:border-cyan-500/50 p-6 rounded-3xl text-left space-y-3 transition-all hover:scale-[1.02]"
        >
          <div className="size-12 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center">
            <MessageSquareCode size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Mode Kalimat AI</h3>
            <p className="text-xs text-slate-400 mt-1">Ketik cara baca Romaji dari kalimat sederhana buatan Gemini AI.</p>
          </div>
        </button>
      </div>
    </main>
  );
}