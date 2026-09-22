export interface Sport {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSportDto {
  name: string;
  description?: string;
}

export interface UpdateSportDto {
  name?: string;
  description?: string;
}