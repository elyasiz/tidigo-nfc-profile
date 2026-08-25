import { notFound } from 'next/navigation';
import { AppShell } from '../../../components/AppShell';
import { ProfileForm } from '../../../components/ProfileForm';
import { getProfile } from '../../../../db/profiles';

export const dynamic = 'force-dynamic';
const COACH_ID = 'tidigo-public-workshop';
export default async function EditProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profile = await getProfile(id, COACH_ID);
  if (!profile) notFound();
  return <AppShell><ProfileForm profile={profile} /></AppShell>;
}

