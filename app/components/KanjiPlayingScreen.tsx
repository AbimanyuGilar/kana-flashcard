'use client';

import { Flame, CheckCircle2, XCircle } from 'lucide-react';
import { KanjiItem } from '../kanjiData';

interface KanjiPlayingScreenProps {
  currentIndex: number;
  totalQuestions: number;
  currentKanji: KanjiItem;
  options: string[];
  streak: number;
  isAnswered: boolean;
  selectedAnswer: string | null;
  isCorrect: boolean | null;
  onSelectAnswer: (answer: string) => void;
  onNextQuestion: () => void;
}

export default function KanjiPlayingScreen({
  currentIndex,
  totalQuestions,
  currentKanji,
  options,
  streak,
  isAnswered,
  selectedAnswer,
  isCorrect,
  onSelectAnswer,
  onNextQuestion,
}: KanjiPlayingScreenProps) {
  return (
    <main className="max-w-xl mx-auto w-full my-auto space-y-4 md:space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 px-1">
          <span>Soal {currentIndex + 1} dari {totalQuestions}</span>
          <span className="flex items-center gap-1 text-amber-400">
            <Flame size={14} /> Streak: {streak}
          </span>
        </div>
        <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-amber-500 transition-all duration-300"
            style={{
              width: `${((currentIndex + 1) / totalQuestions) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Card Kanji Utama */}
      <div className="relative bg-slate-900 border border-slate-800 rounded-2xl md:rounded-3xl flex flex-col items-center justify-center min-h-[150px] md:min-h-[220px] shadow-2xl text-center">
        <div className="text-6xl md:text-9xl font-black text-white tracking-wide">
          {currentKanji.kanji}
        </div>
        <div className="text-xs text-slate-500 mt-2 font-mono">
          {currentKanji.reading}
        </div>
      </div>

      {/* Pilihan Ganda */}
      <div className="grid grid-cols-2 gap-3">
        {options.map((option, idx) => {
          const isSelected = selectedAnswer === option;
          const isCorrectOption = option === currentKanji.meaning;
          
          let bgClass = 'bg-slate-900 border-slate-800 hover:border-slate-600';
          if (isAnswered) {
            if (isCorrectOption) {
              bgClass = 'bg-emerald-950/60 border-emerald-600';
            } else if (isSelected && !isCorrect) {
              bgClass = 'bg-rose-950/60 border-rose-600';
            } else {
              bgClass = 'bg-slate-900 border-slate-800 opacity-50';
            }
          }

          return (
            <button
              key={idx}
              onClick={() => onSelectAnswer(option)}
              disabled={isAnswered}
              className={`p-4 rounded-2xl border text-left transition-all ${bgClass}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-500">{idx + 1}.</span>
                <span className={`font-semibold ${isAnswered && isCorrectOption ? 'text-emerald-400' : isAnswered && isSelected && !isCorrect ? 'text-rose-400' : 'text-white'}`}>
                  {option}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {isAnswered && (
        <div
          className={`p-4 rounded-2xl border text-sm font-semibold flex items-start gap-3 transition-all ${
            isCorrect
              ? 'bg-emerald-950/60 border-emerald-800 text-emerald-200'
              : 'bg-rose-950/60 border-rose-800 text-rose-200'
          }`}
        >
          {isCorrect ? (
            <CheckCircle2 size={20} className="text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <XCircle size={20} className="text-rose-400 shrink-0 mt-0.5" />
          )}
          <div className="space-y-1">
            <div>{isCorrect ? 'Benar sekali!' : 'Kurang tepat!'}</div>
            <div className="text-xs font-normal text-slate-300">
              Jawaban: <span className="font-bold text-amber-400">{currentKanji.meaning}</span>
            </div>
          </div>
        </div>
      )}

      {/* Tombol Next */}
      {isAnswered && (
        <button
          onClick={onNextQuestion}
          className="w-full py-4 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition shadow-lg text-base animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          Soal Berikutnya
        </button>
      )}
    </main>
  );
}