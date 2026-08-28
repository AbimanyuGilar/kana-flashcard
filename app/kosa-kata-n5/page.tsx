'use client';

import { useMemo, useState } from 'react';
import { RefreshCw, BookOpenText, Languages, Sparkles } from 'lucide-react';

import Header from '../components/Header';
import { shuffleArray } from '../utils';
import kosaKataN5Data from '../kosa_kata_n5.json';

type KosaKataN5Item = {
  kanji: string | null;
  hiragana: string;
  romaji: string;
  arti: string;
};

const vocabulary = kosaKataN5Data as KosaKataN5Item[];

export default function KosaKataN5Page() {
  const [shuffledVocabulary, setShuffledVocabulary] = useState<KosaKataN5Item[]>(
    () => shuffleArray(vocabulary)
  );

  const stats = useMemo(() => {
    const total = vocabulary.length;
    const withKanji = vocabulary.filter((item) => Boolean(item.kanji)).length;
    const withoutKanji = total - withKanji;
    const uniqueRomaji = new Set(vocabulary.map((item) => item.romaji)).size;

    return { total, withKanji, withoutKanji, uniqueRomaji };
  }, []);

  const handleReshuffle = () => {
    setShuffledVocabulary(shuffleArray(vocabulary));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col justify-between p-4 md:p-8 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.16),_transparent_34%),radial-gradient(circle_at_top_right,_rgba(56,189,248,0.12),_transparent_28%),linear-gradient(to_bottom,_rgba(15,23,42,0.9),_rgba(2,6,23,1))]" />

      <div className="relative z-10">
        <Header showBack backHref="/" />
      </div>

      <main className="relative z-10 w-full max-w-6xl mx-auto my-auto space-y-6">
        <section className="rounded-3xl border border-slate-800/80 bg-slate-900/70 backdrop-blur-xl shadow-2xl shadow-black/20 p-6 md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-semibold tracking-[0.24em] text-amber-300 uppercase">
                <Sparkles size={13} />
                JLPT N5 Vocabulary
              </div>
              <div className="space-y-3">
                <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white">
                  Daftar kosakata JLPT N5
                </h1>
                <p className="text-sm md:text-base text-slate-300 leading-relaxed">
                  Kosakata diambil dari data lokal `app/kosa_kata_n5.json` dan urutannya diacak setiap kali halaman dimuat.
                  Tekan tombol acak ulang kalau ingin melihat urutan baru tanpa refresh halaman.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleReshuffle}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm font-semibold text-amber-200 transition hover:bg-amber-500/15 hover:border-amber-400/50"
            >
              <RefreshCw size={16} />
              Acak lagi
            </button>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                <BookOpenText size={14} />
                Total
              </div>
              <div className="mt-2 text-2xl font-black text-white">{stats.total}</div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                <Languages size={14} />
                Dengan Kanji
              </div>
              <div className="mt-2 text-2xl font-black text-amber-300">{stats.withKanji}</div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                <Languages size={14} />
                Tanpa Kanji
              </div>
              <div className="mt-2 text-2xl font-black text-cyan-300">{stats.withoutKanji}</div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                <Sparkles size={14} />
                Romaji unik
              </div>
              <div className="mt-2 text-2xl font-black text-white">{stats.uniqueRomaji}</div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl shadow-xl shadow-black/15 p-4 md:p-6">
          <div className="mb-4 flex items-center justify-between gap-3 px-1">
            <h2 className="text-sm md:text-base font-bold tracking-wide text-slate-200">
              Urutan acak kosakata
            </h2>
            <span className="text-xs text-slate-500">
              {shuffledVocabulary.length} item
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {shuffledVocabulary.map((item, index) => {
              const hasKanji = Boolean(item.kanji);

              return (
                <article
                  key={`${item.romaji}-${item.hiragana}-${index}`}
                  className="group rounded-2xl border border-slate-800 bg-slate-950/70 p-4 transition hover:-translate-y-0.5 hover:border-amber-500/30 hover:bg-slate-950"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                        #{String(index + 1).padStart(2, '0')}
                      </div>
                      <div className="mt-2 text-3xl font-black leading-none text-white">
                        {hasKanji ? item.kanji : '—'}
                      </div>
                    </div>
                    <div
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide ${
                        hasKanji
                          ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                          : 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20'
                      }`}
                    >
                      {hasKanji ? 'Kanji' : 'Kata dasar'}
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2">
                      <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Hiragana</div>
                      <div className="mt-1 text-base font-semibold text-slate-100">{item.hiragana}</div>
                    </div>
                    <div className="rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2">
                      <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Romaji</div>
                      <div className="mt-1 text-base font-semibold text-slate-100">{item.romaji}</div>
                    </div>
                    <div className="rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2">
                      <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Arti</div>
                      <div className="mt-1 text-sm leading-relaxed text-slate-300">{item.arti}</div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </main>

      <footer className="relative z-10 text-center text-xs text-slate-600 py-2">
        &copy;Giraichi • Gira Nihonggo
      </footer>
    </div>
  );
}
