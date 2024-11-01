export interface ApiResponse<T> {
  data: T | null;
  meta: {
    code: number;
    message: string;
    error?: string;
  };
}
