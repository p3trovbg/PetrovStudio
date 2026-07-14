import apiClient from '../../api/apiClient';
import type { PaginatedResult } from '../../shared/types/pagination';
import type {
  ShortProjectOutput,
  ProjectDetailsOutput,
  CreateProjectInput,
  UpdateProjectInput,
} from './types';

interface GetProjectsParams {
  page?: number;
  pageSize?: number;
  categoryId?: number | null;
}

export async function getProjects(
  params: GetProjectsParams = {}
): Promise<PaginatedResult<ShortProjectOutput>> {
  const { page = 1, pageSize = 10, categoryId } = params;
  const queryParams: Record<string, string | number> = { page, pageSize };
  if (categoryId) queryParams.categoryId = categoryId;

  const response = await apiClient.get<PaginatedResult<ShortProjectOutput>>('/api/projects', {
    params: queryParams,
  });
  return response.data;
}

export async function getProjectById(id: number): Promise<ProjectDetailsOutput> {
  const response = await apiClient.get<ProjectDetailsOutput>(`/api/projects/${id}`);
  return response.data;
}

export async function createProject(input: CreateProjectInput): Promise<number> {
  const formData = new FormData();
  formData.append('Name', input.name);
  formData.append('Description', input.description);
  formData.append('CategoryId', input.categoryId.toString());
  formData.append('MainImage.File', input.mainImage);

  if (input.images) {
    input.images.forEach((file, index) => {
      formData.append(`Images[${index}].File`, file);
    });
  }

  const response = await apiClient.post<number>('/api/admin/projects', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}

export async function updateProject(id: number, input: UpdateProjectInput): Promise<void> {
  const formData = new FormData();
  formData.append('Name', input.name);
  formData.append('Description', input.description);
  formData.append('CategoryId', input.categoryId.toString());
  
  if (input.mainImage) {
    formData.append('MainImage', input.mainImage);
  }

  if (input.images) {
    input.images.forEach((file) => {
      formData.append('Images', file);
    });
  }

  if (input.removedImageIds) {
    input.removedImageIds.forEach((id) => {
      formData.append('RemovedImageIds', id);
    });
  }

  await apiClient.put(`/api/admin/projects/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

export async function deleteProject(id: number): Promise<void> {
  await apiClient.delete(`/api/admin/projects/${id}`);
}
