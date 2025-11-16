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
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      ...(search && { search }),
    });
    const response = await fetch(`${apiUrl(`v1/admin/users`)}?${params}`, {
      headers: await getAuthHeaders(getAccessTokenSilently),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', response.status, errorText);
      const error = new Error(`Failed to fetch users: ${response.status} ${errorText}`);
      (error as any).status = response.status;
      throw error;
    }
    return response.json();
  },

  async getUser(userId: number, getAccessTokenSilently: any) {
    const response = await fetch(apiUrl(`v1/admin/users/${userId}`), {
      headers: await getAuthHeaders(getAccessTokenSilently),
    });
    if (!response.ok) throw new Error('Failed to fetch user');
    return response.json();
  },

  async getUserFavorites(userId: number, getAccessTokenSilently: any) {
    const response = await fetch(apiUrl(`v1/admin/users/${userId}/favorites`), {
      headers: await getAuthHeaders(getAccessTokenSilently),
    });
    if (!response.ok) throw new Error('Failed to fetch user favorites');
    return response.json();
  },

  // Universities
  async getUniversities(page: number = 1, pageSize: number = 20, search: string = '', getAccessTokenSilently: any) {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      ...(search && { search }),
    });
    const response = await fetch(`${apiUrl(`v1/admin/universities`)}?${params}`, {
      headers: await getAuthHeaders(getAccessTokenSilently),
    });
    if (!response.ok) throw new Error('Failed to fetch universities');
    return response.json();
  },

  async getUniversity(universityId: number, getAccessTokenSilently: any) {
    const response = await fetch(apiUrl(`v1/admin/universities/${universityId}`), {
      headers: await getAuthHeaders(getAccessTokenSilently),
    });
    if (!response.ok) throw new Error('Failed to fetch university');
    return response.json();
  },

  async createUniversity(data: any, getAccessTokenSilently: any) {
    const response = await fetch(apiUrl('v1/admin/universities'), {
      method: 'POST',
      headers: await getAuthHeaders(getAccessTokenSilently),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create university');
    }
    return response.json();
  },

  async updateUniversity(universityId: number, data: any, getAccessTokenSilently: any) {
    const response = await fetch(apiUrl(`v1/admin/universities/${universityId}`), {
      method: 'PUT',
      headers: await getAuthHeaders(getAccessTokenSilently),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update university');
    }
    return response.json();
  },

  async deleteUniversity(universityId: number, getAccessTokenSilently: any) {
    const response = await fetch(apiUrl(`v1/admin/universities/${universityId}`), {
      method: 'DELETE',
      headers: await getAuthHeaders(getAccessTokenSilently),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete university');
    }
    return response.json();
  },

  // Scholarships
  async getScholarships(page: number = 1, pageSize: number = 20, search: string = '', universityId?: number, getAccessTokenSilently: any = null) {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      ...(search && { search }),
      ...(universityId && { university_id: universityId.toString() }),
    });
    const response = await fetch(`${apiUrl(`v1/admin/scholarships`)}?${params}`, {
      headers: await getAuthHeaders(getAccessTokenSilently),
    });
    if (!response.ok) throw new Error('Failed to fetch scholarships');
    return response.json();
  },

  async getScholarship(scholarshipId: number, getAccessTokenSilently: any) {
    const response = await fetch(apiUrl(`v1/admin/scholarships/${scholarshipId}`), {
      headers: await getAuthHeaders(getAccessTokenSilently),
    });
    if (!response.ok) throw new Error('Failed to fetch scholarship');
    return response.json();
  },

  async createScholarship(data: any, getAccessTokenSilently: any) {
    const response = await fetch(apiUrl('v1/admin/scholarships'), {
      method: 'POST',
      headers: await getAuthHeaders(getAccessTokenSilently),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create scholarship');
    }
    return response.json();
  },

  async updateScholarship(scholarshipId: number, data: any, getAccessTokenSilently: any) {
    const response = await fetch(apiUrl(`v1/admin/scholarships/${scholarshipId}`), {
      method: 'PUT',
      headers: await getAuthHeaders(getAccessTokenSilently),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update scholarship');
    }
    return response.json();
  },

  async deleteScholarship(scholarshipId: number, getAccessTokenSilently: any) {
    const response = await fetch(apiUrl(`v1/admin/scholarships/${scholarshipId}`), {
      method: 'DELETE',
      headers: await getAuthHeaders(getAccessTokenSilently),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete scholarship');
    }
    return response.json();
  },
};

