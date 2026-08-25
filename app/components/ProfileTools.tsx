'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { deleteProfileAction, resetLinkAction, statusProfileAction } from '../actions';

export function ProfileTools({ id, publicId, active }: { id: string; publicId: string; active: boolean }) {
  const [url, setUrl] = useState(`/p/${publicId}`);
  const [qr, setQr] = useState('');
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => { setUrl(`${window.location.origin}/p/${publicId}`); }, [publicId]);
  useEffect(() => { if (open) QRCode.toDataURL(url, { width: 340, margin: 2, color: { dark: '#123f8c', light: '#ffffff' } }).then(setQr); }, [open, url]);
  const copy = async () => { await navigator.clipboard.writeText(url); setCopied(true); window.setTimeout(() => setCopied(false), 1800); };

  return (
    <>
      <div className="mt-5 grid grid-cols-2 gap-2">
        <a className="card-action" href={`/p/${publicId}`} target="_blank" rel="noreferrer">↗ Preview</a>
        <button className="card-action" type="button" onClick={copy}>{copied ? '✓ Tersalin' : '⧉ Salin link'}</button>
        <button className="card-action" type="button" onClick={() => setOpen(true)}>▦ QR code</button>
        <a className="card-action" href={`/profiles/${id}/edit`}>✎ Edit</a>
      </div>
      <details className="mt-3 rounded-xl border border-[#e5eaf2] px-3 py-2 text-xs font-bold text-[#718099]">
        <summary className="cursor-pointer">Tindakan lainnya</summary>
        <div className="mt-3 grid gap-2">
          <form action={statusProfileAction}><input type="hidden" name="id" value={id} /><input type="hidden" name="active" value={String(!active)} /><button className="text-left hover:text-[#1553a6]" type="submit">{active ? 'Nonaktifkan profil' : 'Aktifkan profil'}</button></form>
          <form action={resetLinkAction} onSubmit={(e) => { if (!confirm('Buat link baru? Link NFC lama tidak akan berfungsi.')) e.preventDefault(); }}><input type="hidden" name="id" value={id} /><button className="text-left hover:text-[#1553a6]" type="submit">Buat ulang link publik</button></form>
          <form action={deleteProfileAction} onSubmit={(e) => { if (!confirm('Hapus profil ini secara permanen?')) e.preventDefault(); }}><input type="hidden" name="id" value={id} /><button className="text-left text-[#d64242]" type="submit">Hapus profil</button></form>
        </div>
      </details>
      {open && <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="QR code profil" onClick={() => setOpen(false)}>
        <div className="modal-card" onClick={(e) => e.stopPropagation()}>
          <button className="absolute right-4 top-4 rounded-full bg-[#edf2f8] px-3 py-2 font-black" onClick={() => setOpen(false)} aria-label="Tutup">×</button>
          <p className="text-xs font-black uppercase tracking-[.15em] text-[#74839a]">Scan untuk menguji</p>
          <h2 className="mt-2 text-2xl font-black">QR Code Profil</h2>
          <div className="mx-auto mt-5 grid min-h-64 w-64 place-items-center rounded-3xl border border-[#e5eaf1] bg-white p-3">{qr ? <img src={qr} alt="QR code menuju profil publik" className="w-full" /> : <span>Menyiapkan QR...</span>}</div>
          <p className="mt-4 break-all rounded-xl bg-[#f3f6fa] p-3 text-xs font-bold text-[#5d718c]">{url}</p>
          <button type="button" className="button-primary mt-4 w-full" onClick={copy}>{copied ? 'Link tersalin ✓' : 'Salin Link'}</button>
        </div>
      </div>}
    </>
  );
}

