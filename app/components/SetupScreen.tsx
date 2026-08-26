'use client';

import { Play, Loader2, CheckSquare } from 'lucide-react';
import { KanaType, SentenceKanaType, QuizMode, KanaGroup } from '../types';

interface SetupScreenProps {
  quizMode: QuizMode;
  selectedKanaType: KanaType;
  sentenceKanaType: SentenceKanaType;
  selectedGroupIds: string[];
  sentenceCount: number;
  currentGroups: KanaGroup[];
  totalAvailableSingleCards: number;
  isLoading: boolean;
  onSelectKanaType: (type: KanaType) => void;
  onSelectSentenceKanaType: (type: SentenceKanaType) => void;
  onToggleGroup: (groupId: string) => void;
  onSelectAllGroups: () => void;
  onDeselectAllGroups: () => void;
  onSetSentenceCount: (count: number) => void;
  onStartQuiz: () => void;
}

export default function SetupScreen({
  quizMode,
  selectedKanaType,
  sentenceKanaType,
  selectedGroupIds,
  sentenceCount,
  currentGroups,
  totalAvailableSingleCards,
  isLoading,
  onSelectKanaType,
  onSelectSentenceKanaType,
  onToggleGroup,
  onSelectAllGroups,
  onDeselectAllGroups,
  onSetSentenceCount,
  onStartQuiz,
}: SetupScreenProps) {
  return (
    <main className="max-w-4xl mx-auto w-full my-auto space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl">
        {/* Tipe Kana Switcher */}
        <div>
          {quizMode === 'single' ? (
            <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-2xl border border-slate-800 max-w-xs mx-auto">
              {(['hiragana', 'katakana'] as KanaType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => onSelectKanaType(type)}
                  className={`py-2.5 rounded-xl font-bold text-xs tracking-wider transition-all ${
                    selectedKanaType === type
                      ? 'bg-cyan-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 tracking-wider block text-center">Jenis Aksara</label>
              <div className="grid grid-cols-3 gap-2 bg-slate-950 p-1 rounded-2xl border border-slate-800 max-w-sm mx-auto">
                {([
                  { value: 'hiragana', label: 'Hiragana' },
                  { value: 'katakana', label: 'Katakana' },
                  { value: 'both', label: 'Keduanya' },
                ] as { value: SentenceKanaType; label: string }[]).map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => onSelectSentenceKanaType(value)}
                    className={`py-2.5 rounded-xl font-bold text-xs tracking-wider transition-all ${
                      sentenceKanaType === value
                        ? 'bg-cyan-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SELEKSI BARIS / KOLOM KANA (MATRIX LAYOUT) */}
        {quizMode === 'single' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onSelectAllGroups}
                  className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-medium"
                >
                  <CheckSquare size={13} /> Select All
                </button>
                <span className="text-slate-700">|</span>
                <button
                  type="button"
                  onClick={onDeselectAllGroups}
                  className="text-xs text-slate-400 hover:underline flex items-center gap-1 font-medium"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Matriks Tabel Menyatu */}
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 overflow-x-auto overflow-y-auto max-h-[340px] scrollbar-thin scrollbar-thumb-slate-700">
              <div className="flex justify-between gap-6 min-w-max">
                {currentGroups.map((group) => {
                  const isSelected = selectedGroupIds.includes(group.id);
                  return (
                    <div
                      key={group.id}
                      className="flex flex-col items-center gap-4 py-1"
                    >
                      {/* Toggle Switch Top Header */}
                      <button
                        type="button"
                        onClick={() => onToggleGroup(group.id)}
                        className={`w-10 h-6 rounded-full p-1 transition-colors relative flex items-center ${
                          isSelected ? 'bg-cyan-500' : 'bg-slate-800'
                        }`}
                      >
                        <div
                          className={`size-4 rounded-full bg-white shadow-sm transition-transform ${
                            isSelected ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </button>

                      {/* Items Kana Vertikal Menyatu */}
                      <div
                        onClick={() => onToggleGroup(group.id)}
                        className={`flex flex-col items-center gap-3 cursor-pointer select-none transition-opacity ${
                          isSelected ? 'opacity-100' : 'opacity-30 hover:opacity-50'
                        }`}
                      >
                        {group.items.map((item, idx) => (
                          <div key={idx} className="text-center w-12 py-0.5">
                            <span className="text-xl font-bold text-white block leading-tight">
                              {item.kana}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400 block tracking-tight">
                              {item.romaji}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Opsi Jumlah Soal Khusus Mode Kalimat */}
        {quizMode === 'sentence' && (
          <div>
            <label className="text-xs font-bold text-slate-400 tracking-wider block mb-3">Jumlah Soal Kalimat</label>
            <div className="grid grid-cols-3 gap-2">
              {[5, 10, 20].map((count) => (
                <button
                  key={count}
                  onClick={() => onSetSentenceCount(count)}
                  className={`py-3 rounded-xl font-bold text-sm transition-all border ${
                    sentenceCount === count
                      ? 'bg-cyan-600 border-cyan-500 text-white shadow-md'
                      : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {count} Soal
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Banner Jumlah Kartu */}
        {quizMode === 'single' ? (
          <div className="flex items-center justify-between bg-slate-950 px-4 py-3 rounded-xl border border-slate-800 text-xs text-slate-400">
            <span>Total kombinasi kartu terpilih:</span>
            <span className="font-extrabold text-cyan-400 text-sm font-mono">{totalAvailableSingleCards} Soal</span>
          </div>
        ) : (
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-400 leading-relaxed">
            ✨ Gemini AI akan membuat {sentenceCount} kalimat bahasa Jepang secara acak. Jawaban berupa ketikan cara baca Romaji.
          </div>
        )}

        <button
          onClick={onStartQuiz}
          disabled={isLoading}
          className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition shadow-lg text-base max-w-md mx-auto block"
        >
          {isLoading ? (
            <>
              <Loader2 size={20} className="animate-spin text-cyan-400 inline" /> Generating AI...
            </>
          ) : (
            <>
              <Play size={20} className="fill-current inline" /> Mulai Latihan
            </>
          )}
        </button>
      </div>
    </main>
  );
}