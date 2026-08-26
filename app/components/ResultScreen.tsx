'use client';

import { Award, RotateCcw } from 'lucide-react';
import { QuizMode, KanaType } from '../types';

interface ResultScreenProps {
  quizMode: QuizMode;
  selectedKanaType: KanaType;
  score: number;
  highestStreak: number;
  totalQuestions: number;
  onBackToSetup: () => void;
  onPlayAgain: () => void;
}

export default function ResultScreen({
  quizMode,
  selectedKanaType,
  score,
  highestStreak,
  totalQuestions,
  onBackToSetup,
  onPlayAgain,
}: ResultScreenProps) {
  const accuracy = Math.round((score / totalQuestions) * 100);

  return (
    <main className="max-w-xl mx-auto w-full my-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
        <div className="size-20 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-full flex items-center justify-center mx-auto">
          <Award size={40} />
        </div>

        <div>
          <h2 className="text-3xl font-extrabold text-white">Sesi Selesai!</h2>
          <p className="text-slate-400 text-sm mt-1">
            Latihan Mode <span className="capitalize text-cyan-400 font-semibold">{quizMode}</span> ({selectedKanaType})
          </p>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 grid grid-cols-3 gap-2">
          <div className="p-2">
            <div className="text-[10px] font-bold text-slate-500">Akurasi</div>
            <div className="text-xl font-black text-emerald-400 mt-1">
              {accuracy}%
            </div>
          </div>
          <div className="p-2 border-x border-slate-800">
            <div className="text-[10px] font-bold text-slate-500">Skor</div>
            <div className="text-xl font-black text-cyan-400 mt-1">
              {score} / {totalQuestions}
            </div>
          </div>
          <div className="p-2">
            <div className="text-[10px] font-bold text-slate-500">Max Streak</div>
            <div className="text-xl font-black text-amber-400 mt-1">{highestStreak}</div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onBackToSetup}
            className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-2xl transition text-sm"
          >
            Kembali
          </button>
          <button
            onClick={onPlayAgain}
            className="flex-1 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition shadow-lg text-sm"
          >
            <RotateCcw size={16} /> Main Lagi
          </button>
        </div>
      </div>
    </main>
  );
}