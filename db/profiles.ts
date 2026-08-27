import { del, get, list, put } from '@vercel/blob';

export type Profile = {
  id: string; publicId: string; coachId: string; displayName: string; age: number | null;
  hobbies: string[]; dreamJob: string; learningInterest: string; funFact: string;
  icon: string; theme: string; projectMessage: string; isActive: boolean;
  consentChecked: boolean; createdAt: string; updatedAt: string;
};

export type ProfileInput = Omit<Profile, 'id' | 'publicId' | 'coachId' | 'isActive' | 'createdAt' | 'updatedAt'>;

type ProfileStore = Map<string, Profile>;
const LEGACY_STORE_PATH = 'tidigo/profiles.json';
const PROFILE_PREFIX = 'tidigo/profiles/';
const MIGRATION_MARKER_PATH = 'tidigo/meta/profile-records-v1.json';
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

function usesBlob() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

function isSafeId(id: string) {
  return /^[A-Za-z0-9-]{1,64}$/.test(id);
}

function profilePath(id: string) {
  return `${PROFILE_PREFIX}${id}.json`;
}

async function readJsonBlob<T>(pathname: string): Promise<T | null> {
  const result = await get(pathname, { access: 'private' });
  if (!result || result.statusCode !== 200 || !result.stream) return null;
  return new Response(result.stream).json() as Promise<T>;
}

async function writeProfile(profile: Profile) {
  await put(profilePath(profile.id), JSON.stringify(profile), {
    access: 'private',
    contentType: 'application/json',
    allowOverwrite: true,
  });
}

async function listProfilePaths() {
  const paths: string[] = [];
  let cursor: string | undefined;

  do {
    const page = await list({ prefix: PROFILE_PREFIX, cursor, limit: 1000 });
    paths.push(...page.blobs.map((blob) => blob.pathname));
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);

  return paths.filter((pathname) => pathname.endsWith('.json'));
}

async function ensureBlobStore() {
  const migrated = await get(MIGRATION_MARKER_PATH, { access: 'private' });
  if (migrated?.statusCode === 200) return;

  const existingPaths = await listProfilePaths();
  const existingIds = new Set(existingPaths.map((pathname) => pathname.slice(PROFILE_PREFIX.length, -5)));
  const legacyProfiles = await readJsonBlob<Profile[]>(LEGACY_STORE_PATH);
  const profilesToMigrate = legacyProfiles?.length ? legacyProfiles : exampleProfiles();

  await Promise.all(
    profilesToMigrate
      .filter((profile) => isSafeId(profile.id) && !existingIds.has(profile.id))
      .map(writeProfile),
  );

  await put(MIGRATION_MARKER_PATH, JSON.stringify({ migratedAt: new Date().toISOString() }), {
    access: 'private',
    contentType: 'application/json',
    allowOverwrite: true,
  });
}

async function listAllProfiles() {
  if (!usesBlob()) return [...memoryStore().values()];
  await ensureBlobStore();
  const paths = await listProfilePaths();
  const profiles = await Promise.all(paths.map((pathname) => readJsonBlob<Profile>(pathname)));
  return profiles.filter((profile): profile is Profile => Boolean(profile));
}

async function readProfile(id: string) {
  if (!isSafeId(id)) return null;
  if (!usesBlob()) return memoryStore().get(id) ?? null;
  await ensureBlobStore();
  return readJsonBlob<Profile>(profilePath(id));
}

async function saveProfile(profile: Profile) {
  if (!usesBlob()) {
    memoryStore().set(profile.id, profile);
    return;
  }
  await ensureBlobStore();
  await writeProfile(profile);
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
  const input = validateProfile(unsafe); const id = crypto.randomUUID();
  const now = new Date().toISOString(); const publicToken = publicId ?? token();
  await saveProfile({ ...input, id, publicId: publicToken, coachId, isActive: true, createdAt: now, updatedAt: now });
  return { id, publicId: publicToken };
}

export async function seedExampleProfiles(_coachId: string) {
  if (usesBlob()) await ensureBlobStore();
  else memoryStore();
}

export async function listProfiles(coachId: string) {
  const profiles = await listAllProfiles();
  return profiles.filter((profile) => profile.coachId === coachId).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getProfile(id: string, coachId: string) {
  const profile = await readProfile(id);
  return profile?.coachId === coachId ? profile : null;
}

export async function getPublicProfile(publicId: string) {
  const profiles = await listAllProfiles();
  return profiles.find((profile) => profile.publicId === publicId && profile.isActive) ?? null;
}

export async function updateProfile(id: string, coachId: string, unsafe: ProfileInput) {
  const current = await readProfile(id); if (!current || current.coachId !== coachId) return false;
  await saveProfile({ ...current, ...validateProfile(unsafe), updatedAt: new Date().toISOString() });
  return true;
}

export async function setProfileStatus(id: string, coachId: string, active: boolean) {
  const current = await readProfile(id); if (!current || current.coachId !== coachId) return false;
  await saveProfile({ ...current, isActive: active, updatedAt: new Date().toISOString() });
  return true;
}

export async function removeProfile(id: string, coachId: string) {
  const current = await readProfile(id); if (!current || current.coachId !== coachId) return false;
  if (!usesBlob()) memoryStore().delete(id);
  else await del(profilePath(id));
  return true;
}

export async function resetPublicLink(id: string, coachId: string) {
  const current = await readProfile(id); if (!current || current.coachId !== coachId) return false;
  await saveProfile({ ...current, publicId: token(), updatedAt: new Date().toISOString() });
  return true;
}

