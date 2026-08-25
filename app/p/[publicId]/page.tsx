import type { Metadata } from 'next';
import { getPublicProfile } from '../../../db/profiles';
import { icons, themes } from '../../profile-config';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ publicId: string }> }): Promise<Metadata> {
  const { publicId } = await params; const profile = await getPublicProfile(publicId);
  const title = profile ? `${profile.displayName} · TIDIGO NFC Profile` : 'Profil tidak tersedia · TIDIGO';
  const description = profile ? `Kenalan dengan ${profile.displayName} melalui karya NFC Workshop TIDIGO.` : 'Profil ini sedang tidak tersedia.';
  return { title, description, robots: { index: false, follow: false }, openGraph: { title, description, images: [] }, twitter: { card: 'summary', title, description, images: [] } };
}

export default async function PublicProfilePage({ params }: { params: Promise<{ publicId: string }> }) {
  const { publicId } = await params; const profile = await getPublicProfile(publicId);
  if (!profile) return <main className="grid min-h-screen place-items-center bg-[#f5f7fb] px-5"><section className="max-w-md rounded-[2rem] bg-white p-8 text-center shadow-xl"><div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-[#eef2f7] text-4xl">🔒</div><h1 className="mt-5 text-2xl font-black text-[#183153]">Profil tidak tersedia</h1><p className="mt-3 font-medium leading-6 text-[#708098]">Profil ini sedang tidak tersedia. Silakan hubungi coach TIDIGO.</p><div className="mt-6 font-black text-[#1553a6]">tidigo</div></section></main>;
  const theme = themes[profile.theme as keyof typeof themes] ?? themes.sky;
  const icon = icons[profile.icon as keyof typeof icons] ?? icons.rocket;
  return <main className={`min-h-screen bg-gradient-to-br ${theme.gradient} px-4 py-5 text-[#183153] sm:py-10`}>
    <article className="relative mx-auto max-w-lg overflow-hidden rounded-[2.4rem] bg-white shadow-[0_30px_100px_rgba(7,31,75,.35)]">
      <header className={`relative overflow-hidden bg-gradient-to-br ${theme.gradient} px-6 pb-24 pt-6 text-white`}><div className="absolute -right-16 -top-20 h-56 w-56 rounded-full opacity-90" style={{ background: theme.accent }} /><div className="relative flex items-center justify-between"><span className="text-xl font-black">tidigo</span><span className="rounded-full bg-white/20 px-3 py-1 text-xs font-extrabold">NFC Profile</span></div></header>
      <section className="relative px-6 pb-7"><div className="-mt-16 grid h-32 w-32 place-items-center rounded-[2rem] border-[6px] border-white bg-white text-6xl shadow-lg" style={{ background: theme.soft }}>{icon}</div><span className="mt-5 inline-flex rounded-full px-3 py-1 text-xs font-black" style={{ background: theme.soft }}>HALO! 👋</span><h1 className="mt-3 text-4xl font-black tracking-tight">Aku {profile.displayName}</h1>{profile.age && <p className="mt-1 font-bold text-[#72829a]">{profile.age} tahun</p>}
        <div className="mt-6 grid gap-3 sm:grid-cols-2"><InfoCard emoji="🎯" label="Cita-citaku" value={profile.dreamJob} /><InfoCard emoji="💡" label="Aku suka belajar" value={profile.learningInterest} /></div>
        {profile.hobbies.length > 0 && <div className="mt-5"><p className="text-xs font-black uppercase tracking-wider text-[#7a8ba2]">Hobiku</p><div className="mt-2 flex flex-wrap gap-2">{profile.hobbies.map((hobby) => <span key={hobby} className="rounded-full bg-[#edf3fb] px-4 py-2 text-sm font-extrabold">{hobby}</span>)}</div></div>}
        {profile.funFact && <div className="mt-5 rounded-2xl border border-[#f5df89] bg-[#fff8d8] p-5"><p className="text-xs font-black uppercase tracking-wider text-[#947000]">✨ Fakta seru</p><p className="mt-2 font-bold leading-6 text-[#654f06]">{profile.funFact}</p></div>}
        <footer className="mt-7 border-t border-[#edf0f5] pt-5 text-center"><p className="text-sm font-extrabold text-[#526b89]">{profile.projectMessage}</p><p className="mt-2 text-xs font-bold text-[#94a0b1]">Dibuat dengan aman · Private by link 🔒</p></footer>
      </section>
    </article>
  </main>;
}

function InfoCard({ emoji, label, value }: { emoji: string; label: string; value: string }) {
  return <div className="rounded-2xl bg-[#f5f7fb] p-4"><span className="text-2xl">{emoji}</span><p className="mt-3 text-xs font-black uppercase tracking-wider text-[#7b899e]">{label}</p><p className="mt-1 font-extrabold leading-5">{value || 'Belum diisi'}</p></div>;
}

