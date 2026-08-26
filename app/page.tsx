'use client';

import { useRouter } from 'next/navigation';
import Header from './components/Header';
import ModeSelect from './components/ModeSelect';

export default function HomePage() {
  const router = useRouter();

  const handleSelectMode = (mode: 'single' | 'sentence') => {
    router.push(`/${mode}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col justify-between p-4 md:p-8 relative">
      <Header />
      <ModeSelect onSelectMode={handleSelectMode} />
      <footer className="text-center text-xs text-slate-600 py-2">
        &copy;Giraichi • GiraNihonggo
      </footer>
    </div>
  );
}