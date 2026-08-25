'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createProfile, removeProfile, resetPublicLink, setProfileStatus, updateProfile, type ProfileInput } from '../db/profiles';

const COACH_ID = 'tidigo-public-workshop';

function profileFromForm(formData: FormData): ProfileInput {
  const ageText = String(formData.get('age') ?? '');
  return {
    displayName: String(formData.get('displayName') ?? ''),
    age: ageText ? Number(ageText) : null,
    hobbies: formData.getAll('hobbies').map(String),
    dreamJob: String(formData.get('dreamJob') ?? ''),
    learningInterest: String(formData.get('learningInterest') ?? ''),
    funFact: String(formData.get('funFact') ?? ''),
    icon: String(formData.get('icon') ?? 'rocket'),
    theme: String(formData.get('theme') ?? 'sky'),
    projectMessage: String(formData.get('projectMessage') ?? 'NFC tag ini dibuat di Workshop TIDIGO.'),
    consentChecked: formData.get('consentChecked') === 'on',
  };
}

export async function createProfileAction(formData: FormData) {
  const result = await createProfile(COACH_ID, profileFromForm(formData));
  revalidatePath('/dashboard');
  redirect(`/dashboard?created=${result.publicId}`);
}

export async function updateProfileAction(formData: FormData) {
  const id = String(formData.get('id') ?? '');
  await updateProfile(id, COACH_ID, profileFromForm(formData));
  revalidatePath('/dashboard');
  revalidatePath(`/profiles/${id}/edit`);
  redirect('/dashboard?updated=1');
}

export async function statusProfileAction(formData: FormData) {
  const id = String(formData.get('id') ?? '');
  await setProfileStatus(id, COACH_ID, formData.get('active') === 'true');
  revalidatePath('/dashboard');
}

export async function deleteProfileAction(formData: FormData) {
  await removeProfile(String(formData.get('id') ?? ''), COACH_ID);
  revalidatePath('/dashboard');
}

export async function resetLinkAction(formData: FormData) {
  await resetPublicLink(String(formData.get('id') ?? ''), COACH_ID);
  revalidatePath('/dashboard');
}

