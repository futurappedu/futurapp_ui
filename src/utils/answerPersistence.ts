import { apiUrl } from '@/config/api';

export async function saveAnswersToBackend(
    email: string,
    testName: string,
    answers: Record<number, string>,
    token?: string
  ) {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    await fetch(apiUrl('save-answers'), {
      method: 'POST',
      headers,
      body: JSON.stringify({ email, test_name: testName, answers }),
    });
  }
  
  export async function loadAnswersFromBackend(
    email: string,
    testName: string
  ): Promise<Record<number, string>> {
    const res = await fetch(
      `${apiUrl('get-answers')}?email=${encodeURIComponent(email)}&test_name=${encodeURIComponent(testName)}`
    );
    if (res.ok) {
      const data = await res.json();
      return data.answers || {};
    }
    return {};
  }