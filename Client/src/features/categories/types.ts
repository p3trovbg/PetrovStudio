export interface CategoryOutput {
  id: number;
  name: string;
  description: string | null;
}

export interface CreateCategoryInput {
  name: string;
  description?: string;
}

export interface UpdateCategoryInput {
  name: string;
  description?: string;
}
