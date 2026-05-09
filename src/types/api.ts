export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export interface AuthResponse<T> extends ApiResponse<T> {
  token: string;
}