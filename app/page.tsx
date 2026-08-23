'use client';

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { BookOpen, Flame, RotateCcw, CheckCircle2, XCircle, Award, Play, ArrowLeft, Type, MessageSquareCode, Loader2, Send, AlertTriangle, X, CheckSquare, Square } from 'lucide-react';
import { generateSentenceQuiz, SentenceQuestion } from './actions';

type Character = { kana: string; romaji: string };
type KanaType = 'hiragana' | 'katakana';
type SentenceKanaType = 'hiragana' | 'katakana' | 'both';
type QuizMode = 'single' | 'sentence';
type GameState = 'mode_select' | 'setup' | 'playing' | 'result';

type KanaGroup = {
  id: string;
  name: string;
  items: Character[];
};

// --- DATASET PER BARIS / KOLOM (Gojūon, Dakuon, Handakuon & Yōon) ---
const KANA_GROUPS_DATA: Record<KanaType, KanaGroup[]> = {
  hiragana: [
    { id: 'a', name: 'あ (A)', items: [{ kana: 'あ', romaji: 'a' }, { kana: 'い', romaji: 'i' }, { kana: 'う', romaji: 'u' }, { kana: 'え', romaji: 'e' }, { kana: 'お', romaji: 'o' }] },
    { id: 'ka', name: 'か (KA)', items: [{ kana: 'か', romaji: 'ka' }, { kana: 'き', romaji: 'ki' }, { kana: 'く', romaji: 'ku' }, { kana: 'け', romaji: 'ke' }, { kana: 'こ', romaji: 'ko' }] },
    { id: 'sa', name: 'さ (SA)', items: [{ kana: 'さ', romaji: 'sa' }, { kana: 'し', romaji: 'shi' }, { kana: 'す', romaji: 'su' }, { kana: 'せ', romaji: 'se' }, { kana: 'そ', romaji: 'so' }] },
    { id: 'ta', name: 'た (TA)', items: [{ kana: 'た', romaji: 'ta' }, { kana: 'ち', romaji: 'chi' }, { kana: 'つ', romaji: 'tsu' }, { kana: 'て', romaji: 'te' }, { kana: 'と', romaji: 'to' }] },
    { id: 'na', name: 'な (NA)', items: [{ kana: 'な', romaji: 'na' }, { kana: 'に', romaji: 'ni' }, { kana: 'ぬ', romaji: 'nu' }, { kana: 'ね', romaji: 'ne' }, { kana: 'の', romaji: 'no' }] },
    { id: 'ha', name: 'は (HA)', items: [{ kana: 'は', romaji: 'ha' }, { kana: 'ひ', romaji: 'hi' }, { kana: 'ふ', romaji: 'fu' }, { kana: 'へ', romaji: 'he' }, { kana: 'ほ', romaji: 'ho' }] },
    { id: 'ma', name: 'ま (MA)', items: [{ kana: 'ま', romaji: 'ma' }, { kana: 'み', romaji: 'mi' }, { kana: 'む', romaji: 'mu' }, { kana: 'め', romaji: 'me' }, { kana: 'も', romaji: 'mo' }] },
    { id: 'ya', name: 'や (YA)', items: [{ kana: 'や', romaji: 'ya' }, { kana: 'ゆ', romaji: 'yu' }, { kana: 'よ', romaji: 'yo' }] },
    { id: 'ra', name: 'ら (RA)', items: [{ kana: 'ら', romaji: 'ra' }, { kana: 'り', romaji: 'ri' }, { kana: 'る', romaji: 'ru' }, { kana: 'れ', romaji: 're' }, { kana: 'ろ', romaji: 'ro' }] },
    { id: 'wa', name: 'わ (WA/N)', items: [{ kana: 'わ', romaji: 'wa' }, { kana: 'を', romaji: 'wo' }, { kana: 'ん', romaji: 'n' }] },
    { id: 'ga', name: 'が (GA)', items: [{ kana: 'が', romaji: 'ga' }, { kana: 'ぎ', romaji: 'gi' }, { kana: 'ぐ', romaji: 'gu' }, { kana: 'げ', romaji: 'ge' }, { kana: 'ご', romaji: 'go' }] },
    { id: 'za', name: 'ざ (ZA)', items: [{ kana: 'ざ', romaji: 'za' }, { kana: 'じ', romaji: 'ji' }, { kana: 'ず', romaji: 'zu' }, { kana: 'ぜ', romaji: 'ze' }, { kana: 'ぞ', romaji: 'zo' }] },
    { id: 'da', name: 'だ (DA)', items: [{ kana: 'だ', romaji: 'da' }, { kana: 'ぢ', romaji: 'ji' }, { kana: 'づ', romaji: 'zu' }, { kana: 'で', romaji: 'de' }, { kana: 'ど', romaji: 'do' }] },
    { id: 'ba', name: 'ば (BA)', items: [{ kana: 'ば', romaji: 'ba' }, { kana: 'び', romaji: 'bi' }, { kana: 'ぶ', romaji: 'bu' }, { kana: 'べ', romaji: 'be' }, { kana: 'ぼ', romaji: 'bo' }] },
    { id: 'pa', name: 'ぱ (PA)', items: [{ kana: 'ぱ', romaji: 'pa' }, { kana: 'ぴ', romaji: 'pi' }, { kana: 'ぷ', romaji: 'pu' }, { kana: 'ぺ', romaji: 'pe' }, { kana: 'ぽ', romaji: 'po' }] },
    { id: 'yoon', name: 'きゃ (Yōon)', items: [{ kana: 'きゃ', romaji: 'kya' }, { kana: 'きゅ', romaji: 'kyu' }, { kana: 'きょ', romaji: 'kyo' }, { kana: 'しゃ', romaji: 'sha' }, { kana: 'しゅ', romaji: 'shu' }, { kana: 'しょ', romaji: 'sho' }, { kana: 'ちゃ', romaji: 'cha' }, { kana: 'ちゅ', romaji: 'chu' }, { kana: 'ちょ', romaji: 'cho' }] },
  ],
  katakana: [
    { id: 'a', name: 'ア (A)', items: [{ kana: 'ア', romaji: 'a' }, { kana: 'イ', romaji: 'i' }, { kana: 'ウ', romaji: 'u' }, { kana: 'エ', romaji: 'e' }, { kana: 'オ', romaji: 'o' }] },
    { id: 'ka', name: 'カ (KA)', items: [{ kana: 'カ', romaji: 'ka' }, { kana: 'キ', romaji: 'ki' }, { kana: 'ク', romaji: 'ku' }, { kana: 'ケ', romaji: 'ke' }, { kana: 'コ', romaji: 'ko' }] },
    { id: 'sa', name: 'サ (SA)', items: [{ kana: 'サ', romaji: 'sa' }, { kana: 'シ', romaji: 'shi' }, { kana: 'ス', romaji: 'su' }, { kana: 'セ', romaji: 'se' }, { kana: 'ソ', romaji: 'so' }] },
    { id: 'ta', name: 'タ (TA)', items: [{ kana: 'タ', romaji: 'ta' }, { kana: 'チ', romaji: 'chi' }, { kana: 'ツ', romaji: 'tsu' }, { kana: 'テ', romaji: 'te' }, { kana: 'ト', romaji: 'to' }] },
    { id: 'na', name: 'ナ (NA)', items: [{ kana: 'ナ', romaji: 'na' }, { kana: 'ニ', romaji: 'ni' }, { kana: 'ヌ', romaji: 'nu' }, { kana: 'ネ', romaji: 'ne' }, { kana: 'ノ', romaji: 'no' }] },
    { id: 'ha', name: 'ハ (HA)', items: [{ kana: 'ハ', romaji: 'ha' }, { kana: 'ヒ', romaji: 'hi' }, { kana: 'フ', romaji: 'fu' }, { kana: 'ヘ', romaji: 'he' }, { kana: 'ホ', romaji: 'ho' }] },
    { id: 'ma', name: 'マ (MA)', items: [{ kana: 'マ', romaji: 'ma' }, { kana: 'ミ', romaji: 'mi' }, { kana: 'ム', romaji: 'mu' }, { kana: 'メ', romaji: 'me' }, { kana: 'モ', romaji: 'mo' }] },
    { id: 'ya', name: 'ヤ (YA)', items: [{ kana: 'ヤ', romaji: 'ya' }, { kana: 'ユ', romaji: 'yu' }, { kana: 'ヨ', romaji: 'yo' }] },
    { id: 'ra', name: 'ラ (RA)', items: [{ kana: 'ラ', romaji: 'ra' }, { kana: 'リ', romaji: 'ri' }, { kana: 'ル', romaji: 'ru' }, { kana: 'レ', romaji: 're' }, { kana: 'ロ', romaji: 'ro' }] },
    { id: 'wa', name: 'ワ (WA/N)', items: [{ kana: 'ワ', romaji: 'wa' }, { kana: 'ヲ', romaji: 'wo' }, { kana: 'ン', romaji: 'n' }] },
    { id: 'ga', name: 'ガ (GA)', items: [{ kana: 'ガ', romaji: 'ga' }, { kana: 'ギ', romaji: 'gi' }, { kana: 'グ', romaji: 'gu' }, { kana: 'ゲ', romaji: 'ge' }, { kana: 'ゴ', romaji: 'go' }] },
    { id: 'za', name: 'ザ (ZA)', items: [{ kana: 'ザ', romaji: 'za' }, { kana: 'ジ', romaji: 'ji' }, { kana: 'ズ', romaji: 'zu' }, { kana: 'ゼ', romaji: 'ze' }, { kana: 'ゾ', romaji: 'zo' }] },
    { id: 'da', name: 'ダ (DA)', items: [{ kana: 'ダ', romaji: 'da' }, { kana: 'ヂ', romaji: 'ji' }, { kana: 'ヅ', romaji: 'zu' }, { kana: 'デ', romaji: 'de' }, { kana: 'ド', romaji: 'do' }] },
    { id: 'ba', name: 'バ (BA)', items: [{ kana: 'バ', romaji: 'ba' }, { kana: 'ビ', romaji: 'bi' }, { kana: 'ブ', romaji: 'bu' }, { kana: 'ベ', romaji: 'be' }, { kana: 'ボ', romaji: 'bo' }] },
    { id: 'pa', name: 'パ (PA)', items: [{ kana: 'パ', romaji: 'pa' }, { kana: 'ピ', romaji: 'pi' }, { kana: 'プ', romaji: 'pu' }, { kana: 'ペ', romaji: 'pe' }, { kana: 'ポ', romaji: 'po' }] },
    { id: 'yoon', name: 'キャ (Yōon)', items: [{ kana: 'キャ', romaji: 'kya' }, { kana: 'キュ', romaji: 'kyu' }, { kana: 'キョ', romaji: 'kyo' }, { kana: 'シャ', romaji: 'sha' }, { kana: 'シュ', romaji: 'shu' }, { kana: 'ショ', romaji: 'sho' }, { kana: 'チャ', romaji: 'cha' }, { kana: 'チュ', romaji: 'chu' }, { kana: 'チョ', romaji: 'cho' }] },
  ],
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
  const [sentenceKanaType, setSentenceKanaType] = useState<SentenceKanaType>('hiragana');
  
  // State pilihan select all huruf (Default memilih select all 'a')
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

  // Single mode states
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [wrongCount, setWrongCount] = useState<number>(0);
  const [isInputRed, setIsInputRed] = useState<boolean>(false);
  const [hasMissedCurrentCard, setHasMissedCurrentCard] = useState<boolean>(false);

  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [highestStreak, setHighestStreak] = useState<number>(0);

  // Daftar grup untuk tipe kana aktif
  const currentGroups = useMemo(() => KANA_GROUPS_DATA[selectedKanaType], [selectedKanaType]);

  // Kalkulasi total kartu terpilih di mode single
  const totalAvailableSingleCards = useMemo(() => {
    return currentGroups
      .filter((g) => selectedGroupIds.includes(g.id))
      .reduce((acc, g) => acc + g.items.length, 0);
  }, [currentGroups, selectedGroupIds]);


  const toggleGroup = (groupId: string) => {
    setSelectedGroupIds((prev) => {
      if (prev.includes(groupId)) {
        if (prev.length === 1) return prev; // Minimal 1 select all harus terpilih
        return prev.filter((id) => id !== groupId);
      }
      return [...prev, groupId];
    });
  };

  const handleSelectAllGroups = () => {
    setSelectedGroupIds(currentGroups.map((g) => g.id));
  };

  const handleDeselectAllGroups = () => {
    setSelectedGroupIds(['a']); // Sisakan select all 'a'
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
      
      autoNextTimeoutRef.current = setTimeout(() => {
        handleNextQuestion();
      }, 150);
      return;
    }

    if (lower.length >= correctRomaji.length) {
      setIsInputRed(true);
      if (!hasMissedCurrentCard) {
        setWrongCount((prev) => prev + 1);
        setHasMissedCurrentCard(true);
        setStreak(0);
      }
      // Auto-next jika salah, beri waktu agak lebih lama (misal 800ms) 
      // Jika user mulai mengetik, timeout dibatalkan (di atas)
      autoNextTimeoutRef.current = setTimeout(() => {
        handleNextQuestion();
      }, 800);
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
      setIsInputRed(false);
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
// Select All
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
// select all
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
      {/* Header */}
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between pb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="text-cyan-400 size-6" />
          <span className="text-xl font-black tracking-tight">Kana<span className="text-cyan-400">Quiz</span></span>
        </div>
        {gameState !== 'mode_select' && (
          <button
            onClick={gameState === 'playing' ? () => setGameState('setup') : () => setGameState('mode_select')}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition"
          >
            <ArrowLeft size={14} /> Kembali
          </button>
        )}
      </header>

      {/* --- MODAL WARNING AI FALLBACK --- */}
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
                Gemini AI sedang tidak merespons. Kuis tetap berjalan menggunakan <span className="text-amber-400 font-semibold">{sentenceCount} pertanyaan default</span>.
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
            <h1 className="text-3xl font-extrabold text-white">Pilih Mode Latihan</h1>
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
                <p className="text-xs text-slate-400 mt-1">Tebak karakter satu per satu (pilihan ganda) sesuai select all/baris huruf.</p>
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
        <main className="max-w-4xl mx-auto w-full my-auto space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl">
            {/* Tipe Kana Switcher */}
            <div>
              {quizMode === 'single' ? (
                <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-2xl border border-slate-800 max-w-xs mx-auto">
                  {(['hiragana', 'katakana'] as KanaType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedKanaType(type)}
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
                        onClick={() => setSentenceKanaType(value)}
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
                      onClick={handleSelectAllGroups}
                      className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-medium"
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
                            onClick={() => toggleGroup(group.id)}
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
                            onClick={() => toggleGroup(group.id)}
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
              onClick={handleStartQuiz}
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
      )}

      {/* --- SCREEN 2: PLAYING --- */}
      {gameState === 'playing' && (
        <main className="max-w-xl mx-auto w-full my-auto space-y-4 md:space-y-6">
          {quizMode === 'sentence' && isAiFallback && (
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-950/60 border border-amber-800/80 text-amber-200 text-xs font-medium">
              <AlertTriangle size={18} className="text-amber-400 shrink-0" />
              <span>Sedang ada masalah pada AI. Kuis menggunakan pertanyaan default ({sentenceCount} soal).</span>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 px-1">
              <span>Soal {currentIndex + 1} dari {quizMode === 'single' ? singleDeck.length : sentenceDeck.length}</span>
              
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
                  width: `${
                    ((currentIndex + 1) / (quizMode === 'single' ? singleDeck.length : sentenceDeck.length)) * 100
                  }%`,
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
                onChange={(e) => handleSingleInput(e.target.value)}
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
              <form onSubmit={handleSubmitSentence} className="relative flex items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
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
                <div className="text-[10px] font-bold text-slate-500">Akurasi</div>
                <div className="text-xl font-black text-emerald-400 mt-1">
                  {Math.round(
                    (score / (quizMode === 'single' ? singleDeck.length : sentenceDeck.length)) * 100
                  )}%
                </div>
              </div>
              <div className="p-2 border-x border-slate-800">
                <div className="text-[10px] font-bold text-slate-500">Skor</div>
                <div className="text-xl font-black text-cyan-400 mt-1">
                  {score} / {quizMode === 'single' ? singleDeck.length : sentenceDeck.length}
                </div>
              </div>
              <div className="p-2">
                <div className="text-[10px] font-bold text-slate-500">Max Streak</div>
                <div className="text-xl font-black text-amber-400 mt-1">{highestStreak}</div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setGameState('setup')}
                className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-2xl transition text-sm"
              >
                Kembali
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
        &copy;Giraichi • Gira Nihonggo
      </footer>
    </div>
  );
}