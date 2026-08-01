import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';
import { KOMMO_LEAD_ID_KEY } from './useCaptureKommoLeadId';

// Syncs the authenticated user to a backend student record — and, when a
// campaign `kommo_lead_id` was captured, to the corresponding Kommo lead.
// Mounted once at the app root so it fires regardless of which route Auth0
// redirects back to (some users land on a protected route directly, without
// ever visiting `/login`, if they already have a valid session).
//
// POST /students is idempotent on the backend, so this fires on every
// successful auth state change without tracking "have I already
// registered" client-side — existing students get a cheap 200.
export function useRegisterStudent() {
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    if (!isAuthenticated || !user?.name) return;

    const register = async () => {
      try {
        const token = await getAccessTokenSilently();
        const kommoLeadId = sessionStorage.getItem(KOMMO_LEAD_ID_KEY);
        await axios.post(
          `${API_BASE_URL}/students`,
          { name: user.name, ...(kommoLeadId ? { kommo_lead_id: kommoLeadId } : {}) },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        // Fire-and-forget: this is a background sync and shouldn't block or
        // degrade the student's experience browsing scholarships.
        console.error('Failed to register student', err);
      }
    };

    register();
  }, [isAuthenticated, user?.name, getAccessTokenSilently]);
}
