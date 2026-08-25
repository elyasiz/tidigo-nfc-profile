import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[#123f8c] px-5 py-12 text-[#183153]">
      <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[#ffd84d]" />
      <div className="absolute -bottom-28 -right-16 h-96 w-96 rounded-full bg-[#65dba5]" />
      <div className="absolute right-[12%] top-[13%] text-6xl opacity-80">🚀</div>
      <section className="relative w-full max-w-md rounded-[2.4rem] bg-white p-7 shadow-[0_35px_100px_rgba(2,20,59,.35)] sm:p-10">
        <div className="mb-8"><img src="/tidigo-logo.png" alt="TIDIGO — From Ideas to 3D Objects" className="h-auto w-full max-w-[310px]" /><p className="mt-2 text-xs font-bold uppercase tracking-widest text-[#74849b]">NFC Profile</p></div>
        <span className="inline-flex rounded-full bg-[#e8f2ff] px-3 py-1 text-xs font-black text-[#1553a6]">WORKSHOP NFC</span>
        <h1 className="mt-4 text-4xl font-black leading-tight">Satu sentuhan,<br />satu cerita kreatif.</h1>
        <p className="mt-4 text-sm font-medium leading-6 text-[#6d7f98]">Kelola profil NFC murid dengan data yang aman, sederhana, dan penuh warna.</p>
        <Link className="button-primary mt-8 block w-full text-center" href="/dashboard">Buka Dashboard Coach →</Link>
        <p className="mt-4 text-center text-xs font-bold text-[#74849b]">Tidak memerlukan akun atau login ChatGPT.</p>
        <div className="mt-6 flex items-start gap-3 rounded-2xl bg-[#f2f7ff] p-4 text-xs font-bold leading-5 text-[#4b678b]"><span>🔒</span><p>Profil tidak mencantumkan alamat, sekolah, kontak, atau data sensitif anak.</p></div>
        <Link href="/p/p7K4mQ2xN8" className="mt-5 block text-center text-xs font-extrabold text-[#1553a6]">Lihat contoh profil publik</Link>
      </section>
    </main>
  );
}

