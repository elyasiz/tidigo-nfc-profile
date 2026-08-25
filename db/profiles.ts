import { env } from 'cloudflare:workers';

export type Profile = {
  id: string; publicId: string; coachId: string; displayName: string; age: number | null;
  hobbies: string[]; dreamJob: string; learningInterest: string; funFact: string;
  icon: string; theme: string; projectMessage: string; isActive: boolean;
  consentChecked: boolean; createdAt: string; updatedAt: string;
};

export type ProfileInput = Omit<Profile, 'id' | 'publicId' | 'coachId' | 'isActive' | 'createdAt' | 'updatedAt'>;
const allowedIcons = ['rocket', 'robot', 'star', 'flower', 'dino'];
const allowedThemes = ['sky', 'sunny', 'mint', 'grape'];

function db() {
  if (!env.DB) throw new Error('Database TIDIGO belum tersedia.');
  return env.DB;
}

export async function ensureProfileSchema() {
  const database = db();
  await database.batch([
    database.prepare(`CREATE TABLE IF NOT EXISTS profiles (
      id TEXT PRIMARY KEY, public_id TEXT NOT NULL UNIQUE, coach_id TEXT NOT NULL,
      display_name TEXT NOT NULL, age INTEGER, hobbies TEXT NOT NULL,
      dream_job TEXT NOT NULL, learning_interest TEXT NOT NULL, fun_fact TEXT NOT NULL,
      icon TEXT NOT NULL, theme TEXT NOT NULL, project_message TEXT NOT NULL,
      is_active INTEGER NOT NULL DEFAULT 1, consent_checked INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL, updated_at TEXT NOT NULL
    )`),
    database.prepare(`CREATE TABLE IF NOT EXISTS profile_events (
      id TEXT PRIMARY KEY, profile_id TEXT NOT NULL, event_type TEXT NOT NULL,
      actor_id TEXT NOT NULL, created_at TEXT NOT NULL
    )`),
    database.prepare('CREATE INDEX IF NOT EXISTS idx_profiles_coach_updated ON profiles(coach_id, updated_at)'),
    database.prepare('CREATE INDEX IF NOT EXISTS idx_profile_events_profile ON profile_events(profile_id, created_at)'),
  ]);
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

function mapRow(row: Record<string, unknown>): Profile {
  return {
    id: String(row.id), publicId: String(row.public_id), coachId: String(row.coach_id),
    displayName: String(row.display_name), age: row.age === null ? null : Number(row.age),
    hobbies: JSON.parse(String(row.hobbies)), dreamJob: String(row.dream_job),
    learningInterest: String(row.learning_interest), funFact: String(row.fun_fact),
    icon: String(row.icon), theme: String(row.theme), projectMessage: String(row.project_message),
    isActive: Boolean(row.is_active), consentChecked: Boolean(row.consent_checked),
    createdAt: String(row.created_at), updatedAt: String(row.updated_at),
  };
}

export async function createProfile(coachId: string, unsafe: ProfileInput, publicId?: string) {
  await ensureProfileSchema();
  const input = validateProfile(unsafe); const database = db();
  const id = crypto.randomUUID(); const now = new Date().toISOString(); const publicToken = publicId ?? token();
  await database.batch([
    database.prepare(`INSERT INTO profiles (id, public_id, coach_id, display_name, age, hobbies, dream_job, learning_interest, fun_fact, icon, theme, project_message, is_active, consent_checked, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 1, ?, ?)`).bind(id, publicToken, coachId, input.displayName, input.age, JSON.stringify(input.hobbies), input.dreamJob, input.learningInterest, input.funFact, input.icon, input.theme, input.projectMessage, now, now),
    database.prepare('INSERT INTO profile_events (id, profile_id, event_type, actor_id, created_at) VALUES (?, ?, ?, ?, ?)').bind(crypto.randomUUID(), id, 'created', coachId, now),
  ]);
  return { id, publicId: publicToken };
}

export async function seedExampleProfiles(coachId: string) {
  await ensureProfileSchema();
  const count = await db().prepare('SELECT COUNT(*) AS total FROM profiles WHERE coach_id = ?').bind(coachId).first<{ total: number }>();
  if (Number(count?.total ?? 0) > 0) return;
  const examples: Array<[ProfileInput, string]> = [
    [{ displayName: 'Ardi', age: 10, hobbies: ['Menggambar', 'Sepak bola', 'Membuat robot'], dreamJob: 'Insinyur robot', learningInterest: 'Teknologi dan luar angkasa', funFact: 'Aku bisa membuat pesawat kertas yang terbang jauh.', icon: 'rocket', theme: 'sky', projectMessage: 'NFC tag ini dibuat di Workshop TIDIGO.', consentChecked: true }, 'p7K4mQ2xN8'],
    [{ displayName: 'Naya', age: 9, hobbies: ['Menggambar', 'Eksperimen sains'], dreamJob: 'Ilustrator buku', learningInterest: 'Hewan dan tumbuhan', funFact: 'Aku punya koleksi daun dengan bentuk unik.', icon: 'flower', theme: 'mint', projectMessage: 'Karya kreatif dari Workshop TIDIGO.', consentChecked: true }, 'w3F7nR9cL5'],
    [{ displayName: 'Bimo', age: 11, hobbies: ['Coding', 'Sepak bola'], dreamJob: 'Pembuat game', learningInterest: 'Komputer dan matematika', funFact: 'Aku bisa menyelesaikan kubus rubik dalam dua menit.', icon: 'robot', theme: 'grape', projectMessage: 'Dibuat dengan seru di Workshop TIDIGO.', consentChecked: true }, 'k8M2vT6qS4'],
  ];
  for (const [profile, publicId] of examples) await createProfile(coachId, profile, publicId);
}

export async function listProfiles(coachId: string) {
  await ensureProfileSchema();
  const result = await db().prepare('SELECT * FROM profiles WHERE coach_id = ? ORDER BY updated_at DESC').bind(coachId).all<Record<string, unknown>>();
  return (result.results ?? []).map(mapRow);
}

export async function getProfile(id: string, coachId: string) {
  await ensureProfileSchema();
  const row = await db().prepare('SELECT * FROM profiles WHERE id = ? AND coach_id = ?').bind(id, coachId).first<Record<string, unknown>>();
  return row ? mapRow(row) : null;
}

export async function getPublicProfile(publicId: string) {
  await ensureProfileSchema();
  const row = await db().prepare('SELECT * FROM profiles WHERE public_id = ? AND is_active = 1').bind(publicId).first<Record<string, unknown>>();
  return row ? mapRow(row) : null;
}

export async function updateProfile(id: string, coachId: string, unsafe: ProfileInput) {
  const input = validateProfile(unsafe); const now = new Date().toISOString(); const database = db();
  await database.batch([
    database.prepare('UPDATE profiles SET display_name = ?, age = ?, hobbies = ?, dream_job = ?, learning_interest = ?, fun_fact = ?, icon = ?, theme = ?, project_message = ?, consent_checked = 1, updated_at = ? WHERE id = ? AND coach_id = ?').bind(input.displayName, input.age, JSON.stringify(input.hobbies), input.dreamJob, input.learningInterest, input.funFact, input.icon, input.theme, input.projectMessage, now, id, coachId),
    database.prepare('INSERT INTO profile_events (id, profile_id, event_type, actor_id, created_at) VALUES (?, ?, ?, ?, ?)').bind(crypto.randomUUID(), id, 'updated', coachId, now),
  ]);
}

export async function setProfileStatus(id: string, coachId: string, active: boolean) {
  const now = new Date().toISOString(); const database = db();
  await database.batch([
    database.prepare('UPDATE profiles SET is_active = ?, updated_at = ? WHERE id = ? AND coach_id = ?').bind(active ? 1 : 0, now, id, coachId),
    database.prepare('INSERT INTO profile_events (id, profile_id, event_type, actor_id, created_at) VALUES (?, ?, ?, ?, ?)').bind(crypto.randomUUID(), id, active ? 'enabled' : 'disabled', coachId, now),
  ]);
}

export async function removeProfile(id: string, coachId: string) {
  await db().prepare('DELETE FROM profiles WHERE id = ? AND coach_id = ?').bind(id, coachId).run();
}

export async function resetPublicLink(id: string, coachId: string) {
  const now = new Date().toISOString(); const newToken = token(); const database = db();
  await database.batch([
    database.prepare('UPDATE profiles SET public_id = ?, updated_at = ? WHERE id = ? AND coach_id = ?').bind(newToken, now, id, coachId),
    database.prepare('INSERT INTO profile_events (id, profile_id, event_type, actor_id, created_at) VALUES (?, ?, ?, ?, ?)').bind(crypto.randomUUID(), id, 'link_reset', coachId, now),
  ]);
}

