import { AppShell } from '../components/AppShell';

export const dynamic = 'force-dynamic';
const steps = [
  ['1', 'Salin link profil', 'Buka dashboard, pilih profil yang benar, lalu tekan “Salin link”.'],
  ['2', 'Buka aplikasi NFC', 'Pilih jenis data URL atau website di aplikasi penulis NFC pada ponsel.'],
  ['3', 'Tulis ke NFC tag', 'Tempelkan bagian NFC ponsel ke tag sampai proses penulisan selesai.'],
  ['4', 'Uji hasilnya', 'Tutup aplikasi, tempel tag kembali, lalu pastikan profil yang benar terbuka.'],
];
export default function GuidePage() {
  return <AppShell>
    <div className="mx-auto max-w-4xl"><span className="rounded-full bg-[#eaf2ff] px-3 py-1 text-xs font-black text-[#1553a6]">PANDUAN COACH</span><h1 className="mt-4 text-4xl font-black">Cara menulis link ke NFC tag</h1><p className="mt-3 max-w-2xl font-medium leading-7 text-[#6f819b]">Lakukan bersama murid dan cek ulang profil sebelum menulis atau mengunci tag.</p>
      <div className="mt-9 grid gap-4 sm:grid-cols-2">{steps.map(([number, title, text]) => <article key={number} className="rounded-[1.7rem] border border-[#e1e7f0] bg-white p-6 shadow-[0_12px_35px_rgba(38,59,92,.06)]"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#ffd84d] text-lg font-black text-[#123f8c]">{number}</span><h2 className="mt-5 text-xl font-black">{title}</h2><p className="mt-2 text-sm font-medium leading-6 text-[#71829a]">{text}</p></article>)}</div>
      <div className="mt-6 rounded-[1.7rem] bg-[#1553a6] p-6 text-white"><h2 className="text-xl font-black">Sebelum tag dikunci</h2><p className="mt-2 text-sm font-medium leading-6 text-blue-100">Uji dengan dua ponsel jika tersedia. Jangan kunci NFC tag sebelum link dan profil dipastikan benar, karena tag yang sudah dikunci biasanya tidak dapat ditulis ulang.</p></div>
    </div>
  </AppShell>;
}

