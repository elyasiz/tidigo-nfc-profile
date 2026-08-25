import Link from 'next/link';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[#f7f8fc] text-[#183153]">
      <div className="mx-auto flex min-h-screen max-w-[1500px]">
        <aside className="hidden w-64 shrink-0 flex-col bg-[#123f8c] px-6 py-7 text-white lg:flex">
          <Link href="/dashboard" className="mb-11 rounded-2xl bg-white p-3 shadow-sm">
            <img src="/tidigo-logo.png" alt="TIDIGO — From Ideas to 3D Objects" className="h-auto w-full" />
          </Link>
          <p className="mb-3 text-xs font-bold uppercase tracking-[.16em] text-blue-200">Workshop NFC</p>
          <nav className="space-y-2 text-sm font-bold">
            <Link className="flex items-center gap-3 rounded-2xl bg-white/15 px-4 py-3" href="/dashboard"><span>▦</span> Semua Profil</Link>
            <Link className="flex items-center gap-3 rounded-2xl px-4 py-3 text-blue-100 hover:bg-white/10" href="/guide"><span>⌁</span> Panduan NFC</Link>
          </nav>
          <div className="mt-auto rounded-3xl bg-white/10 p-5">
            <div className="mb-3 h-12 w-12 overflow-hidden rounded-full border-2 border-white/80 bg-white shadow-sm">
              <img src="/tigo.jpeg" alt="TIGO" className="h-full w-full scale-[1.7] object-cover" />
            </div>
            <p className="truncate font-extrabold">Coach TIDIGO</p>
          </div>
        </aside>
        <section className="min-w-0 flex-1 px-5 py-5 sm:px-9 sm:py-8 xl:px-12">
          <header className="mb-8 flex items-center justify-between lg:hidden">
            <Link href="/dashboard" className="rounded-xl bg-white p-2 shadow-sm">
              <img src="/tidigo-logo.png" alt="TIDIGO — From Ideas to 3D Objects" className="h-auto w-32" />
            </Link>
            <Link href="/guide" className="rounded-xl bg-white px-3 py-2 text-sm font-extrabold shadow-sm">Panduan NFC</Link>
          </header>
          {children}
        </section>
      </div>
    </main>
  );
}

