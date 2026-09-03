import { test, expect } from '@playwright/test';

test.describe('Conduit API - Public Health Check', () => {
  test('should connect to the public Conduit API and get tags', async ({ request }) => {
    const response = await request.get('tags');

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const data = await response.json();
    console.log('Tags recebidas da API pública:', data.tags);
    expect(Array.isArray(data.tags)).toBeTruthy();
  });
});