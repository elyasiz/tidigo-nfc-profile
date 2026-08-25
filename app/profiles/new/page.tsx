import { AppShell } from '../../components/AppShell';
import { ProfileForm } from '../../components/ProfileForm';

export const dynamic = 'force-dynamic';
export default function NewProfilePage() {
  return <AppShell><ProfileForm /></AppShell>;
}

