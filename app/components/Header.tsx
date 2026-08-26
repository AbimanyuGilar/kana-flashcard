'use client';

import { BookOpen, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface HeaderProps {
  showBack?: boolean;
  backHref?: string;
}

export default function Header({ showBack = false, backHref = '/' }: HeaderProps) {
  return (
    <header className="max-w-4xl mx-auto w-full flex items-center justify-between pb-4">
      <div className="flex items-center gap-2">
        <BookOpen className="text-cyan-400 size-6" />
        <span className="text-xl font-black tracking-tight">Gira<span className="text-cyan-400">Nihonggo</span></span>
      </div>
      {showBack && (
        <Link
          href={backHref}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition"
        >
          <ArrowLeft size={14} /> Kembali
        </Link>
      )}
    </header>
  );
}