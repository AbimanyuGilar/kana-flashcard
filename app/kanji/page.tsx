'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { Play, CheckSquare } from 'lucide-react';
import { KANJI_GROUPS_DATA, KanjiItem } from '../kanjiData';
import { shuffleArray } from '../utils';

import Header from '../components/Header';
import KanjiPlayingScreen from '../components/KanjiPlayingScreen';
import ResultScreen from '../components/ResultScreen';

type GameState = 'setup' | 'playing' | 'result';

function generateOptions(correct: KanjiItem, allKanji: KanjiItem[]): string[] {
  const wrongOptions = allKanji
    .filter((k) => k.meaning !== correct.meaning)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
    .map((k) => k.meaning);
  
  const options = [...wrongOptions, correct.meaning];
  return options.sort(() => Math.random() - 0.5);
}

export default function KanjiPage() {
  const [gameState, setGameState] = useState<GameState>('setup');
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>(['n5-number']);

  const [deck, setDeck] = useState<KanjiItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [currentOptions, setCurrentOptions] = useState<string[]>([]);

  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [highestStreak, setHighestStreak] = useState<number>(0);

  const allKanji = useMemo(() => {
    return KANJI_GROUPS_DATA.flatMap((g) => g.items);
  }, []);

  const totalAvailableCards = useMemo(() => {
    return KANJI_GROUPS_DATA
      .filter((g) => selectedGroupIds.includes(g.id))
      .reduce((acc, g) => acc + g.items.length, 0);
  }, [selectedGroupIds]);

  const toggleGroup = (groupId: string) => {
    setSelectedGroupIds((prev) => {
      if (prev.includes(groupId)) {
        if (prev.length === 1) return prev;
        return prev.filter((id) => id !== groupId);
      }
      return [...prev, groupId];
    });
  };

  const handleSelectAllGroups = () => {
    setSelectedGroupIds(KANJI_GROUPS_DATA.map((g) => g.id));
  };

  const handleDeselectAllGroups = () => {
    setSelectedGroupIds(['n5-number']);
  };

  const resetState = () => {
    setScore(0);
    setStreak(0);
    setHighestStreak(0);
    setCurrentIndex(0);
    setIsAnswered(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
  };

  const handleStartQuiz = () => {
    resetState();

    let pool: KanjiItem[] = [];
    KANJI_GROUPS_DATA.forEach((g) => {
      if (selectedGroupIds.includes(g.id)) {
        pool = [...pool, ...g.items];
      }
    });

    const shuffled = shuffleArray(pool);
    setDeck(shuffled);
    setCurrentOptions(generateOptions(shuffled[0], allKanji));
    setGameState('playing');
  };

  const handleSelectAnswer = useCallback((answer: string) => {
    if (isAnswered) return;

    setSelectedAnswer(answer);
    setIsAnswered(true);

    const correct = answer === deck[currentIndex].meaning;
    setIsCorrect(correct);

    if (correct) {
      setScore((prev) => prev + 1);
      setStreak((prev) => {
        const next = prev + 1;
        setHighestStreak((h) => Math.max(h, next));
        return next;
      });
    } else {
      setStreak(0);
    }
  }, [isAnswered, deck, currentIndex]);

  const handleNextQuestion = useCallback(() => {
    const nextIndex = currentIndex + 1;

    if (nextIndex < deck.length) {
      setCurrentIndex(nextIndex);
      setCurrentOptions(generateOptions(deck[nextIndex], allKanji));
      setSelectedAnswer(null);
      setIsAnswered(false);
      setIsCorrect(null);
    } else {
      setGameState('result');
    }
  }, [currentIndex, deck, allKanji]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && gameState === 'playing' && isAnswered) {
        e.preventDefault();
        handleNextQuestion();
      }
      
      if (gameState === 'playing' && !isAnswered) {
        const num = parseInt(e.key);
        if (num >= 1 && num <= 4 && currentOptions[num - 1]) {
          handleSelectAnswer(currentOptions[num - 1]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, isAnswered, handleNextQuestion, currentOptions, handleSelectAnswer]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col justify-between p-4 md:p-8 relative">
      <Header showBack backHref="/" />

      {gameState === 'setup' && (
        <main className="max-w-4xl mx-auto w-full my-auto space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl">
            <div>
              <label className="text-xs font-bold text-slate-400 tracking-wider block text-center">Pilih Grup Kanji</label>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleSelectAllGroups}
                    className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-medium"
                  >
                    <CheckSquare size={13} /> Select All
                  </button>
                  <span className="text-slate-700">|</span>
                  <button
                    type="button"
                    onClick={handleDeselectAllGroups}
                    className="text-xs text-slate-400 hover:underline flex items-center gap-1 font-medium"
                  >
                    Reset
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {KANJI_GROUPS_DATA.map((group) => {
                  const isSelected = selectedGroupIds.includes(group.id);
                  return (
                    <button
                      key={group.id}
                      onClick={() => toggleGroup(group.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-amber-950/40 border-amber-600'
                          : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs font-bold ${isSelected ? 'text-amber-400' : 'text-slate-500'}`}>
                          {group.name}
                        </span>
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? 'border-amber-500 bg-amber-500' : 'border-slate-700'
                        }`}>
                          {isSelected && (
                            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {group.items.slice(0, 5).map((item, idx) => (
                          <span key={idx} className="text-lg font-bold text-white">
                            {item.kanji}
                          </span>
                        ))}
                        {group.items.length > 5 && (
                          <span className="text-xs text-slate-500">+{group.items.length - 5}</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between bg-slate-950 px-4 py-3 rounded-xl border border-slate-800 text-xs text-slate-400">
              <span>Total kartu terpilih:</span>
              <span className="font-extrabold text-amber-400 text-sm font-mono">{totalAvailableCards} Soal</span>
            </div>

            <button
              onClick={handleStartQuiz}
              className="w-full py-4 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition shadow-lg text-base max-w-md mx-auto block"
            >
              <Play size={20} className="fill-current inline" /> Mulai Latihan
            </button>
          </div>
        </main>
      )}

      {gameState === 'playing' && deck.length > 0 && (
        <KanjiPlayingScreen
          currentIndex={currentIndex}
          totalQuestions={deck.length}
          currentKanji={deck[currentIndex]}
          options={currentOptions}
          streak={streak}
          isAnswered={isAnswered}
          selectedAnswer={selectedAnswer}
          isCorrect={isCorrect}
          onSelectAnswer={handleSelectAnswer}
          onNextQuestion={handleNextQuestion}
        />
      )}

      {gameState === 'result' && (
        <ResultScreen
          quizMode="single"
          selectedKanaType="hiragana"
          score={score}
          highestStreak={highestStreak}
          totalQuestions={deck.length}
          onBackToSetup={() => setGameState('setup')}
          onPlayAgain={handleStartQuiz}
        />
      )}

      <footer className="text-center text-xs text-slate-600 py-2">
        &copy;Giraichi • Gira Nihonggo
      </footer>
    </div>
  );
}
