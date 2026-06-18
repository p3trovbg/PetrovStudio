import apiClient from '../../api/apiClient';
import type { CategoryOutput, CreateCategoryInput, UpdateCategoryInput } from './types';

export async function getAllCategories(): Promise<CategoryOutput[]> {
  const response = await apiClient.get<CategoryOutput[]>('/api/categories');
  return response.data;
}

export async function getCategoryById(id: number): Promise<CategoryOutput> {
  const response = await apiClient.get<CategoryOutput>(`/api/categories/${id}`);
  return response.data;
}

export async function createCategory(input: CreateCategoryInput): Promise<number> {
  const response = await apiClient.post<number>('/api/admin/categories', input);
  return response.data;
}

export async function updateCategory(id: number, input: UpdateCategoryInput): Promise<void> {
  await apiClient.put(`/api/admin/categories/${id}`, input);
}

export async function deleteCategory(id: number): Promise<void> {
  await apiClient.delete(`/api/admin/categories/${id}`);
}
