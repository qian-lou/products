import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-6xl font-extrabold text-slate-900 dark:text-white mb-4">
          404
        </h1>
        <p className="text-xl text-slate-600 dark:text-[#A0A0A0] mb-8">
          Page not found
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 dark:bg-blue-400/10 dark:border dark:border-blue-400/20 text-white dark:text-blue-400 font-semibold hover:bg-blue-700 dark:hover:bg-blue-400/20 transition-colors"
        >
          <ArrowLeft size={18} />
          <Home size={18} />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
