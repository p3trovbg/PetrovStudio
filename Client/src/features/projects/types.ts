export interface ShortProjectOutput {
  id: number;
  name: string;
  mainImageUrl: string;
  isFeatured: boolean;
  createdOn: string;
}

export interface ProjectDetailsOutput {
  id: number;
  name: string;
  description: string;
  mainImageUrl: string;
  createdAtUtc: string;
  categoryId: number;
  categoryName: string;
  additionalImageUrls: string[];
}

export interface CreateProjectInput {
  name: string;
  description: string;
  categoryId: number;
  mainImage: File;
  images?: File[];
}

export interface UpdateProjectInput {
  name: string;
  description: string;
  categoryId: number;
  mainImage?: File | null;
  images?: File[];
}
