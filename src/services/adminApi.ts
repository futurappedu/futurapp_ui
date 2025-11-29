import { apiUrl } from '../config/api';


const getAuthHeaders = async (getAccessTokenSilently: any) => {
  const token = await getAccessTokenSilently();
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const adminApi = {
  // Users
  async getUsers(page: number = 1, pageSize: number = 20, search: string = '', getAccessTokenSilently: any) {
    const headers = await getAuthHeaders(getAccessTokenSilently);
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      search,
    });
    const res = await fetch(apiUrl(`v1/admin/users?${params}`), { headers });
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
  },

  async getUser(userId: number, getAccessTokenSilently: any) {
    const headers = await getAuthHeaders(getAccessTokenSilently);
    const res = await fetch(apiUrl(`v1/admin/users/${userId}`), { headers });
    if (!res.ok) throw new Error('Failed to fetch user');
    return res.json();
  },

  async getUserFavorites(userId: number, getAccessTokenSilently: any) {
    const headers = await getAuthHeaders(getAccessTokenSilently);
    const res = await fetch(apiUrl(`v1/admin/users/${userId}/favorites`), { headers });
    if (!res.ok) throw new Error('Failed to fetch user favorites');
    return res.json();
  },

  async getUserHistory(userId: number, getAccessTokenSilently: any) {
    const headers = await getAuthHeaders(getAccessTokenSilently);
    const res = await fetch(apiUrl(`v1/admin/users/${userId}/history`), { headers });
    if (!res.ok) throw new Error('Failed to fetch user history');
    return res.json();
  },

  // Universities
  async getUniversities(page: number = 1, pageSize: number = 20, search: string = '', getAccessTokenSilently: any) {
    const headers = await getAuthHeaders(getAccessTokenSilently);
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      search,
    });
    const res = await fetch(apiUrl(`v1/admin/universities?${params}`), { headers });
    if (!res.ok) throw new Error('Failed to fetch universities');
    return res.json();
  },

  async getUniversity(id: number, getAccessTokenSilently: any) {
    const headers = await getAuthHeaders(getAccessTokenSilently);
    const res = await fetch(apiUrl(`v1/admin/universities/${id}`), { headers });
    if (!res.ok) throw new Error('Failed to fetch university');
    return res.json();
  },

  async createUniversity(data: any, getAccessTokenSilently: any) {
    const headers = await getAuthHeaders(getAccessTokenSilently);
    const res = await fetch(apiUrl('v1/admin/universities'), {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create university');
    return res.json();
  },

  async updateUniversity(id: number, data: any, getAccessTokenSilently: any) {
    const headers = await getAuthHeaders(getAccessTokenSilently);
    const res = await fetch(apiUrl(`v1/admin/universities/${id}`), {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update university');
    return res.json();
  },

  async deleteUniversity(id: number, getAccessTokenSilently: any) {
    const headers = await getAuthHeaders(getAccessTokenSilently);
    const res = await fetch(apiUrl(`v1/admin/universities/${id}`), {
      method: 'DELETE',
      headers,
    });
    if (!res.ok) throw new Error('Failed to delete university');
    return res.json();
  },

  // Scholarships
  async getScholarships(page: number = 1, pageSize: number = 20, search: string = '', universityId: number | undefined, getAccessTokenSilently: any) {
    const headers = await getAuthHeaders(getAccessTokenSilently);
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      search,
    });
    if (universityId) params.append('university_id', universityId.toString());
    
    const res = await fetch(apiUrl(`v1/admin/scholarships?${params}`), { headers });
    if (!res.ok) throw new Error('Failed to fetch scholarships');
    return res.json();
  },

  async getScholarship(id: number, getAccessTokenSilently: any) {
    const headers = await getAuthHeaders(getAccessTokenSilently);
    const res = await fetch(apiUrl(`v1/admin/scholarships/${id}`), { headers });
    if (!res.ok) throw new Error('Failed to fetch scholarship');
    return res.json();
  },

  async createScholarship(data: any, getAccessTokenSilently: any) {
    const headers = await getAuthHeaders(getAccessTokenSilently);
    const res = await fetch(apiUrl('v1/admin/scholarships'), {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create scholarship');
    return res.json();
  },

  async updateScholarship(id: number, data: any, getAccessTokenSilently: any) {
    const headers = await getAuthHeaders(getAccessTokenSilently);
    const res = await fetch(apiUrl(`v1/admin/scholarships/${id}`), {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update scholarship');
    return res.json();
  },

  async deleteScholarship(id: number, getAccessTokenSilently: any) {
    const headers = await getAuthHeaders(getAccessTokenSilently);
    const res = await fetch(apiUrl(`v1/admin/scholarships/${id}`), {
      method: 'DELETE',
      headers,
    });
    if (!res.ok) throw new Error('Failed to delete scholarship');
    return res.json();
  },
};
