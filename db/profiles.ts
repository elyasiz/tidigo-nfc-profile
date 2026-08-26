import { get, put } from '@vercel/blob';

export type Profile = {
  id: string; publicId: string; coachId: string; displayName: string; age: number | null;
  hobbies: string[]; dreamJob: string; learningInterest: string; funFact: string;
  icon: string; theme: string; projectMessage: string; isActive: boolean;
  consentChecked: boolean; createdAt: string; updatedAt: string;
};

export type ProfileInput = Omit<Profile, 'id' | 'publicId' | 'coachId' | 'isActive' | 'createdAt' | 'updatedAt'>;

type ProfileStore = Map<string, Profile>;
const STORE_PATH = 'tidigo/profiles.json';
const COACH_ID = 'tidigo-public-workshop';
const globalStore = globalThis as typeof globalThis & { tidigoProfiles?: ProfileStore };

const allowedIcons = ['rocket', 'robot', 'star', 'flower', 'dino'];
const allowedThemes = ['sky', 'sunny', 'mint', 'grape'];

function exampleProfiles(coachId = COACH_ID): Profile[] {
  const createdAt = '2026-08-20T08:00:00.000Z';
  return [
    { id: 'profile-ardi', publicId: 'p7K4mQ2xN8', coachId, displayName: 'Ardi', age: 10, hobbies: ['Menggambar', 'Sepak bola', 'Membuat robot'], dreamJob: 'Insinyur robot', learningInterest: 'Teknologi dan luar angkasa', funFact: 'Aku bisa membuat pesawat kertas yang terbang jauh.', icon: 'rocket', theme: 'sky', projectMessage: 'NFC tag ini dibuat di Workshop TIDIGO.', consentChecked: true, isActive: true, createdAt, updatedAt: createdAt },
    { id: 'profile-naya', publicId: 'w3F7nR9cL5', coachId, displayName: 'Naya', age: 9, hobbies: ['Menggambar', 'Eksperimen sains'], dreamJob: 'Ilustrator buku', learningInterest: 'Hewan dan tumbuhan', funFact: 'Aku punya koleksi daun dengan bentuk unik.', icon: 'flower', theme: 'mint', projectMessage: 'Karya kreatif dari Workshop TIDIGO.', consentChecked: true, isActive: true, createdAt, updatedAt: createdAt },
    { id: 'profile-bimo', publicId: 'k8M2vT6qS4', coachId, displayName: 'Bimo', age: 11, hobbies: ['Coding', 'Sepak bola'], dreamJob: 'Pembuat game', learningInterest: 'Komputer dan matematika', funFact: 'Aku bisa menyelesaikan kubus rubik dalam dua menit.', icon: 'robot', theme: 'grape', projectMessage: 'Dibuat dengan seru di Workshop TIDIGO.', consentChecked: true, isActive: true, createdAt, updatedAt: createdAt },
  ];
}

function memoryStore() {
  if (!globalStore.tidigoProfiles) {
    globalStore.tidigoProfiles = new Map(exampleProfiles().map((profile) => [profile.id, profile]));
  }
  return globalStore.tidigoProfiles;
}

async function readStore(): Promise<ProfileStore> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return memoryStore();

  const result = await get(STORE_PATH, { access: 'private' });
  if (!result || result.statusCode !== 200 || !result.stream) {
    const seeded = new Map(exampleProfiles().map((profile) => [profile.id, profile]));
    await writeStore(seeded);
    return seeded;
  }

  const profiles = await new Response(result.stream).json() as Profile[];
  return new Map(profiles.map((profile) => [profile.id, profile]));
}

async function writeStore(store: ProfileStore) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    globalStore.tidigoProfiles = new Map(store);
    return;
  }

  await put(STORE_PATH, JSON.stringify([...store.values()]), {
    access: 'private',
    contentType: 'application/json',
    allowOverwrite: true,
  });
}

function clean(value: string, max: number) { return value.replace(/[<>]/g, '').trim().slice(0, max); }

export function validateProfile(input: ProfileInput): ProfileInput {
  const result = {
    ...input,
    displayName: clean(input.displayName, 40),
    hobbies: input.hobbies.map((item) => clean(item, 40)).filter(Boolean).slice(0, 3),
    dreamJob: clean(input.dreamJob, 100), learningInterest: clean(input.learningInterest, 120),
    funFact: clean(input.funFact, 160), projectMessage: clean(input.projectMessage, 160),
  };
  if (result.displayName.length < 2) throw new Error('Nama panggilan minimal 2 karakter.');
  if (result.age !== null && (result.age < 9 || result.age > 11)) throw new Error('Usia harus antara 9–11 tahun.');
  if (!allowedIcons.includes(result.icon)) throw new Error('Ikon tidak valid.');
  if (!allowedThemes.includes(result.theme)) throw new Error('Tema tidak valid.');
  if (!result.consentChecked) throw new Error('Konfirmasi keamanan data wajib dicentang.');
  return result;
}

function token() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  return Array.from(bytes, (byte) => chars[byte % chars.length]).join('');
}

export async function createProfile(coachId: string, unsafe: ProfileInput, publicId?: string) {
  const store = await readStore();
  const input = validateProfile(unsafe); const id = crypto.randomUUID();
  const now = new Date().toISOString(); const publicToken = publicId ?? token();
  store.set(id, { ...input, id, publicId: publicToken, coachId, isActive: true, createdAt: now, updatedAt: now });
  await writeStore(store);
  return { id, publicId: publicToken };
}

export async function seedExampleProfiles(_coachId: string) {
  await readStore();
}

export async function listProfiles(coachId: string) {
  const store = await readStore();
  return [...store.values()].filter((profile) => profile.coachId === coachId).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getProfile(id: string, coachId: string) {
  const store = await readStore();
  const profile = store.get(id); return profile?.coachId === coachId ? profile : null;
}

export async function getPublicProfile(publicId: string) {
  const store = await readStore();
  return [...store.values()].find((profile) => profile.publicId === publicId && profile.isActive) ?? null;
}

export async function updateProfile(id: string, coachId: string, unsafe: ProfileInput) {
  const store = await readStore();
  const current = store.get(id); if (!current || current.coachId !== coachId) return false;
  store.set(id, { ...current, ...validateProfile(unsafe), updatedAt: new Date().toISOString() });
  await writeStore(store);
  return true;
}

export async function setProfileStatus(id: string, coachId: string, active: boolean) {
  const store = await readStore();
  const current = store.get(id); if (!current || current.coachId !== coachId) return false;
  store.set(id, { ...current, isActive: active, updatedAt: new Date().toISOString() });
  await writeStore(store);
  return true;
}

export async function removeProfile(id: string, coachId: string) {
  const store = await readStore();
  const current = store.get(id); if (!current || current.coachId !== coachId) return false;
  store.delete(id);
  await writeStore(store);
  return true;
}

export async function resetPublicLink(id: string, coachId: string) {
  const store = await readStore();
  const current = store.get(id); if (!current || current.coachId !== coachId) return false;
  store.set(id, { ...current, publicId: token(), updatedAt: new Date().toISOString() });
  await writeStore(store);
  return true;
}

