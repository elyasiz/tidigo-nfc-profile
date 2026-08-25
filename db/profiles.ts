export type Profile = {
  id: string; publicId: string; coachId: string; displayName: string; age: number | null;
  hobbies: string[]; dreamJob: string; learningInterest: string; funFact: string;
  icon: string; theme: string; projectMessage: string; isActive: boolean;
  consentChecked: boolean; createdAt: string; updatedAt: string;
};

export type ProfileInput = Omit<Profile, 'id' | 'publicId' | 'coachId' | 'isActive' | 'createdAt' | 'updatedAt'>;

type ProfileStore = Map<string, Profile>;
const globalStore = globalThis as typeof globalThis & { tidigoProfiles?: ProfileStore };
const profiles = globalStore.tidigoProfiles ?? new Map<string, Profile>();
globalStore.tidigoProfiles = profiles;

const allowedIcons = ['rocket', 'robot', 'star', 'flower', 'dino'];
const allowedThemes = ['sky', 'sunny', 'mint', 'grape'];

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
  const input = validateProfile(unsafe); const id = crypto.randomUUID();
  const now = new Date().toISOString(); const publicToken = publicId ?? token();
  profiles.set(id, { ...input, id, publicId: publicToken, coachId, isActive: true, createdAt: now, updatedAt: now });
  return { id, publicId: publicToken };
}

export async function seedExampleProfiles(coachId: string) {
  if ([...profiles.values()].some((profile) => profile.coachId === coachId)) return;
  const examples: Array<[ProfileInput, string]> = [
    [{ displayName: 'Ardi', age: 10, hobbies: ['Menggambar', 'Sepak bola', 'Membuat robot'], dreamJob: 'Insinyur robot', learningInterest: 'Teknologi dan luar angkasa', funFact: 'Aku bisa membuat pesawat kertas yang terbang jauh.', icon: 'rocket', theme: 'sky', projectMessage: 'NFC tag ini dibuat di Workshop TIDIGO.', consentChecked: true }, 'p7K4mQ2xN8'],
    [{ displayName: 'Naya', age: 9, hobbies: ['Menggambar', 'Eksperimen sains'], dreamJob: 'Ilustrator buku', learningInterest: 'Hewan dan tumbuhan', funFact: 'Aku punya koleksi daun dengan bentuk unik.', icon: 'flower', theme: 'mint', projectMessage: 'Karya kreatif dari Workshop TIDIGO.', consentChecked: true }, 'w3F7nR9cL5'],
    [{ displayName: 'Bimo', age: 11, hobbies: ['Coding', 'Sepak bola'], dreamJob: 'Pembuat game', learningInterest: 'Komputer dan matematika', funFact: 'Aku bisa menyelesaikan kubus rubik dalam dua menit.', icon: 'robot', theme: 'grape', projectMessage: 'Dibuat dengan seru di Workshop TIDIGO.', consentChecked: true }, 'k8M2vT6qS4'],
  ];
  for (const [profile, publicId] of examples) await createProfile(coachId, profile, publicId);
}

export async function listProfiles(coachId: string) {
  await seedExampleProfiles(coachId);
  return [...profiles.values()].filter((profile) => profile.coachId === coachId).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getProfile(id: string, coachId: string) {
  const profile = profiles.get(id); return profile?.coachId === coachId ? profile : null;
}

export async function getPublicProfile(publicId: string) {
  await seedExampleProfiles('tidigo-public-workshop');
  return [...profiles.values()].find((profile) => profile.publicId === publicId && profile.isActive) ?? null;
}

export async function updateProfile(id: string, coachId: string, unsafe: ProfileInput) {
  const current = await getProfile(id, coachId); if (!current) return;
  profiles.set(id, { ...current, ...validateProfile(unsafe), updatedAt: new Date().toISOString() });
}

export async function setProfileStatus(id: string, coachId: string, active: boolean) {
  const current = await getProfile(id, coachId); if (!current) return;
  profiles.set(id, { ...current, isActive: active, updatedAt: new Date().toISOString() });
}

export async function removeProfile(id: string, coachId: string) {
  const current = await getProfile(id, coachId); if (current) profiles.delete(id);
}

export async function resetPublicLink(id: string, coachId: string) {
  const current = await getProfile(id, coachId); if (!current) return;
  profiles.set(id, { ...current, publicId: token(), updatedAt: new Date().toISOString() });
}

