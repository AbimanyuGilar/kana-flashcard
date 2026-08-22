'use client';

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Volume2, BookOpen, Layers3, Flame, RotateCcw, CheckCircle2, XCircle, Award, Play, ArrowLeft, Type, MessageSquareCode, Loader2, Send, AlertTriangle, X } from 'lucide-react';
import { generateSentenceQuiz, SentenceQuestion } from './actions';

type Character = { kana: string; romaji: string };
type KanaCategory = 'gojuon' | 'dakuon' | 'handakuon' | 'yoon';
type KanaType = 'hiragana' | 'katakana';
type QuizMode = 'single' | 'sentence';
type GameState = 'mode_select' | 'setup' | 'playing' | 'result';

const KANA_MASTER_DATA = {
  hiragana: {
    gojuon: [
      { kana: 'あ', romaji: 'a' }, { kana: 'い', romaji: 'i' }, { kana: 'う', romaji: 'u' }, { kana: 'え', romaji: 'e' }, { kana: 'お', romaji: 'o' },
      { kana: 'か', romaji: 'ka' }, { kana: 'き', romaji: 'ki' }, { kana: 'く', romaji: 'ku' }, { kana: 'け', romaji: 'ke' }, { kana: 'こ', romaji: 'ko' },
      { kana: 'さ', romaji: 'sa' }, { kana: 'し', romaji: 'shi' }, { kana: 'す', romaji: 'su' }, { kana: 'せ', romaji: 'se' }, { kana: 'そ', romaji: 'so' },
      { kana: 'た', romaji: 'ta' }, { kana: 'ち', romaji: 'chi' }, { kana: 'つ', romaji: 'tsu' }, { kana: 'て', romaji: 'te' }, { kana: 'と', romaji: 'to' },
      { kana: 'な', romaji: 'na' }, { kana: 'に', romaji: 'ni' }, { kana: 'ぬ', romaji: 'nu' }, { kana: 'ね', romaji: 'ne' }, { kana: 'の', romaji: 'no' },
      { kana: 'は', romaji: 'ha' }, { kana: 'ひ', romaji: 'hi' }, { kana: 'ふ', romaji: 'fu' }, { kana: 'へ', romaji: 'he' }, { kana: 'ほ', romaji: 'ho' },
      { kana: 'ま', romaji: 'ma' }, { kana: 'み', romaji: 'mi' }, { kana: 'む', romaji: 'mu' }, { kana: 'め', romaji: 'me' }, { kana: 'も', romaji: 'mo' },
      { kana: 'や', romaji: 'ya' }, { kana: 'ゆ', romaji: 'yu' }, { kana: 'よ', romaji: 'yo' },
      { kana: 'ら', romaji: 'ra' }, { kana: 'り', romaji: 'ri' }, { kana: 'る', romaji: 'ru' }, { kana: 'れ', romaji: 're' }, { kana: 'ろ', romaji: 'ro' },
      { kana: 'わ', romaji: 'wa' }, { kana: 'を', romaji: 'wo' }, { kana: 'ん', romaji: 'n' },
    ],
    dakuon: [
      { kana: 'が', romaji: 'ga' }, { kana: 'ぎ', romaji: 'gi' }, { kana: 'ぐ', romaji: 'gu' }, { kana: 'げ', romaji: 'ge' }, { kana: 'ご', romaji: 'go' },
      { kana: 'ざ', romaji: 'za' }, { kana: 'じ', romaji: 'ji' }, { kana: 'ず', romaji: 'zu' }, { kana: 'ぜ', romaji: 'ze' }, { kana: 'ぞ', romaji: 'zo' },
      { kana: 'だ', romaji: 'da' }, { kana: 'ぢ', romaji: 'ji' }, { kana: 'づ', romaji: 'zu' }, { kana: 'で', romaji: 'de' }, { kana: 'ど', romaji: 'do' },
      { kana: 'ば', romaji: 'ba' }, { kana: 'び', romaji: 'bi' }, { kana: 'ぶ', romaji: 'bu' }, { kana: 'べ', romaji: 'be' }, { kana: 'ぼ', romaji: 'bo' },
    ],
    handakuon: [
      { kana: 'ぱ', romaji: 'pa' }, { kana: 'ぴ', romaji: 'pi' }, { kana: 'ぷ', romaji: 'pu' }, { kana: 'ぺ', romaji: 'pe' }, { kana: 'ぽ', romaji: 'po' },
    ],
    yoon: [
      { kana: 'きゃ', romaji: 'kya' }, { kana: 'きゅ', romaji: 'kyu' }, { kana: 'きょ', romaji: 'kyo' },
      { kana: 'しゃ', romaji: 'sha' }, { kana: 'しゅ', romaji: 'shu' }, { kana: 'しょ', romaji: 'sho' },
      { kana: 'ちゃ', romaji: 'cha' }, { kana: 'ちゅ', romaji: 'chu' }, { kana: 'ちょ', romaji: 'cho' },
      { kana: 'にゃ', romaji: 'nya' }, { kana: 'にゅ', romaji: 'nyu' }, { kana: 'にょ', romaji: 'nyo' },
      { kana: 'ひゃ', romaji: 'hya' }, { kana: 'ひゅ', romaji: 'hyu' }, { kana: 'ひょ', romaji: 'hyo' },
      { kana: 'みゃ', romaji: 'mya' }, { kana: 'みゅ', romaji: 'myu' }, { kana: 'みょ', romaji: 'myo' },
      { kana: 'りゃ', romaji: 'rya' }, { kana: 'りゅ', romaji: 'ryu' }, { kana: 'りょ', romaji: 'ryo' },
      { kana: 'ぎゃ', romaji: 'gya' }, { kana: 'ぎゅ', romaji: 'gyu' }, { kana: 'ぎょ', romaji: 'gyo' },
      { kana: 'じゃ', romaji: 'ja' }, { kana: 'じゅ', romaji: 'ju' }, { kana: 'じょ', romaji: 'jo' },
      { kana: 'びゃ', romaji: 'bya' }, { kana: 'びゅ', romaji: 'byu' }, { kana: 'びょ', romaji: 'byo' },
      { kana: 'ぴゃ', romaji: 'pya' }, { kana: 'ぴゅ', romaji: 'pyu' }, { kana: 'ぴょ', romaji: 'pyo' },
    ],
  },
  katakana: {
    gojuon: [
      { kana: 'ア', romaji: 'a' }, { kana: 'イ', romaji: 'i' }, { kana: 'ウ', romaji: 'u' }, { kana: 'エ', romaji: 'e' }, { kana: 'オ', romaji: 'o' },
      { kana: 'カ', romaji: 'ka' }, { kana: 'キ', romaji: 'ki' }, { kana: 'ク', romaji: 'ku' }, { kana: 'ケ', romaji: 'ke' }, { kana: 'コ', romaji: 'ko' },
      { kana: 'サ', romaji: 'sa' }, { kana: 'シ', romaji: 'shi' }, { kana: 'ス', romaji: 'su' }, { kana: 'セ', romaji: 'se' }, { kana: 'ソ', romaji: 'so' },
      { kana: 'タ', romaji: 'ta' }, { kana: 'チ', romaji: 'chi' }, { kana: 'ツ', romaji: 'tsu' }, { kana: 'テ', romaji: 'te' }, { kana: 'ト', romaji: 'to' },
      { kana: 'ナ', romaji: 'na' }, { kana: 'ニ', romaji: 'ni' }, { kana: 'ヌ', romaji: 'nu' }, { kana: 'ネ', romaji: 'ne' }, { kana: 'ノ', romaji: 'no' },
      { kana: 'ハ', romaji: 'ha' }, { kana: 'ヒ', romaji: 'hi' }, { kana: 'フ', romaji: 'fu' }, { kana: 'ヘ', romaji: 'he' }, { kana: 'ホ', romaji: 'ho' },
      { kana: 'マ', romaji: 'ma' }, { kana: 'ミ', romaji: 'mi' }, { kana: 'ム', romaji: 'mu' }, { kana: 'メ', romaji: 'me' }, { kana: 'モ', romaji: 'mo' },
      { kana: 'ヤ', romaji: 'ya' }, { kana: 'ユ', romaji: 'yu' }, { kana: 'ヨ', romaji: 'yo' },
      { kana: 'ラ', romaji: 'ra' }, { kana: 'リ', romaji: 'ri' }, { kana: 'ル', romaji: 'ru' }, { kana: 'レ', romaji: 're' }, { kana: 'ロ', romaji: 'ro' },
      { kana: 'ワ', romaji: 'wa' }, { kana: 'ヲ', romaji: 'wo' }, { kana: 'ン', romaji: 'n' },
    ],
    dakuon: [
      { kana: 'ガ', romaji: 'ga' }, { kana: 'ギ', romaji: 'gi' }, { kana: 'グ', romaji: 'gu' }, { kana: 'ゲ', romaji: 'ge' }, { kana: 'ゴ', romaji: 'go' },
      { kana: 'ザ', romaji: 'za' }, { kana: 'ジ', romaji: 'ji' }, { kana: 'ズ', romaji: 'zu' }, { kana: 'ゼ', romaji: 'ze' }, { kana: 'ゾ', romaji: 'zo' },
      { kana: 'ダ', romaji: 'da' }, { kana: 'ヂ', romaji: 'ji' }, { kana: 'ヅ', romaji: 'zu' }, { kana: 'デ', romaji: 'de' }, { kana: 'ド', romaji: 'do' },
      { kana: 'バ', romaji: 'ba' }, { kana: 'ビ', romaji: 'bi' }, { kana: 'ブ', romaji: 'bu' }, { kana: 'ベ', romaji: 'be' }, { kana: 'ボ', romaji: 'bo' },
    ],
    handakuon: [
      { kana: 'パ', romaji: 'pa' }, { kana: 'ピ', romaji: 'pi' }, { kana: 'プ', romaji: 'pu' }, { kana: 'ペ', romaji: 'pe' }, { kana: 'ポ', romaji: 'po' },
    ],
    yoon: [
      { kana: 'キャ', romaji: 'kya' }, { kana: 'キュ', romaji: 'kyu' }, { kana: 'キョ', romaji: 'kyo' },
      { kana: 'シャ', romaji: 'sha' }, { kana: 'シュ', romaji: 'shu' }, { kana: 'ショ', romaji: 'sho' },
      { kana: 'チャ', romaji: 'cha' }, { kana: 'チュ', romaji: 'chu' }, { kana: 'チョ', romaji: 'cho' },
      { kana: 'ニャ', romaji: 'nya' }, { kana: 'ニュ', romaji: 'nyu' }, { kana: 'ニョ', romaji: 'nyo' },
      { kana: 'ヒャ', romaji: 'hya' }, { kana: 'ヒュ', romaji: 'hyu' }, { kana: 'ヒョ', romaji: 'hyo' },
      { kana: 'ミャ', romaji: 'mya' }, { kana: 'ミュ', romaji: 'myu' }, { kana: 'ミョ', romaji: 'myo' },
      { kana: 'リャ', romaji: 'rya' }, { kana: 'リュ', romaji: 'ryu' }, { kana: 'リョ', romaji: 'ryo' },
      { kana: 'ギャ', romaji: 'gya' }, { kana: 'ギュ', romaji: 'gyu' }, { kana: 'ギョ', romaji: 'gyo' },
      { kana: 'ジャ', romaji: 'ja' }, { kana: 'ジュ', romaji: 'ju' }, { kana: 'ジョ', romaji: 'jo' },
      { kana: 'ビャ', romaji: 'bya' }, { kana: 'ビュ', romaji: 'byu' }, { kana: 'ビョ', romaji: 'byo' },
      { kana: 'ピャ', romaji: 'pya' }, { kana: 'ピュ', romaji: 'pyu' }, { kana: 'ピョ', romaji: 'pyo' },
    ],
  },
};

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function KanaQuizApp() {
  const [gameState, setGameState] = useState<GameState>('mode_select');
  const [quizMode, setQuizMode] = useState<QuizMode>('single');
  const [selectedKanaType, setSelectedKanaType] = useState<KanaType>('hiragana');
  const [selectedCategories, setSelectedCategories] = useState<KanaCategory[]>(['gojuon']);
  const [sentenceCount, setSentenceCount] = useState<number>(5);

  const [singleDeck, setSingleDeck] = useState<Character[]>([]);
  const [sentenceDeck, setSentenceDeck] = useState<SentenceQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  
  // State Error Modal Custom
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
  const [isAiFallback, setIsAiFallback] = useState<boolean>(false);
  
  const [singleOptions, setSingleOptions] = useState<string[]>([]);
  const [textInput, setTextInput] = useState<string>('');
  const [sentenceResult, setSentenceResult] = useState<{ isCorrect: boolean; userAns: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [highestStreak, setHighestStreak] = useState<number>(0);

  const totalAvailableSingleCards = useMemo(() => {
    return selectedCategories.reduce((acc, cat) => {
      return acc + KANA_MASTER_DATA[selectedKanaType][cat].length;
    }, 0);
  }, [selectedKanaType, selectedCategories]);

  const fullPool = useMemo(() => {
    return [
      ...KANA_MASTER_DATA[selectedKanaType].gojuon,
      ...KANA_MASTER_DATA[selectedKanaType].dakuon,
      ...KANA_MASTER_DATA[selectedKanaType].handakuon,
      ...KANA_MASTER_DATA[selectedKanaType].yoon,
    ];
  }, [selectedKanaType]);

  const toggleCategory = (cat: KanaCategory) => {
    setSelectedCategories((prev) => {
      if (prev.includes(cat)) {
        if (prev.length === 1) return prev;
        return prev.filter((c) => c !== cat);
      }
      return [...prev, cat];
    });
  };

  const handleStartQuiz = async () => {
    setIsLoading(true);
    setScore(0);
    setStreak(0);
    setHighestStreak(0);
    setCurrentIndex(0);
    setIsAnswered(false);
    setSelectedOption(null);
    setTextInput('');
    setSentenceResult(null);
    setIsAiFallback(false);

    if (quizMode === 'single') {
      let pool: Character[] = [];
      selectedCategories.forEach((cat) => {
        pool = [...pool, ...KANA_MASTER_DATA[selectedKanaType][cat]];
      });
      setSingleDeck(shuffleArray(pool));
      setIsLoading(false);
      setGameState('playing');
    } else {
      const { questions, isFallback } = await generateSentenceQuiz(selectedKanaType, sentenceCount);
      
      setSentenceDeck(questions);
      setIsAiFallback(isFallback);

      if (isFallback) {
        setShowErrorModal(true); // Tampilkan modal kustom
      }

      setIsLoading(false);
      setGameState('playing');
    }
  };

  const generateSingleOptions = useCallback(
    (correctRomaji: string) => {
      const distractors = fullPool
        .filter((item) => item.romaji !== correctRomaji)
        .map((item) => item.romaji);
      const uniqueDistractors = Array.from(new Set(distractors));
      const shuffledDistractors = shuffleArray(uniqueDistractors).slice(0, 3);
      setSingleOptions(shuffleArray([correctRomaji, ...shuffledDistractors]));
    },
    [fullPool]
  );

  useEffect(() => {
    if (gameState === 'playing') {
      if (quizMode === 'single') {
        const curr = singleDeck[currentIndex];
        if (curr) generateSingleOptions(curr.romaji);
      } else {
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    }
  }, [gameState, currentIndex, quizMode, singleDeck, generateSingleOptions]);

  const handleSelectSingleOption = (option: string) => {
    if (isAnswered) return;

    setSelectedOption(option);
    setIsAnswered(true);

    const targetRomaji = singleDeck[currentIndex]?.romaji;
    const isCorrect = option === targetRomaji;

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

  const handleNextQuestion = useCallback(() => {
    const totalQuestions = quizMode === 'single' ? singleDeck.length : sentenceDeck.length;

    if (currentIndex + 1 < totalQuestions) {
      setCurrentIndex((prev) => prev + 1);
      setIsAnswered(false);
      setSelectedOption(null);
      setTextInput('');
      setSentenceResult(null);
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

  const playAudio = (text: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col justify-between p-4 md:p-8 relative">
      {/* Header */}
      <header className="max-w-xl mx-auto w-full flex items-center justify-between pb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="text-cyan-400 size-6" />
          <span className="text-xl font-black tracking-tight">Kana<span className="text-cyan-400">Quiz</span></span>
        </div>
        {gameState !== 'mode_select' && (
          <button
            onClick={() => setGameState('mode_select')}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition"
          >
            <ArrowLeft size={14} /> Ganti Mode
          </button>
        )}
      </header>

      {/* --- MODAL CARD WARNING AI FALLBACK --- */}
      {showErrorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 space-y-5 shadow-2xl relative text-center">
            <button
              onClick={() => setShowErrorModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/50 hover:bg-slate-800 transition"
            >
              <X size={16} />
            </button>

            <div className="size-14 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center mx-auto">
              <AlertTriangle size={28} />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white">Masalah Koneksi AI</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Gemini AI sedang mengalami gangguan atau limit habis. Kuis tetap berjalan menggunakan <span className="text-amber-400 font-semibold">{sentenceCount} pertanyaan default</span>.
              </p>
            </div>

            <button
              onClick={() => setShowErrorModal(false)}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition text-sm shadow-md"
            >
              Saya Mengerti
            </button>
          </div>
        </div>
      )}

      {/* --- SCREEN 0: PEMILIHAN MODE --- */}
      {gameState === 'mode_select' && (
        <main className="max-w-xl mx-auto w-full my-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-extrabold text-white">Pilih Mode Belajar</h1>
            <p className="text-sm text-slate-400">Pilih jenis tebakan yang ingin kamu latih</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => {
                setQuizMode('single');
                setGameState('setup');
              }}
              className="bg-slate-900 border border-slate-800 hover:border-cyan-500/50 p-6 rounded-3xl text-left space-y-3 transition-all hover:scale-[1.02]"
            >
              <div className="size-12 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-2xl flex items-center justify-center">
                <Type size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Mode Single Karakter</h3>
                <p className="text-xs text-slate-400 mt-1">Tebak karakter satu per satu (pilihan ganda) sesuai kelompok huruf.</p>
              </div>
            </button>

            <button
              onClick={() => {
                setQuizMode('sentence');
                setGameState('setup');
              }}
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
      )}

      {/* --- SCREEN 1: SETUP --- */}
      {gameState === 'setup' && (
        <main className="max-w-xl mx-auto w-full my-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-extrabold text-white">
              {quizMode === 'single' ? 'Konfigurasi Mode Single' : 'Konfigurasi Mode Kalimat AI'}
            </h1>
            <p className="text-sm text-slate-400">Atur parameter sebelum memulai kuis</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl">
            {/* Tipe Kana */}
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">Tipe Huruf</label>
              <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-2xl border border-slate-800">
                {(['hiragana', 'katakana'] as KanaType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedKanaType(type)}
                    className={`py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition-all ${
                      selectedKanaType === type
                        ? 'bg-cyan-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Kategori khusus Mode Single */}
            {quizMode === 'single' && (
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">Kategori Kumpulan Huruf</label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { id: 'gojuon', label: 'Dasar (Gojūon)', count: KANA_MASTER_DATA[selectedKanaType].gojuon.length },
                    { id: 'dakuon', label: 'Tenten / Petik (Dakuon)', count: KANA_MASTER_DATA[selectedKanaType].dakuon.length },
                    { id: 'handakuon', label: 'Maru / Lingkaran (Handakuon)', count: KANA_MASTER_DATA[selectedKanaType].handakuon.length },
                    { id: 'yoon', label: 'Gabungan (Yōon)', count: KANA_MASTER_DATA[selectedKanaType].yoon.length },
                  ].map((cat) => {
                    const isChecked = selectedCategories.includes(cat.id as KanaCategory);
                    return (
                      <button
                        key={cat.id}
                        onClick={() => toggleCategory(cat.id as KanaCategory)}
                        className={`flex items-center justify-between p-4 rounded-xl border text-left text-sm font-semibold transition-all ${
                          isChecked
                            ? 'bg-cyan-950/40 border-cyan-700 text-cyan-200'
                            : 'bg-slate-950/50 border-slate-800 text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <Layers3 size={18} className={isChecked ? 'text-cyan-400' : 'text-slate-600'} />
                          {cat.label}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-slate-500 font-mono">({cat.count})</span>
                          <div className={`size-5 rounded-md border flex items-center justify-center ${isChecked ? 'bg-cyan-600 border-cyan-500' : 'border-slate-700'}`}>
                            {isChecked && <CheckCircle2 size={14} className="text-white" />}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Opsi Jumlah Soal Khusus Mode Kalimat */}
            {quizMode === 'sentence' && (
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">Jumlah Soal Kalimat</label>
                <div className="grid grid-cols-3 gap-2">
                  {[5, 10, 20].map((count) => (
                    <button
                      key={count}
                      onClick={() => setSentenceCount(count)}
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

            {quizMode === 'single' ? (
              <div className="flex items-center justify-between bg-slate-950 px-4 py-3 rounded-xl border border-slate-800 text-xs text-slate-400">
                <span>Total soal yang akan dimainkan:</span>
                <span className="font-extrabold text-cyan-400 text-sm font-mono">{totalAvailableSingleCards} Soal</span>
              </div>
            ) : (
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-400 leading-relaxed">
                ✨ Gemini AI akan membuat {sentenceCount} kalimat bahasa Jepang secara acak. Jawaban berupa ketikan cara baca Romaji.
              </div>
            )}

            <button
              onClick={handleStartQuiz}
              disabled={isLoading}
              className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition shadow-lg text-base"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin text-cyan-400" /> Generating AI...
                </>
              ) : (
                <>
                  <Play size={20} className="fill-current" /> Mulai Tebakan
                </>
              )}
            </button>
          </div>
        </main>
      )}

      {/* --- SCREEN 2: PLAYING --- */}
      {gameState === 'playing' && (
        <main className="max-w-xl mx-auto w-full my-auto space-y-6">
          {quizMode === 'sentence' && isAiFallback && (
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-950/60 border border-amber-800/80 text-amber-200 text-xs font-medium">
              <AlertTriangle size={18} className="text-amber-400 shrink-0" />
              <span>Sedang ada masalah pada AI. Kuis menggunakan pertanyaan default ({sentenceCount} soal).</span>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 px-1">
              <span>Soal {currentIndex + 1} dari {quizMode === 'single' ? singleDeck.length : sentenceDeck.length}</span>
              <span className="flex items-center gap-1 text-amber-400">
                <Flame size={14} /> Streak: {streak}
              </span>
            </div>
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-cyan-500 transition-all duration-300"
                style={{
                  width: `${
                    ((currentIndex + 1) / (quizMode === 'single' ? singleDeck.length : sentenceDeck.length)) * 100
                  }%`,
                }}
              />
            </div>
          </div>

          {/* Card Soal Utama */}
          <div className="relative bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center min-h-[200px] shadow-2xl text-center">
            <button
              onClick={(e) =>
                playAudio(
                  quizMode === 'single'
                    ? singleDeck[currentIndex]?.kana
                    : sentenceDeck[currentIndex]?.sentence,
                  e
                )
              }
              className="absolute top-4 right-4 p-3 rounded-full bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            >
              <Volume2 size={20} />
            </button>

            {quizMode === 'single' ? (
              <div className="text-8xl font-black text-white tracking-wide">
                {singleDeck[currentIndex]?.kana}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-3xl md:text-4xl font-bold text-white tracking-wider leading-relaxed">
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
            <div className="grid grid-cols-2 gap-3">
              {singleOptions.map((option, idx) => {
                let btnStyle = 'bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-700';
                const targetRomaji = singleDeck[currentIndex]?.romaji;

                if (isAnswered) {
                  if (option === targetRomaji) {
                    btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200';
                  } else if (option === selectedOption) {
                    btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200';
                  } else {
                    btnStyle = 'bg-slate-900/40 border-slate-800/40 text-slate-600';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleSelectSingleOption(option)}
                    className={`py-4 px-4 rounded-2xl border text-sm md:text-base font-bold tracking-wider transition-all flex items-center justify-between ${btnStyle}`}
                  >
                    <span className="truncate">{option}</span>
                    {isAnswered && option === targetRomaji && (
                      <CheckCircle2 size={18} className="text-emerald-400 shrink-0 ml-1" />
                    )}
                    {isAnswered && option === selectedOption && option !== targetRomaji && (
                      <XCircle size={18} className="text-rose-400 shrink-0 ml-1" />
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-3">
              <form onSubmit={handleSubmitSentence} className="relative flex items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  disabled={isAnswered}
                  placeholder="Ketik cara baca Romaji di sini..."
                  className={`w-full py-4 pl-5 pr-14 bg-slate-900 border-2 rounded-2xl text-lg font-medium text-white placeholder-slate-500 focus:outline-none transition-all ${
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
                  className="absolute right-2 p-3 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 text-white rounded-xl transition"
                >
                  <Send size={18} />
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

          {isAnswered && (
            <button
              onClick={handleNextQuestion}
              className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition shadow-lg text-base animate-in fade-in slide-in-from-bottom-2 duration-200"
            >
              Soal Berikutnya
            </button>
          )}
        </main>
      )}

      {/* --- SCREEN 3: RESULT --- */}
      {gameState === 'result' && (
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
                <div className="text-[10px] uppercase font-bold text-slate-500">Akurasi</div>
                <div className="text-xl font-black text-emerald-400 mt-1">
                  {Math.round(
                    (score / (quizMode === 'single' ? singleDeck.length : sentenceDeck.length)) * 100
                  )}%
                </div>
              </div>
              <div className="p-2 border-x border-slate-800">
                <div className="text-[10px] uppercase font-bold text-slate-500">Skor</div>
                <div className="text-xl font-black text-cyan-400 mt-1">
                  {score} / {quizMode === 'single' ? singleDeck.length : sentenceDeck.length}
                </div>
              </div>
              <div className="p-2">
                <div className="text-[10px] uppercase font-bold text-slate-500">Max Streak</div>
                <div className="text-xl font-black text-amber-400 mt-1">{highestStreak}</div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setGameState('mode_select')}
                className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-2xl transition text-sm"
              >
                Ganti Mode
              </button>
              <button
                onClick={handleStartQuiz}
                className="flex-1 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition shadow-lg text-sm"
              >
                <RotateCcw size={16} /> Main Lagi
              </button>
            </div>
          </div>
        </main>
      )}

      <footer className="text-center text-xs text-slate-600 py-2">
        KanaQuiz App • Built with Next.js & Gemini API
      </footer>
    </div>
  );
}