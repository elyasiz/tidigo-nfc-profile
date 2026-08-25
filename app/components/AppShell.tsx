import Link from 'next/link';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[#f7f8fc] text-[#183153]">
      <div className="mx-auto flex min-h-screen max-w-[1500px]">
        <aside className="hidden w-64 shrink-0 flex-col bg-[#123f8c] px-6 py-7 text-white lg:flex">
          <Link href="/dashboard" className="mb-11 flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#ffd84d] text-xl font-black text-[#123f8c]">T</span>
            <span className="text-2xl font-black tracking-tight">tidigo</span>
          </Link>
          <p className="mb-3 text-xs font-bold uppercase tracking-[.16em] text-blue-200">Workshop NFC</p>
          <nav className="space-y-2 text-sm font-bold">
            <Link className="flex items-center gap-3 rounded-2xl bg-white/15 px-4 py-3" href="/dashboard"><span>▦</span> Semua Profil</Link>
            <Link className="flex items-center gap-3 rounded-2xl px-4 py-3 text-blue-100 hover:bg-white/10" href="/guide"><span>⌁</span> Panduan NFC</Link>
          </nav>
          <div className="mt-auto rounded-3xl bg-white/10 p-5">
            <div className="mb-3 grid h-9 w-9 place-items-center rounded-full bg-[#64dba4] font-black text-[#123f8c]">C</div>
            <p className="truncate font-extrabold">Coach TIDIGO</p>
            <p className="mt-1 text-xs font-bold text-blue-200">Akses publik tanpa ChatGPT</p>
          </div>
        </aside>
        <section className="min-w-0 flex-1 px-5 py-5 sm:px-9 sm:py-8 xl:px-12">
          <header className="mb-8 flex items-center justify-between lg:hidden">
            <Link href="/dashboard" className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#ffd84d] text-xl font-black text-[#123f8c]">T</span>
              <span className="text-xl font-black">tidigo</span>
            </Link>
            <Link href="/guide" className="rounded-xl bg-white px-3 py-2 text-sm font-extrabold shadow-sm">Panduan NFC</Link>
          </header>
          {children}
        </section>
      </div>
    </main>
  );
}

