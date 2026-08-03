import { useEffect } from 'react';

// Internal storage key / backend field name — kept as `kommo_lead_id` since
// that's what POST /students expects in the body (routes/students.py).
export const KOMMO_LEAD_ID_KEY = 'kommo_lead_id';

// The actual campaign query param is `lead_id`, not `kommo_lead_id`.
const LEAD_ID_URL_PARAM = 'lead_id';

// Stashes the campaign `lead_id` query param into sessionStorage as soon as
// the app mounts, before the user has a chance to trigger a login redirect.
// Campaign links can land on more than one page (e.g. `/login` or
// `/scholarship_search`, where `promptLogin()` calls `loginWithRedirect()`
// directly), and Auth0's hosted-login redirect wipes the query string either
// way — so this must run at the app root rather than being tied to a single
// entry page.
export function useCaptureKommoLeadId() {
  useEffect(() => {
    const leadId = new URLSearchParams(window.location.search).get(LEAD_ID_URL_PARAM);
    if (leadId) sessionStorage.setItem(KOMMO_LEAD_ID_KEY, leadId);
  }, []);
}
