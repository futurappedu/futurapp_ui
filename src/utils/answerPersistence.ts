export async function saveAnswersToBackend(
    email: string,
    testName: string,
    answers: Record<number, string>
  ) {
    await fetch('https://futurappapi-staging.up.railway.app/save-answers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, test_name: testName, answers }),
    });
  }
  
  export async function loadAnswersFromBackend(
    email: string,
    testName: string
  ): Promise<Record<number, string>> {
    const res = await fetch(
      `https://futurappapi-staging.up.railway.app/get-answers?email=${encodeURIComponent(email)}&test_name=${encodeURIComponent(testName)}`
    );
    if (res.ok) {
      const data = await res.json();
      return data.answers || {};
    }
    return {};
  }