import { listProfiles, seedExampleProfiles } from '../../db/profiles';
import { AppShell } from '../components/AppShell';
import { ProfileTools } from '../components/ProfileTools';
import { icons, themes } from '../profile-config';

export const dynamic = 'force-dynamic';
const COACH_ID = 'tidigo-public-workshop';

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ created?: string; updated?: string }> }) {
  await seedExampleProfiles(COACH_ID);
  const profiles = await listProfiles(COACH_ID);
  const query = await searchParams;
  const activeCount = profiles.filter((profile) => profile.isActive).length;
  return (
    <AppShell>
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-sm font-bold text-[#6f819b]">Selamat datang kembali</p><h1 className="mt-1 text-3xl font-black tracking-tight">Halo, Coach! <span aria-hidden="true">👋</span></h1></div>
        <a href="/profiles/new" className="button-red text-center">＋ Buat Profil Baru</a>
      </header>
      {(query.created || query.updated) && <div className="mb-5 rounded-2xl border border-[#bfe8d2] bg-[#e8f9f0] px-5 py-4 text-sm font-extrabold text-[#14714b]">✓ {query.created ? 'Profil berhasil dibuat dan link NFC sudah siap.' : 'Perubahan profil berhasil disimpan.'}</div>}
      <section className="relative mb-9 overflow-hidden rounded-[2rem] bg-[#1553a6] px-7 py-8 text-white shadow-[0_20px_55px_rgba(18,63,140,.16)] sm:px-10">
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#ffd84d]" /><div className="absolute bottom-[-65px] right-24 h-40 w-40 rounded-full border-[28px] border-[#65dba5]/80" />
        <div className="relative max-w-2xl"><span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-extrabold uppercase tracking-wider">Sesi 4 · NFC Tag</span><h2 className="mt-4 text-3xl font-black leading-tight sm:text-4xl">Satu sentuhan, satu cerita kreatif.</h2><p className="mt-3 max-w-xl text-sm font-medium leading-6 text-blue-100 sm:text-base">Buat profil aman bersama murid, hubungkan ke NFC tag, lalu lihat karya mereka hidup di layar.</p></div>
      </section>
      <section>
        <div className="mb-5 flex items-end justify-between"><div><p className="text-sm font-bold text-[#6f819b]">{activeCount} profil aktif · {profiles.length} total</p><h2 className="mt-1 text-2xl font-black">Profil murid</h2></div><div className="hidden rounded-2xl border border-[#dce3ef] bg-white px-4 py-2.5 text-sm font-bold text-[#73829a] sm:block">Data private by link 🔒</div></div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {profiles.map((profile) => {
            const theme = themes[profile.theme as keyof typeof themes] ?? themes.sky;
            const icon = icons[profile.icon as keyof typeof icons] ?? icons.rocket;
            return <article key={profile.id} className="rounded-[1.75rem] border border-[#e2e7f0] bg-white p-5 shadow-[0_12px_35px_rgba(38,59,92,.07)]">
              <div className="flex items-start justify-between"><div className="grid h-16 w-16 place-items-center rounded-2xl text-3xl" style={{ background: theme.soft }}>{icon}</div><span className={`rounded-full px-3 py-1 text-xs font-extrabold ${profile.isActive ? 'bg-[#e3f8ec] text-[#168153]' : 'bg-[#f1f2f4] text-[#778390]'}`}>● {profile.isActive ? 'Aktif' : 'Nonaktif'}</span></div>
              <h3 className="mt-5 text-xl font-black">{profile.displayName}</h3><p className="mt-1 min-h-5 text-sm font-medium text-[#73829a]">{profile.hobbies.slice(0, 2).join(' & ') || profile.dreamJob}</p>
              <div className="my-4 h-px bg-[#edf0f5]" /><p className="truncate text-xs font-bold text-[#8997aa]">/p/{profile.publicId}</p>
              <ProfileTools id={profile.id} publicId={profile.publicId} active={profile.isActive} />
            </article>;
          })}
        </div>
      </section>
    </AppShell>
  );
}

