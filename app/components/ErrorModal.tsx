'use client';

import { X, AlertTriangle } from 'lucide-react';

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  sentenceCount: number;
}

export default function ErrorModal({ isOpen, onClose, sentenceCount }: ErrorModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 space-y-5 shadow-2xl relative text-center">
        <button
          onClick={onClose}
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
          onClick={onClose}
          className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition text-sm shadow-md"
        >
          Saya Mengerti
        </button>
      </div>
    </div>
  );
}