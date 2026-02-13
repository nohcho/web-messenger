import type { User } from '@/types';

const API_URL = 'https://jsonplaceholder.typicode.com/users';

export async function fetchUsers(limit = 5): Promise<User[]> {
  const response = await fetch(`${API_URL}?_limit=${limit}`);
  if (!response.ok) throw new Error('Failed to fetch users');
  return response.json();
}
