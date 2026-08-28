'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { generateSentenceQuiz, SentenceQuestion } from '../actions';
import { SentenceKanaType } from '../types';

import Header from '../components/Header';
import ErrorModal from '../components/ErrorModal';
import SetupScreen from '../components/SetupScreen';
import PlayingScreen from '../components/PlayingScreen';
import ResultScreen from '../components/ResultScreen';

type GameState = 'setup' | 'playing' | 'result';

export default function SentencePage() {
  const [gameState, setGameState] = useState<GameState>('setup');
  const [sentenceKanaType, setSentenceKanaType] = useState<SentenceKanaType>('hiragana');
  const [sentenceCount, setSentenceCount] = useState<number>(5);

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

  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [highestStreak, setHighestStreak] = useState<number>(0);

  const resetState = () => {
    setScore(0);
    setStreak(0);
    setHighestStreak(0);
    setCurrentIndex(0);
    setIsAnswered(false);
    setTextInput('');
    setSentenceResult(null);
    setIsAiFallback(false);
  };

  const handleStartQuiz = async () => {
    if (autoNextTimeoutRef.current) {
      clearTimeout(autoNextTimeoutRef.current);
      autoNextTimeoutRef.current = null;
    }

    setIsLoading(true);
    resetState();

    const { questions, isFallback } = await generateSentenceQuiz(sentenceKanaType, sentenceCount);
    setSentenceDeck(questions);
    setIsAiFallback(isFallback);

    if (isFallback) {
      setShowErrorModal(true);
    }

    setIsLoading(false);
    setGameState('playing');
  };

  useEffect(() => {
    if (gameState === 'playing') {
      const timeout = setTimeout(() => inputRef.current?.focus(), 80);
      return () => clearTimeout(timeout);
    }
  }, [gameState, currentIndex]);

  const handleNextQuestion = useCallback(() => {
    if (autoNextTimeoutRef.current) {
      clearTimeout(autoNextTimeoutRef.current);
      autoNextTimeoutRef.current = null;
    }

    if (currentIndex + 1 < sentenceDeck.length) {
      setCurrentIndex((prev) => prev + 1);
      setIsAnswered(false);
      setTextInput('');
      setSentenceResult(null);
    } else {
      setGameState('result');
    }
  }, [sentenceDeck.length, currentIndex]);

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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col justify-between p-4 md:p-8 relative">
      <Header showBack backHref="/" />

      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        sentenceCount={sentenceCount}
      />

      {gameState === 'setup' && (
        <SetupScreen
          quizMode="sentence"
          selectedKanaType="hiragana"
          sentenceKanaType={sentenceKanaType}
          selectedGroupIds={['a']}
          sentenceCount={sentenceCount}
          currentGroups={[]}
          totalAvailableSingleCards={0}
          isLoading={isLoading}
          onSelectKanaType={() => {}}
          onSelectSentenceKanaType={setSentenceKanaType}
          onToggleGroup={() => {}}
          onSelectAllGroups={() => {}}
          onDeselectAllGroups={() => {}}
          onSetSentenceCount={setSentenceCount}
          onStartQuiz={handleStartQuiz}
        />
      )}

      {gameState === 'playing' && (
        <PlayingScreen
          quizMode="sentence"
          isAiFallback={isAiFallback}
          sentenceCount={sentenceCount}
          currentIndex={currentIndex}
          singleDeck={[]}
          sentenceDeck={sentenceDeck}
          textInput={textInput}
          isAnswered={isAnswered}
          isInputRed={false}
          correctCount={0}
          wrongCount={0}
          streak={streak}
          sentenceResult={sentenceResult}
          inputRef={inputRef}
          onSingleInput={() => {}}
          onTextInputChange={setTextInput}
          onSubmitSentence={handleSubmitSentence}
          onNextQuestion={handleNextQuestion}
        />
      )}

      {gameState === 'result' && (
        <ResultScreen
          quizMode="sentence"
          selectedKanaType={sentenceKanaType}
          score={score}
          highestStreak={highestStreak}
          totalQuestions={sentenceDeck.length}
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
