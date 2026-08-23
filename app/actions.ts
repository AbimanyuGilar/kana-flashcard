'use server';

import { GoogleGenAI, Type } from '@google/genai';

type KanaType = 'hiragana' | 'katakana' | 'both';

export type SentenceQuestion = {
  sentence: string;
  romaji: string;
  meaning: string;
};

export type SentenceQuizResponse = {
  questions: SentenceQuestion[];
  isFallback: boolean;
};

const DEFAULT_HIRAGANA: SentenceQuestion[] = [
  { sentence: 'こんにちは', romaji: 'konnichiwa', meaning: 'Halo / Selamat siang' },
  { sentence: 'ありがとう', romaji: 'arigatou', meaning: 'Terima kasih' },
  { sentence: 'おはよう', romaji: 'ohayou', meaning: 'Selamat pagi' },
  { sentence: 'すみません', romaji: 'sumimasen', meaning: 'Permisi / Maaf' },
  { sentence: 'さようなら', romaji: 'sayounara', meaning: 'Selamat tinggal' },
  { sentence: 'こんばんは', romaji: 'konbanwa', meaning: 'Selamat malam' },
  { sentence: 'はじめまして', romaji: 'hajimemashite', meaning: 'Salam kenal' },
  { sentence: 'おねがいします', romaji: 'onegaishimasu', meaning: 'Tolong / Mohon dibantu' },
  { sentence: 'いただきます', romaji: 'itadakimasu', meaning: 'Selamat makan' },
  { sentence: 'ごちそうさまでした', romaji: 'gochisousamadeshita', meaning: 'Terima kasih atas makanannya' },
  { sentence: 'おやすみなさい', romaji: 'oyasuminasai', meaning: 'Selamat tidur' },
  { sentence: 'じゃあね', romaji: 'jaane', meaning: 'Sampai jumpa lagi' },
  { sentence: 'おげんきですか', romaji: 'ogenkidesuka', meaning: 'Apa kabar?' },
  { sentence: 'ごめんなさい', romaji: 'gomennasai', meaning: 'Mohon maaf' },
  { sentence: 'ただいま', romaji: 'tadaima', meaning: 'Aku pulang / Saya kembali' },
  { sentence: 'おかえりなさい', romaji: 'okaerinasai', meaning: 'Selamat datang kembali' },
  { sentence: 'いってらっしゃい', romaji: 'itterasshai', meaning: 'Selamat jalan' },
  { sentence: 'いってきます', romaji: 'ittekimasu', meaning: 'Saya berangkat' },
  { sentence: 'おめでとう', romaji: 'omedetou', meaning: 'Selamat!' },
  { sentence: 'だいじょうぶです', romaji: 'daijoubudesu', meaning: 'Tidak apa-apa' },
];

const DEFAULT_KATAKANA: SentenceQuestion[] = [
  { sentence: 'コーヒー', romaji: 'ko-hi-', meaning: 'Kopi' },
  { sentence: 'アイスクリーム', romaji: 'aisukuri-mu', meaning: 'Es krim' },
  { sentence: 'レストラン', romaji: 'resutoran', meaning: 'Restoran' },
  { sentence: 'ホテル', romaji: 'hoteru', meaning: 'Hotel' },
  { sentence: 'タクシー', romaji: 'takushi-', meaning: 'Taksi' },
  { sentence: 'カメラ', romaji: 'kamera', meaning: 'Kamera' },
  { sentence: 'テレビ', romaji: 'terebi', meaning: 'Televisi' },
  { sentence: 'パソコン', romaji: 'pasokon', meaning: 'Komputer / Laptop' },
  { sentence: 'スマートフォン', romaji: 'suma-tofon', meaning: 'Smartphone' },
  { sentence: 'スーパーマーケット', romaji: 'su-pa-ma-ketto', meaning: 'Supermarket' },
  { sentence: 'チョコレート', romaji: 'chokore-to', meaning: 'Cokelat' },
  { sentence: 'ジュース', romaji: 'ju-su', meaning: 'Jus' },
  { sentence: 'ケーキ', romaji: 'ke-ki', meaning: 'Kue / Cake' },
  { sentence: 'パン', romaji: 'pan', meaning: 'Roti' },
  { sentence: 'バス', romaji: 'basu', meaning: 'Bus' },
  { sentence: 'トイレ', romaji: 'toire', meaning: 'Toilet' },
  { sentence: 'ニュース', romaji: 'nyu-su', meaning: 'Berita' },
  { sentence: 'スポーツ', romaji: 'supo-tsu', meaning: 'Olahraga' },
  { sentence: 'アニメ', romaji: 'anime', meaning: 'Anime' },
  { sentence: 'ゲーム', romaji: 'ge-mu', meaning: 'Game' },
];

export async function generateSentenceQuiz(
  type: KanaType,
  count: number = 5
): Promise<SentenceQuizResponse> {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY tidak ditemukan.');
    }

    const ai = new GoogleGenAI({ apiKey });

    const scriptInstruction =
      type === 'hiragana'
        ? 'Hiragana penuh (tanpa Kanji)'
        : type === 'katakana'
          ? 'Katakana penuh'
          : 'campuran Hiragana dan Katakana (tanpa Kanji, setiap kalimat boleh full Hiragana atau full Katakana atau kombinasi keduanya)';

    const prompt = `Buatkan ${count} kalimat atau kata serapan bahasa Jepang sederhana yang unik dan berbeda satu sama lain untuk latihan membaca.\n
Ketentuan:\n
1. Gunakan ${scriptInstruction}.\n
2. Sertakan cara baca dalam Romaji (gunakan huruf kecil semua, pisahkan tiap kata dengan spasi/strip bila perlu, tanpa tanda baca khusus).\n
3. Sertakan terjemahan bahasa Indonesia singkat.\n
4. Jangan gunakan kalimat yang umum/template, supaya bervariasi tiap request.`;

    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL as string,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              sentence: { type: Type.STRING },
              romaji: { type: Type.STRING },
              meaning: { type: Type.STRING },
            },
            required: ['sentence', 'romaji', 'meaning'],
          },
        },
      },
    });

    if (!response.text) {
      throw new Error('Respons kosong dari AI');
    }

    const questions = JSON.parse(response.text) as SentenceQuestion[];
    return { questions, isFallback: false };
  } catch (error) {
    console.error('Gemini API Error:', error);

    const pool =
      type === 'hiragana'
        ? DEFAULT_HIRAGANA
        : type === 'katakana'
          ? DEFAULT_KATAKANA
          : [...DEFAULT_HIRAGANA, ...DEFAULT_KATAKANA].sort(() => Math.random() - 0.5);
    const fallbackQuestions = pool.slice(0, Math.min(count, pool.length));

    return {
      questions: fallbackQuestions,
      isFallback: true,
    };
  }
}