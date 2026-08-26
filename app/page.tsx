'use client';

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { generateSentenceQuiz, SentenceQuestion } from './actions';
import { Character, KanaType, SentenceKanaType, QuizMode, GameState } from './types';
import { KANA_GROUPS_DATA } from './kanaData';
import { shuffleArray } from './utils';

import Header from './components/Header';
import ErrorModal from './components/ErrorModal';
import ModeSelect from './components/ModeSelect';
import SetupScreen from './components/SetupScreen';
import PlayingScreen from './components/PlayingScreen';
import ResultScreen from './components/ResultScreen';

export default function KanaQuizApp() {
  const [gameState, setGameState] = useState<GameState>('mode_select');
  const [quizMode, setQuizMode] = useState<QuizMode>('single');
  const [selectedKanaType, setSelectedKanaType] = useState<KanaType>('hiragana');
  const [sentenceKanaType, setSentenceKanaType] = useState<SentenceKanaType>('hiragana');
  
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>(['a']);
  const [sentenceCount, setSentenceCount] = useState<number>(5);

  const [singleDeck, setSingleDeck] = useState<Character[]>([]);
  const [sentenceDeck, setSentenceDeck] = useState<SentenceQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
  const [isAiFallback, setIsAiFallback] = useState<boolean>(false);

  const [textInput, setTextInput] = useState<string>('');
  const [sentenceResult, setSentenceResult] = useState<{ isCorrect: boolean; userAns: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const autoNextTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [correctCount, setCorrectCount] = useState<number>(0);
  const [wrongCount, setWrongCount] = useState<number>(0);
  const [isInputRed, setIsInputRed] = useState<boolean>(false);
  const [hasMissedCurrentCard, setHasMissedCurrentCard] = useState<boolean>(false);

  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [highestStreak, setHighestStreak] = useState<number>(0);

  const currentGroups = useMemo(() => KANA_GROUPS_DATA[selectedKanaType], [selectedKanaType]);

  const totalAvailableSingleCards = useMemo(() => {
    return currentGroups
      .filter((g) => selectedGroupIds.includes(g.id))
      .reduce((acc, g) => acc + g.items.length, 0);
  }, [currentGroups, selectedGroupIds]);

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
    setSelectedGroupIds(currentGroups.map((g) => g.id));
  };

  const handleDeselectAllGroups = () => {
    setSelectedGroupIds(['a']);
  };

  const handleStartQuiz = async () => {
    if (autoNextTimeoutRef.current) {
      clearTimeout(autoNextTimeoutRef.current);
      autoNextTimeoutRef.current = null;
    }

    setIsLoading(true);
    setScore(0);
    setStreak(0);
    setHighestStreak(0);
    setCurrentIndex(0);
    setIsAnswered(false);
    setTextInput('');
    setSentenceResult(null);
    setIsAiFallback(false);
    
    setCorrectCount(0);
    setWrongCount(0);
    setIsInputRed(false);
    setHasMissedCurrentCard(false);

    if (quizMode === 'single') {
      let pool: Character[] = [];
      currentGroups.forEach((g) => {
        if (selectedGroupIds.includes(g.id)) {
          pool = [...pool, ...g.items];
        }
      });
      setSingleDeck(shuffleArray(pool));
      setIsLoading(false);
      setGameState('playing');
    } else {
      const { questions, isFallback } = await generateSentenceQuiz(sentenceKanaType, sentenceCount);
      setSentenceDeck(questions);
      setIsAiFallback(isFallback);

      if (isFallback) {
        setShowErrorModal(true);
      }

      setIsLoading(false);
      setGameState('playing');
    }
  };

  const handleSingleInput = (value: string) => {
    if (isAnswered) return;

    if (autoNextTimeoutRef.current) {
      clearTimeout(autoNextTimeoutRef.current);
      autoNextTimeoutRef.current = null;
    }

    const lower = value.toLowerCase().replace(/\s/g, '');
    const correctRomaji = singleDeck[currentIndex]?.romaji ?? '';
    setTextInput(lower);

    if (isInputRed) {
      setIsInputRed(false);
    }

    if (lower === correctRomaji) {
      setIsAnswered(true);
      
      if (!hasMissedCurrentCard) {
        setCorrectCount((prev) => prev + 1);
        setScore((prev) => prev + 1);
        setStreak((prev) => {
          const next = prev + 1;
          setHighestStreak((h) => Math.max(h, next));
          return next;
        });
      }
      
      handleNextQuestion();
      return;
    }

    if (lower.length >= correctRomaji.length) {
      setIsInputRed(true);
      if (!hasMissedCurrentCard) {
        setWrongCount((prev) => prev + 1);
        setHasMissedCurrentCard(true);
        setStreak(0);
      }
      
      handleNextQuestion();
    }
  };

  useEffect(() => {
    if (gameState === 'playing') {
      setTextInput('');
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [gameState, currentIndex]);

  const handleNextQuestion = useCallback(() => {
    if (autoNextTimeoutRef.current) {
      clearTimeout(autoNextTimeoutRef.current);
      autoNextTimeoutRef.current = null;
    }

    const totalQuestions = quizMode === 'single' ? singleDeck.length : sentenceDeck.length;

    if (currentIndex + 1 < totalQuestions) {
      setCurrentIndex((prev) => prev + 1);
      setIsAnswered(false);
      setTextInput('');
      setSentenceResult(null);
      setHasMissedCurrentCard(false);
    } else {
      setGameState('result');
    }
  }, [quizMode, singleDeck.length, sentenceDeck.length, currentIndex]);

  const handleSubmitSentence = (e: React.FormEvent) => {
    e.preventDefault();

    if (isAnswered) {
      handleNextQuestion();
      return;
    }

    if (!textInput.trim()) return;

    setIsAnswered(true);

    const cleanUserAns = textInput.trim().toLowerCase().replace(/\s+/g, '');
    const cleanTarget = (sentenceDeck[currentIndex]?.romaji || '').trim().toLowerCase().replace(/\s+/g, '');

    const isCorrect = cleanUserAns === cleanTarget;
    setSentenceResult({ isCorrect, userAns: textInput });

    if (isCorrect) {
      setScore((prev) => prev + 1);
      setStreak((prev) => {
        const next = prev + 1;
        setHighestStreak((h) => Math.max(h, next));
        return next;
      });
    } else {
      setStreak(0);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && gameState === 'playing' && isAnswered) {
        e.preventDefault();
        handleNextQuestion();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, isAnswered, handleNextQuestion]);

  const handleBack = () => {
    if (gameState === 'playing') {
      setGameState('setup');
    } else {
      setGameState('mode_select');
    }
  };

  const handleSelectMode = (mode: QuizMode) => {
    setQuizMode(mode);
    setGameState('setup');
  };

  const totalQuestions = quizMode === 'single' ? singleDeck.length : sentenceDeck.length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col justify-between p-4 md:p-8 relative">
      <Header gameState={gameState} onBack={handleBack} />

      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        sentenceCount={sentenceCount}
      />

      {gameState === 'mode_select' && (
        <ModeSelect onSelectMode={handleSelectMode} />
      )}

      {gameState === 'setup' && (
        <SetupScreen
          quizMode={quizMode}
          selectedKanaType={selectedKanaType}
          sentenceKanaType={sentenceKanaType}
          selectedGroupIds={selectedGroupIds}
          sentenceCount={sentenceCount}
          currentGroups={currentGroups}
          totalAvailableSingleCards={totalAvailableSingleCards}
          isLoading={isLoading}
          onSelectKanaType={setSelectedKanaType}
          onSelectSentenceKanaType={setSentenceKanaType}
          onToggleGroup={toggleGroup}
          onSelectAllGroups={handleSelectAllGroups}
          onDeselectAllGroups={handleDeselectAllGroups}
          onSetSentenceCount={setSentenceCount}
          onStartQuiz={handleStartQuiz}
        />
      )}

      {gameState === 'playing' && (
        <PlayingScreen
          quizMode={quizMode}
          isAiFallback={isAiFallback}
          sentenceCount={sentenceCount}
          currentIndex={currentIndex}
          singleDeck={singleDeck}
          sentenceDeck={sentenceDeck}
          textInput={textInput}
          isAnswered={isAnswered}
          isInputRed={isInputRed}
          correctCount={correctCount}
          wrongCount={wrongCount}
          streak={streak}
          sentenceResult={sentenceResult}
          inputRef={inputRef}
          onSingleInput={handleSingleInput}
          onTextInputChange={setTextInput}
          onSubmitSentence={handleSubmitSentence}
          onNextQuestion={handleNextQuestion}
        />
      )}

      {gameState === 'result' && (
        <ResultScreen
          quizMode={quizMode}
          selectedKanaType={selectedKanaType}
          score={score}
          highestStreak={highestStreak}
          totalQuestions={totalQuestions}
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