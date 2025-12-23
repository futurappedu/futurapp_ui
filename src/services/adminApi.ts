import { apiUrl } from '../config/api';

// Types for Import Jobs
export interface ImportJobStatus {
  id: string;
  target_table: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  total_rows: number;
  valid_rows: number;
  invalid_rows: number;
  error_message: string | null;
  has_rejections: boolean;
  created_at: string | null;
  started_at: string | null;
  completed_at: string | null;
}

export interface ImportUploadResponse {
  job_id: string;
  message: string;
}

const getAuthHeaders = async (getAccessTokenSilently: any) => {
  const token = await getAccessTokenSilently();
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

const getAuthHeadersMultipart = async (getAccessTokenSilently: any) => {
  const token = await getAccessTokenSilently();
  return {
    'Authorization': `Bearer ${token}`,
    // Note: Don't set Content-Type for multipart/form-data, browser will set it with boundary
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

  async getAllUniversities(getAccessTokenSilently: any) {
    const headers = await getAuthHeaders(getAccessTokenSilently);
    const res = await fetch(apiUrl('v1/admin/universities/all'), { headers });
    if (!res.ok) throw new Error('Failed to fetch universities');
    return res.json();
  },

  async getCountries(getAccessTokenSilently: any) {
    const headers = await getAuthHeaders(getAccessTokenSilently);
    const res = await fetch(apiUrl('v1/admin/universities/countries'), { headers });
    if (!res.ok) throw new Error('Failed to fetch countries');
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

  // Programs
  async getPrograms(page: number = 1, pageSize: number = 20, search: string = '', universityId: number | undefined, getAccessTokenSilently: any) {
    const headers = await getAuthHeaders(getAccessTokenSilently);
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      search,
    });
    if (universityId) params.append('university_id', universityId.toString());
    
    const res = await fetch(apiUrl(`v1/admin/programs?${params}`), { headers });
    if (!res.ok) throw new Error('Failed to fetch programs');
    return res.json();
  },

  async getProgram(id: number, getAccessTokenSilently: any) {
    const headers = await getAuthHeaders(getAccessTokenSilently);
    const res = await fetch(apiUrl(`v1/admin/programs/${id}`), { headers });
    if (!res.ok) throw new Error('Failed to fetch program');
    return res.json();
  },

  async updateProgram(id: number, data: any, getAccessTokenSilently: any) {
    const headers = await getAuthHeaders(getAccessTokenSilently);
    const res = await fetch(apiUrl(`v1/admin/programs/${id}`), {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update program');
    return res.json();
  },

  async deleteProgram(id: number, getAccessTokenSilently: any) {
    const headers = await getAuthHeaders(getAccessTokenSilently);
    const res = await fetch(apiUrl(`v1/admin/programs/${id}`), {
      method: 'DELETE',
      headers,
    });
    if (!res.ok) throw new Error('Failed to delete program');
    return res.json();
  },

  async getProgramTypes(getAccessTokenSilently: any) {
    const headers = await getAuthHeaders(getAccessTokenSilently);
    const res = await fetch(apiUrl('v1/admin/program-types'), { headers });
    if (!res.ok) throw new Error('Failed to fetch program types');
    return res.json();
  },

  // ============================================
  // Bulk CSV Import
  // ============================================

  /**
   * Upload a CSV file for bulk import.
   * Creates an import job and returns the job ID for polling.
   */
  async uploadImport(
    file: File,
    targetTable: 'scholarships' | 'programs',
    columnMapping: Record<string, string>,
    getAccessTokenSilently: any
  ): Promise<ImportUploadResponse> {
    const headers = await getAuthHeadersMultipart(getAccessTokenSilently);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('target_table', targetTable);
    formData.append('column_mapping', JSON.stringify(columnMapping));
    
    const res = await fetch(apiUrl('v1/admin/import/upload'), {
      method: 'POST',
      headers,
      body: formData,
    });
    
    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(error.error || 'Failed to upload import file');
    }
    
    return res.json();
  },

  /**
   * Get the status of an import job.
   */
  async getImportJobStatus(jobId: string, getAccessTokenSilently: any): Promise<ImportJobStatus> {
    const headers = await getAuthHeaders(getAccessTokenSilently);
    const res = await fetch(apiUrl(`v1/admin/import/jobs/${jobId}`), { headers });
    
    if (!res.ok) throw new Error('Failed to fetch import job status');
    return res.json();
  },

  /**
   * List all import jobs with pagination.
   */
  async getImportJobs(
    page: number = 1,
    pageSize: number = 20,
    status?: string,
    getAccessTokenSilently?: any
  ) {
    const headers = await getAuthHeaders(getAccessTokenSilently);
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    });
    if (status) params.append('status', status);
    
    const res = await fetch(apiUrl(`v1/admin/import/jobs?${params}`), { headers });
    if (!res.ok) throw new Error('Failed to fetch import jobs');
    return res.json();
  },

  /**
   * Download the rejection CSV for a completed import job.
   */
  async downloadRejections(jobId: string, getAccessTokenSilently: any): Promise<void> {
    const token = await getAccessTokenSilently();
    
    const res = await fetch(apiUrl(`v1/admin/import/jobs/${jobId}/rejections`), {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!res.ok) throw new Error('Failed to download rejections');
    
    // Trigger file download
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rejections_${jobId}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  },
};
