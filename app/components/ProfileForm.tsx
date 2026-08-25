'use client';

import { useState } from 'react';
import type { Profile } from '../../db/profiles';
import { icons, themes } from '../profile-config';
import { createProfileAction, updateProfileAction } from '../actions';

type Draft = Pick<Profile, 'displayName' | 'age' | 'hobbies' | 'dreamJob' | 'learningInterest' | 'funFact' | 'icon' | 'theme' | 'projectMessage'>;

const blank: Draft = {
  displayName: '', age: null, hobbies: ['', '', ''], dreamJob: '', learningInterest: '',
  funFact: '', icon: 'rocket', theme: 'sky', projectMessage: 'NFC tag ini dibuat di Workshop TIDIGO.',
};

export function ProfileForm({ profile }: { profile?: Profile }) {
  const [draft, setDraft] = useState<Draft>(profile ? { ...profile, hobbies: [...profile.hobbies, '', ''].slice(0, 3) } : blank);
  const theme = themes[draft.theme as keyof typeof themes] ?? themes.sky;
  const icon = icons[draft.icon as keyof typeof icons] ?? icons.rocket;
  const action = profile ? updateProfileAction : createProfileAction;
  const setField = (field: keyof Draft, value: string | number | null | string[]) => setDraft((current) => ({ ...current, [field]: value }));

  return (
    <form action={action} className="grid gap-7 xl:grid-cols-[minmax(0,1fr)_390px]">
      {profile && <input type="hidden" name="id" value={profile.id} />}
      <section className="rounded-[2rem] border border-[#e1e7f0] bg-white p-5 shadow-[0_16px_45px_rgba(38,59,92,.07)] sm:p-8">
        <div className="mb-8">
          <span className="rounded-full bg-[#eaf2ff] px-3 py-1 text-xs font-extrabold text-[#1553a6]">LANGKAH 1 DARI 1</span>
          <h1 className="mt-4 text-3xl font-black">{profile ? 'Edit profil murid' : 'Buat profil baru'}</h1>
          <p className="mt-2 text-sm font-medium leading-6 text-[#70819a]">Isi bersama murid. Gunakan nama panggilan dan hindari data pribadi.</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="field sm:col-span-2">Nama panggilan <span>*</span>
            <input required minLength={2} maxLength={40} name="displayName" value={draft.displayName} onChange={(e) => setField('displayName', e.target.value)} placeholder="Contoh: Ardi" />
            <small>Nama depan atau panggilan saja, bukan nama lengkap.</small>
          </label>
          <label className="field">Usia (opsional)
            <select name="age" value={draft.age ?? ''} onChange={(e) => setField('age', e.target.value ? Number(e.target.value) : null)}>
              <option value="">Tidak ditampilkan</option><option value="9">9 tahun</option><option value="10">10 tahun</option><option value="11">11 tahun</option>
            </select>
          </label>
          <label className="field">Cita-cita
            <input maxLength={100} name="dreamJob" value={draft.dreamJob} onChange={(e) => setField('dreamJob', e.target.value)} placeholder="Contoh: Insinyur robot" />
          </label>
          <fieldset className="sm:col-span-2">
            <legend className="mb-2 text-sm font-extrabold">Hobi <span className="text-[#6f819b]">(maks. 3)</span></legend>
            <div className="grid gap-3 sm:grid-cols-3">
              {draft.hobbies.map((hobby, index) => <input key={index} className="input" maxLength={40} name="hobbies" value={hobby} onChange={(e) => { const next = [...draft.hobbies]; next[index] = e.target.value; setField('hobbies', next); }} placeholder={`Hobi ${index + 1}`} />)}
            </div>
          </fieldset>
          <label className="field sm:col-span-2">Aku suka belajar tentang
            <input maxLength={120} name="learningInterest" value={draft.learningInterest} onChange={(e) => setField('learningInterest', e.target.value)} placeholder="Teknologi, hewan, luar angkasa..." />
          </label>
          <label className="field sm:col-span-2">Fakta seru tentang aku
            <textarea maxLength={160} name="funFact" value={draft.funFact} onChange={(e) => setField('funFact', e.target.value)} placeholder="Ceritakan satu hal seru yang aman dibagikan." />
          </label>
        </div>

        <fieldset className="mt-7">
          <legend className="mb-3 text-sm font-extrabold">Pilih ikon favorit</legend>
          <div className="flex flex-wrap gap-3">
            {Object.entries(icons).map(([key, emoji]) => <label key={key} className={`icon-choice ${draft.icon === key ? 'selected' : ''}`}><input className="sr-only" type="radio" name="icon" value={key} checked={draft.icon === key} onChange={() => setField('icon', key)} /><span>{emoji}</span></label>)}
          </div>
        </fieldset>

        <fieldset className="mt-7">
          <legend className="mb-3 text-sm font-extrabold">Pilih tema warna</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {Object.entries(themes).map(([key, value]) => <label key={key} className={`theme-choice ${draft.theme === key ? 'selected' : ''}`}><input className="sr-only" type="radio" name="theme" value={key} checked={draft.theme === key} onChange={() => setField('theme', key)} /><span className={`h-8 w-8 rounded-full bg-gradient-to-br ${value.gradient}`} /><span className="font-extrabold">{value.label}</span><b>✓</b></label>)}
          </div>
        </fieldset>

        <label className="field mt-7">Pesan karya
          <input maxLength={160} name="projectMessage" value={draft.projectMessage} onChange={(e) => setField('projectMessage', e.target.value)} />
        </label>

        <label className="mt-7 flex cursor-pointer items-start gap-3 rounded-2xl border border-[#cfe3ff] bg-[#f1f7ff] p-4 text-sm font-bold leading-6 text-[#315276]">
          <input required name="consentChecked" type="checkbox" defaultChecked={profile?.consentChecked} className="mt-1 h-5 w-5 accent-[#1553a6]" />
          <span>Saya sudah memeriksa: tidak ada nama lengkap, alamat, sekolah, nomor telepon, atau data sensitif lain.</span>
        </label>
        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <a href="/dashboard" className="button-secondary text-center">Batal</a>
          <button className="button-primary" type="submit">{profile ? 'Simpan Perubahan' : 'Simpan & Buat Link'} →</button>
        </div>
      </section>

      <aside className="xl:sticky xl:top-8 xl:h-fit">
        <p className="mb-3 text-xs font-black uppercase tracking-[.16em] text-[#7b8ba2]">Preview langsung</p>
        <div className={`relative overflow-hidden rounded-[2.2rem] bg-gradient-to-br ${theme.gradient} p-6 text-white shadow-[0_24px_70px_rgba(22,68,138,.25)]`}>
          <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full" style={{ background: theme.accent }} />
          <div className="relative">
            <div className="flex items-center justify-between"><b className="text-lg">tidigo</b><span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold">NFC Profile</span></div>
            <div className="mt-8 grid h-24 w-24 place-items-center rounded-[1.7rem] bg-white/95 text-5xl shadow-lg">{icon}</div>
            <h2 className="mt-5 text-3xl font-black">Hai, aku {draft.displayName || 'namamu'}!</h2>
            <p className="mt-1 text-sm font-bold text-white/75">{draft.age ? `${draft.age} tahun · ` : ''}{draft.dreamJob || 'Cita-citaku akan tampil di sini'}</p>
            <div className="mt-6 rounded-2xl bg-white/15 p-4 backdrop-blur"><p className="text-xs font-bold uppercase tracking-wider text-white/70">Aku suka belajar</p><p className="mt-1 font-extrabold">{draft.learningInterest || 'Pilih topik favoritmu'}</p></div>
            <div className="mt-4 flex flex-wrap gap-2">{draft.hobbies.filter(Boolean).map((item) => <span key={item} className="rounded-full bg-white px-3 py-1 text-xs font-extrabold text-[#24466d]">{item}</span>)}</div>
          </div>
        </div>
        <div className="mt-4 rounded-2xl bg-[#fff8d8] p-4 text-sm font-bold leading-6 text-[#745a00]">🔒 Profil hanya bisa dibuka oleh orang yang memiliki link atau NFC tag.</div>
      </aside>
    </form>
  );
}

