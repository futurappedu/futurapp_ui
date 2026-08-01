import { useEffect } from 'react';

export const KOMMO_LEAD_ID_KEY = 'kommo_lead_id';

// Stashes the `kommo_lead_id` campaign query param into sessionStorage as
// soon as the app mounts, before the user has a chance to trigger a login
// redirect. Campaign links can land on more than one page (e.g. `/login` or
// `/scholarship_search`, where `promptLogin()` calls `loginWithRedirect()`
// directly), and Auth0's hosted-login redirect wipes the query string either
// way — so this must run at the app root rather than being tied to a single
// entry page.
export function useCaptureKommoLeadId() {
  useEffect(() => {
    const kommoLeadId = new URLSearchParams(window.location.search).get('kommo_lead_id');
    if (kommoLeadId) sessionStorage.setItem(KOMMO_LEAD_ID_KEY, kommoLeadId);
  }, []);
}
