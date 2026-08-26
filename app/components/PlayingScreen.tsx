'use client';

import React, { RefObject } from 'react';
import { Flame, CheckCircle2, XCircle, Send, AlertTriangle } from 'lucide-react';
import { QuizMode, Character } from '../types';
import { SentenceQuestion } from '../actions';

interface PlayingScreenProps {
  quizMode: QuizMode;
  isAiFallback: boolean;
  sentenceCount: number;
  currentIndex: number;
  singleDeck: Character[];
  sentenceDeck: SentenceQuestion[];
  textInput: string;
  isAnswered: boolean;
  isInputRed: boolean;
  correctCount: number;
  wrongCount: number;
  streak: number;
  sentenceResult: { isCorrect: boolean; userAns: string } | null;
  inputRef: RefObject<HTMLInputElement | null>;
  onSingleInput: (value: string) => void;
  onTextInputChange: (value: string) => void;
  onSubmitSentence: (e: React.FormEvent) => void;
  onNextQuestion: () => void;
}

export default function PlayingScreen({
  quizMode,
  isAiFallback,
  sentenceCount,
  currentIndex,
  singleDeck,
  sentenceDeck,
  textInput,
  isAnswered,
  isInputRed,
  correctCount,
  wrongCount,
  streak,
  sentenceResult,
  inputRef,
  onSingleInput,
  onTextInputChange,
  onSubmitSentence,
  onNextQuestion,
}: PlayingScreenProps) {
  const totalQuestions = quizMode === 'single' ? singleDeck.length : sentenceDeck.length;

  return (
    <main className="max-w-xl mx-auto w-full my-auto space-y-4 md:space-y-6">
      {quizMode === 'sentence' && isAiFallback && (
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-950/60 border border-amber-800/80 text-amber-200 text-xs font-medium">
          <AlertTriangle size={18} className="text-amber-400 shrink-0" />
          <span>Sedang ada masalah pada AI. Kuis menggunakan pertanyaan default ({sentenceCount} soal).</span>
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 px-1">
          <span>Soal {currentIndex + 1} dari {totalQuestions}</span>
          
          <div className="flex items-center gap-4">
            {quizMode === 'single' && (
              <div className="flex gap-2 text-[10px]">
                <span className="text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-900/50">Benar: {correctCount}</span>
                <span className="text-rose-400 bg-rose-950/40 px-2 py-0.5 rounded-md border border-rose-900/50">Salah: {wrongCount}</span>
              </div>
            )}
            <span className="flex items-center gap-1 text-amber-400">
              <Flame size={14} /> Streak: {streak}
            </span>
          </div>
        </div>
        <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-cyan-500 transition-all duration-300"
            style={{
              width: `${((currentIndex + 1) / totalQuestions) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Card Soal Utama */}
      <div className="relative bg-slate-900 border border-slate-800 rounded-2xl md:rounded-3xl flex flex-col items-center justify-center min-h-[100px] md:min-h-[200px] shadow-2xl text-center">
        {quizMode === 'single' ? (
          <div className="text-3xl md:text-8xl font-black text-white tracking-wide">
            {singleDeck[currentIndex]?.kana}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-2xl md:text-4xl font-bold text-white tracking-wider leading-relaxed">
              {sentenceDeck[currentIndex]?.sentence}
            </div>
            <div className="text-xs text-cyan-400/80 font-medium bg-cyan-950/40 border border-cyan-900/50 py-1 px-3 rounded-full inline-block">
              Arti: &quot;{sentenceDeck[currentIndex]?.meaning}&quot;
            </div>
          </div>
        )}
      </div>

      {/* Opsi Jawaban */}
      {quizMode === 'single' ? (
        <div className="space-y-3">
          <input
            ref={inputRef}
            type="text"
            value={textInput}
            onChange={(e) => onSingleInput(e.target.value)}
            disabled={isAnswered}
            placeholder="Ketik romaji..."
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            className={`w-full py-3 px-4 md:py-4 md:px-5 bg-slate-900 border-2 rounded-xl md:rounded-2xl text-lg md:text-xl font-bold text-white text-center placeholder-slate-500 focus:outline-none transition-all tracking-widest ${
              isInputRed
                ? 'border-rose-500 bg-rose-950/20 text-rose-400'
                : isAnswered
                  ? 'border-emerald-500 bg-emerald-950/20 text-emerald-400'
                  : 'border-slate-800 focus:border-cyan-500'
            }`}
          />
        </div>
      ) : (
        <div className="space-y-3">
          <form onSubmit={onSubmitSentence} className="relative flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={textInput}
              onChange={(e) => onTextInputChange(e.target.value)}
              disabled={isAnswered}
              placeholder="Ketik cara baca Romaji di sini..."
              className={`w-full py-3 md:py-4 pl-4 pr-12 md:pl-5 md:pr-14 bg-slate-900 border-2 rounded-xl md:rounded-2xl text-base md:text-lg font-medium text-white placeholder-slate-500 focus:outline-none transition-all ${
                isAnswered
                  ? sentenceResult?.isCorrect
                    ? 'border-emerald-500 bg-emerald-950/20'
                    : 'border-rose-500 bg-rose-950/20'
                  : 'border-slate-800 focus:border-cyan-500'
              }`}
            />
            <button
              type="submit"
              disabled={!isAnswered && !textInput.trim()}
              className="absolute right-1.5 p-2.5 md:right-2 md:p-3 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 text-white rounded-lg md:rounded-xl transition"
            >
              <Send size={16} className="md:w-[18px] md:h-[18px]" />
            </button>
          </form>

          {isAnswered && sentenceResult && (
            <div
              className={`p-4 rounded-2xl border text-sm font-semibold flex items-start gap-3 transition-all ${
                sentenceResult.isCorrect
                  ? 'bg-emerald-950/60 border-emerald-800 text-emerald-200'
                  : 'bg-rose-950/60 border-rose-800 text-rose-200'
              }`}
            >
              {sentenceResult.isCorrect ? (
                <CheckCircle2 size={20} className="text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <XCircle size={20} className="text-rose-400 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <div>{sentenceResult.isCorrect ? 'Benar sekali!' : 'Kurang tepat!'}</div>
                <div className="text-xs font-normal text-slate-300">
                  Format asli: <span className="font-bold text-cyan-400 font-mono">{sentenceDeck[currentIndex]?.romaji}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {isAnswered && quizMode !== 'single' && (
        <button
          onClick={onNextQuestion}
          className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition shadow-lg text-base animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          Soal Berikutnya
        </button>
      )}
    </main>
  );
}