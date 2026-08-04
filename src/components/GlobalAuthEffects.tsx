import { useCaptureKommoLeadId } from '@/hooks/useCaptureKommoLeadId';
import { useRegisterStudent } from '@/hooks/useRegisterStudent';

// Runs app-wide, auth-related side effects that need to fire regardless of
// route: stashing a campaign `kommo_lead_id` before any login redirect, and
// syncing the authenticated user to a backend student record afterward.
// Rendered inside Auth0Provider so useAuth0() is available, and as a sibling
// of <Routes> so it isn't tied to any single page.
export default function GlobalAuthEffects() {
  useCaptureKommoLeadId();
  useRegisterStudent();
  return null;
}
